"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OutreachMessageDisplay from "@/app/components/OutreachMessageDisplay";

type Props = {
  handle: string;
  seederName: string;
};

type ViewState = "form" | "override" | "success";

type OverrideData = {
  title: string;
  city: string;
  reason: string | null;
  at: string | null;
};

type SuccessData = {
  businessName: string;
  emailSent: boolean;
};

// Categories and practices for seeder placement form.
// Note: these are intentionally not shared with the other submit forms
// (submit, support/submit, contributor/submit, constellation/submit).
// Each surface owns its own taxonomy because surfaces may evolve
// independently as Canary Commons grows. They happen to share identical
// values today; that's coincidence, not architectural truth.
// See GROWTH_LIST.md for the audit task on the four existing copies.
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

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming", "District of Columbia",
];

// Morning-sky orbs (matching /lucia/start and /contributor/submit)
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

// Shared styling tokens (matching /contributor/submit + /lucia/start)
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
  marginTop: 4,
  marginBottom: 10,
  color: "#3a5a7a",
  lineHeight: 1.55,
  fontSize: "0.85rem",
  fontStyle: "italic",
};

export default function PlacePageClient({ handle, seederName }: Props) {
  const router = useRouter();

  // ── View state ──
  const [view, setView] = useState<ViewState>("form");
  const [overrideData, setOverrideData] = useState<OverrideData | null>(null);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  // ── Form fields ──
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [practices, setPractices] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [stewardEmail, setStewardEmail] = useState("");
  const [showOutreachSection, setShowOutreachSection] = useState(false);

  // ── Submission state ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ── Saved form data for override resubmission ──
  const [savedFormData, setSavedFormData] = useState<Record<string, unknown> | null>(null);

  function toggleCategory(cat: string) {
    setCategory((current) =>
      current.includes(cat)
        ? current.filter((c) => c !== cat)
        : current.length < 5 ? [...current, cat] : current
    );
  }

  function togglePractice(p: string) {
    setPractices((cur) =>
      cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]
    );
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory([]);
    setPractices([]);
    setCity("");
    setState("");
    setAddress("");
    setWebsite("");
    setStewardEmail("");
    setErrorMessage("");
    setSavedFormData(null);
  }

  async function submitPlacement(overrideDoNotList: boolean) {
    setIsSubmitting(true);
    setErrorMessage("");

    // Client-side pre-validation
    if (!title.trim() || title.trim().length < 2) {
      setErrorMessage("Please add a name for the business (at least 2 characters).");
      setIsSubmitting(false);
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setErrorMessage("Please add a description (at least 10 characters).");
      setIsSubmitting(false);
      return;
    }
    if (category.length === 0) {
      setErrorMessage("Please choose a category.");
      setIsSubmitting(false);
      return;
    }
    if (practices.length === 0) {
      setErrorMessage("Please select at least one practice.");
      setIsSubmitting(false);
      return;
    }
    if (!city.trim()) {
      setErrorMessage("Please enter a city.");
      setIsSubmitting(false);
      return;
    }
    if (!state) {
      setErrorMessage("Please select a state.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      practices,
      city: city.trim(),
      state,
      address: address.trim() || undefined,
      website: website.trim() || undefined,
      steward_email: stewardEmail.trim() || undefined,
      override_do_not_list: overrideDoNotList,
    };

    setSavedFormData(payload);

    try {
      const res = await fetch("/api/seeder/place-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.requires_override) {
        setOverrideData(data.matched);
        setView("override");
        return;
      }

      if (data.success) {
        setSuccessData({
          businessName: data.businessName,
          emailSent: data.emailSent,
        });
        setView("success");
        return;
      }

      setErrorMessage(data.error || "Something went wrong.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Suppress unused variable warning — seederName reserved for future dashboard header
  void seederName;
  void savedFormData;

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
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.6)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(12px)",
            padding: "clamp(24px, 5vw, 40px)",
          }}
        >
          {/* ── FORM VIEW ── */}
          {view === "form" && (
            <>
              <h2
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                  lineHeight: 1.3,
                  fontWeight: 650,
                  color: "#8a6d2a",
                  margin: "0 0 8px",
                  textAlign: "center",
                }}
              >
                Place a light
              </h2>
              <p
                style={{
                  fontSize: "0.92rem",
                  color: "#3a5a7a",
                  textAlign: "center",
                  margin: "0 0 24px",
                  fontStyle: "italic",
                }}
              >
                Seed lightly. Seed accurately. Leave room.
              </p>

              {errorMessage && (
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: "rgba(180,35,24,0.06)",
                    border: "1px solid rgba(180,35,24,0.15)",
                    color: "#b42318",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    marginBottom: 18,
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitPlacement(false);
                }}
                style={{ display: "grid", gap: 18 }}
              >
                {/* 1. Business name */}
                <div>
                  <label style={labelStyle}>Business name</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="e.g., Bay Coffee Roasters"
                    required
                    style={inputStyle}
                  />
                </div>

                {/* 2. Description */}
                <div>
                  <label style={labelStyle}>Description</label>
                  <p style={helperStyle}>
                    One neutral sentence describing what they do. Use their own
                    public language when possible.
                  </p>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="e.g., Community-owned grocery specializing in local and organic produce."
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                {/* 3. Category */}
                <div>
                  <label style={labelStyle}>
                    Category{" "}
                    <span style={{ fontWeight: 400, color: "#6b7c94", fontSize: "0.85em" }}>
                      {category.length >= 5 ? "(5 maximum)" : "(choose up to 5)"}
                    </span>
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {CATEGORIES.map((cat) => {
                      const isSelected = category.includes(cat);
                      const isDisabled = !isSelected && category.length >= 5;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => { if (!isDisabled) { toggleCategory(cat); setErrorMessage(""); } }}
                          style={{
                            borderRadius: 999,
                            border: isSelected
                              ? "1px solid rgba(255,200,80,0.45)"
                              : "1px solid rgba(100,150,220,0.22)",
                            padding: "10px 14px",
                            fontSize: "0.9rem",
                            cursor: isDisabled ? "default" : "pointer",
                            background: isSelected
                              ? "rgba(255,216,107,0.18)"
                              : "rgba(255,255,255,0.7)",
                            color: isSelected ? "#7a4f00" : "#3a5a7a",
                            opacity: isDisabled ? 0.4 : 1,
                            transition: "all 0.2s ease",
                          }}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Practices */}
                <div>
                  <label style={labelStyle}>Practices / Values</label>
                  <p style={helperStyle}>
                    Check all that apply based on what their public materials
                    say.
                  </p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                  >
                    {PRACTICES.map((practice) => {
                      const selected = practices.includes(practice);
                      return (
                        <button
                          key={practice}
                          type="button"
                          onClick={() => {
                            togglePractice(practice);
                            setErrorMessage("");
                          }}
                          style={{
                            borderRadius: 999,
                            border: selected
                              ? "1px solid rgba(255,200,80,0.45)"
                              : "1px solid rgba(100,150,220,0.22)",
                            padding: "8px 13px",
                            fontSize: "0.88rem",
                            cursor: "pointer",
                            transition: "all 0.15s",
                            background: selected
                              ? "rgba(255,216,107,0.18)"
                              : "rgba(255,255,255,0.7)",
                            color: selected ? "#7a4f00" : "#3a5a7a",
                            fontWeight: selected ? 600 : 400,
                          }}
                        >
                          {practice}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. City + State (side-by-side) */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div>
                    <label style={labelStyle}>City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setErrorMessage("");
                      }}
                      placeholder="e.g., Ashland"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>State</label>
                    <select
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setErrorMessage("");
                      }}
                      required
                      style={{ ...inputStyle, appearance: "none" }}
                    >
                      <option value="">Select</option>
                      {STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 6. Address (optional) */}
                <div>
                  <label style={labelStyle}>
                    Street address{" "}
                    <span style={{ fontWeight: 400, color: "#6b7c94" }}>
                      (optional)
                    </span>
                  </label>
                  <p style={helperStyle}>
                    Helps with map placement accuracy and do-not-list matching.
                  </p>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="e.g., 237 E Main St"
                    style={inputStyle}
                  />
                </div>

                {/* 7. Website */}
                <div>
                  <label style={labelStyle}>Website</label>
                  <p style={helperStyle}>Their public-facing site.</p>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => {
                      setWebsite(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="e.g., baycoffeeroasters.com"
                    style={inputStyle}
                  />
                </div>

                {/* 8. Steward email (optional) */}
                <div>
                  <label style={labelStyle}>
                    Steward email{" "}
                    <span style={{ fontWeight: 400, color: "#6b7c94" }}>
                      (optional)
                    </span>
                  </label>
                  <p style={helperStyle}>
                    Adding this triggers Email 1 immediately on placement.
                    Leave blank if you don&apos;t have a contact email yet.
                  </p>
                  <input
                    type="email"
                    value={stewardEmail}
                    onChange={(e) => {
                      setStewardEmail(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="e.g., hello@baycoffeeroasters.com"
                    style={inputStyle}
                  />

                  {!stewardEmail.trim() && (
                    <div style={{ marginTop: 10 }}>
                      {!showOutreachSection ? (
                        <button
                          type="button"
                          onClick={() => setShowOutreachSection(true)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#8a6d2a",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            padding: 0,
                            textDecoration: "underline",
                            textUnderlineOffset: 2,
                          }}
                        >
                          No direct email available?
                        </button>
                      ) : (
                        <div
                          style={{
                            marginTop: 8,
                            padding: "16px",
                            borderRadius: 14,
                            border: "1px solid rgba(138,109,42,0.15)",
                            background: "rgba(255,248,230,0.3)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.88rem",
                              fontWeight: 650,
                              color: "#8a6d2a",
                              marginBottom: 6,
                            }}
                          >
                            No direct email? Use this outreach message.
                          </div>
                          <p
                            style={{
                              fontSize: "0.82rem",
                              color: "#3a5a7a",
                              lineHeight: 1.5,
                              margin: "0 0 12px",
                            }}
                          >
                            Paste this into the business&apos;s contact form,
                            chat widget, social DM, or read it aloud over
                            the phone.
                          </p>
                          <OutreachMessageDisplay />
                          <div style={{ marginTop: 10 }}>
                            <button
                              type="button"
                              onClick={() => setShowOutreachSection(false)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#6b7c94",
                                fontSize: "0.82rem",
                                cursor: "pointer",
                                padding: 0,
                              }}
                            >
                              Collapse
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "15px 24px",
                    borderRadius: 999,
                    border: "none",
                    background: isSubmitting
                      ? "rgba(255,216,107,0.5)"
                      : "#FFD86B",
                    color: isSubmitting
                      ? "rgba(26,42,14,0.5)"
                      : "#1a2a0e",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: isSubmitting
                      ? "none"
                      : "0 0 24px rgba(255,216,107,0.3), 0 4px 14px rgba(255,200,80,0.18)",
                    transition: "all 0.2s",
                    marginTop: 8,
                  }}
                >
                  {isSubmitting ? "Placing..." : "Place this light"}
                </button>
              </form>
            </>
          )}

          {/* ── OVERRIDE VIEW ── */}
          {view === "override" && overrideData && (
            <>
              <h2
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                  lineHeight: 1.3,
                  fontWeight: 650,
                  color: "#8a6d2a",
                  margin: "0 0 16px",
                  textAlign: "center",
                }}
              >
                Wait — we have a record on this business
              </h2>

              <div
                style={{
                  padding: "16px 18px",
                  borderRadius: 14,
                  background: "rgba(180,35,24,0.04)",
                  border: "1px solid rgba(180,35,24,0.12)",
                  marginBottom: 20,
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  color: "#2a3a4a",
                }}
              >
                <p style={{ margin: "0 0 10px" }}>
                  A business named <strong>{overrideData.title}</strong> in{" "}
                  <strong>{overrideData.city}</strong> opted out of being listed
                  {overrideData.at && (
                    <>
                      {" "}
                      on{" "}
                      {new Date(overrideData.at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </>
                  )}
                  .
                </p>
                {overrideData.reason && (
                  <p style={{ margin: "0 0 10px", fontStyle: "italic" }}>
                    Reason given: &ldquo;{overrideData.reason}&rdquo;
                  </p>
                )}
                <p style={{ margin: 0 }}>
                  Before placing this listing, please confirm this is a
                  different business or under different ownership. The previous
                  opt-out should be respected for the same business.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => {
                    setView("form");
                    setOverrideData(null);
                  }}
                  style={{
                    padding: "13px 24px",
                    borderRadius: 999,
                    border: "1px solid rgba(13,42,74,0.18)",
                    background: "rgba(255,255,255,0.55)",
                    color: "#0d2a4a",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel — this is the same business
                </button>
                <button
                  onClick={() => submitPlacement(true)}
                  disabled={isSubmitting}
                  style={{
                    padding: "13px 24px",
                    borderRadius: 999,
                    border: "none",
                    background: isSubmitting
                      ? "rgba(255,216,107,0.5)"
                      : "#FFD86B",
                    color: isSubmitting
                      ? "rgba(26,42,14,0.5)"
                      : "#1a2a0e",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: isSubmitting
                      ? "none"
                      : "0 0 20px rgba(255,216,107,0.25)",
                  }}
                >
                  {isSubmitting
                    ? "Placing..."
                    : "Place anyway — different business or new ownership"}
                </button>
              </div>
            </>
          )}

          {/* ── SUCCESS VIEW ── */}
          {view === "success" && successData && (
            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                  lineHeight: 1.3,
                  fontWeight: 650,
                  color: "#8a6d2a",
                  margin: "0 0 16px",
                }}
              >
                You placed a light.
              </h2>

              <p
                style={{
                  fontSize: "0.98rem",
                  lineHeight: 1.6,
                  color: "#2a3a4a",
                  margin: "0 0 8px",
                }}
              >
                <strong>{successData.businessName}</strong> is now visible on
                Canary Commons.
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "#3a5a7a",
                  margin: "0 0 28px",
                  fontStyle: "italic",
                }}
              >
                {successData.emailSent
                  ? "Email 1 has been sent."
                  : "No steward email was provided, so no outreach email was sent."}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => {
                    resetForm();
                    setView("form");
                    setSuccessData(null);
                  }}
                  style={{
                    padding: "13px 24px",
                    borderRadius: 999,
                    border: "1px solid rgba(13,42,74,0.18)",
                    background: "rgba(255,255,255,0.55)",
                    color: "#0d2a4a",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  Place another
                </button>
                <button
                  onClick={() => router.push(`/${handle}`)}
                  style={{
                    padding: "13px 24px",
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
                  Return to dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
