import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { isDomainMatch } from "@/app/lib/domainMatch";
import { generateVerificationToken } from "@/app/lib/stewardshipTokens";
import { sendStewardVerificationEmail } from "@/app/lib/emails/stewardVerification";
import { getClientIp, hashIp, createRateLimiter } from "@/app/lib/rateLimit";

// This endpoint sends a real email to an address the requester supplies
// — the same abuse shape as /api/affiliates, so it gets the same limit.
// A legitimate person claims at most a handful of listings (their own
// businesses) and will never notice this.
const CLAIM_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const CLAIM_RATE_LIMIT_MAX = 5;
const isClaimRateLimited = createRateLimiter(
  CLAIM_RATE_LIMIT_WINDOW_MS,
  CLAIM_RATE_LIMIT_MAX
);

export async function POST(request: Request) {
  const ipHash = hashIp(getClientIp(request));
  if (isClaimRateLimited(ipHash)) {
    return NextResponse.json(
      { error: "Too many claim attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const listingId = body.listing_id?.trim();
    const email = body.email?.trim();
    const displayName = body.display_name?.trim() || null;
    const declarationText = body.declaration_text?.trim() || null;

    if (!listingId || !email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Load listing
    const { data: listing, error: listingErr } = await supabaseAdmin
      .from("listings")
      .select("id, title, website")
      .eq("id", listingId)
      .single();

    if (listingErr || !listing) {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 }
      );
    }

    // Check for existing steward (active or pending)
    const { data: existingStewards } = await supabaseAdmin
      .from("stewards")
      .select("id, status")
      .eq("listing_id", listingId)
      .in("status", ["active", "pending", "verified_waiting_grace"]);

    if (existingStewards && existingStewards.length > 0) {
      const hasActive = existingStewards.some((s) => s.status === "active");
      return NextResponse.json(
        {
          error: hasActive
            ? "This listing already has a steward."
            : "A claim is already pending for this listing.",
        },
        { status: 409 }
      );
    }

    // Determine verification path
    const verificationPath = isDomainMatch(email, listing.website || null)
      ? "domain_match"
      : "declaration";

    // Create steward record
    const { data: steward, error: stewardErr } = await supabaseAdmin
      .from("stewards")
      .insert([
        {
          listing_id: listingId,
          email,
          display_name: displayName,
          verification_path: verificationPath,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (stewardErr || !steward) {
      console.error("Steward insert error:", stewardErr);
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }

    // Generate token and create claim
    const token = generateVerificationToken();
    const tokenExpiresAt = new Date(
      Date.now() + 72 * 60 * 60 * 1000
    ).toISOString();

    const { error: claimErr } = await supabaseAdmin
      .from("stewardship_claims")
      .insert([
        {
          steward_id: steward.id,
          verification_token: token,
          token_expires_at: tokenExpiresAt,
          declaration_text: declarationText,
        },
      ]);

    if (claimErr) {
      console.error("Claim insert error:", claimErr);
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }

    // Send verification email
    try {
      await sendStewardVerificationEmail({
        toEmail: email,
        displayName,
        listingName: listing.title || "this listing",
        token,
        verificationPath,
      });
    } catch (emailErr) {
      console.error("Steward claim email failed:", emailErr);
      // Don't fail the claim — the record exists, Ren can resend manually
    }

    console.log(
      `Steward claim filed: ${email} → listing ${listingId} (${verificationPath})`
    );

    return NextResponse.json({ success: true, email });
  } catch (err) {
    console.error("Steward claim error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
