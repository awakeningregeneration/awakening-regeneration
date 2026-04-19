import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { isDomainMatch } from "@/app/lib/domainMatch";
import { generateVerificationToken } from "@/app/lib/stewardshipTokens";
import { sendStewardVerificationEmail } from "@/app/lib/emails/stewardVerification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const listingId = body.listing_id;

    if (!listingId) {
      return NextResponse.json(
        { error: "Missing listing_id." },
        { status: 400 }
      );
    }

    // ── Validate session cookie ──────────────────────────────
    const cookieName = `steward_session_${listingId}`;
    const cookieHeader = request.headers.get("cookie") || "";
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
      .eq("listing_id", listingId)
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

    // ── Update listing fields directly ───────────────────────
    const listingUpdate: Record<string, unknown> = {};
    const fields = [
      "title",
      "description",
      "website",
      "address",
      "city",
      "state",
      "county",
      "category",
    ] as const;

    for (const f of fields) {
      if (body[f] !== undefined) {
        listingUpdate[f] = typeof body[f] === "string" ? body[f].trim() : body[f];
      }
    }

    if (body.practices !== undefined) {
      listingUpdate.practices = Array.isArray(body.practices)
        ? body.practices.filter((p: unknown) => typeof p === "string" && p.trim())
        : [];
    }

    if (Object.keys(listingUpdate).length > 0) {
      const { error: updateErr } = await supabaseAdmin
        .from("listings")
        .update(listingUpdate)
        .eq("id", listingId);

      if (updateErr) {
        return NextResponse.json(
          { error: updateErr.message },
          { status: 500 }
        );
      }
    }

    // ── Handle stewardship field changes ─────────────────────
    const newStewardEmail = body.steward_email?.trim();
    const newDisplayName = body.steward_display_name?.trim() ?? null;
    let handoffPending = false;

    if (newStewardEmail || newDisplayName !== undefined) {
      const { data: steward } = await supabaseAdmin
        .from("stewards")
        .select("*")
        .eq("id", session.steward_id)
        .single();

      if (steward) {
        const emailChanged =
          newStewardEmail &&
          newStewardEmail.toLowerCase() !== steward.email.toLowerCase();

        if (!emailChanged) {
          // Just display name change — update directly
          if (newDisplayName !== undefined) {
            await supabaseAdmin
              .from("stewards")
              .update({ display_name: newDisplayName || null })
              .eq("id", steward.id);
          }
        } else {
          // Email changed — determine if domain match or handoff
          const listingWebsite = listingUpdate.website as string | undefined ??
            (await supabaseAdmin.from("listings").select("website").eq("id", listingId).single()).data?.website;

          if (isDomainMatch(newStewardEmail, listingWebsite || null)) {
            // Domain match: update steward email directly
            await supabaseAdmin
              .from("stewards")
              .update({
                email: newStewardEmail,
                display_name: newDisplayName || steward.display_name,
              })
              .eq("id", steward.id);

            await supabaseAdmin
              .from("listings")
              .update({ steward_email: newStewardEmail })
              .eq("id", listingId);
          } else {
            // Declaration path: create pending new steward, keep current active
            const { data: newSteward } = await supabaseAdmin
              .from("stewards")
              .insert([
                {
                  listing_id: listingId,
                  email: newStewardEmail,
                  display_name: newDisplayName || null,
                  verification_path: "declaration",
                  status: "pending",
                },
              ])
              .select()
              .single();

            if (newSteward) {
              const vToken = generateVerificationToken();
              await supabaseAdmin.from("stewardship_claims").insert([
                {
                  steward_id: newSteward.id,
                  verification_token: vToken,
                  token_expires_at: new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                  ).toISOString(),
                },
              ]);

              const listingName =
                (listingUpdate.title as string) ||
                (
                  await supabaseAdmin
                    .from("listings")
                    .select("title")
                    .eq("id", listingId)
                    .single()
                ).data?.title ||
                "your listing";

              await sendStewardVerificationEmail({
                toEmail: newStewardEmail,
                displayName: newDisplayName,
                listingName,
                token: vToken,
                verificationPath: "declaration",
              });

              handoffPending = true;
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      handoff_pending: handoffPending,
    });
  } catch (err) {
    console.error("Steward save error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save." },
      { status: 500 }
    );
  }
}
