import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { PrismaService } from '../../prisma/prisma.service';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);
  private readonly logger = new Logger(ContactService.name);

  constructor(private prisma: PrismaService) {}

  async submit(dto: ContactDto, ip?: string, userAgent?: string) {
    await this.prisma.contactSubmission.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        company: dto.company,
        subject: dto.subject,
        message: dto.message,
        ip,
        userAgent,
      },
    });

    // Non-blocking — errors are logged, not thrown
    this.sendEmail(dto, ip, userAgent);

    return { message: 'Message envoyé avec succès.' };
  }

  private async sendEmail(dto: ContactDto, ip?: string, userAgent?: string) {
    const date = new Date().toLocaleString('fr-MA', {
      timeZone: 'Africa/Casablanca',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const row = (label: string, value?: string | null) =>
      value
        ? `<tr>
            <td style="padding:8px 12px;font-size:13px;color:#64748b;font-weight:600;white-space:nowrap;width:130px;">${label}</td>
            <td style="padding:8px 12px;font-size:13px;color:#0f172a;border-left:1px solid #e2e8f0;">${value}</td>
           </tr>`
        : '';

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Nouveau contact Sayerli</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#0d9488);padding:28px 40px;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:10px;display:inline-block;text-align:center;line-height:36px;">
                  <span style="color:#fff;font-weight:900;font-size:18px;">S</span>
                </div>
                <span style="color:#fff;font-size:22px;font-weight:900;letter-spacing:-0.5px;vertical-align:middle;">sayerli</span>
              </div>
              <p style="margin:12px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Nouveau message de contact</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#0f172a;">📬 Nouveau contact</h2>
              <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Un visiteur a soumis le formulaire de contact sur sayerli.ma</p>

              <!-- Contact details table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <tbody>
                  ${row('Nom', dto.name)}
                  ${row('Email', `<a href="mailto:${dto.email}" style="color:#2563eb;text-decoration:none;">${dto.email}</a>`)}
                  ${dto.phone ? row('Téléphone', dto.phone) : ''}
                  ${dto.company ? row('Entreprise', dto.company) : ''}
                  ${row('Sujet', dto.subject)}
                </tbody>
              </table>

              <!-- Message -->
              <h3 style="margin:0 0 10px;font-size:14px;font-weight:600;color:#475569;text-transform:uppercase;letter-spacing:0.5px;">Message</h3>
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #2563eb;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0;font-size:14px;color:#0f172a;line-height:1.7;white-space:pre-wrap;">${dto.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
              </div>

              <!-- Reply CTA -->
              <div style="text-align:center;margin-bottom:24px;">
                <a href="mailto:${dto.email}?subject=Re: ${encodeURIComponent(dto.subject)}"
                   style="display:inline-block;background:linear-gradient(135deg,#2563eb,#0d9488);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 32px;border-radius:10px;">
                  Répondre à ${dto.name}
                </a>
              </div>
            </td>
          </tr>

          <!-- Meta footer -->
          <tr>
            <td style="background:#f1f5f9;padding:16px 40px;border-top:1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:11px;color:#94a3b8;">
                    📅 ${date}
                    ${ip ? ` &nbsp;·&nbsp; 🌍 IP: ${ip}` : ''}
                  </td>
                </tr>
                ${userAgent ? `<tr><td style="font-size:10px;color:#cbd5e1;padding-top:4px;word-break:break-all;">🖥 ${userAgent.substring(0, 120)}</td></tr>` : ''}
              </table>
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
        from: 'onboarding@resend.dev',
        to: 'karrassi.hamza@gmail.com',
        subject: `[Nouveau Contact Sayerli] ${dto.subject}`,
        html,
      });
      if (error) this.logger.error(`Resend error: ${JSON.stringify(error)}`);
    } catch (err) {
      this.logger.error(`Failed to send contact email: ${err}`);
    }
  }
}
