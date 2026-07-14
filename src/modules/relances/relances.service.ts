import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StatutFacture } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysBetween(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / MS_PER_DAY);
}

@Injectable()
export class RelancesService {
  private readonly logger = new Logger(RelancesService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // Runs daily at 08:00 Casablanca time (UTC+1 = 07:00 UTC)
  @Cron('0 7 * * *')
  async envoyerRelancesAutomatiques() {
    this.logger.log('Running automatic payment reminders cron job...');

    const factures = await this.prisma.facture.findMany({
      where: {
        statut: StatutFacture.EN_RETARD,
        dateEcheance: { not: null },
        client: { email: { not: null } },
      },
      select: {
        id: true,
        numeroFacture: true,
        totalTTC: true,
        montantPaye: true,
        dateEcheance: true,
        publicToken: true,
        lastReminderSentAt: true,
        client: { select: { nom: true, email: true } },
        entreprise: { select: { nom: true } },
      },
    });

    const now = new Date();
    let sent = 0;

    for (const facture of factures) {
      if (!facture.dateEcheance || !facture.client.email) continue;

      const daysSinceEcheance = daysBetween(now, facture.dateEcheance);
      const lastReminder = facture.lastReminderSentAt;
      const lastReminderDaysDiff = lastReminder
        ? daysBetween(lastReminder, facture.dateEcheance)
        : null;

      let level: 1 | 2 | 3 | null = null;

      // D+3: first reminder — no previous reminder sent
      if (daysSinceEcheance >= 3 && lastReminder === null) {
        level = 1;
      }
      // D+7: second reminder — last reminder was the D+3 one (3–6 days after echeance)
      else if (
        daysSinceEcheance >= 7 &&
        lastReminderDaysDiff !== null &&
        lastReminderDaysDiff >= 3 &&
        lastReminderDaysDiff < 7
      ) {
        level = 2;
      }
      // D+15: third reminder — last reminder was the D+7 one (7–14 days after echeance)
      else if (
        daysSinceEcheance >= 15 &&
        lastReminderDaysDiff !== null &&
        lastReminderDaysDiff >= 7 &&
        lastReminderDaysDiff < 15
      ) {
        level = 3;
      }

      if (!level) continue;

      await this.emailService.sendReminderEmail({
        toEmail: facture.client.email,
        clientNom: facture.client.nom,
        entrepriseNom: facture.entreprise.nom,
        numeroFacture: facture.numeroFacture,
        montantTTC: Number(facture.totalTTC),
        montantPaye: Number(facture.montantPaye),
        dateEcheance: facture.dateEcheance,
        publicToken: facture.publicToken,
        level,
      });

      await this.prisma.facture.update({
        where: { id: facture.id },
        data: { lastReminderSentAt: now },
      });

      this.logger.log(
        `Reminder level ${level} sent for facture ${facture.numeroFacture} (D+${daysSinceEcheance})`,
      );
      sent++;
    }

    this.logger.log(`Reminder cron finished — ${sent} email(s) sent.`);
  }
}
