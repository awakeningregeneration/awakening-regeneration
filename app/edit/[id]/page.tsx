"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Listing = {
  id: string;
  title: string;
  description?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  county?: string;
};

type Props = {
  params: Promise<{ id: string }>;
};

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

type EditMode =
  | "loading"
  | "steward_edit"
  | "verify_steward"
  | "pending_claim"
  | "claim_or_edit"
  | "claiming"
  | "propose_edit";

export default function EditListingPage({ params }: Props) {
  const [listingId, setListingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [originalListing, setOriginalListing] = useState<(Listing & { steward_email?: string | null }) | null>(null);
  const [editMode, setEditMode] = useState<EditMode>("loading");

  // Fields shared by both steward-edit and propose-edit
  const [suggestedTitle, setSuggestedTitle] = useState("");
  const [suggestedDescription, setSuggestedDescription] = useState("");
  const [suggestedWebsite, setSuggestedWebsite] = useState("");
  const [suggestedAddress, setSuggestedAddress] = useState("");
  const [suggestedCity, setSuggestedCity] = useState("");
  const [suggestedState, setSuggestedState] = useState("");
  const [suggestedCounty, setSuggestedCounty] = useState("");
  const [notes, setNotes] = useState("");

  // Steward-specific
  const [stewardEmail, setStewardEmail] = useState("");
  const [stewardDisplayName, setStewardDisplayName] = useState("");

  // Verify-steward form
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifySent, setVerifySent] = useState(false);
  const [verifySending, setVerifySending] = useState(false);

  // Claim form (State C — unclaimed listing)
  const [claimEmail, setClaimEmail] = useState("");
  const [claimName, setClaimName] = useState("");
  const [claimDeclaration, setClaimDeclaration] = useState("");
  const [claimSent, setClaimSent] = useState(false);
  const [claimSending, setClaimSending] = useState(false);
  const [claimError, setClaimError] = useState("");

  useEffect(() => {
    async function loadParamsAndListing() {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        setListingId(id);

        const res = await fetch("/api/listings");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load listings.");
        }

        const found = Array.isArray(data)
          ? data.find((item: Listing) => item.id === id)
          : null;

        if (!found) {
          throw new Error("Could not find that listing.");
        }

        setOriginalListing(found);
        setSuggestedTitle(found.title || "");
        setSuggestedDescription(found.description || "");
        setSuggestedWebsite(found.website || "");
        setSuggestedAddress(found.address || "");
        setSuggestedCity(found.city || "");
        setSuggestedState(found.state || "");
        setSuggestedCounty(found.county || "");

        // Determine stewardship state
        // First check if we have a valid edit session cookie
        const sessionRes = await fetch(
          `/api/steward/check-session?listing_id=${id}`
        );
        const sessionData = await sessionRes.json();

        if (sessionData.isVerifiedSteward) {
          // State A with valid session → direct edit
          setEditMode("steward_edit");
          setStewardEmail(sessionData.steward.email || "");
          setStewardDisplayName(sessionData.steward.display_name || "");
        } else if (found.steward_email) {
          // Has a steward — check if active or pending
          // The listing has steward_email set, meaning someone is active
          setEditMode("verify_steward"); // State A without session
        } else {
          // No steward_email on listing — check for pending claims
          const claimRes = await fetch(
            `/api/steward/check-claims?listing_id=${id}`
          );
          const claimData = await claimRes.json();

          if (claimData.hasPendingClaim) {
            setEditMode("pending_claim"); // State B
          } else {
            setEditMode("claim_or_edit"); // State C
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load listing."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadParamsAndListing();
  }, [params]);

  // ── Steward direct save ──────────────────────────────────
  async function handleStewardSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/steward/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listingId,
          title: suggestedTitle,
          description: suggestedDescription,
          website: suggestedWebsite,
          address: suggestedAddress,
          city: suggestedCity,
          state: suggestedState,
          county: suggestedCounty,
          steward_email: stewardEmail,
          steward_display_name: stewardDisplayName,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to save.");

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Propose edit (non-steward, existing behavior) ────────
  async function handleProposeEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/listings/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          suggestedTitle,
          suggestedDescription,
          suggestedWebsite,
          suggestedAddress,
          suggestedCity,
          suggestedState,
          suggestedCounty,
          notes,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to submit edit.");

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit edit.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Submit stewardship claim (State C) ────────────────────
  async function handleClaimSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClaimSending(true);
    setClaimError("");

    try {
      const res = await fetch("/api/steward/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listingId,
          email: claimEmail.trim(),
          display_name: claimName.trim() || null,
          declaration_text: claimDeclaration.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setClaimSent(true);
    } catch (err) {
      setClaimError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setClaimSending(false);
    }
  }

  // ── Request steward verification link ────────────────────
  async function handleVerifyRequest(e: React.FormEvent) {
    e.preventDefault();
    setVerifySending(true);

    try {
      await fetch("/api/steward/edit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listingId,
          email: verifyEmail.trim(),
        }),
      });
      setVerifySent(true);
    } catch {
      setVerifySent(true); // still show success (security — don't reveal match/no-match)
    } finally {
      setVerifySending(false);
    }
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <Atmosphere />
        <div style={contentWrapStyle}>
          <p style={kickerStyle}>Canary Commons</p>
          <div style={{ marginBottom: 14 }}>
            <Link
              href="/map"
              style={{
                color: "#FFD86B",
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              ← Return to the map
            </Link>
          </div>
          <div style={cardStyle}>
            <p style={textStyle}>Loading listing…</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !originalListing) {
    return (
      <main style={pageStyle}>
        <Atmosphere />
        <div style={contentWrapStyle}>
          <p style={kickerStyle}>Canary Commons</p>
          <div style={{ marginBottom: 14 }}>
            <Link
              href="/map"
              style={{
                color: "#FFD86B",
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              ← Return to the map
            </Link>
          </div>
          <div style={cardStyle}>
            <h1 style={headingStyle}>Suggest an edit</h1>
            <p style={errorStyle}>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main style={pageStyle}>
        <Atmosphere />
        <div style={contentWrapStyle}>
          <p style={kickerStyle}>Canary Commons</p>
          <div style={{ marginBottom: 14 }}>
            <Link href="/map" style={{ color: "#FFD86B", fontSize: 14, textDecoration: "none" }}>← Return to the map</Link>
          </div>
          <div style={cardStyle}>
            <h1 style={headingStyle}>
              {editMode === "steward_edit" ? "Changes saved" : "Thank you"}
            </h1>
            <p style={textStyle}>
              {editMode === "steward_edit"
                ? "Your listing has been updated directly."
                : "Your suggested edit has been submitted for review."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ── State B: Pending claim ──────────────────────────────
  if (editMode === "pending_claim") {
    return (
      <main style={pageStyle}>
        <Atmosphere />
        <div style={contentWrapStyle}>
          <p style={kickerStyle}>Canary Commons</p>
          <div style={{ marginBottom: 14 }}>
            <Link href="/map" style={{ color: "#FFD86B", fontSize: 14, textDecoration: "none" }}>← Return to the map</Link>
          </div>
          <div style={cardStyle}>
            <h1 style={headingStyle}>A claim is pending for this listing.</h1>
            <p style={textStyle}>
              Someone has recently started the process of becoming the steward
              of this listing. While that&apos;s being confirmed, the listing
              can&apos;t take another claim.
            </p>
            <p style={mutedStyle}>
              If you have a concern or know this claim isn&apos;t right, you can{" "}
              <a
                href={`/support?about=pending-claim-dispute&listing=${listingId}`}
                style={{ color: "#FFD86B", fontWeight: 600 }}
              >
                let us know
              </a>
              .
            </p>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(100,150,220,0.18)" }}>
              <p style={mutedStyle}>
                You can still suggest an edit — proposed edits will be reviewed
                once stewardship is resolved.
              </p>
              <button
                type="button"
                onClick={() => setEditMode("propose_edit")}
                style={{
                  ...buttonStyle,
                  background: "transparent",
                  border: "1px solid rgba(13,42,74,0.18)",
                  color: "#0d2a4a",
                  boxShadow: "none",
                  marginTop: 10,
                }}
              >
                Suggest an edit
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── State C: Unclaimed — claim or edit ─────────────────
  if (editMode === "claim_or_edit" || editMode === "claiming") {
    return (
      <main style={pageStyle}>
        <Atmosphere />
        <div style={contentWrapStyle}>
          <p style={kickerStyle}>Canary Commons</p>
          <div style={{ marginBottom: 14 }}>
            <Link href="/map" style={{ color: "#FFD86B", fontSize: 14, textDecoration: "none" }}>← Return to the map</Link>
          </div>
          <div style={cardStyle}>
            {editMode === "claim_or_edit" && !claimSent && (
              <>
                <h1 style={headingStyle}>Are you the steward of this place?</h1>
                <p style={textStyle}>
                  Stewardship means you tend this listing — you can update its
                  details, respond to questions, and keep the information current
                  as your work evolves.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    marginTop: 20,
                    marginBottom: 24,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setEditMode("claiming")}
                    style={goldButtonStyle}
                  >
                    Yes, I run this project
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode("propose_edit")}
                    style={ghostButtonStyle}
                  >
                    No, I want to suggest an edit
                  </button>
                </div>
              </>
            )}

            {editMode === "claiming" && !claimSent && (
              <>
                <h1 style={headingStyle}>Claim stewardship</h1>
                <p style={textStyle}>
                  We&apos;ll send you a verification link to confirm you&apos;re
                  the one tending this work.
                </p>

                <form onSubmit={handleClaimSubmit} style={formStyle}>
                  <label style={fieldStyle}>
                    <span style={labelStyle}>Your email (for verification)</span>
                    <input
                      type="email"
                      style={inputStyle}
                      value={claimEmail}
                      onChange={(e) => setClaimEmail(e.target.value)}
                      placeholder="you@yourproject.org"
                      required
                    />
                  </label>
                  <label style={fieldStyle}>
                    <span style={labelStyle}>Your name (optional)</span>
                    <input
                      style={inputStyle}
                      value={claimName}
                      onChange={(e) => setClaimName(e.target.value)}
                      placeholder="Optional"
                    />
                  </label>
                  <label style={fieldStyle}>
                    <span style={labelStyle}>
                      Tell us about your relationship to this project (optional)
                    </span>
                    <textarea
                      style={textareaStyle}
                      value={claimDeclaration}
                      onChange={(e) => setClaimDeclaration(e.target.value)}
                      placeholder="Helps us confirm if your email domain doesn't match the listing's website."
                    />
                  </label>

                  {claimError && <p style={errorStyle}>{claimError}</p>}

                  <button type="submit" style={buttonStyle} disabled={claimSending}>
                    {claimSending ? "Sending…" : "Send verification link"}
                  </button>
                </form>

                <div style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={() => setEditMode("claim_or_edit")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#3a5a7a",
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    ← Back
                  </button>
                </div>
              </>
            )}

            {claimSent && (
              <div>
                <h1 style={headingStyle}>Verification link sent</h1>
                <p style={textStyle}>
                  We&apos;ve sent a verification link to{" "}
                  <strong>{claimEmail}</strong>. Please check your inbox
                  (and spam folder, just in case) within the next 24 hours.
                </p>
                <Link href="/map" style={{ ...goldButtonStyle, display: "inline-block", textDecoration: "none", marginTop: 16 }}>
                  Return to the map
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ── State A: Verify steward gate ──────────────────────────
  if (editMode === "verify_steward") {
    return (
      <main style={pageStyle}>
        <Atmosphere />
        <div style={contentWrapStyle}>
          <p style={kickerStyle}>Canary Commons</p>
          <div style={{ marginBottom: 14 }}>
            <Link href="/map" style={{ color: "#FFD86B", fontSize: 14, textDecoration: "none" }}>← Return to the map</Link>
          </div>
          <div style={cardStyle}>
            <h1 style={headingStyle}>Verify you&apos;re the steward</h1>
            <p style={textStyle}>
              This listing has a steward. If that&apos;s you, enter your
              email below and we&apos;ll send you a link to edit directly.
            </p>

            {verifySent ? (
              <p style={{ ...textStyle, color: "#2a6b3c", fontWeight: 600 }}>
                If the email matches, we&apos;ve sent you an edit link.
                Check your inbox.
              </p>
            ) : (
              <form onSubmit={handleVerifyRequest} style={formStyle}>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Your email</span>
                  <input
                    type="email"
                    style={inputStyle}
                    value={verifyEmail}
                    onChange={(e) => setVerifyEmail(e.target.value)}
                    placeholder="you@yourproject.org"
                    required
                  />
                </label>
                <button type="submit" style={buttonStyle} disabled={verifySending}>
                  {verifySending ? "Sending…" : "Send edit link"}
                </button>
              </form>
            )}

            <div style={{ marginTop: 20, borderTop: "1px solid rgba(100,150,220,0.18)", paddingTop: 16 }}>
              <p style={mutedStyle}>
                Not the steward?{" "}
                <button
                  type="button"
                  onClick={() => setEditMode("propose_edit")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#FFD86B",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "inherit",
                    padding: 0,
                  }}
                >
                  Propose an edit instead →
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Shared listing fields (used by both steward-edit and propose-edit) ──
  const listingFields = (
    <>
      <label style={fieldStyle}>
        <span style={labelStyle}>Title</span>
        <input style={inputStyle} value={suggestedTitle} onChange={(e) => setSuggestedTitle(e.target.value)} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>Description</span>
        <textarea style={textareaStyle} value={suggestedDescription} onChange={(e) => setSuggestedDescription(e.target.value)} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>Website</span>
        <input style={inputStyle} value={suggestedWebsite} onChange={(e) => setSuggestedWebsite(e.target.value)} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>Address</span>
        <input style={inputStyle} value={suggestedAddress} onChange={(e) => setSuggestedAddress(e.target.value)} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>City</span>
        <input style={inputStyle} value={suggestedCity} onChange={(e) => setSuggestedCity(e.target.value)} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>State</span>
        <input style={inputStyle} value={suggestedState} onChange={(e) => setSuggestedState(e.target.value)} />
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>County</span>
        <input style={inputStyle} value={suggestedCounty} onChange={(e) => setSuggestedCounty(e.target.value)} />
      </label>
    </>
  );

  return (
    <main style={pageStyle}>
      <Atmosphere />
      <div style={contentWrapStyle}>
        <p style={kickerStyle}>Canary Commons</p>
        <div style={{ marginBottom: 14 }}>
          <Link href="/map" style={{ color: "#FFD86B", fontSize: 14, textDecoration: "none" }}>← Return to the map</Link>
        </div>
        <div style={cardStyle}>
          <h1 style={headingStyle}>
            {editMode === "steward_edit" ? "Edit your listing" : "Suggest an edit"}
          </h1>

          {originalListing && editMode === "propose_edit" && (
            <div style={originalBoxStyle}>
              <p style={labelStyle}>Current listing</p>
              <p style={textStyle}><strong>{originalListing.title}</strong></p>
              {originalListing.county || originalListing.state ? (
                <p style={mutedStyle}>{[originalListing.county, originalListing.state].filter(Boolean).join(", ")}</p>
              ) : null}
            </div>
          )}

          {editMode === "steward_edit" ? (
            <form onSubmit={handleStewardSave} style={formStyle}>
              {listingFields}

              {/* Stewardship section */}
              <div style={{ marginTop: 8, paddingTop: 20, borderTop: "1px solid rgba(100,150,220,0.18)" }}>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0d2a4a", marginBottom: 10 }}>
                  Stewardship
                </div>
                <p style={mutedStyle}>
                  If you&apos;re handing this listing to someone else, enter
                  their email here. They&apos;ll receive a verification link to
                  confirm.
                </p>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Steward email</span>
                  <input style={inputStyle} type="email" value={stewardEmail} onChange={(e) => setStewardEmail(e.target.value)} />
                </label>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Display name</span>
                  <input style={inputStyle} value={stewardDisplayName} onChange={(e) => setStewardDisplayName(e.target.value)} placeholder="Optional" />
                </label>
              </div>

              {error ? <p style={errorStyle}>{error}</p> : null}
              <button type="submit" style={buttonStyle} disabled={submitting}>
                {submitting ? "Saving…" : "Save changes"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleProposeEdit} style={formStyle}>
              {listingFields}

              <label style={fieldStyle}>
                <span style={labelStyle}>Notes</span>
                <textarea style={textareaStyle} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What seems inaccurate, outdated, or missing?" />
              </label>

              {error ? <p style={errorStyle}>{error}</p> : null}
              <button type="submit" style={buttonStyle} disabled={submitting}>
                {submitting ? "Submitting…" : "Submit suggested edit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  padding: "clamp(44px, 7vw, 72px) 20px 72px",
  color: "#0d2a4a",
};

const contentWrapStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  maxWidth: 760,
  margin: "0 auto",
};

const kickerStyle: React.CSSProperties = {
  fontSize: "0.82rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.7)",
  margin: 0,
  marginBottom: 16,
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.82)",
  borderRadius: 22,
  padding: "clamp(24px, 4vw, 36px)",
  border: "1px solid rgba(255,255,255,0.6)",
  backdropFilter: "blur(12px)",
};

const headingStyle: React.CSSProperties = {
  fontSize: "clamp(1.7rem, 3.5vw, 2.2rem)",
  margin: "0 0 20px 0",
  color: "#0d2a4a",
  fontWeight: 650,
  lineHeight: 1.18,
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const fieldStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "#0d2a4a",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 12,
  border: "1px solid rgba(100,150,220,0.25)",
  background: "rgba(255,255,255,0.9)",
  fontSize: 15,
  color: "#0d2a4a",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 110,
  padding: "13px 16px",
  borderRadius: 12,
  border: "1px solid rgba(100,150,220,0.25)",
  background: "rgba(255,255,255,0.9)",
  fontSize: 15,
  color: "#0d2a4a",
  outline: "none",
  resize: "vertical",
};

const buttonStyle: React.CSSProperties = {
  marginTop: 8,
  padding: "15px 24px",
  borderRadius: 999,
  border: "none",
  background: "#FFD86B",
  color: "#1a2a0e",
  fontSize: "1rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 0 28px rgba(255,216,107,0.35), 0 4px 14px rgba(255,200,80,0.22)",
};

const errorStyle: React.CSSProperties = {
  color: "#9b2222",
  fontSize: 14,
  margin: 0,
};

const textStyle: React.CSSProperties = {
  fontSize: 16,
  color: "#0d2a4a",
};

const mutedStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#3a5a7a",
  margin: 0,
};

const originalBoxStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.55)",
  border: "1px solid rgba(100,150,220,0.25)",
  borderRadius: 14,
  padding: 16,
  marginBottom: 20,
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
  boxShadow: "0 0 28px rgba(255,216,107,0.35), 0 4px 14px rgba(255,200,80,0.22)",
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
};
