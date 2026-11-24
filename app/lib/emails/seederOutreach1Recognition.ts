/**
 * Seeder outreach email 1 — minimal "you've been added" note.
 *
 * Sent immediately when a seeder places a listing (queued into
 * email_queue at placement, sent by the hourly email-queue-worker).
 */

import { getEmailHeader } from "./components/emailHeader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.canarycommons.org";

export function seederOutreach1Email(options: {
  businessName: string;
  listingId: string;
  state: string;
  county: string;
  removalToken: string;
  seederName: string;
}): { subject: string; html: string; text: string } {
  const { listingId, state, county } = options;

  // Accepted for interface consistency with the queue worker's call
  // shape, but this minimal copy has no greeting or remove button.
  void options.businessName;
  void options.removalToken;
  void options.seederName;

  // Public map deep link — not /edit/{id}, which opens a claim/edit
  // workflow for anyone without a steward session. state/county route
  // to the right region exactly like clicking a pin does; listingId is
  // read by a small effect in MapPageClient that selects this one
  // listing once it loads, reusing the existing marker-selection,
  // highlight, scroll-into-view, and (on mobile) drawer-opening behavior.
  const listingUrlParams = new URLSearchParams();
  if (state) listingUrlParams.set("state", state);
  if (county) listingUrlParams.set("county", county);
  listingUrlParams.set("listingId", listingId);
  const listingUrl = `${SITE_URL}/map?${listingUrlParams.toString()}`;

  const subject = "You’ve been added to Canary Commons";

  const html = `
<div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;padding:32px 24px;">
  ${getEmailHeader()}

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    You&rsquo;ve been added to Canary Commons, a free app helping people find
    and support places that care for people and planet.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Take a look: <a href="${listingUrl}" style="color:#1a2a3a;font-weight:700;text-decoration:underline;">your listing</a>
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 24px;">
    Share if you like: the more people who discover the map, the more
    people can discover you.
  </p>

  <p style="font-size:16px;font-style:italic;color:#9c6f12;margin:0 0 6px;">
    Connected, we dawn brighter.
  </p>

  <p style="font-size:14px;margin:0;">
    <a href="${SITE_URL}" style="color:#1a2a3a;text-decoration:none;">www.canarycommons.org</a>
  </p>

  <div style="text-align:center;color:rgba(138,109,42,0.3);font-size:18px;letter-spacing:0.5em;margin:24px 0 8px;">
    &#10047; &nbsp; &#10047; &nbsp; &#10047;
  </div>
</div>`.trim();

  const text = `You’ve been added to Canary Commons, a free app helping people find and support places that care for people and planet.

Take a look: ${listingUrl}

Share if you like: the more people who discover the map, the more people can discover you.

Connected, we dawn brighter.

www.canarycommons.org`;

  return { subject, html, text };
}
