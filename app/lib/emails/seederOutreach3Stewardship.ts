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
  const { businessName, listingId, removalToken } = options;

  const claimUrl = `${SITE_URL}/edit/${listingId}`;
  const foundersUrl = `${SITE_URL}/founders`;

  // removalToken accepted for interface consistency but not rendered
  // in Email 3 — the closing gesture ("You won't hear from us again")
  // carries the release without a Remove button.
  void removalToken;

  const subject = "Help strengthen what this is becoming";

  const html = `
<div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;padding:32px 24px;">
  ${getEmailHeader()}
  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hello ${businessName},</p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    A last note from us. Canary Commons was built to make the things choosing
    life forward &mdash; for ourselves and for those who come after &mdash; easier to
    find, easier to trust, and easier to support.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Not by asking communities to start from scratch &mdash; but by helping make
    visible what is already being done, and making it easier for people to
    find and strengthen it.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Your listing is part of that effort.</p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Some businesses simply stay visible here. Some refine their listing. Some
    share their story. Some choose to help carry the work itself.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    If this feels aligned with the kind of future you&rsquo;re helping build,
    there are a few ways to take part:
  </p>
  <ul style="font-size:16px;line-height:1.7;margin:0 0 16px;padding-left:24px;">
    <li>claim and shape your listing</li>
    <li>share your story</li>
    <li>help carry forward what your community is choosing</li>
  </ul>

  <div style="text-align:center;margin:20px 0;">
    <a href="${claimUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#FFD86B;color:#1a2a0e;font-weight:700;font-size:15px;text-decoration:none;">
      Choose How to Participate
    </a>
  </div>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Canary Commons is free to be part of, and your place here is not
    contingent on contribution. Contribution does not buy placement,
    priority, or reach. It helps carry a non-competitive public commons
    through its early growth &mdash; a bridge until the work can be carried by the
    communities it serves.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    This project is grass-roots-funded by people who recognize what it is. If
    that feels like you, your help matters.
  </p>

  <div style="text-align:center;margin:20px 0;">
    <a href="${foundersUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#FFD86B;color:#1a2a0e;font-weight:700;font-size:15px;text-decoration:none;">
      Help Carry the Commons
    </a>
  </div>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Thank you for contributing to the kind of world this project was built to
    make easier to find.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    With thanks,<br/>
    Canary Commons
  </p>

  <p style="font-size:13px;line-height:1.6;color:#6a7a8a;margin:24px 0 16px;font-style:italic;">
    This is the last of three brief notes. You won&rsquo;t hear from us again
    unless you choose to engage. You are always welcome to participate.
  </p>

  <div style="text-align:center;color:rgba(138,109,42,0.3);font-size:18px;letter-spacing:0.5em;margin:24px 0 8px;">
    &#10047; &nbsp; &#10047; &nbsp; &#10047;
  </div>
</div>`.trim();

  const text = `Hello ${businessName},

A last note from us. Canary Commons was built to make the things choosing life forward — for ourselves and for those who come after — easier to find, easier to trust, and easier to support.

Not by asking communities to start from scratch — but by helping make visible what is already being done, and making it easier for people to find and strengthen it.

Your listing is part of that effort.

Some businesses simply stay visible here. Some refine their listing. Some share their story. Some choose to help carry the work itself.

If this feels aligned with the kind of future you're helping build, there are a few ways to take part:
- claim and shape your listing
- share your story
- help carry forward what your community is choosing

Choose How to Participate: ${claimUrl}

Canary Commons is free to be part of, and your place here is not contingent on contribution. Contribution does not buy placement, priority, or reach. It helps carry a non-competitive public commons through its early growth — a bridge until the work can be carried by the communities it serves.

This project is grass-roots-funded by people who recognize what it is. If that feels like you, your help matters.

Help Carry the Commons: ${foundersUrl}

Thank you for contributing to the kind of world this project was built to make easier to find.

With thanks,
Canary Commons

This is the last of three brief notes. You won't hear from us again unless you choose to engage. You are always welcome to participate.`;

  return { subject, html, text };
}
