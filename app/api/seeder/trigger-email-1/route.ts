import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSession } from "@/app/lib/seederAuth";
import { sendEmail1 } from "@/app/lib/sendEmail1";

/**
 * POST /api/seeder/trigger-email-1
 *
 * Retroactively triggers Email 1 for a listing that was placed
 * without a steward_email (or whose email was added later).
 *
 * Auth: cc_seeder_session cookie. Only the placing seeder can trigger.
 * Refuses to re-send if outreach has already started.
 */

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
    const { listing_id } = body;

    if (!listing_id) {
      return NextResponse.json(
        { error: "Missing listing_id." },
        { status: 400 }
      );
    }

    // Fetch the listing
    const { data: listing } = await supabaseAdmin
      .from("listings")
      .select(
        "id, title, steward_email, removal_token, placed_by_seeder_id, outreach_status, last_outreach_at"
      )
      .eq("id", listing_id)
      .single();

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 }
      );
    }

    // Must be the placing seeder
    if (listing.placed_by_seeder_id !== session.seeder_id) {
      return NextResponse.json(
        { error: "You can only trigger Email 1 for listings you placed." },
        { status: 403 }
      );
    }

    // Must have steward_email
    if (!listing.steward_email?.trim()) {
      return NextResponse.json(
        { error: "This listing has no steward email. Add one first." },
        { status: 400 }
      );
    }

    // Must not have already received outreach
    if (listing.last_outreach_at) {
      return NextResponse.json(
        { error: "Email 1 has already been sent for this listing." },
        { status: 409 }
      );
    }

    // Must have a removal token
    if (!listing.removal_token) {
      return NextResponse.json(
        { error: "This listing is missing a removal token." },
        { status: 400 }
      );
    }

    // Send Email 1 — throws on Resend failure
    await sendEmail1({
      listingId: listing.id,
      businessName: listing.title,
      stewardEmail: listing.steward_email.trim(),
      removalToken: listing.removal_token,
      seederId: session.seeder_id,
    });

    return NextResponse.json({
      success: true,
      listing_id: listing.id,
      sent_to: listing.steward_email,
    });
  } catch (err) {
    console.error("Trigger Email 1 failed:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to send Email 1.",
      },
      { status: 500 }
    );
  }
}
