/**
 * /api/admin/affiliates
 *
 * Admin-gated CRUD for affiliate_resources.
 * GET   — all rows regardless of status
 * POST  — insert, defaults to status "approved"
 * PATCH — update any row by id (includes status toggle)
 * DELETE ?id=xxx — delete any row by id
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
    .from("affiliate_resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: {
    name?: string; url?: string; affiliate_url?: string; description?: string;
    why_it_matters?: string; category?: string[]; practices?: string[];
    logo_url?: string; status?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, url, affiliate_url, description, why_it_matters, category, practices, logo_url, status } = body;
  if (!name?.trim() || !url?.trim() || !description?.trim() || !category?.length) {
    return NextResponse.json(
      { error: "name, url, description, and category are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("affiliate_resources")
    .insert({
      name: name.trim(),
      url: url.trim(),
      affiliate_url: affiliate_url?.trim() || null,
      description: description.trim(),
      why_it_matters: why_it_matters?.trim() || null,
      category,
      practices: practices ?? [],
      logo_url: logo_url?.trim() || null,
      status: status ?? "approved",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: { id?: string | number; [key: string]: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  const textFields = ["name", "url", "affiliate_url", "description", "why_it_matters", "logo_url", "status"] as const;
  for (const f of textFields) {
    if (rest[f] !== undefined) {
      updates[f] = typeof rest[f] === "string" ? (rest[f] as string).trim() || null : rest[f];
    }
  }
  if (rest.category !== undefined) {
    updates.category = Array.isArray(rest.category) ? rest.category : [];
  }
  if (rest.practices !== undefined) {
    updates.practices = Array.isArray(rest.practices)
      ? (rest.practices as unknown[]).filter((p): p is string => typeof p === "string" && p.trim() !== "")
      : [];
  }

  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("affiliate_resources")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("affiliate_resources")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
