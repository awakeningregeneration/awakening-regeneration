"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ListingImageTile from "../components/ListingImageTile";
import { getListingImage } from "../../lib/getListingImage";

type ConstellationSignal = {
  id: string;
  title: string;
  description: string;
  region: string | null;
  category: string | null;
  link: string;
  practices?: string[] | null;
  image_url?: string;
  created_at?: string;
};

const PRIMARY_CATEGORIES = [
  "Land & Food",
  "Water & Flow",
  "Energy & Infrastructure",
  "Air & Atmosphere",
  "Community & Care",
];

type StarPoint = {
  left: string;
  top: string;
  size: number;
  opacity: number;
  tier: 1 | 2 | 3;
};

const starField: StarPoint[] = [
  // Tier 1 — 60 tiny stars (1.5–3px, opacity 0.3–0.6, no glow)
  { left: "4%", top: "6%", size: 2, opacity: 0.4, tier: 1 },
  { left: "12%", top: "5%", size: 1.5, opacity: 0.3, tier: 1 },
  { left: "20%", top: "8%", size: 2.5, opacity: 0.5, tier: 1 },
  { left: "28%", top: "4%", size: 2, opacity: 0.45, tier: 1 },
  { left: "36%", top: "7%", size: 3, opacity: 0.55, tier: 1 },
  { left: "44%", top: "5%", size: 1.5, opacity: 0.35, tier: 1 },
  { left: "52%", top: "8%", size: 2, opacity: 0.4, tier: 1 },
  { left: "60%", top: "6%", size: 2.5, opacity: 0.5, tier: 1 },
  { left: "72%", top: "4%", size: 2, opacity: 0.45, tier: 1 },
  { left: "86%", top: "7%", size: 1.5, opacity: 0.32, tier: 1 },
  { left: "6%", top: "18%", size: 2, opacity: 0.42, tier: 1 },
  { left: "15%", top: "20%", size: 3, opacity: 0.55, tier: 1 },
  { left: "23%", top: "16%", size: 1.5, opacity: 0.3, tier: 1 },
  { left: "32%", top: "22%", size: 2, opacity: 0.4, tier: 1 },
  { left: "40%", top: "18%", size: 2.5, opacity: 0.48, tier: 1 },
  { left: "48%", top: "20%", size: 2, opacity: 0.42, tier: 1 },
  { left: "56%", top: "16%", size: 1.5, opacity: 0.35, tier: 1 },
  { left: "65%", top: "22%", size: 3, opacity: 0.58, tier: 1 },
  { left: "76%", top: "20%", size: 2, opacity: 0.45, tier: 1 },
  { left: "88%", top: "18%", size: 2.5, opacity: 0.5, tier: 1 },
  { left: "3%", top: "34%", size: 2, opacity: 0.4, tier: 1 },
  { left: "11%", top: "38%", size: 1.5, opacity: 0.32, tier: 1 },
  { left: "19%", top: "36%", size: 2.5, opacity: 0.5, tier: 1 },
  { left: "27%", top: "32%", size: 2, opacity: 0.42, tier: 1 },
  { left: "36%", top: "38%", size: 3, opacity: 0.6, tier: 1 },
  { left: "45%", top: "34%", size: 1.5, opacity: 0.3, tier: 1 },
  { left: "53%", top: "38%", size: 2, opacity: 0.4, tier: 1 },
  { left: "62%", top: "36%", size: 2.5, opacity: 0.5, tier: 1 },
  { left: "74%", top: "32%", size: 2, opacity: 0.45, tier: 1 },
  { left: "90%", top: "38%", size: 1.5, opacity: 0.35, tier: 1 },
  { left: "5%", top: "52%", size: 2, opacity: 0.42, tier: 1 },
  { left: "14%", top: "56%", size: 2.5, opacity: 0.5, tier: 1 },
  { left: "22%", top: "50%", size: 1.5, opacity: 0.3, tier: 1 },
  { left: "31%", top: "54%", size: 2, opacity: 0.4, tier: 1 },
  { left: "39%", top: "50%", size: 3, opacity: 0.55, tier: 1 },
  { left: "47%", top: "56%", size: 2, opacity: 0.42, tier: 1 },
  { left: "55%", top: "52%", size: 1.5, opacity: 0.35, tier: 1 },
  { left: "64%", top: "56%", size: 2.5, opacity: 0.48, tier: 1 },
  { left: "77%", top: "50%", size: 2, opacity: 0.45, tier: 1 },
  { left: "92%", top: "54%", size: 3, opacity: 0.6, tier: 1 },
  { left: "4%", top: "70%", size: 2, opacity: 0.4, tier: 1 },
  { left: "12%", top: "74%", size: 1.5, opacity: 0.32, tier: 1 },
  { left: "21%", top: "68%", size: 2.5, opacity: 0.5, tier: 1 },
  { left: "29%", top: "72%", size: 2, opacity: 0.42, tier: 1 },
  { left: "37%", top: "68%", size: 3, opacity: 0.58, tier: 1 },
  { left: "46%", top: "74%", size: 1.5, opacity: 0.3, tier: 1 },
  { left: "54%", top: "70%", size: 2, opacity: 0.4, tier: 1 },
  { left: "63%", top: "74%", size: 2.5, opacity: 0.48, tier: 1 },
  { left: "75%", top: "68%", size: 2, opacity: 0.45, tier: 1 },
  { left: "89%", top: "72%", size: 1.5, opacity: 0.35, tier: 1 },
  { left: "6%", top: "88%", size: 2, opacity: 0.42, tier: 1 },
  { left: "15%", top: "90%", size: 2.5, opacity: 0.5, tier: 1 },
  { left: "23%", top: "86%", size: 1.5, opacity: 0.3, tier: 1 },
  { left: "32%", top: "92%", size: 2, opacity: 0.4, tier: 1 },
  { left: "40%", top: "88%", size: 3, opacity: 0.55, tier: 1 },
  { left: "48%", top: "92%", size: 2, opacity: 0.42, tier: 1 },
  { left: "57%", top: "88%", size: 1.5, opacity: 0.35, tier: 1 },
  { left: "65%", top: "90%", size: 2.5, opacity: 0.48, tier: 1 },
  { left: "78%", top: "86%", size: 2, opacity: 0.45, tier: 1 },
  { left: "93%", top: "92%", size: 3, opacity: 0.6, tier: 1 },

  // Tier 2 — 40 small stars (3–5px, opacity 0.45–0.75, soft gold glow)
  { left: "7%", top: "11%", size: 3, opacity: 0.55, tier: 2 },
  { left: "18%", top: "13%", size: 4, opacity: 0.65, tier: 2 },
  { left: "29%", top: "10%", size: 3, opacity: 0.5, tier: 2 },
  { left: "40%", top: "14%", size: 5, opacity: 0.75, tier: 2 },
  { left: "51%", top: "11%", size: 3, opacity: 0.55, tier: 2 },
  { left: "62%", top: "13%", size: 4, opacity: 0.6, tier: 2 },
  { left: "80%", top: "10%", size: 3, opacity: 0.5, tier: 2 },
  { left: "93%", top: "14%", size: 4, opacity: 0.65, tier: 2 },
  { left: "4%", top: "26%", size: 3, opacity: 0.5, tier: 2 },
  { left: "16%", top: "28%", size: 4, opacity: 0.6, tier: 2 },
  { left: "28%", top: "24%", size: 5, opacity: 0.72, tier: 2 },
  { left: "40%", top: "30%", size: 3, opacity: 0.55, tier: 2 },
  { left: "52%", top: "26%", size: 4, opacity: 0.65, tier: 2 },
  { left: "64%", top: "28%", size: 3, opacity: 0.48, tier: 2 },
  { left: "78%", top: "26%", size: 4, opacity: 0.58, tier: 2 },
  { left: "90%", top: "30%", size: 5, opacity: 0.7, tier: 2 },
  { left: "8%", top: "44%", size: 3, opacity: 0.52, tier: 2 },
  { left: "20%", top: "42%", size: 4, opacity: 0.6, tier: 2 },
  { left: "32%", top: "46%", size: 3, opacity: 0.5, tier: 2 },
  { left: "44%", top: "42%", size: 5, opacity: 0.72, tier: 2 },
  { left: "56%", top: "46%", size: 3, opacity: 0.55, tier: 2 },
  { left: "68%", top: "44%", size: 4, opacity: 0.62, tier: 2 },
  { left: "80%", top: "42%", size: 3, opacity: 0.48, tier: 2 },
  { left: "92%", top: "46%", size: 4, opacity: 0.65, tier: 2 },
  { left: "5%", top: "62%", size: 3, opacity: 0.5, tier: 2 },
  { left: "17%", top: "60%", size: 4, opacity: 0.6, tier: 2 },
  { left: "29%", top: "64%", size: 5, opacity: 0.7, tier: 2 },
  { left: "41%", top: "58%", size: 3, opacity: 0.55, tier: 2 },
  { left: "53%", top: "62%", size: 4, opacity: 0.65, tier: 2 },
  { left: "65%", top: "60%", size: 3, opacity: 0.5, tier: 2 },
  { left: "77%", top: "64%", size: 4, opacity: 0.58, tier: 2 },
  { left: "89%", top: "62%", size: 5, opacity: 0.72, tier: 2 },
  { left: "7%", top: "80%", size: 3, opacity: 0.52, tier: 2 },
  { left: "19%", top: "78%", size: 4, opacity: 0.6, tier: 2 },
  { left: "31%", top: "82%", size: 3, opacity: 0.5, tier: 2 },
  { left: "43%", top: "80%", size: 5, opacity: 0.72, tier: 2 },
  { left: "55%", top: "78%", size: 3, opacity: 0.55, tier: 2 },
  { left: "67%", top: "82%", size: 4, opacity: 0.62, tier: 2 },
  { left: "82%", top: "80%", size: 3, opacity: 0.48, tier: 2 },
  { left: "95%", top: "82%", size: 4, opacity: 0.65, tier: 2 },

  // Tier 3 — 20 bright orbs (6–10px, opacity 0.55–0.85, layered warm glow)
  { left: "10%", top: "8%", size: 7, opacity: 0.7, tier: 3 },
  { left: "34%", top: "12%", size: 8, opacity: 0.75, tier: 3 },
  { left: "58%", top: "8%", size: 6, opacity: 0.65, tier: 3 },
  { left: "82%", top: "14%", size: 9, opacity: 0.8, tier: 3 },
  { left: "22%", top: "26%", size: 10, opacity: 0.85, tier: 3 },
  { left: "48%", top: "30%", size: 6, opacity: 0.58, tier: 3 },
  { left: "72%", top: "24%", size: 8, opacity: 0.72, tier: 3 },
  { left: "94%", top: "32%", size: 7, opacity: 0.68, tier: 3 },
  { left: "14%", top: "48%", size: 9, opacity: 0.78, tier: 3 },
  { left: "38%", top: "44%", size: 6, opacity: 0.6, tier: 3 },
  { left: "60%", top: "48%", size: 10, opacity: 0.85, tier: 3 },
  { left: "86%", top: "44%", size: 7, opacity: 0.65, tier: 3 },
  { left: "6%", top: "68%", size: 6, opacity: 0.58, tier: 3 },
  { left: "30%", top: "64%", size: 8, opacity: 0.72, tier: 3 },
  { left: "52%", top: "68%", size: 7, opacity: 0.62, tier: 3 },
  { left: "76%", top: "64%", size: 10, opacity: 0.82, tier: 3 },
  { left: "20%", top: "86%", size: 6, opacity: 0.6, tier: 3 },
  { left: "44%", top: "90%", size: 9, opacity: 0.78, tier: 3 },
  { left: "68%", top: "86%", size: 7, opacity: 0.65, tier: 3 },
  { left: "92%", top: "90%", size: 8, opacity: 0.72, tier: 3 },
];

type Position = { left: number; top: number; dx: number; dy: number };

export default function ConstellationPage() {
  const [signals, setSignals] = useState<ConstellationSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSignal, setSelectedSignal] =
    useState<ConstellationSignal | null>(null);

  const positionsRef = useRef<Record<string, Position>>({});
  const pillRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const frameRef = useRef<number | null>(null);

  // Fetch signals on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/constellation");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setSignals(data);
        }
      } catch (err) {
        console.error("Failed to load constellation:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Initialize positions + start drift loop when signals arrive
  useEffect(() => {
    if (signals.length === 0) return;

    const rand = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const positions: Record<string, Position> = {};
    signals.forEach((s) => {
      positions[s.id] = {
        left: rand(5, 90),
        top: rand(5, 88),
        dx: rand(-0.015, 0.015),
        dy: rand(-0.015, 0.015),
      };
    });
    positionsRef.current = positions;

    // Apply initial DOM positions on next frame (refs populated after render)
    const initFrame = requestAnimationFrame(() => {
      for (const id in positions) {
        const el = pillRefs.current[id];
        if (el) {
          el.style.left = positions[id].left + "%";
          el.style.top = positions[id].top + "%";
        }
      }
    });

    // Drift animation loop
    function tick() {
      const pos = positionsRef.current;
      for (const id in pos) {
        const p = pos[id];
        p.left += p.dx;
        p.top += p.dy;
        if (p.left < -5) p.left = 95;
        if (p.left > 95) p.left = -5;
        if (p.top < -5) p.top = 95;
        if (p.top > 95) p.top = -5;
        const el = pillRefs.current[id];
        if (el) {
          el.style.left = p.left + "%";
          el.style.top = p.top + "%";
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(initFrame);
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [signals]);

  const query = searchQuery.trim().toLowerCase();
  const isVisible = (s: ConstellationSignal) => {
    const matchesCategory =
      selectedCategory === "All" || s.category === selectedCategory;
    const haystack =
      `${s.title ?? ""} ${s.description ?? ""} ${s.region ?? ""} ${
        s.category ?? ""
      }`.toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    return matchesCategory && matchesSearch;
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050e1a",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Base radial gradient */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(20,55,120,0.28) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Star field backdrop — three tiers */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {starField.map((p, i) => {
          let boxShadow = "none";
          if (p.tier === 2) {
            boxShadow = "0 0 8px rgba(255,235,180,0.35)";
          } else if (p.tier === 3) {
            boxShadow =
              "0 0 12px 4px rgba(255,220,140,0.28), 0 0 28px 6px rgba(255,200,100,0.12)";
          }
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: "rgba(255,248,220,0.85)",
                opacity: p.opacity,
                boxShadow,
              }}
            />
          );
        })}
      </div>

      {/* Logo + return link */}
      <div
        style={{
          position: "fixed",
          top: 18,
          left: 24,
          zIndex: 10,
        }}
      >
        <img
          src="/canary-commons-logo.png"
          alt="Canary Commons"
          style={{
            width: "clamp(140px, 18vw, 200px)",
            height: "auto",
            display: "block",
            marginBottom: 6,
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
          }}
        />
        <Link
          href="/map"
          style={{
            display: "block",
            color: "#FFD86B",
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          ← Return to the map
        </Link>
      </div>

      {/* Search + category filter (fixed, centered top) */}
      <div
        style={{
          position: "fixed",
          top: 28,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <input
          type="text"
          placeholder="Search the constellation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "clamp(240px, 36vw, 420px)",
            padding: "11px 22px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.07)",
            color: "white",
            fontSize: "0.95rem",
            backdropFilter: "blur(10px)",
            outline: "none",
            pointerEvents: "auto",
          }}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            maxWidth: "90vw",
            pointerEvents: "auto",
          }}
        >
          {["All", ...PRIMARY_CATEGORIES].map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: isActive
                    ? "1px solid rgba(255,216,107,0.45)"
                    : "1px solid rgba(255,255,255,0.12)",
                  background: "transparent",
                  color: isActive ? "#FFD86B" : "rgba(211,227,247,0.55)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  transition:
                    "color 0.15s ease, border-color 0.15s ease",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drifting field of entry pills */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        {signals.map((s) => {
          const visible = isVisible(s);
          return (
            <div
              key={s.id}
              ref={(el) => {
                pillRefs.current[s.id] = el;
              }}
              onClick={() => setSelectedSignal(s)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(255,216,107,0.35)";
                e.currentTarget.style.boxShadow =
                  "0 0 28px rgba(255,216,107,0.32), 0 0 10px rgba(255,216,107,0.18), inset 0 0 20px rgba(255,220,140,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,0.16)";
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(255,216,107,0.16), 0 0 6px rgba(255,216,107,0.10), inset 0 0 16px rgba(255,220,140,0.07)";
              }}
              style={{
                position: "absolute",
                padding: "10px 18px",
                borderRadius: 999,
                background:
                  "radial-gradient(ellipse at 50% 40%, rgba(255,220,140,0.07) 0%, rgba(255,255,255,0.04) 60%, rgba(20,50,110,0.08) 100%)",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "rgba(211,227,247,0.92)",
                fontSize: "0.88rem",
                backdropFilter: "blur(6px)",
                boxShadow:
                  "0 0 20px rgba(255,216,107,0.16), 0 0 6px rgba(255,216,107,0.10), inset 0 0 16px rgba(255,220,140,0.07)",
                cursor: "pointer",
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? "auto" : "none",
                transition:
                  "opacity 0.4s ease, border-color 0.15s ease, box-shadow 0.15s ease",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              {s.title}
            </div>
          );
        })}
      </div>

      {/* Loading state */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "rgba(211,227,247,0.55)",
            fontSize: "0.92rem",
            zIndex: 3,
            fontStyle: "italic",
          }}
        >
          Gathering the constellation…
        </div>
      )}

      {/* Submit link (fixed bottom center) */}
      <Link
        href="/constellation/submit"
        style={{
          position: "fixed",
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "0.82rem",
          color: "rgba(211,227,247,0.45)",
          textDecoration: "none",
          zIndex: 10,
          transition: "color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "rgba(255,216,107,0.7)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(211,227,247,0.45)";
        }}
      >
        Add to the constellation →
      </Link>

      {/* Detail overlay */}
      {selectedSignal && (
        <div
          onClick={() => setSelectedSignal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(5,14,26,0.88)",
            backdropFilter: "blur(16px)",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 24,
              padding: 36,
              maxWidth: 560,
              width: "100%",
              color: "white",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <ListingImageTile
                imageUrl={getListingImage(
                  selectedSignal.image_url,
                  selectedSignal.link
                )}
                name={selectedSignal.title}
                size="lg"
              />
            </div>

            {selectedSignal.category && (
              <div
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(159,184,216,0.65)",
                  marginBottom: 12,
                }}
              >
                {selectedSignal.category}
              </div>
            )}

            <h2
              style={{
                margin: 0,
                marginBottom: 10,
                fontSize: "clamp(1.5rem, 3vw, 1.9rem)",
                fontWeight: 650,
                color: "white",
                lineHeight: 1.18,
              }}
            >
              {selectedSignal.title}
            </h2>

            {selectedSignal.region && (
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(211,227,247,0.65)",
                  marginBottom: 16,
                }}
              >
                {selectedSignal.region}
              </div>
            )}

            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "rgba(211,227,247,0.82)",
                margin: 0,
                marginBottom: 20,
              }}
            >
              {selectedSignal.description}
            </p>

            {selectedSignal.practices?.length ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 7,
                  marginBottom: 22,
                }}
              >
                {selectedSignal.practices.map((practice) => (
                  <span
                    key={practice}
                    style={{
                      fontSize: "0.78rem",
                      color: "rgba(211,227,247,0.72)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 999,
                      padding: "4px 11px",
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    {practice}
                  </span>
                ))}
              </div>
            ) : null}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={selectedSignal.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  borderRadius: 999,
                  border: "none",
                  background: "#FFD86B",
                  color: "#1a2a0e",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  textDecoration: "none",
                  boxShadow:
                    "0 0 24px rgba(255,216,107,0.28), 0 4px 14px rgba(255,200,80,0.18)",
                }}
              >
                Visit
              </a>

              <button
                type="button"
                onClick={() => setSelectedSignal(null)}
                style={{
                  padding: "12px 24px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.22)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
