"use client";

import { useEffect, useRef, useState } from "react";

const GOLD = "#FFD86B";
const GOLD_DEEP = "#9c6f12"; // readable gold-on-light accent
const NAVY = "#122c4a";
const NAVY_SOFT = "rgba(18,44,74,0.78)";

// Soft light halo behind dark text — legibility insurance against
// whatever map colors show through the now much more transparent panel,
// without resorting to a dark scrim.
const TEXT_GLOW =
  "0 1px 2px rgba(255,255,255,0.8), 0 1px 10px rgba(255,255,255,0.5)";

/**
 * A number that gently pulses/fades when its value changes, rather than
 * jumping instantly — ready for a future live count without being wired
 * to polling yet. Nothing flashy: a brief scale+fade, not a slot-machine
 * roll.
 */
function AnimatedCount({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [pulsing, setPulsing] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value === prevValueRef.current) return;
    prevValueRef.current = value;
    setPulsing(true);
    const t = setTimeout(() => {
      setDisplayValue(value);
      setPulsing(false);
    }, 260);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <span
      style={{
        display: "inline-block",
        transition:
          "transform 0.32s cubic-bezier(.34,1.4,.64,1), opacity 0.32s ease",
        transform: pulsing ? "scale(1.16) translateY(-2px)" : "scale(1)",
        opacity: pulsing ? 0.45 : 1,
      }}
    >
      {displayValue.toLocaleString()}
    </span>
  );
}

export default function FollowCampaignIntro({
  onDismiss,
  lightsCount,
  isMobile = false,
}: {
  onDismiss: () => void;
  /** Published/visible listing count — same data already fetched for the
   * map sidebar, passed down rather than queried again. */
  lightsCount: number;
  /** Mobile-only fit/collision adjustments (tighter spacing, top offset
   * clearing the global compass nav). Desktop/tablet is unaffected when
   * this is false (the default) — every value below falls back to the
   * exact original desktop styling. */
  isMobile?: boolean;
}) {
  // The global compass nav (NorthStarNav) is fixed top:14 right:14 at
  // 62x62, z-index 9999 — above this panel. Rather than touch that
  // shared, site-wide control, the panel itself simply starts low
  // enough on mobile to never reach into its footprint (14+62 = 76, +8
  // clearance = 84).
  const outerPadding = isMobile ? "84px 14px 16px" : 20;
  const outerAlign = isMobile ? "flex-start" : "center";

  const panelMaxHeight = isMobile
    ? "calc(100vh - 100px)" // 84 top offset + 16 bottom padding
    : "calc(100vh - 40px)";
  const panelRadius = isMobile ? 28 : 36;
  const panelPadding = isMobile ? "28px 22px 24px" : "44px 34px 38px";

  const closeSize = isMobile ? 40 : 30;
  const closeFontSize = isMobile ? 19 : 17;

  const leadMarginBottom = isMobile ? 12 : 16;
  const thesisLineHeight = isMobile ? 1.35 : 1.45;
  const thesisMarginBottom = isMobile ? 14 : 20;
  const bodyLineHeight = isMobile ? 1.5 : 1.7;
  const bodyMarginBottom1 = isMobile ? 12 : 18;
  const bodyMarginBottom2 = isMobile ? 18 : 28;
  const frameworkMarginBottom = isMobile ? 16 : 26;
  const countMarginBottom = isMobile ? 4 : 6;
  const subtextMarginBottom = isMobile ? 18 : 30;
  const ctaPadding = isMobile ? "14px 28px" : "12px 26px";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: outerAlign,
        justifyContent: "center",
        padding: outerPadding,
        overflowY: isMobile ? "auto" : "visible",
      }}
    >
      <div
        role="dialog"
        aria-label="Follow the Canary this weekend"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 540,
          maxHeight: panelMaxHeight,
          overflowY: "auto",
          borderRadius: panelRadius,
          padding: panelPadding,
          background:
            "radial-gradient(ellipse at 50% 10%, rgba(255,253,248,0.42) 0%, rgba(248,250,253,0.32) 55%, rgba(240,245,252,0.22) 100%)",
          backdropFilter: "blur(18px) brightness(1.06) saturate(1.05)",
          WebkitBackdropFilter: "blur(18px) brightness(1.06) saturate(1.05)",
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow:
            "0 30px 80px rgba(20,40,75,0.16), inset 0 1px 0 rgba(255,255,255,0.5)",
          color: NAVY,
          textAlign: "center",
        }}
      >
        {/* Quiet dismiss — an alternate way out besides the CTA */}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: closeSize,
            height: closeSize,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.5)",
            background: "rgba(255,255,255,0.35)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            color: NAVY_SOFT,
            fontSize: closeFontSize,
            lineHeight: 1,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>

        <p
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: NAVY_SOFT,
            textShadow: TEXT_GLOW,
            margin: `0 0 ${leadMarginBottom}px`,
          }}
        >
          We quietly mapped Oregon.
        </p>

        <p
          style={{
            fontSize: "clamp(1.15rem, 2.4vw, 1.4rem)",
            fontWeight: 600,
            lineHeight: thesisLineHeight,
            color: NAVY,
            textShadow: TEXT_GLOW,
            margin: `0 0 ${thesisMarginBottom}px`,
          }}
        >
          Turns out, another way is already here.
        </p>

        <p
          style={{
            fontSize: 14.5,
            lineHeight: bodyLineHeight,
            color: NAVY_SOFT,
            textShadow: TEXT_GLOW,
            margin: `0 0 ${bodyMarginBottom1}px`,
          }}
        >
          In thousands of places, people are already building pieces of a
          world where canaries thrive.
        </p>

        <p
          style={{
            fontSize: 14.5,
            lineHeight: bodyLineHeight,
            color: NAVY_SOFT,
            textShadow: TEXT_GLOW,
            margin: `0 0 ${bodyMarginBottom2}px`,
          }}
        >
          Now we&rsquo;re following the Canary across the United States —
          and inviting you to help us find the rest.
        </p>

        <div
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: GOLD_DEEP,
            textShadow: TEXT_GLOW,
            marginBottom: frameworkMarginBottom,
          }}
        >
          Find 3 · Visit 1 · Add 1 · Tell Another
        </div>

        {lightsCount > 0 && (
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: NAVY,
              textShadow: TEXT_GLOW,
              margin: `0 0 ${countMarginBottom}px`,
            }}
          >
            <AnimatedCount value={lightsCount} /> lights and counting
          </p>
        )}
        <p
          style={{
            fontSize: 13,
            fontStyle: "italic",
            color: NAVY_SOFT,
            textShadow: TEXT_GLOW,
            margin: `0 0 ${subtextMarginBottom}px`,
          }}
        >
          Every light makes another way easier to see.
        </p>

        <button
          type="button"
          onClick={onDismiss}
          style={{
            display: "inline-block",
            padding: ctaPadding,
            borderRadius: 999,
            border: "none",
            background: GOLD,
            color: "#1a2a0e",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow:
              "0 0 20px rgba(255,216,107,0.3), 0 4px 14px rgba(255,200,80,0.22)",
          }}
        >
          Find your three →
        </button>
      </div>
    </div>
  );
}
