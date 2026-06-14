import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  async forwardInboundEmail(data: any, headers: Record<string, string>) {
    const { email_id, from, to, subject } = data;

    try {
      // Verify webhook signature
      const secret = process.env.RESEND_WEBHOOK_SECRET;
      if (secret) {
        try {
          this.resend.webhooks.verify({
            payload: JSON.stringify({ type: 'email.received', data }),
            headers: {
              id: headers['svix-id'],
              timestamp: headers['svix-timestamp'],
              signature: headers['svix-signature'],
            },
            webhookSecret: secret,
          });
        } catch {
          this.logger.warn('Webhook signature verification failed — skipping');
          return;
        }
      }

      // Fetch full email content from Resend API
      let emailBody = '<p><em>Contenu non disponible</em></p>';
      try {
        const res = await fetch(`https://api.resend.com/emails/received/${email_id}`, {
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        });
        if (res.ok) {
          const received = await res.json();
          emailBody = received.html ?? received.text?.replace(/\n/g, '<br>') ?? emailBody;
        }
      } catch (err) {
        this.logger.warn(`Could not fetch email body: ${err}`);
      }

      // Forward to Gmail
      const toAddresses = Array.isArray(to) ? to.join(', ') : to;
      const { error } = await this.resend.emails.send({
        from: 'Sayerli Support <support@sayerli.com>',
        to: 'karrassi.hamza@gmail.com',
        replyTo: from,
        subject: `[Support Sayerli] ${subject ?? '(sans objet)'}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#0f172a;padding:16px 24px;border-radius:8px 8px 0 0">
              <span style="color:#14b8a6;font-weight:700;font-size:18px">Sayerli</span>
              <span style="color:#94a3b8;font-size:14px;margin-left:8px">— Nouveau message entrant</span>
            </div>
            <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
              <table style="width:100%;margin-bottom:20px;font-size:13px;color:#64748b">
                <tr><td style="padding:4px 0;width:80px"><strong>De :</strong></td><td>${from}</td></tr>
                <tr><td style="padding:4px 0"><strong>À :</strong></td><td>${toAddresses}</td></tr>
                <tr><td style="padding:4px 0"><strong>Sujet :</strong></td><td>${subject ?? '(sans objet)'}</td></tr>
              </table>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0">
              <div style="font-size:15px;color:#1e293b;line-height:1.6">
                ${emailBody}
              </div>
            </div>
          </div>
        `,
      });

      if (error) {
        this.logger.error(`Failed to forward email: ${JSON.stringify(error)}`);
      } else {
        this.logger.log(`Email forwarded from ${from} — subject: "${subject}"`);
      }
    } catch (err) {
      this.logger.error(`Webhook handler error: ${err}`);
    }
  }
}
