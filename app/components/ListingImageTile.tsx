"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  elementalTones,
  type ElementName,
} from "../lib/elementalTones";

type Size = "sm" | "md" | "lg";

type Props = {
  imageUrl: string | null;
  name: string;
  size: Size;
  element?: ElementName;
};

const SIZE_SPEC: Record<
  Size,
  {
    width: number | string;
    height: number;
    borderRadius: number;
    fontSize: number;
  }
> = {
  sm: { width: 40, height: 40, borderRadius: 6, fontSize: 13 },
  md: { width: 64, height: 64, borderRadius: 8, fontSize: 18 },
  lg: { width: "100%", height: 128, borderRadius: 8, fontSize: 28 },
};

function getInitials(name: string): string {
  const trimmed = (name || "").trim();
  if (!trimmed) return "?";
  return trimmed.slice(0, 2).toUpperCase();
}

const EXPLAINER_TEXT =
  "Every tradition that has ever looked closely at life has found some version of these: Earth, Water, Fire, Air, and the relationship that holds them. Canary Commons doesn\u2019t teach them \u2014 it just lets them sit quietly beside what\u2019s growing. A small reminder of what was never actually lost, only covered over.";

export default function ListingImageTile({
  imageUrl,
  name,
  size,
  element = "spirit",
}: Props) {
  const [errored, setErrored] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const spec = SIZE_SPEC[size];
  const tone = elementalTones[element];
  const showFallback = !imageUrl || errored;

  // Only show the explainer indicator on md + lg tiles
  // (sm tiles at 40×40 are too small for a tooltip trigger)
  const showIndicator = size === "md" || size === "lg";

  // Track client mount for portal safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on outside click or Escape
  useEffect(() => {
    if (!showExplainer) return;

    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        (!tooltipRef.current || !tooltipRef.current.contains(target))
      ) {
        setShowExplainer(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowExplainer(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showExplainer]);

  function toggleExplainer(e: React.MouseEvent) {
    e.stopPropagation(); // don't trigger listing-card click
    if (showExplainer) {
      setShowExplainer(false);
      return;
    }
    if (indicatorRef.current) {
      const rect = indicatorRef.current.getBoundingClientRect();
      const tooltipWidth = 300;
      setTooltipPos({
        top: rect.top - 12,
        left: Math.max(
          16,
          Math.min(
            rect.left - tooltipWidth / 2 + rect.width / 2,
            window.innerWidth - tooltipWidth - 16
          )
        ),
      });
    }
    setShowExplainer(true);
  }

  const indicatorSize = size === "md" ? 10 : 12;

  return (
    <div
      ref={containerRef}
      style={{
        width: spec.width,
        height: spec.height,
        borderRadius: spec.borderRadius,
        flexShrink: 0,
        position: "relative",
        overflow: "visible",
      }}
    >
      {showFallback ? (
        <>
          {/* Base deep-sky background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: spec.borderRadius,
              background: "#08192d",
              border: "1px solid rgba(255,216,107,0.3)",
            }}
          />

          {/* Elemental tone overlay */}
          {tone.overlayColor !== "transparent" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: spec.borderRadius,
                background: tone.overlayColor,
                backgroundImage: tone.backgroundImage,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Spirit gold light points */}
          {tone.spiritDots?.map((dot, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: dot.left,
                top: dot.top,
                width: dot.size,
                height: dot.size,
                borderRadius: "50%",
                background: "#FFD86B",
                opacity: dot.opacity,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Initials text */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFD86B",
              fontWeight: 600,
              fontSize: spec.fontSize,
              letterSpacing: "0.04em",
            }}
          >
            {getInitials(name)}
          </div>
        </>
      ) : (
        <img
          src={imageUrl!}
          alt={name}
          onError={() => setErrored(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: spec.borderRadius,
            display: "block",
          }}
        />
      )}

      {/* Explainer indicator dot (md + lg only) */}
      {showIndicator && (
        <button
          ref={indicatorRef}
          type="button"
          aria-label="About the elements"
          onClick={toggleExplainer}
          onFocus={() => {
            if (indicatorRef.current) {
              const rect = indicatorRef.current.getBoundingClientRect();
              setTooltipPos({
                top: rect.top - 12,
                left: Math.max(
                  16,
                  Math.min(
                    rect.left - 150 + rect.width / 2,
                    window.innerWidth - 316
                  )
                ),
              });
            }
            setShowExplainer(true);
          }}
          onBlur={() => setShowExplainer(false)}
          style={{
            position: "absolute",
            bottom: 3,
            right: 3,
            width: indicatorSize,
            height: indicatorSize,
            borderRadius: "50%",
            background: "rgba(255,216,107,0.4)",
            border: "none",
            padding: 0,
            cursor: "pointer",
            zIndex: 2,
            outline: "none",
          }}
        />
      )}

      {/* Explainer tooltip — rendered via portal to avoid parent overflow clipping */}
      {showExplainer &&
        tooltipPos &&
        mounted &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{
              position: "fixed",
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: "translateY(-100%)",
              width: 300,
              maxWidth: "calc(100vw - 32px)",
              background: "rgba(8, 25, 45, 0.95)",
              border: "1px solid rgba(255,216,107,0.3)",
              borderRadius: 8,
              padding: 16,
              zIndex: 9999,
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.4), 0 0 12px rgba(255,216,107,0.08)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.6,
                color: "#e8eef5",
              }}
            >
              {EXPLAINER_TEXT}
            </p>
          </div>,
          document.body
        )}
    </div>
  );
}
