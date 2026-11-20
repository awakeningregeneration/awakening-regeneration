"use client";

import { useState } from "react";

const GOLD = "#FFD86B";

/**
 * Permanent share control for the map — so sharing stays available after
 * the "Follow the Canary" overlay (which used to be the only place this
 * lived) is dismissed. Shares the clean campaign-entry URL so whoever
 * receives the link gets the same invitation, not whatever region/marker
 * state the sharer happened to be looking at.
 *
 * Fixed-position (viewport-relative, like the global compass nav it sits
 * under) so it works identically in the mobile and desktop layouts
 * without depending on either one's own positioning context. Stacked
 * directly beneath the compass (top:14 right:14, 62x62, z-index 9999) —
 * same right edge, 8px below its bottom — rather than touching that
 * shared, site-wide control.
 */
export default function ShareMapButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/map?follow=1`
        : "";
    const shareData = {
      title: "Follow the Canary",
      text: "People are already building a world where canaries thrive. Come see what's lighting up the map.",
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled the native share sheet — not an error.
      }
      return;
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div style={{ position: "fixed", top: 84, right: 14, zIndex: 50 }}>
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share the map"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.35)",
          background: "rgba(255,255,255,0.14)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="6" cy="12" r="2.6" stroke={GOLD} strokeWidth="1.8" />
          <circle cx="18" cy="5.5" r="2.6" stroke={GOLD} strokeWidth="1.8" />
          <circle cx="18" cy="18.5" r="2.6" stroke={GOLD} strokeWidth="1.8" />
          <line
            x1="8.3"
            y1="10.8"
            x2="15.7"
            y2="6.7"
            stroke={GOLD}
            strokeWidth="1.8"
          />
          <line
            x1="8.3"
            y1="13.2"
            x2="15.7"
            y2="17.3"
            stroke={GOLD}
            strokeWidth="1.8"
          />
        </svg>
      </button>

      {copied && (
        <div
          style={{
            position: "absolute",
            top: 46,
            right: 0,
            padding: "5px 10px",
            borderRadius: 8,
            background: "rgba(10,25,45,0.92)",
            border: "1px solid rgba(255,216,107,0.3)",
            color: GOLD,
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          Link copied
        </div>
      )}
    </div>
  );
}
