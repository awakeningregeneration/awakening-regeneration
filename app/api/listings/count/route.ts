import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Always hit the database for a fresh count — this endpoint exists
// specifically so launch-weekend polling never shows a stale number.
export const dynamic = "force-dynamic";

// GET — count-only, same filter as /api/listings ("published/visible"),
// but requests zero row data. Supabase returns the count via the
// response's Content-Range header (head: true), so no listing content
// is ever transferred here.
export async function GET() {
  const { count, error } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { count: count ?? 0 },
    { headers: { "Cache-Control": "no-store" } },
  );
}
