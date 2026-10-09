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
  "Conflict Transformation & Repair",
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
  "Trauma-Informed",
  "Restorative",
  "Somatic",
  "Nonviolent",
  "Peer Supported",
  "Community Led",
  "Justice-Oriented",
  "Natural Practices",
  "Non-GMO",
  "Grass-Fed",
  "Ethically Sourced/Raised",
  "Free-Range",
  "Organic Options",
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
      {/* Morning sky gradient */}
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
      {/* Luminous center bloom */}
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
      {/* Gold orbs */}
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

export default function SubmitSupportPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [practices, setPractices] = useState<string[]>([]);
  const [contactEmail, setContactEmail] = useState("");
  const [alignmentNote, setAlignmentNote] = useState("");
  const [partnershipPath, setPartnershipPath] = useState<"has_program" | "wants_direct" | "">("");
  const [programName, setProgramName] = useState("");
  const [programUrl, setProgramUrl] = useState("");
  const [companyFax, setCompanyFax] = useState(""); // honeypot — real applicants never see this field
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function togglePractice(practice: string) {
    setPractices((current) =>
      current.includes(practice)
        ? current.filter((item) => item !== practice)
        : [...current, practice]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");

    if (!partnershipPath) {
      setSubmitError("Please choose a partnership option.");
      return;
    }

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
          image_url: imageUrl,
          description,
          practices,
          contact_email: contactEmail,
          alignment_note: alignmentNote,
          partnership_path: partnershipPath,
          program_name: programName,
          program_url: programUrl,
          company_fax: companyFax,
        }),
      });

      if (res.ok) {
        router.push("/support");
      } else {
        const data = await res.json().catch(() => null);
        setSubmitError(data?.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setSubmitError("Something went wrong. Please try again.");
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
            Bring your work to the Commons.
          </h1>

          <p
            style={{
              marginTop: 0,
              marginBottom: 16,
              color: "#3a5a7a",
              lineHeight: 1.65,
              fontSize: "0.98rem",
            }}
          >
            Canary connects people with businesses building pieces of a
            world where canaries thrive. Partnership brings your work to
            people looking for better options — and when they choose you
            through Canary, your participation helps sustain the Commons.
          </p>

          <p
            style={{
              marginTop: 0,
              marginBottom: 16,
              color: "#3a5a7a",
              lineHeight: 1.65,
              fontSize: "0.98rem",
            }}
          >
            It&rsquo;s a reciprocal model: Canary helps aligned businesses
            grow, and our Online Resource partners help keep Canary free
            for local businesses and for the people who use it.
          </p>

          <p
            style={{
              marginTop: 0,
              marginBottom: 28,
              color: "#3a5a7a",
              lineHeight: 1.65,
              fontSize: "0.98rem",
            }}
          >
            If your work belongs here, we&rsquo;d love to hear from you.
            Already have an affiliate or referral program? Wonderful. New
            to partnership? That&rsquo;s welcome too.
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
              <label style={labelStyle}>Primary Category (up to 5)</label>
              <p style={helperStyle}>
                Choose the main areas of life this resource belongs to.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PRIMARY_CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = category.includes(cat);
                  const isDisabled = !isSelected && category.length >= 5;
                  return (
                    <button key={cat} type="button" onClick={() => !isDisabled && setCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])} style={{ borderRadius: 999, border: isSelected ? "1px solid rgba(255,200,80,0.45)" : "1px solid rgba(100,150,220,0.22)", padding: "8px 12px", fontSize: "0.85rem", cursor: isDisabled ? "default" : "pointer", background: isSelected ? "rgba(255,216,107,0.18)" : "rgba(255,255,255,0.7)", color: isSelected ? "#7a4f00" : "#3a5a7a", opacity: isDisabled ? 0.4 : 1 }}>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <input
              placeholder="Website link"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              style={inputStyle}
            />

            <div>
              <label style={labelStyle}>Image or logo URL (optional)</label>
              <p style={helperStyle}>
                Right-click any image on their website → Copy Image Address
              </p>
              <input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
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
              <label style={labelStyle}>
                How does your work help life move forward?
              </label>
              <p style={helperStyle}>A sentence or two is enough.</p>
              <textarea
                placeholder="What you do and why it fits here"
                value={alignmentNote}
                onChange={(e) => setAlignmentNote(e.target.value.slice(0, 600))}
                required
                maxLength={600}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            <div>
              <label style={labelStyle}>Contact email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Partnership</label>
              <p style={helperStyle}>
                Either path is welcome — alignment comes first either way.
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setPartnershipPath("has_program")}
                  style={{
                    textAlign: "left",
                    borderRadius: 12,
                    border: partnershipPath === "has_program" ? "1px solid rgba(255,200,80,0.45)" : "1px solid rgba(100,150,220,0.22)",
                    padding: "12px 14px",
                    fontSize: "0.92rem",
                    cursor: "pointer",
                    background: partnershipPath === "has_program" ? "rgba(255,216,107,0.18)" : "rgba(255,255,255,0.7)",
                    color: partnershipPath === "has_program" ? "#7a4f00" : "#3a5a7a",
                  }}
                >
                  We already have an affiliate/referral program
                </button>
                <button
                  type="button"
                  onClick={() => setPartnershipPath("wants_direct")}
                  style={{
                    textAlign: "left",
                    borderRadius: 12,
                    border: partnershipPath === "wants_direct" ? "1px solid rgba(255,200,80,0.45)" : "1px solid rgba(100,150,220,0.22)",
                    padding: "12px 14px",
                    fontSize: "0.92rem",
                    cursor: "pointer",
                    background: partnershipPath === "wants_direct" ? "rgba(255,216,107,0.18)" : "rgba(255,255,255,0.7)",
                    color: partnershipPath === "wants_direct" ? "#7a4f00" : "#3a5a7a",
                  }}
                >
                  We don&apos;t have one yet, but we&apos;d like to explore partnering directly with Canary
                </button>
              </div>
            </div>

            {partnershipPath === "has_program" && (
              <div>
                <label style={labelStyle}>Program / network name or URL</label>
                <p style={helperStyle}>At least one of these.</p>
                <input
                  placeholder="Program or network name"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  style={{ ...inputStyle, marginBottom: 10 }}
                />
                <input
                  placeholder="https://example.com/affiliate-program"
                  value={programUrl}
                  onChange={(e) => setProgramUrl(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            {/* Honeypot — invisible to real applicants, left blank by them.
                A bot that fills every field will fill this one too. */}
            <input
              type="text"
              name="company_fax"
              value={companyFax}
              onChange={(e) => setCompanyFax(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />

            {submitError && (
              <p style={{ color: "#a04040", fontSize: "0.9rem", margin: 0 }}>{submitError}</p>
            )}

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
