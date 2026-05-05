import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

/**
 * POST /listings/[id]/remove/confirm
 *
 * Processes the soft removal. Called by the confirmation form on the
 * arrival page. Re-validates token (defense in depth), performs the
 * removal write, and redirects to the done page.
 *
 * Sets do_not_list_level = 'seeder_only' — blocks all future seeder
 * placements of this business. Public community submissions remain open.
 * See OPT_OUT_LAYERS.md for the full consent model.
 */

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // ── Read token from form data ──
  const formData = await req.formData();
  const token = formData.get("token") as string | null;

  if (!token) {
    return NextResponse.redirect(
      new URL(`/listings/${id}/remove?token=`, req.url),
      303
    );
  }

  // ── Re-validate (defense in depth) ──
  const { data: listing } = await supabaseAdmin
    .from("listings")
    .select("id, removal_token, status")
    .eq("id", id)
    .single();

  if (
    !listing ||
    !listing.removal_token ||
    listing.removal_token !== token ||
    listing.status === "removed"
  ) {
    return NextResponse.redirect(
      new URL(`/listings/${id}/remove?token=${encodeURIComponent(token)}`, req.url),
      303
    );
  }

  // ── Perform removal write ──
  await supabaseAdmin
    .from("listings")
    .update({
      status: "removed",
      outreach_status: "removed",
      do_not_list_level: "seeder_only",
      removal_token: null,
    })
    .eq("id", id);

  // ── Redirect to done page ──
  return NextResponse.redirect(
    new URL(`/listings/${id}/remove/done`, req.url),
    303
  );
}
