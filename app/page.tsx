"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThresholdMap from "@/app/components/ThresholdMap";
import Link from "next/link";

/* ── Seeded PRNG (Mulberry32) — deterministic on server + client ── */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Generate starfield at module scope (runs once, same both sides) ── */
type Star = {
  x: number;
  y: number;
  r: number;
  color: string;
  opacity: number;
};

// Star color palette — weighted for visible variation
// 50% white/cream, 18% cool-blue, 13% warm-gold, 10% purple-lavender, 9% warm-peach
function pickStarColor(roll: number, size: number): { color: string; opBoost: number } {
  const saturated = size >= 2.0;
  if (roll < 0.50) {
    return { color: roll < 0.30 ? "#ffffff" : "#fff8e0", opBoost: 0 };
  } else if (roll < 0.68) {
    return { color: saturated ? "#b8d0ff" : "#c8d8ff", opBoost: saturated ? 0.2 : 0.1 };
  } else if (roll < 0.81) {
    return { color: saturated ? "#ffd888" : "#ffe0a0", opBoost: saturated ? 0.2 : 0.1 };
  } else if (roll < 0.91) {
    return { color: saturated ? "#d8c0ff" : "#e0c8ff", opBoost: saturated ? 0.2 : 0.1 };
  } else {
    return { color: saturated ? "#ffc8b0" : "#ffd0c8", opBoost: saturated ? 0.15 : 0.05 };
  }
}

const rng = mulberry32(77743);
const STARFIELD: Star[] = [];

// Pass 1: Main radial field — dense outer, hard-cleared center
// Density zones by normalizedDistance (0 = center, 1 = corner):
//   0.00–0.45  inner clearing   keepProb  0.01  (near-zero)
//   0.45–0.60  transition       keepProb  0.25
//   0.60–1.00  outer dense      keepProb  1.00
for (let i = 0; i < 16000 && STARFIELD.length < 1800; i++) {
  const x = rng() * 100;
  const y = rng() * 100;
  const dx = x - 50;
  const dy = y - 50;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const norm = dist / 70.7;

  let keep: number;
  if (norm < 0.45) {
    keep = 0.01;
  } else if (norm < 0.60) {
    keep = 0.25;
  } else {
    keep = 1.0;
  }
  if (rng() > keep) continue;

  const sizeRoll = rng();
  const r =
    sizeRoll < 0.45
      ? 0.8
      : sizeRoll < 0.75
        ? 1.2
        : sizeRoll < 0.9
          ? 1.8
          : sizeRoll < 0.97
            ? 2.5
            : 3.5;

  let baseOp =
    norm < 0.45 ? 0.08 + rng() * 0.12 : 0.35 + rng() * 0.65;

  const { color, opBoost } = pickStarColor(rng(), r);
  const opacity = Math.min(1, baseOp + opBoost);

  STARFIELD.push({ x, y, r, color, opacity });
}

// Pass 2: Milky Way diagonal band (upper-left → lower-right)
for (let i = 0; i < 2000 && STARFIELD.length < 2100; i++) {
  const t = rng();
  const spread = (rng() - 0.5) * 22;
  const x = t * 100 + spread * 0.7;
  const y = t * 100 - spread * 0.7;

  if (x < 0 || x > 100 || y < 0 || y > 100) continue;

  const dx = x - 50;
  const dy = y - 50;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const norm = dist / 70.7;
  if (norm < 0.45) continue;

  const sizeRoll = rng();
  const r =
    sizeRoll < 0.5
      ? 0.7
      : sizeRoll < 0.8
        ? 1.1
        : sizeRoll < 0.95
          ? 1.6
          : 2.2;

  let baseOp = 0.2 + rng() * 0.5;
  const { color, opBoost } = pickStarColor(rng(), r);
  const opacity = Math.min(1, baseOp + opBoost);

  STARFIELD.push({ x, y, r, color, opacity });
}

// Pass 3: Micro-star haze — outer zone only, tiny faint dots for depth
for (let i = 0; i < 8000 && STARFIELD.length < 3000; i++) {
  const x = rng() * 100;
  const y = rng() * 100;
  const dx = x - 50;
  const dy = y - 50;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const norm = dist / 70.7;

  if (norm < 0.60) continue;

  const r = 0.4 + rng() * 0.6;
  const opacity = 0.15 + rng() * 0.35;
  const colorRoll = rng();
  const color = colorRoll < 0.50 ? "#ffffff" : colorRoll < 0.68 ? "#c8d8ff" : colorRoll < 0.81 ? "#ffe0a0" : colorRoll < 0.91 ? "#e0c8ff" : "#ffd0c8";

  STARFIELD.push({ x, y, r, color, opacity });
}

// Pass 4: Outermost micro-star crust — extreme edges only
for (let i = 0; i < 4000 && STARFIELD.length < 3500; i++) {
  const x = rng() * 100;
  const y = rng() * 100;
  const dx = x - 50;
  const dy = y - 50;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const norm = dist / 70.7;

  if (norm < 0.85) continue;

  const r = 0.3 + rng() * 0.4;
  const opacity = 0.12 + rng() * 0.22;
  const crustRoll = rng();
  const color = crustRoll < 0.50 ? "#ffffff" : crustRoll < 0.68 ? "#c8d8ff" : crustRoll < 0.81 ? "#ffe0a0" : "#e0c8ff";

  STARFIELD.push({ x, y, r, color, opacity });
}

/* ── US states list ── */
const STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "District of Columbia",
];

export default function HomePage() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleEnterPlace() {
    if (!selectedState) return;
    router.push(`/map?state=${encodeURIComponent(selectedState)}`);
  }

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        color: "white",
        background: "#0b2748",
      }}
    >
      {/* z-0: Earth — the US map, farthest layer */}
      <ThresholdMap />

      {/* Client-only layers — rendered after hydration to avoid mismatch */}
      {mounted && (
        <>
          {/* Sky color variation — nebular drifts in the periphery */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
              background: [
                "radial-gradient(ellipse 45% 50% at 12% 18%, rgba(26,24,69,0.22) 0%, transparent 100%)",
                "radial-gradient(ellipse 40% 55% at 88% 75%, rgba(26,24,69,0.18) 0%, transparent 100%)",
                "radial-gradient(ellipse 50% 40% at 78% 15%, rgba(42,37,96,0.13) 0%, transparent 100%)",
                "radial-gradient(ellipse 35% 45% at 20% 82%, rgba(42,37,96,0.11) 0%, transparent 100%)",
                "radial-gradient(ellipse 55% 35% at 85% 45%, rgba(32,24,64,0.10) 0%, transparent 100%)",
              ].join(", "),
            }}
          />

          {/* z-1: Starfield — the Milky Way, middle layer */}
          <svg
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            {STARFIELD.map((s, i) => (
              <circle
                key={i}
                cx={`${s.x}%`}
                cy={`${s.y}%`}
                r={s.r}
                fill={s.color}
                opacity={s.opacity}
              />
            ))}
          </svg>

          {/* z-1: Subtle warm nimbus behind canary */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "15%",
              width: 800,
              height: 800,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 1,
              background:
                "radial-gradient(circle, rgba(255,216,107,0.08) 0%, rgba(255,216,107,0.03) 35%, transparent 60%)",
            }}
          />
        </>
      )}

      {/* z-2+: Page content — canary, headline, thesis, CTAs (nearest layer) */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "0 28px 32px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Canary logo — floats above the starfield */}
          <img
            src="/canary-commons-logo.png"
            alt="Canary Commons"
            style={{
              width: "clamp(280px, 40vw, 460px)",
              height: "auto",
              display: "block",
              margin: "0 auto -10px",
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))",
              position: "relative",
              zIndex: 3,
            }}
          />

          <h1
            style={{
              fontSize: "clamp(2.3rem, 6vw, 5.2rem)",
              lineHeight: 0.98,
              fontWeight: 650,
              margin: 0,
              marginBottom: 70,
              textShadow: "0 12px 34px rgba(6,16,40,0.34)",
            }}
          >
            Connected,
            <br />
            <span
              style={{
                color: "#FFD86B",
                textShadow:
                  "0 0 32px rgba(255,216,107,0.38), 0 0 64px rgba(255,200,80,0.18)",
              }}
            >
              We Dawn Brighter
            </span>
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "rgba(255,244,200,0.95)",
                boxShadow:
                  "0 0 10px 4px rgba(255,220,140,0.45), 0 0 22px 6px rgba(255,200,100,0.18)",
                marginLeft: "4px",
                verticalAlign: "baseline",
                position: "relative",
                top: "2px",
              }}
            />
          </h1>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 760,
            margin: "0 auto",
            textAlign: "center",
            paddingBottom: "clamp(20px, 3vh, 36px)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.35rem",
              margin: "0 auto 50px",
              maxWidth: 700,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "clamp(1.56rem, 2.1vw, 1.76rem)",
                lineHeight: 1.5,
                fontWeight: 500,
                letterSpacing: "0.025em",
                color: "#fffcf0",
                textShadow:
                  "0 0 12px rgba(255,248,230,0.35), 0 0 24px rgba(255,248,230,0.20), 0 0 2px rgba(10,20,40,0.6)",
                textAlign: "center",
              }}
            >
              A gateway revealing what is already life-forward.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(1.56rem, 2.1vw, 1.76rem)",
                lineHeight: 1.5,
                fontWeight: 500,
                letterSpacing: "0.025em",
                color: "#fffcf0",
                textShadow:
                  "0 0 12px rgba(255,248,230,0.35), 0 0 24px rgba(255,248,230,0.20), 0 0 2px rgba(10,20,40,0.6)",
                textAlign: "center",
              }}
            >
              We are the change.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(1.56rem, 2.1vw, 1.76rem)",
                lineHeight: 1.5,
                fontWeight: 500,
                letterSpacing: "0.025em",
                color: "#fffcf0",
                textShadow:
                  "0 0 12px rgba(255,248,230,0.35), 0 0 24px rgba(255,248,230,0.20), 0 0 2px rgba(10,20,40,0.6)",
                textAlign: "center",
              }}
            >
              Our attention is what fuels it.
            </p>
          </div>

          <div
            style={{
              textAlign: "center",
              marginBottom: 18,
            }}
          >
            <Link
              href="/about"
              style={{
                color: "#fff8e0",
                fontSize: "1.1rem",
                fontWeight: 550,
                fontStyle: "italic",
                textDecoration: "none",
                borderBottom: "2.5px solid #FFD86B",
                paddingBottom: 2,
                textShadow: "0 0 8px rgba(0,0,0,0.3)",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderBottomColor = "#ffe6a0";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderBottomColor = "#FFD86B";
                e.currentTarget.style.color = "#fff8e0";
              }}
            >
              About this project
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                flex: 1,
                minWidth: 250,
                maxWidth: 360,
                padding: "13px 15px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(20,42,92,0.34)",
                color: "white",
                fontSize: 16,
                outline: "none",
                backdropFilter: "blur(6px)",
                boxShadow: "0 8px 24px rgba(10,24,60,0.16)",
              }}
            >
              <option value="">Choose a state</option>
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleEnterPlace}
              disabled={!selectedState}
              style={{
                padding: "13px 20px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                background: selectedState
                  ? "rgba(255,216,107,0.14)"
                  : "rgba(255,255,255,0.05)",
                color: selectedState
                  ? "#FFE08A"
                  : "rgba(255,255,255,0.44)",
                fontSize: 16,
                fontWeight: 600,
                cursor: selectedState ? "pointer" : "not-allowed",
                backdropFilter: "blur(6px)",
                boxShadow: selectedState
                  ? "0 0 20px rgba(255,216,107,0.12)"
                  : "none",
              }}
            >
              Enter
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/founders"
              className="rounded-xl bg-amber-300 px-5 py-3 font-medium text-slate-900 shadow-sm transition hover:opacity-90"
            >
              Become the Foundation
            </Link>
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 14,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            Join the people helping turn on the first lights.
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: "0.95rem",
              letterSpacing: "0.18em",
              color: "rgba(255,248,224,0.88)",
              textAlign: "center",
              fontStyle: "italic",
              textShadow: "0 0 8px rgba(10,20,40,0.5)",
            }}
          >
            A forming commons
          </div>
        </div>
      </div>
    </main>
  );
}
