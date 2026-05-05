"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Seeder = {
  id: string;
  name: string | null;
  email: string;
  url_handle: string;
  referral_code: string | null;
  active: boolean;
  created_at: string;
  welcomed_at: string | null;
  orientation_completed_at: string | null;
};

type Props = {
  handle: string;
  seeders: Seeder[];
  placementCounts: Record<string, number>;
};

const orbs = [
  { left: "6%", top: "8%", size: 5, opacity: 0.6 },
  { left: "18%", top: "15%", size: 3, opacity: 0.45 },
  { left: "32%", top: "6%", size: 6, opacity: 0.65 },
  { left: "48%", top: "22%", size: 4, opacity: 0.5 },
  { left: "64%", top: "12%", size: 7, opacity: 0.7 },
  { left: "82%", top: "18%", size: 4, opacity: 0.55 },
  { left: "10%", top: "38%", size: 6, opacity: 0.65 },
  { left: "42%", top: "44%", size: 3, opacity: 0.4 },
  { left: "72%", top: "40%", size: 8, opacity: 0.7 },
  { left: "22%", top: "68%", size: 5, opacity: 0.55 },
  { left: "56%", top: "72%", size: 4, opacity: 0.5 },
  { left: "88%", top: "85%", size: 6, opacity: 0.6 },
];

export default function AdminClient({
  handle,
  seeders,
  placementCounts,
}: Props) {
  const router = useRouter();

  // ── Form state ──
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [urlHandle, setUrlHandle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // ── Per-row resend state ──
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [resendResult, setResendResult] = useState<Record<string, string>>({});

  const isFormReady =
    !submitting && !!name.trim() && !!email.trim() && !!urlHandle.trim();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(true);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedHandle = urlHandle.trim().toLowerCase();

    const res = await fetch("/api/admin/wrapper/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
        url_handle: trimmedHandle,
      }),
    });

    const data = await res.json();

    if (!res.ok && res.status !== 207) {
      setFormError(data.error || "Something went wrong.");
    } else if (res.status === 207) {
      setFormSuccess(
        "Seeder created, but welcome email failed. Use resend."
      );
    } else {
      setFormSuccess(`${trimmedName} is in. Welcome email on its way.`);
      setName("");
      setEmail("");
      setUrlHandle("");
    }

    setSubmitting(false);
    router.refresh();
  }

  async function handleResend(seederId: string) {
    setResendingId(seederId);

    const res = await fetch("/api/admin/wrapper/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seeder_id: seederId, force: true }),
    });

    const data = await res.json();

    if (res.ok) {
      setResendResult((prev) => ({ ...prev, [seederId]: "Sent!" }));
      setTimeout(() => {
        setResendResult((prev) => {
          const next = { ...prev };
          delete next[seederId];
          return next;
        });
      }, 5000);
    } else {
      setResendResult((prev) => ({
        ...prev,
        [seederId]: data.error || "Failed",
      }));
    }

    setResendingId(null);
    router.refresh();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(100,150,220,0.2)",
    background: "rgba(255,255,255,0.6)",
    color: "#0d2a4a",
    fontSize: "0.9rem",
    outline: "none",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#0d2a4a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Morning-sky atmosphere */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(180,210,255,0.9) 0%, rgba(120,170,230,0.85) 25%, rgba(70,120,200,0.9) 60%, rgba(30,70,150,1) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.18) 0%, transparent 58%)",
          pointerEvents: "none",
        }}
      />
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: "rgba(255,244,200,0.65)",
            opacity: orb.opacity,
            boxShadow:
              "0 0 8px 3px rgba(255,220,140,0.18), 0 0 20px 5px rgba(255,200,100,0.08)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 820,
          margin: "0 auto",
          padding: "clamp(44px, 7vw, 72px) 20px 72px",
        }}
      >
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.6)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(12px)",
            padding: "clamp(24px, 5vw, 40px)",
          }}
        >
          {/* ── Heading ── */}
          <h2
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
              lineHeight: 1.3,
              fontWeight: 650,
              color: "#8a6d2a",
              margin: "0 0 28px",
              textAlign: "center",
            }}
          >
            Seeder Admin
          </h2>

          {/* ── Creation form ── */}
          <form onSubmit={handleCreate}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Handle (lowercase, e.g. lucia)"
                value={urlHandle}
                onChange={(e) => setUrlHandle(e.target.value.toLowerCase())}
                style={{
                  ...inputStyle,
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!isFormReady}
              style={{
                width: "100%",
                padding: "12px 20px",
                borderRadius: 999,
                border: "none",
                background: "#FFD86B",
                color: "#1a2a0e",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: !isFormReady ? "not-allowed" : "pointer",
                opacity: !isFormReady ? 0.6 : 1,
                boxShadow:
                  "0 0 20px rgba(255,216,107,0.25), 0 4px 14px rgba(255,200,80,0.18)",
              }}
            >
              {submitting ? "Creating..." : "Create & Send Welcome"}
            </button>

            {formError && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#a04040",
                  textAlign: "center",
                  margin: "12px 0 0",
                }}
              >
                {formError}
              </p>
            )}
            {formSuccess && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#2a6a3a",
                  textAlign: "center",
                  margin: "12px 0 0",
                }}
              >
                {formSuccess}
              </p>
            )}
          </form>

          {/* ── Divider ── */}
          <div
            style={{
              height: 1,
              background: "rgba(100,150,220,0.15)",
              margin: "28px 0",
            }}
          />

          {/* ── Seeder list ── */}
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 650,
              color: "#8a6d2a",
              margin: "0 0 14px",
            }}
          >
            All seeders ({seeders.length})
          </h3>

          {seeders.length === 0 ? (
            <p
              style={{
                fontSize: "0.9rem",
                color: "#6b7c94",
                fontStyle: "italic",
                margin: 0,
              }}
            >
              No seeders yet.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {seeders.map((s) => {
                const count = placementCounts[s.id] || 0;
                const welcomed = s.welcomed_at
                  ? new Date(s.welcomed_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : null;
                const oriented = !!s.orientation_completed_at;
                const isResending = resendingId === s.id;
                const resendMsg = resendResult[s.id];

                return (
                  <div
                    key={s.id}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: "1px solid rgba(100,150,220,0.15)",
                      background: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {/* Row 1: Name + resend button + placement count */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          fontWeight: 650,
                          color: "#0d2a4a",
                          fontSize: "0.95rem",
                        }}
                      >
                        {s.name || "Unnamed"}
                      </div>

                      {/* Resend welcome button / result */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexShrink: 0,
                        }}
                      >
                        {resendMsg ? (
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color:
                                resendMsg === "Sent!"
                                  ? "#2a6a3a"
                                  : "#a04040",
                              fontWeight: 600,
                            }}
                          >
                            {resendMsg}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleResend(s.id)}
                            disabled={isResending}
                            style={{
                              padding: "4px 12px",
                              borderRadius: 999,
                              border: "1px solid rgba(138,109,42,0.2)",
                              background: "rgba(255,248,230,0.35)",
                              color: "rgba(138,109,42,0.7)",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: isResending
                                ? "not-allowed"
                                : "pointer",
                              opacity: isResending ? 0.5 : 1,
                            }}
                          >
                            {isResending ? "Sending..." : "Resend welcome"}
                          </button>
                        )}
                      </div>

                      {/* Placement count */}
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "#8a9ab0",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {count} placed
                      </div>
                    </div>

                    {/* Row 2: metadata */}
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#6b7c94",
                        marginTop: 4,
                      }}
                    >
                      {[
                        s.email,
                        `/${s.url_handle}`,
                        welcomed
                          ? `Welcomed ${welcomed}`
                          : "Not yet welcomed",
                      ].join(" \u00B7 ")}
                    </div>

                    {/* Row 3: orientation status */}
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: oriented
                          ? "rgba(42,106,58,0.7)"
                          : "rgba(107,124,148,0.6)",
                        marginTop: 2,
                      }}
                    >
                      Orientation:{" "}
                      {oriented ? "\u2713 complete" : "not yet"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Footer ── */}
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link
              href={`/${handle}`}
              style={{
                fontSize: 13,
                color: "rgba(107,124,148,0.6)",
                textDecoration: "none",
              }}
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
