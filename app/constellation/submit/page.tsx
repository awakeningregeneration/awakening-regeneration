"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Topic = {
  id: string;
  slug: string;
  title: string;
  subheader: string;
};

// ── Atmosphere (blue gradient from original submit page) ──────────────────────

const orbs: { left: string; top: string; size: number; opacity: number }[] = [
  { left: "6%",  top: "8%",  size: 5, opacity: 0.6  },
  { left: "18%", top: "15%", size: 3, opacity: 0.45 },
  { left: "32%", top: "6%",  size: 6, opacity: 0.65 },
  { left: "48%", top: "22%", size: 4, opacity: 0.5  },
  { left: "64%", top: "12%", size: 7, opacity: 0.7  },
  { left: "82%", top: "18%", size: 4, opacity: 0.55 },
  { left: "10%", top: "38%", size: 6, opacity: 0.65 },
  { left: "42%", top: "44%", size: 3, opacity: 0.4  },
  { left: "72%", top: "40%", size: 8, opacity: 0.7  },
  { left: "22%", top: "68%", size: 5, opacity: 0.55 },
  { left: "56%", top: "72%", size: 4, opacity: 0.5  },
  { left: "88%", top: "85%", size: 6, opacity: 0.6  },
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
          aria-hidden="true"
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
    </>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 12,
  border: "1px solid rgba(100,150,220,0.25)",
  background: "rgba(255,255,255,0.9)",
  color: "#0d2a4a",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 600,
  color: "#0d2a4a",
  fontSize: "0.92rem",
};

const submitButtonStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 24px",
  borderRadius: 999,
  border: "none",
  background: "#FFD86B",
  color: "#1a2a0e",
  fontWeight: 700,
  fontSize: "1rem",
  boxShadow: "0 0 28px rgba(255,216,107,0.35), 0 4px 14px rgba(255,200,80,0.22)",
  cursor: "pointer",
};

// ── Inner component (uses useSearchParams) ────────────────────────────────────

function SubmitInner() {
  const searchParams = useSearchParams();
  const preselectedTopicId = searchParams.get("topic") ?? "";

  const [topics, setTopics] = useState<Topic[]>([]);

  // Link form state
  const [linkTopicId, setLinkTopicId] = useState(preselectedTopicId);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkSummary, setLinkSummary] = useState("");
  const [linkEmail, setLinkEmail] = useState("");
  const [linkStatus, setLinkStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [linkMessage, setLinkMessage] = useState("");

  // Topic form state
  const [topicName, setTopicName] = useState("");
  const [topicWhy, setTopicWhy] = useState("");
  const [topicLink, setTopicLink] = useState("");
  const [topicEmail, setTopicEmail] = useState("");
  const [topicStatus, setTopicStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [topicMessage, setTopicMessage] = useState("");

  useEffect(() => {
    fetch("/api/constellation")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTopics(data);
      })
      .catch(() => {});
  }, []);

  // Pre-select topic if query param matches a loaded topic
  useEffect(() => {
    if (preselectedTopicId && topics.some((t) => t.id === preselectedTopicId)) {
      setLinkTopicId(preselectedTopicId);
    }
  }, [preselectedTopicId, topics]);

  async function handleLinkSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLinkStatus("submitting");
    setLinkMessage("");

    try {
      const res = await fetch("/api/constellation/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "link",
          topic_id: linkTopicId,
          url: linkUrl,
          title: linkTitle,
          summary: linkSummary,
          submitter_email: linkEmail || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      setLinkStatus("success");
      setLinkMessage("Thank you — your link has been submitted for review.");
      setLinkTopicId(preselectedTopicId);
      setLinkUrl("");
      setLinkTitle("");
      setLinkSummary("");
      setLinkEmail("");
    } catch (err) {
      setLinkStatus("error");
      setLinkMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  async function handleTopicSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTopicStatus("submitting");
    setTopicMessage("");

    try {
      const res = await fetch("/api/constellation/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "topic",
          suggested_topic_name: topicName,
          summary: topicWhy,
          url: topicLink || null,
          submitter_email: topicEmail || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      setTopicStatus("success");
      setTopicMessage("Thank you — your topic suggestion has been submitted for review.");
      setTopicName("");
      setTopicWhy("");
      setTopicLink("");
      setTopicEmail("");
    } catch (err) {
      setTopicStatus("error");
      setTopicMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const sectionCard: React.CSSProperties = {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.6)",
    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(12px)",
    padding: "clamp(24px, 4vw, 36px)",
  };

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        color: "#0d2a4a",
      }}
    >
      <Atmosphere />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 860,
          margin: "0 auto",
          padding: "clamp(44px, 7vw, 72px) 20px 90px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Page header */}
        <div style={{ maxWidth: 680, margin: "0 auto 40px" }}>
          <div
            style={{
              fontSize: "0.82rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              marginBottom: 14,
            }}
          >
            Canary Commons
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              lineHeight: 1.08,
              margin: "0 0 16px",
              color: "rgba(255,255,255,0.96)",
              fontWeight: 650,
            }}
          >
            Contribute to the Constellation
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            Add a link to an existing topic, or suggest a new one. All
            submissions are reviewed before going live.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* ── Section 1: Add a link ─────────────────────────────────────── */}
          <section style={sectionCard}>
            <h2
              style={{
                margin: "0 0 6px",
                fontSize: 22,
                color: "#0d2a4a",
                fontWeight: 650,
              }}
            >
              Add a link
            </h2>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: 15,
                lineHeight: 1.65,
                color: "#3a5a7a",
              }}
            >
              Found something that belongs under an existing topic? Share it
              here.
            </p>

            <form onSubmit={handleLinkSubmit} style={{ display: "grid", gap: 18 }}>
              <div>
                <label htmlFor="link-topic" style={labelStyle}>
                  Topic
                </label>
                <select
                  id="link-topic"
                  value={linkTopicId}
                  onChange={(e) => setLinkTopicId(e.target.value)}
                  required
                  style={{
                    ...inputStyle,
                    appearance: "none",
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230d2a4a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    paddingRight: 40,
                  }}
                >
                  <option value="">Select a topic…</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="link-url" style={labelStyle}>
                  URL
                </label>
                <input
                  id="link-url"
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  required
                  placeholder="https://…"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="link-title" style={labelStyle}>
                  Title
                </label>
                <input
                  id="link-title"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  required
                  placeholder="Name of the project, article, or initiative"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="link-summary" style={labelStyle}>
                  Summary
                </label>
                <textarea
                  id="link-summary"
                  value={linkSummary}
                  onChange={(e) => setLinkSummary(e.target.value)}
                  required
                  rows={4}
                  placeholder="What is this, and why does it matter here?"
                  style={{ ...inputStyle, resize: "vertical", minHeight: 110 }}
                />
              </div>

              <div>
                <label htmlFor="link-email" style={labelStyle}>
                  Your email{" "}
                  <span style={{ fontWeight: 400, color: "#5a7a9a" }}>
                    (optional)
                  </span>
                </label>
                <input
                  id="link-email"
                  type="email"
                  value={linkEmail}
                  onChange={(e) => setLinkEmail(e.target.value)}
                  placeholder="In case we have questions"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <button
                  type="submit"
                  disabled={linkStatus === "submitting"}
                  style={{
                    ...submitButtonStyle,
                    opacity: linkStatus === "submitting" ? 0.7 : 1,
                    cursor: linkStatus === "submitting" ? "default" : "pointer",
                  }}
                >
                  {linkStatus === "submitting" ? "Submitting…" : "Submit link"}
                </button>

                <Link
                  href="/constellation"
                  style={{
                    color: "#0d2a4a",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    fontWeight: 500,
                    fontSize: "0.92rem",
                  }}
                >
                  Back to constellation
                </Link>
              </div>

              {linkMessage && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: linkStatus === "error" ? "#9b2222" : "#2a6b3c",
                  }}
                >
                  {linkMessage}
                </p>
              )}
            </form>
          </section>

          {/* ── Divider ───────────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.4)" }} />
            <span
              style={{
                fontSize: "0.82rem",
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              or
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.4)" }} />
          </div>

          {/* ── Section 2: Suggest a topic ────────────────────────────────── */}
          <section style={sectionCard}>
            <h2
              style={{
                margin: "0 0 6px",
                fontSize: 22,
                color: "#0d2a4a",
                fontWeight: 650,
              }}
            >
              Suggest a new topic
            </h2>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: 15,
                lineHeight: 1.65,
                color: "#3a5a7a",
              }}
            >
              Is there a challenge that deserves its own constellation? Tell us
              about it.
            </p>

            <form onSubmit={handleTopicSubmit} style={{ display: "grid", gap: 18 }}>
              <div>
                <label htmlFor="topic-name" style={labelStyle}>
                  Topic name
                </label>
                <input
                  id="topic-name"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  required
                  placeholder="e.g. Wildfire Resilience, Soil Carbon, Community Housing"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="topic-why" style={labelStyle}>
                  Why it matters
                </label>
                <textarea
                  id="topic-why"
                  value={topicWhy}
                  onChange={(e) => setTopicWhy(e.target.value)}
                  required
                  rows={5}
                  placeholder="What is the challenge, and what kinds of solutions exist around the world?"
                  style={{ ...inputStyle, resize: "vertical", minHeight: 130 }}
                />
              </div>

              <div>
                <label htmlFor="topic-link" style={labelStyle}>
                  Supporting link{" "}
                  <span style={{ fontWeight: 400, color: "#5a7a9a" }}>
                    (optional)
                  </span>
                </label>
                <input
                  id="topic-link"
                  type="url"
                  value={topicLink}
                  onChange={(e) => setTopicLink(e.target.value)}
                  placeholder="A URL that illustrates the topic well"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="topic-email" style={labelStyle}>
                  Your email{" "}
                  <span style={{ fontWeight: 400, color: "#5a7a9a" }}>
                    (optional)
                  </span>
                </label>
                <input
                  id="topic-email"
                  type="email"
                  value={topicEmail}
                  onChange={(e) => setTopicEmail(e.target.value)}
                  placeholder="In case we have questions"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <button
                  type="submit"
                  disabled={topicStatus === "submitting"}
                  style={{
                    ...submitButtonStyle,
                    opacity: topicStatus === "submitting" ? 0.7 : 1,
                    cursor: topicStatus === "submitting" ? "default" : "pointer",
                  }}
                >
                  {topicStatus === "submitting" ? "Submitting…" : "Suggest topic"}
                </button>

                <Link
                  href="/constellation"
                  style={{
                    color: "#0d2a4a",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    fontWeight: 500,
                    fontSize: "0.92rem",
                  }}
                >
                  Back to constellation
                </Link>
              </div>

              {topicMessage && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: topicStatus === "error" ? "#9b2222" : "#2a6b3c",
                  }}
                >
                  {topicMessage}
                </p>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

// ── Page export (Suspense wrapper required for useSearchParams) ───────────────

export default function ConstellationSubmitPage() {
  return (
    <Suspense>
      <SubmitInner />
    </Suspense>
  );
}
