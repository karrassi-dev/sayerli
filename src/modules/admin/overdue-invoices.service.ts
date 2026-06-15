import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OverdueInvoicesService {
  private readonly logger = new Logger(OverdueInvoicesService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async markOverdueAndNotify() {
    const now = new Date();

    const overdue = await this.prisma.facture.findMany({
      where: {
        dateEcheance: { lt: now },
        statut: { in: ['ENVOYEE', 'VUE', 'PARTIELLE'] },
      },
      select: {
        id: true,
        numeroFacture: true,
        entrepriseId: true,
        dateEcheance: true,
      },
    });

    if (overdue.length === 0) return;

    // Mark all as EN_RETARD in one query
    await this.prisma.facture.updateMany({
      where: { id: { in: overdue.map(f => f.id) } },
      data: { statut: 'EN_RETARD' },
    });

    // One notification per invoice
    for (const facture of overdue) {
      const echeance = facture.dateEcheance!.toLocaleDateString('fr-MA', {
        day: '2-digit', month: 'long', year: 'numeric',
      });

      await this.notificationsService.creerEtEnvoyer({
        entrepriseId: facture.entrepriseId,
        type: 'RAPPEL_ECHEANCE',
        message: `La facture ${facture.numeroFacture} est en retard de paiement (échéance : ${echeance}).`,
        lien: `/dashboard/factures`,
      });
    }

    this.logger.log(`Marked ${overdue.length} invoice(s) as EN_RETARD and sent reminders.`);
  }
}
