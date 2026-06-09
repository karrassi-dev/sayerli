import { Injectable } from '@nestjs/common';
import { StatutDevis, StatutFacture } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const MOIS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

@Injectable()
export class DashboardAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics(entrepriseId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalClients,
      newClientsThisMonth,
      activeClients,
      devisGrouped,
      facturesGrouped,
      paiementsTotal,
      paiementsThisMonth,
      paiementsLastMonth,
      recentInvoices,
      recentActivity,
      monthlyRevenue,
    ] = await Promise.all([
      this.prisma.client.count({ where: { entrepriseId } }),

      this.prisma.client.count({
        where: { entrepriseId, createdAt: { gte: startOfMonth } },
      }),

      this.prisma.client.count({ where: { entrepriseId, actif: true } }),

      this.prisma.devis.groupBy({
        by: ['statut'],
        where: { entrepriseId },
        _count: { _all: true },
      }),

      this.prisma.facture.groupBy({
        by: ['statut'],
        where: { entrepriseId },
        _count: { _all: true },
        _sum: { montantPaye: true },
      }),

      this.prisma.paiement.aggregate({
        where: { entrepriseId },
        _sum: { montant: true },
        _count: true,
      }),

      this.prisma.paiement.aggregate({
        where: { entrepriseId, datePaiement: { gte: startOfMonth } },
        _sum: { montant: true },
      }),

      this.prisma.paiement.aggregate({
        where: {
          entrepriseId,
          datePaiement: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { montant: true },
      }),

      this.prisma.facture.findMany({
        where: { entrepriseId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          numeroFacture: true,
          totalTTC: true,
          statut: true,
          client: { select: { nom: true } },
        },
      }),

      this.prisma.notification.findMany({
        where: { entrepriseId },
        take: 8,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          message: true,
          lien: true,
          lu: true,
          createdAt: true,
        },
      }),

      this.prisma.$queryRaw<{ mois: number | bigint; total: number }[]>`
        SELECT
          EXTRACT(MONTH FROM "datePaiement")::int AS mois,
          SUM(montant)::float AS total
        FROM paiements
        WHERE "entrepriseId" = ${entrepriseId}
          AND "datePaiement" >= ${startOfYear}
        GROUP BY EXTRACT(MONTH FROM "datePaiement")
        ORDER BY mois
      `,
    ]);

    // ── Devis stats ───────────────────────────────────────────────────────────
    const devis = {
      total: 0,
      brouillon: 0,
      envoye: 0,
      vu: 0,
      accepte: 0,
      refuse: 0,
      tauxAcceptation: 0,
    };
    for (const row of devisGrouped) {
      devis.total += row._count._all;
      if (row.statut === StatutDevis.BROUILLON) devis.brouillon = row._count._all;
      else if (row.statut === StatutDevis.ENVOYE) devis.envoye = row._count._all;
      else if (row.statut === StatutDevis.VU) devis.vu = row._count._all;
      else if (row.statut === StatutDevis.ACCEPTE) devis.accepte = row._count._all;
      else if (row.statut === StatutDevis.REFUSE) devis.refuse = row._count._all;
    }
    const decided = devis.accepte + devis.refuse;
    devis.tauxAcceptation =
      decided > 0 ? Math.round((devis.accepte / decided) * 1000) / 10 : 0;

    // ── Factures stats ────────────────────────────────────────────────────────
    const factures = {
      total: 0,
      brouillon: 0,
      envoyee: 0,
      payee: 0,
      partielle: 0,
      enRetard: 0,
      totalRevenus: 0,
    };
    for (const row of facturesGrouped) {
      factures.total += row._count._all;
      const paye = Number(row._sum.montantPaye ?? 0);
      if (row.statut === StatutFacture.BROUILLON) factures.brouillon = row._count._all;
      else if (row.statut === StatutFacture.ENVOYEE) factures.envoyee = row._count._all;
      else if (row.statut === StatutFacture.PAYEE) {
        factures.payee = row._count._all;
        factures.totalRevenus += paye;
      } else if (row.statut === StatutFacture.PARTIELLE) {
        factures.partielle = row._count._all;
        factures.totalRevenus += paye;
      } else if (row.statut === StatutFacture.EN_RETARD) {
        factures.enRetard = row._count._all;
      }
    }

    // ── Paiements stats ───────────────────────────────────────────────────────
    const totalRecu = Number(paiementsTotal._sum.montant ?? 0);
    const ceMois = Number(paiementsThisMonth._sum.montant ?? 0);
    const moisDernier = Number(paiementsLastMonth._sum.montant ?? 0);
    const count = paiementsTotal._count;
    const moyenne = count > 0 ? Math.round(totalRecu / count) : 0;
    const evolution =
      moisDernier > 0
        ? Math.round(((ceMois - moisDernier) / moisDernier) * 1000) / 10
        : ceMois > 0
        ? 100
        : 0;

    // ── Monthly revenue chart (12 months) ─────────────────────────────────────
    const monthMap = new Map<number, number>(
      monthlyRevenue.map((r) => [Number(r.mois), Number(r.total)]),
    );
    const revenueMensuel = MOIS_FR.map((mois, i) => ({
      mois,
      valeur: monthMap.get(i + 1) ?? 0,
    }));

    return {
      clients: {
        total: totalClients,
        nouveauxCeMois: newClientsThisMonth,
        actifs: activeClients,
      },
      devis,
      factures,
      paiements: { total: totalRecu, ceMois, moisDernier, moyenne, count },
      revenus: { mensuel: revenueMensuel, ceMois, moisDernier, evolution },
      facturesRecentes: recentInvoices.map((f) => ({
        id: f.id,
        numero: f.numeroFacture,
        clientNom: f.client.nom,
        totalTTC: Number(f.totalTTC),
        statut: f.statut.toLowerCase(),
      })),
      activite: recentActivity,
    };
  }
}
