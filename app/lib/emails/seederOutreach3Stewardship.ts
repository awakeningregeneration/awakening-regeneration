/**
 * Seeder outreach email 3 — minimal "follow the Canary" close.
 *
 * Sent 14 days after Email 2 (42 days after Email 1), queued by the
 * daily seeder-outreach cron and sent by the hourly email-queue-worker.
 */

import { getEmailHeader } from "./components/emailHeader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.canarycommons.org";

export function seederOutreach3Email(options: {
  businessName: string;
  listingId: string;
  removalToken: string;
}): { subject: string; html: string; text: string } {
  // Accepted for interface consistency with the queue worker's call
  // shape, but this minimal copy has no greeting, listing link, or
  // remove button — it points outward, to adding and installing.
  void options.businessName;
  void options.listingId;
  void options.removalToken;

  const submitUrl = `${SITE_URL}/submit`;
  const installUrl = `${SITE_URL}/install`;

  const subject = "Follow the Canary";

  const html = `
<div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;padding:32px 24px;">
  ${getEmailHeader()}

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    The Canary &mdash; the little bird in the coal mine who sensed the harm
    early &mdash; also knows the way out.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    You can help light the way.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    <a href="${submitUrl}" style="color:#1a2a3a;font-weight:700;text-decoration:underline;">Add other businesses, organizations, and projects</a>
    making a difference.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 24px;">
    <a href="${installUrl}" style="color:#1a2a3a;font-weight:700;text-decoration:underline;">Take Canary with you as an app</a>,
    and find the places where making a difference is the air they breathe.
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

  const text = `The Canary — the little bird in the coal mine who sensed the harm early — also knows the way out.

You can help light the way.

Add other businesses, organizations, and projects making a difference:
${submitUrl}

Take Canary with you as an app, and find the places where making a difference is the air they breathe:
${installUrl}

Connected, we dawn brighter.

www.canarycommons.org`;

  return { subject, html, text };
}
