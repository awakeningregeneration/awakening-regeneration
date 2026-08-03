import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSession } from "@/app/lib/seederAuth";
import { normalizeState, normalizeCounty, normalizeCity } from "@/app/lib/normalize";

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

async function geocodeForEdit(city: string, state: string): Promise<{ lat: number; lng: number }> {
  if (!mapboxToken) throw new Error("No Mapbox token");
  const query = encodeURIComponent(`${city}, ${state}, USA`);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}&limit=1`;
  const res = await fetch(url);
  const data = await res.json();
  const center = data?.features?.[0]?.center;
  if (!center) throw new Error(`Could not geocode ${city}, ${state}`);
  return { lng: center[0], lat: center[1] };
}

/**
 * POST /api/seeder/save-listing
 *
 * Saves edits to a listing by the seeder who placed it.
 * Auth: cc_seeder_session cookie. Authorization: placed_by_seeder_id
 * must match the session's seeder_id.
 *
 * Field allow-list enforced server-side: only user-facing content
 * fields are writable. System/stewardship/audit fields are rejected.
 */

const ALLOWED_FIELDS = [
  "title",
  "description",
  "website",
  "address",
  "city",
  "state",
  "county",
  "steward_email",
  "image_url",
] as const;

export async function POST(req: Request) {
  try {
    const session = getSeederSession(req);
    if (!session) {
      return NextResponse.json(
        { error: "No valid seeder session." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const listingId = body.listing_id;

    if (!listingId) {
      return NextResponse.json(
        { error: "Missing listing_id." },
        { status: 400 }
      );
    }

    // ── Verify this seeder placed this listing ──
    const { data: listing } = await supabaseAdmin
      .from("listings")
      .select("placed_by_seeder_id")
      .eq("id", listingId)
      .single();

    if (!listing || listing.placed_by_seeder_id !== session.seeder_id) {
      return NextResponse.json(
        { error: "You can only edit listings you placed." },
        { status: 403 }
      );
    }

    // ── Build update from allowed fields only ──
    const update: Record<string, unknown> = {};

    for (const f of ALLOWED_FIELDS) {
      if (body[f] !== undefined) {
        if (f === "city") {
          update[f] = normalizeCity(body[f]) || null;
        } else if (f === "state") {
          update[f] = normalizeState(body[f]) || null;
        } else if (f === "county") {
          update[f] = normalizeCounty(body[f]) || null;
        } else {
          update[f] =
            typeof body[f] === "string" ? body[f].trim() || null : body[f];
        }
      }
    }

    // title must not be emptied
    if (update.title === null) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 }
      );
    }

    if (body.category !== undefined) {
      update.category = Array.isArray(body.category)
        ? body.category.filter(
            (c: unknown) => typeof c === "string" && (c as string).trim()
          ).slice(0, 5)
        : [];
    }

    if (body.practices !== undefined) {
      update.practices = Array.isArray(body.practices)
        ? body.practices.filter(
            (p: unknown) => typeof p === "string" && (p as string).trim()
          )
        : [];
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: true, no_changes: true });
    }

    const { error: updateErr } = await supabaseAdmin
      .from("listings")
      .update(update)
      .eq("id", listingId);

    if (updateErr) {
      return NextResponse.json(
        { error: updateErr.message },
        { status: 500 }
      );
    }

    // ── Update listing_locations for multi-location listings ──
    const locationsPayload = body.locations;
    if (Array.isArray(locationsPayload) && locationsPayload.length > 1) {
      try {
        // Geocode all locations first — if any fail, we abort before touching the DB
        const inserts = await Promise.all(
          locationsPayload.map(async (loc: { address?: string; city?: string; state?: string }) => {
            const coords = await geocodeForEdit(loc.city?.trim() || "", loc.state?.trim() || "");
            return {
              listing_id: listingId,
              address: loc.address?.trim() || null,
              city: loc.city?.trim() || "",
              state: loc.state?.trim() || "",
              lat: coords.lat,
              lng: coords.lng,
            };
          })
        );
        await supabaseAdmin.from("listing_locations").delete().eq("listing_id", listingId);
        await supabaseAdmin.from("listing_locations").insert(inserts);
      } catch (locErr) {
        console.error("listing_locations update failed (non-blocking):", locErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Seeder save-listing error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save." },
      { status: 500 }
    );
  }
}
