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

export default function ConstellationSubmitPage() {
  const lights = [
    { left: "8%", top: "10%", size: 10, glow: 1.2 },
    { left: "18%", top: "18%", size: 7, glow: 0.9 },
    { left: "30%", top: "12%", size: 9, glow: 1.1 },
    { left: "44%", top: "16%", size: 8, glow: 1.05 },
    { left: "58%", top: "10%", size: 10, glow: 1.25 },
    { left: "72%", top: "18%", size: 7, glow: 0.95 },
    { left: "86%", top: "12%", size: 9, glow: 1.15 },

    { left: "12%", top: "34%", size: 8, glow: 1.05 },
    { left: "24%", top: "28%", size: 6, glow: 0.85 },
    { left: "38%", top: "38%", size: 9, glow: 1.15 },
    { left: "52%", top: "30%", size: 7, glow: 0.9 },
    { left: "66%", top: "36%", size: 10, glow: 1.2 },
    { left: "80%", top: "30%", size: 8, glow: 1.05 },
    { left: "90%", top: "40%", size: 7, glow: 0.9 },

    { left: "10%", top: "58%", size: 9, glow: 1.1 },
    { left: "22%", top: "70%", size: 7, glow: 0.9 },
    { left: "36%", top: "62%", size: 10, glow: 1.2 },
    { left: "50%", top: "74%", size: 8, glow: 1.05 },
    { left: "64%", top: "60%", size: 7, glow: 0.95 },
    { left: "78%", top: "68%", size: 10, glow: 1.25 },
    { left: "90%", top: "62%", size: 8, glow: 1.05 },

    { left: "14%", top: "86%", size: 6, glow: 0.8 },
    { left: "30%", top: "90%", size: 8, glow: 1.0 },
    { left: "46%", top: "88%", size: 7, glow: 0.9 },
    { left: "62%", top: "92%", size: 9, glow: 1.15 },
    { left: "80%", top: "86%", size: 7, glow: 0.9 },
  ];

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

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#08192d",
        color: "white",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top, rgba(26,72,130,0.28) 0%, rgba(7,24,45,0.9) 38%, rgba(5,16,31,1) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(88,156,255,0.12) 0%, transparent 32%), radial-gradient(circle at 80% 30%, rgba(88,156,255,0.10) 0%, transparent 28%), radial-gradient(circle at 50% 80%, rgba(88,156,255,0.08) 0%, transparent 34%)",
        }}
      />

      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
        }}
      >
        {lights.map((light, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: light.left,
              top: light.top,
              width: light.size,
              height: light.size,
              borderRadius: 999,
              background: "#fff7cc",
              boxShadow: `0 0 ${14 * light.glow}px rgba(255, 242, 170, 0.75), 0 0 ${28 * light.glow}px rgba(120, 180, 255, 0.28)`,
              opacity: 0.95,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          maxWidth: 980,
          margin: "0 auto",
          padding: "70px 20px 90px",
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
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#9fb8d8",
              marginBottom: 14,
            }}
          >
            Awakening Regeneration
          </div>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              lineHeight: 1.05,
              margin: "0 0 16px",
              color: "white",
            }}
          >
            Submit to the Constellation
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 18,
              lineHeight: 1.8,
              color: "#d3e3f7",
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
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            padding: 24,
          }}
        >
          <div
            style={{
              marginBottom: 22,
            }}
          >
            <h2
              style={{
                margin: "0 0 10px",
                fontSize: 28,
                color: "white",
              }}
            >
              What belongs here
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.8,
                color: "#d3e3f7",
              }}
            >
              The Constellation gathers non-local signals of life-forward change from
              around the world. These are outward-facing reminders that this work is
              rising everywhere.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
            <div>
              <label
                htmlFor="title"
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "white",
                }}
              >
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
              <label
                htmlFor="description"
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "white",
                }}
              >
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
                <label
                  htmlFor="region"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 600,
                    color: "white",
                  }}
                >
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
                <label
                  htmlFor="category"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  Primary Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  style={inputStyle}
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
              <div
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "white",
                }}
              >
                Practices / Values
              </div>

              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#c2d5ec",
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
                          ? "1px solid rgba(255,216,107,0.45)"
                          : "1px solid rgba(255,255,255,0.16)",
                        background: selected
                          ? "rgba(255,216,107,0.16)"
                          : "rgba(255,255,255,0.08)",
                        color: selected ? "#ffe08a" : "#eef5ff",
                        fontSize: 15,
                        cursor: "pointer",
                      }}
                    >
                      {practice}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="link"
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "white",
                }}
              >
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
                  padding: "14px 22px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,216,107,0.14)",
                  color: "#ffe08a",
                  textDecoration: "none",
                  fontWeight: 600,
                  boxShadow: "0 0 20px rgba(255,216,107,0.10)",
                  cursor: status === "submitting" ? "default" : "pointer",
                }}
              >
                {status === "submitting" ? "Submitting..." : "Submit to the Constellation"}
              </button>

              <Link
                href="/constellation"
                style={{
                  color: "#d3e3f7",
                  textDecoration: "none",
                  fontWeight: 500,
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
                  color: status === "error" ? "#ffb4b4" : "#cfe7b0",
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
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(248,252,255,0.94)",
  color: "#1f2a3a",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
};