import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { isTokenExpired } from "@/app/lib/stewardshipTokens";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/steward/verify/failed?reason=missing_token", request.url)
    );
  }

  try {
    // ── 1. Look up the claim by token ──────────────────────
    const { data: claim, error: claimError } = await supabaseAdmin
      .from("stewardship_claims")
      .select("*")
      .eq("verification_token", token)
      .maybeSingle();

    if (claimError || !claim) {
      return NextResponse.redirect(
        new URL("/steward/verify/failed?reason=invalid_token", request.url)
      );
    }

    // ── 2. Check expiry ────────────────────────────────────
    if (isTokenExpired(claim.token_expires_at)) {
      return NextResponse.redirect(
        new URL("/steward/verify/failed?reason=expired", request.url)
      );
    }

    // ── 3. Load the steward ────────────────────────────────
    const { data: steward, error: stewardError } = await supabaseAdmin
      .from("stewards")
      .select("*")
      .eq("id", claim.steward_id)
      .single();

    if (stewardError || !steward) {
      return NextResponse.redirect(
        new URL("/steward/verify/failed?reason=invalid_token", request.url)
      );
    }

    // Already active or revoked — don't reprocess
    if (steward.status === "active" || steward.status === "revoked") {
      return NextResponse.redirect(
        new URL(
          "/steward/verify/failed?reason=already_processed",
          request.url
        )
      );
    }

    // ── 4. Determine next state based on verification path ─
    const now = new Date().toISOString();

    if (steward.verification_path === "domain_match") {
      // Immediate activation
      await supabaseAdmin
        .from("stewards")
        .update({
          status: "active",
          verified_at: now,
          activated_at: now,
        })
        .eq("id", steward.id);

      // Link the steward to the listing
      await supabaseAdmin
        .from("listings")
        .update({
          steward_id: steward.id,
          steward_email: steward.email,
        })
        .eq("id", steward.listing_id);
    } else {
      // Declaration path — verified but waiting grace period
      const gracePeriodEnd = new Date(
        Date.now() + 48 * 60 * 60 * 1000
      ).toISOString();

      await supabaseAdmin
        .from("stewards")
        .update({
          status: "verified_waiting_grace",
          verified_at: now,
        })
        .eq("id", steward.id);

      await supabaseAdmin
        .from("stewardship_claims")
        .update({
          grace_period_ends_at: gracePeriodEnd,
        })
        .eq("id", claim.id);

      // Do NOT set listings.steward_id yet — that happens
      // when the grace period ends (Step 6 cron/scheduled fn)
    }

    // ── 5. Redirect to success page ────────────────────────
    return NextResponse.redirect(
      new URL(
        `/steward/verify/success?listing_id=${steward.listing_id}`,
        request.url
      )
    );
  } catch (err) {
    console.error("Steward verification error:", err);
    return NextResponse.redirect(
      new URL("/steward/verify/failed?reason=error", request.url)
    );
  }
}
