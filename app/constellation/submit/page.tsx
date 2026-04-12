"use client";

import Link from "next/link";
import { useState } from "react";

const PRIMARY_CATEGORIES = [
  "Land & Food",
  "Water & Flow",
  "Energy & Infrastructure",
  "Air & Atmosphere",
  "Community & Care",
];

const PRACTICES = [
  "Organic",
  "Regenerative",
  "Permaculture",
  "Fair Trade",
  "Biodegradable",
  "Compostable",
  "Recycled Materials",
  "Upcycled Materials",
  "Low Waste",
  "Zero Waste",
  "Local",
  "Worker-Owned / Cooperative",
  "Community Owned",
  "Renewable Energy",
  "Educational",
  "Accessible / Sliding Scale",
  "Volunteer Run",
  "Nonprofit / Mission Driven",
  "Indigenous Led",
  "Women Led",
];

const orbs: { left: string; top: string; size: number; opacity: number }[] = [
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

export default function ConstellationSubmitPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [practices, setPractices] = useState<string[]>([]);
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function togglePractice(practice: string) {
    setPractices((prev) =>
      prev.includes(practice)
        ? prev.filter((item) => item !== practice)
        : [...prev, practice]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/constellation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          region,
          category,
          practices,
          link,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setStatus("success");
      setMessage("Another signal has become visible.");
      setTitle("");
      setDescription("");
      setRegion("");
      setCategory("");
      setPractices([]);
      setLink("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 8,
    fontWeight: 600,
    color: "#0d2a4a",
    fontSize: "0.92rem",
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
          maxWidth: 980,
          margin: "0 auto",
          padding: "clamp(44px, 7vw, 72px) 20px 90px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto 36px",
          }}
        >
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
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              lineHeight: 1.05,
              margin: "0 0 16px",
              color: "rgba(255,255,255,0.96)",
              fontWeight: 650,
            }}
          >
            Submit to the Constellation
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 18,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Share a signal from the larger world — a project, place, effort, or
            emergence that helps people remember another future is already being built.
          </p>
        </div>

        <section
          style={{
            maxWidth: 860,
            margin: "0 auto",
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.6)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(12px)",
            padding: "clamp(24px, 4vw, 36px)",
          }}
        >
          <div style={{ marginBottom: 22 }}>
            <h2
              style={{
                margin: "0 0 10px",
                fontSize: 26,
                color: "#0d2a4a",
                fontWeight: 650,
              }}
            >
              What belongs here
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: "#3a5a7a",
              }}
            >
              The Constellation gathers non-local signals of life-forward change from
              around the world. These are outward-facing reminders that this work is
              rising everywhere.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
            <div>
              <label htmlFor="title" style={labelStyle}>
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Floating Wind Farms — Norway"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="description" style={labelStyle}>
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                placeholder="A short description of what this signal is and why it matters."
                style={{ ...inputStyle, resize: "vertical", minHeight: 130 }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gap: 18,
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              }}
            >
              <div>
                <label htmlFor="region" style={labelStyle}>
                  Region
                </label>
                <input
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                  placeholder="Norway, Europe, Global"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="category" style={labelStyle}>
                  Primary Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  style={{ ...inputStyle, appearance: "none" }}
                >
                  <option value="">Select a category</option>
                  {PRIMARY_CATEGORIES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div style={labelStyle}>Practices / Values</div>

              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: "#3a5a7a",
                  marginBottom: 12,
                  fontStyle: "italic",
                }}
              >
                Mark all that apply.
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {PRACTICES.map((practice) => {
                  const selected = practices.includes(practice);

                  return (
                    <button
                      key={practice}
                      type="button"
                      onClick={() => togglePractice(practice)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 999,
                        border: selected
                          ? "1px solid rgba(255,200,80,0.45)"
                          : "1px solid rgba(100,150,220,0.22)",
                        background: selected
                          ? "rgba(255,216,107,0.18)"
                          : "rgba(255,255,255,0.7)",
                        color: selected ? "#7a4f00" : "#3a5a7a",
                        fontSize: 15,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {practice}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="link" style={labelStyle}>
                Link
              </label>
              <input
                id="link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
                placeholder="https://..."
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <button
                type="submit"
                disabled={status === "submitting"}
                style={{
                  display: "inline-block",
                  padding: "15px 24px",
                  borderRadius: 999,
                  border: "none",
                  background: "#FFD86B",
                  color: "#1a2a0e",
                  fontWeight: 700,
                  fontSize: "1rem",
                  boxShadow:
                    "0 0 28px rgba(255,216,107,0.35), 0 4px 14px rgba(255,200,80,0.22)",
                  cursor: status === "submitting" ? "default" : "pointer",
                  opacity: status === "submitting" ? 0.8 : 1,
                }}
              >
                {status === "submitting" ? "Submitting..." : "Submit to the Constellation"}
              </button>

              <Link
                href="/constellation"
                style={{
                  color: "#0d2a4a",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  fontWeight: 500,
                  fontSize: "0.95rem",
                }}
              >
                Back to constellation
              </Link>
            </div>

            {message ? (
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: status === "error" ? "#9b2222" : "#2a6b3c",
                }}
              >
                {message}
              </p>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}

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
