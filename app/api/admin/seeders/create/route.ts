/**
 * POST /api/admin/seeders/create
 *
 * Creates a new seeder row and sends the welcome email in one action.
 *
 * Auth: Authorization: Bearer ${ADMIN_SECRET}
 * Body: { name: string, email: string, url_handle: string }
 *
 * Returns the new seeder ID and send timestamp on success.
 * Returns 207 if the row was created but the email failed to send.
 */

import { NextResponse } from "next/server";
import { createSeeder } from "@/app/lib/adminSeederActions";

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
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { name, email, url_handle } = body;

  const result = await createSeeder({ name, email, url_handle });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
