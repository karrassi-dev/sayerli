import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MethodePaiement, StatutFacture } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';
import { CreerPaiementDto } from './dto/creer-paiement.dto';
import { ModifierPaiementDto } from './dto/modifier-paiement.dto';

@Injectable()
export class PaiementsService {
  constructor(
    private prisma: PrismaService,
    private logs: LogsService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  private bustDashboard(entrepriseId: string) {
    void this.cache.del(`dashboard:${entrepriseId}`);
  }

  async listerPaiements(
    entrepriseId: string,
    factureId?: string,
    methode?: MethodePaiement,
    recherche?: string,
  ) {
    return this.prisma.paiement.findMany({
      where: {
        entrepriseId,
        ...(factureId && { factureId }),
        ...(methode && { methode }),
        ...(recherche && {
          OR: [
            { reference: { contains: recherche, mode: 'insensitive' } },
            { facture: { numeroFacture: { contains: recherche, mode: 'insensitive' } } },
            { facture: { client: { nom: { contains: recherche, mode: 'insensitive' } } } },
            { facture: { client: { nomEntreprise: { contains: recherche, mode: 'insensitive' } } } },
          ],
        }),
      },
      include: {
        facture: {
          select: {
            id: true,
            numeroFacture: true,
            totalTTC: true,
            montantPaye: true,
            client: { select: { id: true, nom: true, nomEntreprise: true, email: true } },
          },
        },
      },
      orderBy: { datePaiement: 'desc' },
    });
  }

  async obtenirPaiement(id: string, entrepriseId: string) {
    const paiement = await this.prisma.paiement.findFirst({
      where: { id, entrepriseId },
      include: {
        facture: {
          include: {
            client: { select: { id: true, nom: true, email: true, nomEntreprise: true } },
            lignes: true,
          },
        },
      },
    });
    if (!paiement) throw new NotFoundException('Paiement introuvable.');
    return paiement;
  }

  async enregistrerPaiement(dto: CreerPaiementDto, entrepriseId: string, userId: string, userNom: string) {
    const facture = await this.prisma.facture.findFirst({
      where: { id: dto.factureId, entrepriseId },
      include: {
        paiements: true,
        client: { select: { rasActif: true, rasTaux: true } },
      },
    });
    if (!facture) throw new NotFoundException('Facture introuvable.');
    if (facture.statut === StatutFacture.PAYEE) {
      throw new BadRequestException('Cette facture est déjà entièrement payée.');
    }

    const totalPayeActuel = facture.paiements.reduce(
      (sum, p) => sum + Number(p.montant),
      0,
    );
    const totalTTC = Number(facture.totalTTC);

    // Use facture's own RAS or fall back to client's RAS
    const effRasActif   = facture.rasActif || (facture.client?.rasActif ?? false);
    const effRasTaux    = facture.rasActif ? Number(facture.rasTaux) : Number(facture.client?.rasTaux ?? 30);
    const effRasMontant = effRasActif
      ? (facture.rasActif && Number(facture.rasMontant) > 0
          ? Number(facture.rasMontant)
          : Math.round(totalTTC * effRasTaux * 100) / 10000)
      : 0;
    const netAPayer   = effRasActif ? totalTTC - effRasMontant : totalTTC;
    const resteAPayer = netAPayer - totalPayeActuel;

    if (dto.montant > resteAPayer + 0.01) {
      throw new BadRequestException(
        `Le montant saisi (${dto.montant} MAD) dépasse le reste à payer (${resteAPayer.toFixed(2)} MAD).`,
      );
    }

    const nouveauMontantPaye = totalPayeActuel + dto.montant;
    const nouveauStatut =
      nouveauMontantPaye >= netAPayer - 0.01
        ? StatutFacture.PAYEE
        : StatutFacture.PARTIELLE;

    // Auto-sync RAS to the facture if it was missing
    const rasUpdate = (!facture.rasActif && effRasActif)
      ? { rasActif: true, rasTaux: effRasTaux, rasMontant: effRasMontant }
      : {};

    const [paiement] = await this.prisma.$transaction([
      this.prisma.paiement.create({
        data: {
          entrepriseId,
          factureId: dto.factureId,
          montant: dto.montant,
          methode: dto.methode,
          reference: dto.reference,
          datePaiement: dto.datePaiement ? new Date(dto.datePaiement) : new Date(),
          notes: dto.notes,
        },
        include: {
          facture: {
            select: {
              id: true,
              numeroFacture: true,
              totalTTC: true,
              montantPaye: true,
              client: { select: { id: true, nom: true, nomEntreprise: true, email: true } },
            },
          },
        },
      }),
      this.prisma.facture.update({
        where: { id: dto.factureId },
        data: {
          montantPaye: nouveauMontantPaye,
          statut: nouveauStatut,
          ...rasUpdate,
        },
      }),
      this.prisma.notification.create({
        data: {
          entrepriseId,
          type: nouveauStatut === StatutFacture.PAYEE ? 'PAIEMENT_RECU' : 'FACTURE_PARTIELLE',
          message:
            nouveauStatut === StatutFacture.PAYEE
              ? `Paiement complet reçu pour la facture ${facture.numeroFacture} : ${dto.montant} MAD.`
              : `Paiement partiel de ${dto.montant} MAD reçu pour la facture ${facture.numeroFacture}.`,
          lien: `/factures/${dto.factureId}`,
        },
      }),
    ]);

    this.logs.log({
      entrepriseId, userId, userNom,
      action: 'PAIEMENT_ENREGISTRE',
      entityType: 'PAIEMENT',
      entityId: paiement.id,
      entityRef: paiement.facture.numeroFacture,
      metadata: { montant: dto.montant, methode: dto.methode },
    });
    this.bustDashboard(entrepriseId);
    return paiement;
  }

  async modifierPaiement(id: string, dto: ModifierPaiementDto, entrepriseId: string) {
    const paiement = await this.prisma.paiement.findFirst({
      where: { id, entrepriseId },
      include: { facture: { include: { paiements: true } } },
    });
    if (!paiement) throw new NotFoundException('Paiement introuvable.');

    if (dto.montant !== undefined) {
      const autresPaiements = paiement.facture.paiements.filter(p => p.id !== id);
      const totalAutres = autresPaiements.reduce((sum, p) => sum + Number(p.montant), 0);
      const totalTTC = Number(paiement.facture.totalTTC);
      const resteDisponible = totalTTC - totalAutres;

      if (dto.montant > resteDisponible + 0.01) {
        throw new BadRequestException(
          `Le montant (${dto.montant} MAD) dépasse le reste disponible (${resteDisponible.toFixed(2)} MAD).`,
        );
      }

      const nouveauMontantPaye = totalAutres + dto.montant;
      const nouveauStatut =
        nouveauMontantPaye >= totalTTC - 0.01
          ? StatutFacture.PAYEE
          : nouveauMontantPaye > 0
          ? StatutFacture.PARTIELLE
          : StatutFacture.ENVOYEE;

      await this.prisma.$transaction([
        this.prisma.paiement.update({
          where: { id },
          data: {
            montant: dto.montant,
            ...(dto.methode !== undefined && { methode: dto.methode }),
            ...(dto.reference !== undefined && { reference: dto.reference }),
            ...(dto.datePaiement !== undefined && { datePaiement: new Date(dto.datePaiement) }),
            ...(dto.notes !== undefined && { notes: dto.notes }),
          },
        }),
        this.prisma.facture.update({
          where: { id: paiement.factureId },
          data: { montantPaye: nouveauMontantPaye, statut: nouveauStatut },
        }),
      ]);
    } else {
      await this.prisma.paiement.update({
        where: { id },
        data: {
          ...(dto.methode !== undefined && { methode: dto.methode }),
          ...(dto.reference !== undefined && { reference: dto.reference }),
          ...(dto.datePaiement !== undefined && { datePaiement: new Date(dto.datePaiement) }),
          ...(dto.notes !== undefined && { notes: dto.notes }),
        },
      });
    }

    return this.obtenirPaiement(id, entrepriseId);
  }

  async supprimerPaiement(_id: string, _entrepriseId: string): Promise<never> {
    throw new BadRequestException(
      'Les paiements enregistrés ne peuvent pas être supprimés afin de garantir l\'intégrité comptable.',
    );
  }

  async statistiques(entrepriseId: string) {
    const maintenant = new Date();
    const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
    const debutAnnee = new Date(maintenant.getFullYear(), 0, 1);

    const [totalPaiements, ceMois, cetteAnnee, facturesImpayees] = await Promise.all([
      this.prisma.paiement.aggregate({
        where: { entrepriseId },
        _sum: { montant: true },
      }),
      this.prisma.paiement.aggregate({
        where: { entrepriseId, datePaiement: { gte: debutMois } },
        _sum: { montant: true },
      }),
      this.prisma.paiement.aggregate({
        where: { entrepriseId, datePaiement: { gte: debutAnnee } },
        _sum: { montant: true },
      }),
      this.prisma.facture.findMany({
        where: {
          entrepriseId,
          statut: { in: [StatutFacture.ENVOYEE, StatutFacture.PARTIELLE, StatutFacture.EN_RETARD] },
        },
        select: { totalTTC: true, montantPaye: true },
      }),
    ]);

    const enAttente = facturesImpayees.reduce(
      (sum, f) => sum + Math.max(0, Number(f.totalTTC) - Number(f.montantPaye)),
      0,
    );

    return {
      totalRecu: Number(totalPaiements._sum.montant ?? 0),
      ceMois: Number(ceMois._sum.montant ?? 0),
      cetteAnnee: Number(cetteAnnee._sum.montant ?? 0),
      enAttente,
    };
  }
}
