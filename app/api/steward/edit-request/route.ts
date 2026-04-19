import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { generateVerificationToken } from "@/app/lib/stewardshipTokens";
import { sendStewardEditLinkEmail } from "@/app/lib/emails/stewardEditLink";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const listingId = body.listing_id?.trim();
    const email = body.email?.trim().toLowerCase();

    if (!listingId || !email) {
      return NextResponse.json({ success: true }); // generic — don't leak
    }

    // Look up listing
    const { data: listing } = await supabaseAdmin
      .from("listings")
      .select("id, title, steward_email")
      .eq("id", listingId)
      .single();

    if (!listing || !listing.steward_email) {
      return NextResponse.json({ success: true }); // generic
    }

    // Check email match (case-insensitive)
    if (listing.steward_email.toLowerCase() !== email) {
      return NextResponse.json({ success: true }); // generic
    }

    // Check steward is active
    const { data: steward } = await supabaseAdmin
      .from("stewards")
      .select("id, display_name, status")
      .eq("listing_id", listingId)
      .eq("status", "active")
      .maybeSingle();

    if (!steward) {
      return NextResponse.json({ success: true }); // generic
    }

    // Generate session token (30 minutes)
    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    await supabaseAdmin.from("steward_edit_sessions").insert([
      {
        steward_id: steward.id,
        listing_id: listingId,
        session_token: token,
        token_expires_at: expiresAt,
      },
    ]);

    // Send email
    await sendStewardEditLinkEmail({
      toEmail: email,
      displayName: steward.display_name,
      listingName: listing.title || "your listing",
      token,
    });

    console.log(`Steward edit link sent to ${email} for listing ${listingId}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Steward edit-request error:", err);
    return NextResponse.json({ success: true }); // always generic
  }
}
