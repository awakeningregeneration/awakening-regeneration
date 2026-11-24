/**
 * Seeder outreach email 2 — minimal "share your story" invitation.
 *
 * Sent 28 days after Email 1, queued by the daily seeder-outreach cron
 * and sent by the hourly email-queue-worker.
 */

import { getEmailHeader } from "./components/emailHeader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.canarycommons.org";

export function seederOutreach2Email(options: {
  businessName: string;
  listingId: string;
  removalToken: string;
}): { subject: string; html: string; text: string } {
  const { listingId } = options;

  // Accepted for interface consistency with the queue worker's call
  // shape, but this minimal copy has no greeting or remove button.
  void options.businessName;
  void options.removalToken;

  const storySubmitUrl = `${SITE_URL}/stories/submit?listingId=${listingId}`;

  const subject = "Your story could light the way";

  const html = `
<div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;padding:32px 24px;">
  ${getEmailHeader()}

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Glad you&rsquo;re on the map!
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Be part of a movement.
    <a href="${storySubmitUrl}" style="color:#1a2a3a;font-weight:700;text-decoration:underline;">Share how your business, project, or offering came into the world.</a>
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 24px;">
    The steps you took could be the bridge for someone making their way now.
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

  const text = `Glad you’re on the map!

Be part of a movement. Share how your business, project, or offering came into the world:
${storySubmitUrl}

The steps you took could be the bridge for someone making their way now.

Connected, we dawn brighter.

www.canarycommons.org`;

  return { subject, html, text };
}
