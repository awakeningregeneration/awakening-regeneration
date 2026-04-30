import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { isTokenExpired } from "@/app/lib/stewardshipTokens";
import { createHmac } from "crypto";

/**
 * GET /api/seeder/auth?token=xxx
 *
 * Validates a magic-link token, marks it as used, creates a signed
 * 30-day session cookie, and redirects to the seeder's dashboard
 * (or /start if orientation is incomplete).
 */

const SESSION_SECRET = process.env.SEEDER_SESSION_SECRET!;
const THIRTY_DAYS_S = 30 * 24 * 60 * 60;

function signPayload(payload: object): string {
  const json = JSON.stringify(payload);
  const sig = createHmac("sha256", SESSION_SECRET)
    .update(json)
    .digest("base64url");
  return `${Buffer.from(json).toString("base64url")}.${sig}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Look up token
  const { data: loginToken } = await supabaseAdmin
    .from("seeder_login_tokens")
    .select("id, seeder_id, expires_at, used_at")
    .eq("token", token)
    .single();

  if (
    !loginToken ||
    loginToken.used_at ||
    isTokenExpired(loginToken.expires_at)
  ) {
    // Try to find the seeder's handle for a better error redirect
    if (loginToken?.seeder_id) {
      const { data: s } = await supabaseAdmin
        .from("seeders")
        .select("url_handle")
        .eq("id", loginToken.seeder_id)
        .single();
      if (s?.url_handle) {
        return NextResponse.redirect(
          new URL(`/${s.url_handle}/login?error=invalid_token`, req.url)
        );
      }
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Mark token as used
  await supabaseAdmin
    .from("seeder_login_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", loginToken.id);

  // Get seeder details
  const { data: seeder } = await supabaseAdmin
    .from("seeders")
    .select("id, url_handle, orientation_completed_at")
    .eq("id", loginToken.seeder_id)
    .single();

  if (!seeder || !seeder.url_handle) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Create signed session cookie
  const exp = Math.floor(Date.now() / 1000) + THIRTY_DAYS_S;
  const payload = { seeder_id: seeder.id, handle: seeder.url_handle, exp };
  const signed = signPayload(payload);

  const redirectPath = seeder.orientation_completed_at
    ? `/${seeder.url_handle}`
    : `/${seeder.url_handle}/start`;

  const response = NextResponse.redirect(new URL(redirectPath, req.url));
  response.cookies.set("cc_seeder_session", signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS_S,
  });

  return response;
}
