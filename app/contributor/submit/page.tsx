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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#d3e4f7",
        color: "#1f2a3a",
        padding: "48px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(31,42,58,0.10)",
          borderRadius: 18,
          padding: "28px 24px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            margin: 0,
            marginBottom: 12,
            fontWeight: 700,
          }}
        >
          Submit a resource
        </h1>

        <p
          style={{
            marginTop: 0,
            marginBottom: 24,
            color: "#5b6b80",
            lineHeight: 1.6,
          }}
        >
          Submissions come in for review before being added to the public
          support page.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <input
            placeholder="Resource name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid rgba(31,42,58,0.14)",
              fontSize: "0.98rem",
              background: "white",
            }}
          />

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: "0.92rem",
                fontWeight: 600,
                color: "#1f2a3a",
              }}
            >
              Primary Category
            </label>

            <p
              style={{
                marginTop: 0,
                marginBottom: 10,
                color: "#5b6b80",
                lineHeight: 1.5,
                fontSize: "0.92rem",
              }}
            >
              Choose the main area of life this resource belongs to.
            </p>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid rgba(31,42,58,0.14)",
                fontSize: "0.98rem",
                background: "white",
                color: "#1f2a3a",
              }}
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
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: "0.92rem",
                fontWeight: 600,
                color: "#1f2a3a",
              }}
            >
              Display URL — the clean link people will see
            </label>
            <input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid rgba(31,42,58,0.14)",
                fontSize: "0.98rem",
                background: "white",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: "0.92rem",
                fontWeight: 600,
                color: "#1f2a3a",
              }}
            >
              Affiliate tracking link
            </label>
            <p
              style={{
                marginTop: 0,
                marginBottom: 10,
                color: "#5b6b80",
                lineHeight: 1.5,
                fontSize: "0.92rem",
              }}
            >
              The full tracking URL for this resource
            </p>
            <input
              placeholder="https://example.com/?ref=canary"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid rgba(31,42,58,0.14)",
                fontSize: "0.98rem",
                background: "white",
              }}
            />
          </div>

          <textarea
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid rgba(31,42,58,0.14)",
              fontSize: "0.98rem",
              background: "white",
              resize: "vertical",
            }}
          />

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: "0.92rem",
                fontWeight: 600,
                color: "#1f2a3a",
              }}
            >
              Why it matters
            </label>
            <textarea
              placeholder="Why does this belong here? What life-forward direction does it support?"
              value={whyItMatters}
              onChange={(e) => setWhyItMatters(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid rgba(31,42,58,0.14)",
                fontSize: "0.98rem",
                background: "white",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: "0.92rem",
                fontWeight: 600,
                color: "#1f2a3a",
              }}
            >
              Practices / Values
            </label>

            <p
              style={{
                marginTop: 0,
                marginBottom: 10,
                color: "#5b6b80",
                lineHeight: 1.5,
                fontSize: "0.92rem",
                fontStyle: "italic",
              }}
            >
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
                      border: "1px solid rgba(31,42,58,0.14)",
                      padding: "10px 14px",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background: isSelected ? "#0e3a66" : "rgba(255,255,255,0.75)",
                      color: isSelected ? "white" : "#4a5a70",
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
              padding: "14px 18px",
              borderRadius: 999,
              border: "1px solid rgba(31,42,58,0.14)",
              background: "rgba(255,255,255,0.9)",
              color: "#1c4a7d",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Submitting..." : "Submit for review"}
          </button>
        </form>
      </div>
    </main>
  );
}
