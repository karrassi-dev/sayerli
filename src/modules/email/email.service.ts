import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);
  private readonly from = 'onboarding@resend.dev';
  private readonly frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  private readonly logger = new Logger(EmailService.name);

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
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;">
                  <span style="color:#fff;font-weight:900;font-size:18px;">S</span>
                </div>
                <span style="color:#fff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">sayerli</span>
              </div>
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
}
