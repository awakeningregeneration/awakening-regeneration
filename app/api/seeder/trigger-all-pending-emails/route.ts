import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSession } from "@/app/lib/seederAuth";
import { sendEmail1 } from "@/app/lib/sendEmail1";

/**
 * POST /api/seeder/trigger-all-pending-emails
 *
 * Sends Email 1 to every listing placed by this seeder that:
 *   - has a steward_email set
 *   - has no_public_email = false (or null)
 *   - has never received an outreach email (last_outreach_at IS NULL)
 *   - has a removal_token (required by sendEmail1)
 *
 * Intended for retroactive backfill when emails were added via edit
 * but the send was never triggered. Safe to call multiple times —
 * the last_outreach_at guard prevents duplicates.
 *
 * Returns { sent: number, skipped: number, errors: string[] }
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

    const { data: listings, error: fetchErr } = await supabaseAdmin
      .from("listings")
      .select("id, title, steward_email, no_public_email, last_outreach_at, removal_token")
      .eq("placed_by_seeder_id", session.seeder_id)
      .not("steward_email", "is", null)
      .is("last_outreach_at", null)
      .not("removal_token", "is", null);

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    const eligible = (listings ?? []).filter(
      (l) => l.steward_email?.trim() && !l.no_public_email
    );

    let sent = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const listing of eligible) {
      try {
        await sendEmail1({
          listingId: listing.id,
          businessName: listing.title,
          stewardEmail: listing.steward_email.trim(),
          removalToken: listing.removal_token,
          seederId: session.seeder_id,
        });
        sent++;
      } catch (err) {
        errors.push(
          `${listing.title}: ${err instanceof Error ? err.message : "unknown error"}`
        );
        skipped++;
      }
    }

    return NextResponse.json({ sent, skipped, total_eligible: eligible.length, errors });
  } catch (err) {
    console.error("trigger-all-pending-emails error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed." },
      { status: 500 }
    );
  }
}
