"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
              left: `calc(${orb.left} - ${orb.size}px)`,
              top: `calc(${orb.top} - ${orb.size}px)`,
              width: orb.size * 3,
              height: orb.size * 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,220,140,${
                orb.opacity * 0.12
              }) 0%, transparent 70%)`,
            }}
          >
            <div
              style={{
                width: orb.size,
                height: orb.size,
                borderRadius: "50%",
                background: "rgba(255,240,190,0.72)",
                opacity: orb.opacity,
                boxShadow: `0 0 ${orb.size * 1.7}px ${
                  orb.size * 0.4
                }px rgba(255,220,140,0.18), 0 0 ${orb.size * 4.2}px ${
                  orb.size * 0.9
                }px rgba(255,200,100,0.06)`,
                filter: `blur(${orb.size * 0.15}px)`,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

function JoinContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "";
  const [selectedTier, setSelectedTier] = useState<string | null>("$18");
  const [oneTimeGift, setOneTimeGift] = useState("");
  const [wantsMail, setWantsMail] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (ref) {
      localStorage.setItem("referral_code", ref);
    }
  }, [ref]);

  const tiers = [
    { value: "$18", tier: "tier_1", label: "$18/month" },
    { value: "$28", tier: "tier_2", label: "$28/month" },
    { value: "$42", tier: "tier_3", label: "$42/month" },
  ];

  const glassCard: React.CSSProperties = {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.09)",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(8px)",
    padding: "26px 28px",
    marginBottom: 16,
  };

  const softBody: React.CSSProperties = {
    fontSize: "1.02rem",
    lineHeight: 1.78,
    color: "rgba(224,238,255,0.92)",
    margin: 0,
    marginBottom: 16,
  };

  // ── Derived state for the unified button ──
  const oneTimeAmount = oneTimeGift ? parseFloat(oneTimeGift) : 0;
  const oneTimeValid = oneTimeAmount >= 5;
  const hasTier = selectedTier !== null;
  const hasOneTime = oneTimeGift.length > 0 && oneTimeValid;
  const nothingSelected = !hasTier && !hasOneTime;
  const oneTimeTooLow = oneTimeGift.length > 0 && !oneTimeValid;

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
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            lineHeight: 1.18,
            fontWeight: 650,
            margin: 0,
            marginBottom: 28,
            color: "#FFD86B",
            textAlign: "center",
            textShadow:
              "0 0 32px rgba(255,216,107,0.3), 0 0 64px rgba(255,200,80,0.12)",
          }}
        >
          Steward the Commons
        </h1>

        {/* ── THE THRESHOLD ── */}
        <div style={glassCard}>
          <p style={softBody}>
            Help make an existing, life-giving world visible enough for others
            to find, choose, and strengthen.
          </p>
          <p style={softBody}>
            Become a Founding Steward during the season in which the living
            commons is being revealed.
          </p>
          <p style={softBody}>
            Many have forgotten how much power is already contained in a single
            act of attention directed toward life.
          </p>
          <p style={softBody}>
            What we repeatedly attend becomes visible. What becomes visible
            becomes easier to choose. What we choose grows, and together those
            choices shape the world we inhabit.
          </p>
          <p style={softBody}>
            Canary Commons exists to gently reorient our attention toward the
            people, places, organizations, businesses, stories, and everyday
            endeavors already living in ways that are regenerative, sustainable,
            and life-affirming.
          </p>
          <p style={softBody}>The platform has been built.</p>
          <p style={softBody}>
            What comes next is revealing the living landscape itself.
          </p>
          <p style={softBody}>
            As a Founding Steward, your membership provides the bridge that
            allows Canary Commons to discover, verify, and make visible
            thousands of remarkable people, places, and projects already helping
            life flourish.
          </p>
          <p style={softBody}>
            Every light added to the map becomes easier to find.
          </p>
          <p style={softBody}>Easier to choose.</p>
          <p style={softBody}>Easier to support.</p>

          <h2
            style={{
              fontSize: "1.18rem",
              fontWeight: 650,
              color: "#FFD86B",
              margin: "24px 0 14px",
              textAlign: "center",
            }}
          >
            As a Founding Steward you will receive
          </h2>
          <ul
            style={{
              paddingLeft: 24,
              margin: "0 0 16px",
              lineHeight: 1.78,
              color: "rgba(224,238,255,0.92)",
              fontSize: "1.02rem",
            }}
          >
            <li style={{ marginBottom: 10 }}>
              Four thoughtfully crafted printed letters from the field each
              year, sharing the people, places, and projects quietly shaping
              another way of living.
            </li>
            <li style={{ marginBottom: 10 }}>
              A monthly email highlighting new discoveries, meaningful places to
              direct your attention, and updates as the commons continues to
              grow.
            </li>
            <li style={{ marginBottom: 10 }}>
              A front-row seat as the living commons unfolds and becomes an
              increasingly valuable public resource.
            </li>
            <li>
              The opportunity to help establish a trusted map that remains free
              for everyone to use and free for life-supporting endeavors to
              join.
            </li>
          </ul>

          <h2
            style={{
              fontSize: "1.18rem",
              fontWeight: 650,
              color: "#FFD86B",
              margin: "24px 0 14px",
              textAlign: "center",
            }}
          >
            Your Stewardship
          </h2>
          <p style={softBody}>
            Founding Stewardship exists for a season.
          </p>
          <p style={softBody}>
            Its purpose is to help transform a working platform into a living
            commons.
          </p>
          <p style={softBody}>
            As the map matures into a trusted nationwide resource, Canary
            gradually becomes sustained through carefully selected
            mission-aligned online partnerships, allowing the commons to remain
            open, independent, and free for everyone.
          </p>
          <p style={softBody}>Your membership is the bridge.</p>
          <p style={softBody}>
            Its destination is a commons that can sustainably stand on its own.
          </p>
          <p style={softBody}>
            Together we are not creating the commons.
          </p>
          <p style={softBody}>
            We are helping reveal the commons that already exists.
          </p>
          <p style={{ ...softBody, marginBottom: 0 }}>
            Together we strengthen what we wish to see grow.
          </p>
        </div>

        {/* ── TENDING THE COMMONS — unified contribution area ── */}
        <div style={glassCard}>
          {/* The three monthly tiers */}
          <div style={{ display: "grid", gap: 12 }}>
            {tiers.map((tier) => {
              const isSelected = selectedTier === tier.value;
              return (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() =>
                    setSelectedTier(isSelected ? null : tier.value)
                  }
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
                </button>
              );
            })}
          </div>

          {/* Step-down line */}
          <p
            style={{
              fontSize: "0.88rem",
              lineHeight: 1.6,
              color: "rgba(190,210,235,0.82)",
              textAlign: "center",
              margin: "16px 0 0",
            }}
          >
            After twelve months, every subscription settles to a $12 base.
          </p>

          {/* Soft divider */}
          <div
            style={{
              margin: "24px 0",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 20,
            }}
          >
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.6,
                color: "rgba(190,210,235,0.78)",
                textAlign: "center",
                margin: 0,
              }}
            >
              If you&apos;d like to give more on top of your
              subscription — or make a one-time gift without subscribing.
            </p>
          </div>

          {/* One-time amount input */}
          <input
            type="text"
            inputMode="numeric"
            placeholder="$ one-time (minimum $5)"
            value={oneTimeGift}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9.]/g, "");
              setOneTimeGift(v);
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
              marginBottom: 10,
            }}
          />
          {oneTimeTooLow && (
            <p
              style={{
                fontSize: "0.84rem",
                color: "rgba(255,160,140,0.8)",
                margin: "0 0 6px",
              }}
            >
              Minimum one-time gift is $5.
            </p>
          )}
          <p
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.65,
              color: "rgba(224,238,255,0.85)",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            A one-time gift receives a first edition of Notes from the
            Field — a warm thank you for standing with the work.
          </p>

          {/* Physical mail opt-in */}
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              marginTop: 18,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={wantsMail}
              onChange={(e) => setWantsMail(e.target.checked)}
              style={{
                width: 18,
                height: 18,
                marginTop: 2,
                accentColor: "#FFD86B",
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "rgba(224,238,255,0.92)",
                }}
              >
                Send me physical mail
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(190,210,235,0.65)",
                  marginTop: 2,
                }}
              >
                Physical mail ships within the US only.
              </div>
            </div>
          </label>
        </div>

        {/* ── PRIMARY CTA — routes on combined state ── */}
        <button
          type="button"
          disabled={isRedirecting || nothingSelected || oneTimeTooLow}
          onClick={async () => {
            setErrorMessage("");
            setIsRedirecting(true);

            try {
              const tierObj = hasTier
                ? tiers.find((t) => t.value === selectedTier)
                : null;

              const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  tier: tierObj?.tier ?? undefined,
                  oneTimeAmount: hasOneTime ? oneTimeAmount : undefined,
                  referralCode: ref || undefined,
                  wantsMail,
                }),
              });

              const data = await res.json();

              if (!res.ok || !data.url) {
                throw new Error(
                  data.error || "Failed to start checkout."
                );
              }

              window.location.href = data.url;
            } catch (err) {
              setIsRedirecting(false);
              setErrorMessage(
                err instanceof Error
                  ? err.message
                  : "Something went wrong. Please try again or email founder@canarycommons.org"
              );
            }
          }}
          style={{
            display: "block",
            textAlign: "center",
            width: "100%",
            padding: "16px 24px",
            borderRadius: 999,
            background: (nothingSelected || oneTimeTooLow)
              ? "rgba(255,216,107,0.25)"
              : "#FFD86B",
            color: (nothingSelected || oneTimeTooLow)
              ? "rgba(26,42,14,0.5)"
              : "#1a2a0e",
            fontWeight: 700,
            fontSize: "1.05rem",
            border: "none",
            cursor: (isRedirecting || nothingSelected || oneTimeTooLow)
              ? "not-allowed"
              : "pointer",
            boxShadow: (nothingSelected || oneTimeTooLow)
              ? "none"
              : "0 0 32px rgba(255,216,107,0.20)",
            opacity: isRedirecting ? 0.8 : 1,
            transition: "opacity 0.15s ease, background 0.15s ease",
            marginBottom: 16,
          }}
        >
          {isRedirecting
            ? "Redirecting to secure checkout..."
            : "Steward the Commons"}
        </button>

        {errorMessage && (
          <p
            style={{
              marginTop: 0,
              marginBottom: 16,
              fontSize: "0.88rem",
              lineHeight: 1.55,
              color: "rgba(255,160,140,0.9)",
              textAlign: "center",
            }}
          >
            {errorMessage}
          </p>
        )}

        {/* ── FOOTER ── */}
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

        <p
          style={{
            marginTop: 20,
            fontSize: "0.82rem",
            textAlign: "center",
            color: "rgba(159,184,216,0.52)",
          }}
        >
          <a
            href="/letter"
            style={{
              color: "rgba(159,184,216,0.52)",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
          >
            Read a letter from the founder
          </a>
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
