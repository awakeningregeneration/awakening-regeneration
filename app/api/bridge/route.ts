import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { resend, FROM_EMAIL } from "@/app/lib/resend";
import { notifyBridgeInquiryEmail } from "@/app/lib/emails/notifyBridgeInquiry";

const VALID_RANGES = ["500-1000", "1000-5000", "5000+"];
const NOTIFY_EMAIL = "founder@canarycommons.org";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, giftRange, message } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length < 1) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (
      !email ||
      typeof email !== "string" ||
      !email.includes("@") ||
      !email.includes(".")
    ) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }
    if (!giftRange || !VALID_RANGES.includes(giftRange)) {
      return NextResponse.json(
        { error: "Please select a gift range." },
        { status: 400 }
      );
    }

    const trimmedMessage =
      message && typeof message === "string" ? message.trim() || null : null;

    // Save to database
    const { error: dbError } = await supabaseAdmin
      .from("bridge_inquiries")
      .insert({
        name: name.trim(),
        email: email.trim(),
        gift_range: giftRange,
        message: trimmedMessage,
      });

    if (dbError) {
      console.error("bridge_inquiries insert error:", dbError.message);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    // Send notification email to Ren
    try {
      const emailContent = notifyBridgeInquiryEmail({
        name: name.trim(),
        email: email.trim(),
        giftRange,
        message: trimmedMessage,
      });
      await resend.emails.send({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        replyTo: email.trim(),
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
    } catch (emailErr) {
      // Non-blocking — inquiry is saved even if email fails
      console.error(
        "Bridge inquiry notification email failed:",
        emailErr instanceof Error ? emailErr.message : emailErr
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(
      "Bridge inquiry error:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
