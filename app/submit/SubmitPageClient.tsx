"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

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

const goldButtonStyle: React.CSSProperties = {
  padding: "15px 24px",
  borderRadius: 999,
  border: "none",
  background: "#FFD86B",
  color: "#1a2a0e",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow:
    "0 0 28px rgba(255,216,107,0.35), 0 4px 14px rgba(255,200,80,0.22)",
};

const ghostButtonStyle: React.CSSProperties = {
  padding: "15px 24px",
  borderRadius: 999,
  border: "1px solid rgba(13,42,74,0.18)",
  background: "rgba(255,255,255,0.55)",
  color: "#0d2a4a",
  fontWeight: 600,
  fontSize: "0.98rem",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
};

const reviewBoxStyle: React.CSSProperties = {
  borderRadius: 14,
  border: "1px solid rgba(100,150,220,0.25)",
  background: "rgba(255,255,255,0.6)",
  padding: 16,
};

const reviewKickerStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#6b7c94",
};

export default function SubmitPage() {
  const searchParams = useSearchParams();

  const prefilledState = searchParams.get("state") || "";
  const prefilledCounty = searchParams.get("county") || "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(prefilledState);
  const [county, setCounty] = useState(prefilledCounty);
  const [primaryCategory, setPrimaryCategory] = useState("");
  const [practices, setPractices] = useState<string[]>([]);
  const [submittedBy, setSubmittedBy] = useState("");
  const [email, setEmail] = useState("");

  const [claimStewardship, setClaimStewardship] = useState(false);
  const [stewardEmail, setStewardEmail] = useState("");
  const [stewardName, setStewardName] = useState("");

  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [stewardshipPending, setStewardshipPending] = useState(false);

  const regionLabel = useMemo(() => {
    if (county && state) return `${county} County, ${state}`;
    if (state) return state;
    if (county) return `${county} County`;
    return "";
  }, [county, state]);

  function togglePractice(practice: string) {
    setPractices((current) =>
      current.includes(practice)
        ? current.filter((item) => item !== practice)
        : [...current, practice]
    );
  }

  function validateForm() {
    if (!title.trim()) {
      setErrorMessage("Please add a name for the place, project, or offering.");
      return false;
    }

    if (!description.trim()) {
      setErrorMessage("Please add a short description.");
      return false;
    }

    if (!city.trim() && !address.trim()) {
      setErrorMessage("Please add at least a city or a street address.");
      return false;
    }

    if (!state.trim()) {
      setErrorMessage("Please add a state.");
      return false;
    }

    if (!primaryCategory.trim()) {
      setErrorMessage("Please choose a primary category.");
      return false;
    }

    if (claimStewardship && !stewardEmail.trim()) {
      setErrorMessage(
        "Please enter your email so we can verify your stewardship."
      );
      return false;
    }

    return true;
  }

  function handleReview() {
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsReviewing(true);
  }

  async function handleFinalSubmit() {
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      setIsReviewing(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        website: website.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        county: county.trim(),
        category: primaryCategory,
        categories: primaryCategory ? [primaryCategory] : [],
        practices,
        submittedBy: submittedBy.trim(),
        email: email.trim(),
        claim_stewardship: claimStewardship,
        steward_email: claimStewardship ? stewardEmail.trim() : null,
        steward_display_name: claimStewardship
          ? stewardName.trim() || null
          : null,
      };

      console.log("Submitting listing with:", {
        claim_stewardship: claimStewardship,
        steward_email: stewardEmail,
        steward_display_name: stewardName,
      });

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Something went wrong while submitting this point of light."
        );
      }

      const didClaimStewardship =
        claimStewardship && data?.stewardship_claim_pending;

      setStewardshipPending(!!didClaimStewardship);
      setSuccessMessage(
        didClaimStewardship
          ? `Your listing is live on the map. We've sent a verification link to ${stewardEmail.trim()} to confirm your stewardship — please check your inbox (and spam folder, just in case) within the next 24 hours.`
          : "Another point of light has become visible."
      );
      setTitle("");
      setDescription("");
      setWebsite("");
      setAddress("");
      setCity("");
      setState(prefilledState);
      setCounty(prefilledCounty);
      setPrimaryCategory("");
      setPractices([]);
      setSubmittedBy("");
      setEmail("");
      setClaimStewardship(false);
      setStewardEmail("");
      setStewardName("");
      setIsReviewing(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting this point of light.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

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
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <p
            style={{
              fontSize: "0.82rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              margin: 0,
              marginBottom: 14,
            }}
          >
            Canary Commons
          </p>

          <h1
            style={{
              fontSize: "clamp(2rem, 4.5vw, 2.8rem)",
              lineHeight: 1.08,
              margin: 0,
              marginBottom: 16,
              fontWeight: 650,
              color: "rgba(255,255,255,0.96)",
            }}
          >
            Reveal a point of light
          </h1>

          <p
            style={{
              margin: 0,
              marginBottom: 14,
              maxWidth: 600,
              fontSize: "1.06rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Help make what is already life-giving more visible. Share a place,
            project, offering, or effort that belongs on the map.
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "0.92rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            Not sure what belongs here?{" "}
            <Link
              href="/about"
              style={{
                color: "#FFD86B",
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Read about the project and what belongs on the map.
            </Link>
          </p>

          {regionLabel ? (
            <div
              style={{
                marginTop: 18,
                display: "inline-flex",
                padding: "8px 16px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.92)",
                fontSize: "0.88rem",
                backdropFilter: "blur(6px)",
              }}
            >
              Region prefilled: {regionLabel}
            </div>
          ) : null}
        </div>

        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.6)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(12px)",
            padding: "clamp(24px, 4vw, 36px)",
          }}
        >
          {!isReviewing ? (
            <>
              <div style={{ display: "grid", gap: 18 }}>
                <div>
                  <label style={labelStyle}>Name of place or project</label>
                  <input
                    name="ar-place-title"
                    autoComplete="off"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder=""
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    name="ar-description"
                    autoComplete="off"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell people what this is and why it matters."
                    rows={5}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Primary Category</label>
                  <p style={helperStyle}>
                    Choose the main area of life this belongs to.
                  </p>

                  <select
                    value={primaryCategory}
                    onChange={(e) => setPrimaryCategory(e.target.value)}
                    style={{ ...inputStyle, appearance: "none" }}
                  >
                    <option value="">Select a category</option>
                    {PRIMARY_CATEGORY_OPTIONS.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
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

                <div>
                  <label style={labelStyle}>Website</label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.org"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Street address</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Optional, but helpful for mapping"
                    style={inputStyle}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 16,
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  }}
                >
                  <div>
                    <label style={labelStyle}>City</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder=""
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>County</label>
                    <input
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      placeholder="Jackson"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>State</label>
                    <input
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Oregon"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 16,
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Your name</label>
                    <input
                      value={submittedBy}
                      onChange={(e) => setSubmittedBy(e.target.value)}
                      placeholder="Optional"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Your email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Optional"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* ── Stewardship section ── */}
                <div
                  style={{
                    marginTop: 8,
                    paddingTop: 20,
                    borderTop: "1px solid rgba(100,150,220,0.18)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: "#0d2a4a",
                      marginBottom: 6,
                    }}
                  >
                    Are you the person who runs this project?
                  </div>
                  <p
                    style={{
                      ...helperStyle,
                      marginBottom: 14,
                    }}
                  >
                    If you&apos;re the one tending this work — the farmer,
                    the practitioner, the founder, the coordinator — you can
                    become its steward right now. Stewardship means you can
                    update this listing directly as your work evolves.
                    We&apos;ll send you a verification link after you submit.
                  </p>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                      fontSize: "0.92rem",
                      color: "#0d2a4a",
                      fontWeight: 500,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={claimStewardship}
                      onChange={(e) =>
                        setClaimStewardship(e.target.checked)
                      }
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: "#FFD86B",
                        cursor: "pointer",
                      }}
                    />
                    Yes, I run this project and want to be its steward.
                  </label>

                  {claimStewardship && (
                    <div
                      style={{
                        marginTop: 14,
                        display: "grid",
                        gap: 14,
                      }}
                    >
                      <div>
                        <label style={labelStyle}>
                          Your email (for verification)
                        </label>
                        <input
                          type="email"
                          value={stewardEmail}
                          onChange={(e) =>
                            setStewardEmail(e.target.value)
                          }
                          placeholder="you@yourproject.org"
                          required
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>
                          Your name (optional — how you&apos;d like to be
                          addressed)
                        </label>
                        <input
                          value={stewardName}
                          onChange={(e) =>
                            setStewardName(e.target.value)
                          }
                          placeholder="Optional"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {errorMessage ? (
                <div
                  style={{
                    marginTop: 22,
                    padding: "12px 16px",
                    borderRadius: 14,
                    border: "1px solid rgba(180,40,40,0.35)",
                    background: "rgba(255,235,235,0.9)",
                    color: "#8a1a1a",
                    fontSize: "0.9rem",
                  }}
                >
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div
                  style={{
                    marginTop: 22,
                    padding: "12px 16px",
                    borderRadius: 14,
                    border: "1px solid rgba(52,140,88,0.4)",
                    background: "rgba(225,245,232,0.9)",
                    color: "#185e35",
                    fontSize: "0.9rem",
                  }}
                >
                  {successMessage}
                </div>
              ) : null}

              <div
                style={{
                  marginTop: 28,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <button
                  type="button"
                  onClick={handleReview}
                  style={goldButtonStyle}
                >
                  Review listing
                </button>

                <Link href="/map" style={ghostButtonStyle}>
                  Back to map
                </Link>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: 650,
                    color: "#0d2a4a",
                    lineHeight: 1.2,
                  }}
                >
                  Review before submitting
                </h2>
                <p
                  style={{
                    marginTop: 12,
                    maxWidth: 600,
                    fontSize: "0.92rem",
                    lineHeight: 1.65,
                    color: "#3a5a7a",
                  }}
                >
                  Please make any final changes now. Once submitted, this listing
                  will go live, and future edits will be reviewed before being
                  published.
                </p>
              </div>

              <div style={{ display: "grid", gap: 14 }}>
                <div style={reviewBoxStyle}>
                  <div style={reviewKickerStyle}>Name</div>
                  <div style={{ marginTop: 6, fontSize: "1rem", color: "#0d2a4a" }}>
                    {title}
                  </div>
                </div>

                <div style={reviewBoxStyle}>
                  <div style={reviewKickerStyle}>Description</div>
                  <div
                    style={{
                      marginTop: 6,
                      whiteSpace: "pre-wrap",
                      fontSize: "1rem",
                      lineHeight: 1.65,
                      color: "#0d2a4a",
                    }}
                  >
                    {description}
                  </div>
                </div>

                <div style={reviewBoxStyle}>
                  <div style={reviewKickerStyle}>Primary Category</div>
                  <div style={{ marginTop: 6, fontSize: "1rem", color: "#0d2a4a" }}>
                    {primaryCategory}
                  </div>
                </div>

                {practices.length > 0 ? (
                  <div style={reviewBoxStyle}>
                    <div style={reviewKickerStyle}>Practices / Values</div>
                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {practices.map((practice) => (
                        <span
                          key={practice}
                          style={{
                            borderRadius: 999,
                            border: "1px solid rgba(100,150,220,0.25)",
                            background: "rgba(255,255,255,0.7)",
                            padding: "5px 12px",
                            fontSize: "0.85rem",
                            color: "#3a5a7a",
                          }}
                        >
                          {practice}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {website ? (
                  <div style={reviewBoxStyle}>
                    <div style={reviewKickerStyle}>Website</div>
                    <div
                      style={{
                        marginTop: 6,
                        wordBreak: "break-all",
                        fontSize: "1rem",
                        color: "#0d2a4a",
                      }}
                    >
                      {website}
                    </div>
                  </div>
                ) : null}

                {address || city || county || state ? (
                  <div style={reviewBoxStyle}>
                    <div style={reviewKickerStyle}>Location</div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: "1rem",
                        color: "#0d2a4a",
                        lineHeight: 1.55,
                      }}
                    >
                      {address ? <div>{address}</div> : null}
                      <div>{[city, county, state].filter(Boolean).join(", ")}</div>
                    </div>
                  </div>
                ) : null}

                {submittedBy || email ? (
                  <div style={reviewBoxStyle}>
                    <div style={reviewKickerStyle}>Submitted by</div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: "1rem",
                        color: "#0d2a4a",
                        lineHeight: 1.55,
                      }}
                    >
                      {submittedBy ? <div>{submittedBy}</div> : null}
                      {email ? <div>{email}</div> : null}
                    </div>
                  </div>
                ) : null}
              </div>

              {errorMessage ? (
                <div
                  style={{
                    marginTop: 22,
                    padding: "12px 16px",
                    borderRadius: 14,
                    border: "1px solid rgba(180,40,40,0.35)",
                    background: "rgba(255,235,235,0.9)",
                    color: "#8a1a1a",
                    fontSize: "0.9rem",
                  }}
                >
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div
                  style={{
                    marginTop: 22,
                    padding: "12px 16px",
                    borderRadius: 14,
                    border: "1px solid rgba(52,140,88,0.4)",
                    background: "rgba(225,245,232,0.9)",
                    color: "#185e35",
                    fontSize: "0.9rem",
                  }}
                >
                  {successMessage}
                </div>
              ) : null}

              <div
                style={{
                  marginTop: 28,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsReviewing(false)}
                  style={ghostButtonStyle}
                >
                  Back to edit
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  style={{
                    ...goldButtonStyle,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.6 : 1,
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit listing"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
