import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      listingId,
      suggestedTitle,
      suggestedDescription,
      suggestedWebsite,
      suggestedAddress,
      suggestedCity,
      suggestedState,
      suggestedCounty,
      notes,
    } = body;

    if (!listingId) {
      return NextResponse.json(
        { error: "Missing listingId." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("listing_edits").insert([
      {
        listing_id: listingId,
        suggested_title: suggestedTitle?.trim() || null,
        suggested_description: suggestedDescription?.trim() || null,
        suggested_website: suggestedWebsite?.trim() || null,
        suggested_address: suggestedAddress?.trim() || null,
        suggested_city: suggestedCity?.trim() || null,
        suggested_state: suggestedState?.trim() || null,
        suggested_county: suggestedCounty?.trim() || null,
        notes: notes?.trim() || null,
        status: "pending",
      },
    ]);

    if (error) {
      console.error("POST listing edit error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/listings/edit error:", error);
    return NextResponse.json(
      { error: "Failed to submit edit suggestion." },
      { status: 500 }
    );
  }
}