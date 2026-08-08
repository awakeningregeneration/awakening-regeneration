/**
 * /api/admin/constellation/approaches
 *
 * GET    ?topic_id=xxx — fetch approaches for topic ordered by sort_order ASC
 * POST   { topic_id, name, description } — insert with sort_order = max+1
 * PATCH  { id, name?, description? } — update fields
 *        { id, direction: "up"|"down", topic_id } — reorder within topic
 * DELETE ?id=xxx — delete approach (cascades to example_approaches)
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

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const topic_id = searchParams.get("topic_id");
  if (!topic_id) return NextResponse.json({ error: "topic_id is required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("constellation_approaches")
    .select("*")
    .eq("topic_id", topic_id)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: { topic_id?: string; name?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { topic_id, name, description } = body;
  if (!topic_id || !name) {
    return NextResponse.json({ error: "topic_id and name are required" }, { status: 400 });
  }

  // Compute next sort_order within topic
  const { data: maxRow } = await supabaseAdmin
    .from("constellation_approaches")
    .select("sort_order")
    .eq("topic_id", topic_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sort_order = maxRow ? (maxRow.sort_order ?? 0) + 1 : 0;

  const { data, error } = await supabaseAdmin
    .from("constellation_approaches")
    .insert({ topic_id, name, description: description ?? "", sort_order })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: {
    id?: string;
    name?: string;
    description?: string;
    direction?: "up" | "down";
    topic_id?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, direction } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  // ── Reorder ──
  if (direction === "up" || direction === "down") {
    const { topic_id } = body;
    if (!topic_id) return NextResponse.json({ error: "topic_id required for reorder" }, { status: 400 });

    const { data: current } = await supabaseAdmin
      .from("constellation_approaches")
      .select("sort_order")
      .eq("id", id)
      .single();
    if (!current) return NextResponse.json({ error: "Approach not found" }, { status: 404 });

    const currentOrder = current.sort_order;

    const { data: adjacent } = await supabaseAdmin
      .from("constellation_approaches")
      .select("id, sort_order")
      .eq("topic_id", topic_id)
      .filter("sort_order", direction === "up" ? "lt" : "gt", currentOrder)
      .order("sort_order", { ascending: direction !== "up" })
      .limit(1)
      .maybeSingle();

    if (!adjacent) return NextResponse.json({ ok: true });

    await supabaseAdmin
      .from("constellation_approaches")
      .update({ sort_order: adjacent.sort_order })
      .eq("id", id);
    await supabaseAdmin
      .from("constellation_approaches")
      .update({ sort_order: currentOrder })
      .eq("id", adjacent.id);

    return NextResponse.json({ ok: true });
  }

  // ── Field update ──
  const updates: Record<string, string> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.description !== undefined) updates.description = body.description;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("constellation_approaches")
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
    .from("constellation_approaches")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
