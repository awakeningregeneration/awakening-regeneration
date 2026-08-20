/**
 * /api/contributor/[slug]
 *
 * Public-read: returns all affiliate_resources for a dynamic contributor,
 * identified by their slug (stored as contributor_id in affiliate_resources).
 */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data, error } = await supabaseAdmin
    .from("affiliate_resources")
    .select("*")
    .eq("contributor_id", slug)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
