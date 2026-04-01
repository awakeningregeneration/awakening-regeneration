"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitSupportPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
          description,
        }),
      });

      if (res.ok) {
        router.push("/support");
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#d3e4f7",
        color: "#1f2a3a",
        padding: "48px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(31,42,58,0.10)",
          borderRadius: 18,
          padding: "28px 24px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            margin: 0,
            marginBottom: 12,
            fontWeight: 700,
          }}
        >
          Submit an aligned affiliate resource
        </h1>

        <p
          style={{
            marginTop: 0,
            marginBottom: 24,
            color: "#5b6b80",
            lineHeight: 1.6,
          }}
        >
          Submissions come in for review before being added to the public
          support page.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <input
            placeholder="Resource name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid rgba(31,42,58,0.14)",
              fontSize: "0.98rem",
              background: "white",
            }}
          />

          <input
            placeholder="Category (water, home, garden, materials, etc.)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid rgba(31,42,58,0.14)",
              fontSize: "0.98rem",
              background: "white",
            }}
          />

          <input
            placeholder="Website link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid rgba(31,42,58,0.14)",
              fontSize: "0.98rem",
              background: "white",
            }}
          />

          <textarea
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid rgba(31,42,58,0.14)",
              fontSize: "0.98rem",
              background: "white",
              resize: "vertical",
            }}
          />

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "14px 18px",
              borderRadius: 999,
              border: "1px solid rgba(31,42,58,0.14)",
              background: "rgba(255,255,255,0.9)",
              color: "#1c4a7d",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Submitting..." : "Submit for review"}
          </button>
        </form>
      </div>
    </main>
  );
}