"use client";

import { useState } from "react";
import { useInstallPrompt } from "@/app/components/useInstallPrompt";

const GOLD = "#FFD86B";
const BODY_COLOR = "#fff8e0";
const DIM_COLOR = "rgba(255,248,224,0.6)";

const glassCard: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.09)",
  background: "rgba(255,255,255,0.05)",
  padding: "28px 24px",
};

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
        minHeight: "100vh",
        background: "#08192d",
        color: BODY_COLOR,
      }}
    >
      <div
        style={{
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
