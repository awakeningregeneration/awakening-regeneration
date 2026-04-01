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
        <div style={cardStyle}>Loading listing…</div>
      </main>
    );
  }

  if (error && !originalListing) {
    return (
      <main style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Suggest an edit</h1>
          <p style={errorStyle}>{error}</p>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Thank you</h1>
          <p style={textStyle}>
            Your suggested edit has been submitted for review.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
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
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#d3e4f7",
  padding: "40px 20px",
  display: "flex",
  justifyContent: "center",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "760px",
  background: "rgba(255,255,255,0.78)",
  borderRadius: "16px",
  padding: "28px",
  border: "1px solid rgba(0,0,0,0.10)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const headingStyle: React.CSSProperties = {
  fontSize: "32px",
  margin: "0 0 20px 0",
  color: "#1e2a38",
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: "16px",
};

const fieldStyle: React.CSSProperties = {
  display: "grid",
  gap: "8px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#1e2a38",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(0,0,0,0.15)",
  background: "white",
  fontSize: "15px",
  color: "#1e2a38",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "110px",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(0,0,0,0.15)",
  background: "white",
  fontSize: "15px",
  color: "#1e2a38",
  resize: "vertical",
};

const buttonStyle: React.CSSProperties = {
  marginTop: "8px",
  padding: "14px 18px",
  borderRadius: "999px",
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.85)",
  color: "#0e3a66",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  color: "#b42318",
  fontSize: "14px",
  margin: 0,
};

const textStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#1e2a38",
};

const mutedStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#5b6b82",
  margin: 0,
};

const originalBoxStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.55)",
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "20px",
};