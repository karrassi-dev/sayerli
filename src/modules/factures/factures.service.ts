import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma, StatutFacture, StatutDeclaration } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { retryOnConflict } from '../../common/utils/retry';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreerFactureDto } from './dto/creer-facture.dto';
import { ModifierStatutFactureDto } from './dto/modifier-statut-facture.dto';
import { DeclarerPaiementDto } from './dto/declarer-paiement.dto';
import { RejeterDeclarationDto } from './dto/rejeter-declaration.dto';

@Injectable()
export class FacturesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  private calculerTotaux(lignes: { quantite: number; prixUnitaire: number }[], taxe: number) {
    const totalHT = lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);
    const totalTTC = totalHT + totalHT * (taxe / 100);
    return { totalHT, totalTTC };
  }

  private genererNumeroFac(count: number): string {
    return `FAC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
  }

  async listerFactures(entrepriseId: string, statut?: StatutFacture, clientId?: string, recherche?: string) {
    return this.prisma.facture.findMany({
      where: {
        entrepriseId,
        ...(statut && { statut }),
        ...(clientId && { clientId }),
        ...(recherche && {
          OR: [
            { numeroFacture: { contains: recherche, mode: 'insensitive' } },
            { client: { nom: { contains: recherche, mode: 'insensitive' } } },
            { client: { nomEntreprise: { contains: recherche, mode: 'insensitive' } } },
          ],
        }),
      },
      include: {
        client: { select: { id: true, nom: true, email: true, nomEntreprise: true, telephone: true } },
        _count: { select: { lignes: true, paiements: true, declarationsPaiement: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async obtenirFacture(id: string, entrepriseId: string) {
    const facture = await this.prisma.facture.findFirst({
      where: { id, entrepriseId },
      include: {
        client: true,
        devis: { select: { id: true, reference: true } },
        lignes: { orderBy: { ordre: 'asc' } },
        paiements: { orderBy: { datePaiement: 'desc' } },
        declarationsPaiement: {
          orderBy: { createdAt: 'desc' },
          where: { statut: StatutDeclaration.PENDING },
        },
      },
    });
    if (!facture) throw new NotFoundException('Facture introuvable.');
    return facture;
  }

  async creerFacture(dto: CreerFactureDto, entrepriseId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: dto.clientId, entrepriseId },
    });
    if (!client) throw new NotFoundException('Client introuvable.');

    if (dto.devisId) {
      const devis = await this.prisma.devis.findFirst({
        where: { id: dto.devisId, entrepriseId },
      });
      if (!devis) throw new NotFoundException('Devis introuvable.');
    }

    const taxe = dto.taxe ?? 20;
    const { totalHT, totalTTC } = this.calculerTotaux(dto.lignes, taxe);

    return retryOnConflict(() =>
      this.prisma.$transaction(async (tx) => {
        const count = await tx.facture.count({ where: { entrepriseId } });
        const numeroFacture = this.genererNumeroFac(count);

        return tx.facture.create({
          data: {
            entrepriseId,
            clientId: dto.clientId,
            devisId: dto.devisId,
            numeroFacture,
            publicToken: uuidv4(),
            statut: StatutFacture.BROUILLON,
            taxe,
            totalHT,
            totalTTC,
            dateEcheance: dto.dateEcheance ? new Date(dto.dateEcheance) : null,
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
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }),
    );
  }

  async modifierFacture(id: string, dto: CreerFactureDto, entrepriseId: string) {
    const facture = await this.prisma.facture.findFirst({ where: { id, entrepriseId } });
    if (!facture) throw new NotFoundException('Facture introuvable.');
    if (facture.statut === StatutFacture.PAYEE) {
      throw new BadRequestException('Une facture payée ne peut pas être modifiée.');
    }

    const client = await this.prisma.client.findFirst({ where: { id: dto.clientId, entrepriseId } });
    if (!client) throw new NotFoundException('Client introuvable.');

    const taxe = dto.taxe ?? Number(facture.taxe);
    const { totalHT, totalTTC } = this.calculerTotaux(dto.lignes, taxe);

    await this.prisma.factureLigne.deleteMany({ where: { factureId: id } });

    return this.prisma.facture.update({
      where: { id },
      data: {
        clientId: dto.clientId,
        taxe,
        totalHT,
        totalTTC,
        dateEcheance: dto.dateEcheance ? new Date(dto.dateEcheance) : null,
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

  async modifierStatut(id: string, dto: ModifierStatutFactureDto, entrepriseId: string) {
    const facture = await this.prisma.facture.findFirst({ where: { id, entrepriseId } });
    if (!facture) throw new NotFoundException('Facture introuvable.');

    const transitionsAutorisees: Partial<Record<StatutFacture, StatutFacture[]>> = {
      [StatutFacture.ENVOYEE]:  [StatutFacture.EN_RETARD],
      [StatutFacture.VUE]:      [StatutFacture.EN_RETARD],
      [StatutFacture.PARTIELLE]:[StatutFacture.EN_RETARD],
      [StatutFacture.EN_RETARD]:[StatutFacture.ENVOYEE],
    };

    const permis = transitionsAutorisees[facture.statut] ?? [];
    if (!permis.includes(dto.statut)) {
      throw new BadRequestException(
        `Transition invalide : ${facture.statut} → ${dto.statut}.`,
      );
    }

    return this.prisma.facture.update({
      where: { id },
      data: { statut: dto.statut },
    });
  }

  async envoyerFacture(id: string, entrepriseId: string) {
    const facture = await this.prisma.facture.findFirst({ where: { id, entrepriseId } });
    if (!facture) throw new NotFoundException('Facture introuvable.');

    if (facture.statut === StatutFacture.BROUILLON) {
      await this.prisma.facture.update({
        where: { id },
        data: { statut: StatutFacture.ENVOYEE, dateEnvoi: new Date() },
      });
      this.notificationsService.creerEtEnvoyer({
        entrepriseId,
        type: 'FACTURE_ENVOYEE',
        message: `La facture ${facture.numeroFacture} a été envoyée au client.`,
        lien: `/dashboard/factures`,
      });
    }

    const updated = await this.prisma.facture.findUnique({ where: { id } });
    return {
      publicToken: updated!.publicToken,
      lienPublic: `/public/factures/${updated!.publicToken}`,
    };
  }

  async supprimerFacture(id: string, entrepriseId: string) {
    const facture = await this.prisma.facture.findFirst({ where: { id, entrepriseId } });
    if (!facture) throw new NotFoundException('Facture introuvable.');
    if (facture.statut !== StatutFacture.BROUILLON) {
      throw new BadRequestException('Seules les factures en brouillon peuvent être supprimées.');
    }
    await this.prisma.facture.delete({ where: { id } });
    return { message: 'Facture supprimée avec succès.' };
  }

  async annulerFacture(id: string, entrepriseId: string) {
    const facture = await this.prisma.facture.findFirst({ where: { id, entrepriseId } });
    if (!facture) throw new NotFoundException('Facture introuvable.');
    if (facture.statut === StatutFacture.PAYEE) {
      throw new BadRequestException('Une facture entièrement payée ne peut pas être annulée.');
    }
    if (facture.statut === StatutFacture.PARTIELLE) {
      throw new BadRequestException('Une facture avec des paiements enregistrés ne peut pas être annulée.');
    }
    if (facture.statut === StatutFacture.ANNULEE) {
      throw new BadRequestException('Cette facture est déjà annulée.');
    }
    if (facture.statut === StatutFacture.BROUILLON) {
      throw new BadRequestException('Supprimez la facture plutôt que de l\'annuler.');
    }
    return this.prisma.facture.update({
      where: { id },
      data: { statut: StatutFacture.ANNULEE },
    });
  }

  // ── Public portal ────────────────────────────────────────────────────────────

  async obtenirFactureParToken(token: string) {
    const facture = await this.prisma.facture.findUnique({
      where: { publicToken: token },
      include: {
        client: { select: { nom: true, email: true, telephone: true, nomEntreprise: true } },
        lignes: { orderBy: { ordre: 'asc' } },
        devis: {
          select: {
            reference: true,
            totalHT: true,
            taxe: true,
            totalTTC: true,
            createdAt: true,
            dateExpiration: true,
            lignes: { orderBy: { ordre: 'asc' } },
          },
        },
        entreprise: {
          select: {
            nom: true, email: true, telephone: true, adresse: true,
            logo: true, couleurPrimaire: true, templateDocument: true, ice: true, rc: true, website: true, activite: true,
            titulaireCompte: true, banque: true, rib: true, iban: true, swift: true,
          },
        },
      },
    });

    if (!facture) throw new NotFoundException('Ce lien de facture est invalide.');

    const now = new Date();
    const trackingData: Record<string, unknown> = {
      dateDerniereConsultation: now,
      nombreConsultations: { increment: 1 },
    };

    if (!facture.dateConsultation) {
      trackingData.dateConsultation = now;
    }

    if (facture.statut === StatutFacture.ENVOYEE) {
      trackingData.statut = StatutFacture.VUE;
      await this.prisma.facture.update({ where: { publicToken: token }, data: trackingData });
      this.notificationsService.creerEtEnvoyer({
        entrepriseId: facture.entrepriseId,
        type: 'FACTURE_VUE',
        message: `La facture ${facture.numeroFacture} a été consultée par ${facture.client.nom}.`,
        lien: `/dashboard/factures`,
      });
    } else {
      await this.prisma.facture.update({ where: { publicToken: token }, data: trackingData });
    }

    return { ...facture, statut: (trackingData.statut ?? facture.statut) as StatutFacture };
  }

  async declarerPaiement(token: string, dto: DeclarerPaiementDto) {
    const facture = await this.prisma.facture.findUnique({ where: { publicToken: token } });
    if (!facture) throw new NotFoundException('Ce lien de facture est invalide.');

    const payableStatuts: StatutFacture[] = [
      StatutFacture.ENVOYEE,
      StatutFacture.VUE,
      StatutFacture.PARTIELLE,
      StatutFacture.EN_RETARD,
    ];
    if (!payableStatuts.includes(facture.statut)) {
      throw new BadRequestException('Cette facture ne peut pas recevoir de déclaration de paiement.');
    }

    const montantRestant = Number(facture.totalTTC) - Number(facture.montantPaye);
    if (dto.montant > montantRestant + 0.01) {
      throw new BadRequestException('Le montant déclaré dépasse le reste à payer.');
    }

    const declaration = await this.prisma.declarationPaiement.create({
      data: {
        entrepriseId: facture.entrepriseId,
        factureId: facture.id,
        montant: dto.montant,
        methode: dto.methode,
        reference: dto.reference,
        message: dto.message,
        datePaiement: dto.datePaiement ? new Date(dto.datePaiement) : new Date(),
      },
    });

    this.notificationsService.creerEtEnvoyer({
      entrepriseId: facture.entrepriseId,
      type: 'DECLARATION_RECUE',
      message: `Nouvelle déclaration de paiement reçue pour la facture ${facture.numeroFacture} — ${dto.montant} MAD.`,
      lien: `/dashboard/declarations`,
    });

    return declaration;
  }

  // ── Declarations management ──────────────────────────────────────────────────

  async listerDeclarations(entrepriseId: string, statut?: StatutDeclaration) {
    return this.prisma.declarationPaiement.findMany({
      where: { entrepriseId, ...(statut && { statut }) },
      include: {
        facture: {
          select: {
            id: true,
            numeroFacture: true,
            totalTTC: true,
            montantPaye: true,
            statut: true,
            publicToken: true,
            client: { select: { id: true, nom: true, nomEntreprise: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approuverDeclaration(id: string, entrepriseId: string) {
    const declaration = await this.prisma.declarationPaiement.findFirst({
      where: { id, entrepriseId },
      include: { facture: true },
    });
    if (!declaration) throw new NotFoundException('Déclaration introuvable.');
    if (declaration.statut !== StatutDeclaration.PENDING) {
      throw new BadRequestException('Cette déclaration a déjà été traitée.');
    }

    const facture = declaration.facture;
    const montantPaye = Number(facture.montantPaye) + Number(declaration.montant);
    const montantRestant = Number(facture.totalTTC) - montantPaye;
    const nouveauStatut = montantRestant <= 0.01
      ? StatutFacture.PAYEE
      : StatutFacture.PARTIELLE;

    await this.prisma.$transaction([
      this.prisma.paiement.create({
        data: {
          entrepriseId,
          factureId: facture.id,
          montant: declaration.montant,
          methode: declaration.methode,
          reference: declaration.reference ?? undefined,
          datePaiement: declaration.datePaiement,
          notes: declaration.message ?? undefined,
        },
      }),
      this.prisma.facture.update({
        where: { id: facture.id },
        data: { montantPaye, statut: nouveauStatut },
      }),
      this.prisma.declarationPaiement.update({
        where: { id },
        data: { statut: StatutDeclaration.APPROVED, reviewedAt: new Date() },
      }),
    ]);

    this.notificationsService.creerEtEnvoyer({
      entrepriseId,
      type: nouveauStatut === StatutFacture.PAYEE ? 'FACTURE_PAYEE' : 'FACTURE_PARTIELLE',
      message: `Déclaration approuvée : ${Number(declaration.montant)} MAD reçus pour la facture ${facture.numeroFacture}.`,
      lien: `/dashboard/factures`,
    });

    return { message: 'Déclaration approuvée et paiement enregistré.' };
  }

  async rejeterDeclaration(id: string, entrepriseId: string, dto: RejeterDeclarationDto) {
    const declaration = await this.prisma.declarationPaiement.findFirst({
      where: { id, entrepriseId },
    });
    if (!declaration) throw new NotFoundException('Déclaration introuvable.');
    if (declaration.statut !== StatutDeclaration.PENDING) {
      throw new BadRequestException('Cette déclaration a déjà été traitée.');
    }

    return this.prisma.declarationPaiement.update({
      where: { id },
      data: {
        statut: StatutDeclaration.REJECTED,
        raisonRejet: dto.raison,
        reviewedAt: new Date(),
      },
    });
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────

  async tableauDeBord(entrepriseId: string) {
    const maintenant = new Date();
    const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);

    const [
      totalFactures,
      facturesPayees,
      facturesEnAttente,
      facturesEnRetard,
      chiffreAffairesMois,
      chiffreAffairesTotal,
    ] = await Promise.all([
      this.prisma.facture.count({ where: { entrepriseId } }),
      this.prisma.facture.count({ where: { entrepriseId, statut: StatutFacture.PAYEE } }),
      this.prisma.facture.count({
        where: { entrepriseId, statut: { in: [StatutFacture.ENVOYEE, StatutFacture.VUE, StatutFacture.PARTIELLE] } },
      }),
      this.prisma.facture.count({ where: { entrepriseId, statut: StatutFacture.EN_RETARD } }),
      this.prisma.paiement.aggregate({
        where: { entrepriseId, createdAt: { gte: debutMois } },
        _sum: { montant: true },
      }),
      this.prisma.paiement.aggregate({
        where: { entrepriseId },
        _sum: { montant: true },
      }),
    ]);

    return {
      totalFactures,
      facturesPayees,
      facturesEnAttente,
      facturesEnRetard,
      chiffreAffairesMois: chiffreAffairesMois._sum.montant || 0,
      chiffreAffairesTotal: chiffreAffairesTotal._sum.montant || 0,
      devise: 'MAD',
    };
  }
}
