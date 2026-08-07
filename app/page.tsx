"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThresholdMap from "@/app/components/ThresholdMap";
import Link from "next/link";

// Orb positions: interior US heartland only — left 36–65%, top 29–53%
// Far from all coastlines and well clear of Pacific, Atlantic, and Gulf.
const orbs: { left: string; top: string; size: number; opacity: number }[] = [
  { left: "36%", top: "31%", size: 5, opacity: 0.6 },   // Montana / North Dakota
  { left: "52%", top: "29%", size: 3, opacity: 0.45 },  // Minnesota / Wisconsin
  { left: "62%", top: "32%", size: 6, opacity: 0.65 },  // Wisconsin / Michigan UP
  { left: "38%", top: "40%", size: 4, opacity: 0.5 },   // Wyoming / Colorado
  { left: "46%", top: "37%", size: 7, opacity: 0.7 },   // Nebraska / Iowa
  { left: "58%", top: "38%", size: 4, opacity: 0.55 },  // Illinois / Indiana
  { left: "65%", top: "40%", size: 6, opacity: 0.65 },  // Ohio
  { left: "42%", top: "46%", size: 3, opacity: 0.4 },   // Kansas
  { left: "54%", top: "44%", size: 8, opacity: 0.7 },   // Missouri / Kentucky
  { left: "40%", top: "53%", size: 5, opacity: 0.55 },  // Oklahoma interior
  { left: "52%", top: "52%", size: 4, opacity: 0.5 },   // Tennessee
  { left: "61%", top: "48%", size: 6, opacity: 0.6 },   // West Virginia
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
            src="/canary-logo-new.png"
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
          {/* About link */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            <Link
              href="/about"
              style={{
                color: "#fff8e0",
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textDecoration: "none",
                borderBottom: "3.5px solid #FFD86B",
                paddingBottom: 4,
                paddingLeft: 6,
                paddingRight: 6,
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
              ABOUT
            </Link>
          </div>

          {/* Hero phrases — in flow, between ABOUT nav and state selector */}
          <p
            style={{
              margin: "0 auto 48px",
              position: "relative",
              top: "-0.5em",
              fontSize: "clamp(1.6rem, 2.4vw, 2.4rem)",
              fontWeight: 800,
              letterSpacing: "0.06em",
              color: "#fffcf0",
              textShadow:
                "0 0 20px rgba(255,248,230,0.5), 0 0 40px rgba(255,248,230,0.22), 0 2px 5px rgba(10,20,40,0.8)",
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            <span style={{ display: "block", marginBottom: "0.42em" }}>MAKE A DIFFERENCE</span>
            <span style={{ display: "block" }}>WITH EVERY CHOICE</span>
          </p>
          <p
            style={{
              margin: "0 auto 20px",
              marginTop: "4.4rem",
              fontSize: "clamp(1.15rem, 1.7vw, 1.45rem)",
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: "#fffcf0",
              textShadow:
                "0 0 12px rgba(255,248,230,0.3), 0 1px 3px rgba(10,20,40,0.7)",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            See what's rising around you, near and far.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 44,
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

          {/* Tend the commons — founders door */}
          <div style={{ textAlign: "center" }}>
            <div className="flex justify-center">
              <Link
                href="/founders"
                className="rounded-xl bg-amber-300 px-5 py-3 font-medium text-slate-900 shadow-sm transition hover:opacity-90"
              >
                Stewardship
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
