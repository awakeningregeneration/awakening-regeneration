"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import SupportIntroOverlay from "./SupportIntroOverlay";
import DawningBrighter from "@/app/components/DawningBrighter";
import { useIsMobile } from "@/app/lib/useIsMobile";

type OnlineResource = {
  id: string | number;
  name: string;
  description: string | null;
  url: string | null;
  logo_url: string | null;
  category: string[] | null;
  practices: string[] | null;
  why_it_matters: string | null;
  affiliate_url: string | null;
  slug: string | null;
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
  "Conflict Transformation & Repair",
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
      {/* Dawn atmosphere — approved treatment from /about, reused as-is */}
      <DawningBrighter lift="dawn" />
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
  resource: OnlineResource;
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

function ResourceCard({ resource }: { resource: OnlineResource }) {
  const visitUrl = resource.slug ? `/resource/${resource.slug}` : resource.affiliate_url || resource.url || "#";
  // Only resources with an actual affiliate_url go through tracking —
  // a slug alone just routes through /resource/[slug], which falls back
  // to the plain url when no affiliate_url is set.
  const usesAffiliateLink = !!resource.affiliate_url;

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
            {Array.isArray(resource.category) && resource.category.length > 0 ? resource.category.join(" \u00B7 ") : "Uncategorized"}
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
          Visit Resource{usesAffiliateLink ? "*" : ""}
        </a>
      </div>
    </article>
  );
}

export default function SupportPageClient({
  introAcknowledged,
}: {
  introAcknowledged: boolean;
}) {
  const [resources, setResources] = useState<OnlineResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hasSearched, setHasSearched] = useState(false);
  const [unmetNeed, setUnmetNeed] = useState("");
  const [unmetSubmitted, setUnmetSubmitted] = useState(false);
  const [unmetSubmitting, setUnmetSubmitting] = useState(false);

  // Browse carousel for "A few lights to get us started" — independent
  // of search/filter, which continues to run across all resources and
  // render separately (unchanged below).
  const isMobile = useIsMobile();
  const [carouselStart, setCarouselStart] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  // Reset to the first page when the breakpoint (and therefore page
  // size) changes, so a stale start index from the other layout can't
  // produce a misaligned page.
  useEffect(() => {
    setCarouselStart(0);
  }, [isMobile]);

  // Intro overlay state
  const [overlayOpen, setOverlayOpen] = useState(!introAcknowledged);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(introAcknowledged);
  const [isFirstVisit] = useState(!introAcknowledged);

  const dismissOverlay = useCallback(() => {
    if (!hasBeenDismissed) {
      // First dismiss: set cookie
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie =
        `cc_support_intro_acknowledged=1; path=/; max-age=7776000; SameSite=Lax${secure}`;
      setHasBeenDismissed(true);
    }
    setOverlayOpen(false);
  }, [hasBeenDismissed]);

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

  // Same deterministic daily shuffle as before, now exposing the full
  // approved collection (not just the first 3) so the carousel can
  // browse through all of it.
  const carouselPool = seededShuffle(resources, dateSeed());
  const carouselTotal = carouselPool.length;
  const visibleCount = isMobile ? 1 : 3;
  const showCarouselNav = carouselTotal > visibleCount;
  // Non-overlapping pages of visibleCount — the last page may be
  // shorter than visibleCount rather than wrapping in extra items to
  // pad it out, which is what keeps "10 of 10" meaningful instead of
  // reading as a padded "10–12 of 10".
  const visibleResources = carouselPool.slice(
    carouselStart,
    carouselStart + visibleCount
  );
  const lastPageStart =
    carouselTotal === 0
      ? 0
      : Math.floor((carouselTotal - 1) / visibleCount) * visibleCount;
  const rangeStart = carouselStart + 1;
  const rangeEnd = Math.min(carouselStart + visibleCount, carouselTotal);
  const carouselPositionLabel =
    rangeStart === rangeEnd
      ? `${rangeStart} of ${carouselTotal}`
      : `${rangeStart}–${rangeEnd} of ${carouselTotal}`;

  function goToPrevCard() {
    if (carouselTotal === 0) return;
    setCarouselStart(
      carouselStart - visibleCount < 0 ? lastPageStart : carouselStart - visibleCount
    );
  }

  function goToNextCard() {
    if (carouselTotal === 0) return;
    setCarouselStart(
      carouselStart + visibleCount >= carouselTotal ? 0 : carouselStart + visibleCount
    );
  }

  function handleCarouselTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0].clientX;
  }

  function handleCarouselTouchEnd(e: React.TouchEvent) {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX === null) return;
    const deltaX = e.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) < 40) return; // treat small movement as a tap, not a swipe
    if (deltaX < 0) {
      goToNextCard();
    } else {
      goToPrevCard();
    }
  }

  const filteredResources = resources.filter((r) => {
    const matchesCategory =
      selectedCategory === "All" || (Array.isArray(r.category) ? r.category.includes(selectedCategory) : r.category === selectedCategory);
    const haystack = [
      r.name,
      r.description ?? "",
      ...(Array.isArray(r.category) ? r.category : [r.category ?? ""]),
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

      {/* Affiliate transparency overlay */}
      <SupportIntroOverlay
        isOpen={overlayOpen}
        onDismiss={dismissOverlay}
        isFirstVisit={isFirstVisit}
      />

      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1152,
          margin: "0 auto",
          padding: "64px 24px",
        }}
      >
        {/* Logo + return link */}
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <img
            src="/canary-logo-new.png"
            alt="Canary Commons"
            style={{
              width: "clamp(200px, 30vw, 320px)",
              height: "auto",
              display: "block",
              margin: "0 auto 12px",
              filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.3))",
            }}
          />
        </div>

        {/* Header */}
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
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
            Look local first.
          </h1>
          <p
            style={{
              fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.82)",
              margin: "0 0 16px",
            }}
          >
            When what you need isn&rsquo;t available locally, look here.
          </p>
          <p
            style={{
              fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.82)",
              margin: "0 0 16px",
            }}
          >
            Canary&rsquo;s Online Resources are growing into a collection of
            life-supporting options for the things we use every day — from
            what we eat and wear to how we care for our homes, our bodies,
            and one another.
          </p>
          <p
            style={{
              fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.82)",
              margin: "0 0 16px",
            }}
          >
            We&rsquo;re just getting started. The resources below are a
            small sample of what&rsquo;s to come. Our goal is to make it
            easier to find Canary-friendly alternatives for the things you
            need, wherever you live.
          </p>
          <p
            style={{
              fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.82)",
              margin: 0,
              marginBottom: 36,
            }}
          >
            And when you choose an Online Resource through Canary,
            participating partners help sustain the Commons — keeping
            local listings free and Canary free for everyone.
          </p>
        </div>

        {/* Browse carousel — "A few lights to get us started".
            Independent of search below, which still runs over all
            approved resources and renders its own results normally. */}
        {!loading && carouselTotal > 0 && (
          <div style={{ marginBottom: 44 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 18,
              }}
            >
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "rgba(159,184,216,0.75)",
                  margin: 0,
                  letterSpacing: "0.04em",
                }}
              >
                A few lights to get us started
              </h2>
              {showCarouselNav && (
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(211,227,247,0.55)",
                  }}
                >
                  {carouselPositionLabel}
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              {showCarouselNav && (
                <button
                  type="button"
                  onClick={goToPrevCard}
                  aria-label="Previous Online Resources"
                  style={{
                    flexShrink: 0,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,216,107,0.55)",
                    background: "rgba(255,216,107,0.12)",
                    color: "#FFD86B",
                    fontSize: "1.1rem",
                    lineHeight: 1,
                    cursor: "pointer",
                    boxShadow: "0 0 10px rgba(255,216,107,0.18)",
                  }}
                >
                  ‹
                </button>
              )}

              <div
                onTouchStart={handleCarouselTouchStart}
                onTouchEnd={handleCarouselTouchEnd}
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "grid",
                  gridTemplateColumns: `repeat(${visibleResources.length}, 1fr)`,
                  gap: 24,
                  alignItems: "start",
                }}
              >
                {visibleResources.map((r) => (
                  <ResourceCard key={String(r.id)} resource={r} />
                ))}
              </div>

              {showCarouselNav && (
                <button
                  type="button"
                  onClick={goToNextCard}
                  aria-label="Next Online Resources"
                  style={{
                    flexShrink: 0,
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,216,107,0.55)",
                    background: "rgba(255,216,107,0.12)",
                    color: "#FFD86B",
                    fontSize: "1.1rem",
                    lineHeight: 1,
                    cursor: "pointer",
                    boxShadow: "0 0 10px rgba(255,216,107,0.18)",
                  }}
                >
                  ›
                </button>
              )}
            </div>
          </div>
        )}

        {/* Persistent affiliate-link note — moved here, immediately
            below the visible resource cards and before Search, since a
            visitor may click a card without ever searching. Always
            visible (not tied to the 90-day popup). A quiet divider, not
            a box. Copy/hierarchy unchanged from the approved version. */}
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto 40px",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#FFD86B",
              marginBottom: 10,
            }}
          >
            ✦ A NOTE ABOUT AFFILIATE LINKS
          </div>
          <p
            style={{
              fontSize: "0.98rem",
              lineHeight: 1.65,
              color: "rgba(224,238,255,0.88)",
              margin: "0 0 18px",
            }}
          >
            Some ad blockers flag affiliate tracking links. If your
            blocker flags a Canary affiliate link, you can continue to
            the resource. That link lets the business know Canary
            brought you — and allows part of your purchase to come back
            to the Commons.
          </p>
          <p
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              lineHeight: 1.4,
              color: "#FFD86B",
              margin: 0,
            }}
          >
            Nobody pays to be seen on Canary. Canary can be paid when it
            helps something worth seeing be chosen.
          </p>
        </div>

        {/* Search & Filter, with a small secondary business invitation
            alongside it — wraps to stack cleanly on narrow screens.
            Search remains visually primary; the partner invitation is
            a smaller, subordinate doorway, not a competing CTA. */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "flex-start",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 760,
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

          <div
            style={{
              flex: "1 1 260px",
              maxWidth: 320,
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: "0.95rem",
                color: "rgba(224,238,255,0.82)",
                marginBottom: 12,
              }}
            >
              Have a business that belongs here?
            </div>
            <Link
              href="/support/submit"
              style={{
                display: "inline-block",
                padding: "10px 20px",
                borderRadius: 999,
                border: "1.5px solid rgba(255,216,107,0.5)",
                background: "rgba(255,216,107,0.08)",
                color: "#FFD86B",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Become an Online Resource Partner →
            </Link>
          </div>
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

        {/* Quiet re-open link for the disclosure/ad-blocker popup —
            reuses the existing overlay state/cookie mechanism as-is. */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button
            type="button"
            onClick={() => setOverlayOpen(true)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontSize: "0.82rem",
              color: "rgba(211,227,247,0.5)",
              textDecoration: "underline",
              textUnderlineOffset: 2,
              cursor: "pointer",
            }}
          >
            How Online Resource partnerships support Canary
          </button>
        </div>
      </section>
    </main>
  );
}
