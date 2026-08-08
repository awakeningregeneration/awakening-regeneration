import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSession } from "@/app/lib/seederAuth";
import { normalizeState, normalizeCounty, normalizeCity } from "@/app/lib/normalize";
import { sendEmail1 } from "@/app/lib/sendEmail1";

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
      .select("placed_by_seeder_id, steward_email, no_public_email, last_outreach_at, removal_token")
      .eq("id", listingId)
      .single();

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 }
      );
    }
    // Any authenticated seeder may edit any unclaimed listing.
    // placed_by_seeder_id is never overwritten — attribution stays with the original seeder.

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

    if (body.no_public_email !== undefined) {
      update.no_public_email = Boolean(body.no_public_email);
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

    // ── Auto-trigger Email 1 if email is now present and letter was never sent ──
    // Resolves the effective post-save email and no_public_email values.
    const effectiveEmail = (
      update.steward_email !== undefined
        ? (update.steward_email as string | null)
        : listing.steward_email
    )?.trim();
    const effectiveNoPublicEmail =
      update.no_public_email !== undefined
        ? Boolean(update.no_public_email)
        : Boolean(listing.no_public_email);

    if (
      effectiveEmail &&
      !effectiveNoPublicEmail &&
      !listing.last_outreach_at &&
      listing.removal_token &&
      listing.placed_by_seeder_id  // need original seeder for attribution
    ) {
      // Non-blocking — save already succeeded; email failure is logged, not surfaced.
      // Always attribute to the placing seeder, regardless of who performed this edit.
      sendEmail1({
        listingId,
        businessName: (update.title as string | undefined) ?? "",
        stewardEmail: effectiveEmail,
        removalToken: listing.removal_token,
        seederId: listing.placed_by_seeder_id,
      }).catch((err) =>
        console.error("Auto Email 1 failed for listing", listingId, err)
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
