import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

/**
 * Hourly email-queue worker — drains email_queue (business outreach
 * only; transactional email is never queued and keeps sending
 * immediately elsewhere in the app).
 *
 * Checks Resend's live GET /usage before sending anything, reserves
 * 20 of the Free plan's 100 daily sends for transactional traffic, and
 * sends only a small batch per run so outreach is staggered across the
 * day rather than bursting the instant capacity resets. A row is
 * claimed (status: pending -> sending) with a conditional update before
 * it's sent, so two overlapping worker runs can never send the same
 * row twice. Failed sends retry on a later run (attempts++) up to a
 * cap, then become a terminal, visible 'failed' row.
 *
 * Mirrors the existing pattern in seeder-outreach.mts and
 * synonym-digest.mts: its own Supabase/Resend clients, relative
 * imports only (this build context doesn't resolve the "@/" tsconfig
 * alias the rest of the Next.js app uses).
 */

const supabase = createClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM_EMAIL = "Ren at Canary Commons <founder@canarycommons.org>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL!;

// Daily sends held back for magic links, receipts, and other immediate
// transactional mail that happens outside this worker's accounting.
const RESERVED_FOR_TRANSACTIONAL = 20;
// Kept small and well inside the 30s scheduled-function execution
// limit — this is also what staggers outreach across the day instead
// of draining a whole backlog the moment capacity resets.
const PER_RUN_BATCH_CAP = 15;
// After this many failed attempts, a row stops retrying and becomes a
// visible, terminal 'failed' row rather than retrying forever.
const MAX_ATTEMPTS = 5;
// Small pacing delay between sends, comfortably under Resend's
// documented 10 requests/second rate limit.
const SEND_PACING_MS = 150;

type QueueRow = {
  id: string;
  email_type: "email_1" | "email_2" | "email_3";
  listing_id: string;
  attempts: number;
};

type ResendUsage = {
  emails: {
    daily: { used: number; limit: number };
    monthly: { used: number; limit: number };
  };
};

async function fetchUsage(): Promise<ResendUsage | null> {
  try {
    const res = await fetch("https://api.resend.com/usage", {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });
    if (!res.ok) {
      console.error("[email-queue-worker] GET /usage failed:", res.status);
      return null;
    }
    return (await res.json()) as ResendUsage;
  } catch (err) {
    console.error("[email-queue-worker] GET /usage error:", err);
    return null;
  }
}

/**
 * The Resend SDK does not throw on a rejected send — it returns
 * { data, error } the same way supabase-js does. Without checking
 * `error` explicitly, a rejected send (invalid recipient, etc.) would
 * silently look identical to a success and the queue row would be
 * marked 'sent' despite nothing actually going out. Confirmed live
 * during testing: a send to an @example.com address returned a 422
 * validation_error in `error`, not a thrown exception.
 */
async function sendViaResend(params: Parameters<typeof resend.emails.send>[0]): Promise<void> {
  const { error } = await resend.emails.send(params);
  if (error) {
    throw new Error(`Resend rejected the send: ${error.message}`);
  }
}

/** Builds and sends one queued email, then advances listings state on success. Throws on failure — caller handles retry/fail bookkeeping. */
async function sendQueuedEmail(row: QueueRow): Promise<void> {
  const { data: listing, error } = await supabase
    .from("listings")
    .select("id, title, steward_email, no_public_email, removal_token, placed_by_seeder_id")
    .eq("id", row.listing_id)
    .single();

  if (error || !listing) {
    throw new Error(`Listing not found: ${row.listing_id}`);
  }
  if (!listing.steward_email || listing.no_public_email) {
    throw new Error("Listing no longer eligible (no steward email, or opted out of public email)");
  }

  const now = new Date().toISOString();

  if (row.email_type === "email_1") {
    const { data: seeder } = await supabase
      .from("seeders")
      .select("name")
      .eq("id", listing.placed_by_seeder_id)
      .single();

    const { seederOutreach1Email } = await import(
      "../../app/lib/emails/seederOutreach1Recognition.js"
    );
    const content = seederOutreach1Email({
      businessName: listing.title,
      listingId: listing.id,
      removalToken: listing.removal_token,
      seederName: seeder?.name || "A seeder",
    });

    await sendViaResend({
      from: FROM_EMAIL,
      to: listing.steward_email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });

    await supabase
      .from("listings")
      .update({ outreach_status: "email_1_sent", outreach_started_at: now, last_outreach_at: now })
      .eq("id", listing.id);
  } else if (row.email_type === "email_2") {
    const { seederOutreach2Email } = await import(
      "../../app/lib/emails/seederOutreach2Visibility.js"
    );
    const content = seederOutreach2Email({
      businessName: listing.title,
      listingId: listing.id,
      removalToken: listing.removal_token,
    });

    await sendViaResend({
      from: FROM_EMAIL,
      to: listing.steward_email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });

    await supabase
      .from("listings")
      .update({ outreach_status: "email_2_sent", last_outreach_at: now })
      .eq("id", listing.id);
  } else {
    const { seederOutreach3Email } = await import(
      "../../app/lib/emails/seederOutreach3Stewardship.js"
    );
    const content = seederOutreach3Email({
      businessName: listing.title,
      listingId: listing.id,
      removalToken: listing.removal_token,
    });

    await sendViaResend({
      from: FROM_EMAIL,
      to: listing.steward_email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });

    await supabase
      .from("listings")
      .update({ outreach_status: "email_3_sent", last_outreach_at: now })
      .eq("id", listing.id);
  }
}

// Returns whether the alert actually went out — callers must only debounce
// (recordAlert) on true, otherwise a missing ADMIN_EMAIL or a failed send
// would silently suppress a real alert for the rest of its debounce window.
async function sendAdminAlert(subject: string, body: string): Promise<boolean> {
  if (!ADMIN_EMAIL) return false;
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html: `<p>${body}</p>`,
      text: body,
    });
    if (error) {
      console.error("[email-queue-worker] Resend rejected admin alert:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email-queue-worker] Failed to send admin alert:", err);
    return false;
  }
}

/** True if this alert type hasn't fired within debounceMs — keeps alerts infrequent. */
async function shouldAlert(alertType: string, debounceMs: number): Promise<boolean> {
  const { data } = await supabase
    .from("email_queue_alerts")
    .select("last_sent_at")
    .eq("alert_type", alertType)
    .maybeSingle();
  if (!data) return true;
  return Date.now() - new Date(data.last_sent_at).getTime() > debounceMs;
}

async function recordAlert(alertType: string): Promise<void> {
  await supabase
    .from("email_queue_alerts")
    .upsert({ alert_type: alertType, last_sent_at: new Date().toISOString() });
}

async function maybeAlertCapacityExhausted(
  deferred: boolean,
  dailyUsed: number,
  dailyLimit: number,
  monthlyUsed: number,
  monthlyLimit: number
): Promise<void> {
  if (!deferred) return;
  const ALERT_TYPE = "capacity_exhausted";
  if (!(await shouldAlert(ALERT_TYPE, 24 * 60 * 60 * 1000))) return;

  const sent = await sendAdminAlert(
    "Canary outreach queue: capacity reached for now",
    `Background outreach sends were deferred this hour because Resend capacity is tight ` +
      `(daily ${dailyUsed}/${dailyLimit}, monthly ${monthlyUsed}/${monthlyLimit}, 20 reserved daily for ` +
      `transactional email). Queued emails will resume automatically once capacity resets — no action ` +
      `needed unless this keeps happening.`
  );
  if (sent) await recordAlert(ALERT_TYPE);
}

async function maybeAlertPersistentFailures(): Promise<void> {
  const { count } = await supabase
    .from("email_queue")
    .select("id", { count: "exact", head: true })
    .eq("status", "failed");
  if (!count || count === 0) return;

  const ALERT_TYPE = "persistent_failures";
  if (!(await shouldAlert(ALERT_TYPE, 24 * 60 * 60 * 1000))) return;

  const sent = await sendAdminAlert(
    "Canary outreach queue: some emails need attention",
    `${count} queued outreach email(s) failed after ${MAX_ATTEMPTS} attempts and will not retry ` +
      `automatically. Check the email_queue table (status = 'failed') when you have a moment.`
  );
  if (sent) await recordAlert(ALERT_TYPE);
}

/**
 * Distinguishes a one-time batch the queue is absorbing normally from
 * genuine structural capacity pressure. A large intentional batch is
 * expected to take several hourly runs (even a day or more) to clear —
 * that alone is NOT a signal. These three conditions each require
 * evidence of a backlog that isn't actually clearing over time:
 *
 *  A) a chunk of the backlog has waited past the full 48h band in a
 *     volume that two full days of the 80/day outreach budget (160)
 *     couldn't have cleared — not just "something is a bit old."
 *  B) new demand over the last 48h is arriving at or above the rate
 *     things are actually being sent in the same window.
 *  C) monthly Resend usage is nearly exhausted (>=90%) while real
 *     demand is still sitting in the queue.
 */
async function maybeAlertSustainedPressure(monthlyUsed: number, monthlyLimit: number): Promise<void> {
  const ALERT_TYPE = "sustained_pressure";
  if (!(await shouldAlert(ALERT_TYPE, 72 * 60 * 60 * 1000))) return;

  const nowMs = Date.now();
  const h48 = new Date(nowMs - 48 * 60 * 60 * 1000).toISOString();

  const { count: overdueCount } = await supabase
    .from("email_queue")
    .select("id", { count: "exact", head: true })
    .in("status", ["pending", "sending"])
    .lte("created_at", h48);

  const { count: arrivals48 } = await supabase
    .from("email_queue")
    .select("id", { count: "exact", head: true })
    .gte("created_at", h48);

  const { count: sent48 } = await supabase
    .from("email_queue")
    .select("id", { count: "exact", head: true })
    .eq("status", "sent")
    .gte("sent_at", h48);

  const { count: pendingNow } = await supabase
    .from("email_queue")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const signalA = (overdueCount ?? 0) > 160;
  const signalB = (arrivals48 ?? 0) >= 40 && (arrivals48 ?? 0) >= (sent48 ?? 0);
  const signalC = monthlyLimit > 0 && monthlyUsed / monthlyLimit >= 0.9 && (pendingNow ?? 0) > 10;

  if (!signalA && !signalB && !signalC) return;

  const reasons: string[] = [];
  if (signalA) reasons.push(`${overdueCount} outreach email(s) have been waiting over 48 hours`);
  if (signalB) reasons.push(`new demand (${arrivals48}/48h) is arriving as fast as or faster than it's being sent (${sent48}/48h)`);
  if (signalC) reasons.push(`monthly Resend usage is at ${monthlyUsed}/${monthlyLimit} with ${pendingNow} still queued`);

  const sent = await sendAdminAlert(
    "Canary outreach: Resend Free plan may be becoming insufficient",
    `Sustained signs the 100/day · 3,000/month Free allowance may no longer be enough: ${reasons.join("; ")}. ` +
      `This is different from one large batch working through the queue normally — worth considering ` +
      `Resend Pro ($20/mo) if this continues.`
  );
  if (sent) await recordAlert(ALERT_TYPE);
}

export default async function handler() {
  const usage = await fetchUsage();
  if (!usage) {
    return new Response(JSON.stringify({ error: "Could not fetch Resend usage" }), { status: 502 });
  }

  const { daily, monthly } = usage.emails;
  const dailyOutreachBudget = Math.max(0, daily.limit - daily.used - RESERVED_FOR_TRANSACTIONAL);
  const monthlyBudget = Math.max(0, monthly.limit - monthly.used);
  const sendableThisRun = Math.max(0, Math.min(dailyOutreachBudget, monthlyBudget, PER_RUN_BATCH_CAP));

  const { count: pendingCount } = await supabase
    .from("email_queue")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  let sentCount = 0;
  let failedCount = 0;
  let deferred = false;

  if (sendableThisRun > 0 && (pendingCount ?? 0) > 0) {
    const { data: candidates } = await supabase
      .from("email_queue")
      .select("id")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(sendableThisRun);

    const ids = (candidates ?? []).map((c) => c.id);

    if (ids.length > 0) {
      // Atomic claim: only rows still 'pending' at the moment of this
      // UPDATE actually flip to 'sending' and come back in `claimed` —
      // a concurrent run racing on the same ids would claim none of
      // them here, so a row can never be sent twice.
      const { data: claimed } = await supabase
        .from("email_queue")
        .update({ status: "sending", claimed_at: new Date().toISOString() })
        .in("id", ids)
        .eq("status", "pending")
        .select("id, email_type, listing_id, attempts");

      for (const row of (claimed ?? []) as QueueRow[]) {
        try {
          await sendQueuedEmail(row);
          await supabase
            .from("email_queue")
            .update({ status: "sent", sent_at: new Date().toISOString() })
            .eq("id", row.id);
          sentCount++;
        } catch (err) {
          const attempts = row.attempts + 1;
          const terminal = attempts >= MAX_ATTEMPTS;
          await supabase
            .from("email_queue")
            .update({
              status: terminal ? "failed" : "pending",
              attempts,
              last_error: String(err instanceof Error ? err.message : err).slice(0, 500),
            })
            .eq("id", row.id);
          if (terminal) failedCount++;
          console.error(`[email-queue-worker] Send failed for ${row.email_type}/${row.listing_id}:`, err);
        }
        await new Promise((r) => setTimeout(r, SEND_PACING_MS));
      }
    }
  } else if ((pendingCount ?? 0) > 0 && sendableThisRun === 0) {
    deferred = true;
  }

  await maybeAlertCapacityExhausted(deferred, daily.used, daily.limit, monthly.used, monthly.limit);
  await maybeAlertPersistentFailures();
  await maybeAlertSustainedPressure(monthly.used, monthly.limit);

  const summary = {
    run_at: new Date().toISOString(),
    sent: sentCount,
    newly_failed: failedCount,
    deferred,
    pending_before_run: pendingCount ?? 0,
  };
  console.log("[email-queue-worker] Summary:", JSON.stringify(summary));

  return new Response(JSON.stringify(summary), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const config: Config = {
  schedule: "@hourly",
};
