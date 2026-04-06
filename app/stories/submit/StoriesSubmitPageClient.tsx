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

  return (
    <main
  style={{
    minHeight: "100vh",
    background: "#d3e4f7",
    maxWidth: 760,
    margin: "0 auto",
    padding: 20,
  }}
>
      <header style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>Add a story</div>
        <div style={{ marginTop: 6, opacity: 0.78, lineHeight: 1.5 }}>
          Tell the story of what is happening here.
          <br />
          Place-based. Honest. No performance.
          <br />
          A few paragraphs is welcome.
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
          background: "rgba(255,255,255,0.78)",
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
          Story
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tell the story of this place. What is happening here? What is being tended, restored, protected, or made possible? Why does it matter in this community?"
          rows={12}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.18)",
            marginBottom: 12,
            resize: "vertical",
            lineHeight: 1.55,
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
    borderRadius: "12px",
    border: "1px solid rgba(0,0,0,0.18)",
    backgroundColor: "rgba(255,255,255,0.85)",
    color: "#0e3a66",
    fontWeight: 800,
    cursor: "pointer",
  }}
>
  Submit story
</button>
        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65 }}>
          (MVP note: this now saves to the stories table in Supabase.)
        </div>
      </form>
    </main>
  );
}