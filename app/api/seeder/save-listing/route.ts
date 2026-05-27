import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSession } from "@/app/lib/seederAuth";
import { normalizeState, normalizeCounty, normalizeCity } from "@/app/lib/normalize";

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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Seeder save-listing error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save." },
      { status: 500 }
    );
  }
}
