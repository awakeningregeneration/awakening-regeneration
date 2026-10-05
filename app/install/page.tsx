"use client";

import { useState } from "react";
import { useInstallPrompt } from "@/app/components/useInstallPrompt";

const GOLD = "#FFD86B";
const BODY_COLOR = "#fff8e0";
const DIM_COLOR = "rgba(255,248,224,0.6)";

const glassCard: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.06)",
  padding: "28px 24px",
};

const orbs: { left: string; top: string; size: number; opacity: number }[] = [
  { left: "10%", top: "6%", size: 9, opacity: 0.78 },
  { left: "22%", top: "14%", size: 5, opacity: 0.68 },
  { left: "35%", top: "4%", size: 13, opacity: 0.58 },
  { left: "48%", top: "11%", size: 6, opacity: 0.75 },
  { left: "62%", top: "6%", size: 10, opacity: 0.72 },
  { left: "75%", top: "13%", size: 5, opacity: 0.62 },
  { left: "88%", top: "5%", size: 8, opacity: 0.72 },
  { left: "15%", top: "26%", size: 6, opacity: 0.62 },
  { left: "40%", top: "22%", size: 12, opacity: 0.52 },
  { left: "68%", top: "24%", size: 7, opacity: 0.65 },
  { left: "85%", top: "20%", size: 5, opacity: 0.58 },
  { left: "8%", top: "42%", size: 5, opacity: 0.55 },
  { left: "30%", top: "38%", size: 9, opacity: 0.5 },
  { left: "55%", top: "36%", size: 6, opacity: 0.6 },
  { left: "78%", top: "40%", size: 11, opacity: 0.5 },
  { left: "18%", top: "62%", size: 7, opacity: 0.55 },
  { left: "45%", top: "60%", size: 5, opacity: 0.5 },
  { left: "70%", top: "64%", size: 9, opacity: 0.55 },
  { left: "12%", top: "82%", size: 6, opacity: 0.55 },
  { left: "60%", top: "84%", size: 7, opacity: 0.5 },
  { left: "85%", top: "80%", size: 5, opacity: 0.5 },
];

function Atmosphere() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(55,115,190,0.4) 0%, rgba(13,30,52,1) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 15%, rgba(60,120,200,0.22) 0%, transparent 40%), radial-gradient(circle at 80% 12%, rgba(60,120,200,0.18) 0%, transparent 42%)",
        }}
      />
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `calc(${orb.left} - ${orb.size}px)`,
            top: `calc(${orb.top} - ${orb.size}px)`,
            width: orb.size * 3,
            height: orb.size * 3,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `radial-gradient(circle, rgba(255,222,150,${
              orb.opacity * 0.14
            }) 0%, transparent 70%)`,
          }}
        >
          <div
            style={{
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background: "rgba(255,240,195,0.8)",
              opacity: orb.opacity,
              boxShadow: `0 0 ${orb.size * 1.7}px ${
                orb.size * 0.4
              }px rgba(255,220,150,0.22), 0 0 ${orb.size * 4.2}px ${
                orb.size * 0.9
              }px rgba(255,200,110,0.08)`,
              filter: `blur(${orb.size * 0.15}px)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function switchButtonStyle(active: boolean): React.CSSProperties {
  return {
    background: "none",
    border: "none",
    padding: "4px 2px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: active ? 700 : 500,
    color: active ? GOLD : DIM_COLOR,
    textDecoration: active ? "underline" : "none",
    textUnderlineOffset: 3,
  };
}

function ShareIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ verticalAlign: "middle", marginLeft: 6, flexShrink: 0 }}
    >
      <path
        d="M12 2v12"
        stroke={GOLD}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 6l4-4 4 4"
        stroke={GOLD}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="4.5"
        y="10"
        width="15"
        height="11"
        rx="3"
        stroke={GOLD}
        strokeWidth="1.8"
      />
    </svg>
  );
}

function Step({
  number,
  children,
}: {
  number: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(255,216,107,0.14)",
          border: "1px solid rgba(255,216,107,0.35)",
          color: GOLD,
          fontSize: 14,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {number}
      </div>
      <div
        style={{
          color: BODY_COLOR,
          fontSize: 16,
          lineHeight: 1.55,
          paddingTop: 3,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function InstallPage() {
  const { isIOS, isAndroid, isSafari, isChromeFamily, canInstall, promptInstall } =
    useInstallPrompt();
  const [platformOverride, setPlatformOverride] = useState<
    "ios" | "android" | null
  >(null);

  const isMobileDevice = isIOS || isAndroid;
  const platform = platformOverride ?? (isAndroid ? "android" : "ios");

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#0d1e34",
        color: BODY_COLOR,
        overflow: "hidden",
      }}
    >
      <Atmosphere />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 480,
          margin: "0 auto",
          padding: "56px 24px 80px",
        }}
      >
        <img
          src="/canary-logo-new.png"
          alt="Canary Commons"
          style={{
            width: "clamp(130px, 22vw, 180px)",
            height: "auto",
            display: "block",
            margin: "0 auto 36px",
          }}
        />

        <p
          style={{
            fontSize: "1.2rem",
            textAlign: "center",
            color: GOLD,
            fontWeight: 600,
            lineHeight: 1.5,
            margin: "0 0 14px",
          }}
        >
          There’s no time like the present to follow the Canary out.
        </p>
        <p
          style={{
            fontSize: "1.05rem",
            textAlign: "center",
            lineHeight: 1.6,
            margin: "0 0 40px",
          }}
        >
          Add Canary to your phone for pocket-ready guidance to the good
          that’s already around you.
        </p>

        {isMobileDevice ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                marginBottom: 28,
              }}
            >
              <button
                type="button"
                onClick={() => setPlatformOverride("ios")}
                style={switchButtonStyle(platform === "ios")}
              >
                iPhone instructions
              </button>
              <span style={{ color: DIM_COLOR, fontSize: 14 }}>|</span>
              <button
                type="button"
                onClick={() => setPlatformOverride("android")}
                style={switchButtonStyle(platform === "android")}
              >
                Android instructions
              </button>
            </div>

            {platform === "ios" ? (
              <div style={glassCard}>
                <h1
                  style={{
                    color: GOLD,
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    margin: "0 0 18px",
                    textAlign: "center",
                  }}
                >
                  Add Canary to your iPhone or iPad
                </h1>

                {isIOS && !isSafari && (
                  <p
                    style={{
                      fontSize: 14,
                      textAlign: "center",
                      color: BODY_COLOR,
                      background: "rgba(255,216,107,0.08)",
                      border: "1px solid rgba(255,216,107,0.25)",
                      borderRadius: 12,
                      padding: "10px 14px",
                      margin: "0 0 22px",
                    }}
                  >
                    Using another browser? Open canarycommons.org in Safari
                    for the simplest iPhone installation.
                  </p>
                )}

                <Step number={1}>Open Canary in Safari.</Step>
                <Step number={2}>
                  Tap the Share button
                  <ShareIcon />
                </Step>
                <Step number={3}>
                  Choose “Add to Home Screen.”
                </Step>
                <Step number={4}>Tap “Add.”</Step>

                <p
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    color: DIM_COLOR,
                    marginTop: 20,
                  }}
                >
                  Canary will appear on your Home Screen, right alongside
                  your other apps.
                </p>
              </div>
            ) : (
              <div style={glassCard}>
                <h1
                  style={{
                    color: GOLD,
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    margin: "0 0 18px",
                    textAlign: "center",
                  }}
                >
                  Add Canary to your phone
                </h1>

                {canInstall ? (
                  <button
                    type="button"
                    onClick={promptInstall}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "center",
                      padding: "14px 20px",
                      borderRadius: 14,
                      border: "1px solid rgba(255,216,107,0.4)",
                      background: "rgba(255,216,107,0.14)",
                      color: GOLD,
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Install Canary
                  </button>
                ) : isChromeFamily ? (
                  <>
                    <Step number={1}>Open Canary in Chrome.</Step>
                    <Step number={2}>
                      Tap the menu icon (⋮) in the top right.
                    </Step>
                    <Step number={3}>
                      Choose “Install app” (or “Add to Home screen”).
                    </Step>
                    <Step number={4}>Tap “Install.”</Step>
                  </>
                ) : (
                  <p
                    style={{
                      fontSize: 15,
                      textAlign: "center",
                      lineHeight: 1.6,
                    }}
                  >
                    Open your browser’s menu and look for “Install app” or
                    “Add to Home screen.”
                  </p>
                )}

                <p
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    color: DIM_COLOR,
                    marginTop: 20,
                  }}
                >
                  Canary will appear on your Home Screen, right alongside
                  your other apps.
                </p>
              </div>
            )}
          </>
        ) : (
          <div style={glassCard}>
            <p
              style={{
                fontSize: 16,
                textAlign: "center",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Open <strong>canarycommons.org</strong> on your phone and tap
              “+ Add Canary App.”
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
