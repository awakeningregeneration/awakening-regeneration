"use client";

import { useEffect, useState } from "react";

type Props = {
  mode: "homepage-timed" | "about-permanent";
  isDropdownOpen: boolean;
};

export default function CompassCaption({ mode, isDropdownOpen }: Props) {
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [cookieChecked, setCookieChecked] = useState(false);

  useEffect(() => {
    if (mode === "about-permanent") {
      setVisible(true);
      setCookieChecked(true);
      // Small delay for entrance
      requestAnimationFrame(() => setOpacity(1));
      return;
    }

    // Homepage timed mode: check cookie
    const seen = document.cookie.includes("cc_compass_seen=1");
    setCookieChecked(true);
    if (seen) return;

    // 1.5s delay, then show
    const showTimer = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setOpacity(1));
    }, 1500);

    // After 1.5s + 15s visible = 16.5s, begin fade
    const fadeTimer = setTimeout(() => {
      setOpacity(0);
    }, 16500);

    // After fade completes (1s), set cookie and hide
    const hideTimer = setTimeout(() => {
      setVisible(false);
      const secure =
        typeof window !== "undefined" &&
        window.location.protocol === "https:"
          ? "; Secure"
          : "";
      document.cookie = `cc_compass_seen=1; path=/; max-age=7776000; SameSite=Lax${secure}`;
    }, 17500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [mode]);

  if (!cookieChecked || !visible) return null;

  // Dropdown hides the bubble on About page
  const dropdownFade =
    mode === "about-permanent" && isDropdownOpen ? 0 : opacity;

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        right: 0,
        pointerEvents: "none",
        zIndex: 9998,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "auto",
          maxWidth: "calc(100vw - 32px)",
          padding: "8px 14px",
          background: "rgba(8,25,45,0.92)",
          border: "1px solid rgba(255,216,107,0.65)",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          opacity: dropdownFade,
          transition: "opacity 0.25s ease",
        }}
      >
        {/* Upward notch — border layer, offset right to point at compass center */}
        <div
          style={{
            position: "absolute",
            top: -7,
            right: 24,
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderBottom: "7px solid rgba(255,216,107,0.65)",
          }}
        />
        {/* Upward notch — fill layer */}
        <div
          style={{
            position: "absolute",
            top: -5,
            right: 25,
            width: 0,
            height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderBottom: "6px solid rgba(8,25,45,0.92)",
          }}
        />

        <p
          style={{
            fontSize: "0.88rem",
            fontWeight: 600,
            color: "#FFD86B",
            lineHeight: 1.3,
            textAlign: "center",
            margin: 0,
          }}
        >
          Site Compass
        </p>
        <p
          style={{
            fontSize: "0.8rem",
            color: "rgba(255,216,107,0.7)",
            lineHeight: 1.4,
            textAlign: "center",
            margin: "3px 0 0",
          }}
        >
          navigate, or wander.
        </p>
      </div>
    </div>
  );
}
