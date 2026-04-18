"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  elementalSignatures,
  type ElementName,
} from "../lib/elementalTones";

type Props = {
  element: ElementName;
  size?: "sm" | "md";
};

const SIZE_PX = { sm: 24, md: 32 } as const;

const EXPLAINER_TEXT =
  "Every tradition that has ever looked closely at life has found some version of these: Earth, Water, Fire, Air, and the relationship that holds them. Canary Commons doesn\u2019t teach them \u2014 it just lets them sit quietly beside what\u2019s growing. A small reminder of what was never actually lost, only covered over.";

export default function ElementalSeat({
  element,
  size = "md",
}: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  const seatRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const px = SIZE_PX[size];
  const sig = elementalSignatures[element];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on outside click or Escape
  useEffect(() => {
    if (!showTooltip) return;

    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        seatRef.current &&
        !seatRef.current.contains(target) &&
        (!tooltipRef.current || !tooltipRef.current.contains(target))
      ) {
        setShowTooltip(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowTooltip(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showTooltip]);

  function openTooltip() {
    if (seatRef.current) {
      const rect = seatRef.current.getBoundingClientRect();
      const tooltipWidth = 300;
      setTooltipPos({
        top: rect.top - 10,
        left: Math.max(
          16,
          Math.min(
            rect.left - tooltipWidth / 2 + rect.width / 2,
            window.innerWidth - tooltipWidth - 16
          )
        ),
      });
    }
    setShowTooltip(true);
  }

  function toggleTooltip(e: React.MouseEvent) {
    e.stopPropagation();
    if (showTooltip) {
      setShowTooltip(false);
    } else {
      openTooltip();
    }
  }

  return (
    <>
      <div
        ref={seatRef}
        role="button"
        tabIndex={0}
        aria-label="About the elements"
        onClick={toggleTooltip}
        onFocus={openTooltip}
        onBlur={() => setShowTooltip(false)}
        style={{
          width: px,
          height: px,
          borderRadius: 7,
          background: "rgba(8,25,45,0.6)",
          border: showTooltip
            ? "1px solid rgba(255,216,107,0.35)"
            : "1px solid rgba(255,216,107,0.15)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          flexShrink: 0,
          transition: "border-color 0.15s ease",
        }}
      >
        {/* Element signature background */}
        {sig.background !== "transparent" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 6,
              background: sig.background,
              backgroundImage: sig.backgroundImage || undefined,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Spirit gold points — gestural configuration */}
        {sig.spiritPoints?.map((pt, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${pt.left}%`,
              top: `${pt.top}%`,
              width: pt.size,
              height: pt.size,
              borderRadius: "50%",
              background: "#FFD86B",
              opacity: pt.opacity,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              boxShadow: `0 0 ${pt.size * 2}px rgba(255,216,107,0.4)`,
            }}
          />
        ))}
      </div>

      {/* Tooltip — portal to body */}
      {showTooltip &&
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
    </>
  );
}
