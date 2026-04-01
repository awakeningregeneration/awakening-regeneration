"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { supportResources } from "@/data/supportResources";

export default function SupportPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        supportResources
          .map((resource) => (resource.category || "").trim())
          .filter(Boolean)
      )
    ).sort();

    return ["All", ...unique];
  }, []);

  const filteredResources = useMemo(() => {
    const q = search.trim().toLowerCase();

    return supportResources.filter((resource) => {
      const matchesCategory =
        selectedCategory === "All" || resource.category === selectedCategory;

      const matchesSearch =
        !q ||
        resource.name.toLowerCase().includes(q) ||
        resource.description.toLowerCase().includes(q) ||
        resource.category.toLowerCase().includes(q) ||
        (resource.whyItsHere || "").toLowerCase().includes(q) ||
        (resource.tags || []).some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#d3e4f7",
        color: "#1f2a3a",
      }}
    >
      <section
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "64px 24px",
        }}
      >
        <div style={{ maxWidth: "760px" }}>
          <h1
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              lineHeight: 1.05,
              margin: 0,
              marginBottom: "18px",
              fontWeight: 700,
            }}
          >
            When you can’t find it nearby, here are aligned options.
          </h1>

          <p
            style={{
              fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
              lineHeight: 1.7,
              color: "#506178",
              margin: 0,
              marginBottom: "36px",
            }}
          >
            Sometimes the local light is not visible yet. This page exists to
            help you find more harmonious, life-supporting options online while
            the wider constellation continues to grow.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "14px",
            gridTemplateColumns: "1fr",
            maxWidth: "760px",
            marginBottom: "36px",
            padding: "18px",
            border: "1px solid rgba(31,42,58,0.10)",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(6px)",
          }}
        >
          <input
            type="text"
            placeholder="Search by name, description, tags, or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(31,42,58,0.14)",
              fontSize: "0.98rem",
              background: "white",
              color: "#1f2a3a",
            }}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(31,42,58,0.14)",
              fontSize: "0.98rem",
              background: "white",
              color: "#1f2a3a",
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "All" ? "All categories" : category}
              </option>
            ))}
          </select>

          <div
            style={{
              fontSize: "0.95rem",
              color: "#5f6f84",
            }}
          >
            {filteredResources.length} result
            {filteredResources.length === 1 ? "" : "s"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {filteredResources.length === 0 ? (
            <div
              style={{
                padding: "20px",
                borderRadius: "18px",
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(31,42,58,0.10)",
                color: "#506178",
              }}
            >
              No aligned options match this search yet.
            </div>
          ) : (
            filteredResources.map((resource) => (
              <article
                key={resource.id}
                style={{
                  background: "rgba(255,255,255,0.72)",
                  borderRadius: "18px",
                  border: "1px solid rgba(31,42,58,0.10)",
                  padding: "24px 26px",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.28) inset",
                }}
              >
                <div
                  style={{
                    fontSize: "0.9rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#70839a",
                    marginBottom: "12px",
                  }}
                >
                  {resource.category}
                </div>

                <h2
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.35,
                    margin: 0,
                    marginBottom: "14px",
                    fontWeight: 700,
                  }}
                >
                  {resource.name}
                </h2>

                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    color: "#556679",
                    margin: 0,
                    marginBottom: "16px",
                  }}
                >
                  {resource.description}
                </p>

                {resource.whyItsHere && (
                  <p
                    style={{
                      fontSize: "0.98rem",
                      lineHeight: 1.65,
                      color: "#627488",
                      margin: 0,
                      marginBottom: "16px",
                    }}
                  >
                    <strong style={{ color: "#1f2a3a" }}>Why this is here:</strong>{" "}
                    {resource.whyItsHere}
                  </p>
                )}

                {resource.tags?.length ? (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.88rem",
                          color: "#70839a",
                          border: "1px solid rgba(31,42,58,0.12)",
                          borderRadius: "999px",
                          padding: "6px 12px",
                          background: "rgba(255,255,255,0.55)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "12px 18px",
                    borderRadius: "999px",
                    border: "1px solid rgba(31,42,58,0.16)",
                    color: "#1c4a7d",
                    fontWeight: 700,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    background: "rgba(255,255,255,0.6)",
                  }}
                >
                  Visit resource
                </a>
              </article>
            ))
          )}
        </div>

        <div
          style={{
            marginTop: "52px",
            textAlign: "center",
            color: "#5c6d82",
            fontSize: "1.05rem",
            lineHeight: 1.7,
          }}
        >
          <p style={{ marginBottom: "18px" }}>
            Know an aligned business or resource others should be able to find?
          </p>

          <Link
            href="/support/submit"
            style={{
              display: "inline-block",
              padding: "14px 22px",
              borderRadius: "999px",
              border: "1px solid rgba(31,42,58,0.14)",
              background: "rgba(255,255,255,0.68)",
              color: "#1c4a7d",
              fontWeight: 700,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Submit your aligned affiliate business
          </Link>
        </div>
      </section>
    </main>
  );
}