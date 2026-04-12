"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const orbs: {
  left: string;
  top: string;
  size: number;
  opacity: number;
}[] = [
  // Band 1
  { left: "6%", top: "4%", size: 6, opacity: 0.7 },
  { left: "18%", top: "10%", size: 10, opacity: 0.68 },
  { left: "29%", top: "3%", size: 4, opacity: 0.6 },
  { left: "40%", top: "12%", size: 14, opacity: 0.45 },
  { left: "52%", top: "6%", size: 7, opacity: 0.7 },
  { left: "63%", top: "11%", size: 11, opacity: 0.62 },
  { left: "76%", top: "4%", size: 5, opacity: 0.65 },
  { left: "88%", top: "9%", size: 16, opacity: 0.45 },

  // Band 2
  { left: "4%", top: "22%", size: 9, opacity: 0.68 },
  { left: "15%", top: "28%", size: 5, opacity: 0.65 },
  { left: "26%", top: "20%", size: 12, opacity: 0.55 },
  { left: "37%", top: "30%", size: 7, opacity: 0.68 },
  { left: "49%", top: "24%", size: 18, opacity: 0.45 },
  { left: "61%", top: "32%", size: 4, opacity: 0.55 },
  { left: "73%", top: "26%", size: 10, opacity: 0.65 },
  { left: "87%", top: "30%", size: 6, opacity: 0.68 },

  // Band 3
  { left: "7%", top: "42%", size: 11, opacity: 0.6 },
  { left: "19%", top: "48%", size: 5, opacity: 0.62 },
  { left: "31%", top: "44%", size: 15, opacity: 0.45 },
  { left: "43%", top: "50%", size: 7, opacity: 0.68 },
  { left: "54%", top: "46%", size: 9, opacity: 0.65 },
  { left: "66%", top: "52%", size: 4, opacity: 0.55 },
  { left: "78%", top: "45%", size: 12, opacity: 0.55 },
  { left: "90%", top: "51%", size: 6, opacity: 0.68 },

  // Band 4
  { left: "5%", top: "62%", size: 14, opacity: 0.45 },
  { left: "16%", top: "70%", size: 5, opacity: 0.65 },
  { left: "27%", top: "64%", size: 8, opacity: 0.7 },
  { left: "38%", top: "72%", size: 16, opacity: 0.45 },
  { left: "50%", top: "66%", size: 6, opacity: 0.68 },
  { left: "62%", top: "74%", size: 11, opacity: 0.62 },
  { left: "74%", top: "68%", size: 4, opacity: 0.55 },
  { left: "86%", top: "74%", size: 13, opacity: 0.45 },

  // Band 5
  { left: "6%", top: "82%", size: 7, opacity: 0.7 },
  { left: "17%", top: "90%", size: 10, opacity: 0.68 },
  { left: "29%", top: "84%", size: 4, opacity: 0.6 },
  { left: "41%", top: "92%", size: 13, opacity: 0.45 },
  { left: "53%", top: "86%", size: 5, opacity: 0.65 },
  { left: "65%", top: "93%", size: 9, opacity: 0.7 },
  { left: "78%", top: "85%", size: 15, opacity: 0.45 },
  { left: "90%", top: "91%", size: 6, opacity: 0.68 },
];

function LightField() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: "rgba(255,240,190,0.72)",
            opacity: orb.opacity,
            boxShadow: `0 0 ${orb.size * 2}px ${
              orb.size * 0.6
            }px rgba(255,220,140,0.22), 0 0 ${orb.size * 5}px ${
              orb.size * 1.2
            }px rgba(255,200,100,0.08)`,
          }}
        />
      ))}
    </div>
  );
}

function FoundersContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "";
  const joinHref = ref
    ? `/founders/join?ref=${encodeURIComponent(ref)}`
    : "/founders/join";

  const cardStyle: React.CSSProperties = {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.09)",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(8px)",
    padding: "24px 26px",
  };

  const cardHeadingStyle: React.CSSProperties = {
    fontSize: "1.08rem",
    fontWeight: 650,
    color: "rgba(255,255,255,0.96)",
    margin: "0 0 14px",
  };

  const cardBodyStyle: React.CSSProperties = {
    fontSize: "0.97rem",
    lineHeight: 1.7,
    color: "rgba(211,227,247,0.80)",
    margin: 0,
  };

  const bulletListStyle: React.CSSProperties = {
    ...cardBodyStyle,
    paddingLeft: 18,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#08192d",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmosphere layer 1 — top glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(26,72,130,0.32) 0%, rgba(5,16,31,1) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Atmosphere layer 2 — two faint side glows */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 40%, rgba(40,90,160,0.18) 0%, transparent 40%), radial-gradient(circle at 78% 55%, rgba(40,90,160,0.14) 0%, transparent 42%)",
          pointerEvents: "none",
        }}
      />

      {/* Atmosphere layer 3 — soft center bloom */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(60,110,200,0.11) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <LightField />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(48px, 8vw, 80px) 24px 72px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <p
            style={{
              fontSize: "0.82rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(159,184,216,0.7)",
              margin: 0,
              marginBottom: 14,
            }}
          >
            Canary Commons
          </p>
          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              lineHeight: 1.08,
              fontWeight: 650,
              margin: 0,
              marginBottom: 20,
              color: "rgba(255,255,255,0.98)",
            }}
          >
            Become a Founder
          </h1>
          <p
            style={{
              fontSize: "1.08rem",
              lineHeight: 1.72,
              color: "rgba(211,227,247,0.88)",
              margin: 0,
              maxWidth: 580,
            }}
          >
            Founders help turn on the first lights. They help seed visibility,
            participation, and early momentum so people can find what is
            already making life better where they live.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <section style={cardStyle}>
            <h2 style={cardHeadingStyle}>What this is</h2>
            <p style={cardBodyStyle}>
              Founders are early supporters of Canary Commons who help
              strengthen the map, direct attention toward life-giving efforts,
              and support the emergence of a visible regenerative commons.
            </p>
          </section>

          <section style={cardStyle}>
            <h2 style={cardHeadingStyle}>What founders do</h2>
            <ul style={bulletListStyle}>
              <li>Seed businesses, projects, and places onto the map</li>
              <li>Redirect attention toward life-supporting options</li>
              <li>Help establish early momentum and trust</li>
            </ul>
          </section>

          <section style={cardStyle}>
            <h2 style={cardHeadingStyle}>What founders receive</h2>
            <ul style={bulletListStyle}>
              <li>Early participation in shaping the platform</li>
              <li>Direct connection to the emerging network</li>
              <li>Founding-role recognition as the commons takes root</li>
            </ul>
          </section>

          <section style={cardStyle}>
            <h2 style={cardHeadingStyle}>Contribution</h2>
            <p style={cardBodyStyle}>
              Founders make a small monthly contribution of $9/month. This
              supports the early building phase and helps establish the
              foundation of a visible, life-supporting commons.
            </p>
          </section>

          <section style={cardStyle}>
            <h2 style={cardHeadingStyle}>Seed referral pathway</h2>
            <p style={cardBodyStyle}>
              If someone invited you into this, you can include their referral
              code or name when you join so their contribution is recognized.
            </p>
          </section>
        </div>

        {/* CTA block */}
        <div
          style={{
            borderRadius: 24,
            border: "1px solid rgba(255,216,107,0.18)",
            background: "rgba(20,50,100,0.38)",
            backdropFilter: "blur(10px)",
            padding:
              "clamp(28px, 4vw, 44px) clamp(24px, 4vw, 40px)",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
              fontWeight: 650,
              margin: 0,
              marginBottom: 14,
              color: "rgba(255,255,255,0.98)",
              lineHeight: 1.2,
            }}
          >
            Help turn on the first lights
          </h2>

          <p
            style={{
              fontSize: "1.02rem",
              lineHeight: 1.72,
              color: "rgba(211,227,247,0.82)",
              margin: 0,
              marginBottom: 12,
              maxWidth: 600,
            }}
          >
            Join as an early founder and help strengthen a public-facing map of
            regenerative, life-forward participation.
          </p>

          <p
            style={{
              fontSize: "0.98rem",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.65)",
              margin: 0,
              marginBottom: 26,
              maxWidth: 600,
            }}
          >
            This is a simple, meaningful commitment to help bring this into the
            world.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Link
              href={joinHref}
              style={{
                display: "inline-block",
                padding: "14px 26px",
                borderRadius: 999,
                background: "#FFD86B",
                color: "#1a2a0e",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                boxShadow: "0 0 28px rgba(255,216,107,0.22)",
              }}
            >
              Become a Founder
            </Link>

            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "14px 26px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.22)",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 600,
                fontSize: "1rem",
                textDecoration: "none",
                background: "transparent",
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function FoundersPage() {
  return (
    <Suspense>
      <FoundersContent />
    </Suspense>
  );
}
