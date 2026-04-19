/**
 * Domain matching utilities for the stewardship verification path.
 *
 * A "domain match" means the email address used to claim stewardship
 * shares the same root domain as the listing's website — e.g.,
 * info@ashlandfood.coop claiming ashlandfood.coop. Free email
 * providers (gmail, outlook, etc.) are excluded so someone with
 * a gmail address can't auto-match any listing.
 */

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "ymail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "fastmail.com",
  "gmx.com",
  "gmx.us",
  "gmx.net",
  "zoho.com",
  "hey.com",
  "pm.me",
]);

/**
 * Extract the domain portion of an email address, lowercased.
 * Returns null if the email is invalid or empty.
 */
export function getDomainFromEmail(email: string): string | null {
  const trimmed = email?.trim().toLowerCase();
  if (!trimmed) return null;
  const atIndex = trimmed.lastIndexOf("@");
  if (atIndex < 1) return null;
  const domain = trimmed.slice(atIndex + 1);
  return domain.includes(".") ? domain : null;
}

/**
 * Extract the root domain from a website URL, stripping subdomains.
 * "https://shop.ashlandfood.coop/path" → "ashlandfood.coop"
 * "ashlandfood.coop" (no protocol) → "ashlandfood.coop"
 * Returns null for empty/invalid input.
 */
export function getDomainFromWebsite(url: string): string | null {
  const trimmed = url?.trim();
  if (!trimmed) return null;

  // Normalize: add protocol if missing so URL() can parse it
  const normalized = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let hostname: string;
  try {
    hostname = new URL(normalized).hostname.toLowerCase();
  } catch {
    return null;
  }

  if (!hostname || !hostname.includes(".")) return null;

  // Strip subdomains: keep only the last N parts.
  // For standard TLDs (*.com, *.org): keep last 2 parts.
  // For compound TLDs (*.co.uk, *.com.au): keep last 3 parts.
  const parts = hostname.split(".");
  const compoundTlds = [
    "co.uk",
    "co.nz",
    "co.za",
    "com.au",
    "com.br",
    "org.uk",
    "net.au",
  ];
  const lastTwo = parts.slice(-2).join(".");
  if (compoundTlds.includes(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }
  return parts.slice(-2).join(".");
}

/**
 * Check whether an email domain matches a website domain.
 *
 * Returns true only if:
 * 1. Both domains resolve to non-null values
 * 2. The email domain matches the website's root domain
 * 3. The email domain is NOT a free email provider
 */
export function isDomainMatch(
  email: string,
  website: string | null
): boolean {
  if (!website) return false;

  const emailDomain = getDomainFromEmail(email);
  if (!emailDomain) return false;
  if (FREE_EMAIL_DOMAINS.has(emailDomain)) return false;

  const siteDomain = getDomainFromWebsite(website);
  if (!siteDomain) return false;

  return emailDomain === siteDomain;
}
