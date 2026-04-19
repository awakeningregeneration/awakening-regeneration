import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { isDomainMatch } from "@/app/lib/domainMatch";
import { generateVerificationToken } from "@/app/lib/stewardshipTokens";
import { sendStewardVerificationEmail } from "@/app/lib/emails/stewardVerification";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const STATE_ABBREVIATIONS: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeState(value?: string) {
  const raw = value?.trim();
  if (!raw) return "";

  const upper = raw.toUpperCase();
  if (STATE_ABBREVIATIONS[upper]) {
    return STATE_ABBREVIATIONS[upper];
  }

  return toTitleCase(raw);
}

function normalizeCounty(value?: string) {
  const raw = value?.trim();
  if (!raw) return "";

  const withoutCounty = raw.replace(/\s+county$/i, "").trim();
  if (!withoutCounty) return "";

  return `${toTitleCase(withoutCounty)} County`;
}

function normalizeCity(value?: string) {
  const raw = value?.trim();
  if (!raw) return "";
  return toTitleCase(raw);
}

async function geocodeLocation(params: {
  address?: string;
  city?: string;
  county?: string;
  state?: string;
}) {
  const parts = [
    params.address?.trim(),
    params.city?.trim(),
    params.county?.trim(),
    params.state?.trim(),
    "USA",
  ].filter(Boolean);

  const query = parts.join(", ");

  if (!query) {
    throw new Error("No location information provided for geocoding.");
  }

  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
    `${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to geocode location.");
  }

  const data = await response.json();

  const feature = data?.features?.[0];
  const center = feature?.center;

  if (!center || center.length < 2) {
    throw new Error("Could not determine map coordinates.");
  }

  const [lng, lat] = center;

  return { lng, lat };
}

// GET
export async function GET() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "active");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST
export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("POST /api/listings body:", JSON.stringify({
      claim_stewardship: body.claim_stewardship,
      steward_email: body.steward_email,
      steward_display_name: body.steward_display_name,
      listing_title: body.title,
    }));

    const {
      title,
      description,
      website,
      address,
      city,
      state,
      county,
      categories,
      practices,
      image_url,
    } = body;

    const normalizedCity = normalizeCity(city);
    const normalizedState = normalizeState(state);
    const normalizedCounty = normalizeCounty(county);

    const category =
      Array.isArray(categories) && categories.length > 0
        ? categories[0]
        : "";

    const cleanPractices = Array.isArray(practices)
      ? practices
          .map((p: unknown) =>
            typeof p === "string" ? p.trim() : ""
          )
          .filter(Boolean)
      : [];

    const { lng, lat } = await geocodeLocation({
      address,
      city: normalizedCity,
      county: normalizedCounty,
      state: normalizedState,
    });

    const { data, error } = await supabase
      .from("listings")
      .insert([
        {
          title: title?.trim() || "",
          description: description?.trim() || "",
          website: website?.trim() || null,
          address: address?.trim() || null,
          city: normalizedCity || null,
          state: normalizedState || null,
          county: normalizedCounty || null,
          category,
          practices: cleanPractices,
          lng,
          lat,
          status: "active",
          ...(image_url?.trim() && { image_url: image_url.trim() }),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ── Stewardship claim (optional, non-blocking) ──────────
    let stewardshipClaimPending = false;

    const claimStewardship = body.claim_stewardship === true;
    const stewardEmail = body.steward_email?.trim();

    if (claimStewardship && stewardEmail && data?.id) {
      try {
        const listingWebsite = website?.trim() || null;
        const verificationPath = isDomainMatch(stewardEmail, listingWebsite)
          ? "domain_match"
          : "declaration";

        // Insert steward record (admin client — bypasses RLS)
        const { data: steward, error: stewardError } = await supabaseAdmin
          .from("stewards")
          .insert([
            {
              listing_id: data.id,
              email: stewardEmail,
              display_name: body.steward_display_name?.trim() || null,
              verification_path: verificationPath,
              status: "pending",
            },
          ])
          .select()
          .single();

        if (stewardError) throw stewardError;

        // Generate token and create claim (admin client — bypasses RLS)
        const token = generateVerificationToken();
        const tokenExpiresAt = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString();

        const { error: claimError } = await supabaseAdmin
          .from("stewardship_claims")
          .insert([
            {
              steward_id: steward.id,
              verification_token: token,
              token_expires_at: tokenExpiresAt,
            },
          ]);

        if (claimError) throw claimError;

        // Send verification email
        await sendStewardVerificationEmail({
          toEmail: stewardEmail,
          displayName: body.steward_display_name?.trim() || null,
          listingName: title?.trim() || "your listing",
          token,
          verificationPath,
        });

        stewardshipClaimPending = true;
        console.log(
          `Stewardship claim initiated: ${stewardEmail} → listing ${data.id} (${verificationPath})`
        );
      } catch (stewardErr) {
        // Log but do NOT fail the listing creation
        console.error(
          "Stewardship setup failed (listing still created):",
          stewardErr
        );
      }
    }

    return NextResponse.json({
      ...data,
      stewardship_claim_pending: stewardshipClaimPending,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create listing",
      },
      { status: 500 }
    );
  }
}