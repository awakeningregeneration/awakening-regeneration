"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import CompassCaption from "./CompassCaption";

const GOLD = "#FFD86B";
const GOLD_LIGHT = "#FFE8A3";
const GOLD_DARK = "#E6B84A";

const NAV_ITEMS = [
  { label: "Map", href: "/map" },
  { label: "The Constellation", href: "/constellation" },
  { label: "Online Resources", href: "/support" },
  { label: "Founders", href: "/founders" },
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

/* ── Dropdown item glass styles ── */
const ITEM_WELL_BG =
  "radial-gradient(ellipse at 50% 40%, rgba(55,90,140,0.7) 0%, rgba(30,55,95,0.85) 60%, rgba(18,38,68,0.92) 100%)";
const ITEM_WELL_SHADOW =
  "inset 0 1px 3px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(130,175,230,0.08), 0 1px 2px rgba(0,0,0,0.15)";
const ITEM_HOVER_BG =
  "radial-gradient(ellipse at 50% 40%, rgba(70,108,160,0.8) 0%, rgba(40,68,115,0.9) 60%, rgba(22,42,72,0.94) 100%)";
const ITEM_HOVER_SHADOW =
  "inset 0 1px 4px rgba(0,0,0,0.35), inset 0 -1px 3px rgba(130,175,230,0.12), 0 1px 3px rgba(0,0,0,0.2)";

/* ── 8-point compass rose paths (light and dark halves) ──
   Center at 24,24 in a 48x48 viewBox.
   4 long points (N,S,E,W) + 4 short points (NE,NW,SE,SW).
   Each point split into left-half (lighter) and right-half (darker). */

// Helper: generate a diamond point from center, given angle, long radius, short radius, and half-width
function compassPoint(
  angleDeg: number,
  longR: number,
  shortR: number,
  cx: number,
  cy: number
) {
  const a = (angleDeg * Math.PI) / 180;
  const perpA = a + Math.PI / 2;
  const hw = 2.8; // half-width at widest

  const tipX = cx + Math.cos(a) * longR;
  const tipY = cy - Math.sin(a) * longR;
  const baseX = cx - Math.cos(a) * shortR;
  const baseY = cy + Math.sin(a) * shortR;
  const leftX = cx + Math.cos(perpA) * hw;
  const leftY = cy - Math.sin(perpA) * hw;
  const rightX = cx - Math.cos(perpA) * hw;
  const rightY = cy + Math.sin(perpA) * hw;

  // Left half: base → left → tip
  const leftHalf = `${baseX},${baseY} ${leftX},${leftY} ${tipX},${tipY}`;
  // Right half: base → tip → right
  const rightHalf = `${baseX},${baseY} ${tipX},${tipY} ${rightX},${rightY}`;

  return { leftHalf, rightHalf };
}

const CX = 24;
const CY = 24;
const LONG_R = 19;
const SHORT_R = 5;
const DIAG_LONG_R = 10;
const DIAG_SHORT_R = 4;

// Cardinal points: N(90°), E(0°), S(270°), W(180°)
const cardinals = [90, 0, 270, 180].map((deg) =>
  compassPoint(deg, LONG_R, SHORT_R, CX, CY)
);
// Diagonal points: NE(45°), SE(315°), SW(225°), NW(135°)
const diagonals = [45, 315, 225, 135].map((deg) =>
  compassPoint(deg, DIAG_LONG_R, DIAG_SHORT_R, CX, CY)
);

const CompassRose = () => (
  <svg
    aria-hidden="true"
    width="46"
    height="46"
    viewBox="0 0 48 48"
    style={{
      position: "relative",
      zIndex: 1,
      filter: "drop-shadow(0 0 6px rgba(255,216,107,0.5))",
      animation: "northStarPulse 4s ease-in-out infinite",
    }}
  >
    {/* Cardinal points — long */}
    {cardinals.map((pt, i) => (
      <g key={`c${i}`}>
        <polygon points={pt.leftHalf} fill={GOLD_LIGHT} />
        <polygon points={pt.rightHalf} fill={GOLD_DARK} />
      </g>
    ))}
    {/* Diagonal points — short */}
    {diagonals.map((pt, i) => (
      <g key={`d${i}`}>
        <polygon points={pt.leftHalf} fill={GOLD_LIGHT} />
        <polygon points={pt.rightHalf} fill={GOLD_DARK} />
      </g>
    ))}
    {/* Center bright point */}
    <circle cx={CX} cy={CY} r="3.2" fill={GOLD} />
    <circle cx={CX} cy={CY} r="1.6" fill="#fff8e0" opacity="0.85" />
  </svg>
);

export default function NorthStarNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!open || !isMobile) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [open, isMobile]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const startCloseTimer = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  }, [clearCloseTimer]);

  const handleMouseEnter = () => {
    if (isMobile) return;
    clearCloseTimer();
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    startCloseTimer();
  };

  const handleToggle = () => setOpen((prev) => !prev);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
    if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      containerRef.current
        ?.querySelector<HTMLElement>('[data-nav-item="0"]')
        ?.focus();
    }
  };

  const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      containerRef.current
        ?.querySelector<HTMLElement>(`[data-nav-item="${index + 1}"]`)
        ?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index === 0) {
        containerRef.current
          ?.querySelector<HTMLElement>("[data-star-button]")
          ?.focus();
      } else {
        containerRef.current
          ?.querySelector<HTMLElement>(`[data-nav-item="${index - 1}"]`)
          ?.focus();
      }
    }
  };

  const isCurrentPage = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (!mounted) return null;

  const WELL_SIZE = 62;

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "fixed",
        top: 14,
        right: 14,
        zIndex: 9999,
      }}
    >
      {/* SVG filters for glass lensing */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="glass-lens" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="2"
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter
            id="glass-lens-item"
            x="-5%"
            y="-10%"
            width="110%"
            height="120%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* ── Star button ── */}
      <button
        data-star-button=""
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-label="Site navigation"
        aria-expanded={open}
        aria-haspopup="true"
        style={{
          position: "relative",
          width: WELL_SIZE,
          height: WELL_SIZE,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          background: "transparent",
          outline: "none",
        }}
      >
        {/* Layer 1: Sky gradient visible through glass, lensed */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -4,
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(160,200,250,0.5) 0%, rgba(100,155,220,0.4) 40%, rgba(60,110,180,0.5) 100%)",
              filter: "url(#glass-lens)",
            }}
          />
        </div>

        {/* Layer 2: Glass dome — luminous, lighter than sky */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(90,135,195,0.65) 0%, rgba(55,95,155,0.7) 45%, rgba(30,60,110,0.8) 75%, rgba(18,40,80,0.88) 100%)",
            boxShadow: [
              // Soft rim shadow — gentle depth at edge
              "inset 0 1px 4px rgba(0,0,0,0.3)",
              // Bottom light bounce
              "inset 0 -2px 6px rgba(130,175,230,0.15)",
              // Bright rim edge — glass lip catching light
              "inset 0 0 0 1px rgba(140,185,240,0.15)",
              // Outer glow — dome sits luminously in the sky
              "0 0 12px rgba(80,130,200,0.2)",
              "0 2px 8px rgba(0,0,0,0.2)",
            ].join(", "),
          }}
        />

        {/* Layer 3a: Primary gloss — curved light reflection on upper dome */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 3,
            left: "12%",
            right: "12%",
            height: "42%",
            borderRadius: "50% 50% 48% 48%",
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(220,235,255,0.35) 0%, rgba(180,210,250,0.15) 45%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Layer 3b: Secondary counter-reflection — bottom-right bloom */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 6,
            right: 6,
            width: "30%",
            height: "25%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 50%, rgba(180,210,250,0.12) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Layer 4: Compass rose star */}
        <CompassRose />
      </button>

      {/* ── Dropdown ── */}
      <div
        role="menu"
        aria-label="Site navigation"
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          minWidth: 210,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          padding: 5,
          borderRadius: 14,
          overflow: "hidden",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.18s ease, transform 0.18s ease",
          /* Glass dropdown container */
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(50,85,140,0.82) 0%, rgba(25,50,90,0.9) 60%, rgba(14,32,60,0.95) 100%)",
          backdropFilter: "blur(18px) brightness(0.9)",
          WebkitBackdropFilter: "blur(18px) brightness(0.9)",
          boxShadow: [
            "inset 0 1px 3px rgba(0,0,0,0.3)",
            "inset 0 -1px 4px rgba(130,175,230,0.08)",
            "inset 0 0 0 0.5px rgba(130,175,230,0.1)",
            "0 0 16px rgba(60,110,180,0.15)",
            "0 8px 28px rgba(0,0,0,0.35)",
          ].join(", "),
          border: "1px solid rgba(130,175,230,0.14)",
        }}
      >
        {/* Dropdown gloss highlight */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: "8%",
            right: "8%",
            height: 22,
            borderRadius: "0 0 50% 50%",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(200,225,255,0.14) 0%, rgba(180,210,250,0.04) 60%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {NAV_ITEMS.map((item, i) => {
          const current = isCurrentPage(item.href);
          const shared: React.CSSProperties = {
            position: "relative",
            display: "block",
            padding: "10px 16px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 550,
            letterSpacing: "0.02em",
            textDecoration: "none",
            color: current ? "rgba(255,216,107,0.4)" : GOLD,
            background: ITEM_WELL_BG,
            boxShadow: ITEM_WELL_SHADOW,
            transition: "background 0.15s ease, box-shadow 0.15s ease",
            cursor: current ? "default" : "pointer",
            outline: "none",
            overflow: "hidden",
          };

          /* Item lensed sky layer */
          const lensLayer = (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 10,
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: -2,
                  background:
                    "linear-gradient(135deg, rgba(80,125,190,0.12) 0%, rgba(50,85,145,0.08) 100%)",
                  filter: "url(#glass-lens-item)",
                }}
              />
            </div>
          );

          /* Item gloss highlight */
          const glossLayer = (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                right: "10%",
                height: "55%",
                borderRadius: "0 0 40% 40%",
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(200,225,255,0.1) 0%, transparent 75%)",
                pointerEvents: "none",
              }}
            />
          );

          if (current) {
            return (
              <span
                key={item.href}
                role="menuitem"
                aria-current="page"
                data-nav-item={i}
                tabIndex={open ? 0 : -1}
                onKeyDown={(e) => handleItemKeyDown(e, i)}
                style={shared}
              >
                {lensLayer}
                {glossLayer}
                <span style={{ position: "relative", zIndex: 1 }}>
                  {item.label}
                </span>
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              data-nav-item={i}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              onKeyDown={(e) => handleItemKeyDown(e, i)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ITEM_HOVER_BG;
                e.currentTarget.style.boxShadow = ITEM_HOVER_SHADOW;
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = ITEM_HOVER_BG;
                e.currentTarget.style.boxShadow = ITEM_HOVER_SHADOW;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = ITEM_WELL_BG;
                e.currentTarget.style.boxShadow = ITEM_WELL_SHADOW;
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = ITEM_WELL_BG;
                e.currentTarget.style.boxShadow = ITEM_WELL_SHADOW;
              }}
              style={shared}
            >
              {lensLayer}
              {glossLayer}
              <span style={{ position: "relative", zIndex: 1 }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ── Compass caption bubble ── */}
      {(pathname === "/" || pathname === "/about") && (
        <CompassCaption
          mode={pathname === "/" ? "homepage-timed" : "about-permanent"}
          isDropdownOpen={open}
        />
      )}

    </div>
  );
}
