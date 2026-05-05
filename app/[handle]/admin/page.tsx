import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSessionFromCookieValue } from "@/app/lib/seederAuth";
import AdminClient from "./AdminClient";

/**
 * Admin page at /[handle]/admin.
 * Three-gate auth: session → handle match → admin email match.
 * Returns 404 on any failure — admin page does not reveal its existence.
 *
 * Fetches all seeders and placement counts for the admin list view.
 */

const ADMIN_SEEDER_EMAIL = process.env.ADMIN_SEEDER_EMAIL;

export default async function AdminPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  // ── Gate 1: session cookie ──
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cc_seeder_session")?.value;
  const session = getSeederSessionFromCookieValue(sessionCookie);

  if (!session) notFound();

  // ── Gate 2: handle match ──
  if (session.handle !== handle) notFound();

  // ── Gate 3: admin email match ──
  const { data: adminSeeder } = await supabaseAdmin
    .from("seeders")
    .select("email")
    .eq("id", session.seeder_id)
    .single();

  if (!adminSeeder) notFound();
  if (!ADMIN_SEEDER_EMAIL || adminSeeder.email !== ADMIN_SEEDER_EMAIL)
    notFound();

  // ── Fetch all seeders ──
  const { data: allSeeders } = await supabaseAdmin
    .from("seeders")
    .select(
      "id, name, email, url_handle, referral_code, active, created_at, welcomed_at, orientation_completed_at"
    )
    .order("created_at", { ascending: false });

  const seeders = allSeeders || [];

  // ── Fetch placement counts per seeder ──
  const { data: placementRows } = await supabaseAdmin
    .from("listings")
    .select("placed_by_seeder_id")
    .eq("source", "seeder_placed")
    .not("placed_by_seeder_id", "is", null);

  const placementCounts: Record<string, number> = {};
  for (const row of placementRows || []) {
    const id = row.placed_by_seeder_id as string;
    placementCounts[id] = (placementCounts[id] || 0) + 1;
  }

  return (
    <AdminClient
      handle={handle}
      seeders={seeders}
      placementCounts={placementCounts}
    />
  );
}
