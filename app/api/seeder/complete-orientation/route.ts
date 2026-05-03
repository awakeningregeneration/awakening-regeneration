import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSession } from "@/app/lib/seederAuth";

export async function POST(req: Request) {
  const session = getSeederSession(req);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only set orientation_completed_at if not already set
  const { error } = await supabaseAdmin
    .from("seeders")
    .update({ orientation_completed_at: new Date().toISOString() })
    .eq("id", session.seeder_id)
    .is("orientation_completed_at", null);

  if (error) {
    console.error("Failed to complete orientation:", error.message);
    return NextResponse.json(
      { error: "Failed to save orientation completion." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
