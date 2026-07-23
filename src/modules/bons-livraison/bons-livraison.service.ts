import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, StatutDevis } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';
import { CreerBonLivraisonDto } from './dto/creer-bon-livraison.dto';
import { ModifierBonLivraisonDto } from './dto/modifier-bon-livraison.dto';
import { PLAN_LIMITS, verifierLimite } from '../../common/utils/plan-limits';
import { retryOnConflict } from '../../common/utils/retry';
import { v4 as uuidv4 } from 'uuid';

const BL_INCLUDE = {
  client: { select: { id: true, nom: true, nomEntreprise: true, email: true, telephone: true, ice: true } },
  devis: { select: { id: true, reference: true } },
  facture: { select: { id: true, numeroFacture: true } },
  lignes: { orderBy: { ordre: 'asc' as const } },
};

@Injectable()
export class BonsLivraisonService {
  constructor(
    private prisma: PrismaService,
    private logs: LogsService,
  ) {}

  private async genererReference(entrepriseId: string): Promise<string> {
    const ent = await this.prisma.entreprise.update({
      where: { id: entrepriseId },
      data: { prochainNumeroBL: { increment: 1 } },
      select: { prochainNumeroBL: true, prefixeBL: true },
    });
    return `${ent.prefixeBL || 'BL'}-${new Date().getFullYear()}-${String(ent.prochainNumeroBL - 1).padStart(4, '0')}`;
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
            prixUnitaire: l.prixUnitaire ?? 0,
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
              prixUnitaire: l.prixUnitaire ?? 0,
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
            prixUnitaire: l.prixUnitaire,
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

  async grouperEnFacture(blIds: string[], clientId: string, entrepriseId: string, userId: string, userNom: string) {
    if (blIds.length < 2) throw new BadRequestException('Sélectionnez au moins 2 bons de livraison.');

    const bls = await this.prisma.bonLivraison.findMany({
      where: { id: { in: blIds }, entrepriseId },
      include: { lignes: { orderBy: { ordre: 'asc' } } },
    });

    if (bls.length !== blIds.length) throw new NotFoundException('Un ou plusieurs BL introuvables.');

    if (bls.some(bl => bl.clientId !== clientId)) {
      throw new BadRequestException('Tous les BL doivent appartenir au même client.');
    }

    if (bls.some(bl => bl.statut === 'BROUILLON')) {
      throw new BadRequestException('Seuls les BL envoyés ou livrés peuvent être groupés en facture.');
    }

    if (bls.some(bl => bl.factureId !== null)) {
      throw new BadRequestException('Un ou plusieurs BL sont déjà associés à une facture.');
    }

    const entreprise = await this.prisma.entreprise.findUnique({ where: { id: entrepriseId }, select: { plan: true } });
    const limite = PLAN_LIMITS[entreprise!.plan].facturesParMois;
    const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const actuel = await this.prisma.facture.count({ where: { entrepriseId, createdAt: { gte: debutMois } } });
    verifierLimite('factures', actuel, limite);

    const notes = bls.map(bl => `Réf. BL: ${bl.reference}`).join(' | ');

    const clientRas = await this.prisma.client.findFirst({
      where: { id: clientId, entrepriseId },
      select: { rasActif: true, rasTaux: true },
    });
    const rasActif  = clientRas?.rasActif ?? false;
    const rasTaux   = Number(clientRas?.rasTaux ?? 30);

    const taxe = 20;
    const lignesMerged = bls.flatMap((bl, blIdx) =>
      bl.lignes.map(l => ({
        description: l.description,
        quantite: Number(l.quantite),
        prixUnitaire: Number(l.prixUnitaire),
        total: Number(l.quantite) * Number(l.prixUnitaire),
        ordre: blIdx * 1000 + l.ordre,
      })),
    );
    const totalHT  = lignesMerged.reduce((sum, l) => sum + l.total, 0);
    const totalTTC = totalHT + totalHT * (taxe / 100);
    const rasMontant = rasActif ? Math.round(totalTTC * rasTaux * 100) / 10000 : 0;

    const facture = await retryOnConflict(() =>
      this.prisma.$transaction(async (tx) => {
        const ent = await tx.entreprise.update({
          where: { id: entrepriseId },
          data: { prochainNumeroFacture: { increment: 1 } },
          select: { prochainNumeroFacture: true, prefixeFacture: true },
        });
        const numeroFacture = `${ent.prefixeFacture || 'FAC'}-${new Date().getFullYear()}-${String(ent.prochainNumeroFacture - 1).padStart(4, '0')}`;

        const newFacture = await tx.facture.create({
          data: {
            entrepriseId,
            clientId,
            numeroFacture,
            publicToken: uuidv4(),
            statut: 'BROUILLON',
            devise: 'MAD',
            taxe,
            rasActif,
            rasTaux,
            rasMontant,
            totalHT,
            totalTTC,
            notes,
            lignes: { create: lignesMerged },
          },
          include: { lignes: true, client: { select: { id: true, nom: true, email: true } } },
        });

        await tx.bonLivraison.updateMany({
          where: { id: { in: blIds } },
          data: { factureId: newFacture.id },
        });

        return newFacture;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }),
    );

    this.logs.log({
      entrepriseId, userId, userNom,
      action: 'BL_GROUPES_EN_FACTURE',
      entityType: 'FACTURE',
      entityId: facture.id,
      entityRef: facture.numeroFacture,
      metadata: { blRefs: bls.map(bl => bl.reference) },
    });

    return facture;
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
            prixUnitaire: l.prixUnitaire,
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

    const entreprise = await this.prisma.entreprise.findUnique({ where: { id: entrepriseId }, select: { plan: true } });
    const limite = PLAN_LIMITS[entreprise!.plan].facturesParMois;
    const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const actuel = await this.prisma.facture.count({ where: { entrepriseId, createdAt: { gte: debutMois } } });
    verifierLimite('factures', actuel, limite);

    const blClient = bl.client as { rasActif?: boolean; rasTaux?: number | null } | null;
    const rasActif  = blClient?.rasActif ?? false;
    const rasTaux   = Number(blClient?.rasTaux ?? 30);

    const taxe = 20;
    const lignesData = bl.lignes.map(l => ({
      description: l.description,
      quantite: Number(l.quantite),
      prixUnitaire: Number(l.prixUnitaire),
      total: Number(l.quantite) * Number(l.prixUnitaire),
      ordre: l.ordre,
    }));
    const totalHT  = lignesData.reduce((sum, l) => sum + l.total, 0);
    const totalTTC = totalHT + totalHT * (taxe / 100);
    const rasMontant = rasActif ? Math.round(totalTTC * rasTaux * 100) / 10000 : 0;

    const facture = await retryOnConflict(() =>
      this.prisma.$transaction(async (tx) => {
        const ent = await tx.entreprise.update({
          where: { id: entrepriseId },
          data: { prochainNumeroFacture: { increment: 1 } },
          select: { prochainNumeroFacture: true, prefixeFacture: true },
        });
        const numeroFacture = `${ent.prefixeFacture || 'FAC'}-${new Date().getFullYear()}-${String(ent.prochainNumeroFacture - 1).padStart(4, '0')}`;

        return tx.facture.create({
          data: {
            entrepriseId,
            clientId: bl.clientId,
            devisId: bl.devisId ?? undefined,
            numeroFacture,
            publicToken: uuidv4(),
            statut: 'BROUILLON',
            devise: 'MAD',
            taxe,
            rasActif,
            rasTaux,
            rasMontant,
            totalHT,
            totalTTC,
            notes: bl.notes ? `Ref. BL: ${bl.reference}\n${bl.notes}` : `Ref. BL: ${bl.reference}`,
            lignes: { create: lignesData },
          },
          include: { lignes: true, client: true },
        });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }),
    );

    this.logs.log({ entrepriseId, userId, userNom, action: 'BL_CONVERTI_FACTURE', entityType: 'FACTURE', entityId: facture.id, entityRef: facture.numeroFacture, metadata: { blRef: bl.reference } });
    return facture;
  }
}
