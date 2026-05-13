import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSession } from "@/app/lib/seederAuth";

/**
 * POST /api/seeder/log-outreach
 *
 * Records manual outreach (non-email channels) on a listing
 * the seeder placed. Sets outreach_status = 'manual_outreach_sent'.
 *
 * Auth: cc_seeder_session cookie. Authorization: placed_by_seeder_id
 * must match session seeder_id, and steward_id must be null (seeder
 * yields to claimed listings).
 */

const ALLOWED_METHODS = new Set([
  "copy_paste",
  "phone",
  "social_dm",
  "in_person",
  "other",
]);

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
    const { listing_id, outreach_methods, outreach_notes } = body;

    if (!listing_id) {
      return NextResponse.json(
        { error: "Missing listing_id." },
        { status: 400 }
      );
    }

    // Validate methods
    if (
      !Array.isArray(outreach_methods) ||
      outreach_methods.length === 0 ||
      !outreach_methods.every((m: unknown) => typeof m === "string" && ALLOWED_METHODS.has(m))
    ) {
      return NextResponse.json(
        { error: "At least one valid outreach method is required." },
        { status: 400 }
      );
    }

    // Verify ownership and no steward claim
    const { data: listing } = await supabaseAdmin
      .from("listings")
      .select("placed_by_seeder_id, steward_id")
      .eq("id", listing_id)
      .single();

    if (!listing || listing.placed_by_seeder_id !== session.seeder_id) {
      return NextResponse.json(
        { error: "You can only log outreach on listings you placed." },
        { status: 403 }
      );
    }

    if (listing.steward_id) {
      return NextResponse.json(
        { error: "This listing has been claimed by a steward." },
        { status: 403 }
      );
    }

    // Write outreach log
    const now = new Date().toISOString();
    const notes = typeof outreach_notes === "string" ? outreach_notes.trim() || null : null;

    const { error: updateErr } = await supabaseAdmin
      .from("listings")
      .update({
        outreach_methods: outreach_methods,
        outreach_notes: notes,
        outreach_status: "manual_outreach_sent",
        manual_outreach_at: now,
      })
      .eq("id", listing_id);

    if (updateErr) {
      return NextResponse.json(
        { error: updateErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      outreach_status: "manual_outreach_sent",
      outreach_methods: outreach_methods,
      outreach_notes: notes,
      manual_outreach_at: now,
    });
  } catch (err) {
    console.error("Seeder log-outreach error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to log outreach." },
      { status: 500 }
    );
  }
}
