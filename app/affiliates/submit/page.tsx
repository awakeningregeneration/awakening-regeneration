"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SubmitAffiliatePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function normalizeUrl(value: string) {
    const trimmed = value.trim();

    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://")
    ) {
      return trimmed;
    }

    return `https://${trimmed}`;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Submitting...");
    setSubmitted(false);

    try {
      const normalizedUrl = normalizeUrl(url);

      const res = await fetch("/api/affiliates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          url: normalizedUrl,
          category,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit affiliate link.");
      }

      setMessage("Affiliate link submitted.");
      setSubmitted(true);
      setName("");
      setDescription("");
      setUrl("");
      setCategory("");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
      setSubmitted(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#d3e4f7",
        padding: "64px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            marginBottom: 12,
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#6b7c94",
          }}
        >
          Awakening Regeneration
        </p>

        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 600,
            lineHeight: 1.1,
            color: "#1f2a3a",
            margin: 0,
          }}
        >
          Submit an Affiliate Link
        </h1>

        <p
          style={{
            marginTop: 16,
            maxWidth: 640,
            fontSize: 16,
            lineHeight: 1.7,
            color: "#4a5a70",
          }}
        >
          Add an aligned non-local affiliate link for moments when someone
          cannot find a local option yet.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: 32,
            padding: 20,
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.10)",
            background: "rgba(255,255,255,0.78)",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                color: "#4a5a70",
              }}
            >
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.15)",
                background: "rgba(255,255,255,0.85)",
                padding: "12px 14px",
                color: "#1f2a3a",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                color: "#4a5a70",
              }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              style={{
                width: "100%",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.15)",
                background: "rgba(255,255,255,0.85)",
                padding: "12px 14px",
                color: "#1f2a3a",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                color: "#4a5a70",
              }}
            >
              Website
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              required
              style={{
                width: "100%",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.15)",
                background: "rgba(255,255,255,0.85)",
                padding: "12px 14px",
                color: "#1f2a3a",
              }}
            />
            <p
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#6b7c94",
              }}
            >
              You can enter a normal website like example.com — we&apos;ll add
              https:// automatically if needed.
            </p>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                color: "#4a5a70",
              }}
            >
              Category
            </label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{
                width: "100%",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.15)",
                background: "rgba(255,255,255,0.85)",
                padding: "12px 14px",
                color: "#1f2a3a",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              borderRadius: "999px",
              border: "1px solid rgba(0,0,0,0.18)",
              padding: "10px 18px",
              backgroundColor: "rgba(255,255,255,0.85)",
              color: "#0e3a66",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Submit affiliate link
          </button>

          {message ? (
            <div style={{ paddingTop: 14 }}>
              <p
                style={{
                  fontSize: 14,
                  color: "#4a5a70",
                  marginBottom: submitted ? 12 : 0,
                }}
              >
                {message}
              </p>

              {submitted ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <Link
                    href="/affiliates"
                    style={{
                      color: "#0e3a66",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                      fontWeight: 600,
                    }}
                  >
                    View affiliate links
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMessage("");
                      setSubmitted(false);
                    }}
                    style={{
                      borderRadius: "999px",
                      border: "1px solid rgba(0,0,0,0.18)",
                      padding: "10px 18px",
                      backgroundColor: "rgba(255,255,255,0.85)",
                      color: "#0e3a66",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Submit another affiliate link
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </form>
      </div>
    </main>
  );
}