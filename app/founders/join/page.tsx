"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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

function Atmosphere() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(26,72,130,0.32) 0%, rgba(5,16,31,1) 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(circle at 18% 14%, rgba(40,90,160,0.18) 0%, transparent 38%), radial-gradient(circle at 82% 12%, rgba(40,90,160,0.14) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
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
    </>
  );
}

function JoinContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "";
  const [selectedTier, setSelectedTier] = useState("$9");
  const [oneTime, setOneTime] = useState("");

  useEffect(() => {
    if (ref) {
      localStorage.setItem("referral_code", ref);
    }
  }, [ref]);

  const tiers = [
    { value: "$9", label: "$9/month", title: "Foundation Builder" },
    { value: "$18", label: "$18/month", title: "Supporting Foundation Builder" },
    { value: "$27", label: "$27/month", title: "Sustaining Foundation Builder" },
  ];

  const glassCard: React.CSSProperties = {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.09)",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(8px)",
    padding: "26px 28px",
    marginBottom: 16,
  };

  const sectionHeading: React.CSSProperties = {
    fontSize: "1.12rem",
    fontWeight: 650,
    color: "rgba(255,255,255,0.95)",
    margin: 0,
    marginBottom: 18,
  };

  const softBody: React.CSSProperties = {
    fontSize: "1.02rem",
    lineHeight: 1.78,
    color: "rgba(211,227,247,0.78)",
    margin: 0,
    marginBottom: 16,
  };

  const emphasisBody: React.CSSProperties = {
    fontSize: "1.04rem",
    lineHeight: 1.78,
    color: "rgba(255,255,255,0.95)",
    fontWeight: 600,
    margin: 0,
    marginBottom: 16,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#08192d",
        color: "white",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(44px, 7vw, 72px) 20px 72px",
      }}
    >
      <Atmosphere />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontSize: "0.82rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(159,184,216,0.65)",
            margin: 0,
            marginBottom: 14,
          }}
        >
          Canary Commons
        </p>

        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            lineHeight: 1.14,
            fontWeight: 650,
            margin: 0,
            marginBottom: 28,
            color: "rgba(255,255,255,0.98)",
          }}
        >
          You&apos;re stepping into something that is already alive.
        </h1>

        <div style={{ maxWidth: 600, marginBottom: 44 }}>
          <p style={softBody}>
            Canary Commons exists to make what is life-giving visible — without
            hierarchy, without tolls, without anyone paying for placement.
            Every listing on this map is equal. That is not an accident. It is
            the design.
          </p>
          <p style={softBody}>
            Right now, the map is being populated organically — by the people
            of place, adding what they know and love where they live. That
            process takes time. It takes trust. It takes roots.
          </p>
          <p style={emphasisBody}>
            Foundation Builders are the bridge while that happens.
          </p>
          <p style={softBody}>
            Your contribution supports the infrastructure that holds this —
            the technology, the people tending it, and the debt carried to
            bring it into being. It sustains the platform while the grassroots
            field fills in.
          </p>
          <p style={softBody}>
            What you are helping build will never charge for visibility. No
            business will pay more to appear first. No community will be priced
            out of the map. That is the promise this platform is built on.
          </p>
          <p style={{ ...emphasisBody, marginBottom: 0 }}>
            You are helping make sure it keeps its word.
          </p>
        </div>

        {/* What this looks like */}
        <div style={glassCard}>
          <h2 style={sectionHeading}>What this looks like</h2>
          <p style={softBody}>
            Once you join, you&apos;ll receive a short email twice a month —
            not a newsletter, more like a letter from the field. It carries a
            few signals: something rising in the constellation, something worth
            supporting, something to notice where you live.
          </p>
          <p style={softBody}>
            Your one ongoing invitation: add three lights. Place three
            meaningful things on the map that you know — or invite the people
            tending those places to add themselves.
          </p>
          <p style={{ ...softBody, marginBottom: 0 }}>
            That&apos;s it. No meetings. No obligations beyond that. Just
            participation at the pace of your life.
          </p>
        </div>

        {/* Monthly contribution */}
        <div style={glassCard}>
          <h2 style={sectionHeading}>Monthly contribution</h2>

          <div style={{ display: "grid", gap: 12 }}>
            {tiers.map((tier) => {
              const isSelected = selectedTier === tier.value;
              return (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => setSelectedTier(tier.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "18px 20px",
                    borderRadius: 14,
                    border: isSelected
                      ? "1.5px solid rgba(255,216,107,0.55)"
                      : "1px solid rgba(255,255,255,0.10)",
                    background: isSelected
                      ? "rgba(255,216,107,0.08)"
                      : "rgba(255,255,255,0.03)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    color: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: isSelected
                        ? "5px solid #FFD86B"
                        : "2px solid rgba(255,255,255,0.25)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "1.02rem",
                        color: isSelected
                          ? "#FFE8A0"
                          : "rgba(255,255,255,0.92)",
                      }}
                    >
                      {tier.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "rgba(211,227,247,0.65)",
                        marginTop: 2,
                      }}
                    >
                      {tier.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* One-time contribution */}
        <div style={{ ...glassCard, marginBottom: 32 }}>
          <label
            style={{
              display: "block",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.88)",
              marginBottom: 10,
            }}
          >
            Additional one-time contribution to the foundation
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="$ (optional)"
            value={oneTime}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9.]/g, "");
              setOneTime(v);
            }}
            style={{
              width: "100%",
              padding: "13px 16px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              fontSize: "0.98rem",
              outline: "none",
            }}
          />
        </div>

        {/* CTA */}
        <Link
          href="/founders/confirmation"
          style={{
            display: "block",
            textAlign: "center",
            width: "100%",
            padding: "16px 24px",
            borderRadius: 999,
            background: "#FFD86B",
            color: "#1a2a0e",
            fontWeight: 700,
            fontSize: "1.05rem",
            textDecoration: "none",
            boxShadow: "0 0 32px rgba(255,216,107,0.20)",
          }}
        >
          Join the Foundation
        </Link>

        {/* Footer note */}
        <p
          style={{
            marginTop: 36,
            fontSize: "0.82rem",
            lineHeight: 1.68,
            color: "rgba(159,184,216,0.52)",
            textAlign: "center",
            maxWidth: 540,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          This is not a nonprofit. Resources flow through this system to
          support the people tending it, the technology that holds it, and
          life-forward initiatives as it grows.
        </p>
      </div>
    </main>
  );
}

export default function FounderJoinPage() {
  return (
    <Suspense>
      <JoinContent />
    </Suspense>
  );
}
