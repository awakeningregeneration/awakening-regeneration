/**
 * POST /api/admin/wrapper/welcome
 *
 * Session-authed wrapper for resending the welcome email.
 * Called by AdminClient.tsx. Delegates to sendWelcome() after
 * verifying the caller is the admin seeder.
 *
 * Three-gate auth: session cookie → seeder lookup → admin email match.
 * Returns 404 on any auth failure (admin endpoint privacy).
 *
 * Body: { seeder_id: string, force?: boolean }
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSessionFromCookieValue } from "@/app/lib/seederAuth";
import { sendWelcome } from "@/app/lib/adminSeederActions";

const ADMIN_SEEDER_EMAIL = process.env.ADMIN_SEEDER_EMAIL;

export async function POST(req: Request) {
  // ── Gate 1: session cookie ──
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cc_seeder_session")?.value;
  const session = getSeederSessionFromCookieValue(sessionCookie);

  if (!session) notFound();

  // ── Gate 2: fetch seeder email ──
  const { data: seeder } = await supabaseAdmin
    .from("seeders")
    .select("email")
    .eq("id", session.seeder_id)
    .single();

  if (!seeder) notFound();

  // ── Gate 3: admin email match ──
  if (!ADMIN_SEEDER_EMAIL || seeder.email !== ADMIN_SEEDER_EMAIL) notFound();

  // ── Parse body and delegate ──
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { seeder_id, force } = body;

  const result = await sendWelcome({ seeder_id, force: force === true });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
