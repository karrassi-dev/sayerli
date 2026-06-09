import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { StatutDevis } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreerDevisDto } from './dto/creer-devis.dto';
import { ModifierStatutDevisDto } from './dto/modifier-statut-devis.dto';
import { v4 as uuidv4 } from 'uuid';
import { PLAN_LIMITS, verifierLimite } from '../../common/utils/plan-limits';

@Injectable()
export class DevisService {
  constructor(private prisma: PrismaService) {}

  private calculerTotaux(
    lignes: { quantite: number; prixUnitaire: number }[],
    taxe: number,
    remise = 0,
  ) {
    const sousTotal = lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);
    const totalHT = Math.max(0, sousTotal - remise);
    const totalTTC = totalHT + totalHT * (taxe / 100);
    return { totalHT, totalTTC };
  }

  private async genererReference(entrepriseId: string): Promise<string> {
    const count = await this.prisma.devis.count({ where: { entrepriseId } });
    const numero = String(count + 1).padStart(4, '0');
    const annee = new Date().getFullYear();
    return `DEV-${annee}-${numero}`;
  }

  async listerDevis(
    entrepriseId: string,
    statut?: StatutDevis,
    clientId?: string,
    recherche?: string,
  ) {
    return this.prisma.devis.findMany({
      where: {
        entrepriseId,
        ...(statut && { statut }),
        ...(clientId && { clientId }),
        ...(recherche && {
          OR: [
            { reference: { contains: recherche, mode: 'insensitive' } },
            { client: { nom: { contains: recherche, mode: 'insensitive' } } },
            { client: { nomEntreprise: { contains: recherche, mode: 'insensitive' } } },
          ],
        }),
      },
      include: {
        client: { select: { id: true, nom: true, email: true, nomEntreprise: true } },
        _count: { select: { lignes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async obtenirDevis(id: string, entrepriseId: string) {
    const devis = await this.prisma.devis.findFirst({
      where: { id, entrepriseId },
      include: {
        client: true,
        lignes: { orderBy: { ordre: 'asc' } },
        lienPublic: true,
      },
    });
    if (!devis) throw new NotFoundException('Devis introuvable.');
    return devis;
  }

  async creerDevis(dto: CreerDevisDto, entrepriseId: string) {
    const entreprise = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: { plan: true },
    });
    const limite = PLAN_LIMITS[entreprise!.plan].devisParMois;
    const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const actuel = await this.prisma.devis.count({ where: { entrepriseId, createdAt: { gte: debutMois } } });
    verifierLimite('devis', actuel, limite);

    const client = await this.prisma.client.findFirst({
      where: { id: dto.clientId, entrepriseId },
    });
    if (!client) throw new NotFoundException('Client introuvable.');

    const taxe = dto.taxe ?? 20;
    const remise = dto.remise ?? 0;
    const { totalHT, totalTTC } = this.calculerTotaux(dto.lignes, taxe, remise);
    const reference = await this.genererReference(entrepriseId);

    return this.prisma.devis.create({
      data: {
        entrepriseId,
        clientId: dto.clientId,
        reference,
        statut: StatutDevis.BROUILLON,
        taxe,
        remise,
        totalHT,
        totalTTC,
        dateExpiration: dto.dateExpiration ? new Date(dto.dateExpiration) : null,
        notes: dto.notes,
        lignes: {
          create: dto.lignes.map((ligne, index) => ({
            description: ligne.description,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            total: ligne.quantite * ligne.prixUnitaire,
            ordre: index,
          })),
        },
      },
      include: {
        client: { select: { id: true, nom: true, email: true } },
        lignes: true,
      },
    });
  }

  async modifierDevis(id: string, dto: CreerDevisDto, entrepriseId: string) {
    const devis = await this.prisma.devis.findFirst({ where: { id, entrepriseId } });
    if (!devis) throw new NotFoundException('Devis introuvable.');

    const editableStatuts: StatutDevis[] = [StatutDevis.BROUILLON, StatutDevis.ENVOYE];
    if (!editableStatuts.includes(devis.statut)) {
      throw new BadRequestException(
        'Ce devis ne peut plus être modifié (accepté, refusé ou expiré).',
      );
    }

    const taxe = dto.taxe ?? Number(devis.taxe);
    const remise = dto.remise ?? Number(devis.remise);
    const { totalHT, totalTTC } = this.calculerTotaux(dto.lignes, taxe, remise);

    await this.prisma.devisLigne.deleteMany({ where: { devisId: id } });

    return this.prisma.devis.update({
      where: { id },
      data: {
        clientId: dto.clientId,
        taxe,
        remise,
        totalHT,
        totalTTC,
        dateExpiration: dto.dateExpiration ? new Date(dto.dateExpiration) : null,
        notes: dto.notes,
        lignes: {
          create: dto.lignes.map((ligne, index) => ({
            description: ligne.description,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            total: ligne.quantite * ligne.prixUnitaire,
            ordre: index,
          })),
        },
      },
      include: {
        client: { select: { id: true, nom: true, email: true } },
        lignes: true,
      },
    });
  }

  async modifierStatut(id: string, dto: ModifierStatutDevisDto, entrepriseId: string) {
    const devis = await this.prisma.devis.findFirst({ where: { id, entrepriseId } });
    if (!devis) throw new NotFoundException('Devis introuvable.');

    const data: Partial<{
      statut: StatutDevis; dateAcceptation: Date;
      dateEnvoi: Date; dateRefus: Date;
    }> = { statut: dto.statut };
    if (dto.statut === StatutDevis.ACCEPTE) data.dateAcceptation = new Date();
    if (dto.statut === StatutDevis.REFUSE)  data.dateRefus = new Date();
    if (dto.statut === StatutDevis.ENVOYE)  data.dateEnvoi = new Date();

    const typeNotif =
      dto.statut === StatutDevis.ACCEPTE ? 'DEVIS_ACCEPTE' :
      dto.statut === StatutDevis.REFUSE  ? 'DEVIS_REFUSE'  :
      dto.statut === StatutDevis.ENVOYE  ? 'DEVIS_ENVOYE'  :
      'DEVIS_VU';

    const [devisMaj] = await this.prisma.$transaction([
      this.prisma.devis.update({ where: { id }, data }),
      this.prisma.notification.create({
        data: {
          entrepriseId,
          type: typeNotif,
          message: `Le devis ${devis.reference} est maintenant ${dto.statut.toLowerCase()}.`,
          lien: `/devis/${id}`,
        },
      }),
    ]);

    return devisMaj;
  }

  async genererLienPublic(id: string, entrepriseId: string, joursValidite?: number) {
    const devis = await this.prisma.devis.findFirst({ where: { id, entrepriseId } });
    if (!devis) throw new NotFoundException('Devis introuvable.');

    const jours = joursValidite && !isNaN(joursValidite) ? joursValidite : 30;
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + jours);

    const lien = await this.prisma.lienPublicDevis.upsert({
      where: { devisId: id },
      create: { devisId: id, token: uuidv4(), expiration, utilise: false },
      update: { token: uuidv4(), expiration, utilise: false },
    });

    return {
      token: lien.token,
      expiration: lien.expiration,
      lienPublic: `/public/devis/${lien.token}`,
    };
  }

  async obtenirDevisParToken(token: string) {
    const lien = await this.prisma.lienPublicDevis.findUnique({
      where: { token },
      include: {
        devis: {
          include: {
            client: { select: { nom: true, email: true, telephone: true, nomEntreprise: true } },
            lignes: { orderBy: { ordre: 'asc' } },
            entreprise: {
              select: {
                nom: true, email: true, telephone: true, adresse: true,
                logo: true, couleurPrimaire: true, ice: true, rc: true, website: true,
              },
            },
          },
        },
      },
    });

    if (!lien) throw new NotFoundException('Ce lien de devis est invalide.');
    if (lien.expiration < new Date()) throw new BadRequestException('Ce lien de devis a expiré.');

    const now = new Date();
    const trackingData: Record<string, unknown> = {
      dateDerniereConsultation: now,
      nombreConsultations: { increment: 1 },
    };

    if (!lien.utilise) {
      await this.prisma.lienPublicDevis.update({ where: { token }, data: { utilise: true } });
      trackingData.dateConsultation = now;
      if (lien.devis.statut === StatutDevis.ENVOYE) {
        trackingData.statut = StatutDevis.VU;
        lien.devis.statut = StatutDevis.VU;
      }
    }

    await this.prisma.devis.update({ where: { id: lien.devisId }, data: trackingData });

    return lien.devis;
  }

  async repondreDevisPublic(token: string, reponse: 'accepter' | 'refuser') {
    const lien = await this.prisma.lienPublicDevis.findUnique({
      where: { token },
      include: { devis: true },
    });

    if (!lien) throw new NotFoundException('Ce lien de devis est invalide.');
    if (lien.expiration < new Date()) throw new BadRequestException('Ce lien a expiré.');

    const { devis } = lien;
    const accepted: StatutDevis[] = [StatutDevis.ENVOYE, StatutDevis.VU];
    if (!accepted.includes(devis.statut)) {
      throw new BadRequestException('Ce devis ne peut plus être répondu.');
    }

    const newStatut = reponse === 'accepter' ? StatutDevis.ACCEPTE : StatutDevis.REFUSE;
    const data: Partial<{ statut: StatutDevis; dateAcceptation: Date; dateRefus: Date }> = { statut: newStatut };
    if (newStatut === StatutDevis.ACCEPTE) data.dateAcceptation = new Date();
    if (newStatut === StatutDevis.REFUSE)  data.dateRefus = new Date();

    await this.prisma.$transaction([
      this.prisma.devis.update({ where: { id: devis.id }, data }),
      this.prisma.notification.create({
        data: {
          entrepriseId: devis.entrepriseId,
          type: newStatut === StatutDevis.ACCEPTE ? 'DEVIS_ACCEPTE' : 'DEVIS_REFUSE',
          message: `Le devis ${devis.reference} a été ${newStatut === StatutDevis.ACCEPTE ? 'accepté' : 'refusé'} par le client.`,
          lien: `/dashboard/devis`,
        },
      }),
    ]);

    return { statut: newStatut };
  }

  async convertirEnFacture(id: string, entrepriseId: string) {
    const devis = await this.prisma.devis.findFirst({
      where: { id, entrepriseId },
      include: { lignes: true },
    });
    if (!devis) throw new NotFoundException('Devis introuvable.');
    if (devis.statut !== StatutDevis.ACCEPTE) {
      throw new BadRequestException('Seuls les devis acceptés peuvent être convertis en facture.');
    }

    const countFactures = await this.prisma.facture.count({ where: { entrepriseId } });
    const numeroFacture = `FAC-${new Date().getFullYear()}-${String(countFactures + 1).padStart(4, '0')}`;

    return this.prisma.facture.create({
      data: {
        entrepriseId,
        clientId: devis.clientId,
        devisId: devis.id,
        numeroFacture,
        publicToken: uuidv4(),
        statut: 'BROUILLON',
        taxe: devis.taxe,
        totalHT: devis.totalHT,
        totalTTC: devis.totalTTC,
        lignes: {
          create: devis.lignes.map(ligne => ({
            description: ligne.description,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            total: ligne.total,
            ordre: ligne.ordre,
          })),
        },
      },
      include: { lignes: true, client: true },
    });
  }

  async dupliquerDevis(id: string, entrepriseId: string) {
    const devis = await this.prisma.devis.findFirst({
      where: { id, entrepriseId },
      include: { lignes: true },
    });
    if (!devis) throw new NotFoundException('Devis introuvable.');

    const reference = await this.genererReference(entrepriseId);

    return this.prisma.devis.create({
      data: {
        entrepriseId,
        clientId: devis.clientId,
        reference,
        statut: StatutDevis.BROUILLON,
        taxe: devis.taxe,
        remise: devis.remise,
        totalHT: devis.totalHT,
        totalTTC: devis.totalTTC,
        notes: devis.notes,
        lignes: {
          create: devis.lignes.map((ligne, index) => ({
            description: ligne.description,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            total: ligne.total,
            ordre: index,
          })),
        },
      },
      include: {
        client: { select: { id: true, nom: true, email: true } },
        lignes: true,
      },
    });
  }

  async supprimerDevis(id: string, entrepriseId: string) {
    const devis = await this.prisma.devis.findFirst({ where: { id, entrepriseId } });
    if (!devis) throw new NotFoundException('Devis introuvable.');
    if (devis.statut !== StatutDevis.BROUILLON) {
      throw new BadRequestException('Seuls les devis en brouillon peuvent être supprimés.');
    }
    await this.prisma.devis.delete({ where: { id } });
    return { message: 'Devis supprimé avec succès.' };
  }
}
