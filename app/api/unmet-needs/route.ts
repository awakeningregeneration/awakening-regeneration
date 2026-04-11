import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const search_term = body.search_term?.trim();
    const category = body.category?.trim() || null;

    if (!search_term) {
      return NextResponse.json(
        { error: "Missing search term." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("unmet_needs")
      .insert([{ search_term, category }]);

    if (error) {
      console.error("Unmet needs insert error:", error);
      return NextResponse.json(
        { error: "Failed to save." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Saved." }, { status: 201 });
  } catch (err) {
    console.error("Unmet needs POST error:", err);
    return NextResponse.json(
      { error: "Failed to save." },
      { status: 500 }
    );
  }
}
