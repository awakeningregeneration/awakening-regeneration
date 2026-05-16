"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  isFirstVisit: boolean;
};

export default function SupportIntroOverlay({
  isOpen,
  onDismiss,
  isFirstVisit,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [hidden, setHidden] = useState(!isOpen);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Track client mount to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    if (!isOpen) {
      // Fade out
      setOpacity(0);
      const timer = setTimeout(() => setHidden(true), 300);
      return () => clearTimeout(timer);
    }

    // Fade in
    setHidden(false);
    const delay = isFirstVisit ? 300 : 0;
    const timer = setTimeout(() => {
      setOpacity(1);
      closeRef.current?.focus();
    }, delay);
    return () => clearTimeout(timer);
  }, [isOpen, isFirstVisit, mounted]);

  // ESC key dismisses
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onDismiss]);

  // Before mount or when fully hidden, render nothing.
  // On server render, mounted=false so this always returns null,
  // matching the client's first paint before useEffect runs.
  if (!mounted || hidden) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onDismiss}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 900,
          background: "rgba(8,25,45,0.45)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          opacity,
          transition: "opacity 400ms ease",
        }}
      />

      {/* Bubble */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="About Online Resources"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 901,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          pointerEvents: "none",
          opacity,
          transition: "opacity 400ms ease",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 520,
            maxHeight: "85vh",
            overflowY: "auto",
            background: "rgba(8,25,45,0.95)",
            border: "1px solid rgba(255,216,107,0.15)",
            borderRadius: 18,
            padding: "clamp(28px, 5vw, 40px)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            textAlign: "center",
            pointerEvents: "auto",
          }}
        >
          {/* × dismiss */}
          <button
            ref={closeRef}
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            style={{
              position: "absolute",
              top: 12,
              right: 14,
              background: "none",
              border: "none",
              color: "rgba(255,216,107,0.5)",
              fontSize: "1.2rem",
              cursor: "pointer",
              padding: "4px 8px",
              lineHeight: 1,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,216,107,1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,216,107,0.5)";
            }}
          >
            ×
          </button>

          {/* Gold breathing light */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <div
              className="support-intro-light"
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#FFD86B",
                boxShadow:
                  "0 0 10px 3px rgba(255,216,107,0.4), 0 0 28px 8px rgba(255,200,80,0.15), 0 0 48px 14px rgba(255,180,60,0.06)",
                filter: "blur(0.5px)",
              }}
            />
          </div>

          {/* Copy */}
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.78)",
              margin: "0 0 16px",
            }}
          >
            Canary Commons is free, and non-competitive with the local
            businesses on the map. Its life support comes from this curated
            set of online businesses whose values align with ours — when you
            make a purchase through one of these links, a small portion comes
            back to sustain the commons.
          </p>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.78)",
              margin: 0,
            }}
          >
            <span style={{ color: "#FFD86B", fontSize: "1.1em" }}>✦ ✦</span>
            {" "}If you use an ad blocker, you may see a notice when you click
            through the resource link. By clicking proceed, you support Canary
            Commons. Thank you.
          </p>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "rgba(211,227,247,0.65)",
              fontStyle: "italic",
              textAlign: "center",
              margin: "20px 0 0",
            }}
          >
            Small things added together make real differences.
          </p>
        </div>
      </div>

      {/* Breath animation */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .support-intro-light {
            animation: support-intro-breath 4s ease-in-out infinite;
          }
        }
        @keyframes support-intro-breath {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </>
  );
}
