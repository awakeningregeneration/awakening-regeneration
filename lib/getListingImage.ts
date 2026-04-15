/**
 * Resolve the image URL for a listing / affiliate / constellation entry.
 *
 * Priority:
 *  1. If `imageUrl` exists and is non-empty, return it.
 *  2. Else if a website/url is provided, return a Google favicon URL for
 *     that domain at 128px.
 *  3. Else return null — the fallback tile component handles the empty case.
 */
export function getListingImage(
  imageUrl?: string | null,
  websiteUrl?: string | null
): string | null {
  const trimmedImage = imageUrl?.trim();
  if (trimmedImage) {
    return trimmedImage;
  }

  const trimmedWebsite = websiteUrl?.trim();
  if (!trimmedWebsite) return null;

  try {
    // `new URL` requires a protocol. If the user stored a bare domain, add one.
    const normalized = /^https?:\/\//i.test(trimmedWebsite)
      ? trimmedWebsite
      : `https://${trimmedWebsite}`;
    const { hostname } = new URL(normalized);
    if (!hostname) return null;
    return `https://www.google.com/s2/favicons?sz=128&domain=${hostname}`;
  } catch {
    return null;
  }
}
