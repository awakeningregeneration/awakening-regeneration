"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SupportResource = {
  id: string | number;
  name: string;
  description: string | null;
  url: string | null;
  logo_url: string | null;
  category: string | null;
  practices: string[] | null;
  why_it_matters: string | null;
  affiliate_url: string | null;
  status?: string | null;
  created_at?: string | null;
};

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
  "Communication & Conflict Transformation",
  "Finance & Systems",
];

function getDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function dateSeed(): number {
  const d = new Date();
  const str = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function ResourceVisual({
  resource,
  size = 48,
}: {
  resource: SupportResource;
  size?: number;
}) {
  const [imgError, setImgError] = useState(false);
  const domain = getDomain(resource.url);
  const logoSrc = resource.logo_url
    ? resource.logo_url
    : domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : null;

  if (logoSrc && !imgError) {
    return (
      <img
        src={logoSrc}
        alt=""
        width={size}
        height={size}
        onError={() => setImgError(true)}
        style={{ borderRadius: 10, objectFit: "contain" }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: "rgba(201,148,58,0.14)",
        color: "#c9943a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.44,
        flexShrink: 0,
      }}
    >
      {resource.name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

function ResourceCard({ resource }: { resource: SupportResource }) {
  const visitUrl = resource.affiliate_url || resource.url || "#";

  return (
    <article
      style={{
        background: "rgba(255,255,255,0.78)",
        borderRadius: 20,
        border: "1px solid rgba(31,42,58,0.08)",
        padding: "28px 28px 24px",
        boxShadow: "0 2px 12px rgba(31,42,58,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <ResourceVisual resource={resource} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#70839a",
              marginBottom: 6,
            }}
          >
            {resource.category || "Uncategorized"}
          </div>
          <h2
            style={{
              fontSize: "1.12rem",
              lineHeight: 1.3,
              margin: 0,
              fontWeight: 700,
            }}
          >
            {resource.name}
          </h2>
        </div>
      </div>

      {resource.description && (
        <p
          style={{
            fontSize: "0.98rem",
            lineHeight: 1.65,
            color: "#556679",
            margin: 0,
          }}
        >
          {resource.description}
        </p>
      )}

      {resource.why_it_matters && (
        <p
          style={{
            fontSize: "0.92rem",
            lineHeight: 1.6,
            color: "#6b7d92",
            margin: 0,
            fontStyle: "italic",
            borderLeft: "3px solid rgba(201,148,58,0.35)",
            paddingLeft: 14,
          }}
        >
          {resource.why_it_matters}
        </p>
      )}

      {resource.practices?.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {resource.practices.map((practice) => (
            <span
              key={practice}
              style={{
                fontSize: "0.82rem",
                color: "#70839a",
                border: "1px solid rgba(31,42,58,0.10)",
                borderRadius: 999,
                padding: "5px 11px",
                background: "rgba(255,255,255,0.6)",
              }}
            >
              {practice}
            </span>
          ))}
        </div>
      ) : null}

      <div style={{ marginTop: 4 }}>
        <a
          href={visitUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "11px 20px",
            borderRadius: 999,
            border: "1px solid rgba(31,42,58,0.14)",
            color: "#1c4a7d",
            fontWeight: 700,
            fontSize: "0.92rem",
            textDecoration: "underline",
            textUnderlineOffset: 3,
            background: "rgba(255,255,255,0.65)",
          }}
        >
          Visit resource
        </a>
      </div>
    </article>
  );
}

export default function SupportPage() {
  const [resources, setResources] = useState<SupportResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hasSearched, setHasSearched] = useState(false);
  const [unmetNeed, setUnmetNeed] = useState("");
  const [unmetSubmitted, setUnmetSubmitted] = useState(false);
  const [unmetSubmitting, setUnmetSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/affiliates");
        if (res.ok) {
          setResources(await res.json());
        }
      } catch (err) {
        console.error("Failed to load resources:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const featured = seededShuffle(resources, dateSeed()).slice(0, 3);

  const filteredResources = resources.filter((r) => {
    const matchesCategory =
      selectedCategory === "All" || r.category === selectedCategory;
    const haystack = [
      r.name,
      r.description ?? "",
      r.category ?? "",
      ...(r.practices ?? []),
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch =
      !searchQuery.trim() || haystack.includes(searchQuery.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setHasSearched(true);
    setUnmetSubmitted(false);
  }

  function handleCategoryChange(cat: string) {
    setSelectedCategory(cat);
    if (cat !== "All") {
      setHasSearched(true);
      setUnmetSubmitted(false);
    }
  }

  async function submitUnmetNeed() {
    if (!unmetNeed.trim()) return;
    setUnmetSubmitting(true);
    try {
      await fetch("/api/unmet-needs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search_term: unmetNeed.trim(),
          category: selectedCategory === "All" ? null : selectedCategory,
        }),
      });
      setUnmetSubmitted(true);
      setUnmetNeed("");
    } catch {
      alert("Could not save — try again.");
    } finally {
      setUnmetSubmitting(false);
    }
  }

  const categories = ["All", ...PRIMARY_CATEGORY_OPTIONS];
  const noResults = hasSearched && filteredResources.length === 0;

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
          maxWidth: 1152,
          margin: "0 auto",
          padding: "64px 24px",
        }}
      >
        {/* Header */}
        <div style={{ maxWidth: 760 }}>
          <h1
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              lineHeight: 1.05,
              margin: 0,
              marginBottom: 18,
              fontWeight: 700,
            }}
          >
            Support what is already life-giving
          </h1>
          <p
            style={{
              fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
              lineHeight: 1.7,
              color: "#506178",
              margin: 0,
              marginBottom: 36,
            }}
          >
            Sometimes the local light is not visible yet. This space helps you
            find aligned options you can support from anywhere — while the
            constellation continues to grow.
          </p>
        </div>

        {/* Featured */}
        {!loading && featured.length > 0 && (
          <div style={{ marginBottom: 44 }}>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#506178",
                margin: 0,
                marginBottom: 18,
                letterSpacing: "0.04em",
              }}
            >
              Featured today
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
                alignItems: "start",
              }}
            >
              {featured.map((r) => (
                <ResourceCard key={String(r.id)} resource={r} />
              ))}
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div
          style={{
            maxWidth: 760,
            marginBottom: 36,
            padding: 18,
            border: "1px solid rgba(31,42,58,0.10)",
            borderRadius: 18,
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(6px)",
          }}
        >
          <form
            onSubmit={handleSearch}
            style={{ display: "grid", gap: 14 }}
          >
            <input
              type="text"
              placeholder="Search by name, description, or practices"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid rgba(31,42,58,0.14)",
                fontSize: "0.98rem",
                background: "white",
                color: "#1f2a3a",
              }}
            />

            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid rgba(31,42,58,0.14)",
                fontSize: "0.98rem",
                background: "white",
                color: "#1f2a3a",
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All categories" : cat}
                </option>
              ))}
            </select>

            <button
              type="submit"
              style={{
                width: "fit-content",
                padding: "12px 18px",
                borderRadius: 999,
                border: "1px solid rgba(31,42,58,0.14)",
                background: "rgba(255,255,255,0.9)",
                color: "#1c4a7d",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </form>
        </div>

        {/* Results area */}
        {hasSearched && !noResults && (
          <>
            <div
              style={{
                fontSize: "0.95rem",
                color: "#5f6f84",
                marginBottom: 18,
              }}
            >
              {filteredResources.length} result
              {filteredResources.length === 1 ? "" : "s"}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
                alignItems: "start",
              }}
            >
              {filteredResources.map((r) => (
                <ResourceCard key={String(r.id)} resource={r} />
              ))}
            </div>
          </>
        )}

        {noResults && (
          <div
            style={{
              padding: "28px 24px",
              borderRadius: 18,
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(31,42,58,0.10)",
              maxWidth: 760,
            }}
          >
            <p
              style={{
                color: "#506178",
                margin: 0,
                marginBottom: 16,
                fontSize: "1.02rem",
                lineHeight: 1.6,
              }}
            >
              We don&apos;t see that here yet — tell us what you were looking
              for
            </p>

            {unmetSubmitted ? (
              <p
                style={{
                  margin: 0,
                  color: "#3a7d5c",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                Thank you — we&apos;ll keep this in mind as the directory grows.
              </p>
            ) : (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="What were you hoping to find?"
                  value={unmetNeed}
                  onChange={(e) => setUnmetNeed(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 200,
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid rgba(31,42,58,0.14)",
                    fontSize: "0.95rem",
                    background: "white",
                  }}
                />
                <button
                  type="button"
                  onClick={submitUnmetNeed}
                  disabled={unmetSubmitting || !unmetNeed.trim()}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 999,
                    border: "1px solid rgba(31,42,58,0.14)",
                    background: "rgba(255,255,255,0.9)",
                    color: "#1c4a7d",
                    fontWeight: 700,
                    cursor:
                      unmetSubmitting || !unmetNeed.trim()
                        ? "not-allowed"
                        : "pointer",
                    opacity: !unmetNeed.trim() ? 0.5 : 1,
                  }}
                >
                  {unmetSubmitting ? "Sending..." : "Send"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer CTA */}
        <div
          style={{
            marginTop: 52,
            textAlign: "center",
            color: "#5c6d82",
            fontSize: "1.05rem",
            lineHeight: 1.7,
          }}
        >
          <p style={{ marginBottom: 18 }}>
            Know something that helps life move forward that others should be
            able to find?
          </p>
          <Link
            href="/support/submit"
            style={{
              display: "inline-block",
              padding: "14px 22px",
              borderRadius: 999,
              border: "1px solid rgba(31,42,58,0.14)",
              background: "rgba(255,255,255,0.68)",
              color: "#1c4a7d",
              fontWeight: 700,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Add a resource
          </Link>
        </div>
      </section>
    </main>
  );
}
