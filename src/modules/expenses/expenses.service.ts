import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';
import { CreerDepenseDto } from './dto/creer-depense.dto';
import { ModifierDepenseDto } from './dto/modifier-depense.dto';
import { PLAN_LIMITS, verifierLimite } from '../../common/utils/plan-limits';
import { CategorieDepense } from '@prisma/client';

const PRESIGNED_EXPIRY_SECONDS = 300; // 5 min
const MAX_RECEIPT_SIZE = 10 * 1024 * 1024; // 10 MB raw upload cap

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(
    private prisma: PrismaService,
    private logs: LogsService,
    private config: ConfigService,
  ) {
    const accountId = this.config.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.config.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('R2_SECRET_ACCESS_KEY');
    this.bucket = this.config.get<string>('R2_BUCKET_NAME') ?? 'sayerli-expenses';
    this.publicUrl = this.config.get<string>('R2_PUBLIC_URL') ?? '';

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
    });
  }

  // ── Upload URL ────────────────────────────────────────────────────────────────

  async obtenirUrlUpload(entrepriseId: string) {
    const entreprise = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: { plan: true, storageUsedBytes: true },
    });
    const limits = PLAN_LIMITS[entreprise?.plan ?? 'STARTER'];

    // Monthly receipt count check
    const now = new Date();
    const debut = new Date(now.getFullYear(), now.getMonth(), 1);
    const fin = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const countMois = await this.prisma.depense.count({
      where: { entrepriseId, receiptKey: { not: null }, createdAt: { gte: debut, lte: fin } },
    });
    verifierLimite('depenses', countMois, limits.depensesParMois);

    // Storage cap check
    if (
      limits.depensesStorageBytes !== -1 &&
      (entreprise?.storageUsedBytes ?? 0) >= limits.depensesStorageBytes
    ) {
      verifierLimite('depenses', 1, 0); // triggers 402
    }

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const key = `expenses/${entrepriseId}/${year}/${month}/${uuidv4()}.webp`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: PRESIGNED_EXPIRY_SECONDS });
    return { url, key };
  }

  // ── Validate magic bytes of an uploaded R2 object ────────────────────────────

  private async validerMagicBytes(key: string): Promise<void> {
    let bodyStream: any;
    try {
      const res = await this.s3.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key, Range: 'bytes=0-11' }),
      );
      bodyStream = res.Body;
    } catch {
      throw new BadRequestException('Fichier introuvable dans le stockage.');
    }

    const chunks: Buffer[] = [];
    for await (const chunk of bodyStream as AsyncIterable<Uint8Array>) {
      chunks.push(Buffer.from(chunk));
    }
    const header = Buffer.concat(chunks).subarray(0, 12);

    const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    const isPng =
      header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
    // WebP: RIFF????WEBP
    const isWebp =
      header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46 &&
      header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50;

    if (!isJpeg && !isPng && !isWebp) {
      await this.supprimerObjetR2(key);
      throw new BadRequestException('Format de fichier non autorisé. JPG, PNG ou WebP uniquement.');
    }
  }

  private async supprimerObjetR2(key: string) {
    try {
      await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    } catch (e) {
      this.logger.warn(`Impossible de supprimer R2 object: ${key}`, e);
    }
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────────

  async creer(dto: CreerDepenseDto, entrepriseId: string, userId: string, userNom: string) {
    if (dto.receiptKey) {
      await this.validerMagicBytes(dto.receiptKey);
    }

    const depense = await this.prisma.depense.create({
      data: {
        entrepriseId,
        userId,
        montant: dto.montant,
        devise: dto.devise ?? 'MAD',
        categorie: dto.categorie,
        fournisseur: dto.fournisseur,
        description: dto.description,
        date: new Date(dto.date),
        receiptKey: dto.receiptKey,
        receiptUrl: dto.receiptKey ? `${this.publicUrl}/${dto.receiptKey}` : null,
        receiptSizeBytes: dto.receiptSizeBytes,
      },
    });

    if (dto.receiptSizeBytes && dto.receiptSizeBytes > 0) {
      await this.prisma.entreprise.update({
        where: { id: entrepriseId },
        data: { storageUsedBytes: { increment: dto.receiptSizeBytes } },
      });
    }

    this.logs.log({
      entrepriseId, userId, userNom,
      action: 'DEPENSE_CREEE',
      entityType: 'DEPENSE',
      entityId: depense.id,
      entityRef: `${dto.montant} ${dto.devise ?? 'MAD'} — ${dto.categorie}`,
    });

    return depense;
  }

  async lister(
    entrepriseId: string,
    categorie?: CategorieDepense,
    dateDebut?: string,
    dateFin?: string,
    recherche?: string,
  ) {
    return this.prisma.depense.findMany({
      where: {
        entrepriseId,
        ...(categorie ? { categorie } : {}),
        ...(dateDebut || dateFin ? {
          date: {
            ...(dateDebut ? { gte: new Date(dateDebut) } : {}),
            ...(dateFin ? { lte: new Date(dateFin) } : {}),
          },
        } : {}),
        ...(recherche ? {
          OR: [
            { fournisseur: { contains: recherche, mode: 'insensitive' } },
            { description: { contains: recherche, mode: 'insensitive' } },
          ],
        } : {}),
      },
      orderBy: { date: 'desc' },
    });
  }

  async obtenir(id: string, entrepriseId: string) {
    const dep = await this.prisma.depense.findFirst({ where: { id, entrepriseId } });
    if (!dep) throw new NotFoundException('Dépense introuvable.');
    return dep;
  }

  async modifier(id: string, dto: ModifierDepenseDto, entrepriseId: string, userId: string, userNom: string) {
    const dep = await this.prisma.depense.findFirst({ where: { id, entrepriseId } });
    if (!dep) throw new NotFoundException('Dépense introuvable.');

    const updated = await this.prisma.depense.update({
      where: { id },
      data: {
        ...(dto.montant !== undefined ? { montant: dto.montant } : {}),
        ...(dto.devise !== undefined ? { devise: dto.devise } : {}),
        ...(dto.categorie !== undefined ? { categorie: dto.categorie } : {}),
        ...(dto.fournisseur !== undefined ? { fournisseur: dto.fournisseur } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.date !== undefined ? { date: new Date(dto.date) } : {}),
      },
    });

    this.logs.log({
      entrepriseId, userId, userNom,
      action: 'DEPENSE_MODIFIEE',
      entityType: 'DEPENSE',
      entityId: id,
      entityRef: `${updated.montant} ${updated.devise}`,
    });

    return updated;
  }

  async supprimer(id: string, entrepriseId: string, userId: string, userNom: string) {
    const dep = await this.prisma.depense.findFirst({ where: { id, entrepriseId } });
    if (!dep) throw new NotFoundException('Dépense introuvable.');

    if (dep.receiptKey) {
      await this.supprimerObjetR2(dep.receiptKey);
    }

    await this.prisma.depense.delete({ where: { id } });

    if (dep.receiptSizeBytes && dep.receiptSizeBytes > 0) {
      await this.prisma.entreprise.update({
        where: { id: entrepriseId },
        data: { storageUsedBytes: { decrement: dep.receiptSizeBytes } },
      });
    }

    this.logs.log({
      entrepriseId, userId, userNom,
      action: 'DEPENSE_SUPPRIMEE',
      entityType: 'DEPENSE',
      entityId: id,
      entityRef: `${dep.montant} ${dep.devise}`,
    });

    return { message: 'Dépense supprimée.' };
  }

  // ── Export ────────────────────────────────────────────────────────────────────

  async exporter(
    entrepriseId: string,
    categorie?: CategorieDepense,
    dateDebut?: string,
    dateFin?: string,
  ) {
    const depenses = await this.lister(entrepriseId, categorie, dateDebut, dateFin);

    const ExcelJS = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Dépenses');

    sheet.columns = [
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Catégorie', key: 'categorie', width: 20 },
      { header: 'Fournisseur', key: 'fournisseur', width: 24 },
      { header: 'Description', key: 'description', width: 32 },
      { header: 'Montant', key: 'montant', width: 14 },
      { header: 'Devise', key: 'devise', width: 10 },
      { header: 'Reçu', key: 'receiptUrl', width: 50 },
    ];

    for (const d of depenses) {
      sheet.addRow({
        date: new Date(d.date).toLocaleDateString('fr-MA'),
        categorie: d.categorie,
        fournisseur: d.fournisseur ?? '',
        description: d.description ?? '',
        montant: Number(d.montant),
        devise: d.devise,
        receiptUrl: d.receiptUrl ?? '',
      });
    }

    sheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  // ── Storage usage ─────────────────────────────────────────────────────────────

  async obtenirUsageStockage(entrepriseId: string) {
    const ent = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: { storageUsedBytes: true, plan: true },
    });
    const limits = PLAN_LIMITS[ent?.plan ?? 'STARTER'];
    return {
      usedBytes: ent?.storageUsedBytes ?? 0,
      limitBytes: limits.depensesStorageBytes,
    };
  }

  // ── Nightly orphan cleanup cron ──────────────────────────────────────────────

  @Cron('0 2 * * *') // 02:00 UTC daily
  async nettoyerOrphelins() {
    this.logger.log('Running R2 orphan cleanup...');
    const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);

    try {
      const listed = await this.s3.send(
        new ListObjectsV2Command({ Bucket: this.bucket, Prefix: 'expenses/' }),
      );
      const objects = listed.Contents ?? [];

      for (const obj of objects) {
        if (!obj.Key || !obj.LastModified || obj.LastModified > cutoff) continue;

        const exists = await this.prisma.depense.findFirst({
          where: { receiptKey: obj.Key },
          select: { id: true },
        });
        if (!exists) {
          await this.supprimerObjetR2(obj.Key);
          this.logger.log(`Orphan cleaned: ${obj.Key}`);
        }
      }
    } catch (e) {
      this.logger.error('Orphan cleanup failed', e);
    }
  }
}
