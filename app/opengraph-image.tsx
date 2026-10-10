import { ImageResponse } from "next/og";
import constellationData from "@/data/canaryConstellationPoints.json";

export const runtime = "edge";
export const alt =
  "The Canary, formed from a night sky of lights — Canary Commons, Follow the Canary.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Deterministic PRNG (mulberry32) — same approach the homepage hero uses,
// so the background star scatter is stable across regenerations rather
// than different on every request.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default async function Image() {
  const rnd = mulberry32(20261008);

  // Plain background starfield — same spirit as the homepage's night
  // sky, kept simple and sparse so it reads clearly at social-preview
  // size without competing with the bird.
  const backgroundStars = Array.from({ length: 70 }, () => {
    const b = rnd();
    const size = b > 0.85 ? 3.2 : b > 0.5 ? 2 : 1.2;
    const opacity = 0.25 + b * 0.55;
    return {
      left: rnd() * 100,
      top: rnd() * 100,
      size,
      opacity,
    };
  });

  // The actual Canary — the same ~3,100-point constellation dataset and
  // the same x/y → bird-rectangle mapping the homepage hero uses for its
  // settled (fully-formed) state. Downsampled evenly for a fast, static
  // render while keeping the exact shape and proportions. (box-shadow
  // per element is very expensive to rasterize at this element count —
  // a touch of extra radius on the brightest points stands in for glow
  // instead, to keep this rendering in a reasonable time.)
  const birdPoints = constellationData.points.filter((_, i) => i % 3 === 0);

  // Scaled down slightly (same aspect ratio, same point mapping, same
  // pose) from the original full-bleed sizing, purely to open clean,
  // uncrowded space beneath the bird for the identity line below.
  const birdRect = { x: 345, y: 44, w: 510, h: 444 };
  const RADIUS_SCALE = 1.15;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse at 50% 32%, #15325a 0%, #0a1f38 45%, #050e1a 100%)",
        }}
      >
        {backgroundStars.map((s, i) => (
          <div
            key={`bg-${i}`}
            style={{
              position: "absolute",
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "rgba(225,235,255,1)",
              opacity: s.opacity,
            }}
          />
        ))}

        {birdPoints.map((p, i) => {
          const cx = birdRect.x + p.x * birdRect.w;
          const cy = birdRect.y + p.y * birdRect.h;
          // Brighter points get a touch more size instead of a glow —
          // box-shadow at this element count is too slow to rasterize.
          const r = p.r * RADIUS_SCALE * (p.peak > 0.8 ? 1.35 : 1);
          return (
            <div
              key={`bird-${i}`}
              style={{
                position: "absolute",
                left: cx - r,
                top: cy - r,
                width: r * 2,
                height: r * 2,
                borderRadius: "50%",
                background: "rgba(255,244,200,0.95)",
                opacity: p.peak,
              }}
            />
          );
        })}

        {/* Identity — so the image reads as Canary Commons on its own in
            a text/message/social preview. Centered, restrained, warm
            gold/cream, well clear of the bird. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 528,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: "#FFD86B",
              textShadow: "0 0 18px rgba(255,216,107,0.3)",
            }}
          >
            Canary Commons
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.16em",
              color: "rgba(255,248,230,0.72)",
            }}
          >
            FOLLOW THE CANARY
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
