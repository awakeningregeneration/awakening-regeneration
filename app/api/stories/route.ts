import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const state = searchParams.get("state");
  const county = searchParams.get("county");

  let query = supabase.from("stories").select("*");

  if (state) query = query.eq("state", state);
  if (county) query = query.eq("county", county);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Stories fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { state, county, title, body: storyBody, link } = body;

  if (!state || !county || !storyBody) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("stories").insert([
    {
      state,
      county,
      title,
      body: storyBody,
      link,
    },
  ]);

  if (error) {
    console.error("Story insert error:", error);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  return NextResponse.json(data);
}