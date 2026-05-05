import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

/**
 * Removal confirmation page at /listings/[id]/remove/done.
 *
 * Shown after a successful soft removal. The listing still exists
 * in the database (status='removed') so we can display its name.
 */

export default async function RemoveDonePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: listing } = await supabaseAdmin
    .from("listings")
    .select("title")
    .eq("id", id)
    .single();

  const listingTitle = listing?.title || "Your listing";

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
            border: "1px solid rgba(255,216,107,0.25)",
            borderRadius: 22,
            padding: "44px 36px",
            backdropFilter: "blur(8px)",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              fontWeight: 650,
              margin: "0 0 16px",
              color: "rgba(255,255,255,0.97)",
              lineHeight: 1.2,
            }}
          >
            It&apos;s done.
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.82)",
              margin: "0 0 16px",
            }}
          >
            {listingTitle} has been removed from Canary Commons. Thank you for
            letting us know.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.82)",
              margin: "0 0 28px",
            }}
          >
            If anything changes, or if you ever want to be findable here again,
            you can submit a new listing at{" "}
            <a
              href="/submit"
              style={{ color: "rgba(255,216,107,0.85)" }}
            >
              canarycommons.org/submit
            </a>
            , or write us at{" "}
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
              padding: "14px 28px",
              borderRadius: 999,
              background: "#FFD86B",
              color: "#1a2a0e",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              boxShadow:
                "0 0 28px rgba(255,216,107,0.3), 0 4px 14px rgba(255,200,80,0.2)",
            }}
          >
            Return to the map
          </a>
        </div>
      </div>
    </main>
  );
}
