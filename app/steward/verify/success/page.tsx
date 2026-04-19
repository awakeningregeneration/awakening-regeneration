"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listing_id");

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
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
        }}
      >
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
              margin: 0,
              marginBottom: 16,
              color: "rgba(255,255,255,0.97)",
              lineHeight: 1.2,
            }}
          >
            Welcome, steward.
          </h1>

          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.82)",
              margin: 0,
              marginBottom: 28,
            }}
          >
            Your stewardship has been confirmed. You can now tend this
            listing — keeping it current, responding to proposed edits,
            and helping this place stay visible on the commons.
          </p>

          <Link
            href={listingId ? `/map` : "/map"}
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
            Go to the map
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function StewardVerifySuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
