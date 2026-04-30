"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

/**
 * Seeder login page at /[handle]/login.
 * Public — no auth required.
 * Sends a magic-link email via POST /api/seeder/login-request.
 */

export default function SeederLoginPage() {
  const params = useParams<{ handle: string }>();
  const handle = params.handle;

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    try {
      await fetch("/api/seeder/login-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), handle }),
      });
    } catch {
      // Silently handle — generic success message regardless
    }
    setSubmitted(true);
    setSubmitting(false);
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
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        <img
          src="/canary-commons-logo.png"
          alt="Canary Commons"
          style={{
            width: "clamp(180px, 30vw, 260px)",
            height: "auto",
            display: "block",
            margin: "0 auto 32px",
            filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.3))",
          }}
        />

        {submitted ? (
          <div>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "rgba(211,227,247,0.85)",
                marginBottom: 24,
              }}
            >
              If this email is registered as a seeder for this page, a login
              link has been sent. Check your inbox.
            </p>
            <p
              style={{
                fontSize: 13,
                color: "rgba(148,196,236,0.6)",
              }}
            >
              The link is valid for 30 minutes and can only be used once.
            </p>
          </div>
        ) : (
          <>
            <h1
              style={{
                fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                fontWeight: 650,
                margin: "0 0 8px",
                color: "rgba(255,255,255,0.95)",
              }}
            >
              Seeder Login
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "rgba(148,196,236,0.7)",
                margin: "0 0 28px",
              }}
            >
              Enter your email to receive a login link.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  fontSize: 16,
                  outline: "none",
                  marginBottom: 14,
                }}
              />
              <button
                type="submit"
                disabled={submitting || !email.trim()}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: 999,
                  border: "none",
                  background: "#FFD86B",
                  color: "#08192d",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor:
                    submitting || !email.trim() ? "not-allowed" : "pointer",
                  opacity: submitting || !email.trim() ? 0.6 : 1,
                  boxShadow:
                    "0 0 24px rgba(255,216,107,0.25), 0 4px 14px rgba(255,200,80,0.18)",
                }}
              >
                {submitting ? "Sending..." : "Send Login Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
