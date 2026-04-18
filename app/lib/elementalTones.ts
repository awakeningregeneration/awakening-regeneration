/**
 * Elemental signature system for Canary Commons.
 *
 * Five qualities — Earth, Water, Fire, Air, Spirit — expressed as
 * visual signatures inside a small "seat" component beside listing tiles.
 *
 * Spirit is universal: every listing carries it. Other elements layer
 * on top when a listing has a specific domain emphasis assigned.
 */

export type ElementName = "earth" | "water" | "fire" | "air" | "spirit";

/**
 * Spirit signature: gold points in a gestural configuration.
 * Arranged as a loose triangle-with-center — three corners plus
 * one near-center point that pulls them into relationship.
 * Not random scatter, but held: "little gold specs that dance together."
 */
export interface SpiritPoint {
  /** Percent from left edge */
  left: number;
  /** Percent from top edge */
  top: number;
  /** Point diameter in px */
  size: number;
  /** 0–1 */
  opacity: number;
}

export interface ElementalSignature {
  /** CSS background value for the seat interior (gradient, color, etc.) */
  background: string;
  /** Optional CSS backgroundImage layered on top of background */
  backgroundImage?: string;
  /** Spirit-only: gold points in relational configuration */
  spiritPoints?: SpiritPoint[];
}

export const elementalSignatures: Record<ElementName, ElementalSignature> = {
  spirit: {
    background: "transparent",
    spiritPoints: [
      // Loose held triangle with a center anchor
      { left: 28, top: 22, size: 2.5, opacity: 0.82 }, // upper-left
      { left: 72, top: 28, size: 2, opacity: 0.7 },    // upper-right
      { left: 50, top: 48, size: 2, opacity: 0.65 },   // center (the one that holds)
      { left: 42, top: 74, size: 2.5, opacity: 0.78 }, // lower
    ],
  },

  earth: {
    background:
      "radial-gradient(circle at 40% 58%, rgba(90,110,75,0.35) 0%, rgba(60,80,50,0.15) 55%, transparent 85%)",
    backgroundImage:
      "radial-gradient(circle at 65% 35%, rgba(110,95,65,0.18) 0%, transparent 40%)",
  },

  water: {
    background:
      "linear-gradient(0deg, rgba(60,110,140,0.06) 0%, rgba(80,140,170,0.18) 20%, transparent 20%, transparent 40%, rgba(60,110,140,0.12) 40%, transparent 60%, transparent 75%, rgba(80,140,170,0.15) 75%, transparent 95%)",
  },

  fire: {
    background:
      "radial-gradient(ellipse at 50% 85%, rgba(217,165,102,0.4) 0%, rgba(180,120,70,0.2) 40%, transparent 70%)",
  },

  air: {
    background:
      "radial-gradient(circle at 50% 50%, rgba(180,195,210,0.22) 0%, rgba(200,215,230,0.08) 50%, transparent 80%)",
  },
};
