"use client";

import { useState } from "react";
import Link from "next/link";
import { seederOutreach1Email } from "@/app/lib/emails/seederOutreach1Recognition";

const CATEGORIES = [
  "Food & Nourishment",
  "Home & Shelter",
  "Health & Wellbeing",
  "Energy & Infrastructure",
  "Land & Ecology",
  "Materials & Goods",
  "Learning & Education",
  "Travel & Movement",
  "Community & Culture",
  "Conflict Transformation & Repair",
  "Finance & Systems",
];

const PRACTICES = [
  "Organic", "Regenerative", "Permaculture", "Fair Trade",
  "Biodegradable", "Compostable", "Recycled Materials", "Upcycled Materials",
  "Low Waste", "Zero Waste", "Local", "Worker-Owned / Cooperative",
  "Community Owned", "Renewable Energy", "Educational",
  "Accessible / Sliding Scale", "Volunteer Run", "Nonprofit / Mission Driven",
  "Indigenous Led", "Women Led", "Trauma-Informed", "Restorative",
  "Somatic", "Nonviolent", "Peer Supported", "Community Led",
  "Justice-Oriented",
];

type ListingDraft = {
  id: string;
  business_name: string;
  description: string;
  category: string[];
  practices: string[];
  city: string;
  state: string;
  address: string;
  website: string;
  steward_email: string;
  no_public_email: boolean;
  status: "pending" | "placing" | "placed" | "skipped" | "error";
  error?: string;
  listingId?: string;
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

let nextId = 0;

export default function BulkPlacePageClient({
  handle,
}: {
  handle: string;
}) {
  const [rawJson, setRawJson] = useState("");
  const [parseError, setParseError] = useState("");
  const [drafts, setDrafts] = useState<ListingDraft[]>([]);
  const [stage, setStage] = useState<"input" | "review">("input");

  function handleParse() {
    setParseError("");
    try {
      const parsed = JSON.parse(rawJson);
      if (!Array.isArray(parsed)) {
        setParseError("Expected a JSON array. Wrap your listings in [ ... ].");
        return;
      }
      if (parsed.length === 0) {
        setParseError("The array is empty.");
        return;
      }
      if (parsed.length > 50) {
        setParseError("Maximum 50 listings per batch.");
        return;
      }

      const items: ListingDraft[] = parsed.map((raw) => {
        const cat = (Array.isArray(raw.category)
          ? raw.category.filter((c: string) => typeof c === "string")
          : typeof raw.category === "string"
            ? [raw.category]
            : []
        ).filter((c: string) => CATEGORIES.includes(c));
        const prac = (Array.isArray(raw.practices)
          ? raw.practices.filter((p: string) => typeof p === "string")
          : []
        ).filter((p: string) => PRACTICES.includes(p));

        return {
          id: `draft-${nextId++}`,
          business_name: String(raw.business_name || raw.title || "").trim(),
          description: String(raw.description || "").trim(),
          category: cat,
          practices: prac,
          city: String(raw.city || "").trim(),
          state: String(raw.state || "").trim(),
          address: String(raw.address || "").trim(),
          website: String(raw.website || "").trim(),
          steward_email: String(raw.steward_email || "").trim(),
          no_public_email: raw.no_public_email === true,
          status: "pending" as const,
        };
      });

      setDrafts(items);
      setStage("review");
    } catch {
      setParseError(
        "Could not parse JSON. Check for missing commas, unclosed brackets, or unescaped quotes."
      );
    }
  }

  function updateDraft(id: string, field: keyof ListingDraft, value: unknown) {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  }

  function toggleCategory(id: string, cat: string) {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const has = d.category.includes(cat);
        if (has) return { ...d, category: d.category.filter((c) => c !== cat) };
        if (d.category.length >= 5) return d;
        return { ...d, category: [...d.category, cat] };
      })
    );
  }

  function togglePractice(id: string, prac: string) {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const has = d.practices.includes(prac);
        return {
          ...d,
          practices: has
            ? d.practices.filter((p) => p !== prac)
            : [...d.practices, prac],
        };
      })
    );
  }

  function skipDraft(id: string) {
    updateDraft(id, "status", "skipped");
  }

  async function placeDraft(id: string) {
    const draft = drafts.find((d) => d.id === id);
    if (!draft) return;

    updateDraft(id, "status", "placing");
    updateDraft(id, "error", undefined);

    try {
      const res = await fetch("/api/seeder/place-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.business_name,
          description: draft.description,
          category: draft.category,
          practices: draft.practices,
          city: draft.city,
          state: draft.state,
          address: draft.address,
          website: draft.website,
          steward_email: draft.steward_email || undefined,
          no_public_email: draft.no_public_email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDrafts((prev) =>
          prev.map((d) =>
            d.id === id
              ? { ...d, status: "error", error: data.error || "Failed to place." }
              : d
          )
        );
        return;
      }

      if (data.requires_override) {
        setDrafts((prev) =>
          prev.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status: "error",
                  error: `Do-not-list match: "${data.matched?.title}" in ${data.matched?.city}. Reason: ${data.matched?.reason || "not specified"}.`,
                }
              : d
          )
        );
        return;
      }

      setDrafts((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, status: "placed", listingId: data.listingId }
            : d
        )
      );
    } catch (err) {
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status: "error",
                error: err instanceof Error ? err.message : "Network error.",
              }
            : d
        )
      );
    }
  }

  const pending = drafts.filter((d) => d.status === "pending" || d.status === "error").length;
  const placed = drafts.filter((d) => d.status === "placed").length;
  const skipped = drafts.filter((d) => d.status === "skipped").length;
  const allDone = drafts.length > 0 && pending === 0 && drafts.every((d) => d.status !== "placing");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(100,150,220,0.25)",
    background: "rgba(255,255,255,0.9)",
    color: "#0d2a4a",
    fontSize: "0.92rem",
    outline: "none",
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
          maxWidth: 820,
          margin: "0 auto",
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
          <h1
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
              lineHeight: 1.3,
              fontWeight: 650,
              color: "#8a6d2a",
              margin: "0 0 8px",
              textAlign: "center",
            }}
          >
            Place a small batch of lights
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#3a5a7a",
              textAlign: "center",
              lineHeight: 1.5,
              margin: "0 0 28px",
            }}
          >
            Paste structured listing data below. Review each one, edit as
            needed, and place them one at a time.
          </p>

          {stage === "input" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <a
                  href={`/${handle}`}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6b7c94",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                  }}
                >
                  ← Dashboard
                </a>
              </div>
              <textarea
                value={rawJson}
                onChange={(e) => setRawJson(e.target.value)}
                placeholder='Paste a JSON array of listings here...'
                rows={14}
                style={{
                  ...inputStyle,
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  resize: "vertical",
                  minHeight: 200,
                }}
              />
              {parseError && (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#9b2222",
                    margin: "10px 0 0",
                  }}
                >
                  {parseError}
                </p>
              )}
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                  type="button"
                  onClick={handleParse}
                  disabled={!rawJson.trim()}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 999,
                    border: "none",
                    background: !rawJson.trim() ? "rgba(255,216,107,0.4)" : "#FFD86B",
                    color: "#1a2a0e",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: !rawJson.trim() ? "not-allowed" : "pointer",
                    boxShadow:
                      "0 0 20px rgba(255,216,107,0.25), 0 4px 14px rgba(255,200,80,0.18)",
                  }}
                >
                  Parse &amp; Review
                </button>
              </div>
            </>
          )}

          {stage === "review" && (
            <>
              {/* Counts */}
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: 20,
                  fontSize: "0.88rem",
                  color: "#2a3a4a",
                }}
              >
                <span><strong>{pending}</strong> to review</span>
                <span><strong>{placed}</strong> placed</span>
                <span><strong>{skipped}</strong> skipped</span>
              </div>

              {/* Back to input */}
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <button
                  type="button"
                  onClick={() => setStage("input")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6b7c94",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                  }}
                >
                  ← Back to paste
                </button>
              </div>

              {/* Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {drafts.map((draft) => {
                  if (draft.status === "skipped") return null;

                  const isPlaced = draft.status === "placed";
                  const isPlacing = draft.status === "placing";
                  const isError = draft.status === "error";
                  const canPlace =
                    draft.business_name.trim() &&
                    draft.city.trim() &&
                    draft.state.trim() &&
                    draft.address.trim() &&
                    draft.category.length > 0;

                  return (
                    <div
                      key={draft.id}
                      style={{
                        padding: "18px 20px",
                        borderRadius: 16,
                        border: isPlaced
                          ? "1px solid rgba(120,200,140,0.3)"
                          : isError
                            ? "1px solid rgba(200,120,120,0.3)"
                            : "1px solid rgba(100,150,220,0.15)",
                        background: isPlaced
                          ? "rgba(240,255,245,0.5)"
                          : "rgba(255,255,255,0.5)",
                        opacity: isPlaced ? 0.7 : 1,
                      }}
                    >
                      {/* Status */}
                      <div
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          marginBottom: 10,
                          color: isPlaced
                            ? "#2a6a3a"
                            : isError
                              ? "#9b2222"
                              : isPlacing
                                ? "#8a6d2a"
                                : "#6b7c94",
                        }}
                      >
                        {isPlaced
                          ? `Placed ✓ (ID: ${draft.listingId})`
                          : isPlacing
                            ? "Placing..."
                            : isError
                              ? `Error: ${draft.error}`
                              : "Pending review"}
                      </div>

                      {!isPlaced && (
                        <>
                          {/* Fields */}
                          <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
                            <div>
                              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0d2a4a", display: "block", marginBottom: 4 }}>Business name</label>
                              <input
                                style={inputStyle}
                                value={draft.business_name}
                                onChange={(e) => updateDraft(draft.id, "business_name", e.target.value)}
                                disabled={isPlacing}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0d2a4a", display: "block", marginBottom: 4 }}>Description</label>
                              <textarea
                                style={{ ...inputStyle, resize: "vertical" }}
                                rows={3}
                                value={draft.description}
                                onChange={(e) => updateDraft(draft.id, "description", e.target.value)}
                                disabled={isPlacing}
                              />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                              <div>
                                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0d2a4a", display: "block", marginBottom: 4 }}>City</label>
                                <input style={inputStyle} value={draft.city} onChange={(e) => updateDraft(draft.id, "city", e.target.value)} disabled={isPlacing} />
                              </div>
                              <div>
                                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0d2a4a", display: "block", marginBottom: 4 }}>State</label>
                                <input style={inputStyle} value={draft.state} onChange={(e) => updateDraft(draft.id, "state", e.target.value)} disabled={isPlacing} />
                              </div>
                            </div>
                            <div>
                              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0d2a4a", display: "block", marginBottom: 4 }}>Address <span style={{ fontWeight: 400, color: "#9b2222" }}>(required)</span></label>
                              <input style={inputStyle} value={draft.address} onChange={(e) => updateDraft(draft.id, "address", e.target.value)} disabled={isPlacing} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                              <div>
                                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0d2a4a", display: "block", marginBottom: 4 }}>Website</label>
                                <input style={inputStyle} value={draft.website} onChange={(e) => updateDraft(draft.id, "website", e.target.value)} disabled={isPlacing} />
                              </div>
                              <div>
                                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0d2a4a", display: "block", marginBottom: 4 }}>Steward email (optional)</label>
                                <input
                                  style={{ ...inputStyle, opacity: draft.no_public_email ? 0.4 : 1 }}
                                  value={draft.steward_email}
                                  onChange={(e) => updateDraft(draft.id, "steward_email", e.target.value)}
                                  disabled={isPlacing || draft.no_public_email}
                                />
                              </div>
                            </div>

                            {/* No public email checkbox */}
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  fontSize: "0.82rem",
                                  color: "#0d2a4a",
                                  cursor: isPlacing ? "default" : "pointer",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={draft.no_public_email}
                                  onChange={() =>
                                    updateDraft(draft.id, "no_public_email", !draft.no_public_email)
                                  }
                                  disabled={isPlacing}
                                />
                                No public email — uses a contact form
                              </label>
                              {draft.no_public_email && (
                                <div
                                  style={{
                                    marginTop: 10,
                                    padding: "12px 14px",
                                    borderRadius: 10,
                                    border: "1px solid rgba(138,109,42,0.15)",
                                    background: "rgba(255,248,230,0.3)",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "0.78rem",
                                      fontWeight: 650,
                                      color: "#8a6d2a",
                                      marginBottom: 6,
                                    }}
                                  >
                                    Outreach letter to paste into contact form
                                  </div>
                                  <textarea
                                    readOnly
                                    value={
                                      seederOutreach1Email({
                                        businessName: draft.business_name || "[Business Name]",
                                        listingId: "[will be assigned on placement]",
                                        removalToken: "",
                                        seederName: "",
                                      }).text
                                    }
                                    style={{
                                      width: "100%",
                                      minHeight: 160,
                                      padding: "10px 12px",
                                      borderRadius: 8,
                                      border: "1px solid rgba(100,150,220,0.2)",
                                      background: "rgba(255,255,255,0.6)",
                                      color: "#0d2a4a",
                                      fontSize: "0.78rem",
                                      lineHeight: 1.5,
                                      resize: "vertical",
                                      outline: "none",
                                      fontFamily: "inherit",
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const { text } = seederOutreach1Email({
                                        businessName: draft.business_name || "[Business Name]",
                                        listingId: "[will be assigned on placement]",
                                        removalToken: "",
                                        seederName: "",
                                      });
                                      navigator.clipboard.writeText(text);
                                    }}
                                    style={{
                                      marginTop: 8,
                                      padding: "6px 14px",
                                      borderRadius: 999,
                                      border: "1px solid rgba(138,109,42,0.2)",
                                      background: "rgba(255,248,230,0.35)",
                                      color: "rgba(138,109,42,0.7)",
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                    }}
                                  >
                                    Copy letter
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Category pills */}
                            <div>
                              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0d2a4a", display: "block", marginBottom: 6 }}>
                                Category{" "}
                                <span style={{ fontWeight: 400, color: "#6b7c94" }}>
                                  {draft.category.length >= 5 ? "(5 maximum)" : "(up to 5)"}
                                </span>
                              </label>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {CATEGORIES.map((cat) => {
                                  const sel = draft.category.includes(cat);
                                  const dis = !sel && draft.category.length >= 5;
                                  return (
                                    <button
                                      key={cat}
                                      type="button"
                                      onClick={() => !dis && !isPlacing && toggleCategory(draft.id, cat)}
                                      style={{
                                        borderRadius: 999,
                                        border: sel ? "1px solid rgba(255,200,80,0.45)" : "1px solid rgba(100,150,220,0.22)",
                                        padding: "6px 10px",
                                        fontSize: "0.78rem",
                                        cursor: dis || isPlacing ? "default" : "pointer",
                                        background: sel ? "rgba(255,216,107,0.18)" : "rgba(255,255,255,0.7)",
                                        color: sel ? "#7a4f00" : "#3a5a7a",
                                        opacity: dis ? 0.4 : 1,
                                      }}
                                    >
                                      {cat}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Practice pills */}
                            <div>
                              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0d2a4a", display: "block", marginBottom: 6 }}>Practices / Values</label>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {PRACTICES.map((prac) => {
                                  const sel = draft.practices.includes(prac);
                                  return (
                                    <button
                                      key={prac}
                                      type="button"
                                      onClick={() => !isPlacing && togglePractice(draft.id, prac)}
                                      style={{
                                        borderRadius: 999,
                                        border: sel ? "1px solid rgba(255,200,80,0.45)" : "1px solid rgba(100,150,220,0.22)",
                                        padding: "6px 10px",
                                        fontSize: "0.78rem",
                                        cursor: isPlacing ? "default" : "pointer",
                                        background: sel ? "rgba(255,216,107,0.18)" : "rgba(255,255,255,0.7)",
                                        color: sel ? "#7a4f00" : "#3a5a7a",
                                      }}
                                    >
                                      {prac}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <button
                              type="button"
                              onClick={() => {
                                const ok = window.confirm(
                                  `Place "${draft.business_name}"? This will add it to the map${draft.steward_email && !draft.no_public_email ? " and send Email 1 to the steward" : ""}.`
                                );
                                if (ok) placeDraft(draft.id);
                              }}
                              disabled={!canPlace || isPlacing}
                              style={{
                                padding: "10px 20px",
                                borderRadius: 999,
                                border: "none",
                                background: !canPlace || isPlacing ? "rgba(255,216,107,0.4)" : "#FFD86B",
                                color: "#1a2a0e",
                                fontWeight: 700,
                                fontSize: "0.88rem",
                                cursor: !canPlace || isPlacing ? "not-allowed" : "pointer",
                                boxShadow: canPlace && !isPlacing
                                  ? "0 0 20px rgba(255,216,107,0.25), 0 4px 14px rgba(255,200,80,0.18)"
                                  : "none",
                              }}
                            >
                              {isPlacing ? "Placing..." : "Accept and place"}
                            </button>
                            <button
                              type="button"
                              onClick={() => skipDraft(draft.id)}
                              disabled={isPlacing}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#6b7c94",
                                fontSize: "0.85rem",
                                cursor: isPlacing ? "default" : "pointer",
                              }}
                            >
                              Skip
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Completion */}
              {allDone && (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 28,
                    padding: "16px 0",
                    fontSize: "0.9rem",
                    color: "#2a6a3a",
                  }}
                >
                  <p style={{ margin: "0 0 16px", fontWeight: 600 }}>
                    Batch complete. {placed} placed, {skipped} skipped.
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setRawJson("");
                        setDrafts([]);
                        setStage("input");
                      }}
                      style={{
                        padding: "12px 24px",
                        borderRadius: 999,
                        border: "none",
                        background: "#FFD86B",
                        color: "#1a2a0e",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        boxShadow:
                          "0 0 20px rgba(255,216,107,0.25), 0 4px 14px rgba(255,200,80,0.18)",
                      }}
                    >
                      Place another batch
                    </button>
                    <Link
                      href={`/${handle}`}
                      style={{
                        display: "inline-block",
                        padding: "10px 18px",
                        borderRadius: 999,
                        border: "1px solid rgba(138,109,42,0.2)",
                        background: "rgba(255,248,230,0.35)",
                        color: "rgba(138,109,42,0.7)",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        textDecoration: "none",
                      }}
                    >
                      Return to dashboard
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
