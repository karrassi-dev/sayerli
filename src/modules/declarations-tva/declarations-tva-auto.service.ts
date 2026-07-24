import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RoleType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DeclarationsTVAService } from './declarations-tva.service';
import { DeclarationTVAPDFService } from './declarations-tva-pdf.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class DeclarationsTVAAutoService {
  private readonly logger = new Logger(DeclarationsTVAAutoService.name);

  constructor(
    private prisma: PrismaService,
    private declarationsService: DeclarationsTVAService,
    private pdfService: DeclarationTVAPDFService,
    private emailService: EmailService,
  ) {}

  // Runs on the 19th of each month at 07:00 UTC (08:00 Morocco)
  @Cron('0 7 19 * *')
  async envoyerDeclarationsAutomatiques() {
    this.logger.log('Running automatic TVA declaration cron job...');

    const now = new Date();
    const year  = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = now.getMonth() === 0 ? 12 : now.getMonth(); // 1-based previous month

    const debutDate = new Date(year, month - 1, 1);
    const finDate   = new Date(year, month, 0);
    const debut = debutDate.toISOString().split('T')[0];
    const fin   = finDate.toISOString().split('T')[0];

    const moisLabel = debutDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const deadline  = `20 ${now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;

    // Get all active proprietaires with an email
    const proprietaires = await this.prisma.utilisateur.findMany({
      where: {
        role: RoleType.PROPRIETAIRE,
        actif: true,
        email: { not: '' },
      },
      select: {
        email: true,
        nom: true,
        prenom: true,
        entrepriseId: true,
        entreprise: {
          select: { nom: true, tauxEUR: true, tauxUSD: true },
        },
      },
    });

    let sent = 0;

    for (const user of proprietaires) {
      try {
        const result = await this.declarationsService.calculer(
          user.entrepriseId,
          debut,
          fin,
          user.entreprise.tauxEUR ?? undefined,
          user.entreprise.tauxUSD ?? undefined,
        );

        // Skip if nothing to declare
        if (result.groupes.length === 0 && result.groupesDepenses.length === 0) continue;

        const generatedAt = now.toLocaleDateString('fr-MA', {
          day: '2-digit', month: '2-digit', year: 'numeric',
        });

        const pdfBuffer = await this.pdfService.generate({
          entrepriseNom:       result.entrepriseNom,
          periode:             result.periode,
          regime:              result.regime,
          groupes:             result.groupes,
          totalBaseHT:         result.totalBaseHT,
          totalTVA:            result.totalTVA,
          groupesDepenses:     result.groupesDepenses,
          totalBaseHTDepenses: result.totalBaseHTDepenses,
          totalTVADeductible:  result.totalTVADeductible,
          totalTVANette:       result.totalTVANette,
          generatedAt,
        });

        const prenom = user.prenom ?? user.nom;

        await this.emailService.sendDeclarationTVAEmail({
          toEmail:             user.email,
          prenom,
          entrepriseNom:       result.entrepriseNom,
          moisLabel,
          deadline,
          totalTVA:            result.totalTVA,
          totalTVADeductible:  result.totalTVADeductible,
          totalTVANette:       result.totalTVANette,
          debut,
          fin,
          pdfBuffer,
        });

        sent++;
        this.logger.log(`TVA declaration sent to ${user.email} (${result.entrepriseNom})`);
      } catch (err) {
        this.logger.error(`Failed to send TVA declaration for entreprise ${user.entrepriseId}: ${err}`);
      }
    }

    this.logger.log(`TVA declaration cron finished — ${sent} email(s) sent.`);
  }
}
