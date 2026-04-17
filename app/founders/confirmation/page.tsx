"use client";

import { useEffect, useRef } from "react";
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

function Atmosphere() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(180,210,255,0.9) 0%, rgba(120,170,230,0.85) 25%, rgba(70,120,200,0.9) 60%, rgba(30,70,150,1) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.18) 0%, transparent 58%)",
          pointerEvents: "none",
        }}
      />
      {orbs.map((orb, i) => (
        <div
          key={i}
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
    </>
  );
}

export default function FounderConfirmationPage() {
  const referralCode = useRef<string | null>(null);

  useEffect(() => {
    referralCode.current = localStorage.getItem("referral_code");
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#0d2a4a",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(44px, 7vw, 72px) 20px",
      }}
    >
      <Atmosphere />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 600,
          width: "100%",
        }}
      >
        <p
          style={{
            fontSize: "0.82rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            margin: 0,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Canary Commons
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(255,255,255,0.6)",
            backdropFilter: "blur(12px)",
            borderRadius: 22,
            padding: "clamp(32px, 5vw, 48px) clamp(24px, 4vw, 40px)",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
              lineHeight: 1.15,
              margin: 0,
              marginBottom: 18,
              fontWeight: 650,
              color: "#0d2a4a",
            }}
          >
            You&apos;re in. This is already happening.
          </h1>

          <p
            style={{
              fontSize: "1.08rem",
              lineHeight: 1.72,
              color: "#3a5a7a",
              margin: 0,
              marginBottom: 16,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            This map is being built from the ground — not by one person
            collecting, but by people noticing and adding what&apos;s alive
            around them.
          </p>

          <p
            style={{
              fontSize: "1.08rem",
              lineHeight: 1.72,
              color: "#3a5a7a",
              margin: 0,
              marginBottom: 36,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Head to the map and look around. If a place, a person, or something
            that matters where you are comes to mind, you&apos;ll see the option
            to add it.
          </p>

          <Link
            href="/map"
            style={{
              display: "inline-block",
              padding: "16px 28px",
              borderRadius: 999,
              background: "#FFD86B",
              color: "#1a2a0e",
              fontWeight: 700,
              fontSize: "1.05rem",
              textDecoration: "none",
              boxShadow:
                "0 0 28px rgba(255,216,107,0.35), 0 4px 14px rgba(255,200,80,0.22)",
            }}
          >
            Go to the map
          </Link>

          <p
            style={{
              fontSize: "0.88rem",
              lineHeight: 1.65,
              color: "#6b8aaa",
              margin: 0,
              marginTop: 24,
              maxWidth: 420,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            You&apos;ll also receive a first email soon, gently walking you into
            placing your first three lights. No rush — take the rhythm that
            fits.
          </p>
        </div>
      </div>
    </main>
  );
}
