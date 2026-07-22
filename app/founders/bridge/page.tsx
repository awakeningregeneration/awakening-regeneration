"use client";

import { useState } from "react";
import Link from "next/link";

const RANGES = [
  { value: "500-1000", label: "$500 – $1,000" },
  { value: "1000-5000", label: "$1,000 – $5,000" },
  { value: "5000+", label: "$5,000+" },
];

const orbs: { left: string; top: string; size: number; opacity: number }[] = [
  { left: "6%", top: "4%", size: 6, opacity: 0.7 },
  { left: "18%", top: "10%", size: 10, opacity: 0.68 },
  { left: "40%", top: "12%", size: 14, opacity: 0.45 },
  { left: "63%", top: "11%", size: 11, opacity: 0.62 },
  { left: "88%", top: "9%", size: 16, opacity: 0.45 },
  { left: "15%", top: "32%", size: 5, opacity: 0.65 },
  { left: "52%", top: "36%", size: 7, opacity: 0.68 },
  { left: "80%", top: "28%", size: 6, opacity: 0.55 },
];

function Atmosphere() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(26,72,130,0.32) 0%, rgba(5,16,31,1) 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(circle at 18% 14%, rgba(40,90,160,0.18) 0%, transparent 38%), radial-gradient(circle at 82% 12%, rgba(40,90,160,0.14) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {orbs.map((orb, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(${orb.left} - ${orb.size}px)`,
              top: `calc(${orb.top} - ${orb.size}px)`,
              width: orb.size * 3,
              height: orb.size * 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,220,140,${
                orb.opacity * 0.12
              }) 0%, transparent 70%)`,
            }}
          >
            <div
              style={{
                width: orb.size,
                height: orb.size,
                borderRadius: "50%",
                background: "rgba(255,240,190,0.72)",
                opacity: orb.opacity,
                boxShadow: `0 0 ${orb.size * 1.7}px ${
                  orb.size * 0.4
                }px rgba(255,220,140,0.18), 0 0 ${orb.size * 4.2}px ${
                  orb.size * 0.9
                }px rgba(255,200,100,0.06)`,
                filter: `blur(${orb.size * 0.15}px)`,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

const glassCard: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.09)",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(8px)",
  padding: "26px 28px",
  marginBottom: 16,
};

const softBody: React.CSSProperties = {
  fontSize: "1.02rem",
  lineHeight: 1.78,
  color: "rgba(224,238,255,0.92)",
  margin: 0,
  marginBottom: 16,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  fontSize: "0.98rem",
  outline: "none",
  marginBottom: 14,
};

export default function BridgePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [giftRange, setGiftRange] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = name.trim() && email.trim() && giftRange;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setErrorMessage("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          giftRange,
          message: message.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#08192d",
        color: "white",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(44px, 7vw, 72px) 20px 72px",
      }}
    >
      <Atmosphere />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            lineHeight: 1.18,
            fontWeight: 650,
            margin: 0,
            marginBottom: 28,
            color: "#FFD86B",
            textAlign: "center",
            textShadow:
              "0 0 32px rgba(255,216,107,0.3), 0 0 64px rgba(255,200,80,0.12)",
          }}
        >
          Bridge the Commons
        </h1>

        {submitted ? (
          <div style={glassCard}>
            <p
              style={{
                ...softBody,
                textAlign: "center",
                fontSize: "1.1rem",
                marginBottom: 20,
              }}
            >
              Thank you — Ren will be in touch personally.
            </p>
            <p
              style={{
                ...softBody,
                textAlign: "center",
                fontSize: "0.92rem",
                color: "rgba(190,210,235,0.72)",
                marginBottom: 0,
              }}
            >
              Your inquiry has been received. You can expect a personal
              response soon.
            </p>
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Link
                href="/founders/join"
                style={{
                  color: "rgba(190,210,235,0.72)",
                  fontSize: "0.88rem",
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                }}
              >
                ← Back to Steward the Commons
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div style={glassCard}>
              <p style={softBody}>
                If you would like to support the commons in a larger way,
                this is a personal path. No payment processor, no
                transaction fees — just a direct conversation with Ren about
                how your gift can help reveal the living commons.
              </p>
              <p style={{ ...softBody, marginBottom: 0 }}>
                Share a little about yourself and what you have in mind, and
                Ren will follow up with you directly.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={glassCard}>
                {/* Gift range */}
                <label
                  style={{
                    display: "block",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "rgba(224,238,255,0.82)",
                    marginBottom: 10,
                  }}
                >
                  Gift range
                </label>
                <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
                  {RANGES.map((range) => {
                    const isSelected = giftRange === range.value;
                    return (
                      <button
                        key={range.value}
                        type="button"
                        onClick={() =>
                          setGiftRange(isSelected ? null : range.value)
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "14px 18px",
                          borderRadius: 14,
                          border: isSelected
                            ? "1.5px solid rgba(255,216,107,0.55)"
                            : "1px solid rgba(255,255,255,0.10)",
                          background: isSelected
                            ? "rgba(255,216,107,0.08)"
                            : "rgba(255,255,255,0.03)",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s ease",
                          color: "inherit",
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: isSelected
                              ? "5px solid #FFD86B"
                              : "2px solid rgba(255,255,255,0.25)",
                            flexShrink: 0,
                          }}
                        />
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "0.98rem",
                            color: isSelected
                              ? "#FFE8A0"
                              : "rgba(255,255,255,0.92)",
                          }}
                        >
                          {range.label}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Name */}
                <label
                  style={{
                    display: "block",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "rgba(224,238,255,0.82)",
                    marginBottom: 6,
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  style={inputStyle}
                />

                {/* Email */}
                <label
                  style={{
                    display: "block",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "rgba(224,238,255,0.82)",
                    marginBottom: 6,
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={inputStyle}
                />

                {/* Message */}
                <label
                  style={{
                    display: "block",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "rgba(224,238,255,0.82)",
                    marginBottom: 6,
                  }}
                >
                  Message{" "}
                  <span
                    style={{
                      fontWeight: 400,
                      color: "rgba(190,210,235,0.6)",
                    }}
                  >
                    (optional)
                  </span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Anything you'd like to share about your gift or how you'd like it directed"
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: 90,
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !canSubmit}
                style={{
                  display: "block",
                  textAlign: "center",
                  width: "100%",
                  padding: "16px 24px",
                  borderRadius: 999,
                  background:
                    !canSubmit ? "rgba(255,216,107,0.25)" : "#FFD86B",
                  color:
                    !canSubmit ? "rgba(26,42,14,0.5)" : "#1a2a0e",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  border: "none",
                  cursor:
                    submitting || !canSubmit ? "not-allowed" : "pointer",
                  boxShadow:
                    !canSubmit
                      ? "none"
                      : "0 0 32px rgba(255,216,107,0.20)",
                  opacity: submitting ? 0.8 : 1,
                  transition:
                    "opacity 0.15s ease, background 0.15s ease",
                }}
              >
                {submitting ? "Sending..." : "Send inquiry"}
              </button>

              {errorMessage && (
                <p
                  style={{
                    marginTop: 12,
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
                    color: "rgba(255,160,140,0.9)",
                    textAlign: "center",
                  }}
                >
                  {errorMessage}
                </p>
              )}
            </form>

            <p
              style={{
                marginTop: 28,
                fontSize: "0.82rem",
                textAlign: "center",
                color: "rgba(159,184,216,0.52)",
              }}
            >
              <Link
                href="/founders/join"
                style={{
                  color: "rgba(159,184,216,0.52)",
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                }}
              >
                ← Back to Steward the Commons
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
