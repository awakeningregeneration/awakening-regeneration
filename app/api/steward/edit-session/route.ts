import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/steward/edit-session/failed?reason=missing_token", request.url)
    );
  }

  try {
    // Look up the session
    const { data: session } = await supabaseAdmin
      .from("steward_edit_sessions")
      .select("*")
      .eq("session_token", token)
      .maybeSingle();

    if (!session) {
      return NextResponse.redirect(
        new URL("/steward/edit-session/failed?reason=invalid_token", request.url)
      );
    }

    if (new Date(session.token_expires_at).getTime() < Date.now()) {
      return NextResponse.redirect(
        new URL("/steward/edit-session/failed?reason=expired", request.url)
      );
    }

    if (session.used_at) {
      return NextResponse.redirect(
        new URL("/steward/edit-session/failed?reason=already_used", request.url)
      );
    }

    // Mark as used
    await supabaseAdmin
      .from("steward_edit_sessions")
      .update({ used_at: new Date().toISOString() })
      .eq("id", session.id);

    // Set cookie and redirect to edit page
    const cookieName = `steward_session_${session.listing_id}`;
    const response = NextResponse.redirect(
      new URL(`/edit/${session.listing_id}`, request.url)
    );

    response.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 60, // 30 minutes
    });

    return response;
  } catch (err) {
    console.error("Steward edit-session error:", err);
    return NextResponse.redirect(
      new URL("/steward/edit-session/failed?reason=error", request.url)
    );
  }
}
