"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const MESSAGES: Record<string, { heading: string; body: string }> = {
  expired: {
    heading: "This link has expired.",
    body: "Edit links are valid for 30 minutes. You can request a new one from the listing's edit page.",
  },
  invalid_token: {
    heading: "We couldn't find this edit session.",
    body: "The link may have been copied incorrectly. You can request a new one from the listing's edit page.",
  },
  already_used: {
    heading: "This link has already been used.",
    body: "Each edit link can only be used once. You can request a new one from the listing's edit page.",
  },
  missing_token: {
    heading: "Something went wrong.",
    body: "The edit link appears to be incomplete. Try clicking it again from your email.",
  },
  error: {
    heading: "Something unexpected happened.",
    body: "Please try again in a few minutes.",
  },
};

function FailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "error";
  const msg = MESSAGES[reason] || MESSAGES.error;

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
              margin: 0,
              marginBottom: 16,
              color: "rgba(255,255,255,0.95)",
            }}
          >
            {msg.heading}
          </h1>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.78)",
              margin: 0,
              marginBottom: 28,
            }}
          >
            {msg.body}
          </p>
          <Link
            href="/map"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.22)",
              color: "rgba(255,255,255,0.9)",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            Return to the map
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function EditSessionFailedPage() {
  return (
    <Suspense>
      <FailedContent />
    </Suspense>
  );
}
