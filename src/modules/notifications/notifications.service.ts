import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeNotification } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';

type CategorieEmail = 'devis' | 'factures' | 'paiements' | 'systeme';

const CATEGORIE_PAR_TYPE: Record<TypeNotification, CategorieEmail> = {
  DEVIS_ENVOYE:       'devis',
  DEVIS_ACCEPTE:      'devis',
  DEVIS_REFUSE:       'devis',
  DEVIS_VU:           'devis',
  FACTURE_CREEE:      'factures',
  FACTURE_ENVOYEE:    'factures',
  FACTURE_VUE:        'factures',
  FACTURE_PAYEE:      'factures',
  FACTURE_PARTIELLE:  'factures',
  PAIEMENT_RECU:      'paiements',
  DECLARATION_RECUE:  'paiements',
  RAPPEL_ECHEANCE:    'systeme',
};

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async creerEtEnvoyer(data: {
    entrepriseId: string;
    type: TypeNotification;
    message: string;
    lien?: string;
  }) {
    await this.prisma.notification.create({ data });

    const categorie = CATEGORIE_PAR_TYPE[data.type];
    const admins = await this.prisma.utilisateur.findMany({
      where: { entrepriseId: data.entrepriseId, actif: true, role: 'ADMIN' },
      include: { preferencesNotification: true },
    });

    for (const admin of admins) {
      const prefs = admin.preferencesNotification;
      if (!prefs?.emailNotifications) continue;

      const categorieActive =
        categorie === 'devis'      ? prefs.notificationsDevis :
        categorie === 'factures'   ? prefs.notificationsFactures :
        categorie === 'paiements'  ? prefs.notificationsPaiements :
        prefs.notificationsSysteme;

      if (!categorieActive) continue;

      this.emailService.sendNotificationEmail({
        toEmail: admin.email,
        toName: admin.nom,
        message: data.message,
        lien: data.lien,
      });
    }
  }

  async listerNotifications(entrepriseId: string, nonLusSeulement?: boolean) {
    return this.prisma.notification.findMany({
      where: {
        entrepriseId,
        ...(nonLusSeulement && { lu: false }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async compterNonLues(entrepriseId: string) {
    const count = await this.prisma.notification.count({
      where: { entrepriseId, lu: false },
    });
    return { nonLues: count };
  }

  async marquerCommeLue(id: string, entrepriseId: string) {
    const notif = await this.prisma.notification.findFirst({
      where: { id, entrepriseId },
    });
    if (!notif) throw new NotFoundException('Notification introuvable.');

    return this.prisma.notification.update({
      where: { id },
      data: { lu: true },
    });
  }

  async marquerToutesCommeLues(entrepriseId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { entrepriseId, lu: false },
      data: { lu: true },
    });
    return { message: `${result.count} notification(s) marquée(s) comme lue(s).` };
  }

  async supprimerNotification(id: string, entrepriseId: string) {
    const notif = await this.prisma.notification.findFirst({
      where: { id, entrepriseId },
    });
    if (!notif) throw new NotFoundException('Notification introuvable.');

    await this.prisma.notification.delete({ where: { id } });
    return { message: 'Notification supprimée.' };
  }

  async supprimerToutesNotifications(entrepriseId: string) {
    const result = await this.prisma.notification.deleteMany({ where: { entrepriseId } });
    return { message: `${result.count} notification(s) supprimée(s).` };
  }
}
