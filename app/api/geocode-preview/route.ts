import { NextResponse } from "next/server";
import { normalizeState, normalizeCounty } from "@/app/lib/normalize";
import { getClientIp, hashIp, createRateLimiter } from "@/app/lib/rateLimit";

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// This is a direct, unauthenticated proxy to paid Mapbox geocoding — the
// single cheapest thing in the app to abuse (no write even has to
// succeed). A real person previewing their address during submission
// calls this once per "Review" click, plus the occasional retry after
// fixing a typo — a handful of calls per session at most. This limit is
// generous enough that no legitimate user will ever notice it.
const GEOCODE_PREVIEW_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const GEOCODE_PREVIEW_RATE_LIMIT_MAX = 30;
const isGeocodePreviewRateLimited = createRateLimiter(
  GEOCODE_PREVIEW_RATE_LIMIT_WINDOW_MS,
  GEOCODE_PREVIEW_RATE_LIMIT_MAX
);

// POST /api/geocode-preview — no auth, no writes
// Body: { address?: string; city: string; state: string; zip?: string }
// Returns: { county: string; geocodedState: string; lat: number; lng: number; stateMatches: boolean }
export async function POST(req: Request) {
  const ipHash = hashIp(getClientIp(req));
  if (isGeocodePreviewRateLimited(ipHash)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  if (!mapboxToken) {
    return NextResponse.json({ error: "Mapbox token is not configured." }, { status: 500 });
  }

  let body: { address?: string; city?: string; state?: string; zip?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { address, city, state, zip } = body;

  if (!city && !address) {
    return NextResponse.json({ error: "At least city or address is required." }, { status: 400 });
  }

  // Strip PO Box addresses before geocoding
  const PO_BOX_RE = /\bP\.?O\.?\s*Box\b|\bPost\s+Office\s+Box\b/i;
  const safeAddress = address && PO_BOX_RE.test(address) ? undefined : address;

  const query = [safeAddress?.trim(), city?.trim(), state?.trim(), zip?.trim(), "USA"]
    .filter(Boolean)
    .join(", ");

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    return NextResponse.json({ error: "Geocoding request failed." }, { status: 502 });
  }

  if (!response.ok) {
    return NextResponse.json({ error: "Geocoding failed." }, { status: 502 });
  }

  const data = await response.json();
  const feature = data?.features?.[0];
  const center = feature?.center;

  if (!center || center.length < 2) {
    return NextResponse.json({ error: "Could not determine map coordinates." }, { status: 422 });
  }

  const [lng, lat] = center as [number, number];

  // Extract county from Mapbox context
  let countyRaw = "";
  if (feature?.place_type?.includes("district")) {
    countyRaw = feature.text || "";
  }
  for (const ctx of feature?.context ?? []) {
    if (typeof ctx?.id === "string" && ctx.id.startsWith("district.")) {
      countyRaw = ctx.text || "";
      break;
    }
  }
  countyRaw = countyRaw.replace(/\s+County$/i, "").trim();
  const county = normalizeCounty(countyRaw);

  // Extract state from Mapbox context
  let geocodedStateName = "";
  for (const ctx of feature?.context ?? []) {
    if (typeof ctx?.id === "string" && ctx.id.startsWith("region.")) {
      geocodedStateName = ctx.text ?? "";
      break;
    }
  }
  if (!geocodedStateName && feature?.place_type?.includes("region")) {
    geocodedStateName = feature.text ?? "";
  }

  const stateMatches =
    !geocodedStateName ||
    normalizeState(geocodedStateName) === normalizeState(state);

  return NextResponse.json({
    county,
    geocodedState: geocodedStateName,
    lat,
    lng,
    stateMatches,
  });
}
