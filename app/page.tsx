"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThresholdMap from "@/app/components/ThresholdMap";
import Link from "next/link";

const orbs: { left: string; top: string; size: number; opacity: number }[] = [
  { left: "6%", top: "8%", size: 5, opacity: 0.6 },
  { left: "18%", top: "15%", size: 3, opacity: 0.45 },
  { left: "32%", top: "6%", size: 6, opacity: 0.65 },
  { left: "48%", top: "22%", size: 4, opacity: 0.5 },
  { left: "64%", top: "12%", size: 7, opacity: 0.7 },
  { left: "82%", top: "18%", size: 4, opacity: 0.55 },
  { left: "10%", top: "38%", size: 6, opacity: 0.65 },
  { left: "42%", top: "44%", size: 3, opacity: 0.4 },
  { left: "72%", top: "40%", size: 8, opacity: 0.7 },
  { left: "22%", top: "68%", size: 5, opacity: 0.55 },
  { left: "56%", top: "72%", size: 4, opacity: 0.5 },
  { left: "88%", top: "85%", size: 6, opacity: 0.6 },
];

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
      }}
    >
      {/* Sky Layer 1 — Primary morning sky gradient */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(180,210,255,0.9) 0%, rgba(120,170,230,0.85) 25%, rgba(70,120,200,0.9) 60%, rgba(61,72,120,1) 100%)",
        }}
      />

      {/* Sky Layer 2 — Soft white glow at center */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.18) 0%, transparent 58%)",
        }}
      />

      {/* Sky Layer 3 — Warm gold orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: "rgba(255,244,200,0.65)",
            opacity: orb.opacity,
            boxShadow:
              "0 0 8px 3px rgba(255,220,140,0.18), 0 0 20px 5px rgba(255,200,100,0.08)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {/* Map + gold light points — z2 */}
      <ThresholdMap />

      {/* Content — logo, headline, thesis, CTAs — z3 */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
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
          {/* Canary logo */}
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
            className="cover-headline"
            style={{
              fontSize: "clamp(2.3rem, 6vw, 5.2rem)",
              lineHeight: 0.98,
              fontWeight: 650,
              margin: 0,
              marginBottom: 45,
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
              className="cover-thesis"
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
              className="cover-thesis"
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
              className="cover-thesis"
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
              About this Project
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
