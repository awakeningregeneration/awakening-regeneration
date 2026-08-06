import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data: topic, error: topicError } = await supabaseAdmin
    .from("constellation_topics")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (topicError) {
    console.error("constellation_topics fetch error:", topicError.message);
    return NextResponse.json({ error: "Failed to load topic." }, { status: 500 });
  }

  if (!topic) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const { data: links, error: linksError } = await supabaseAdmin
    .from("constellation_links")
    .select("*")
    .eq("topic_id", topic.id)
    .order("created_at", { ascending: true });

  if (linksError) {
    console.error("constellation_links fetch error:", linksError.message);
    return NextResponse.json({ error: "Failed to load links." }, { status: 500 });
  }

  return NextResponse.json({ topic, links: links ?? [] });
}
