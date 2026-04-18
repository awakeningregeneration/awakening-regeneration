"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThresholdMap from "@/app/components/ThresholdMap";
import Link from "next/link";

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
        background:
          "radial-gradient(circle at top, rgba(90,150,255,0.45) 0%, rgba(40,100,200,0.38) 22%, rgba(18,60,150,0.78) 52%, rgba(6,26,70,1) 100%)",
      }}
    >
      <ThresholdMap />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(20,70,150,0.22) 0%, rgba(20,70,150,0.05) 30%, rgba(12,50,120,0.26) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(60,110,200,0.13) 0%, transparent 62%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "clamp(8px, 1.5vw, 20px) 28px 32px",
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
          <img
            src="/canary-commons-logo.png"
            alt="Canary Commons"
            style={{
              width: "clamp(280px, 40vw, 460px)",
              height: "auto",
              display: "block",
              margin: "0 auto -2px",
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))",
            }}
          />

          <h1
            style={{
              fontSize: "clamp(2.3rem, 6vw, 5.2rem)",
              lineHeight: 0.98,
              fontWeight: 650,
              margin: 0,
              marginBottom: 12,
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
              fontSize: "clamp(1.02rem, 1.35vw, 1.14rem)",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.97)",
              maxWidth: 760,
              margin: "0 auto 10px",
              textShadow: "0 4px 18px rgba(4,12,35,0.65)",
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                textShadow: "0 2px 12px rgba(4,12,35,0.72)",
              }}
            >
              Life moves through a few simple needs:
              <br />
              air, water, soil, energy, and relationship.
            </p>

            <p
              style={{
                margin: "0 0 8px",
                textShadow: "0 2px 12px rgba(4,12,35,0.72)",
              }}
            >
              Canary Commons helps make visible what is already moving in those
              directions.
            </p>
          </div>

          <p
            style={{
              fontSize: "clamp(1.05rem, 1.45vw, 1.22rem)",
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.97)",
              maxWidth: 700,
              margin: "0 auto 14px",
              textShadow: "0 4px 18px rgba(4,12,35,0.65)",
            }}
          >
            Choose a place and see what is becoming visible where you are or
            where you are going.
            <br />
            <span
              style={{
                display: "inline-block",
                marginTop: 8,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.82)",
              }}
            >
              What we give our attention to grows.
            </span>
          </p>

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
              <option value="">Select a state</option>
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

          <div
            style={{
              marginTop: 8,
              fontSize: 15,
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.82)",
              textShadow: "0 4px 18px rgba(4,12,35,0.65)",
              maxWidth: 760,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Once you choose a state, the live map will open there and you can
            narrow further by county.
          </div>

          <div
            style={{
              marginTop: 18,
              fontSize: 14,
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 4px 18px rgba(4,12,35,0.65)",
            }}
          >
            <a
              href="/about"
              style={{
                textDecoration: "underline",
                textUnderlineOffset: 3,
                color: "inherit",
              }}
            >
              About this project
            </a>
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
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "rgba(255,216,107,0.70)",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            A young commons, still forming
          </div>
        </div>
      </div>
    </main>
  );
}