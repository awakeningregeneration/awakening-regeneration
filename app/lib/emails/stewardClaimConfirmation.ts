/**
 * Steward claim confirmation email — sent when a steward successfully
 * claims a listing (domain-match auto-approve or grace-period activation).
 */

import { getEmailHeader } from "./components/emailHeader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.canarycommons.org";

export function stewardClaimConfirmationEmail(options: {
  stewardName: string;
  listingTitle: string;
  listingId: string;
}): { subject: string; html: string; text: string } {
  const { stewardName, listingTitle, listingId } = options;

  const greeting = stewardName ? `Hi ${stewardName},` : "Hi there,";
  const listingUrl = `${SITE_URL}/edit/${listingId}`;
  const submitUrl = `${SITE_URL}/submit`;
  const storiesUrl = `${SITE_URL}/stories/submit`;

  const subject = `You're the steward of ${listingTitle} on Canary Commons`;

  const html = `
<div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;padding:32px 24px;">
  ${getEmailHeader()}
  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">${greeting}</p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Thank you for claiming your place on the map.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    <strong>${listingTitle}</strong> is now yours to steward &mdash; which means
    you can update the details, add photos, and keep it current whenever
    something changes. No account to manage, no password to remember: just
    visit your listing&rsquo;s edit page and verify with your email when you
    need to.
  </p>

  <div style="text-align:center;margin:20px 0;">
    <a href="${listingUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#FFD86B;color:#1a2a0e;font-weight:700;font-size:15px;text-decoration:none;">
      View your listing
    </a>
  </div>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    While you&rsquo;re here &mdash; two invitations, no pressure on either:
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    If you know of another place that belongs on this map, you can add it
    directly: <a href="${submitUrl}" style="color:#1a2a3a;text-decoration:underline;">canarycommons.org/submit</a>
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    And if you&rsquo;d ever like to share a story &mdash; of how
    <strong>${listingTitle}</strong> came to be, or of something else in your
    area that&rsquo;s making the world a little more whole &mdash; there&rsquo;s
    a place for that too:
    <a href="${storiesUrl}" style="color:#1a2a3a;text-decoration:underline;">canarycommons.org/stories/submit</a>
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    This map exists because people like you are doing something worth
    noticing. We&rsquo;re glad it found you.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 12px;">
    Ren
  </p>

  <div style="text-align:left;">
    <img
      src="${SITE_URL}/lotus-mark.png"
      alt=""
      width="48"
      height="35"
      style="display:inline-block;width:48px;height:auto;"
    />
  </div>
</div>`.trim();

  const text = `${greeting}

Thank you for claiming your place on the map.

${listingTitle} is now yours to steward — which means you can update the details, add photos, and keep it current whenever something changes. No account to manage, no password to remember: just visit your listing's edit page and verify with your email when you need to.

View your listing: ${listingUrl}

While you're here — two invitations, no pressure on either:

If you know of another place that belongs on this map, you can add it directly: canarycommons.org/submit

And if you'd ever like to share a story — of how ${listingTitle} came to be, or of something else in your area that's making the world a little more whole — there's a place for that too: canarycommons.org/stories/submit

This map exists because people like you are doing something worth noticing. We're glad it found you.

Ren`;

  return { subject, html, text };
}
