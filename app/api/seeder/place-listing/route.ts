import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSession } from "@/app/lib/seederAuth";
import { sendEmail1 } from "@/app/lib/sendEmail1";

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Categories and practices for seeder placement form.
// Note: these are intentionally not shared with the other submit forms
// (submit, support/submit, contributor/submit, constellation/submit).
// Each surface owns its own taxonomy because surfaces may evolve
// independently as Canary Commons grows. They happen to share identical
// values today; that's coincidence, not architectural truth.
// See GROWTH_LIST.md for the audit task on the four existing copies.
const VALID_CATEGORIES = new Set([
  "Food & Nourishment",
  "Home & Shelter",
  "Health & Wellbeing",
  "Energy & Infrastructure",
  "Land & Ecology",
  "Materials & Goods",
  "Learning & Education",
  "Travel & Movement",
  "Community & Culture",
  "Conflict Transformation & Repair",
  "Finance & Systems",
]);

const VALID_PRACTICES = new Set([
  "Organic",
  "Regenerative",
  "Permaculture",
  "Fair Trade",
  "Biodegradable",
  "Compostable",
  "Recycled Materials",
  "Upcycled Materials",
  "Low Waste",
  "Zero Waste",
  "Local",
  "Worker-Owned / Cooperative",
  "Community Owned",
  "Renewable Energy",
  "Educational",
  "Accessible / Sliding Scale",
  "Volunteer Run",
  "Nonprofit / Mission Driven",
  "Indigenous Led",
  "Women Led",
  "Trauma-Informed",
  "Restorative",
  "Somatic",
  "Nonviolent",
  "Peer Supported",
  "Community Led",
  "Justice-Oriented",
]);

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

/**
 * Normalize a business name the same way the DB trigger does:
 * lowercase, trim, strip leading articles (the/a/an), collapse spaces.
 */
function normalizeName(name: string): string {
  let v = name.toLowerCase().trim();
  v = v.replace(/^(the|a|an)\s+/i, "");
  v = v.replace(/\s+/g, " ");
  return v;
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function normalizeState(value?: string): string {
  const raw = value?.trim();
  if (!raw) return "";
  const upper = raw.toUpperCase();
  if (STATE_ABBREVIATIONS[upper]) return STATE_ABBREVIATIONS[upper];
  return toTitleCase(raw);
}

function normalizeCounty(value?: string): string {
  const raw = value?.trim();
  if (!raw) return "";
  const withoutCounty = raw.replace(/\s+county$/i, "").trim();
  if (!withoutCounty) return "";
  return `${toTitleCase(withoutCounty)} County`;
}

function normalizeCity(value?: string): string {
  const raw = value?.trim();
  if (!raw) return "";
  return toTitleCase(raw);
}

/**
 * Geocode via Mapbox and extract county from the response context.
 * Returns { lng, lat, county } where county is auto-derived, not user-input.
 */
async function geocodeLocation(params: {
  address?: string;
  city?: string;
  state?: string;
}): Promise<{ lng: number; lat: number; county: string }> {
  if (!mapboxToken) {
    throw new Error("Mapbox token is not configured.");
  }

  const parts = [
    params.address?.trim(),
    params.city?.trim(),
    params.state?.trim(),
    "USA",
  ].filter(Boolean);

  const query = parts.join(", ");
  if (!query) throw new Error("No location information provided for geocoding.");

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to geocode location.");

  const data = await response.json();
  const feature = data?.features?.[0];
  const center = feature?.center;
  if (!center || center.length < 2) throw new Error("Could not determine map coordinates.");

  // Extract county from Mapbox context (same pattern as MapClient.tsx moveend handler)
  let county = "";

  // The feature itself might be a district (county)
  if (feature?.place_type?.includes("district")) {
    county = feature.text || "";
  }

  // Or county appears in the context array
  const ctx = feature?.context || [];
  for (const item of ctx) {
    if (typeof item?.id === "string" && item.id.startsWith("district.")) {
      county = item.text || "";
      break;
    }
  }

  // Strip trailing " County" if Mapbox included it, then re-normalize
  county = county.replace(/\s+County$/i, "").trim();

  return { lng: center[0], lat: center[1], county };
}

export async function POST(req: Request) {
  const session = getSeederSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const {
    title,
    description,
    category,
    practices,
    city,
    state,
    address,
    website,
    steward_email,
    override_do_not_list,
  } = body;

  // ── Validation ──

  if (!title || typeof title !== "string" || title.trim().length < 2) {
    return NextResponse.json({ error: "Title is required (at least 2 characters)." }, { status: 400 });
  }
  if (title.trim().length > 200) {
    return NextResponse.json({ error: "Title must be 200 characters or fewer." }, { status: 400 });
  }

  if (!description || typeof description !== "string" || description.trim().length < 10) {
    return NextResponse.json({ error: "Description is required (at least 10 characters)." }, { status: 400 });
  }
  if (description.trim().length > 2000) {
    return NextResponse.json({ error: "Description must be 2000 characters or fewer." }, { status: 400 });
  }

  // Validate category array (1-5 items, each must be in VALID_CATEGORIES)
  const categoryArray = Array.isArray(category)
    ? category.filter((c: string) => VALID_CATEGORIES.has(c)).slice(0, 5)
    : typeof category === "string" && VALID_CATEGORIES.has(category)
      ? [category]
      : [];

  if (categoryArray.length === 0) {
    return NextResponse.json({ error: "Please select at least one valid category." }, { status: 400 });
  }

  if (
    !Array.isArray(practices) ||
    practices.length === 0 ||
    !practices.every((p: unknown) => typeof p === "string" && VALID_PRACTICES.has(p))
  ) {
    return NextResponse.json({ error: "Please select at least one valid practice." }, { status: 400 });
  }

  if (!city || typeof city !== "string" || city.trim().length < 2) {
    return NextResponse.json({ error: "City is required." }, { status: 400 });
  }

  if (!state || typeof state !== "string" || state.trim().length < 2) {
    return NextResponse.json({ error: "State is required." }, { status: 400 });
  }

  if (website && typeof website === "string" && website.trim()) {
    try {
      new URL(website.trim().startsWith("http") ? website.trim() : `https://${website.trim()}`);
    } catch {
      return NextResponse.json({ error: "Website URL does not look valid." }, { status: 400 });
    }
  }

  if (steward_email && typeof steward_email === "string" && steward_email.trim()) {
    if (!steward_email.includes("@") || !steward_email.includes(".")) {
      return NextResponse.json({ error: "Steward email does not look valid." }, { status: 400 });
    }
  }

  // ── do_not_list check ──

  if (!override_do_not_list) {
    const normalized = normalizeName(title);
    const { data: blocked } = await supabaseAdmin
      .from("listings")
      .select("id, do_not_list_reason, do_not_list_at, title, city")
      .eq("do_not_list", true)
      .eq("normalized_name", normalized)
      .ilike("city", city.trim())
      .limit(1)
      .maybeSingle();

    if (blocked) {
      return NextResponse.json({
        requires_override: true,
        matched: {
          title: blocked.title,
          city: blocked.city,
          reason: blocked.do_not_list_reason,
          at: blocked.do_not_list_at,
        },
      });
    }
  }

  // ── Normalize and geocode (county auto-derived) ──

  const normalizedCity = normalizeCity(city);
  const normalizedState = normalizeState(state);

  let coords: { lng: number; lat: number; county: string };
  try {
    coords = await geocodeLocation({
      address: address?.trim(),
      city: normalizedCity,
      state: normalizedState,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Geocoding failed." },
      { status: 400 }
    );
  }

  const normalizedCounty = normalizeCounty(coords.county);

  // ── Generate removal token ──

  const removalToken = randomBytes(24).toString("base64url");

  // ── Insert listing ──

  const { data: listing, error: insertError } = await supabaseAdmin
    .from("listings")
    .insert([
      {
        title: title.trim(),
        description: description.trim(),
        category: categoryArray,
        practices: practices.filter((p: string) => VALID_PRACTICES.has(p)),
        city: normalizedCity || null,
        state: normalizedState || null,
        county: normalizedCounty || null,
        address: address?.trim() || null,
        website: website?.trim() || null,
        steward_email: steward_email?.trim() || null,
        lng: coords.lng,
        lat: coords.lat,
        source: "seeder_placed",
        placed_by_seeder_id: session.seeder_id,
        outreach_status: "not_started",
        do_not_list_override: override_do_not_list === true,
        removal_token: removalToken,
        status: "active",
      },
    ])
    .select()
    .single();

  if (insertError || !listing) {
    console.error("Failed to insert listing:", insertError?.message);
    return NextResponse.json(
      { error: "Failed to create listing." },
      { status: 500 }
    );
  }

  // ── Send Email 1 if steward_email is provided ──

  let emailSent = false;

  if (steward_email?.trim()) {
    try {
      await sendEmail1({
        listingId: listing.id,
        businessName: title.trim(),
        stewardEmail: steward_email.trim(),
        removalToken,
        seederId: session.seeder_id,
      });
      emailSent = true;
    } catch (emailErr) {
      console.error("Email 1 failed to send:", emailErr);
      // Listing is still created — email failure is non-blocking
    }
  }

  return NextResponse.json({
    success: true,
    listingId: listing.id,
    businessName: title.trim(),
    emailSent,
  });
}
