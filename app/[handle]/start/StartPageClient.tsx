"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Modal from "./Modal";
import { Email1Recognition, Email2Visibility, Email3Stewardship } from "./EmailModals";

type Props = {
  markdown: string;
  handle: string;
  seederName: string;
  orientationCompletedAt: string | null;
  referralCode: string | null;
};

// Morning-sky orbs (same as /contributor/submit)
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.canarycommons.org";

export default function StartPageClient({
  markdown,
  handle,
  seederName,
  orientationCompletedAt,
  referralCode,
}: Props) {
  const router = useRouter();
  const alreadyCompleted = !!orientationCompletedAt;

  const [checkboxChecked, setCheckboxChecked] = useState(alreadyCompleted);
  const [email1Opened, setEmail1Opened] = useState(alreadyCompleted);
  const [email2Opened, setEmail2Opened] = useState(alreadyCompleted);
  const [email3Opened, setEmail3Opened] = useState(alreadyCompleted);
  const [currentModal, setCurrentModal] = useState<1 | 2 | 3 | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const openModal = useCallback((n: 1 | 2 | 3) => {
    setCurrentModal(n);
    if (n === 1) setEmail1Opened(true);
    if (n === 2) setEmail2Opened(true);
    if (n === 3) setEmail3Opened(true);
  }, []);

  const canBegin = checkboxChecked && email1Opened && email2Opened && email3Opened;

  async function handleBegin() {
    if (!canBegin || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/seeder/complete-orientation", {
        method: "POST",
      });
      if (res.ok) {
        router.push(`/${handle}`);
      } else {
        const data = await res.json().catch(() => null);
        setSubmitError(data?.error || "Something went wrong.");
      }
    } catch {
      setSubmitError("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCopyLink() {
    const url = `${siteUrl}/${handle}/join`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Track which section we're in for custom rendering
  let currentSection = "";

  // Strip the completion UI from the markdown (rendered as React instead)
  const cleanedMarkdown = markdown
    .replace(/`☐ I've read this[^`]*`/, "")
    .replace(/`\[ Begin → \]`/, "")
    .replace(/\*Welcome\.\*/, "");

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
          maxWidth: 640,
          margin: "0 auto",
          padding: "clamp(44px, 7vw, 72px) 20px 72px",
        }}
      >
        {/* Glass container */}
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.6)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(12px)",
            padding: "clamp(24px, 5vw, 40px)",
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1
                  style={{
                    fontSize: "clamp(1.7rem, 3.5vw, 2.2rem)",
                    lineHeight: 1.18,
                    margin: 0,
                    marginBottom: 4,
                    fontWeight: 650,
                    color: "#0d2a4a",
                    textAlign: "center",
                  }}
                >
                  {children}
                </h1>
              ),

              h2: ({ children }) => {
                const text = String(children);
                currentSection = text;

                return (
                  <h2
                    style={{
                      fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                      lineHeight: 1.3,
                      fontWeight: 650,
                      color: "#8a6d2a",
                      margin: "36px 0 16px",
                    }}
                  >
                    {children}
                  </h2>
                );
              },

              h3: ({ children }) => (
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 650,
                    color: "#0d2a4a",
                    margin: "24px 0 10px",
                  }}
                >
                  {children}
                </h3>
              ),

              p: ({ children }) => {
                const text = String(children);

                // Kicker: "Seeder Orientation"
                if (text === "Seeder Orientation") {
                  return (
                    <p
                      style={{
                        fontSize: "0.85rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#8a6d2a",
                        margin: "0 0 28px",
                        textAlign: "center",
                      }}
                    >
                      {children}
                    </p>
                  );
                }

                // "Courage forward" and "May we all grow lighter"
                if (
                  text.includes("Courage forward") ||
                  text.includes("May we all grow lighter")
                ) {
                  return (
                    <p
                      style={{
                        fontSize: "1.1rem",
                        textAlign: "center",
                        color: "#3a5a7a",
                        margin: "20px 0",
                        fontStyle: "italic",
                        lineHeight: 1.6,
                      }}
                    >
                      {children}
                    </p>
                  );
                }

                // Signature "— Ren"
                if (text.startsWith("— Ren")) {
                  return (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#3a5a7a",
                        fontWeight: 600,
                        margin: "16px 0 0",
                      }}
                    >
                      {children}
                    </p>
                  );
                }

                // "A note before you begin" section body
                if (currentSection === "A note before you begin") {
                  return (
                    <p
                      style={{
                        fontSize: "0.98rem",
                        lineHeight: 1.7,
                        color: "#3a5a7a",
                        margin: "0 0 14px",
                        fontStyle: "italic",
                      }}
                    >
                      {children}
                    </p>
                  );
                }

                // Default paragraph
                return (
                  <p
                    style={{
                      fontSize: "0.98rem",
                      lineHeight: 1.7,
                      color: "#2a3a4a",
                      margin: "0 0 14px",
                    }}
                  >
                    {children}
                  </p>
                );
              },

              em: ({ children }) => (
                <em style={{ fontStyle: "italic", color: "#3a5a7a" }}>
                  {children}
                </em>
              ),

              strong: ({ children }) => (
                <strong style={{ fontWeight: 650, color: "#0d2a4a" }}>
                  {children}
                </strong>
              ),

              hr: () => {
                if (currentSection === "A note before you begin") {
                  return <div style={{ margin: "32px 0" }} />;
                }
                return (
                  <div
                    style={{
                      height: 1,
                      background:
                        "linear-gradient(to right, transparent, rgba(138,109,42,0.2), transparent)",
                      margin: "36px 0",
                    }}
                  />
                );
              },

              ul: ({ children }) => (
                <ul
                  style={{
                    margin: "0 0 14px",
                    paddingLeft: 20,
                    lineHeight: 1.7,
                    color: "#2a3a4a",
                    fontSize: "0.98rem",
                  }}
                >
                  {children}
                </ul>
              ),

              li: ({ children }) => (
                <li style={{ marginBottom: 6 }}>{children}</li>
              ),

              code: ({ children }) => {
                const text = String(children);

                // Checkbox — handled by React below
                if (text.startsWith("☐")) return null;
                // Begin button — handled by React below
                if (text.startsWith("[ Begin")) return null;

                // Direct invitation link: copy-on-click
                if (text.includes("/join")) {
                  const url = `${siteUrl}/${handle}/join`;
                  return (
                    <button
                      onClick={handleCopyLink}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "1px solid rgba(138,109,42,0.3)",
                        background: "rgba(255,248,230,0.5)",
                        color: "#8a6d2a",
                        fontSize: "0.92rem",
                        fontWeight: 600,
                        fontFamily: "monospace",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.15s",
                        marginBottom: 14,
                      }}
                    >
                      {copied ? "✓ Copied!" : url}
                    </button>
                  );
                }

                // Default inline code
                return (
                  <code
                    style={{
                      background: "rgba(138,109,42,0.08)",
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontSize: "0.9em",
                    }}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {cleanedMarkdown}
          </ReactMarkdown>

          {/* ── Email modal triggers ── */}
          <div style={{ margin: "24px 0 32px" }}>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#8a6d2a",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Preview the three outreach emails
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { n: 1 as const, label: "Email 1: Recognition", opened: email1Opened },
                { n: 2 as const, label: "Email 2: Visibility", opened: email2Opened },
                { n: 3 as const, label: "Email 3: Stewardship", opened: email3Opened },
              ].map(({ n, label, opened }) => (
                <button
                  key={n}
                  onClick={() => openModal(n)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "11px 16px",
                    borderRadius: 12,
                    border: "1px solid rgba(138,109,42,0.25)",
                    background: opened
                      ? "rgba(255,248,230,0.4)"
                      : "rgba(255,255,255,0.5)",
                    color: "#8a6d2a",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: opened
                        ? "#8a6d2a"
                        : "rgba(138,109,42,0.2)",
                      flexShrink: 0,
                      transition: "background 0.2s",
                    }}
                  />
                  {label}
                  {opened && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "0.8rem",
                        color: "rgba(138,109,42,0.5)",
                      }}
                    >
                      read
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Completion area ── */}
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(138,109,42,0.2), transparent)",
              margin: "20px 0 28px",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                cursor: "pointer",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                color: "#2a3a4a",
                textAlign: "left",
                marginBottom: 20,
              }}
            >
              <input
                type="checkbox"
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
                style={{
                  width: 18,
                  height: 18,
                  marginTop: 2,
                  accentColor: "#8a6d2a",
                  flexShrink: 0,
                }}
              />
              I&apos;ve read this, and I&apos;m ready to begin placing
              lights with care.
            </label>

            {!canBegin && checkboxChecked && (
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "#8a6d2a",
                  marginBottom: 12,
                  fontStyle: "italic",
                }}
              >
                Open and read each of the three email previews above to
                continue.
              </p>
            )}

            {submitError && (
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#b42318",
                  marginBottom: 12,
                }}
              >
                {submitError}
              </p>
            )}

            <button
              onClick={handleBegin}
              disabled={!canBegin || isSubmitting}
              style={{
                padding: "14px 32px",
                borderRadius: 999,
                border: "none",
                background: canBegin ? "#FFD86B" : "rgba(255,216,107,0.35)",
                color: canBegin ? "#1a2a0e" : "rgba(26,42,14,0.4)",
                fontWeight: 700,
                fontSize: "1.05rem",
                cursor: canBegin && !isSubmitting ? "pointer" : "not-allowed",
                boxShadow: canBegin
                  ? "0 0 24px rgba(255,216,107,0.3), 0 4px 14px rgba(255,200,80,0.18)"
                  : "none",
                transition: "all 0.2s",
              }}
            >
              {isSubmitting
                ? "Saving..."
                : alreadyCompleted
                ? "Continue to Dashboard →"
                : "Begin →"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <Modal
        isOpen={currentModal === 1}
        onClose={() => setCurrentModal(null)}
        title="Email 1 — Recognition + Claim"
      >
        <Email1Recognition />
      </Modal>
      <Modal
        isOpen={currentModal === 2}
        onClose={() => setCurrentModal(null)}
        title="Email 2 — Visibility + Story"
      >
        <Email2Visibility />
      </Modal>
      <Modal
        isOpen={currentModal === 3}
        onClose={() => setCurrentModal(null)}
        title="Email 3 — Stewardship + Support"
      >
        <Email3Stewardship />
      </Modal>
    </main>
  );
}
