import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

/**
 * Daily seeder outreach cadence — runs at 6am Pacific (13:00 UTC).
 *
 * Queries for listings due for Email 2 (7 days after Email 1) and
 * Email 3 (14 days after Email 2). Sends via Resend, updates
 * outreach_status and last_outreach_at on success.
 *
 * Each query is capped at 50 results to throttle burst sends after
 * a cron outage. The system catches up across multiple daily runs
 * rather than sending a large backlog in one burst.
 *
 * Mirrors the pattern from netlify/functions/synonym-digest.mts:
 * creates its own Supabase and Resend clients (Netlify Functions
 * run in a different context than Next.js).
 */

const supabase = createClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM_EMAIL = "Ren at Canary Commons <founder@canarycommons.org>";

type OutreachCandidate = {
  id: string;
  title: string;
  steward_email: string;
  removal_token: string;
  placed_by_seeder_id: string;
};

export default async function handler() {
  const now = new Date();
  console.log(`[seeder-outreach] Running at ${now.toISOString()}`);

  let email2Sent = 0;
  let email2Failed = 0;
  let email3Sent = 0;
  let email3Failed = 0;

  // ── Email 2 candidates: email_1_sent AND 28+ days since outreach started ──
  // Email 2 fires 28 days after Email 1 (was 7)

  const twentyEightDaysAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString();

  const { data: email2Candidates, error: e2Err } = await supabase
    .from("listings")
    .select("id, title, steward_email, removal_token, placed_by_seeder_id")
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
    const { seederOutreach2Email } = await import(
      "../../app/lib/emails/seederOutreach2Visibility.js"
    );

    for (const listing of email2Candidates as OutreachCandidate[]) {
      try {
        const emailContent = seederOutreach2Email({
          businessName: listing.title,
          listingId: listing.id,
          removalToken: listing.removal_token,
        });

        await resend.emails.send({
          from: FROM_EMAIL,
          to: listing.steward_email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });

        await supabase
          .from("listings")
          .update({
            outreach_status: "email_2_sent",
            last_outreach_at: now.toISOString(),
          })
          .eq("id", listing.id);

        email2Sent++;
        console.log(`[seeder-outreach] Email 2 sent: ${listing.title} (${listing.steward_email})`);
      } catch (err) {
        email2Failed++;
        console.error(`[seeder-outreach] Email 2 failed for ${listing.title}:`, err);
      }
    }
  }

  // ── Email 3 candidates: email_2_sent AND 14+ days since last outreach ──

  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const { data: email3Candidates, error: e3Err } = await supabase
    .from("listings")
    .select("id, title, steward_email, removal_token, placed_by_seeder_id")
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
    const { seederOutreach3Email } = await import(
      "../../app/lib/emails/seederOutreach3Stewardship.js"
    );

    for (const listing of email3Candidates as OutreachCandidate[]) {
      try {
        const emailContent = seederOutreach3Email({
          businessName: listing.title,
          listingId: listing.id,
          removalToken: listing.removal_token,
        });

        await resend.emails.send({
          from: FROM_EMAIL,
          to: listing.steward_email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });

        await supabase
          .from("listings")
          .update({
            outreach_status: "email_3_sent",
            last_outreach_at: now.toISOString(),
          })
          .eq("id", listing.id);

        email3Sent++;
        console.log(`[seeder-outreach] Email 3 sent: ${listing.title} (${listing.steward_email})`);
      } catch (err) {
        email3Failed++;
        console.error(`[seeder-outreach] Email 3 failed for ${listing.title}:`, err);
      }
    }
  }

  const summary = {
    run_at: now.toISOString(),
    email_2_sent: email2Sent,
    email_2_failed: email2Failed,
    email_3_sent: email3Sent,
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
