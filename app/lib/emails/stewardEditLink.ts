import { resend, FROM_EMAIL } from "../resend";

const SITE_URL = "https://www.canarycommons.org";

export async function sendStewardEditLinkEmail(options: {
  toEmail: string;
  displayName?: string | null;
  listingName: string;
  token: string;
}) {
  const { toEmail, displayName, listingName, token } = options;
  const greeting = displayName ? `Hi ${displayName},` : "Hi,";
  const editUrl = `${SITE_URL}/api/steward/edit-session?token=${encodeURIComponent(token)}`;

  const subject = `Edit your listing — ${listingName}`;

  const text = `${greeting}

Here's your access link to edit ${listingName} on Canary Commons.

${editUrl}

This link is valid for 30 minutes. If you didn't request this, you can ignore this email.

With care,
Ren at Canary Commons`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0; padding:0; background-color:#fafafa; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Georgia,serif; color:#1a2332;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%;">
        <tr><td style="font-size:16px; line-height:1.7; color:#1a2332;">
          <p style="margin:0 0 18px;">${greeting}</p>
          <p style="margin:0 0 18px;">Here's your access link to edit <strong>${listingName}</strong> on Canary Commons.</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
            <tr><td align="center" style="border-radius:999px; background-color:#FFD86B;">
              <a href="${editUrl}" target="_blank" style="display:inline-block; padding:14px 28px; color:#1a2a0e; font-weight:700; font-size:16px; text-decoration:none; border-radius:999px;">Open edit page &rarr;</a>
            </td></tr>
          </table>
          <p style="margin:0 0 28px;">This link is valid for 30 minutes. If you didn't request this, you can ignore this email.</p>
          <p style="margin:0;">With care,<br />Ren at Canary Commons</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return resend.emails.send({ from: FROM_EMAIL, to: toEmail, subject, html, text });
}
