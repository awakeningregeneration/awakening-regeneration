import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSessionFromCookieValue } from "@/app/lib/seederAuth";
import PlacePageClient from "./PlacePageClient";

/**
 * Seeder placement form at /[handle]/place.
 * Auth required. Orientation required.
 */

export default async function PlacePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  // Auth check
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cc_seeder_session")?.value;
  const session = getSeederSessionFromCookieValue(sessionCookie);

  if (!session) {
    redirect(`/${handle}/login`);
  }

  if (session.handle !== handle) {
    redirect(`/${session.handle}/place`);
  }

  // Look up seeder
  const { data: seeder } = await supabaseAdmin
    .from("seeders")
    .select("name, orientation_completed_at")
    .eq("id", session.seeder_id)
    .single();

  if (!seeder) {
    redirect(`/${handle}/login`);
  }

  // Orientation gate
  if (!seeder.orientation_completed_at) {
    redirect(`/${handle}/start`);
  }

  return (
    <PlacePageClient
      handle={handle}
      seederName={seeder.name || "Seeder"}
    />
  );
}
