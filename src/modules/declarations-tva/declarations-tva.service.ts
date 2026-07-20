import { Injectable } from '@nestjs/common';
import { StatutFacture } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

function toMAD(amount: number, devise: string, tauxEUR?: number, tauxUSD?: number): number {
  if (devise === 'EUR' && tauxEUR) return amount * tauxEUR;
  if (devise === 'USD' && tauxUSD) return amount * tauxUSD;
  return amount;
}

@Injectable()
export class DeclarationsTVAService {
  constructor(private prisma: PrismaService) {}

  async calculer(
    entrepriseId: string,
    debutPeriode: string,
    finPeriode: string,
    tauxEUR?: number,
    tauxUSD?: number,
  ) {
    const debut = new Date(debutPeriode);
    const fin   = new Date(`${finPeriode}T23:59:59.999Z`);

    const entreprise = await this.prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: { regimeTVA: true, tauxEUR: true, tauxUSD: true, nom: true },
    });

    const regime  = entreprise?.regimeTVA ?? 'ENCAISSEMENTS';
    const rateEUR = tauxEUR ?? entreprise?.tauxEUR ?? undefined;
    const rateUSD = tauxUSD ?? entreprise?.tauxUSD ?? undefined;

    // Groups: taux → { baseHT, tva, count }
    const groups = new Map<number, { baseHT: number; tva: number; count: number }>();
    const conversions = new Map<string, { count: number; totalOriginal: number; totalMAD: number; taux: number }>();
    const facturesPartielles: { numero: string; totalTTC: number; montantPaye: number; restant: number; devise: string }[] = [];
    const devises = new Set<string>();

    const addToGroup = (taux: number, baseHT: number, tva: number) => {
      const g = groups.get(taux) ?? { baseHT: 0, tva: 0, count: 0 };
      g.baseHT += baseHT;
      g.tva    += tva;
      g.count  += 1;
      groups.set(taux, g);
    };

    const trackConversion = (devise: string, original: number, mad: number, taux: number) => {
      if (devise === 'MAD') return;
      devises.add(devise);
      const c = conversions.get(devise) ?? { count: 0, totalOriginal: 0, totalMAD: 0, taux };
      c.count         += 1;
      c.totalOriginal += original;
      c.totalMAD      += mad;
      conversions.set(devise, c);
    };

    if (regime === 'ENCAISSEMENTS') {
      const paiements = await this.prisma.paiement.findMany({
        where: { entrepriseId, datePaiement: { gte: debut, lte: fin } },
        select: {
          montant: true,
          facture: { select: { taxe: true, devise: true, numeroFacture: true, totalTTC: true, montantPaye: true, statut: true } },
        },
      });

      for (const p of paiements) {
        const f       = p.facture;
        const devise  = f.devise ?? 'MAD';
        const montant = Number(p.montant);
        const mad     = toMAD(montant, devise, rateEUR, rateUSD);
        const taux    = Number(f.taxe) || 0;
        const baseHT  = mad / (1 + taux / 100);
        const tva     = mad - baseHT;

        addToGroup(taux, baseHT, tva);
        trackConversion(devise, montant, mad, devise === 'EUR' ? (rateEUR ?? 0) : (rateUSD ?? 0));

        if (f.statut === StatutFacture.PARTIELLE) {
          const totalTTC   = Number(f.totalTTC);
          const montantPaye = Number(f.montantPaye);
          const restant    = Math.max(0, totalTTC - montantPaye);
          if (!facturesPartielles.find(x => x.numero === f.numeroFacture)) {
            facturesPartielles.push({ numero: f.numeroFacture, totalTTC, montantPaye, restant, devise });
          }
        }
      }
    } else {
      // DÉBITS
      const factures = await this.prisma.facture.findMany({
        where: {
          entrepriseId,
          createdAt: { gte: debut, lte: fin },
          statut: { notIn: [StatutFacture.BROUILLON, StatutFacture.ANNULEE] },
        },
        select: { taxe: true, totalHT: true, totalTTC: true, devise: true, numeroFacture: true, montantPaye: true, statut: true },
      });

      for (const f of factures) {
        const devise  = f.devise ?? 'MAD';
        const totalHT  = Number(f.totalHT);
        const totalTTC = Number(f.totalTTC);
        const taux     = Number(f.taxe) || 0;
        const htMAD    = toMAD(totalHT, devise, rateEUR, rateUSD);
        const ttcMAD   = toMAD(totalTTC, devise, rateEUR, rateUSD);
        const tva      = ttcMAD - htMAD;

        addToGroup(taux, htMAD, tva);
        trackConversion(devise, totalTTC, ttcMAD, devise === 'EUR' ? (rateEUR ?? 0) : (rateUSD ?? 0));

        if (f.statut === StatutFacture.PARTIELLE) {
          facturesPartielles.push({
            numero: f.numeroFacture,
            totalTTC,
            montantPaye: Number(f.montantPaye),
            restant: Math.max(0, totalTTC - Number(f.montantPaye)),
            devise,
          });
        }
      }
    }

    const groupes = Array.from(groups.entries())
      .map(([taux, g]) => ({ taux, baseHT: Math.round(g.baseHT * 100) / 100, tva: Math.round(g.tva * 100) / 100, count: g.count }))
      .sort((a, b) => a.taux - b.taux);

    const totalBaseHT = groupes.reduce((s, g) => s + g.baseHT, 0);
    const totalTVA    = groupes.reduce((s, g) => s + g.tva, 0);

    return {
      regime,
      entrepriseNom: entreprise?.nom ?? '',
      periode: { debut: debutPeriode, fin: finPeriode },
      groupes,
      totalBaseHT: Math.round(totalBaseHT * 100) / 100,
      totalTVA:    Math.round(totalTVA * 100) / 100,
      hasMultiDevise: devises.size > 0,
      devises: Array.from(devises),
      tauxUtilises: { EUR: rateEUR, USD: rateUSD },
      conversions: Array.from(conversions.entries()).map(([devise, c]) => ({ devise, ...c })),
      facturesPartielles,
    };
  }
}
