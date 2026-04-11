import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET() {
  const { data, error } = await supabase
    .from("affiliate_resources")
    .select("id, name, category, status, created_at")
    .eq("contributor_id", "contributor_001")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Contributor fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributor resources." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
