import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSession } from "@/app/lib/seederAuth";

/**
 * POST /api/seeder/trigger-all-pending-emails
 *
 * Queues Email 1 for every listing placed by this seeder that:
 *   - has a steward_email set
 *   - has no_public_email = false (or null)
 *   - has never received an outreach email (last_outreach_at IS NULL)
 *   - has a removal_token (required to build the email)
 *
 * Enqueues into email_queue rather than sending directly — the hourly
 * worker drains it within Resend's capacity. This is exactly the call
 * site that used to be able to exhaust a day's Resend quota in one
 * request when many listings were placed in a batch; queuing removes
 * that risk entirely since enqueuing never talks to Resend.
 *
 * Intended for retroactive backfill when emails were added via edit
 * but the send was never triggered. Safe to call multiple times — the
 * (listing_id, email_type) unique constraint on email_queue prevents
 * duplicate queue rows.
 *
 * Returns { queued: number, skipped: number, errors: string[] }
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

    let queued = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const listing of eligible) {
      const { error: queueErr } = await supabaseAdmin
        .from("email_queue")
        .upsert(
          { listing_id: listing.id, email_type: "email_1" },
          { onConflict: "listing_id,email_type", ignoreDuplicates: true }
        );
      if (queueErr) {
        errors.push(`${listing.title}: ${queueErr.message}`);
        skipped++;
      } else {
        queued++;
      }
    }

    return NextResponse.json({ queued, skipped, total_eligible: eligible.length, errors });
  } catch (err) {
    console.error("trigger-all-pending-emails error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed." },
      { status: 500 }
    );
  }
}
