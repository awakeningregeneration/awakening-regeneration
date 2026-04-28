import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { search_term, county, state, direct_hit_count, related_count, online_count } = body;

    if (!search_term || typeof search_term !== "string") {
      return NextResponse.json({ error: "search_term required" }, { status: 400 });
    }

    const { error } = await supabase.from("search_logs").insert([
      {
        search_term: search_term.trim().toLowerCase(),
        county: county || null,
        state: state || null,
        direct_hit_count: direct_hit_count ?? 0,
        related_count: related_count ?? 0,
        online_count: online_count ?? 0,
      },
    ]);

    if (error) {
      console.error("search-log insert error:", error.message);
      return NextResponse.json({ error: "Failed to log search" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
