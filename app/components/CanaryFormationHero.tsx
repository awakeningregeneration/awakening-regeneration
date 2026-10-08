"use client";

import { useEffect, useRef } from "react";
import constellationData from "@/data/canaryConstellationPoints.json";

interface ConstellationPoint {
  x: number;
  y: number;
  r: number;
  peak: number;
  b: number;
}

interface ConstellationData {
  points: ConstellationPoint[];
  bounds: { offX: number; offY: number; w: number; h: number };
}

const DATA = constellationData as ConstellationData;

const NAVY = "#0F2A47";
const GLOW_RATIO = 2.9; // outer glow radius / core radius
const HOLD_MS = 800; // still beat of night sky before anything moves

type StarTier = "point" | "soft" | "bright";

interface BgStar {
  x: number;
  y: number;
  r: number;
  alpha: number;
  tier: StarTier;
}

interface TravelingPoint {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  r: number;
  peak: number;
  bucket: number;
  delay: number;
  dur: number;
}

function mulberry32(seed: number) {
  let s = seed;
  return function () {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * The night-sky hero: a stable field of background stars (never moves)
 * plus a subset of lights that gather into the Canary silhouette. Honors
 * prefers-reduced-motion by rendering the settled scene directly, with
 * no gathering animation.
 */
export default function CanaryFormationHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let rafId: number | null = null;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);

    const rnd = mulberry32(42);

    // The sub-region of the full sky where the Canary itself resolves —
    // everything else in the canvas is open sky around and behind it.
    const birdSize = Math.min(canvas.width, canvas.height) * 0.46;
    const birdRect = {
      x: canvas.width / 2 - birdSize / 2,
      y: canvas.height * 0.13,
      w: birdSize,
      h: birdSize,
    };
    const designScale = birdRect.w / 1100;

    // Gold sprites for the constellation points, bucketed by warmth.
    const BUCKETS = 5;
    const SPR = 96;
    const goldSprites: HTMLCanvasElement[] = [];
    for (let b = 0; b < BUCKETS; b++) {
      const warm = b / (BUCKETS - 1);
      const core: [number, number, number] = [
        255,
        210 + 20 * warm,
        110 + 70 * warm,
      ];
      const off = document.createElement("canvas");
      off.width = SPR;
      off.height = SPR;
      const octx = off.getContext("2d")!;
      const cx = SPR / 2;
      const cy = SPR / 2;
      const outerR = SPR / 2;

      const g1 = octx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
      g1.addColorStop(0, `rgba(${core[0]},${core[1]},${core[2]},0.42)`);
      g1.addColorStop(1, `rgba(${core[0]},${core[1]},${core[2]},0)`);
      octx.fillStyle = g1;
      octx.beginPath();
      octx.arc(cx, cy, outerR, 0, Math.PI * 2);
      octx.fill();

      const coreR = outerR / GLOW_RATIO;
      const g2 = octx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      g2.addColorStop(0, "rgba(255,232,170,1)");
      g2.addColorStop(1, "rgba(255,232,170,0)");
      octx.fillStyle = g2;
      octx.beginPath();
      octx.arc(cx, cy, coreR, 0, Math.PI * 2);
      octx.fill();

      goldSprites.push(off);
    }

    // Real stars, not glitter: three tiers rendered differently so the
    // faint majority never accumulates into haze.
    function makeStarSprite(tier: StarTier): HTMLCanvasElement {
      const S = 128;
      const c = document.createElement("canvas");
      c.width = S;
      c.height = S;
      const o = c.getContext("2d")!;
      const cx = S / 2;
      const cy = S / 2;

      if (tier === "bright") {
        const armLen = S * 0.47;
        const drawArm = (rotate: number) => {
          o.save();
          o.translate(cx, cy);
          o.rotate(rotate);
          const g = o.createLinearGradient(-armLen, 0, armLen, 0);
          g.addColorStop(0, "rgba(235,242,255,0)");
          g.addColorStop(0.46, "rgba(235,242,255,0.22)");
          g.addColorStop(0.5, "rgba(255,255,255,0.65)");
          g.addColorStop(0.54, "rgba(235,242,255,0.22)");
          g.addColorStop(1, "rgba(235,242,255,0)");
          o.fillStyle = g;
          o.fillRect(-armLen, -1.1, armLen * 2, 2.2);
          o.restore();
        };
        drawArm(0);
        drawArm(Math.PI / 2);
      }

      if (tier !== "point") {
        const haloR = tier === "bright" ? S * 0.2 : S * 0.13;
        const haloPeak = tier === "bright" ? 0.85 : 0.55;
        const g1 = o.createRadialGradient(cx, cy, 0, cx, cy, haloR);
        g1.addColorStop(0, `rgba(255,255,255,${haloPeak})`);
        g1.addColorStop(0.3, `rgba(220,232,248,${haloPeak * 0.5})`);
        g1.addColorStop(1, "rgba(205,220,240,0)");
        o.fillStyle = g1;
        o.beginPath();
        o.arc(cx, cy, haloR, 0, Math.PI * 2);
        o.fill();
      }

      const coreR = S * (tier === "point" ? 0.05 : 0.065);
      const g2 = o.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      g2.addColorStop(0, "rgba(255,255,255,1)");
      g2.addColorStop(0.7, "rgba(255,255,255,0.9)");
      g2.addColorStop(1, "rgba(255,255,255,0)");
      o.fillStyle = g2;
      o.beginPath();
      o.arc(cx, cy, coreR, 0, Math.PI * 2);
      o.fill();

      return c;
    }
    const bgSpritePoint = makeStarSprite("point");
    const bgSpriteSoft = makeStarSprite("soft");
    const bgSpriteBright = makeStarSprite("bright");

    // Subtle, isotropic density variation — sampled in real screen pixels
    // so patches stay roughly circular and don't stretch into a band on
    // wide viewports.
    function makeFieldNoise(seed: number, cellPx: number) {
      const rndN = mulberry32(seed);
      const cache = new Map<string, number>();
      function cellValue(cx: number, cy: number) {
        const key = cx + "," + cy;
        let v = cache.get(key);
        if (v === undefined) {
          v = rndN();
          cache.set(key, v);
        }
        return v;
      }
      return function (px: number, py: number) {
        const gx = px / cellPx;
        const gy = py / cellPx;
        const x0 = Math.floor(gx);
        const y0 = Math.floor(gy);
        const tx = gx - x0;
        const ty = gy - y0;
        const v00 = cellValue(x0, y0);
        const v10 = cellValue(x0 + 1, y0);
        const v01 = cellValue(x0, y0 + 1);
        const v11 = cellValue(x0 + 1, y0 + 1);
        const top = v00 + (v10 - v00) * tx;
        const bot = v01 + (v11 - v01) * tx;
        return top + (bot - top) * ty;
      };
    }
    const fieldNoise = makeFieldNoise(917, 420);

    // Background starfield: a genuine sky, spread across the whole
    // visual field — not concentrated around the bird's footprint, and
    // never moves. This is the "larger constellation" the Canary
    // gathers out of; only the traveling points below ever move.
    const bgStars: BgStar[] = [];
    const BG_CANDIDATES = 1500;
    for (let i = 0; i < BG_CANDIDATES; i++) {
      const px = rnd() * canvas.width;
      const py = rnd() * canvas.height;
      const density = 0.6 + 0.6 * fieldNoise(px, py);
      if (rnd() >= density * 0.58) continue;

      const b = Math.pow(rnd(), 3.2); // skewed toward faint
      const sizeJitter = 0.82 + rnd() * 0.45;
      let tier: StarTier;
      let r: number;
      let alpha: number;
      if (b > 0.82) {
        tier = "bright";
        r = (1.7 + b * 1.6) * sizeJitter;
        alpha = 0.82 + ((b - 0.82) / 0.18) * 0.18;
      } else if (b > 0.45) {
        tier = "soft";
        r = (0.85 + b * 1.1) * sizeJitter;
        alpha = 0.48 + ((b - 0.45) / 0.37) * 0.34;
      } else {
        tier = "point";
        r = (0.4 + b * 0.7) * sizeJitter;
        alpha = 0.2 + b * 0.46;
      }
      bgStars.push({
        x: px / canvas.width,
        y: py / canvas.height,
        r,
        alpha,
        tier,
      });
    }

    function drawBackgroundStars() {
      for (let i = 0; i < bgStars.length; i++) {
        const s = bgStars[i];
        const cx = s.x * canvas!.width;
        const cy = s.y * canvas!.height;
        const d = s.r * designScale * 13;
        const sprite =
          s.tier === "bright"
            ? bgSpriteBright
            : s.tier === "soft"
              ? bgSpriteSoft
              : bgSpritePoint;
        ctx!.globalAlpha = s.alpha;
        ctx!.drawImage(sprite, cx - d / 2, cy - d / 2, d, d);
      }
      ctx!.globalAlpha = 1;
    }

    // Initial scatter: spread across a wide span of the full sky — these
    // points start indistinguishable from the ordinary background stars,
    // not confined to a patch near where the bird will resolve.
    const scatterSpan = Math.min(canvas.width, canvas.height);
    const scatterCenter = { x: canvas.width * 0.5, y: canvas.height * 0.4 };
    const scatterR = { x: scatterSpan * 0.62, y: scatterSpan * 0.56 };

    const pts: TravelingPoint[] = DATA.points.map((p) => {
      const u = rnd();
      const ang = rnd() * Math.PI * 2;
      const rad = Math.sqrt(u);
      const x0 = scatterCenter.x + Math.cos(ang) * scatterR.x * rad;
      const y0 = scatterCenter.y + Math.sin(ang) * scatterR.y * rad;
      return {
        x0,
        y0,
        x1: birdRect.x + p.x * birdRect.w,
        y1: birdRect.y + p.y * birdRect.h,
        r: p.r,
        peak: p.peak,
        bucket: p.b,
        delay: rnd() * 1750,
        dur: 2900 + rnd() * 1500,
      };
    });

    function drawPointAt(p: TravelingPoint, cx: number, cy: number, sizeMix: number, peakMix: number) {
      const radiusPx = p.r * designScale * sizeMix;
      const alpha = p.peak * peakMix;
      const drawSize = radiusPx * 2 * GLOW_RATIO;
      ctx!.globalAlpha = alpha;
      ctx!.drawImage(
        goldSprites[p.bucket],
        cx - drawSize / 2,
        cy - drawSize / 2,
        drawSize,
        drawSize,
      );
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      // Essential message without motion: the settled sky + Canary,
      // drawn once, with no gathering animation.
      ctx.fillStyle = NAVY;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawBackgroundStars();
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        drawPointAt(p, p.x1, p.y1, 1, 1);
      }
      ctx.globalAlpha = 1;
      return () => {
        cancelled = true;
      };
    }

    let startTime: number | null = null;

    function frame(ts: number) {
      if (cancelled) return;
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime - HOLD_MS;

      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.fillStyle = NAVY;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      drawBackgroundStars();

      let stillAnimating = false;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        let t = (elapsed - p.delay) / p.dur;
        if (t < 1) stillAnimating = true;
        t = Math.min(1, Math.max(0, t));
        const e = easeInOutCubic(t);

        const cx = p.x0 + (p.x1 - p.x0) * e;
        const cy = p.y0 + (p.y1 - p.y0) * e;

        // Before they gather, these points sit closer to ordinary
        // background-star brightness — they visibly warm up and
        // brighten as they arrive, rather than looking "special" at rest.
        const sizeMix = 0.42 + 0.58 * e;
        const peakMix = 0.4 + 0.6 * e;
        drawPointAt(p, cx, cy, sizeMix, peakMix);
      }
      ctx!.globalAlpha = 1;

      if (stillAnimating) {
        rafId = requestAnimationFrame(frame);
      }
      // Once every point has arrived, the loop simply stops — the last
      // drawn frame is the resting constellation, with no further motion.
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
