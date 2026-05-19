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
  const { businessName, listingId, removalToken } = options;

  const claimUrl = `${SITE_URL}/edit/${listingId}`;
  const foundersUrl = `${SITE_URL}/founders`;
  const removeUrl = `${SITE_URL}/listings/${listingId}/remove?token=${encodeURIComponent(removalToken)}`;

  const subject = "Help shape what people find when they find you";

  const html = `
<div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;padding:32px 24px;">
  ${getEmailHeader()}
  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hello ${businessName},</p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    A second brief note. Canary Commons is growing &mdash; a living map of
    people, places, and projects helping make life-forward choices visible,
    actionable, and supportable, so we can all step toward a healthier future
    for ourselves and for those who come after.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Your listing is part of that growing map.</p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    It&rsquo;s hard to find small places doing great things. Both the people
    doing the work and the people looking for it have been on opposite sides
    of that same gap. Canary Commons is being built to close it &mdash; for
    both sides.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    As the map fills in, what&rsquo;s on it becomes findable. Travelers
    passing through can locate aligned places they&rsquo;d otherwise never
    know about. Locals can discover what&rsquo;s been right around the corner
    all along. And the businesses already doing meaningful work get reached by
    the people actively looking for them &mdash; not through advertising, not
    through algorithms, but through a map that&rsquo;s just trying to make
    the good already happening easier to find.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    As more people begin using Canary Commons to find local businesses,
    trusted services, and aligned work in their region, the strongest
    listings will be the ones shaped by the people doing the work themselves.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    If you&rsquo;d like, this is a good moment to refine your listing and
    share a little more about what people should know when they find you.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 8px;">You can:</p>
  <ul style="font-size:16px;line-height:1.7;margin:0 0 16px;padding-left:24px;">
    <li>update your listing</li>
    <li>clarify what you offer</li>
    <li>share your story</li>
    <li>help people understand what makes your work meaningful</li>
  </ul>

  <div style="text-align:center;margin:20px 0;">
    <a href="${claimUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#FFD86B;color:#1a2a0e;font-weight:700;font-size:15px;text-decoration:none;">
      Refine Your Listing
    </a>
  </div>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Your listing remains free whether or not you contribute. Canary Commons
    is non-competitive &mdash; businesses here are not ranked against one another,
    and contribution does not buy greater visibility. The aim is not to
    compete for attention. It&rsquo;s to make life-serving work easier to find.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    If helping carry the project through its early growth feels worthwhile,
    that bridge keeps it independent and public until it can stand on its own.
  </p>

  <div style="text-align:center;margin:20px 0;">
    <a href="${foundersUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#FFD86B;color:#1a2a0e;font-weight:700;font-size:15px;text-decoration:none;">
      Help Carry the Commons
    </a>
  </div>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    And if it&rsquo;s not a fit, you can remove your listing at any time.
  </p>

  <div style="text-align:center;margin:20px 0;">
    <a href="${removeUrl}" style="display:inline-block;padding:8px 20px;border-radius:999px;border:1px solid rgba(138,109,42,0.3);background:rgba(255,248,230,0.3);color:#8a6d2a;font-weight:600;font-size:14px;text-decoration:none;">
      Remove Listing
    </a>
  </div>

  <p style="font-size:13px;line-height:1.6;color:#6a7a8a;margin:24px 0 16px;font-style:italic;">
    This is the second of three emails. If you don&rsquo;t do anything at
    all, your listing will remain on the map.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Thank you for all you are doing to inhabit the planet and community in a
    thoughtful way.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    &mdash; Canary Commons
  </p>

  <p style="font-size:14px;line-height:1.6;color:#6a7a8a;margin:0 0 16px;text-align:center;">
    <a href="https://www.canarycommons.org" style="color:#6a7a8a;text-decoration:underline;">www.canarycommons.org</a><br/>
    <a href="mailto:founder@canarycommons.org" style="color:#6a7a8a;text-decoration:underline;">founder@canarycommons.org</a>
  </p>

  <div style="text-align:center;color:rgba(138,109,42,0.3);font-size:18px;letter-spacing:0.5em;margin:24px 0 8px;">
    &#10047; &nbsp; &#10047; &nbsp; &#10047;
  </div>
</div>`.trim();

  const text = `Hello ${businessName},

A second brief note. Canary Commons is growing — a living map of people, places, and projects helping make life-forward choices visible, actionable, and supportable, so we can all step toward a healthier future for ourselves and for those who come after.

Your listing is part of that growing map.

It's hard to find small places doing great things. Both the people doing the work and the people looking for it have been on opposite sides of that same gap. Canary Commons is being built to close it — for both sides.

As the map fills in, what's on it becomes findable. Travelers passing through can locate aligned places they'd otherwise never know about. Locals can discover what's been right around the corner all along. And the businesses already doing meaningful work get reached by the people actively looking for them — not through advertising, not through algorithms, but through a map that's just trying to make the good already happening easier to find.

As more people begin using Canary Commons to find local businesses, trusted services, and aligned work in their region, the strongest listings will be the ones shaped by the people doing the work themselves.

If you'd like, this is a good moment to refine your listing and share a little more about what people should know when they find you.

You can:
- update your listing
- clarify what you offer
- share your story
- help people understand what makes your work meaningful

Refine Your Listing: ${claimUrl}

Your listing remains free whether or not you contribute. Canary Commons is non-competitive — businesses here are not ranked against one another, and contribution does not buy greater visibility. The aim is not to compete for attention. It's to make life-serving work easier to find.

If helping carry the project through its early growth feels worthwhile, that bridge keeps it independent and public until it can stand on its own.

Help Carry the Commons: ${foundersUrl}

And if it's not a fit, you can remove your listing at any time.

Remove Listing: ${removeUrl}

This is the second of three emails. If you don't do anything at all, your listing will remain on the map.

Thank you for all you are doing to inhabit the planet and community in a thoughtful way.

— Canary Commons

www.canarycommons.org
founder@canarycommons.org`;

  return { subject, html, text };
}
