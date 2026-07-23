import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSessionFromCookieValue } from "@/app/lib/seederAuth";
import MapViewClient from "./MapViewClient";

/**
 * Cross-seeder map view at /[handle]/map-view.
 * Auth required — redirects to /[handle]/login if no valid session.
 * Orientation required — redirects to /[handle]/start if not completed.
 *
 * Shows all seeder-placed listings across the commons, grouped by
 * state and county. Coordination tool — seeder names visible,
 * steward emails never exposed.
 */

export default async function MapViewPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  // ── Auth gate (verbatim from /[handle]/page.tsx) ──
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
    .select("name, orientation_completed_at")
    .eq("id", session.seeder_id)
    .single();

  if (!seeder) {
    redirect(`/${handle}/login`);
  }

  // ── Orientation gate (verbatim from /[handle]/page.tsx) ──
  if (!seeder.orientation_completed_at) {
    redirect(`/${handle}/start`);
  }

  // ── All listings (display-safe fields only) ──
  // Privacy boundary: steward_email and bounce_info are never
  // exposed on the cross-seeder view. Only the placing seeder
  // sees those on their personal dashboard.
  const { data: allPlacements } = await supabaseAdmin
    .from("listings")
    .select(
      "id, title, category, city, state, county, address, created_at, outreach_status, status, placed_by_seeder_id, source"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const placements = allPlacements || [];

  // ── Seeder names (all seeders — small table at current scale) ──
  // Note: if seeders table grows past ~50 rows, switch to .in()
  // with unique placed_by_seeder_id values from placements.
  const { data: allSeeders } = await supabaseAdmin
    .from("seeders")
    .select("id, name");

  const seederMap: Record<string, string> = {};
  for (const s of allSeeders || []) {
    seederMap[s.id] = s.name || "Seeder";
  }

  // ── Derive state/county options from actual placements ──
  const stateSet = new Set<string>();
  const countiesByState: Record<string, Set<string>> = {};

  for (const p of placements) {
    if (p.state) {
      stateSet.add(p.state);
      if (p.county) {
        if (!countiesByState[p.state]) countiesByState[p.state] = new Set();
        countiesByState[p.state].add(p.county);
      }
    }
  }

  const states = [...stateSet].sort();
  const countiesByStateSorted: Record<string, string[]> = {};
  for (const [st, counties] of Object.entries(countiesByState)) {
    countiesByStateSorted[st] = [...counties].sort();
  }

  return (
    <MapViewClient
      handle={handle}
      placements={placements}
      seederMap={seederMap}
      states={states}
      countiesByState={countiesByStateSorted}
    />
  );
}
