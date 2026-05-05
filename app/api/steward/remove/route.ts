import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

/**
 * POST /api/steward/remove
 *
 * Hard removal — steward-driven, sets do_not_list_level = 'universal'.
 * Auth: per-listing steward session cookie (same pattern as /api/steward/save).
 *
 * Body: { listing_id: string, reason: string, other_text?: string }
 * reason is one of: "closed", "not_fit", "not_findable", "other"
 */

const REASON_MAP: Record<string, string> = {
  closed: "We're closed or no longer operating",
  not_fit: "This isn't a fit for us",
  not_findable: "We don't want to be findable on a map",
  other: "Other",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listing_id, reason, other_text } = body;

    if (!listing_id) {
      return NextResponse.json(
        { error: "Missing listing_id." },
        { status: 400 }
      );
    }

    if (!reason || !REASON_MAP[reason]) {
      return NextResponse.json(
        { error: "Invalid removal reason." },
        { status: 400 }
      );
    }

    // ── Validate steward session cookie ──
    const cookieName = `steward_session_${listing_id}`;
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k, v.join("=")];
      })
    );
    const token = cookies[cookieName];

    if (!token) {
      return NextResponse.json(
        { error: "No valid steward session." },
        { status: 403 }
      );
    }

    const { data: session } = await supabaseAdmin
      .from("steward_edit_sessions")
      .select("*")
      .eq("session_token", token)
      .eq("listing_id", listing_id)
      .maybeSingle();

    if (
      !session ||
      new Date(session.token_expires_at).getTime() < Date.now()
    ) {
      return NextResponse.json(
        { error: "Session expired. Please request a new edit link." },
        { status: 403 }
      );
    }

    // ── Compose reason string ──
    let do_not_list_reason = REASON_MAP[reason];
    if (reason === "other" && other_text?.trim()) {
      do_not_list_reason = `Other: ${other_text.trim()}`;
    }

    // ── Perform hard removal write ──
    const { error: updateErr } = await supabaseAdmin
      .from("listings")
      .update({
        status: "removed",
        do_not_list: true,
        do_not_list_level: "universal",
        do_not_list_reason,
        do_not_list_at: new Date().toISOString(),
        removal_token: null,
        outreach_status: "removed",
      })
      .eq("id", listing_id);

    if (updateErr) {
      return NextResponse.json(
        { error: updateErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, listing_id });
  } catch (err) {
    console.error("Steward remove error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to remove." },
      { status: 500 }
    );
  }
}
