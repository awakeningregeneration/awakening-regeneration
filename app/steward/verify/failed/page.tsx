"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const MESSAGES: Record<string, { heading: string; body: string }> = {
  expired: {
    heading: "This link has expired.",
    body: "Verification links are valid for 72 hours. Tap below to get a fresh confirmation link sent to the email you used to claim.",
  },
  invalid_token: {
    heading: "We couldn\u2019t find this verification.",
    body: "The link may have been copied incorrectly, or the claim may no longer exist. You can visit the map and look for the listing to try again.",
  },
  already_processed: {
    heading: "This stewardship has already been confirmed.",
    body: "It looks like this verification was already completed. If you\u2019re the steward, your listing should already reflect that on the map.",
  },
  missing_token: {
    heading: "Something went wrong.",
    body: "The verification link appears to be incomplete. If you received this link by email, try clicking it again or copying the full URL.",
  },
  error: {
    heading: "Something unexpected happened.",
    body: "We ran into a problem processing your verification. Please try again in a few minutes, or reach out to us if this keeps happening.",
  },
};

const DEFAULT_MESSAGE = MESSAGES.error;

function FailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "error";
  const token = searchParams.get("token") || null;
  const msg = MESSAGES[reason] || DEFAULT_MESSAGE;
  const isExpired = reason === "expired" && token;

  const [resendState, setResendState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleResend() {
    if (!token) return;
    setResendState("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/steward/reverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        setResendState("sent");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(
          data.error || "Something went wrong. Please try again."
        );
        setResendState("error");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setResendState("error");
    }
  }

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
              lineHeight: 1.25,
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

          {isExpired && resendState === "idle" && (
            <button
              onClick={handleResend}
              style={{
                display: "inline-block",
                padding: "14px 28px",
                borderRadius: 999,
                background: "#FFD86B",
                color: "#1a2a0e",
                fontWeight: 700,
                fontSize: "0.95rem",
                border: "none",
                cursor: "pointer",
                marginBottom: 16,
              }}
            >
              Resend confirmation link
            </button>
          )}

          {isExpired && resendState === "sending" && (
            <p
              style={{
                fontSize: "0.95rem",
                color: "rgba(211,227,247,0.78)",
                margin: "0 0 16px",
              }}
            >
              Sending&hellip;
            </p>
          )}

          {isExpired && resendState === "sent" && (
            <p
              style={{
                fontSize: "1rem",
                color: "#FFD86B",
                fontWeight: 600,
                margin: "0 0 16px",
              }}
            >
              A new confirmation link has been sent to your email.
            </p>
          )}

          {isExpired && resendState === "error" && (
            <div style={{ marginBottom: 16 }}>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#ff9b9b",
                  margin: "0 0 12px",
                }}
              >
                {errorMsg}
              </p>
              <button
                onClick={handleResend}
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  borderRadius: 999,
                  background: "#FFD86B",
                  color: "#1a2a0e",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
            </div>
          )}

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
              background: "transparent",
            }}
          >
            Return to the map
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function StewardVerifyFailedPage() {
  return (
    <Suspense>
      <FailedContent />
    </Suspense>
  );
}
