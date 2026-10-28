const LOGO_URL = 'https://erduio-frontend.vercel.app/erduio-wordmark.png';
const BRAND_COLOR = '#4A3FBF';

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function buildMessageEmail(subject: string, message: string, Email: string): string {
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
    const safeEmail = escapeHtml(Email);

    return `
<!doctype html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f4f7; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e5ea;">
            <tr>
              <td style="background-color:${BRAND_COLOR}; height:4px; font-size:0; line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" style="padding:32px 32px 8px 32px;">
                <img src="${LOGO_URL}" alt="Eruss" width="140" style="display:block; max-width:140px; height:auto;" />
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 0 32px;">
                <p style="margin:0; font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:${BRAND_COLOR};">
                  Erduio mail notification
                </p>
                <h1 style="margin:8px 0 0 0; font-size:20px; line-height:1.3; color:#111111;">
                  ${safeSubject}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 32px 32px;">
                <p style="margin:0; font-size:15px; line-height:1.6; color:#333333;">${safeMessage}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <div style="border-top:1px solid #e5e5ea;"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 28px 32px;">
                <p style="margin:0; font-size:13px; color:#888888;">
                  Sent via Eruss Mailing System &middot; Reply to this email directly at
                  <a href="mailto:${safeEmail}" style="color:${BRAND_COLOR}; text-decoration:none;">${safeEmail}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

