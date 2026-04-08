import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    return NextResponse.json({ founder: data }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}