/**
 * POST /api/webhooks/resend
 *
 * Receives Resend webhook events (email.bounced, email.complained).
 * Matches bounced/complained emails back to the seeder-placed listing
 * and updates outreach_status = 'bounced' + populates bounce_info.
 *
 * Signature verified via svix (Resend's recommended library).
 *
 * All other event types (delivered, opened, clicked) are acknowledged
 * with 200 but not acted on.
 */

import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

export async function POST(req: Request) {
  // ── Verify webhook signature ──
  if (!RESEND_WEBHOOK_SECRET) {
    console.error("[resend-webhook] RESEND_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await req.text();
  const headers = {
    "webhook-id": req.headers.get("svix-id") || req.headers.get("webhook-id") || "",
    "webhook-timestamp": req.headers.get("svix-timestamp") || req.headers.get("webhook-timestamp") || "",
    "webhook-signature": req.headers.get("svix-signature") || req.headers.get("webhook-signature") || "",
  };

  let event: { type: string; data: Record<string, unknown> };
  try {
    const wh = new Webhook(RESEND_WEBHOOK_SECRET);
    event = wh.verify(body, headers) as typeof event;
  } catch (err) {
    // TEMPORARY DIAGNOSTIC LOGGING — remove after webhook signature bug is resolved
    const errObj = err as { name?: string; message?: string };
    console.error("[resend-webhook] Signature verification failed:", {
      error_name: errObj.name || "unknown",
      error_message: errObj.message || String(err),
      webhook_id: headers["webhook-id"],
      webhook_timestamp: headers["webhook-timestamp"],
      server_time: new Date().toISOString(),
      body_preview: body.slice(0, 100),
      body_length: body.length,
      secret_length: RESEND_WEBHOOK_SECRET?.length ?? 0,
    });
    // END TEMPORARY DIAGNOSTIC LOGGING
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // ── Route by event type ──
  const eventType = event.type;

  if (eventType === "email.bounced" || eventType === "email.complained") {
    const data = event.data;
    const toArray = data.to as string[] | undefined;
    const recipient = toArray?.[0];

    if (!recipient) {
      console.warn("[resend-webhook] No recipient in event:", eventType);
      return NextResponse.json({ received: true });
    }

    // Build bounce info from the event payload
    const bounceData = data.bounce as { message?: string } | undefined;
    const bounceMessage = bounceData?.message || eventType;
    const bounceInfo = `${eventType}: ${bounceMessage}`;

    // Find the matching listing — most recent seeder-placed listing
    // in active outreach to this recipient
    const { data: listing } = await supabaseAdmin
      .from("listings")
      .select("id, outreach_status")
      .eq("steward_email", recipient)
      .eq("source", "seeder_placed")
      .in("outreach_status", ["email_1_sent", "email_2_sent", "email_3_sent"])
      .order("last_outreach_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!listing) {
      console.log(
        `[resend-webhook] No matching listing for bounced email: ${recipient}`
      );
      return NextResponse.json({ received: true });
    }

    // Update listing: mark as bounced with info
    await supabaseAdmin
      .from("listings")
      .update({
        outreach_status: "bounced",
        bounce_info: bounceInfo,
      })
      .eq("id", listing.id);

    console.log(
      `[resend-webhook] Listing ${listing.id} marked as bounced (was ${listing.outreach_status}): ${bounceInfo}`
    );

    return NextResponse.json({ received: true, listing_id: listing.id });
  }

  // All other events: acknowledge without action
  console.log(`[resend-webhook] Event received (no action): ${eventType}`);
  return NextResponse.json({ received: true });
}
