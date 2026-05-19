/**
 * One-time backfill: send Email 1 to Ashland listings that were placed
 * before the seeder system was wired up.
 *
 * Sends Email 1 (seederOutreach1Email) to every listing in Ashland, OR
 * where:
 *   - source = 'seeder_placed'
 *   - outreach_status = 'not_started'
 *   - steward_email IS NOT NULL
 *
 * On successful send, updates:
 *   - outreach_status -> 'email_1_sent'
 *   - outreach_started_at -> NOW()
 *   - last_outreach_at -> NOW()
 *
 * The existing daily cron (netlify/functions/seeder-outreach.mts) will
 * pick up Email 2 and Email 3 from there automatically.
 *
 * Run with: npx tsx scripts/backfill-email1.ts
 */

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { seederOutreach1Email } from "../app/lib/emails/seederOutreach1Recognition";

const FROM_EMAIL = "Ren at Canary Commons <founder@canarycommons.org>";

// Load env from .env.local
import { config } from "dotenv";
config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !RESEND_API_KEY) {
  console.error("Missing required env vars. Check .env.local for:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL");
  console.error("  SUPABASE_SERVICE_ROLE_KEY");
  console.error("  RESEND_API_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(RESEND_API_KEY);

async function main() {
  console.log("\n=== Email 1 Backfill — Ashland, OR ===\n");

  const { data: listings, error } = await supabase
    .from("listings")
    .select("id, title, steward_email, removal_token")
    .ilike("city", "ashland")
    .ilike("state", "oregon")
    .eq("source", "seeder_placed")
    .eq("outreach_status", "not_started")
    .not("steward_email", "is", null);

  if (error) {
    console.error("Failed to fetch listings:", error);
    process.exit(1);
  }

  if (!listings || listings.length === 0) {
    console.log("No listings to process. Exiting.");
    return;
  }

  console.log(`Found ${listings.length} listings to email:\n`);
  for (const l of listings) {
    console.log(`  - ${l.title} -> ${l.steward_email}`);
  }
  console.log("\nWaiting 5 seconds before sending. Ctrl+C to abort.\n");
  await new Promise((r) => setTimeout(r, 5000));

  let sent = 0;
  let failed = 0;
  const failures: { title: string; error: string }[] = [];

  for (const listing of listings) {
    const { id, title, steward_email, removal_token } = listing;

    if (!steward_email || !removal_token) {
      console.warn(`SKIP ${title}: missing steward_email or removal_token`);
      failed++;
      failures.push({ title, error: "missing steward_email or removal_token" });
      continue;
    }

    try {
      const { subject, html, text } = seederOutreach1Email({
        businessName: title,
        listingId: id,
        removalToken: removal_token,
        seederName: "",
      });

      const { error: sendError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: steward_email,
        subject,
        html,
        text,
      });

      if (sendError) {
        console.error(`FAIL ${title}: ${sendError.message}`);
        failed++;
        failures.push({ title, error: sendError.message });
        continue;
      }

      const { error: updateError } = await supabase
        .from("listings")
        .update({
          outreach_status: "email_1_sent",
          outreach_started_at: new Date().toISOString(),
          last_outreach_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        console.error(`SENT but DB update failed for ${title}: ${updateError.message}`);
        failed++;
        failures.push({ title, error: `sent but DB update failed: ${updateError.message}` });
        continue;
      }

      console.log(`SENT ${title} -> ${steward_email}`);
      sent++;

      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`ERROR ${title}: ${message}`);
      failed++;
      failures.push({ title, error: message });
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Sent:   ${sent}`);
  console.log(`Failed: ${failed}`);
  if (failures.length > 0) {
    console.log("\nFailures:");
    for (const f of failures) {
      console.log(`  - ${f.title}: ${f.error}`);
    }
  }
  console.log("");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
