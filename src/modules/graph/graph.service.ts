import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GraphService {
  constructor(private prisma: PrismaService) {}

  async getGraphData(entrepriseId: string) {
    const [clients, devis, factures, bonsLivraison, paiements] = await Promise.all([
      this.prisma.client.findMany({
        where: { entrepriseId },
        select: { id: true, nom: true, prenom: true, typeClient: true },
      }),
      this.prisma.devis.findMany({
        where: { entrepriseId },
        select: { id: true, reference: true, statut: true, totalTTC: true, clientId: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
      this.prisma.facture.findMany({
        where: { entrepriseId },
        select: { id: true, numeroFacture: true, statut: true, totalTTC: true, clientId: true, devisId: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
      this.prisma.bonLivraison.findMany({
        where: { entrepriseId },
        select: { id: true, reference: true, statut: true, clientId: true, devisId: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
      this.prisma.paiement.findMany({
        where: { facture: { entrepriseId } },
        select: { id: true, montant: true, factureId: true, createdAt: true, modePaiement: true },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
    ]);

    const nodes = [
      ...clients.map(c => ({
        id: `client-${c.id}`,
        type: 'client' as const,
        rawId: c.id,
        label: c.prenom ? `${c.prenom} ${c.nom}` : c.nom,
        sublabel: c.typeClient,
        status: null as string | null,
        amount: null as number | null,
      })),
      ...devis.map(d => ({
        id: `devis-${d.id}`,
        type: 'devis' as const,
        rawId: d.id,
        label: d.reference,
        sublabel: null,
        status: d.statut,
        amount: Number(d.totalTTC),
      })),
      ...factures.map(f => ({
        id: `facture-${f.id}`,
        type: 'facture' as const,
        rawId: f.id,
        label: f.numeroFacture,
        sublabel: null,
        status: f.statut,
        amount: Number(f.totalTTC),
      })),
      ...bonsLivraison.map(b => ({
        id: `bl-${b.id}`,
        type: 'bl' as const,
        rawId: b.id,
        label: b.reference,
        sublabel: null,
        status: b.statut,
        amount: null,
      })),
      ...paiements.map(p => ({
        id: `paiement-${p.id}`,
        type: 'paiement' as const,
        rawId: p.id,
        label: `${Number(p.montant).toFixed(0)} MAD`,
        sublabel: p.modePaiement,
        status: null,
        amount: Number(p.montant),
      })),
    ];

    const edges = [
      ...devis.map(d => ({
        id: `e-c${d.clientId}-d${d.id}`,
        source: `client-${d.clientId}`,
        target: `devis-${d.id}`,
        edgeType: 'client-devis',
      })),
      ...factures.filter(f => !f.devisId).map(f => ({
        id: `e-c${f.clientId}-f${f.id}`,
        source: `client-${f.clientId}`,
        target: `facture-${f.id}`,
        edgeType: 'client-facture',
      })),
      ...factures.filter(f => f.devisId).map(f => ({
        id: `e-d${f.devisId}-f${f.id}`,
        source: `devis-${f.devisId}`,
        target: `facture-${f.id}`,
        edgeType: 'devis-facture',
      })),
      ...bonsLivraison.filter(b => !b.devisId).map(b => ({
        id: `e-c${b.clientId}-b${b.id}`,
        source: `client-${b.clientId}`,
        target: `bl-${b.id}`,
        edgeType: 'client-bl',
      })),
      ...bonsLivraison.filter(b => b.devisId).map(b => ({
        id: `e-d${b.devisId}-b${b.id}`,
        source: `devis-${b.devisId}`,
        target: `bl-${b.id}`,
        edgeType: 'devis-bl',
      })),
      ...paiements.map(p => ({
        id: `e-f${p.factureId}-p${p.id}`,
        source: `facture-${p.factureId}`,
        target: `paiement-${p.id}`,
        edgeType: 'facture-paiement',
      })),
    ];

    return { nodes, edges };
  }
}
