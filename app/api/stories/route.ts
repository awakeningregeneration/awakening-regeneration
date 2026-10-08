import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { normalizeState, normalizeCounty } from "@/app/lib/normalize";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const TITLE_MAX = 120;
const BODY_MAX = 3000;
const LINK_MAX = 500;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const state = searchParams.get("state");
  const county = searchParams.get("county");
  const listingId = searchParams.get("listingId");

  let query = supabase.from("stories").select("*").eq("status", "active");

  const normalizedState = state ? normalizeState(state) : "";
  const normalizedCounty = county ? normalizeCounty(county) : "";

  if (normalizedState) query = query.eq("state", normalizedState);
  if (normalizedCounty) query = query.eq("county", normalizedCounty);
  if (listingId) query = query.eq("listing_id", listingId);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Stories fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { state, county, title, body: storyBody, link, listingId } = body;

  if (!state || !county || !storyBody) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (typeof storyBody !== "string" || storyBody.length > BODY_MAX) {
    return NextResponse.json(
      { error: `Story must be ${BODY_MAX} characters or fewer.` },
      { status: 400 }
    );
  }

  if (typeof title === "string" && title.length > TITLE_MAX) {
    return NextResponse.json(
      { error: `Title must be ${TITLE_MAX} characters or fewer.` },
      { status: 400 }
    );
  }

  if (typeof link === "string" && link.length > LINK_MAX) {
    return NextResponse.json(
      { error: `Link must be ${LINK_MAX} characters or fewer.` },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("stories").insert([
    {
      state: normalizeState(state) || null,
      county: normalizeCounty(county) || null,
      title,
      body: storyBody,
      link,
      listing_id: listingId || null,
    },
  ]);

  if (error) {
    console.error("Story insert error:", error);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  return NextResponse.json(data);
}