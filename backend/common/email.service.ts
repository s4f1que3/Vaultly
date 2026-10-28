import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get<string>('SMTP_HOST'),
      port: config.get<number>('SMTP_PORT') ?? 587,
      secure: config.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: config.get<string>('SMTP_USER'),
        pass: config.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendHouseholdInvite(to: string, inviterName: string, householdName: string, frontendUrl: string): Promise<void> {
    const fromName = this.config.get<string>('SMTP_FROM_NAME') ?? 'Vaultly';
    const fromEmail = this.config.get<string>('SMTP_USER');
    const acceptUrl = `${frontendUrl}/household`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0d0a06;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0a06;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#1a1612;border-radius:16px;border:1px solid #2a2420;overflow:hidden;">
        <tr>
          <td style="padding:32px 40px 24px;border-bottom:1px solid #2a2420;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#f5f0eb;letter-spacing:-0.5px;">Vaultly&#8482;</p>
            <p style="margin:6px 0 0;font-size:13px;color:#8a7f76;">Household invitation</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 16px;font-size:15px;color:#c5bdb5;">
              <strong style="color:#f5f0eb;">${inviterName}</strong> has invited you to join the <strong style="color:#f5f0eb;">${householdName}</strong> household on Vaultly.
            </p>
            <p style="margin:0 0 28px;font-size:14px;color:#8a7f76;line-height:1.6;">
              Joining lets you share budgets and track finances together. Log in to your Vaultly account to accept or decline the invitation.
            </p>
            <div style="text-align:center;margin-bottom:28px;">
              <a href="${acceptUrl}" style="display:inline-block;background:#3a8c4e;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 32px;border-radius:10px;">
                View Invitation →
              </a>
            </div>
            <p style="margin:0;font-size:12px;color:#5a5048;text-align:center;">
              If you don't have a Vaultly account, you'll need to sign up first.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #2a2420;text-align:center;">
            <p style="margin:0;font-size:11px;color:#5a5048;">© ${new Date().getFullYear()} Vaultly. If you didn't expect this email, you can ignore it.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      await this.transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject: `${inviterName} invited you to join ${householdName} on Vaultly™`,
        html,
        text: `${inviterName} has invited you to join the "${householdName}" household on Vaultly.\n\nLog in to accept or decline: ${acceptUrl}`,
      });
      this.logger.log(`Household invite sent to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send household invite to ${to}`, err);
      // Don't throw — invite record was already created, email is best-effort
    }
  }
}
