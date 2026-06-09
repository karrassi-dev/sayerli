import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { StatutFacture } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreerFactureDto } from './dto/creer-facture.dto';
import { ModifierStatutFactureDto } from './dto/modifier-statut-facture.dto';

@Injectable()
export class FacturesService {
  constructor(private prisma: PrismaService) {}

  private calculerTotaux(lignes: { quantite: number; prixUnitaire: number }[], taxe: number) {
    const totalHT = lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);
    const totalTTC = totalHT + totalHT * (taxe / 100);
    return { totalHT, totalTTC };
  }

  private async genererNumero(entrepriseId: string): Promise<string> {
    const count = await this.prisma.facture.count({ where: { entrepriseId } });
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
        client: { select: { id: true, nom: true, email: true, nomEntreprise: true } },
        _count: { select: { lignes: true, paiements: true } },
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
    const numeroFacture = await this.genererNumero(entrepriseId);

    return this.prisma.facture.create({
      data: {
        entrepriseId,
        clientId: dto.clientId,
        devisId: dto.devisId,
        numeroFacture,
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
  }

  async modifierFacture(id: string, dto: CreerFactureDto, entrepriseId: string) {
    const facture = await this.prisma.facture.findFirst({ where: { id, entrepriseId } });
    if (!facture) throw new NotFoundException('Facture introuvable.');
    if (facture.statut === StatutFacture.PAYEE) {
      throw new BadRequestException('Une facture payée ne peut pas être modifiée.');
    }

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

    return this.prisma.facture.update({
      where: { id },
      data: { statut: dto.statut },
    });
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
        where: { entrepriseId, statut: { in: [StatutFacture.ENVOYEE, StatutFacture.PARTIELLE] } },
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
