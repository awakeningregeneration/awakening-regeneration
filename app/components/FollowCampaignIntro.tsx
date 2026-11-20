"use client";

import { useEffect, useRef, useState } from "react";

const GOLD = "#FFD86B";
const GOLD_DEEP = "#9c6f12"; // readable gold-on-light accent
const NAVY = "#122c4a";
const NAVY_SOFT = "rgba(18,44,74,0.78)";

// Soft light halo behind dark text — legibility insurance against
// whatever map colors show through the deliberately light, translucent
// panel, without resorting to a dark scrim. One consistent, modest glow
// throughout — nothing on this panel gets a heavier shadow than this.
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
  const outerJustify = isMobile ? "flex-start" : "center";
  const outerGap = isMobile ? 14 : 18;

  const panelMaxHeight = isMobile
    ? "calc(100vh - 100px)" // 84 top offset + 16 bottom padding
    : "calc(100vh - 40px)";
  const panelRadius = isMobile ? 28 : 36;
  const panelPadding = isMobile ? "26px 22px 24px" : "40px 34px 38px";

  const closeSize = isMobile ? 40 : 30;
  const closeFontSize = isMobile ? 19 : 17;

  // The pause is the opening line now — short top margin (panel padding
  // already provides room), generous bottom margin before the
  // invitations begin.
  const pauseMarginTop = isMobile ? 6 : 10;
  const pauseMarginBottom = isMobile ? 30 : 42;

  const invitationGap = isMobile ? 14 : 18;
  const invitationsMarginBottom = isMobile ? 26 : 34;

  const thesisLineHeight = isMobile ? 1.35 : 1.45;
  const exploreCtaMarginTop = isMobile ? 22 : 30;
  const ctaPadding = isMobile ? "16px 34px" : "13px 30px";

  const invitationBodyStyle: React.CSSProperties = {
    fontSize: 14,
    lineHeight: 1.5,
    color: NAVY_SOFT,
    textShadow: TEXT_GLOW,
    margin: 0,
  };

  const invitationLabelStyle: React.CSSProperties = {
    fontWeight: 800,
    color: GOLD_DEEP,
    letterSpacing: "0.03em",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: outerJustify,
        gap: outerGap,
        padding: outerPadding,
        overflowY: isMobile ? "auto" : "visible",
      }}
    >
      {/* Live count — deliberately outside the glass, as a stat the map
          itself is surfacing rather than a line inside the invitation. */}
      {lightsCount > 0 && (
        <p
          style={{
            flexShrink: 0,
            margin: 0,
            padding: "8px 18px",
            borderRadius: 999,
            background:
              "radial-gradient(ellipse at 50% 20%, rgba(255,253,248,0.4) 0%, rgba(248,250,253,0.28) 100%)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.45)",
            boxShadow: "0 8px 24px rgba(20,40,75,0.14)",
            fontSize: 14.5,
            fontWeight: 700,
            color: NAVY,
            textShadow: TEXT_GLOW,
            whiteSpace: "nowrap",
          }}
        >
          <AnimatedCount value={lightsCount} /> lights and counting
        </p>
      )}

      <div
        role="dialog"
        aria-label="Follow the Canary"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 540,
          maxHeight: panelMaxHeight,
          overflowY: "auto",
          borderRadius: panelRadius,
          padding: panelPadding,
          background:
            "radial-gradient(ellipse at 50% 10%, rgba(255,253,248,0.16) 0%, rgba(248,250,253,0.11) 55%, rgba(240,245,252,0.07) 100%)",
          backdropFilter: "blur(6px) brightness(1.04) saturate(1.05)",
          WebkitBackdropFilter: "blur(6px) brightness(1.04) saturate(1.05)",
          border: "1px solid rgba(255,255,255,0.35)",
          boxShadow:
            "0 30px 80px rgba(20,40,75,0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
          color: NAVY,
          textAlign: "center",
        }}
      >
        {/* Quiet dismiss — an alternate way out besides EXPLORE THE MAP,
            taking no action */}
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

        {/* Emotional centerpiece — recognition and wonder, with no
            attached action. Do not turn this into a CTA. */}
        <p
          style={{
            fontSize: "clamp(1.4rem, 3.6vw, 1.85rem)",
            fontWeight: 700,
            lineHeight: 1.3,
            color: GOLD_DEEP,
            textShadow: TEXT_GLOW,
            margin: `${pauseMarginTop}px 0 ${pauseMarginBottom}px`,
          }}
        >
          How incredible we really are!
        </p>

        {/* Participation section — plain, lightweight explanation of how
            to take part once exploring the map, not a set of actions to
            complete here. VISIT and ADD are already possible through the
            map itself; SHARE lives permanently on the map (the share
            control near the compass). Deliberately no buttons, arrows,
            or links — this is explanatory text, not a second interface. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: invitationGap,
            marginBottom: invitationsMarginBottom,
          }}
        >
          <p style={invitationBodyStyle}>
            <span style={invitationLabelStyle}>Visit</span> — The power to
            make a difference is in your hands. Choose a place already
            making one.
          </p>

          <p style={invitationBodyStyle}>
            <span style={invitationLabelStyle}>Add</span> — Know a person,
            place, or project that belongs here? Add them to the map.
          </p>

          <p style={invitationBodyStyle}>
            <span style={invitationLabelStyle}>Share</span> — The more we
            turn our attention to what makes a difference, the more
            difference we make. Pass the map along.
          </p>
        </div>

        <p
          style={{
            fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
            fontWeight: 700,
            lineHeight: thesisLineHeight,
            color: NAVY,
            textShadow: TEXT_GLOW,
            margin: "0 0 8px",
          }}
        >
          Together, let&rsquo;s light the path to the world we want to live
          in.
        </p>

        <p
          style={{
            fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
            fontStyle: "italic",
            fontWeight: 650,
            lineHeight: 1.3,
            color: GOLD_DEEP,
            textShadow: TEXT_GLOW,
            margin: 0,
          }}
        >
          Connected, we dawn brighter.
        </p>

        {/* Future, optional: a quiet "Hear from the Founder" secondary
            invitation (linking to a YouTube recording) would slot in
            right here, between the tagline and the primary button —
            same panel, same spacing rhythm, no restructuring needed.
            Intentionally not added yet — no link exists. */}

        {/* The one action this overlay asks for — everything else above
            is invitation, not instruction. */}
        <button
          type="button"
          onClick={onDismiss}
          style={{
            display: "inline-block",
            marginTop: exploreCtaMarginTop,
            padding: ctaPadding,
            borderRadius: 999,
            border: "none",
            background: GOLD,
            color: "#1a2a0e",
            fontWeight: 700,
            fontSize: 14.5,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow:
              "0 0 20px rgba(255,216,107,0.3), 0 4px 14px rgba(255,200,80,0.22)",
          }}
        >
          Explore the map →
        </button>
      </div>
    </div>
  );
}
