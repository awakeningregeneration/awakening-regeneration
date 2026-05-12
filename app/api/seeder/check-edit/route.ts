import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSession } from "@/app/lib/seederAuth";

/**
 * GET /api/seeder/check-edit?listing_id=xxx
 *
 * Checks whether the current user (via cc_seeder_session cookie)
 * is the seeder who placed this listing AND no steward has claimed it.
 * Once a steward claims, the seeder yields edit access — the tending
 * shifts to the steward. Used by the edit page to grant seeder_edit mode.
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listing_id");

  if (!listingId) {
    return NextResponse.json({ isPlacingSeeder: false });
  }

  const session = getSeederSession(req);
  if (!session) {
    return NextResponse.json({ isPlacingSeeder: false });
  }

  const { data: listing } = await supabaseAdmin
    .from("listings")
    .select("placed_by_seeder_id, steward_id")
    .eq("id", listingId)
    .single();

  if (!listing || listing.placed_by_seeder_id !== session.seeder_id) {
    return NextResponse.json({ isPlacingSeeder: false });
  }

  // Seeder yields edit access once a steward has claimed
  if (listing.steward_id) {
    return NextResponse.json({ isPlacingSeeder: false });
  }

  return NextResponse.json({ isPlacingSeeder: true });
}
