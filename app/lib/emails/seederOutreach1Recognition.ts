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
  const { businessName, listingId, removalToken } = options;

  const claimUrl = `${SITE_URL}/edit/${listingId}`;
  const foundersUrl = `${SITE_URL}/founders`;
  const removeUrl = `${SITE_URL}/listings/${listingId}/remove?token=${encodeURIComponent(removalToken)}`;

  const subject = "You have been noticed";

  const html = `
<div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;padding:32px 24px;">
  ${getEmailHeader()}
  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hello ${businessName},</p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Someone in your community came across what you&rsquo;re doing and added
    your business to Canary Commons &mdash; a living map of people, places, and
    projects helping make life-forward choices more visible, actionable, and
    easier to find.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    As the map fills in, it becomes a downloadable app that helps people find
    what cares for the long term &mdash; for the body, the land, the community
    &mdash; wherever they are. The more the map grows, the more useful it becomes:
    travelers find aligned places in new towns, locals discover what they
    didn&rsquo;t know was right around the corner, and the small businesses
    doing the meaningful work become easier to find by the people who are
    actively looking for them.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    This project exists to make the things choosing life forward &mdash; for
    ourselves, and for those who come after &mdash; visible, actionable, and
    supportable, so the work already happening in communities is easier to
    find, easier to trust, and easier to strengthen.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Your listing is now live here:</p>

  <div style="text-align:center;margin:20px 0;">
    <a href="${claimUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#FFD86B;color:#1a2a0e;font-weight:700;font-size:15px;text-decoration:none;">
      Claim / View Listing
    </a>
  </div>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    You&rsquo;re welcome to leave it as it is. You&rsquo;re also welcome to
    claim it, refine it, or shape how your work appears on the map.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 8px;">From here, you can:</p>
  <ul style="font-size:16px;line-height:1.7;margin:0 0 16px;padding-left:24px;">
    <li>claim or refine your listing</li>
    <li>share more about your work</li>
    <li>participate in how your community defines life forward</li>
  </ul>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Canary Commons is being built as a non-competitive public commons. Your
    listing here is free to keep, free to shape, and never reduced for
    choosing not to contribute. Contribution does not buy placement,
    priority, or reach.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    This work takes real resource to build. Canary Commons is grass-roots-funded
    by people who recognize what it is and want to help carry it through its
    early growth. That help is a bridge &mdash; not the beginning, not the destination
    &mdash; meant to steady the work until it can be carried by the communities it
    serves.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    If this feels worth helping carry, your early support is appreciated:
  </p>

  <div style="text-align:center;margin:20px 0;">
    <a href="${foundersUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#FFD86B;color:#1a2a0e;font-weight:700;font-size:15px;text-decoration:none;">
      Help Carry the Commons
    </a>
  </div>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    And if this doesn&rsquo;t feel like a fit, you can remove your listing at
    any time &mdash; no explanation needed.
  </p>

  <div style="text-align:center;margin:20px 0;">
    <a href="${removeUrl}" style="display:inline-block;padding:8px 20px;border-radius:999px;border:1px solid rgba(138,109,42,0.3);background:rgba(255,248,230,0.3);color:#8a6d2a;font-weight:600;font-size:14px;text-decoration:none;">
      Remove Listing
    </a>
  </div>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Whether you stay listed here or not, your work is valued for representing
    choices that future generations will be thankful for.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    With respect,<br/>
    Canary Commons
  </p>

  <p style="font-size:14px;line-height:1.6;color:#6a7a8a;margin:0 0 16px;text-align:center;">
    <a href="https://www.canarycommons.org" style="color:#6a7a8a;text-decoration:underline;">www.canarycommons.org</a><br/>
    <a href="mailto:founder@canarycommons.org" style="color:#6a7a8a;text-decoration:underline;">founder@canarycommons.org</a>
  </p>

  <p style="font-size:13px;line-height:1.6;color:#6a7a8a;margin:24px 0 16px;font-style:italic;">
    This is one of three brief notes from CC, spaced over six weeks. You
    don&rsquo;t need to do anything. Not doing anything at all is fine, you
    are already listed, and you&rsquo;ll hear from us no more than two more
    times.
  </p>

  <div style="text-align:center;color:rgba(138,109,42,0.3);font-size:18px;letter-spacing:0.5em;margin:24px 0 8px;">
    &#10047; &nbsp; &#10047; &nbsp; &#10047;
  </div>
</div>`.trim();

  const text = `Hello ${businessName},

Someone in your community came across what you're doing and added your business to Canary Commons — a living map of people, places, and projects helping make life-forward choices more visible, actionable, and easier to find.

As the map fills in, it becomes a downloadable app that helps people find what cares for the long term — for the body, the land, the community — wherever they are. The more the map grows, the more useful it becomes: travelers find aligned places in new towns, locals discover what they didn't know was right around the corner, and the small businesses doing the meaningful work become easier to find by the people who are actively looking for them.

This project exists to make the things choosing life forward — for ourselves, and for those who come after — visible, actionable, and supportable, so the work already happening in communities is easier to find, easier to trust, and easier to strengthen.

Your listing is now live here:

Claim / View Listing: ${claimUrl}

You're welcome to leave it as it is. You're also welcome to claim it, refine it, or shape how your work appears on the map.

From here, you can:
- claim or refine your listing
- share more about your work
- participate in how your community defines life forward

Canary Commons is being built as a non-competitive public commons. Your listing here is free to keep, free to shape, and never reduced for choosing not to contribute. Contribution does not buy placement, priority, or reach.

This work takes real resource to build. Canary Commons is grass-roots-funded by people who recognize what it is and want to help carry it through its early growth. That help is a bridge — not the beginning, not the destination — meant to steady the work until it can be carried by the communities it serves.

If this feels worth helping carry, your early support is appreciated:

Help Carry the Commons: ${foundersUrl}

And if this doesn't feel like a fit, you can remove your listing at any time — no explanation needed.

Remove Listing: ${removeUrl}

Whether you stay listed here or not, your work is valued for representing choices that future generations will be thankful for.

With respect,
Canary Commons

www.canarycommons.org
founder@canarycommons.org

This is one of three brief notes from CC, spaced over six weeks. You don't need to do anything. Not doing anything at all is fine, you are already listed, and you'll hear from us no more than two more times.`;

  return { subject, html, text };
}
