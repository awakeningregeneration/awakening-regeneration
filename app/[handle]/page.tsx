import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSessionFromCookieValue } from "@/app/lib/seederAuth";
import DashboardClient from "./DashboardClient";

/**
 * Seeder dashboard at /[handle].
 * Auth required — redirects to /[handle]/login if no valid session.
 * Orientation required — redirects to /[handle]/start if not completed.
 */

export default async function SeederDashboardPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  // ── Auth gate (verbatim from Phase 1) ──
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cc_seeder_session")?.value;
  const session = getSeederSessionFromCookieValue(sessionCookie);

  if (!session) {
    redirect(`/${handle}/login`);
  }

  if (session.handle !== handle) {
    redirect(`/${session.handle}`);
  }

  // ── Seeder details ──
  const { data: seeder } = await supabaseAdmin
    .from("seeders")
    .select("name, orientation_completed_at, url_handle, referral_code")
    .eq("id", session.seeder_id)
    .single();

  if (!seeder) {
    redirect(`/${handle}/login`);
  }

  // ── Orientation gate (verbatim from Stage B) ──
  if (!seeder.orientation_completed_at) {
    redirect(`/${handle}/start`);
  }

  // ── Placements ──
  // Note: Stage G will add do_not_list_level to this SELECT
  // for soft opt-out badge logic. See OPT_OUT_LAYERS.md.
  const { data: placements } = await supabaseAdmin
    .from("listings")
    .select(
      "id, title, city, state, outreach_status, steward_email, steward_id, created_at, status, bounce_info, last_outreach_at, no_public_email"
    )
    .eq("placed_by_seeder_id", session.seeder_id)
    .order("created_at", { ascending: false });

  // ── Credits ──
  const { data: credits } = await supabaseAdmin
    .from("seeder_listing_credits")
    .select("id, listing_id, amount_cents, payout_status, created_at")
    .eq("seeder_id", session.seeder_id);

  return (
    <DashboardClient
      handle={handle}
      seederName={seeder.name || "Seeder"}
      referralCode={seeder.referral_code || null}
      placements={placements || []}
      credits={credits || []}
    />
  );
}
