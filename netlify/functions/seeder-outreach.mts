import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

/**
 * Daily seeder outreach cadence — runs at 6am Pacific (13:00 UTC).
 *
 * Queries for listings due for Email 2 (7 days after Email 1) and
 * Email 3 (14 days after Email 2), and queues them into email_queue
 * (email-queue-worker.mts sends them within Resend's capacity — this
 * function no longer calls Resend directly).
 *
 * outreach_status only advances when the worker actually sends the
 * email, not when it's queued here — so a listing stays a candidate
 * for this same query across multiple daily runs until it's genuinely
 * sent, and the (listing_id, email_type) unique constraint on
 * email_queue means re-finding the same candidate tomorrow is a safe
 * no-op rather than a duplicate queue row.
 *
 * Each query is still capped at 50 results per run — now just to keep
 * this function's own work bounded, since the worker is what actually
 * throttles real send volume against live Resend capacity.
 *
 * Mirrors the pattern from netlify/functions/synonym-digest.mts:
 * creates its own Supabase client (Netlify Functions run in a
 * different context than Next.js).
 */

const supabase = createClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type OutreachCandidate = {
  id: string;
};

async function enqueue(
  emailType: "email_2" | "email_3",
  candidates: OutreachCandidate[]
): Promise<{ queued: number; failed: number }> {
  let queued = 0;
  let failed = 0;
  for (const listing of candidates) {
    const { error } = await supabase.from("email_queue").upsert(
      { listing_id: listing.id, email_type: emailType },
      { onConflict: "listing_id,email_type", ignoreDuplicates: true }
    );
    if (error) {
      failed++;
      console.error(`[seeder-outreach] Failed to queue ${emailType} for ${listing.id}:`, error.message);
    } else {
      queued++;
    }
  }
  return { queued, failed };
}

export default async function handler() {
  const now = new Date();
  console.log(`[seeder-outreach] Running at ${now.toISOString()}`);

  let email2Queued = 0;
  let email2Failed = 0;
  let email3Queued = 0;
  let email3Failed = 0;

  // ── Email 2 candidates: email_1_sent AND 28+ days since outreach started ──
  // Email 2 fires 28 days after Email 1 (was 7)

  const twentyEightDaysAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString();

  const { data: email2Candidates, error: e2Err } = await supabase
    .from("listings")
    .select("id")
    .eq("source", "seeder_placed")
    .not("placed_by_seeder_id", "is", null)
    .eq("status", "active")
    .eq("outreach_status", "email_1_sent")
    .not("steward_email", "is", null)
    .lte("outreach_started_at", twentyEightDaysAgo)
    .limit(50);

  if (e2Err) {
    console.error("[seeder-outreach] Email 2 query error:", e2Err.message);
  }

  if (email2Candidates && email2Candidates.length > 0) {
    const result = await enqueue("email_2", email2Candidates as OutreachCandidate[]);
    email2Queued = result.queued;
    email2Failed = result.failed;
  }

  // ── Email 3 candidates: email_2_sent AND 14+ days since last outreach ──

  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const { data: email3Candidates, error: e3Err } = await supabase
    .from("listings")
    .select("id")
    .eq("source", "seeder_placed")
    .not("placed_by_seeder_id", "is", null)
    .eq("status", "active")
    .eq("outreach_status", "email_2_sent")
    .not("steward_email", "is", null)
    .lte("last_outreach_at", fourteenDaysAgo)
    .limit(50);

  if (e3Err) {
    console.error("[seeder-outreach] Email 3 query error:", e3Err.message);
  }

  if (email3Candidates && email3Candidates.length > 0) {
    const result = await enqueue("email_3", email3Candidates as OutreachCandidate[]);
    email3Queued = result.queued;
    email3Failed = result.failed;
  }

  const summary = {
    run_at: now.toISOString(),
    email_2_queued: email2Queued,
    email_2_failed: email2Failed,
    email_3_queued: email3Queued,
    email_3_failed: email3Failed,
  };

  console.log("[seeder-outreach] Summary:", JSON.stringify(summary));

  return new Response(JSON.stringify(summary), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const config: Config = {
  // Daily at 6am Pacific (13:00 UTC)
  schedule: "0 13 * * *",
};
