import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Canary Commons — a starry night sky with the Canary Commons logo and the headline Connected, We Dawn Brighter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 50% 30%, #0f2d52 0%, #0a2440 40%, #08192d 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gold glow behind center */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "30%",
            width: "40%",
            height: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,216,107,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Scattered gold dots suggesting listing lights */}
        {[
          { l: 80, t: 120, s: 4 },
          { l: 180, t: 200, s: 3 },
          { l: 320, t: 80, s: 5 },
          { l: 450, t: 180, s: 3 },
          { l: 750, t: 100, s: 4 },
          { l: 880, t: 160, s: 6 },
          { l: 1020, t: 90, s: 3 },
          { l: 1100, t: 200, s: 4 },
          { l: 140, t: 480, s: 3 },
          { l: 300, t: 520, s: 4 },
          { l: 500, t: 560, s: 3 },
          { l: 700, t: 500, s: 5 },
          { l: 900, t: 540, s: 3 },
          { l: 1060, t: 490, s: 4 },
          { l: 60, t: 350, s: 3 },
          { l: 1140, t: 380, s: 3 },
        ].map((dot, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: dot.l,
              top: dot.t,
              width: dot.s,
              height: dot.s,
              borderRadius: "50%",
              background: "rgba(255,244,200,0.85)",
              boxShadow: `0 0 ${dot.s * 2}px rgba(255,216,107,0.4)`,
            }}
          />
        ))}

        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.canarycommons.org/canary-commons-logo.png"
          alt=""
          width={280}
          height={280}
          style={{ marginTop: -20, marginBottom: -10 }}
        />

        {/* Headline */}
        <div
          style={{
            color: "white",
            fontSize: 64,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.0,
          }}
        >
          Connected,
        </div>
        <div
          style={{
            color: "#FFD86B",
            fontSize: 86,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.0,
            marginTop: 4,
            textShadow: "0 0 40px rgba(255,216,107,0.4)",
          }}
        >
          We Dawn Brighter
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: "rgba(255,248,230,0.8)",
            fontSize: 26,
            textAlign: "center",
            marginTop: 28,
            fontStyle: "italic",
          }}
        >
          canarycommons.org
        </div>
      </div>
    ),
    { ...size }
  );
}
