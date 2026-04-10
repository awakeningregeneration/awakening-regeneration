import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim();
    const city = body.city?.trim() || null;
    const state = body.state?.trim() || null;
    const why = body.why?.trim();
    const referral_code = body.referral_code?.trim() || null;
    const referred_by = body.referred_by?.trim() || null;

    if (!name || !email || !why) {
      return NextResponse.json(
        { error: "Name, email, and why are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("founders")
      .insert([
        {
          name,
          email,
          city,
          state,
          why,
          referral_code,
          referred_by,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save founder." },
        { status: 500 }
      );
    }

    try {
      await resend.emails.send({
        from: "Canary Commons <onboarding@resend.dev>",
        to: email,
        subject: "You’re in — welcome to the Foundation",
        html: `
          <h2>Welcome to Canary Commons</h2>
          <p>Thank you for stepping into the Foundation.</p>
          <p>We’ve received your founder submission and will be in touch with next steps soon.</p>
          <p>You are helping turn on the first lights.</p>
          <br />
          <p>— Canary Commons</p>
        `,
      });
       } catch (emailError) {
      console.error("Resend email error:", emailError);
      return NextResponse.json(
        { error: "Founder saved, but email failed to send." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Founder interest received. Thank you.", founder: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}