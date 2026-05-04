/**
 * Steward claim confirmation email — sent when a steward successfully
 * claims a listing (domain-match auto-approve or grace-period activation).
 *
 * Uses the Ren-approved copy from Stage F-prep.
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

  const greeting = stewardName ? `Hi ${stewardName},` : "Hi,";
  const listingUrl = `${SITE_URL}/edit/${listingId}`;

  const subject = `You've claimed ${listingTitle}`;

  const html = `
<div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;padding:32px 24px;">
  ${getEmailHeader()}
  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">${greeting}</p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    Thanks for taking stewardship of <strong>${listingTitle}</strong> on Canary
    Commons. Your listing is now in your care.
  </p>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    To make changes anytime in the future, just visit your listing&rsquo;s page
    on Canary Commons and enter this email address. We&rsquo;ll send you a fresh
    edit link. No password to remember, no account to maintain &mdash; just your
    email and the listing.
  </p>

  <div style="text-align:center;margin:20px 0;">
    <a href="${listingUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#FFD86B;color:#1a2a0e;font-weight:700;font-size:15px;text-decoration:none;">
      View your listing
    </a>
  </div>

  <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
    If you ever want to step away from this role or remove the listing
    entirely, you can do that from the same edit page.
  </p>

  <div style="text-align:center;color:rgba(138,109,42,0.3);font-size:18px;letter-spacing:0.5em;margin:24px 0 16px;">
    &#10047; &nbsp; &#10047; &nbsp; &#10047;
  </div>

  <p style="font-size:16px;line-height:1.7;margin:0 0 0;">
    &mdash; Ren<br/>
    Canary Commons
  </p>
</div>`.trim();

  const text = `${greeting}

Thanks for taking stewardship of ${listingTitle} on Canary Commons. Your listing is now in your care.

To make changes anytime in the future, just visit your listing's page on Canary Commons and enter this email address. We'll send you a fresh edit link. No password to remember, no account to maintain — just your email and the listing.

View your listing: ${listingUrl}

If you ever want to step away from this role or remove the listing entirely, you can do that from the same edit page.

— Ren
Canary Commons`;

  return { subject, html, text };
}
