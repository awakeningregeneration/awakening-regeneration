/**
 * Composite outreach message for seeders to use when a business
 * doesn't expose a direct email address. Designed for paste into
 * contact forms, chat widgets, social DMs, or reading aloud.
 *
 * Synthesizes the warmth and arc of the three-email outreach
 * cadence into a single touch.
 */

export const OUTREACH_TEMPLATE = `Hi [Business Name],

I'm reaching out from Canary Commons — a living map of regenerative and life-supporting efforts across the U.S. We've added you to the map because what you're doing is part of why it exists.

The map is non-extractive, non-pay-to-play, and free to be on. We don't rank listings or run ads. The commons stays open because people who believe in it choose to support it.

Your listing is already up, and we'd love for you to take stewardship of it — which just means you'll be able to update it directly as things shift. You can view it here: [listing URL]

We're also inviting people to become Founding Stewards — those whose membership helps bridge this season, as the living commons continues to be revealed. If that feels like a fit, we'd be glad to share more — canarycommons.org/founders.

To claim your listing, reply to this message (or visit the listing and click "Is this yours?") and we'll send a link to verify. Questions welcome.

With care,
[Seeder Name]
on behalf of Canary Commons`;

export function buildOutreachMessage(opts: {
  businessName?: string;
  listingUrl?: string;
  seederName?: string;
}): string {
  let msg = OUTREACH_TEMPLATE;
  if (opts.businessName) msg = msg.replace("[Business Name]", opts.businessName);
  if (opts.listingUrl) msg = msg.replace("[listing URL]", opts.listingUrl);
  if (opts.seederName) msg = msg.replace("[Seeder Name]", opts.seederName);
  return msg;
}
