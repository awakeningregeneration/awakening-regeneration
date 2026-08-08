/**
 * /api/admin/constellation/example-approaches
 *
 * POST { example_id, approach_id } — attach example to approach (upsert, sort_order = max+1)
 * DELETE body { example_id, approach_id } — detach (delete from join table only, does NOT delete the example)
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

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: { example_id?: string; approach_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { example_id, approach_id } = body;
  if (!example_id || !approach_id) {
    return NextResponse.json({ error: "example_id and approach_id are required" }, { status: 400 });
  }

  // Compute sort_order
  const { data: maxRow } = await supabaseAdmin
    .from("constellation_example_approaches")
    .select("sort_order")
    .eq("approach_id", approach_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sort_order = maxRow ? (maxRow.sort_order ?? 0) + 1 : 0;

  const { error } = await supabaseAdmin
    .from("constellation_example_approaches")
    .upsert({ example_id, approach_id, sort_order }, { onConflict: "example_id,approach_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: { example_id?: string; approach_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { example_id, approach_id } = body;
  if (!example_id || !approach_id) {
    return NextResponse.json({ error: "example_id and approach_id are required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("constellation_example_approaches")
    .delete()
    .eq("example_id", example_id)
    .eq("approach_id", approach_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
