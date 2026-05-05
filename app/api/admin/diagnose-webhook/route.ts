// ────────────────────────────────────────────────────
// TEMPORARY DIAGNOSTIC — DELETE AFTER WEBHOOK DEBUGGING
// ────────────────────────────────────────────────────

/**
 * GET /api/admin/diagnose-webhook
 *
 * TEMPORARY diagnostic endpoint — delete after webhook secret diagnosis.
 * Reports metadata about RESEND_WEBHOOK_SECRET as the running server sees it,
 * without exposing the full secret.
 *
 * Gated by session cookie + admin email match.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSessionFromCookieValue } from "@/app/lib/seederAuth";

const ADMIN_SEEDER_EMAIL = process.env.ADMIN_SEEDER_EMAIL;

export async function GET() {
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

  // ── Diagnostic output ──
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({
      exists: false,
      byte_length: 0,
      first_4: null,
      last_4: null,
      has_whitespace: false,
      raw_length: 0,
      trimmed_length: 0,
    });
  }

  return NextResponse.json({
    exists: true,
    byte_length: Buffer.byteLength(secret, "utf-8"),
    first_4: secret.slice(0, 4),
    last_4: secret.slice(-4),
    has_whitespace: secret.length !== secret.trim().length,
    raw_length: secret.length,
    trimmed_length: secret.trim().length,
  });
}
