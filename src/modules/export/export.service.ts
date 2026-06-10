import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exporterDonnees(
    entrepriseId: string,
    types: string[],
    dateDebut?: string,
    dateFin?: string,
  ) {
    const result: Record<string, unknown[]> = {};

    const baseDateFilter =
      dateDebut && dateFin
        ? {
            createdAt: {
              gte: new Date(dateDebut),
              lte: new Date(`${dateFin}T23:59:59.999Z`),
            },
          }
        : {};

    const paiementDateFilter =
      dateDebut && dateFin
        ? {
            datePaiement: {
              gte: new Date(dateDebut),
              lte: new Date(`${dateFin}T23:59:59.999Z`),
            },
          }
        : {};

    if (types.includes('clients')) {
      result.clients = await this.prisma.client.findMany({
        where: { entrepriseId, ...baseDateFilter },
        select: {
          nom: true,
          email: true,
          telephone: true,
          nomEntreprise: true,
          actif: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (types.includes('devis')) {
      result.devis = await this.prisma.devis.findMany({
        where: { entrepriseId, ...baseDateFilter },
        select: {
          reference: true,
          statut: true,
          totalHT: true,
          remise: true,
          taxe: true,
          totalTTC: true,
          createdAt: true,
          dateExpiration: true,
          client: { select: { nom: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (types.includes('factures')) {
      result.factures = await this.prisma.facture.findMany({
        where: { entrepriseId, ...baseDateFilter },
        select: {
          numeroFacture: true,
          statut: true,
          totalHT: true,
          taxe: true,
          totalTTC: true,
          montantPaye: true,
          dateEcheance: true,
          createdAt: true,
          client: { select: { nom: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (types.includes('paiements')) {
      result.paiements = await this.prisma.paiement.findMany({
        where: { entrepriseId, ...paiementDateFilter },
        select: {
          montant: true,
          methode: true,
          reference: true,
          datePaiement: true,
          notes: true,
          facture: {
            select: {
              numeroFacture: true,
              client: { select: { nom: true } },
            },
          },
        },
        orderBy: { datePaiement: 'desc' },
      });
    }

    return result;
  }
}
