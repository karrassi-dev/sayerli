import { Injectable } from '@nestjs/common';
import { StatutDevis, StatutFacture, TypeClient } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const MOIS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

@Injectable()
export class DashboardAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics(entrepriseId: string, typeClient?: TypeClient) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const clientFilter = typeClient ? { typeClient } : {};
    const clientWhere  = { entrepriseId, ...clientFilter };
    const devisWhere   = { entrepriseId, ...(typeClient ? { client: { typeClient } } : {}) };
    const factureWhere = { entrepriseId, ...(typeClient ? { client: { typeClient } } : {}) };
    const paiementWhere = {
      entrepriseId,
      ...(typeClient ? { facture: { client: { typeClient } } } : {}),
    };

    const EN_ATTENTE_STATUTS = [
      StatutFacture.ENVOYEE,
      StatutFacture.VUE,
      StatutFacture.EN_RETARD,
      StatutFacture.PARTIELLE,
    ];

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
      caEnAttenteAgg,
      top5Raw,
      facturesEnRetardList,
    ] = await Promise.all([
      this.prisma.client.count({ where: clientWhere }),

      this.prisma.client.count({
        where: { ...clientWhere, createdAt: { gte: startOfMonth } },
      }),

      this.prisma.client.count({ where: { ...clientWhere, actif: true } }),

      this.prisma.devis.groupBy({
        by: ['statut'],
        where: devisWhere,
        _count: { _all: true },
      }),

      this.prisma.facture.groupBy({
        by: ['statut'],
        where: factureWhere,
        _count: { _all: true },
        _sum: { montantPaye: true },
      }),

      this.prisma.paiement.aggregate({
        where: paiementWhere,
        _sum: { montant: true },
        _count: true,
      }),

      this.prisma.paiement.aggregate({
        where: { ...paiementWhere, datePaiement: { gte: startOfMonth } },
        _sum: { montant: true },
      }),

      this.prisma.paiement.aggregate({
        where: {
          ...paiementWhere,
          datePaiement: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { montant: true },
      }),

      this.prisma.facture.findMany({
        where: factureWhere,
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

      // CA en attente: outstanding amount (totalTTC - montantPaye) for unpaid factures
      this.prisma.facture.aggregate({
        where: { ...factureWhere, statut: { in: EN_ATTENTE_STATUTS } },
        _sum: { totalTTC: true, montantPaye: true },
      }),

      // Top 5 clients by total billed
      this.prisma.facture.groupBy({
        by: ['clientId'],
        where: {
          ...factureWhere,
          statut: { notIn: [StatutFacture.BROUILLON, StatutFacture.ANNULEE] },
        },
        _sum: { totalTTC: true },
        orderBy: { _sum: { totalTTC: 'desc' } },
        take: 5,
      }),

      // Factures en retard with client info
      this.prisma.facture.findMany({
        where: { ...factureWhere, statut: StatutFacture.EN_RETARD },
        take: 5,
        orderBy: { dateEcheance: 'asc' },
        select: {
          id: true,
          numeroFacture: true,
          totalTTC: true,
          montantPaye: true,
          dateEcheance: true,
          publicToken: true,
          client: { select: { nom: true, telephone: true } },
        },
      }),
    ]);

    // ── Top 5 clients — resolve names ────────────────────────────────────────
    const top5ClientIds = top5Raw.map(r => r.clientId);
    const top5ClientNames = top5ClientIds.length
      ? await this.prisma.client.findMany({
          where: { id: { in: top5ClientIds } },
          select: { id: true, nom: true },
        })
      : [];
    const clientNameMap = new Map(top5ClientNames.map(c => [c.id, c.nom]));
    const top5Clients = top5Raw.map(r => ({
      clientId: r.clientId,
      nom: clientNameMap.get(r.clientId) ?? '—',
      total: Number(r._sum.totalTTC ?? 0),
    }));

    // Monthly revenue — use Prisma aggregate so typeClient filter works cleanly
    const monthlyPaiements = await this.prisma.paiement.findMany({
      where: { ...paiementWhere, datePaiement: { gte: startOfYear } },
      select: { montant: true, datePaiement: true },
    });

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

    // ── CA en attente + taux de recouvrement ─────────────────────────────────
    const caEnAttente = Math.max(
      0,
      Number(caEnAttenteAgg._sum.totalTTC ?? 0) - Number(caEnAttenteAgg._sum.montantPaye ?? 0),
    );

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

    // ── Monthly revenue chart (12 months) ────────────────────────────────────
    const monthMap = new Map<number, number>();
    for (const p of monthlyPaiements) {
      const m = p.datePaiement.getMonth() + 1;
      monthMap.set(m, (monthMap.get(m) ?? 0) + Number(p.montant));
    }
    const revenueMensuel = MOIS_FR.map((mois, i) => ({
      mois,
      valeur: monthMap.get(i + 1) ?? 0,
    }));

    const totalFacturé = totalRecu + caEnAttente;
    const tauxRecouvrement = totalFacturé > 0
      ? Math.round((totalRecu / totalFacturé) * 1000) / 10
      : 0;

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
      caEnAttente,
      tauxRecouvrement,
      top5Clients,
      facturesEnRetard: facturesEnRetardList.map(f => ({
        id: f.id,
        numero: f.numeroFacture,
        clientNom: f.client.nom,
        clientTelephone: f.client.telephone,
        totalTTC: Number(f.totalTTC),
        montantPaye: Number(f.montantPaye),
        dateEcheance: f.dateEcheance?.toISOString() ?? null,
        publicToken: f.publicToken,
      })),
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
