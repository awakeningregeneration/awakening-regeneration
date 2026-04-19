import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { promoteIfGraceExpired } from "@/app/lib/stewardshipPromotion";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listing_id");

  if (!listingId) {
    return NextResponse.json({ hasPendingClaim: false });
  }

  // Auto-promote stewards whose grace period has expired
  await promoteIfGraceExpired(listingId);

  const { data } = await supabaseAdmin
    .from("stewards")
    .select("id, status")
    .eq("listing_id", listingId)
    .in("status", ["pending", "verified_waiting_grace"])
    .limit(1);

  return NextResponse.json({
    hasPendingClaim: !!(data && data.length > 0),
  });
}
