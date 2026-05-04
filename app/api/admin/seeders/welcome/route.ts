/**
 * POST /api/admin/seeders/welcome
 *
 * Manual admin endpoint — Ren fires this to send the welcome email
 * to a seeder during the hand-onboarding phase.
 *
 * Auth: Authorization: Bearer ${ADMIN_SECRET}
 * Body: { seeder_id: string }
 *
 * Returns 409 Conflict if the seeder has already been welcomed
 * (welcomed_at is set). To re-send, clear welcomed_at in Supabase
 * Studio first.
 */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { resend, FROM_EMAIL } from "@/app/lib/resend";
import { seederWelcomeEmail } from "@/app/lib/emails/seederWelcome";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(req: Request) {
  // ── Auth gate ──
  const authHeader = req.headers.get("authorization");
  if (!ADMIN_SECRET || !authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse body ──
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { seeder_id } = body;
  if (!seeder_id || typeof seeder_id !== "string") {
    return NextResponse.json({ error: "seeder_id is required." }, { status: 400 });
  }

  // ── Look up seeder ──
  const { data: seeder, error: lookupError } = await supabaseAdmin
    .from("seeders")
    .select("id, name, email, url_handle, welcomed_at")
    .eq("id", seeder_id)
    .single();

  if (lookupError || !seeder) {
    return NextResponse.json(
      { error: `Seeder not found: ${seeder_id}` },
      { status: 404 }
    );
  }

  // ── Duplicate check ──
  if (seeder.welcomed_at) {
    return NextResponse.json(
      {
        error: `This seeder has already received the welcome email at ${seeder.welcomed_at}. Clear welcomed_at in the database to re-send.`,
      },
      { status: 409 }
    );
  }

  // ── Generate and send email ──
  const emailContent = seederWelcomeEmail({
    name: seeder.name || "Seeder",
    handle: seeder.url_handle,
  });

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: seeder.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });
  } catch (emailErr) {
    console.error("Seeder welcome email failed to send:", emailErr);
    return NextResponse.json(
      { error: "Failed to send welcome email. welcomed_at NOT updated." },
      { status: 500 }
    );
  }

  // ── Mark as welcomed (only after successful send) ──
  const now = new Date().toISOString();
  await supabaseAdmin
    .from("seeders")
    .update({ welcomed_at: now })
    .eq("id", seeder.id);

  console.log(`Seeder welcome email sent to ${seeder.email} (${seeder.url_handle})`);

  return NextResponse.json({
    success: true,
    sent_at: now,
    to: seeder.email,
  });
}
