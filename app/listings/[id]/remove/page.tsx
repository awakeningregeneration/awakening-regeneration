import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

/**
 * Soft removal arrival page at /listings/[id]/remove?token=xxx.
 *
 * Linked from Email 1 and Email 2 "Remove Listing" buttons.
 * Two-step flow: this page validates the token and shows a
 * confirmation form. The form POSTs to /listings/[id]/remove/confirm
 * which performs the actual write.
 */

export default async function RemovePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;

  // ── Validate token ──
  let errorState = false;

  if (!token) {
    errorState = true;
  }

  let listingTitle = "";

  if (!errorState) {
    const { data: listing } = await supabaseAdmin
      .from("listings")
      .select("title, removal_token, status")
      .eq("id", id)
      .single();

    if (
      !listing ||
      !listing.removal_token ||
      listing.removal_token !== token ||
      listing.status === "removed"
    ) {
      errorState = true;
    } else {
      listingTitle = listing.title || "your listing";
    }
  }

  // ── Error state ──
  if (errorState) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#08192d",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 20px",
        }}
      >
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 22,
              padding: "44px 36px",
              backdropFilter: "blur(8px)",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                fontWeight: 650,
                margin: "0 0 16px",
                color: "rgba(255,255,255,0.95)",
                lineHeight: 1.25,
              }}
            >
              This link is no longer valid.
            </h1>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "rgba(211,227,247,0.78)",
                margin: "0 0 28px",
              }}
            >
              The removal link may have expired or already been used. If
              you&apos;d like to remove your listing, please email{" "}
              <a
                href="mailto:info@canarycommons.org"
                style={{ color: "rgba(255,216,107,0.85)" }}
              >
                info@canarycommons.org
              </a>
              .
            </p>
            <a
              href="/"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.22)",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                background: "transparent",
              }}
            >
              Return to the map
            </a>
          </div>
        </div>
      </main>
    );
  }

  // ── Confirmation state ──
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#08192d",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
      }}
    >
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 22,
            padding: "44px 36px",
            backdropFilter: "blur(8px)",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
              fontWeight: 650,
              margin: "0 0 16px",
              color: "rgba(255,255,255,0.95)",
              lineHeight: 1.25,
            }}
          >
            Remove your listing
          </h1>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.82)",
              margin: "0 0 16px",
            }}
          >
            You&apos;ve asked to remove {listingTitle} from Canary Commons.
            We&apos;ll honor that. No explanation needed.
          </p>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.82)",
              margin: "0 0 28px",
            }}
          >
            Before we do — a small note. Removing your listing means it
            disappears from the map and we won&apos;t reach out again about
            it. You can always come back later if you change your mind, or
            write us at{" "}
            <a
              href="mailto:info@canarycommons.org"
              style={{ color: "rgba(255,216,107,0.85)" }}
            >
              info@canarycommons.org
            </a>
            .
          </p>

          <form
            method="POST"
            action={`/listings/${id}/remove/confirm`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <input type="hidden" name="token" value={token} />
            <button
              type="submit"
              style={{
                display: "inline-block",
                padding: "14px 28px",
                borderRadius: 999,
                background: "#FFD86B",
                color: "#1a2a0e",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
                boxShadow:
                  "0 0 28px rgba(255,216,107,0.3), 0 4px 14px rgba(255,200,80,0.2)",
              }}
            >
              Yes, remove this listing
            </button>
            <a
              href="/"
              style={{
                fontSize: "0.9rem",
                color: "rgba(148,196,236,0.7)",
                textDecoration: "none",
              }}
            >
              Actually, keep it listed
            </a>
          </form>
        </div>
      </div>
    </main>
  );
}
