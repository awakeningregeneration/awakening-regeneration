/**
 * Seeder welcome email — sent manually by Ren when onboarding a new seeder.
 *
 * Introduces the seeder to their dashboard and direct invitation link.
 * Uses the table wrapper pattern matching welcomeFounder.ts (warm-cream register).
 */

import { getEmailHeader } from "./components/emailHeader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.canarycommons.org";

export function seederWelcomeEmail(options: {
  name: string;
  handle: string;
}): { subject: string; html: string; text: string } {
  const { name, handle } = options;

  const dashboardUrl = `${SITE_URL}/${handle}`;
  const joinUrl = `${SITE_URL}/${handle}/join`;

  const subject = `Welcome, ${name}. Here's your seeder space.`;

  const text = `Hi ${name},

I'm so glad you're stepping into this. Canary Commons grows through people who care, and the work you're about to do — placing lights for businesses and organizations you know and find — is what makes the map real.

Two links you'll want to keep:

Your dashboard — this is your working space. Place new lights, track outreach, see the lights you've placed.
${dashboardUrl}

Your direct invitation link — share this with anyone who wants to support Canary Commons as a Founder. They'll arrive through you.
${joinUrl}

When you visit your dashboard for the first time, you'll go through a short orientation — three things to know before placing your first light. Take your time with it. There's no hurry.

If anything is unclear or feels off, just write me back. This is small enough that we're all still in the room together.

— Ren
Canary Commons`;

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

              <p style="margin:0 0 18px;">Hi ${name},</p>

              <p style="margin:0 0 18px;">
                I&rsquo;m so glad you&rsquo;re stepping into this. Canary Commons grows through people who care, and the work you&rsquo;re about to do &mdash; placing lights for businesses and organizations you know and find &mdash; is what makes the map real.
              </p>

              <p style="margin:0 0 10px;">
                Two links you&rsquo;ll want to keep:
              </p>

              <p style="margin:0 0 8px;">
                <strong>Your dashboard</strong> &mdash; this is your working space. Place new lights, track outreach, see the lights you&rsquo;ve placed.
              </p>

              <!-- Dashboard CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
                <tr>
                  <td align="center" style="border-radius:999px; background-color:#FFD86B;">
                    <a href="${dashboardUrl}" target="_blank" style="display:inline-block; padding:14px 28px; color:#1a2a0e; font-weight:700; font-size:16px; text-decoration:none; border-radius:999px;">
                      Open your dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;">
                <strong>Your direct invitation link</strong> &mdash; share this with anyone who wants to support Canary Commons as a Founder. They&rsquo;ll arrive through you.
              </p>

              <p style="margin:0 0 24px;">
                <a href="${joinUrl}" target="_blank" style="font-family:monospace; font-size:14px; color:#8a6d2a; text-decoration:none; border-bottom:1px solid rgba(138,109,42,0.3);">${joinUrl}</a>
              </p>

              <p style="margin:0 0 18px;">
                When you visit your dashboard for the first time, you&rsquo;ll go through a short orientation &mdash; three things to know before placing your first light. Take your time with it. There&rsquo;s no hurry.
              </p>

              <p style="margin:0 0 28px;">
                If anything is unclear or feels off, just write me back. This is small enough that we&rsquo;re all still in the room together.
              </p>

              <div style="text-align:center;color:rgba(138,109,42,0.3);font-size:18px;letter-spacing:0.5em;margin:0 0 18px;">
                &#10047; &nbsp; &#10047; &nbsp; &#10047;
              </div>

              <p style="margin:0;">
                &mdash; Ren<br/>
                Canary Commons
              </p>

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
