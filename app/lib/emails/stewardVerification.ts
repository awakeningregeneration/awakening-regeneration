/**
 * Stewardship verification email — sent when someone claims
 * care of a listing on Canary Commons.
 */

import { resend, FROM_EMAIL } from "../resend";
import type { VerificationPath } from "../../../types/steward";

const SITE_URL = "https://www.canarycommons.org";

export async function sendStewardVerificationEmail(options: {
  toEmail: string;
  displayName?: string | null;
  listingName: string;
  token: string;
  verificationPath: VerificationPath;
}) {
  const { toEmail, displayName, listingName, token, verificationPath } =
    options;

  const greeting = displayName ? `Hi ${displayName},` : "Hi,";
  const verifyUrl = `${SITE_URL}/steward/verify?token=${encodeURIComponent(token)}`;

  const afterConfirm =
    verificationPath === "domain_match"
      ? "you'll become the steward of this listing immediately."
      : "there's a brief 48-hour window while we make sure we don't have wires crossed — after that, you'll become the steward automatically.";

  const subject = `Confirm your stewardship of ${listingName}`;

  // ── Plain text ───────────────────────────────────────────
  const text = `${greeting}

You're being welcomed as the steward of ${listingName} on Canary Commons — a living map of places and efforts doing life-forward work.

Stewardship means you tend this listing: you can update its details, respond to proposed edits, and keep the information current as your work evolves. The commons holds a place for you here.

To confirm this is really you, visit this link within the next 24 hours:

${verifyUrl}

After you confirm, ${afterConfirm}

With care,
Ren at Canary Commons

If you didn't claim this listing, you can ignore this email — no action will be taken.`;

  // ── HTML ─────────────────────────────────────────────────
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

              <p style="margin:0 0 18px;">${greeting}</p>

              <p style="margin:0 0 18px;">
                You're being welcomed as the steward of <strong>${listingName}</strong> on Canary Commons &mdash; a living map of places and efforts doing life-forward work.
              </p>

              <p style="margin:0 0 18px;">
                Stewardship means you tend this listing: you can update its details, respond to proposed edits, and keep the information current as your work evolves. The commons holds a place for you here.
              </p>

              <p style="margin:0 0 18px;">
                To confirm this is really you, click the link below within the next 24 hours:
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
                <tr>
                  <td align="center" style="border-radius:999px; background-color:#FFD86B;">
                    <a href="${verifyUrl}"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; color:#1a2a0e; font-weight:700; font-size:16px; text-decoration:none; border-radius:999px;">
                      Confirm stewardship &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 28px;">
                After you confirm, ${afterConfirm}
              </p>

              <p style="margin:0 0 0;">
                With care,<br />
                Ren at Canary Commons
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:32px 0 0; font-size:13px; color:#7a8699; line-height:1.5;">
              If you didn't claim this listing, you can ignore this email &mdash; no action will be taken.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject,
    html,
    text,
  });
}
