/**
 * Seeder outreach email 3 — Stewardship + Support.
 *
 * Sent 14 days after Email 2 (21 days after Email 1) by the daily seeder-outreach cron.
 * Content matches EmailModals.tsx → Email3Stewardship() exactly.
 */

import { getEmailHeader } from "./components/emailHeader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.canarycommons.org";

export function seederOutreach3Email(options: {
  businessName: string;
  listingId: string;
  removalToken: string;
}): { subject: string; html: string; text: string } {
  const { businessName, listingId } = options;

  // removalToken accepted for interface consistency but not rendered in
  // Email 3 — the closing gesture carries the release without a Remove button.
  void options.removalToken;

  const claimUrl = `${SITE_URL}/edit/${listingId}`;
  const foundersUrl = `${SITE_URL}/founders`;

  const subject = "We\u2019re just beginning \u2014 join if it feels right";

  const html = `
<div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;padding:32px 24px;">
  ${getEmailHeader()}
  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hi ${businessName},</p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    A last note from us for now. Canary Commons is early &mdash; the map is still
    filling in, still becoming what it&rsquo;s meant to be.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    You&rsquo;re already part of it. From here, there are a few ways to go
    further, if any of them feel right to you:
  </p>

  <ul style="font-size:16px;line-height:1.7;margin:0 0 20px;padding-left:24px;">
    <li style="margin-bottom:6px;">Claim and shape your listing</li>
    <li style="margin-bottom:6px;">Share your story</li>
    <li style="margin-bottom:6px;">Help carry the work itself, as a <a href="${foundersUrl}" style="color:#1a2a3a;font-weight:700;text-decoration:underline;">founding steward</a></li>
  </ul>

  <div style="text-align:center;margin:24px 0;">
    <a href="${claimUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#FFD86B;color:#1a2a0e;font-weight:700;font-size:15px;text-decoration:none;">
      Choose How to Participate
    </a>
  </div>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Canary Commons is grassroots-funded by people who see what it&rsquo;s
    becoming and want to help it get there. That kind of support isn&rsquo;t
    required, and it never changes how your listing appears &mdash; it just
    helps the work keep going.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Whatever you choose, thank you for being part of what this is becoming.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    &mdash; <a href="${SITE_URL}" style="color:#1a2a3a;text-decoration:none;font-weight:700;">Canary Commons</a>
  </p>

  <p style="font-size:13px;line-height:1.6;color:#6a7a8a;margin:24px 0 16px;font-style:italic;">
    This is the last of three emails. Your listing will remain on the map.
    You won&rsquo;t hear from us again unless you choose to engage.
    You are always welcome to participate.
  </p>

  <div style="text-align:center;color:rgba(138,109,42,0.3);font-size:18px;letter-spacing:0.5em;margin:24px 0 8px;">
    &#10047; &nbsp; &#10047; &nbsp; &#10047;
  </div>
</div>`.trim();

  const text = `Hi ${businessName},

A last note from us for now. Canary Commons is early \u2014 the map is still filling in, still becoming what it\u2019s meant to be.

You\u2019re already part of it. From here, there are a few ways to go further, if any of them feel right to you:

\u2014 Claim and shape your listing
\u2014 Share your story
\u2014 Help carry the work itself, as a founding steward

${claimUrl}

Founding stewards: ${foundersUrl}

Canary Commons is grassroots-funded by people who see what it\u2019s becoming and want to help it get there. That kind of support isn\u2019t required, and it never changes how your listing appears \u2014 it just helps the work keep going.

Whatever you choose, thank you for being part of what this is becoming.

\u2014 Canary Commons
${SITE_URL}

This is the last of three emails. Your listing will remain on the map. You won\u2019t hear from us again unless you choose to engage. You are always welcome to participate.`;

  return { subject, html, text };
}
