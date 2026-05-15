import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

/**
 * GET /resource/[slug]
 *
 * Affiliate redirect layer. Looks up an Online Resource by slug,
 * then 302-redirects to the affiliate tracking URL (or display URL
 * as fallback). Every click hits the database — no caching — so
 * Awin tracking fires on every visit.
 */

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data } = await supabaseAdmin
    .from("affiliate_resources")
    .select("affiliate_url, url")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (!data) {
    return new Response("Not found", { status: 404, headers: NO_CACHE });
  }

  const destination = data.affiliate_url || data.url;

  if (!destination) {
    return NextResponse.redirect(new URL("/support", request.url), {
      status: 302,
      headers: NO_CACHE,
    });
  }

  return NextResponse.redirect(destination, {
    status: 302,
    headers: NO_CACHE,
  });
}
