import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { isDomainMatch } from "@/app/lib/domainMatch";
import { generateVerificationToken } from "@/app/lib/stewardshipTokens";
import { sendStewardVerificationEmail } from "@/app/lib/emails/stewardVerification";

import { normalizeState, normalizeCounty, normalizeCity, normalizeName } from "@/app/lib/normalize";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function geocodeLocation(params: {
  address?: string;
  city?: string;
  county?: string;
  state?: string;
}) {
  // Strip PO Box addresses before geocoding — Mapbox misinterprets box numbers
  // as street numbers and can pin to a wrong city. Geocode city+state only instead.
  const PO_BOX_RE = /\bP\.?O\.?\s*Box\b|\bPost\s+Office\s+Box\b/i;
  const safeAddress =
    params.address && PO_BOX_RE.test(params.address) ? undefined : params.address;

  const parts = [
    safeAddress?.trim(),
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

  // Attach location rows for multi-location listings (table may not exist yet — non-blocking)
  let locationsMap: Record<string, Array<{ id: string; address: string | null; city: string; state: string; county: string | null; lat: number; lng: number; label: string | null }>> = {};
  try {
    const { data: locationRows } = await supabaseAdmin
      .from("listing_locations")
      .select("id, listing_id, address, city, state, county, lat, lng, label");
    if (locationRows) {
      for (const row of locationRows) {
        if (!locationsMap[row.listing_id]) locationsMap[row.listing_id] = [];
        locationsMap[row.listing_id].push(row);
      }
    }
  } catch {
    // table not yet created — fall through with empty map
  }
  const enriched = (data || []).map((l: Record<string, unknown>) => ({
    ...l,
    locations: locationsMap[l.id as string] ?? [],
  }));
  return NextResponse.json(enriched);
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

    const category = Array.isArray(categories)
      ? categories.map((c: unknown) => typeof c === "string" ? c.trim() : "").filter(Boolean).slice(0, 5)
      : [];

    if (category.length === 0) {
      return NextResponse.json(
        { error: "At least one category is required." },
        { status: 400 }
      );
    }

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

    // ── Universal block check (do_not_list_level = 'universal') ──
    // Prevents re-submission of a listing that a steward has permanently removed.
    // See OPT_OUT_LAYERS.md for the full consent model.
    if (title?.trim()) {
      const normalizedTitle = normalizeName(title);

      const { data: blocked } = await supabaseAdmin
        .from("listings")
        .select("id, title")
        .eq("do_not_list", true)
        .eq("do_not_list_level", "universal")
        .eq("do_not_list_override", false)
        .eq("normalized_name", normalizedTitle)
        .eq("state", normalizedState)
        .limit(1)
        .maybeSingle();

      if (blocked) {
        return NextResponse.json(
          { error: "UNIVERSALLY_BLOCKED", blocked_title: blocked.title },
          { status: 403 }
        );
      }

      // ── Duplicate check (active listing with same name in same city) ──
      if (!body.override_duplicate) {
        const { data: existing } = await supabaseAdmin
          .from("listings")
          .select("id, title, city")
          .eq("normalized_name", normalizedTitle)
          .ilike("city", normalizedCity)
          .eq("status", "active")
          .limit(1)
          .maybeSingle();

        if (existing) {
          return NextResponse.json({
            duplicate_found: true,
            matched: {
              id: existing.id,
              title: existing.title,
              city: existing.city,
            },
          });
        }
      }
    }

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

    // ── Insert extra locations for multi-location listings ──
    const locationsPayload = body.locations;
    if (Array.isArray(locationsPayload) && locationsPayload.length > 1 && data?.id) {
      try {
        const locationInserts = await Promise.all(
          locationsPayload.map(async (loc: { address?: string; city?: string; state?: string }) => {
            const locCoords = await geocodeLocation({
              address: loc.address,
              city: loc.city,
              state: loc.state,
            });
            return {
              listing_id: data.id,
              address: loc.address?.trim() || null,
              city: loc.city?.trim() || "",
              state: loc.state?.trim() || "",
              lat: locCoords.lat,
              lng: locCoords.lng,
            };
          })
        );
        await supabaseAdmin.from("listing_locations").insert(locationInserts);
      } catch (locErr) {
        console.error("listing_locations insert failed (non-blocking):", locErr);
      }
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