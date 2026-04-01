"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThresholdMap from "@/app/components/ThresholdMap";

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
  "linear-gradient(to bottom, rgba(20,70,150,0.12) 0%, rgba(20,70,150,0.05) 30%, rgba(12,50,120,0.14) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "34px 28px 28px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
            paddingTop: "clamp(10px, 2vw, 24px)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.46)",
              marginBottom: 14,
            }}
          >
            Canary Commons
          </div>

          <h1
            style={{
              fontSize: "clamp(2.3rem, 6vw, 5.2rem)",
              lineHeight: 0.98,
              fontWeight: 650,
              margin: 0,
              marginBottom: 18,
              textShadow: "0 12px 34px rgba(6,16,40,0.34)",
            }}
          >
            A billion points of light
            <br />
            connected,
            <br />
            <span
              style={{
                color: "#FFD86B",
                textShadow: "0 0 20px rgba(255,216,107,0.10)",
              }}
            >
              we dawn brighter.
            </span>
          </h1>

     
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 760,
            margin: "0 auto",
            textAlign: "center",
            paddingBottom: "clamp(72px, 12vh, 120px)",
          }}
        >
        <p
            style={{
  fontSize: "clamp(1.05rem, 1.45vw, 1.22rem)",
  lineHeight: 1.45,
  color: "rgba(255,255,255,0.90)",
  maxWidth: 640,
  margin: "22px auto 0",
  textShadow: "0 6px 18px rgba(6,16,40,0.28)",
}}
          >
           Choose a place and see what is becoming visible.
<br />
What we give our attention to grows.
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
  marginTop: 12,
  fontSize: 15,
  lineHeight: 1.45,
  color: "rgba(255,255,255,0.82)",
  textShadow: "0 6px 18px rgba(6,16,40,0.34)",
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
    color: "rgba(255,255,255,0.65)",
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
        </div>
      </div>
    </main>
  );
}