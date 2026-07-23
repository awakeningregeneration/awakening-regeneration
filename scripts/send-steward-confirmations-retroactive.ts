/**
 * One-time script: send the updated steward claim confirmation email
 * to the three already-active stewards who were confirmed before
 * this template was written.
 *
 * Safe to re-run — sets confirmation_email_sent_at on each steward
 * and checks it before sending, so duplicates are impossible.
 *
 * Usage:
 *   npx tsx scripts/send-steward-confirmations-retroactive.ts [--dry-run]
 *
 * Requires .env.local with RESEND_API_KEY, SUPABASE_URL, and
 * SUPABASE_SERVICE_ROLE_KEY.
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { stewardClaimConfirmationEmail } from "../app/lib/emails/stewardClaimConfirmation";

// Load env
const envFile = readFileSync(".env.local", "utf8");
const envVars: Record<string, string> = {};
for (const line of envFile.split("\n")) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].replace(/^["']|["']$/g, "");
}

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL || "",
  envVars.SUPABASE_SERVICE_ROLE_KEY || ""
);
const resend = new Resend(envVars.RESEND_API_KEY || "");
const FROM_EMAIL = "Ren at Canary Commons <founder@canarycommons.org>";

const dryRun = process.argv.includes("--dry-run");

async function run() {
  // Find active stewards who haven't received the confirmation email
  const { data: stewards, error } = await supabase
    .from("stewards")
    .select("id, email, display_name, listing_id, confirmation_email_sent_at")
    .eq("status", "active")
    .is("confirmation_email_sent_at", null);

  if (error) {
    console.error("Query failed:", error.message);
    return;
  }

  if (!stewards || stewards.length === 0) {
    console.log("No stewards need the retroactive confirmation email.");
    return;
  }

  console.log(`Found ${stewards.length} active steward(s) without confirmation email.\n`);

  for (const steward of stewards) {
    const { data: listing } = await supabase
      .from("listings")
      .select("title")
      .eq("id", steward.listing_id)
      .single();

    const listingTitle = listing?.title || "your listing";
    const greeting = steward.display_name || "there";

    console.log(`  ${greeting} — ${listingTitle}`);
    console.log(`    email: ${steward.email}`);

    if (dryRun) {
      console.log("    [DRY RUN — would send]\n");
      continue;
    }

    const emailContent = stewardClaimConfirmationEmail({
      stewardName: steward.display_name || "",
      listingTitle,
      listingId: steward.listing_id,
    });

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: steward.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      await supabase
        .from("stewards")
        .update({ confirmation_email_sent_at: new Date().toISOString() })
        .eq("id", steward.id);

      console.log("    ✓ Sent and marked\n");
    } catch (err) {
      console.error(`    ✗ Failed: ${err instanceof Error ? err.message : err}\n`);
    }
  }

  console.log("Done.");
}

run().catch((e) => console.error(e.message));
