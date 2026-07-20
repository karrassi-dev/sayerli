import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';
import { CreerBonLivraisonDto } from './dto/creer-bon-livraison.dto';
import { ModifierBonLivraisonDto } from './dto/modifier-bon-livraison.dto';
import { PLAN_LIMITS, verifierLimite } from '../../common/utils/plan-limits';
import { v4 as uuidv4 } from 'uuid';
import { StatutDevis } from '@prisma/client';

const BL_INCLUDE = {
  client: { select: { id: true, nom: true, nomEntreprise: true, email: true, telephone: true, ice: true } },
  devis: { select: { id: true, reference: true } },
  lignes: { orderBy: { ordre: 'asc' as const } },
};

@Injectable()
export class BonsLivraisonService {
  constructor(
    private prisma: PrismaService,
    private logs: LogsService,
  ) {}

  private async genererReference(entrepriseId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.bonLivraison.count({ where: { entrepriseId } });
    return `BL-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  async lister(entrepriseId: string, statut?: string, clientId?: string, recherche?: string) {
    return this.prisma.bonLivraison.findMany({
      where: {
        entrepriseId,
        ...(statut ? { statut: statut as any } : {}),
        ...(clientId ? { clientId } : {}),
        ...(recherche ? {
          OR: [
            { reference: { contains: recherche, mode: 'insensitive' } },
            { client: { nom: { contains: recherche, mode: 'insensitive' } } },
          ],
        } : {}),
      },
      include: { ...BL_INCLUDE, _count: { select: { lignes: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async obtenir(id: string, entrepriseId: string) {
    const bl = await this.prisma.bonLivraison.findFirst({ where: { id, entrepriseId }, include: BL_INCLUDE });
    if (!bl) throw new NotFoundException('Bon de livraison introuvable.');
    return bl;
  }

  async obtenirParToken(token: string) {
    const bl = await this.prisma.bonLivraison.findUnique({
      where: { publicToken: token },
      include: {
        ...BL_INCLUDE,
        entreprise: {
          select: {
            nom: true, logo: true, email: true, telephone: true, adresse: true, ville: true,
            couleurPrimaire: true, ice: true, rc: true, website: true,
          },
        },
      },
    });
    if (!bl) throw new NotFoundException('Bon de livraison introuvable.');
    return bl;
  }

  private async verifierLimiteBL(entrepriseId: string) {
    const entreprise = await this.prisma.entreprise.findUnique({ where: { id: entrepriseId }, select: { plan: true } });
    const limite = PLAN_LIMITS[entreprise!.plan].bonsLivraisonParMois;
    const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const actuel = await this.prisma.bonLivraison.count({ where: { entrepriseId, createdAt: { gte: debutMois } } });
    verifierLimite('bons-livraison', actuel, limite);
  }

  async creer(dto: CreerBonLivraisonDto, entrepriseId: string, userId: string, userNom: string) {
    await this.verifierLimiteBL(entrepriseId);
    const reference = await this.genererReference(entrepriseId);
    const bl = await this.prisma.bonLivraison.create({
      data: {
        reference,
        publicToken: uuidv4(),
        entrepriseId,
        clientId: dto.clientId,
        devisId: dto.devisId ?? null,
        notes: dto.notes ?? null,
        dateLivraison: dto.dateLivraison ? new Date(dto.dateLivraison) : null,
        lignes: {
          create: (dto.lignes ?? []).map((l, i) => ({
            description: l.description,
            quantite: l.quantite ?? 1,
            unite: l.unite ?? null,
            ordre: l.ordre ?? i,
          })),
        },
      },
      include: BL_INCLUDE,
    });
    this.logs.log({ entrepriseId, userId, userNom, action: 'BL_CREE', entityType: 'BON_LIVRAISON', entityId: bl.id, entityRef: bl.reference });
    return bl;
  }

  async modifier(id: string, dto: ModifierBonLivraisonDto, entrepriseId: string, userId: string, userNom: string) {
    const bl = await this.prisma.bonLivraison.findFirst({ where: { id, entrepriseId } });
    if (!bl) throw new NotFoundException('Bon de livraison introuvable.');
    if (bl.statut === 'LIVRE') throw new BadRequestException('Un BL livré ne peut plus être modifié.');

    const updated = await this.prisma.bonLivraison.update({
      where: { id },
      data: {
        clientId: dto.clientId ?? bl.clientId,
        devisId: dto.devisId !== undefined ? (dto.devisId ?? null) : bl.devisId,
        notes: dto.notes !== undefined ? (dto.notes ?? null) : bl.notes,
        dateLivraison: dto.dateLivraison !== undefined
          ? (dto.dateLivraison ? new Date(dto.dateLivraison) : null)
          : bl.dateLivraison,
        ...(dto.lignes !== undefined ? {
          lignes: {
            deleteMany: {},
            create: dto.lignes.map((l, i) => ({
              description: l.description,
              quantite: l.quantite ?? 1,
              unite: l.unite ?? null,
              ordre: l.ordre ?? i,
            })),
          },
        } : {}),
      },
      include: BL_INCLUDE,
    });
    this.logs.log({ entrepriseId, userId, userNom, action: 'BL_MODIFIE', entityType: 'BON_LIVRAISON', entityId: id, entityRef: bl.reference });
    return updated;
  }

  async supprimer(id: string, entrepriseId: string, userId: string, userNom: string) {
    const bl = await this.prisma.bonLivraison.findFirst({ where: { id, entrepriseId } });
    if (!bl) throw new NotFoundException('Bon de livraison introuvable.');
    if (bl.statut === 'LIVRE') throw new BadRequestException('Un BL livré ne peut pas être supprimé.');
    await this.prisma.bonLivraison.delete({ where: { id } });
    this.logs.log({ entrepriseId, userId, userNom, action: 'BL_SUPPRIME', entityType: 'BON_LIVRAISON', entityId: id, entityRef: bl.reference });
    return { message: 'Bon de livraison supprimé.' };
  }

  async envoyer(id: string, entrepriseId: string, userId: string, userNom: string) {
    const bl = await this.prisma.bonLivraison.findFirst({ where: { id, entrepriseId } });
    if (!bl) throw new NotFoundException('Bon de livraison introuvable.');
    if (bl.statut !== 'BROUILLON') throw new BadRequestException('Seuls les BL en brouillon peuvent être envoyés.');
    const updated = await this.prisma.bonLivraison.update({
      where: { id }, data: { statut: 'ENVOYE' }, include: BL_INCLUDE,
    });
    this.logs.log({ entrepriseId, userId, userNom, action: 'BL_ENVOYE', entityType: 'BON_LIVRAISON', entityId: id, entityRef: bl.reference });
    return updated;
  }

  async marquerLivre(id: string, entrepriseId: string, userId: string, userNom: string) {
    const bl = await this.prisma.bonLivraison.findFirst({ where: { id, entrepriseId } });
    if (!bl) throw new NotFoundException('Bon de livraison introuvable.');
    const updated = await this.prisma.bonLivraison.update({
      where: { id }, data: { statut: 'LIVRE' }, include: BL_INCLUDE,
    });
    this.logs.log({ entrepriseId, userId, userNom, action: 'BL_LIVRE', entityType: 'BON_LIVRAISON', entityId: id, entityRef: bl.reference });
    return updated;
  }

  async confirmerReceptionClient(token: string) {
    const bl = await this.prisma.bonLivraison.findUnique({ where: { publicToken: token } });
    if (!bl) throw new NotFoundException('Bon de livraison introuvable.');
    if (bl.statut === 'LIVRE') return { message: 'Déjà confirmé.' };
    if (bl.statut === 'BROUILLON') throw new BadRequestException('Ce bon de livraison n\'a pas encore été envoyé.');
    const updated = await this.prisma.bonLivraison.update({
      where: { publicToken: token }, data: { statut: 'LIVRE' }, include: BL_INCLUDE,
    });
    return updated;
  }

  async dupliquer(id: string, entrepriseId: string, userId: string, userNom: string) {
    await this.verifierLimiteBL(entrepriseId);
    const original = await this.prisma.bonLivraison.findFirst({
      where: { id, entrepriseId }, include: { lignes: true },
    });
    if (!original) throw new NotFoundException('Bon de livraison introuvable.');
    const reference = await this.genererReference(entrepriseId);
    const nouveau = await this.prisma.bonLivraison.create({
      data: {
        reference,
        publicToken: uuidv4(),
        entrepriseId,
        clientId: original.clientId,
        devisId: original.devisId,
        notes: original.notes,
        dateLivraison: original.dateLivraison,
        lignes: {
          create: original.lignes.map(l => ({
            description: l.description,
            quantite: l.quantite,
            unite: l.unite,
            ordre: l.ordre,
          })),
        },
      },
      include: BL_INCLUDE,
    });
    this.logs.log({ entrepriseId, userId, userNom, action: 'BL_DUPLIQUE', entityType: 'BON_LIVRAISON', entityId: nouveau.id, entityRef: nouveau.reference, metadata: { originalRef: original.reference } });
    return nouveau;
  }

  async creerDepuisDevis(devisId: string, entrepriseId: string, userId: string, userNom: string) {
    await this.verifierLimiteBL(entrepriseId);
    const devis = await this.prisma.devis.findFirst({
      where: { id: devisId, entrepriseId },
      include: { lignes: true },
    });
    if (!devis) throw new NotFoundException('Devis introuvable.');
    if (devis.statut !== StatutDevis.ACCEPTE) {
      throw new BadRequestException('Seuls les devis acceptés peuvent générer un bon de livraison.');
    }
    const reference = await this.genererReference(entrepriseId);
    const bl = await this.prisma.bonLivraison.create({
      data: {
        reference,
        publicToken: uuidv4(),
        entrepriseId,
        clientId: devis.clientId,
        devisId: devis.id,
        lignes: {
          create: devis.lignes.map(l => ({
            description: l.description,
            quantite: l.quantite,
            unite: null,
            ordre: l.ordre,
          })),
        },
      },
      include: BL_INCLUDE,
    });
    this.logs.log({ entrepriseId, userId, userNom, action: 'BL_DEPUIS_DEVIS', entityType: 'BON_LIVRAISON', entityId: bl.id, entityRef: bl.reference, metadata: { devisRef: devis.reference } });
    return bl;
  }

  async convertirEnFacture(id: string, entrepriseId: string, userId: string, userNom: string) {
    const bl = await this.prisma.bonLivraison.findFirst({
      where: { id, entrepriseId }, include: { lignes: true, client: true },
    });
    if (!bl) throw new NotFoundException('Bon de livraison introuvable.');
    if (bl.statut !== 'LIVRE') {
      throw new BadRequestException('Seuls les bons de livraison livrés peuvent être convertis en facture.');
    }

    const countFactures = await this.prisma.facture.count({ where: { entrepriseId } });
    const numeroFacture = `FAC-${new Date().getFullYear()}-${String(countFactures + 1).padStart(4, '0')}`;

    const facture = await this.prisma.facture.create({
      data: {
        entrepriseId,
        clientId: bl.clientId,
        devisId: bl.devisId ?? undefined,
        numeroFacture,
        publicToken: uuidv4(),
        statut: 'BROUILLON',
        devise: 'MAD',
        notes: bl.notes ? `Ref. BL: ${bl.reference}\n${bl.notes}` : `Ref. BL: ${bl.reference}`,
        lignes: {
          create: bl.lignes.map(l => ({
            description: l.description,
            quantite: l.quantite,
            prixUnitaire: 0,
            total: 0,
            ordre: l.ordre,
          })),
        },
      },
      include: { lignes: true, client: true },
    });
    this.logs.log({ entrepriseId, userId, userNom, action: 'BL_CONVERTI_FACTURE', entityType: 'FACTURE', entityId: facture.id, entityRef: facture.numeroFacture, metadata: { blRef: bl.reference } });
    return facture;
  }
}
