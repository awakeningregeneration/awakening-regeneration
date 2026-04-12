"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRIMARY_CATEGORY_OPTIONS = [
  "Food & Nourishment",
  "Home & Shelter",
  "Health & Wellbeing",
  "Energy & Infrastructure",
  "Land & Ecology",
  "Materials & Goods",
  "Learning & Education",
  "Travel & Movement",
  "Community & Culture",
  "Communication & Conflict Transformation",
  "Finance & Systems",
];

const PRACTICE_OPTIONS = [
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

export default function ContributorSubmitPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [url, setUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [description, setDescription] = useState("");
  const [whyItMatters, setWhyItMatters] = useState("");
  const [practices, setPractices] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function togglePractice(practice: string) {
    setPractices((current) =>
      current.includes(practice)
        ? current.filter((item) => item !== practice)
        : [...current, practice]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/affiliates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          url,
          affiliate_url: affiliateUrl,
          description,
          why_it_matters: whyItMatters,
          practices,
          contributor_id: "contributor_001",
          contributor_name: "Lucia",
          status: "approved",
        }),
      });

      if (res.ok) {
        router.push("/contributor");
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: "1px solid rgba(100,150,220,0.25)",
    background: "rgba(255,255,255,0.9)",
    color: "#0d2a4a",
    fontSize: "0.98rem",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 8,
    fontSize: "0.92rem",
    fontWeight: 600,
    color: "#0d2a4a",
  };

  const helperStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: 10,
    color: "#3a5a7a",
    lineHeight: 1.55,
    fontSize: "0.9rem",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#0d2a4a",
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
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontSize: "0.82rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            margin: 0,
            marginBottom: 16,
          }}
        >
          Canary Commons
        </p>

        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.6)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(12px)",
            padding: "clamp(24px, 4vw, 36px)",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.7rem, 3.5vw, 2.2rem)",
              lineHeight: 1.18,
              margin: 0,
              marginBottom: 14,
              fontWeight: 650,
              color: "#0d2a4a",
            }}
          >
            Submit a resource
          </h1>

          <p
            style={{
              marginTop: 0,
              marginBottom: 28,
              color: "#3a5a7a",
              lineHeight: 1.65,
              fontSize: "0.98rem",
            }}
          >
            Submissions come in for review before being added to the public
            support page.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
            <input
              placeholder="Resource name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />

            <div>
              <label style={labelStyle}>Primary Category</label>
              <p style={helperStyle}>
                Choose the main area of life this resource belongs to.
              </p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                style={{ ...inputStyle, appearance: "none" }}
              >
                <option value="">Select a category</option>
                {PRIMARY_CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Display URL — the clean link people will see
              </label>
              <input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Affiliate tracking link</label>
              <p style={helperStyle}>
                The full tracking URL for this resource
              </p>
              <input
                placeholder="https://example.com/?ref=canary"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                style={inputStyle}
              />
            </div>

            <textarea
              placeholder="Short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
            />

            <div>
              <label style={labelStyle}>Why it matters</label>
              <textarea
                placeholder="Why does this belong here? What life-forward direction does it support?"
                value={whyItMatters}
                onChange={(e) => setWhyItMatters(e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            <div>
              <label style={labelStyle}>Practices / Values</label>
              <p style={{ ...helperStyle, fontStyle: "italic" }}>
                Mark all that apply.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {PRACTICE_OPTIONS.map((practice) => {
                  const isSelected = practices.includes(practice);

                  return (
                    <button
                      key={practice}
                      type="button"
                      onClick={() => togglePractice(practice)}
                      style={{
                        borderRadius: 999,
                        border: isSelected
                          ? "1px solid rgba(255,200,80,0.45)"
                          : "1px solid rgba(100,150,220,0.22)",
                        padding: "10px 14px",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        background: isSelected
                          ? "rgba(255,216,107,0.18)"
                          : "rgba(255,255,255,0.7)",
                        color: isSelected ? "#7a4f00" : "#3a5a7a",
                      }}
                    >
                      {practice}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: 8,
                padding: "15px 20px",
                borderRadius: 999,
                border: "none",
                background: "#FFD86B",
                color: "#1a2a0e",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow:
                  "0 0 28px rgba(255,216,107,0.35), 0 4px 14px rgba(255,200,80,0.22)",
                opacity: submitting ? 0.8 : 1,
              }}
            >
              {submitting ? "Submitting..." : "Submit for review"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
