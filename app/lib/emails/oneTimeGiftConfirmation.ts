/**
 * Confirmation email sent after a one-time gift (no subscription).
 *
 * Copy lives here so Ren can find and revise it easily.
 * The HTML is a plain letter — no banners, no logos, no social icons.
 */

import { getEmailHeader } from "./components/emailHeader";

export function oneTimeGiftConfirmationEmail(options: {
  name?: string;
}): { subject: string; html: string; text: string } {
  const greeting = options.name
    ? `Dear ${options.name},`
    : "Dear friend,";

  const subject = "Your first Notes from the Field is on its way";

  // ─── Plain text ───────────────────────────────────────────
  const text = `${greeting}

In the next couple of weeks, your first edition of Notes from the Field will arrive — in-hand evidence of a world becoming more balanced with every choice we make. An experience of the people, places, and projects creating the world we want to live in now.

Thank you for choosing life with us, and for standing with the work in a single, generous gesture.

— Ren
Canary Commons

You're receiving this because you made a one-time gift to Canary Commons.`;

  // ─── HTML ─────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; background-color:#fafafa; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Georgia,serif; color:#1a2332;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%;">
          <tr>
            <td style="font-size:16px; line-height:1.7; color:#1a2332;">

              ${getEmailHeader()}

              <p style="margin:0 0 18px;">${greeting}</p>

              <p style="margin:0 0 18px;">
                In the next couple of weeks, your first edition of Notes from the Field will arrive &mdash; in-hand evidence of a world becoming more balanced with every choice we make. An experience of the people, places, and projects creating the world we want to live in now.
              </p>

              <p style="margin:0 0 28px;">
                Thank you for choosing life with us, and for standing with the work in a single, generous gesture.
              </p>

              <p style="margin:0 0 0;">
                &mdash; Ren<br />
                Canary Commons
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:32px 0 0; font-size:13px; color:#7a8699; line-height:1.5;">
              You're receiving this because you made a one-time gift to Canary Commons.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
