/**
 * Grace-period auto-promotion for stewards.
 *
 * When a steward is in 'verified_waiting_grace' and the 48-hour
 * grace period has passed, this function promotes them to 'active'
 * and links them to the listing.
 *
 * Called inline at listing access points (edit page mount, session
 * checks, etc.) — no cron needed. Promotion happens the moment
 * someone next touches the listing after the grace window closes.
 *
 * NEVER throws — swallows errors and logs them. The calling flow
 * must continue regardless of whether promotion succeeds.
 */

import { supabaseAdmin } from "./supabaseAdmin";

export async function promoteIfGraceExpired(
  listingId: string
): Promise<void> {
  try {
    // Find stewards in waiting_grace for this listing
    const { data: waitingStewards } = await supabaseAdmin
      .from("stewards")
      .select("id, email, declared_at")
      .eq("listing_id", listingId)
      .eq("status", "verified_waiting_grace")
      .order("declared_at", { ascending: true });

    if (!waitingStewards || waitingStewards.length === 0) return;

    // For each, check if grace period has passed
    for (const steward of waitingStewards) {
      const { data: claim } = await supabaseAdmin
        .from("stewardship_claims")
        .select("grace_period_ends_at")
        .eq("steward_id", steward.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (
        !claim?.grace_period_ends_at ||
        new Date(claim.grace_period_ends_at).getTime() > Date.now()
      ) {
        continue; // grace period hasn't passed yet
      }

      // Promote this steward — only take the first eligible one
      const now = new Date().toISOString();

      await supabaseAdmin
        .from("stewards")
        .update({ status: "active", activated_at: now })
        .eq("id", steward.id);

      // Link to listing only if no steward is currently set
      await supabaseAdmin
        .from("listings")
        .update({
          steward_id: steward.id,
          steward_email: steward.email,
        })
        .eq("id", listingId)
        .is("steward_id", null);

      console.log(
        `Steward auto-promoted: ${steward.email} → listing ${listingId}`
      );

      // Only promote one steward per listing (the earliest by declared_at)
      break;
    }
  } catch (err) {
    console.error("Stewardship promotion check failed:", err);
    // Swallow — never block the caller
  }
}
