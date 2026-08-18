/**
 * /api/admin/constellation/examples
 *
 * GET  ?approach_id=xxx        — fetch examples attached to this approach (ordered by sort_order)
 * GET  ?topic_id=xxx&all=1     — fetch ALL examples attached to any approach in this topic (deduplicated)
 * POST { title, url, summary, approach_id } — insert example + attach to approach
 * DELETE ?id=xxx               — delete example entirely (cascades join rows)
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

function faviconUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return "";
  }
}

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const approach_id = searchParams.get("approach_id");
  const topic_id = searchParams.get("topic_id");
  const all = searchParams.get("all");

  // ── All examples in a topic (for attach picker) ──
  if (topic_id && all === "1") {
    // Get all approach ids for the topic
    const { data: approaches, error: apErr } = await supabaseAdmin
      .from("constellation_approaches")
      .select("id")
      .eq("topic_id", topic_id);

    if (apErr) return NextResponse.json({ error: apErr.message }, { status: 500 });
    if (!approaches || approaches.length === 0) return NextResponse.json([]);

    const approachIds = approaches.map((a) => a.id);

    // Get all example_ids linked to these approaches
    const { data: joins, error: joinErr } = await supabaseAdmin
      .from("constellation_example_approaches")
      .select("example_id")
      .in("approach_id", approachIds);

    if (joinErr) return NextResponse.json({ error: joinErr.message }, { status: 500 });
    if (!joins || joins.length === 0) return NextResponse.json([]);

    // Deduplicate example ids
    const exampleIds = [...new Set(joins.map((j) => j.example_id))];

    const { data: examples, error: exErr } = await supabaseAdmin
      .from("constellation_examples")
      .select("*")
      .in("id", exampleIds);

    if (exErr) return NextResponse.json({ error: exErr.message }, { status: 500 });
    return NextResponse.json(examples ?? []);
  }

  // ── Examples for a specific approach ──
  if (approach_id) {
    const { data: joins, error: joinErr } = await supabaseAdmin
      .from("constellation_example_approaches")
      .select("example_id, sort_order")
      .eq("approach_id", approach_id)
      .order("sort_order", { ascending: true });

    if (joinErr) return NextResponse.json({ error: joinErr.message }, { status: 500 });
    if (!joins || joins.length === 0) return NextResponse.json([]);

    const exampleIds = joins.map((j) => j.example_id);
    const orderMap = Object.fromEntries(joins.map((j) => [j.example_id, j.sort_order]));

    const { data: examples, error: exErr } = await supabaseAdmin
      .from("constellation_examples")
      .select("*")
      .in("id", exampleIds);

    if (exErr) return NextResponse.json({ error: exErr.message }, { status: 500 });

    const sorted = (examples ?? []).sort(
      (a, b) => (orderMap[a.id] ?? 0) - (orderMap[b.id] ?? 0)
    );

    return NextResponse.json(sorted);
  }

  return NextResponse.json({ error: "approach_id or topic_id+all required" }, { status: 400 });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: { title?: string; url?: string; summary?: string; approach_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, url, summary, approach_id } = body;
  if (!title || !url || !approach_id) {
    return NextResponse.json({ error: "title, url, and approach_id are required" }, { status: 400 });
  }

  const favicon = faviconUrl(url);

  // Insert example
  const { data: example, error: exErr } = await supabaseAdmin
    .from("constellation_examples")
    .insert({
      title,
      url,
      summary: summary ?? "",
      favicon_url: favicon || null,
    })
    .select()
    .single();

  if (exErr) return NextResponse.json({ error: exErr.message }, { status: 500 });

  // Compute sort_order for attach
  const { data: maxRow } = await supabaseAdmin
    .from("constellation_example_approaches")
    .select("sort_order")
    .eq("approach_id", approach_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sort_order = maxRow ? (maxRow.sort_order ?? 0) + 1 : 0;

  // Attach to approach
  const { error: joinErr } = await supabaseAdmin
    .from("constellation_example_approaches")
    .insert({ example_id: example.id, approach_id, sort_order });

  if (joinErr) return NextResponse.json({ error: joinErr.message }, { status: 500 });

  return NextResponse.json(example, { status: 201 });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: { id?: string; title?: string; url?: string; summary?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, title, url, summary } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const updates: Record<string, string | null> = {};
  if (title !== undefined) updates.title = title;
  if (url !== undefined) {
    updates.url = url;
    updates.favicon_url = faviconUrl(url) || null;
  }
  if (summary !== undefined) updates.summary = summary;

  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("constellation_examples")
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
    .from("constellation_examples")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
