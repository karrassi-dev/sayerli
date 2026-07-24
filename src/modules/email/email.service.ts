import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);
  private readonly from = 'Sayerli <invitations@sayerli.com>';
  private readonly frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  private readonly logoUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/sayerlilogopng.png`;
  private readonly logger = new Logger(EmailService.name);

  async sendConfirmationEmail(opts: { toEmail: string; toName: string; token: string }) {
    const link = `${this.frontendUrl}/confirmation-email/${opts.token}`;
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Confirmez votre email - Sayerli</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#0d9488);padding:32px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    <img src="${this.logoUrl}" alt="Sayerli" width="38" height="38" style="display:block;border-radius:8px;border:0;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">Sayerl</span><span style="color:#06D6B0;font-size:24px;font-weight:900;letter-spacing:-0.5px;">i</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">
                Confirmez votre adresse email
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
                Bonjour <strong style="color:#0f172a;">${opts.toName}</strong>,<br/>
                Merci de vous être inscrit sur Sayerli. Cliquez sur le bouton ci-dessous pour activer votre compte.
              </p>
              <div style="text-align:center;margin-bottom:28px;">
                <a href="${link}"
                   style="display:inline-block;background:linear-gradient(135deg,#2563eb,#0d9488);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 40px;border-radius:12px;letter-spacing:0.2px;">
                  Confirmer mon email
                </a>
              </div>
              <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;text-align:center;">
                Ce lien est valide pendant <strong>24 heures</strong>.
              </p>
              <p style="margin:0;font-size:12px;color:#cbd5e1;text-align:center;word-break:break-all;">
                ${link}
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                Sayerli · Logiciel de gestion pour PME marocaines<br/>
                Si vous n'avez pas créé de compte, ignorez cet email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to: opts.toEmail,
        subject: 'Confirmez votre adresse email — Sayerli',
        html,
      });
      if (error) this.logger.error(`Resend error: ${JSON.stringify(error)}`);
    } catch (err) {
      this.logger.error(`Failed to send confirmation email: ${err}`);
    }
  }

  async sendResetPasswordEmail(opts: { toEmail: string; toName: string; token: string }) {
    const link = `${this.frontendUrl}/reset-password/${opts.token}`;
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Réinitialisation du mot de passe — Sayerli</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#0d9488);padding:32px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    <img src="${this.logoUrl}" alt="Sayerli" width="38" height="38" style="display:block;border-radius:8px;border:0;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">Sayerl</span><span style="color:#06D6B0;font-size:24px;font-weight:900;letter-spacing:-0.5px;">i</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">
                Réinitialisation du mot de passe
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
                Bonjour <strong style="color:#0f172a;">${opts.toName}</strong>,<br/>
                Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
              </p>
              <div style="text-align:center;margin-bottom:28px;">
                <a href="${link}"
                   style="display:inline-block;background:linear-gradient(135deg,#2563eb,#0d9488);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 40px;border-radius:12px;">
                  Réinitialiser mon mot de passe
                </a>
              </div>
              <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;text-align:center;">
                Ce lien est valide pendant <strong>1 heure</strong>.
              </p>
              <p style="margin:0;font-size:12px;color:#cbd5e1;text-align:center;word-break:break-all;">
                ${link}
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                Sayerli · Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to: opts.toEmail,
        subject: 'Réinitialisation de votre mot de passe — Sayerli',
        html,
      });
      if (error) this.logger.error(`Resend error: ${JSON.stringify(error)}`);
    } catch (err) {
      this.logger.error(`Failed to send reset password email: ${err}`);
    }
  }

  async sendNotificationEmail(opts: { toEmail: string; toName: string; message: string; lien?: string }) {
    const url = opts.lien ? `${this.frontendUrl}${opts.lien}` : this.frontendUrl;
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Notification Sayerli</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#0d9488);padding:28px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    <img src="${this.logoUrl}" alt="Sayerli" width="34" height="34" style="display:block;border-radius:8px;border:0;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">Sayerl</span><span style="color:#06D6B0;font-size:22px;font-weight:900;letter-spacing:-0.5px;">i</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 8px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Notification</p>
              <p style="margin:0 0 28px;font-size:16px;color:#0f172a;line-height:1.6;">${opts.message}</p>
              ${opts.lien ? `<div style="text-align:center;">
                <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#0d9488);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:12px 32px;border-radius:10px;">
                  Voir dans Sayerli
                </a>
              </div>` : ''}
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:16px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">Sayerli · Vous recevez cet email car les notifications sont activées dans vos paramètres.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to: opts.toEmail,
        subject: opts.message.length > 60 ? opts.message.substring(0, 57) + '...' : opts.message,
        html,
      });
      if (error) this.logger.error(`Resend error: ${JSON.stringify(error)}`);
    } catch (err) {
      this.logger.error(`Failed to send notification email: ${err}`);
    }
  }

  async sendReminderEmail(opts: {
    toEmail: string;
    clientNom: string;
    entrepriseNom: string;
    numeroFacture: string;
    montantTTC: number;
    montantPaye?: number;
    dateEcheance: Date | null;
    publicToken: string;
    level: 1 | 2 | 3;
  }) {
    const url = `${this.frontendUrl}/public/factures/${opts.publicToken}`;
    const fmt = (n: number) => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' MAD';
    const paye = opts.montantPaye ?? 0;
    const reste = Math.max(0, opts.montantTTC - paye);
    const resteStr = fmt(reste);
    const totalStr = fmt(opts.montantTTC);
    const payeStr = fmt(paye);
    const isPartial = paye > 0;
    const dateStr = opts.dateEcheance
      ? opts.dateEcheance.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
      : null;
    const levelLabel = opts.level === 1 ? '1er rappel' : opts.level === 2 ? '2ème rappel' : '3ème rappel';
    const urgency = opts.level === 3 ? 'urgent ' : '';

    const paymentBlock = isPartial
      ? `<tr>
           <td style="width:33%;padding-top:8px;border-top:1px solid #fecaca;">
             <p style="margin:0;font-size:12px;color:#94a3b8;">Total facture</p>
             <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#0f172a;">${totalStr}</p>
           </td>
           <td style="width:33%;padding-top:8px;border-top:1px solid #fecaca;">
             <p style="margin:0;font-size:12px;color:#94a3b8;">Déjà payé</p>
             <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#16a34a;">${payeStr}</p>
           </td>
           <td style="width:33%;padding-top:8px;border-top:1px solid #fecaca;">
             <p style="margin:0;font-size:12px;color:#94a3b8;">Reste à payer</p>
             <p style="margin:4px 0 0;font-size:16px;font-weight:800;color:#dc2626;">${resteStr}</p>
           </td>
         </tr>`
      : `<tr>
           <td style="width:50%;padding-top:8px;border-top:1px solid #fecaca;">
             <p style="margin:0;font-size:12px;color:#94a3b8;">Montant dû</p>
             <p style="margin:4px 0 0;font-size:16px;font-weight:800;color:#dc2626;">${resteStr}</p>
           </td>
           ${dateStr ? `<td style="width:50%;padding-top:8px;border-top:1px solid #fecaca;">
             <p style="margin:0;font-size:12px;color:#94a3b8;">Échéance</p>
             <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#0f172a;">${dateStr}</p>
           </td>` : ''}
         </tr>`;

    const introText = isPartial
      ? `Nous avons bien reçu votre paiement partiel de <strong style="color:#16a34a;">${payeStr}</strong>. Il reste un solde de <strong style="color:#dc2626;">${resteStr}</strong> à régler sur votre facture <strong>${opts.numeroFacture}</strong>.`
      : `Ceci est un rappel ${urgency}concernant la facture <strong>${opts.numeroFacture}</strong> d'un montant de <strong>${resteStr}</strong>, qui reste impayée à ce jour.`;

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Rappel de paiement — ${opts.numeroFacture}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#dc2626,#b91c1c);padding:28px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    <img src="${this.logoUrl}" alt="Sayerli" width="34" height="34" style="display:block;border-radius:8px;border:0;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">Sayerl</span><span style="color:#fca5a5;font-size:22px;font-weight:900;letter-spacing:-0.5px;">i</span>
                  </td>
                </tr>
              </table>
              <p style="margin:12px 0 0;color:#fecaca;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${levelLabel} — ${isPartial ? 'Solde restant' : 'Facture impayée'}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;">
                Rappel de paiement ${urgency}
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
                Bonjour <strong style="color:#0f172a;">${opts.clientNom}</strong>,<br/>
                ${introText}
              </p>
              <div style="background:#fef2f2;border:1.5px solid #fecaca;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:12px;">
                      <p style="margin:0;font-size:12px;color:#ef4444;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Facture</p>
                      <p style="margin:4px 0 0;font-size:18px;font-weight:800;color:#0f172a;">${opts.numeroFacture}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        ${paymentBlock}
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
              <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
                Nous vous prions de bien vouloir procéder au règlement ${isPartial ? 'du solde restant' : 'de cette facture'} dans les meilleurs délais. En cas de doute ou de difficulté, n'hésitez pas à contacter <strong style="color:#0f172a;">${opts.entrepriseNom}</strong>.
              </p>
              <div style="text-align:center;margin-bottom:8px;">
                <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 40px;border-radius:12px;letter-spacing:0.2px;">
                  Voir ma facture
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:16px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">Sayerli · Logiciel de gestion pour PME marocaines<br/>Ce message a été envoyé automatiquement par ${opts.entrepriseNom}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to: opts.toEmail,
        subject: `${opts.level === 3 ? '[URGENT] ' : ''}Rappel de paiement — ${opts.numeroFacture} (${resteStr} restant)`,
        html,
      });
      if (error) this.logger.error(`Resend error: ${JSON.stringify(error)}`);
    } catch (err) {
      this.logger.error(`Failed to send reminder email: ${err}`);
    }
  }

  async sendPaymentReceiptEmail(opts: {
    toEmail: string
    clientNom: string
    entrepriseNom: string
    numeroFacture: string
    montantCePaiement: number
    montantTotalPaye: number
    montantTotal: number
    netAPayer?: number
    montantRestant: number
    methodePaiement: string
    datePaiement: Date
    publicToken: string
    paiementId: string
    isFullyPaid: boolean
    devise?: string
    rasActif?: boolean
    rasTaux?: number
    rasMontant?: number
  }) {
    const url = `${this.frontendUrl}/public/factures/${opts.publicToken}/recu?p=${opts.paiementId}`
    const devise = opts.devise ?? 'MAD'
    const localeMap: Record<string, string> = { MAD: 'fr-MA', EUR: 'fr-FR', USD: 'en-US' }
    const locale = localeMap[devise] ?? 'fr-MA'
    const fmt = (n: number) =>
      new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' ' + devise
    const dateStr = opts.datePaiement.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

    const METHODE_LABELS: Record<string, string> = {
      VIREMENT: 'Virement bancaire',
      CASH: 'Espèces',
      CHEQUE: 'Chèque',
      CARTE: 'Carte bancaire',
      MOBILE: 'Mobile',
      AUTRE: 'Autre',
    }
    const methodeLabel = METHODE_LABELS[opts.methodePaiement] ?? opts.methodePaiement

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Confirmation de paiement — ${opts.numeroFacture}</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#16a34a,#0d9488);padding:32px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    <img src="${this.logoUrl}" alt="Sayerli" width="38" height="38" style="display:block;border-radius:8px;border:0;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">Sayerl</span><span style="color:#bbf7d0;font-size:24px;font-weight:900;letter-spacing:-0.5px;">i</span>
                  </td>
                </tr>
              </table>
              <p style="margin:12px 0 0;color:#bbf7d0;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                ${opts.isFullyPaid ? 'Facture entièrement réglée ✓' : 'Paiement reçu ✓'}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">
                ${opts.isFullyPaid ? 'Merci, votre paiement est confirmé !' : 'Paiement bien reçu'}
              </h1>
              <p style="margin:0 0 28px;font-size:15px;color:#64748b;line-height:1.6;">
                Bonjour <strong style="color:#0f172a;">${opts.clientNom}</strong>,<br/>
                ${opts.isFullyPaid
                  ? `<strong style="color:#0f172a;">${opts.entrepriseNom}</strong> confirme la réception de votre paiement. La facture <strong>${opts.numeroFacture}</strong> est désormais <strong style="color:#16a34a;">entièrement réglée</strong>.`
                  : `<strong style="color:#0f172a;">${opts.entrepriseNom}</strong> confirme la réception de votre paiement de <strong style="color:#16a34a;">${fmt(opts.montantCePaiement)}</strong> sur la facture <strong>${opts.numeroFacture}</strong>.`
                }
              </p>

              <!-- Payment detail card -->
              <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:24px;margin-bottom:28px;">
                <p style="margin:0 0 16px;font-size:12px;color:#16a34a;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Détail du paiement</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:10px;border-bottom:1px solid #dcfce7;">
                      <p style="margin:0;font-size:12px;color:#64748b;">Facture</p>
                      <p style="margin:3px 0 0;font-size:15px;font-weight:700;color:#0f172a;">${opts.numeroFacture}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width:50%;padding-right:8px;">
                            <p style="margin:0;font-size:12px;color:#64748b;">Montant reçu</p>
                            <p style="margin:3px 0 0;font-size:20px;font-weight:800;color:#16a34a;">${fmt(opts.montantCePaiement)}</p>
                          </td>
                          <td style="width:50%;padding-left:8px;">
                            <p style="margin:0;font-size:12px;color:#64748b;">Date</p>
                            <p style="margin:3px 0 0;font-size:14px;font-weight:600;color:#0f172a;">${dateStr}</p>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding-top:12px;">
                            <p style="margin:0;font-size:12px;color:#64748b;">Méthode</p>
                            <p style="margin:3px 0 0;font-size:14px;font-weight:600;color:#0f172a;">${methodeLabel}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:12px;border-top:1px solid #dcfce7;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width:50%;">
                            <p style="margin:0;font-size:12px;color:#64748b;">Total payé à ce jour</p>
                            <p style="margin:3px 0 0;font-size:14px;font-weight:700;color:#0f172a;">${fmt(opts.montantTotalPaye)}</p>
                          </td>
                          <td style="width:50%;">
                            <p style="margin:0;font-size:12px;color:#64748b;">Reste à payer</p>
                            <p style="margin:3px 0 0;font-size:14px;font-weight:700;color:${opts.isFullyPaid ? '#16a34a' : '#dc2626'};">
                              ${opts.isFullyPaid ? `0,00 ${devise} ✓` : fmt(opts.montantRestant)}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              ${opts.rasActif ? `
              <!-- RAS breakdown -->
              <div style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:10px;padding:14px 18px;margin-bottom:20px;">
                <p style="margin:0 0 10px;font-size:11px;color:#ea580c;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Retenue à la Source (RAS)</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:6px;border-bottom:1px solid #fed7aa;">
                      <span style="font-size:12px;color:#78350f;">Total TTC facture</span>
                      <span style="float:right;font-size:12px;font-weight:600;color:#78350f;">${fmt(opts.montantTotal)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;border-bottom:1px solid #fed7aa;">
                      <span style="font-size:12px;color:#ea580c;">RAS ${opts.rasTaux}% (versée à la DGI par votre client)</span>
                      <span style="float:right;font-size:12px;font-weight:600;color:#ea580c;">−${fmt(opts.rasMontant ?? 0)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:8px;">
                      <span style="font-size:13px;font-weight:800;color:#9a3412;">Net à vous verser</span>
                      <span style="float:right;font-size:13px;font-weight:800;color:#9a3412;">${fmt(opts.netAPayer ?? (opts.montantTotal - (opts.rasMontant ?? 0)))}</span>
                    </td>
                  </tr>
                </table>
              </div>` : ''}

              ${opts.isFullyPaid ? `
              <!-- Fully paid badge -->
              <div style="background:#dcfce7;border:1.5px solid #86efac;border-radius:12px;padding:16px 20px;margin-bottom:28px;text-align:center;">
                <p style="margin:0;font-size:18px;font-weight:800;color:#15803d;">✅ PAYÉ INTÉGRALEMENT</p>
                <p style="margin:6px 0 0;font-size:13px;color:#16a34a;">Merci pour votre confiance — ${opts.entrepriseNom}</p>
              </div>` : `
              <!-- Partial note -->
              <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:10px;padding:14px 18px;margin-bottom:28px;">
                <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
                  Il reste <strong>${fmt(opts.montantRestant)}</strong> à régler. Vous pouvez effectuer un nouveau paiement directement depuis votre facture en ligne.
                </p>
              </div>`}

              <!-- CTA -->
              <div style="text-align:center;">
                <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#16a34a,#0d9488);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 40px;border-radius:12px;letter-spacing:0.2px;">
                  ⬇ Télécharger mon reçu
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                Sayerli · Ce reçu a été généré automatiquement par <strong>${opts.entrepriseNom}</strong>.<br/>
                Conservez cet email comme preuve de paiement.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    try {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to: opts.toEmail,
        subject: opts.isFullyPaid
          ? `✅ Paiement confirmé — ${opts.numeroFacture} (Facture réglée)`
          : `✓ Reçu de paiement — ${opts.numeroFacture} (${fmt(opts.montantCePaiement)} reçus)`,
        html,
      })
      if (error) this.logger.error(`Resend error: ${JSON.stringify(error)}`)
    } catch (err) {
      this.logger.error(`Failed to send payment receipt email: ${err}`)
    }
  }

  async sendInvitation(opts: {
    toEmail: string;
    toName: string;
    entrepriseName: string;
    role: string;
    token: string;
  }) {
    const link = `${this.frontendUrl}/invitation/${opts.token}`;
    const roleLabel: Record<string, string> = {
      ADMIN: 'Administrateur',
      MANAGER: 'Manager',
      COMMERCIAL: 'Commercial',
      COMPTABLE: 'Comptable',
    };
    const roleFr = roleLabel[opts.role] ?? opts.role;

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Invitation Sayerli</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#0d9488);padding:32px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    <img src="${this.logoUrl}" alt="Sayerli" width="38" height="38" style="display:block;border-radius:8px;border:0;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">Sayerl</span><span style="color:#06D6B0;font-size:24px;font-weight:900;letter-spacing:-0.5px;">i</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">
                Vous avez été invité ! 🎉
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
                Bonjour <strong style="color:#0f172a;">${opts.toName}</strong>,<br/>
                <strong style="color:#0f172a;">${opts.entrepriseName}</strong> vous invite à rejoindre leur espace Sayerli en tant que <strong style="color:#2563eb;">${roleFr}</strong>.
              </p>

              <!-- Role badge -->
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
                <p style="margin:0;font-size:13px;color:#3b82f6;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Votre rôle</p>
                <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#1d4ed8;">${roleFr}</p>
              </div>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:28px;">
                <a href="${link}"
                   style="display:inline-block;background:linear-gradient(135deg,#2563eb,#0d9488);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 40px;border-radius:12px;letter-spacing:0.2px;">
                  Accepter l'invitation
                </a>
              </div>

              <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;text-align:center;">
                Ce lien est valide pendant <strong>7 jours</strong>.
              </p>
              <p style="margin:0;font-size:12px;color:#cbd5e1;text-align:center;word-break:break-all;">
                ${link}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                Sayerli · Logiciel de gestion pour PME marocaines<br/>
                Si vous n'attendiez pas cette invitation, ignorez cet email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to: opts.toEmail,
        subject: `Invitation à rejoindre ${opts.entrepriseName} sur Sayerli`,
        html,
      });
      if (error) this.logger.error(`Resend error: ${JSON.stringify(error)}`);
    } catch (err) {
      this.logger.error(`Failed to send invitation email: ${err}`);
    }
  }

  async sendDeclarationTVAEmail(opts: {
    toEmail: string;
    prenom: string;
    entrepriseNom: string;
    moisLabel: string;
    deadline: string;
    totalTVA: number;
    totalTVADeductible: number;
    totalTVANette: number;
    debut: string;
    fin: string;
    pdfBuffer: Buffer;
  }) {
    const fmt = (n: number) =>
      new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' MAD';
    const dashboardUrl = `${this.frontendUrl}/dashboard/declarations-tva`;

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Déclaration TVA — ${opts.moisLabel}</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#16a34a,#0d9488);padding:32px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    <img src="${this.logoUrl}" alt="Sayerli" width="38" height="38" style="display:block;border-radius:8px;border:0;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">Sayerl</span><span style="color:#bbf7d0;font-size:24px;font-weight:900;letter-spacing:-0.5px;">i</span>
                  </td>
                </tr>
              </table>
              <p style="margin:12px 0 0;color:#bbf7d0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                Déclaration TVA — ${opts.moisLabel}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;">
                Votre déclaration TVA est prête 📊
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
                Bonjour <strong style="color:#0f172a;">${opts.prenom}</strong>,<br/>
                Sayerli a calculé automatiquement votre TVA pour <strong>${opts.moisLabel}</strong>.
                Votre déclaration est en pièce jointe. Vous devez déclarer avant le <strong style="color:#dc2626;">${opts.deadline}</strong>.
              </p>

              <!-- Summary card -->
              <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:24px;margin-bottom:28px;">
                <p style="margin:0 0 16px;font-size:11px;color:#16a34a;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Résumé · ${opts.debut} au ${opts.fin}</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #dcfce7;">
                      <span style="font-size:13px;color:#374151;">TVA collectée (factures)</span>
                      <span style="float:right;font-size:13px;font-weight:700;color:#16a34a;">+${fmt(opts.totalTVA)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #dcfce7;">
                      <span style="font-size:13px;color:#374151;">TVA déductible (dépenses)</span>
                      <span style="float:right;font-size:13px;font-weight:700;color:#d97706;">-${fmt(opts.totalTVADeductible)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0 4px;">
                      <span style="font-size:15px;font-weight:800;color:#0f172a;">TVA nette à payer</span>
                      <span style="float:right;font-size:17px;font-weight:900;color:#1d4ed8;">${fmt(opts.totalTVANette)}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
                La déclaration complète (avec le détail par taux) est jointe en PDF.<br/>
                Connectez-vous à Sayerli pour recalculer ou ajuster la période si nécessaire.
              </p>

              <div style="text-align:center;">
                <a href="${dashboardUrl}" style="display:inline-block;background:linear-gradient(135deg,#16a34a,#0d9488);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 40px;border-radius:12px;">
                  Voir dans Sayerli
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                Sayerli · Logiciel de gestion pour PME marocaines<br/>
                Ce document est à titre indicatif — vérifiez auprès de votre comptable avant déclaration.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to: opts.toEmail,
        subject: `📊 Déclaration TVA ${opts.moisLabel} — ${fmt(opts.totalTVANette)} à déclarer avant le ${opts.deadline}`,
        html,
        attachments: [
          {
            filename: `declaration-tva-${opts.debut}-${opts.fin}.pdf`,
            content: opts.pdfBuffer,
          },
        ],
      });
      if (error) this.logger.error(`Resend error (TVA declaration): ${JSON.stringify(error)}`);
    } catch (err) {
      this.logger.error(`Failed to send TVA declaration email to ${opts.toEmail}: ${err}`);
    }
  }

  async sendJoinCompanyInvitation(opts: {
    toEmail: string;
    toName: string;
    entrepriseName: string;
    role: string;
    token: string;
  }) {
    const link = `${this.frontendUrl}/invitation/${opts.token}`;
    const roleLabel: Record<string, string> = {
      ADMIN: 'Administrateur', MANAGER: 'Manager', COMMERCIAL: 'Commercial', COMPTABLE: 'Comptable',
      DAF: 'Directeur Financier', COMPTABLE_EXTERNE: 'Comptable Externe',
      RESPONSABLE_RECOUVREMENT: 'Resp. Recouvrement', CAISSIER: 'Caissier',
      COMMERCIAL_PROPRE: 'Agent Commercial', ASSISTANT: 'Assistant', ASSOCIE: 'Associé',
    };
    const roleFr = roleLabel[opts.role] ?? opts.role;

    const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Rejoindre une entreprise — Sayerli</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#2563eb,#0d9488);padding:32px 40px;text-align:center;">
          <span style="color:#ffffff;font-size:24px;font-weight:900;">Sayerl</span><span style="color:#06D6B0;font-size:24px;font-weight:900;">i</span>
        </td></tr>
        <tr><td style="padding:40px;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">Nouvelle entreprise vous attend ! 🏢</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
            Bonjour <strong style="color:#0f172a;">${opts.toName}</strong>,<br/>
            <strong style="color:#0f172a;">${opts.entrepriseName}</strong> vous invite à rejoindre leur espace Sayerli en tant que <strong style="color:#2563eb;">${roleFr}</strong>.<br/><br/>
            <strong style="color:#059669;">Bonne nouvelle :</strong> Votre compte Sayerli existe déjà. Aucun nouveau mot de passe n'est nécessaire !
          </p>
          <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
            <p style="margin:0;font-size:13px;color:#16a34a;font-weight:600;">✓ Connexion avec votre mot de passe habituel</p>
          </div>
          <div style="text-align:center;margin-bottom:28px;">
            <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#0d9488);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 40px;border-radius:12px;">
              Rejoindre ${opts.entrepriseName}
            </a>
          </div>
          <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;text-align:center;">Ce lien est valide pendant <strong>7 jours</strong>.</p>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #f1f5f9;background:#f8fafc;text-align:center;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} Sayerli. Tous droits réservés.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    try {
      await this.resend.emails.send({
        from: this.from,
        to: opts.toEmail,
        subject: `Rejoignez ${opts.entrepriseName} sur Sayerli`,
        html,
      });
    } catch (err) {
      this.logger.error(`Failed to send join company invitation email: ${err}`);
    }
  }
}
