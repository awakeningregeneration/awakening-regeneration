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

const lightPoints: {
  left: string;
  top: string;
  size: number;
  glow: number;
}[] = [
  { left: "4%", top: "6%", size: 3, glow: 8 },
  { left: "10%", top: "14%", size: 5, glow: 12 },
  { left: "18%", top: "4%", size: 2, glow: 6 },
  { left: "26%", top: "18%", size: 4, glow: 10 },
  { left: "34%", top: "8%", size: 6, glow: 14 },
  { left: "42%", top: "16%", size: 3, glow: 8 },
  { left: "50%", top: "6%", size: 5, glow: 12 },
  { left: "58%", top: "14%", size: 2, glow: 6 },
  { left: "66%", top: "10%", size: 4, glow: 10 },
  { left: "74%", top: "4%", size: 7, glow: 16 },
  { left: "82%", top: "16%", size: 3, glow: 8 },
  { left: "90%", top: "8%", size: 5, glow: 12 },
  { left: "6%", top: "30%", size: 4, glow: 10 },
  { left: "16%", top: "38%", size: 2, glow: 6 },
  { left: "28%", top: "32%", size: 6, glow: 14 },
  { left: "40%", top: "40%", size: 3, glow: 8 },
  { left: "52%", top: "34%", size: 5, glow: 12 },
  { left: "64%", top: "42%", size: 4, glow: 10 },
  { left: "76%", top: "36%", size: 7, glow: 16 },
  { left: "88%", top: "44%", size: 2, glow: 6 },
  { left: "8%", top: "56%", size: 5, glow: 12 },
  { left: "22%", top: "62%", size: 3, glow: 8 },
  { left: "34%", top: "58%", size: 4, glow: 10 },
  { left: "46%", top: "66%", size: 6, glow: 14 },
  { left: "58%", top: "60%", size: 2, glow: 6 },
  { left: "70%", top: "64%", size: 5, glow: 12 },
  { left: "82%", top: "58%", size: 3, glow: 8 },
  { left: "92%", top: "66%", size: 4, glow: 10 },
  { left: "10%", top: "82%", size: 3, glow: 8 },
  { left: "24%", top: "88%", size: 5, glow: 12 },
  { left: "38%", top: "80%", size: 2, glow: 6 },
  { left: "52%", top: "90%", size: 6, glow: 14 },
  { left: "66%", top: "84%", size: 4, glow: 10 },
  { left: "80%", top: "92%", size: 3, glow: 8 },
  { left: "92%", top: "84%", size: 5, glow: 12 },
];

function Atmosphere() {
  return (
    <>
      {/* Deep sky base gradient */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(26,72,130,0.32) 0%, rgba(5,16,31,1) 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Side blue glows */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(circle at 20% 40%, rgba(40,90,160,0.18) 0%, transparent 40%), radial-gradient(circle at 78% 55%, rgba(40,90,160,0.14) 0%, transparent 42%)",
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
            "radial-gradient(ellipse at 50% 45%, rgba(60,110,200,0.11) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      {/* Warm gold light points scattered full page — emission halo pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {lightPoints.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(${p.left} - ${p.size}px)`,
              top: `calc(${p.top} - ${p.size}px)`,
              width: p.size * 3,
              height: p.size * 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,220,140,0.10) 0%, transparent 70%)",
            }}
          >
            <div
              style={{
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: "rgba(255,244,200,0.82)",
                boxShadow: `0 0 ${p.glow * 0.85}px rgba(255,220,140,0.38), 0 0 ${
                  p.glow * 1.7
                }px rgba(255,200,100,0.12)`,
                filter: `blur(${p.size * 0.15}px)`,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

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
        style={{ borderRadius: 10, objectFit: "contain", background: "rgba(255,255,255,0.9)" }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: "rgba(255,216,107,0.14)",
        color: "#FFD86B",
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
        background: "rgba(255,255,255,0.06)",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.09)",
        backdropFilter: "blur(8px)",
        padding: "28px 28px 24px",
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
              color: "rgba(159,184,216,0.75)",
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
              fontWeight: 650,
              color: "rgba(255,255,255,0.96)",
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
            color: "rgba(211,227,247,0.82)",
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
            color: "rgba(211,227,247,0.72)",
            margin: 0,
            fontStyle: "italic",
            borderLeft: "3px solid rgba(255,216,107,0.45)",
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
                color: "rgba(211,227,247,0.78)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 999,
                padding: "5px 11px",
                background: "rgba(255,255,255,0.04)",
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
            border: "1px solid rgba(255,216,107,0.45)",
            color: "#FFD86B",
            fontWeight: 600,
            fontSize: "0.92rem",
            textDecoration: "none",
            background: "rgba(255,216,107,0.1)",
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

  const darkInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.11)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    fontSize: "0.98rem",
    outline: "none",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#08192d",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Atmosphere />

      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1152,
          margin: "0 auto",
          padding: "64px 24px",
        }}
      >
        {/* Return link */}
        <div style={{ marginBottom: 18 }}>
          <Link
            href="/map"
            style={{
              color: "#FFD86B",
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            ← Return to the map
          </Link>
        </div>

        {/* Header */}
        <div style={{ maxWidth: 760 }}>
          <p
            style={{
              fontSize: "0.82rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(159,184,216,0.7)",
              margin: 0,
              marginBottom: 14,
            }}
          >
            Canary Commons
          </p>
          <h1
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              lineHeight: 1.05,
              margin: 0,
              marginBottom: 18,
              fontWeight: 650,
              color: "rgba(255,255,255,0.98)",
            }}
          >
            Support what is already life-giving
          </h1>
          <p
            style={{
              fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.82)",
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
                color: "rgba(159,184,216,0.75)",
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
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 20,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
          }}
        >
          <form onSubmit={handleSearch} style={{ display: "grid", gap: 14 }}>
            <input
              type="text"
              placeholder="Search by name, description, or practices"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={darkInputStyle}
            />

            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={{ ...darkInputStyle, appearance: "none" }}
            >
              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  style={{ background: "#08192d", color: "white" }}
                >
                  {cat === "All" ? "All categories" : cat}
                </option>
              ))}
            </select>

            <button
              type="submit"
              style={{
                width: "fit-content",
                padding: "13px 22px",
                borderRadius: 999,
                border: "none",
                background: "#FFD86B",
                color: "#1a2a0e",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow:
                  "0 0 28px rgba(255,216,107,0.25), 0 4px 14px rgba(255,200,80,0.18)",
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
                color: "rgba(159,184,216,0.75)",
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
              borderRadius: 20,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(8px)",
              maxWidth: 760,
            }}
          >
            <p
              style={{
                color: "rgba(211,227,247,0.82)",
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
                  color: "#7dcfa0",
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
                    ...darkInputStyle,
                    flex: 1,
                    minWidth: 200,
                    width: "auto",
                  }}
                />
                <button
                  type="button"
                  onClick={submitUnmetNeed}
                  disabled={unmetSubmitting || !unmetNeed.trim()}
                  style={{
                    padding: "12px 22px",
                    borderRadius: 999,
                    border: "none",
                    background: "#FFD86B",
                    color: "#1a2a0e",
                    fontWeight: 700,
                    cursor:
                      unmetSubmitting || !unmetNeed.trim()
                        ? "not-allowed"
                        : "pointer",
                    opacity: !unmetNeed.trim() ? 0.5 : 1,
                    boxShadow:
                      "0 0 24px rgba(255,216,107,0.22), 0 4px 14px rgba(255,200,80,0.16)",
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
            color: "rgba(211,227,247,0.82)",
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
              padding: "14px 26px",
              borderRadius: 999,
              border: "none",
              background: "#FFD86B",
              color: "#1a2a0e",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow:
                "0 0 28px rgba(255,216,107,0.30), 0 4px 14px rgba(255,200,80,0.2)",
            }}
          >
            Add a resource
          </Link>
        </div>
      </section>
    </main>
  );
}
