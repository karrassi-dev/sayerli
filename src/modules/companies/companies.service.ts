import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ModifierEntrepriseDto } from './dto/modifier-entreprise.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async obtenirEntreprise(entrepriseId: string) {
    const entreprise = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: {
        id: true,
        nom: true,
        logo: true,
        email: true,
        telephone: true,
        adresse: true,
        devise: true,
        plan: true,
        createdAt: true,
        _count: {
          select: {
            utilisateurs: true,
            clients: true,
            devis: true,
            factures: true,
          },
        },
      },
    });
    if (!entreprise) throw new NotFoundException('Entreprise introuvable.');
    return entreprise;
  }

  async modifierEntreprise(entrepriseId: string, dto: ModifierEntrepriseDto) {
    return this.prisma.entreprise.update({
      where: { id: entrepriseId },
      data: dto,
      select: {
        id: true,
        nom: true,
        logo: true,
        email: true,
        telephone: true,
        adresse: true,
        devise: true,
        plan: true,
        updatedAt: true,
      },
    });
  }

  async statistiquesGenerales(entrepriseId: string) {
    const maintenant = new Date();
    const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
    const debutMoisDernier = new Date(maintenant.getFullYear(), maintenant.getMonth() - 1, 1);
    const finMoisDernier = new Date(maintenant.getFullYear(), maintenant.getMonth(), 0);

    const [
      totalClients,
      totalDevis,
      totalFactures,
      caTotal,
      caMoisCourant,
      caMoisDernier,
      devisAcceptes,
      facturesEnRetard,
    ] = await Promise.all([
      this.prisma.client.count({ where: { entrepriseId, actif: true } }),
      this.prisma.devis.count({ where: { entrepriseId } }),
      this.prisma.facture.count({ where: { entrepriseId } }),
      this.prisma.paiement.aggregate({
        where: { entrepriseId },
        _sum: { montant: true },
      }),
      this.prisma.paiement.aggregate({
        where: { entrepriseId, datePaiement: { gte: debutMois } },
        _sum: { montant: true },
      }),
      this.prisma.paiement.aggregate({
        where: { entrepriseId, datePaiement: { gte: debutMoisDernier, lte: finMoisDernier } },
        _sum: { montant: true },
      }),
      this.prisma.devis.count({ where: { entrepriseId, statut: 'ACCEPTE' } }),
      this.prisma.facture.count({ where: { entrepriseId, statut: 'EN_RETARD' } }),
    ]);

    const caMoisCourantVal = Number(caMoisCourant._sum.montant || 0);
    const caMoisDernierVal = Number(caMoisDernier._sum.montant || 0);
    const evolutionCA =
      caMoisDernierVal > 0
        ? ((caMoisCourantVal - caMoisDernierVal) / caMoisDernierVal) * 100
        : 0;

    return {
      totalClients,
      totalDevis,
      totalFactures,
      devisAcceptes,
      facturesEnRetard,
      chiffreAffaires: {
        total: Number(caTotal._sum.montant || 0),
        moisCourant: caMoisCourantVal,
        moisDernier: caMoisDernierVal,
        evolution: Math.round(evolutionCA * 100) / 100,
      },
      devise: 'MAD',
    };
  }
}
