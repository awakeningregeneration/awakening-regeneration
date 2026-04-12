"use client";

import { useEffect, useState } from "react";

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

export default function EditListingPage({ params }: Props) {
  const [listingId, setListingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [originalListing, setOriginalListing] = useState<Listing | null>(null);

  const [suggestedTitle, setSuggestedTitle] = useState("");
  const [suggestedDescription, setSuggestedDescription] = useState("");
  const [suggestedWebsite, setSuggestedWebsite] = useState("");
  const [suggestedAddress, setSuggestedAddress] = useState("");
  const [suggestedCity, setSuggestedCity] = useState("");
  const [suggestedState, setSuggestedState] = useState("");
  const [suggestedCounty, setSuggestedCounty] = useState("");
  const [notes, setNotes] = useState("");

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/listings/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit edit.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit edit.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <Atmosphere />
        <div style={contentWrapStyle}>
          <p style={kickerStyle}>Canary Commons</p>
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
          <div style={cardStyle}>
            <h1 style={headingStyle}>Thank you</h1>
            <p style={textStyle}>
              Your suggested edit has been submitted for review.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <Atmosphere />
      <div style={contentWrapStyle}>
        <p style={kickerStyle}>Canary Commons</p>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Suggest an edit</h1>

          {originalListing && (
            <div style={originalBoxStyle}>
              <p style={labelStyle}>Current listing</p>
              <p style={textStyle}>
                <strong>{originalListing.title}</strong>
              </p>
              {originalListing.county || originalListing.state ? (
                <p style={mutedStyle}>
                  {[originalListing.county, originalListing.state]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              ) : null}
            </div>
          )}

          <form onSubmit={handleSubmit} style={formStyle}>
            <label style={fieldStyle}>
              <span style={labelStyle}>Title</span>
              <input
                style={inputStyle}
                value={suggestedTitle}
                onChange={(e) => setSuggestedTitle(e.target.value)}
              />
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>Description</span>
              <textarea
                style={textareaStyle}
                value={suggestedDescription}
                onChange={(e) => setSuggestedDescription(e.target.value)}
              />
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>Website</span>
              <input
                style={inputStyle}
                value={suggestedWebsite}
                onChange={(e) => setSuggestedWebsite(e.target.value)}
              />
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>Address</span>
              <input
                style={inputStyle}
                value={suggestedAddress}
                onChange={(e) => setSuggestedAddress(e.target.value)}
              />
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>City</span>
              <input
                style={inputStyle}
                value={suggestedCity}
                onChange={(e) => setSuggestedCity(e.target.value)}
              />
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>State</span>
              <input
                style={inputStyle}
                value={suggestedState}
                onChange={(e) => setSuggestedState(e.target.value)}
              />
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>County</span>
              <input
                style={inputStyle}
                value={suggestedCounty}
                onChange={(e) => setSuggestedCounty(e.target.value)}
              />
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>Notes</span>
              <textarea
                style={textareaStyle}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What seems inaccurate, outdated, or missing?"
              />
            </label>

            {error ? <p style={errorStyle}>{error}</p> : null}

            <button type="submit" style={buttonStyle} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit suggested edit"}
            </button>
          </form>
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
