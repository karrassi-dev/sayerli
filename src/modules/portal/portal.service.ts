import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { StatutDevis, StatutFacture } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PortalService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async obtenirPortal(token: string) {
    const client = await this.prisma.client.findUnique({
      where: { portalToken: token },
      include: {
        entreprise: {
          select: {
            nom: true,
            logo: true,
            couleurPrimaire: true,
            email: true,
            telephone: true,
            adresse: true,
            website: true,
          },
        },
        devis: {
          where: {
            statut: { not: StatutDevis.BROUILLON },
          },
          select: {
            id: true,
            reference: true,
            statut: true,
            totalHT: true,
            remise: true,
            taxe: true,
            totalTTC: true,
            dateExpiration: true,
            dateAcceptation: true,
            dateRefus: true,
            createdAt: true,
            notes: true,
            lienPublic: { select: { token: true, expiration: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        factures: {
          where: {
            statut: {
              notIn: [StatutFacture.BROUILLON, StatutFacture.ANNULEE],
            },
          },
          select: {
            id: true,
            numeroFacture: true,
            statut: true,
            totalHT: true,
            taxe: true,
            totalTTC: true,
            montantPaye: true,
            dateEcheance: true,
            createdAt: true,
            publicToken: true,
            paiements: {
              select: {
                id: true,
                montant: true,
                methode: true,
                datePaiement: true,
                reference: true,
              },
              orderBy: { datePaiement: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!client || !client.actif) throw new NotFoundException('Portail introuvable.');

    // Never expose the portalToken or internal IDs beyond what the portal needs
    const { portalToken: _, entrepriseId: __, ...clientData } = client as typeof client & { portalToken: string; entrepriseId: string };
    return clientData;
  }

  async accepterDevis(portalToken: string, devisId: string) {
    // Verify client owns this portal
    const client = await this.prisma.client.findUnique({
      where: { portalToken },
      select: { id: true, actif: true, entrepriseId: true, nom: true },
    });

    if (!client || !client.actif) throw new NotFoundException('Portail introuvable.');

    // Verify devis belongs to this client (security: cross-reference)
    const devis = await this.prisma.devis.findFirst({
      where: { id: devisId, clientId: client.id },
    });

    if (!devis) throw new NotFoundException('Devis introuvable.');

    const acceptable: StatutDevis[] = [StatutDevis.ENVOYE, StatutDevis.VU];
    if (!acceptable.includes(devis.statut)) {
      throw new BadRequestException('Ce devis ne peut plus être accepté.');
    }

    await this.prisma.devis.update({
      where: { id: devisId },
      data: { statut: StatutDevis.ACCEPTE, dateAcceptation: new Date() },
    });

    this.notificationsService.creerEtEnvoyer({
      entrepriseId: client.entrepriseId,
      type: 'DEVIS_ACCEPTE',
      message: `Le devis ${devis.reference} a été accepté par ${client.nom} depuis le portail client.`,
      lien: `/dashboard/devis`,
    });

    return { statut: StatutDevis.ACCEPTE };
  }
}
