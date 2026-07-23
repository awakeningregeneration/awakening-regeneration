import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSessionFromCookieValue } from "@/app/lib/seederAuth";
import BulkPlacePageClient from "./BulkPlacePageClient";

/**
 * Bulk seeder placement at /[handle]/place/bulk.
 * Same auth + orientation gate as /[handle]/place.
 */

export default async function BulkPlacePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cc_seeder_session")?.value;
  const session = getSeederSessionFromCookieValue(sessionCookie);

  if (!session) redirect(`/${handle}/login`);
  if (session.handle !== handle) redirect(`/${session.handle}/place/bulk`);

  const { data: seeder } = await supabaseAdmin
    .from("seeders")
    .select("name, orientation_completed_at")
    .eq("id", session.seeder_id)
    .single();

  if (!seeder) redirect(`/${handle}/login`);
  if (!seeder.orientation_completed_at) redirect(`/${handle}/start`);

  return <BulkPlacePageClient handle={handle} seederName={seeder.name || ""} />;
}
