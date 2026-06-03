"use client";

/**
 * DawningBrighter — the light dawn field background register.
 *
 * Full-viewport gradient layers + scattered gold light points,
 * sitting at z-index 0. Page content should use z-index 2+.
 *
 * Extracted from the existing Morning Sky field (founders/confirmation,
 * support/submit, stories/submit). Tunable via three props:
 *
 *   lift:     "calm" | "balanced" | "bright" — how far the gradient lifts toward light
 *   density:  "sparse" | "moderate" | "full" — how many orbs render
 *   glow:     "dim" | "soft" | "bright" — orb brightness/halo intensity
 *
 * Defaults reproduce the current Morning Sky field exactly when
 * called with no props (<DawningBrighter /> = safe drop-in).
 */

type Props = {
  lift?: "calm" | "balanced" | "bright";
  density?: "sparse" | "moderate" | "full";
  glow?: "dim" | "soft" | "bright";
};

// Canonical orb positions — 24 positions spread across the viewport.
// density prop subsamples from this set.
const ALL_ORBS: { left: string; top: string; size: number; opacity: number }[] = [
  // Band 1 — upper
  { left: "6%", top: "8%", size: 5, opacity: 0.6 },
  { left: "18%", top: "15%", size: 3, opacity: 0.45 },
  { left: "32%", top: "6%", size: 6, opacity: 0.65 },
  { left: "48%", top: "22%", size: 4, opacity: 0.5 },
  { left: "64%", top: "12%", size: 7, opacity: 0.7 },
  { left: "82%", top: "18%", size: 4, opacity: 0.55 },
  // Band 2 — middle
  { left: "10%", top: "38%", size: 6, opacity: 0.65 },
  { left: "28%", top: "32%", size: 3, opacity: 0.4 },
  { left: "42%", top: "44%", size: 5, opacity: 0.55 },
  { left: "58%", top: "36%", size: 4, opacity: 0.5 },
  { left: "72%", top: "40%", size: 8, opacity: 0.7 },
  { left: "90%", top: "35%", size: 3, opacity: 0.45 },
  // Band 3 — lower-middle
  { left: "8%", top: "56%", size: 4, opacity: 0.5 },
  { left: "22%", top: "62%", size: 6, opacity: 0.6 },
  { left: "38%", top: "58%", size: 3, opacity: 0.45 },
  { left: "52%", top: "64%", size: 7, opacity: 0.65 },
  { left: "68%", top: "60%", size: 4, opacity: 0.5 },
  { left: "84%", top: "55%", size: 5, opacity: 0.55 },
  // Band 4 — lower
  { left: "14%", top: "78%", size: 5, opacity: 0.55 },
  { left: "30%", top: "82%", size: 3, opacity: 0.4 },
  { left: "46%", top: "76%", size: 6, opacity: 0.6 },
  { left: "56%", top: "84%", size: 4, opacity: 0.5 },
  { left: "72%", top: "80%", size: 5, opacity: 0.55 },
  { left: "88%", top: "85%", size: 6, opacity: 0.6 },
];

// Gradient presets keyed by lift level
const GRADIENTS: Record<
  NonNullable<Props["lift"]>,
  { sky: string; bloom: string }
> = {
  calm: {
    sky: "radial-gradient(ellipse at 50% 0%, rgba(160,195,245,0.85) 0%, rgba(100,155,215,0.8) 25%, rgba(55,105,185,0.88) 60%, rgba(25,60,140,1) 100%)",
    bloom:
      "radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.12) 0%, transparent 58%)",
  },
  balanced: {
    sky: "radial-gradient(ellipse at 50% 0%, rgba(180,210,255,0.9) 0%, rgba(120,170,230,0.85) 25%, rgba(70,120,200,0.9) 60%, rgba(30,70,150,1) 100%)",
    bloom:
      "radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.18) 0%, transparent 58%)",
  },
  bright: {
    sky: "radial-gradient(ellipse at 50% 0%, rgba(200,225,255,0.95) 0%, rgba(150,195,245,0.9) 25%, rgba(90,145,220,0.9) 60%, rgba(40,85,165,1) 100%)",
    bloom:
      "radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.25) 0%, transparent 58%)",
  },
};

// Glow multipliers
const GLOW_SETTINGS: Record<
  NonNullable<Props["glow"]>,
  { opacityScale: number; shadowScale: number }
> = {
  dim: { opacityScale: 0.6, shadowScale: 0.5 },
  soft: { opacityScale: 1.0, shadowScale: 1.0 },
  bright: { opacityScale: 1.0, shadowScale: 1.6 },
};

// Density subsampling: how many orbs to show
const DENSITY_COUNTS: Record<NonNullable<Props["density"]>, number> = {
  sparse: 8,
  moderate: 16,
  full: 24,
};

export default function DawningBrighter({
  lift = "balanced",
  density = "moderate",
  glow = "soft",
}: Props) {
  const gradient = GRADIENTS[lift];
  const glowSetting = GLOW_SETTINGS[glow];
  const orbCount = DENSITY_COUNTS[density];

  // Subsample evenly from the canonical set
  const step = ALL_ORBS.length / orbCount;
  const orbs = Array.from({ length: orbCount }, (_, i) =>
    ALL_ORBS[Math.floor(i * step)]
  );

  return (
    <>
      {/* Sky gradient */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: gradient.sky,
          pointerEvents: "none",
        }}
      />
      {/* Luminous center bloom */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: gradient.bloom,
          pointerEvents: "none",
        }}
      />
      {/* Gold light points */}
      {orbs.map((orb, i) => {
        const effectiveOpacity = orb.opacity * glowSetting.opacityScale;
        const s = glowSetting.shadowScale;
        return (
          <div
            key={i}
            style={{
              position: "fixed",
              left: orb.left,
              top: orb.top,
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background: "rgba(255,244,200,0.65)",
              opacity: effectiveOpacity,
              boxShadow: `0 0 ${8 * s}px ${3 * s}px rgba(255,220,140,0.18), 0 0 ${20 * s}px ${5 * s}px rgba(255,200,100,0.08)`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        );
      })}
    </>
  );
}
