import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { normalizeName } from "@/app/lib/normalize";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name")?.trim() ?? "";
  const city = searchParams.get("city")?.trim() ?? "";

  if (name.length < 2 || city.length < 2) {
    return NextResponse.json({ matched: null });
  }

  const normalized = normalizeName(name);

  const { data } = await supabaseAdmin
    .from("listings")
    .select("id, title, city")
    .eq("normalized_name", normalized)
    .ilike("city", city)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ matched: data ?? null });
}
