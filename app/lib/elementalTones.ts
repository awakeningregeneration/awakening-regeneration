/**
 * Elemental atmosphere tones for listing tiles.
 *
 * Five qualities — Earth, Water, Fire, Air, Spirit — expressed as
 * very subtle overlay washes and textures on the deep-sky base (#08192d).
 * Spirit is the default / bridge element (no color overlay, just
 * a few small gold light points).
 */

export type ElementName = "earth" | "water" | "fire" | "air" | "spirit";

type SpiritDot = { left: string; top: string; size: number; opacity: number };

export interface ElementalTone {
  /** Semi-transparent overlay color (or "transparent" for spirit) */
  overlayColor: string;
  /** CSS background-image value for texture/pattern */
  backgroundImage: string;
  /** Gold light points (spirit only) */
  spiritDots?: SpiritDot[];
}

export const elementalTones: Record<ElementName, ElementalTone> = {
  earth: {
    overlayColor: "rgba(90, 110, 75, 0.15)",
    backgroundImage:
      "radial-gradient(circle at 25% 35%, rgba(90,110,75,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 65%, rgba(90,110,75,0.06) 0%, transparent 40%)",
  },

  water: {
    overlayColor: "rgba(60, 110, 140, 0.12)",
    backgroundImage:
      "linear-gradient(0deg, rgba(120,180,220,0.04) 0%, transparent 18%, transparent 36%, rgba(120,180,220,0.03) 36%, transparent 54%, transparent 72%, rgba(120,180,220,0.04) 72%, transparent 90%)",
  },

  fire: {
    overlayColor: "rgba(140, 95, 70, 0.12)",
    backgroundImage:
      "radial-gradient(ellipse at 50% 90%, rgba(217,165,102,0.09) 0%, transparent 60%)",
  },

  air: {
    overlayColor: "rgba(180, 195, 210, 0.10)",
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(180,195,210,0.06) 65%, transparent 100%)",
  },

  spirit: {
    overlayColor: "transparent",
    backgroundImage: "none",
    spiritDots: [
      { left: "20%", top: "25%", size: 2, opacity: 0.18 },
      { left: "70%", top: "30%", size: 1.5, opacity: 0.15 },
      { left: "40%", top: "68%", size: 2, opacity: 0.2 },
      { left: "80%", top: "72%", size: 1.5, opacity: 0.15 },
    ],
  },
};
