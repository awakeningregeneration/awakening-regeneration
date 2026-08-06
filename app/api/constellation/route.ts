import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("constellation_topics")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("constellation_topics fetch error:", error.message);
    return NextResponse.json({ error: "Failed to load topics." }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
