import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { promoteIfGraceExpired } from "@/app/lib/stewardshipPromotion";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listing_id");

  if (!listingId) {
    return NextResponse.json({ isVerifiedSteward: false });
  }

  // Auto-promote stewards whose grace period has expired
  await promoteIfGraceExpired(listingId);

  // Parse the cookie from the request
  const cookieName = `steward_session_${listingId}`;
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, v.join("=")];
    })
  );

  const token = cookies[cookieName];
  if (!token) {
    return NextResponse.json({ isVerifiedSteward: false });
  }

  // Validate token against database
  const { data: session } = await supabaseAdmin
    .from("steward_edit_sessions")
    .select("*, stewards(id, email, display_name, status)")
    .eq("session_token", token)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (
    !session ||
    new Date(session.token_expires_at).getTime() < Date.now()
  ) {
    return NextResponse.json({ isVerifiedSteward: false });
  }

  const steward = session.stewards as {
    id: string;
    email: string;
    display_name: string | null;
    status: string;
  } | null;

  if (!steward || steward.status !== "active") {
    return NextResponse.json({ isVerifiedSteward: false });
  }

  return NextResponse.json({
    isVerifiedSteward: true,
    steward: {
      id: steward.id,
      email: steward.email,
      display_name: steward.display_name,
    },
  });
}
