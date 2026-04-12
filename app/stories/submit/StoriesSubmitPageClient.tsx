"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function clean(s: string | null) {
  return (s || "").trim();
}

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

export default function SubmitStoryPage() {
  const sp = useSearchParams();

  const prefillState = clean(sp.get("state"));
  const prefillCounty = clean(sp.get("county"));

  const [state, setState] = useState(prefillState);
  const [county, setCounty] = useState(prefillCounty);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");

  const storiesViewHref = useMemo(() => {
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    if (county) params.set("county", county);
    const qs = params.toString();
    return qs ? `/stories?${qs}` : "/stories";
  }, [state, county]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state || !county || !body.trim()) {
      alert("Please include at least state, county, and the story.");
      return;
    }

    const payload = {
      id: `local_${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      state: state.trim(),
      county: county.trim(),
      title: title.trim(),
      body: body.trim(),
      link: link.trim(),
    };

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save story");
      }

      alert("Story saved.");
    } catch (err) {
      console.error(err);
      alert("Something went wrong saving the story.");
    }

    // light reset (keep region)
    setTitle("");
    setBody("");
    setLink("");
  };

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
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#0d2a4a",
    marginBottom: 6,
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
          maxWidth: 760,
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

        <header style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: "clamp(1.7rem, 3.5vw, 2.2rem)",
              fontWeight: 650,
              color: "rgba(255,255,255,0.96)",
              lineHeight: 1.18,
            }}
          >
            Add a story
          </div>
          <div
            style={{
              marginTop: 10,
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.6,
              fontSize: "0.98rem",
            }}
          >
            Tell the story of what is happening here.
            <br />
            Place-based. Honest. No performance.
            <br />
            A few paragraphs is welcome.
          </div>
          <div style={{ marginTop: 14, fontSize: "0.9rem" }}>
            <Link
              href={storiesViewHref}
              style={{ color: "#FFD86B", fontWeight: 600, textDecoration: "none" }}
            >
              ← Back to stories
            </Link>
            <span style={{ margin: "0 10px", color: "rgba(255,255,255,0.5)" }}>
              |
            </span>
            <Link
              href="/map"
              style={{ color: "#FFD86B", fontWeight: 600, textDecoration: "none" }}
            >
              Back to map
            </Link>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "clamp(24px, 4vw, 36px)",
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.6)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>State</label>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="CA"
                style={inputStyle}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={labelStyle}>County</label>
              <input
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="Mendocino"
                style={inputStyle}
              />
            </div>
          </div>

          <label style={labelStyle}>Title (optional)</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A short headline"
            style={{ ...inputStyle, marginBottom: 14 }}
          />

          <label style={labelStyle}>Story</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tell the story of this place. What is happening here? What is being tended, restored, protected, or made possible? Why does it matter in this community?"
            rows={12}
            style={{
              ...inputStyle,
              marginBottom: 14,
              resize: "vertical",
              lineHeight: 1.55,
            }}
          />

          <label style={labelStyle}>Link (optional)</label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://"
            style={{ ...inputStyle, marginBottom: 18 }}
          />

          <button
            type="submit"
            style={{
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
            }}
          >
            Submit story
          </button>

          <div
            style={{
              marginTop: 12,
              fontSize: "0.8rem",
              color: "#5a7797",
            }}
          >
            (MVP note: this now saves to the stories table in Supabase.)
          </div>
        </form>
      </div>
    </main>
  );
}
