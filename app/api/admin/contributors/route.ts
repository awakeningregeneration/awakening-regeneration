/**
 * /api/admin/contributors
 *
 * Admin-gated management of the contributors table.
 * GET  — list all contributors
 * POST — create a new contributor (name, email, slug)
 *
 * Three-gate admin auth on every method.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSessionFromCookieValue } from "@/app/lib/seederAuth";

const ADMIN_SEEDER_EMAIL = process.env.ADMIN_SEEDER_EMAIL;

async function requireAdmin(): Promise<{ error: NextResponse } | { ok: true }> {
  const cookieStore = await cookies();
  const session = getSeederSessionFromCookieValue(
    cookieStore.get("cc_seeder_session")?.value
  );
  if (!session) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const { data: seeder } = await supabaseAdmin
    .from("seeders")
    .select("email")
    .eq("id", session.seeder_id)
    .single();
  if (!seeder) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  if (!ADMIN_SEEDER_EMAIL || seeder.email !== ADMIN_SEEDER_EMAIL)
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  return { ok: true };
}

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { data, error } = await supabaseAdmin
    .from("contributors")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: { name?: string; email?: string; slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  if (!name || !email)
    return NextResponse.json({ error: "name and email are required" }, { status: 400 });

  // Auto-derive slug from name if not provided, or clean the provided one
  const slug = (body.slug?.trim() || name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug)
    return NextResponse.json({ error: "Could not generate a valid slug from that name" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("contributors")
    .insert({ name, email, slug })
    .select()
    .single();

  if (error) {
    if (error.code === "23505")
      return NextResponse.json(
        { error: `The handle "${slug}" is already taken. Edit the handle field and try again.` },
        { status: 409 }
      );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
