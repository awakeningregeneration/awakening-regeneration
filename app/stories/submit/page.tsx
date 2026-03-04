"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function clean(s: string | null) {
  return (s || "").trim();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!state || !county || !body.trim()) {
      alert("Please include at least state, county, and a short story.");
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

    // MVP: log only (persistence later)
    console.log("STORY SUBMIT (MVP):", payload);

    alert(
      "Captured locally for now (console log). Next step is wiring stories to persistence."
    );

    // light reset (keep region)
    setTitle("");
    setBody("");
    setLink("");
  };

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 20 }}>
      <header style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>Add a story</div>
        <div style={{ marginTop: 6, opacity: 0.78, lineHeight: 1.4 }}>
          Keep it short. 3–6 sentences. Place-based. No performance.
          <br />
          This is a way of marking what’s alive here.
        </div>

        <div style={{ marginTop: 12 }}>
          <Link href={storiesViewHref}>← Back to stories</Link>
          <span style={{ margin: "0 10px", opacity: 0.5 }}>|</span>
          <Link href="/map">Back to map</Link>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        style={{
          padding: 16,
          borderRadius: 14,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "rgba(255,255,255,0.98)",
        }}
      >
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                opacity: 0.8,
                marginBottom: 6,
              }}
            >
              State
            </label>
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="CA"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.18)",
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                opacity: 0.8,
                marginBottom: 6,
              }}
            >
              County
            </label>
            <input
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              placeholder="Mendocino"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.18)",
              }}
            />
          </div>
        </div>

        <label
          style={{
            display: "block",
            fontSize: 12,
            opacity: 0.8,
            marginBottom: 6,
          }}
        >
          Title (optional)
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A short headline"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.18)",
            marginBottom: 12,
          }}
        />

        <label
          style={{
            display: "block",
            fontSize: 12,
            opacity: 0.8,
            marginBottom: 6,
          }}
        >
          Story (short)
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="3–6 sentences. What happened? Why does it matter here?"
          rows={7}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.18)",
            marginBottom: 12,
            resize: "vertical",
            lineHeight: 1.4,
          }}
        />

        <label
          style={{
            display: "block",
            fontSize: 12,
            opacity: 0.8,
            marginBottom: 6,
          }}
        >
          Link (optional)
        </label>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.18)",
            marginBottom: 14,
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.18)",
            background: "white",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Submit story
        </button>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65 }}>
          (MVP note: this currently logs to the browser console. Persistence comes next.)
        </div>
      </form>
    </main>
  );
}
