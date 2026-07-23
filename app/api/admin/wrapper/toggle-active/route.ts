/**
 * POST /api/admin/wrapper/toggle-active
 *
 * Toggles a seeder's `active` boolean. Used by the admin dashboard
 * to hide/unhide seeders from the main list view.
 *
 * Three-gate auth: session cookie → seeder lookup → admin email match.
 * Returns 404 on any auth failure.
 *
 * Body: { seeder_id: string, active: boolean }
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSessionFromCookieValue } from "@/app/lib/seederAuth";

const ADMIN_SEEDER_EMAIL = process.env.ADMIN_SEEDER_EMAIL;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cc_seeder_session")?.value;
  const session = getSeederSessionFromCookieValue(sessionCookie);

  if (!session) notFound();

  const { data: seeder } = await supabaseAdmin
    .from("seeders")
    .select("email")
    .eq("id", session.seeder_id)
    .single();

  if (!seeder) notFound();
  if (!ADMIN_SEEDER_EMAIL || seeder.email !== ADMIN_SEEDER_EMAIL) notFound();

  const body = await req.json();
  const { seeder_id, active } = body;

  if (!seeder_id || typeof active !== "boolean") {
    return NextResponse.json(
      { error: "seeder_id and active (boolean) required." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("seeders")
    .update({ active })
    .eq("id", seeder_id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
