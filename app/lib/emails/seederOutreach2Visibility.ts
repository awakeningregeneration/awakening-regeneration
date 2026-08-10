/**
 * Seeder outreach email 2 — Visibility + Story.
 *
 * Sent 7 days after Email 1 by the daily seeder-outreach cron.
 * Content matches EmailModals.tsx → Email2Visibility() exactly.
 */

import { getEmailHeader } from "./components/emailHeader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.canarycommons.org";

export function seederOutreach2Email(options: {
  businessName: string;
  listingId: string;
  removalToken: string;
}): { subject: string; html: string; text: string } {
  const { businessName, listingId } = options;

  // removalToken accepted for interface consistency but not rendered in
  // Email 2 — new copy does not include a remove button.
  void options.removalToken;

  const claimUrl = `${SITE_URL}/edit/${listingId}`;

  const subject = "What Canary Commons actually is";

  const html = `
<div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;padding:32px 24px;">
  ${getEmailHeader()}
  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hi ${businessName},</p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    A quick second note. Here&rsquo;s a fuller picture of what your listing is
    now part of.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 8px;">Canary Commons is:</p>

  <ul style="font-size:16px;line-height:1.7;margin:0 0 20px;padding-left:0;list-style:none;">
    <li style="margin-bottom:8px;">&#10022;&nbsp; A map, so you can be found wherever you are, wherever people go.</li>
    <li style="margin-bottom:8px;">&#10022;&nbsp; Resources, so you can be supported even when you&rsquo;re not nearby.</li>
    <li style="margin-bottom:8px;">&#10022;&nbsp; Stories, carrying the wisdom and perspective of place.</li>
    <li style="margin-bottom:8px;">&#10022;&nbsp; A constellation, proof that the world is already solving its hardest questions.</li>
  </ul>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    It&rsquo;s hard to find small places doing great things. Canary Commons
    exists to close that gap &mdash; for the people doing the work, and the
    people looking for it.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Your listing stays free either way. Claiming it lets you add detail,
    tell your own story, and shape how people see your work when they find you:
  </p>

  <div style="text-align:center;margin:24px 0;">
    <a href="${claimUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#FFD86B;color:#1a2a0e;font-weight:700;font-size:15px;text-decoration:none;">
      Claim Your Listing
    </a>
  </div>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    &mdash; <a href="${SITE_URL}" style="color:#1a2a3a;text-decoration:none;font-weight:700;">Canary Commons</a>
  </p>

  <div style="text-align:center;color:rgba(138,109,42,0.3);font-size:18px;letter-spacing:0.5em;margin:24px 0 8px;">
    &#10047; &nbsp; &#10047; &nbsp; &#10047;
  </div>
</div>`.trim();

  const text = `Hi ${businessName},

A quick second note. Here\u2019s a fuller picture of what your listing is now part of.

Canary Commons is:

\u2726 A map, so you can be found wherever you are, wherever people go.
\u2726 Resources, so you can be supported even when you\u2019re not nearby.
\u2726 Stories, carrying the wisdom and perspective of place.
\u2726 A constellation, proof that the world is already solving its hardest questions.

It\u2019s hard to find small places doing great things. Canary Commons exists to close that gap \u2014 for the people doing the work, and the people looking for it.

Your listing stays free either way. Claiming it lets you add detail, tell your own story, and shape how people see your work when they find you:

${claimUrl}

\u2014 Canary Commons
${SITE_URL}`;

  return { subject, html, text };
}
