import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { generateVerificationToken } from "@/app/lib/stewardshipTokens";
import { resend, FROM_EMAIL } from "@/app/lib/resend";
import { seederLoginLinkEmail } from "@/app/lib/emails/seederLoginLink";

/**
 * POST /api/seeder/login-request
 *
 * Accepts { email, handle }. If the email/handle combination matches
 * an active seeder, generates a 30-minute magic link and sends it.
 * Always returns { success: true } regardless of match — never reveals
 * whether the email/handle exists.
 */

// In-memory rate limit: max 5 requests per hour per IP+handle.
// Not durable across deploys — acceptable for MVP.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, handle } = body;

    if (!email || !handle) {
      return NextResponse.json({ success: true });
    }

    // Rate limit
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateKey = `${ip}:${handle}`;
    const now = Date.now();
    const entry = rateLimitMap.get(rateKey);
    if (entry && now < entry.resetAt) {
      if (entry.count >= 5) {
        return NextResponse.json({ success: true });
      }
      entry.count++;
    } else {
      rateLimitMap.set(rateKey, { count: 1, resetAt: now + 3600_000 });
    }

    // Look up seeder
    const { data: seeder } = await supabaseAdmin
      .from("seeders")
      .select("id, name, email, active, url_handle")
      .eq("url_handle", handle)
      .single();

    if (
      !seeder ||
      !seeder.active ||
      seeder.email.toLowerCase() !== email.toLowerCase()
    ) {
      return NextResponse.json({ success: true });
    }

    // Generate token (30-min expiry)
    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    await supabaseAdmin.from("seeder_login_tokens").insert({
      seeder_id: seeder.id,
      token,
      expires_at: expiresAt,
    });

    // Send email
    const loginUrl = `https://www.canarycommons.org/api/seeder/auth?token=${encodeURIComponent(token)}`;
    const emailContent = seederLoginLinkEmail({
      name: seeder.name,
      loginUrl,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: seeder.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
