import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { generateVerificationToken } from "@/app/lib/stewardshipTokens";
import { sendStewardVerificationEmail } from "@/app/lib/emails/stewardVerification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const oldToken = body.token?.trim();

    if (!oldToken) {
      return NextResponse.json(
        { error: "Missing token." },
        { status: 400 }
      );
    }

    // ── 1. Look up the claim by the expired token ─────────
    const { data: claim, error: claimError } = await supabaseAdmin
      .from("stewardship_claims")
      .select("*")
      .eq("verification_token", oldToken)
      .maybeSingle();

    if (claimError || !claim) {
      return NextResponse.json(
        { error: "Claim not found." },
        { status: 404 }
      );
    }

    // ── 2. Rate limit: reject if current token hasn't expired ─
    // This prevents re-issue spam. Currently rejects outright if
    // the token is still valid. Could later soften to "once per
    // hour" so a steward who loses the second email isn't locked
    // out for the full 72h window.
    const tokenStillValid =
      new Date(claim.token_expires_at).getTime() > Date.now();
    if (tokenStillValid) {
      return NextResponse.json(
        {
          error:
            "Your current confirmation link is still active — check your email.",
        },
        { status: 429 }
      );
    }

    // ── 3. Load the steward and verify status ─────────────
    const { data: steward, error: stewardError } = await supabaseAdmin
      .from("stewards")
      .select("*")
      .eq("id", claim.steward_id)
      .single();

    if (stewardError || !steward) {
      return NextResponse.json(
        { error: "Steward record not found." },
        { status: 404 }
      );
    }

    if (steward.status !== "pending") {
      return NextResponse.json(
        { error: "This claim has already been processed." },
        { status: 409 }
      );
    }

    // ── 4. Generate new token + 72h expiry ────────────────
    const newToken = generateVerificationToken();
    const newExpiry = new Date(
      Date.now() + 72 * 60 * 60 * 1000
    ).toISOString();

    const { error: updateError } = await supabaseAdmin
      .from("stewardship_claims")
      .update({
        verification_token: newToken,
        token_expires_at: newExpiry,
      })
      .eq("id", claim.id);

    if (updateError) {
      console.error("Reverify token update failed:", updateError);
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }

    // ── 5. Load listing name for the email ────────────────
    const { data: listing } = await supabaseAdmin
      .from("listings")
      .select("title")
      .eq("id", steward.listing_id)
      .single();

    // ── 6. Send fresh verification email ──────────────────
    try {
      await sendStewardVerificationEmail({
        toEmail: steward.email,
        displayName: steward.display_name,
        listingName: listing?.title || "this listing",
        token: newToken,
        verificationPath: steward.verification_path,
      });
    } catch (emailErr) {
      console.error("Reverify email send failed:", emailErr);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    console.log(
      `Reverify: fresh token issued for steward ${steward.id} (${steward.email})`
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reverify error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
