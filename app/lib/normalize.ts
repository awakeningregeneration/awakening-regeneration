/**
 * Shared normalization utilities for location and business name fields.
 *
 * Single source of truth for normalization across write paths, read paths,
 * and matching logic. All normalization changes should happen here.
 *
 * Used by:
 * - app/api/listings/route.ts (public submit)
 * - app/api/seeder/place-listing/route.ts (seeder placement)
 * - Any future endpoint or utility that normalizes location or name data
 */

const STATE_ABBREVIATIONS: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas",
  CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho",
  IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas",
  KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
  VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia",
  WI: "Wisconsin", WY: "Wyoming", DC: "District of Columbia",
};

export function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function normalizeState(value?: string): string {
  const raw = value?.trim();
  if (!raw) return "";
  const upper = raw.toUpperCase();
  if (STATE_ABBREVIATIONS[upper]) return STATE_ABBREVIATIONS[upper];
  return toTitleCase(raw);
}

export function normalizeCounty(value?: string): string {
  const raw = value?.trim();
  if (!raw) return "";
  const withoutCounty = raw.replace(/\s+county$/i, "").trim();
  if (!withoutCounty) return "";
  return `${toTitleCase(withoutCounty)} County`;
}

export function normalizeCity(value?: string): string {
  const raw = value?.trim();
  if (!raw) return "";
  return toTitleCase(raw);
}

/**
 * Normalize a business name for matching against normalized_name column.
 * Same logic as the DB trigger normalize_listing_fields():
 * lowercase, trim, strip leading articles (the/a/an), collapse spaces.
 */
export function normalizeName(name: string): string {
  let v = name.toLowerCase().trim();
  v = v.replace(/^(the|a|an)\s+/i, "");
  v = v.replace(/\s+/g, " ");
  return v;
}
