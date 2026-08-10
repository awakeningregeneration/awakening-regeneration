/**
 * Seeder outreach email 1 — Recognition + Claim.
 *
 * Sent immediately when a seeder places a listing.
 * Content matches EmailModals.tsx → Email1Recognition() exactly.
 */

import { getEmailHeader } from "./components/emailHeader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.canarycommons.org";

export function seederOutreach1Email(options: {
  businessName: string;
  listingId: string;
  removalToken: string;
  seederName: string;
}): { subject: string; html: string; text: string } {
  const { businessName, listingId } = options;

  // removalToken and seederName accepted for interface consistency but not
  // rendered in Email 1 — new copy does not include a remove button or
  // seeder attribution.
  void options.removalToken;
  void options.seederName;

  const claimUrl = `${SITE_URL}/edit/${listingId}`;

  const subject = "You\u2019ve been added to Canary Commons";

  const html = `
<div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;padding:32px 24px;">
  ${getEmailHeader()}
  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hi ${businessName},</p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    You&rsquo;ve been added to Canary Commons &mdash; a visibility infrastructure
    bringing a world of good into view, and into reach, helping us all make a
    difference with every choice.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Right now it&rsquo;s a map &mdash; soon, as more of the country fills in,
    it becomes an app.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    You&rsquo;re one of the first listings on it.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    We&rsquo;ll send a couple more notes over the next few weeks, in case you
    miss this one. You&rsquo;re welcome to interact with your listing here:
  </p>

  <div style="text-align:center;margin:24px 0;">
    <a href="${claimUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#FFD86B;color:#1a2a0e;font-weight:700;font-size:15px;text-decoration:none;">
      View Your Listing
    </a>
  </div>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    We hope to build Canary into a resource people trust and turn to.
    Thanks for being a business that cares.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    &mdash; <a href="${SITE_URL}" style="color:#1a2a3a;text-decoration:none;font-weight:700;">Canary Commons</a>
  </p>

  <div style="text-align:center;color:rgba(138,109,42,0.3);font-size:18px;letter-spacing:0.5em;margin:24px 0 8px;">
    &#10047; &nbsp; &#10047; &nbsp; &#10047;
  </div>
</div>`.trim();

  const text = `Hi ${businessName},

You\u2019ve been added to Canary Commons \u2014 a visibility infrastructure bringing a world of good into view, and into reach, helping us all make a difference with every choice.

Right now it\u2019s a map \u2014 soon, as more of the country fills in, it becomes an app.

You\u2019re one of the first listings on it.

We\u2019ll send a couple more notes over the next few weeks, in case you miss this one. You\u2019re welcome to interact with your listing here:

${claimUrl}

We hope to build Canary into a resource people trust and turn to. Thanks for being a business that cares.

\u2014 Canary Commons
${SITE_URL}`;

  return { subject, html, text };
}
