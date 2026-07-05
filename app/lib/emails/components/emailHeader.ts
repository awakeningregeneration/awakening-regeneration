/**
 * Shared email header with Canary Commons logo.
 *
 * Returns an HTML string that can be inserted at the top of any
 * email template's body. Works in both <table> and <div> wrapper
 * patterns — uses a simple centered block that's email-client safe.
 *
 * Inline styles only (email clients require them).
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.canarycommons.org";

export function getEmailHeader(): string {
  const logoUrl = `${SITE_URL}/canary-logo-new.png`;

  return `<div style="text-align:center;margin:0 0 32px;">
  <img
    src="${logoUrl}"
    alt="Canary Commons"
    width="80"
    height="auto"
    style="display:inline-block;width:80px;height:auto;filter:drop-shadow(0 2px 6px rgba(138,109,42,0.15));"
  />
</div>`;
}
