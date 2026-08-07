"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import type { SlideBox } from "./content";

// Fixed hero height in px — matches the slide's 7.5in height proportionally
// when the column is ~652px wide (13.33in deck → 652px ≈ 48.9px/in).
const HERO_HEIGHT = 500;

const GOLD = "#FFD86B";

function renderLine(text: string, accentWords?: string[]): React.ReactNode {
  if (!accentWords?.length) return text;
  const escaped = accentWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "g"));
  return parts.map((part, i) =>
    accentWords.includes(part) ? (
      <span key={i} style={{ color: GOLD }}>{part}</span>
    ) : (
      part
    )
  );
}

export default function SlideHero({
  num,
  boxes,
  title,
  priority,
  scrim,
}: {
  num: number;
  boxes: SlideBox[];
  title: string;
  priority?: boolean;
  scrim?: "left" | "bottom";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Seed with the approximate rendered column width (700px max-width − 48px padding)
  // so text appears at the correct size on the first paint, before ResizeObserver fires.
  const [containerWidth, setContainerWidth] = useState(652);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: HERO_HEIGHT,
        overflow: "hidden",
        borderRadius: 10,
      }}
    >
      <Image
        src={`/bridge/slide${num}.jpg`}
        alt={title}
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        sizes="(max-width: 748px) calc(100vw - 48px), 652px"
        priority={priority}
      />

      {/* Uniform overlay — text appears at every vertical position across slides */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }}
      />

      {/* Directional scrim — layered on top of uniform overlay for extra legibility */}
      {scrim === "left" && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 75%)",
          }}
        />
      )}
      {scrim === "bottom" && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 45%, transparent 70%)",
          }}
        />
      )}

      {/* Text boxes — positioned/sized to match source .pptx layout exactly.
          Negative left values and width_pct > 1 are PPTX overhangs; overflow:hidden clips them. */}
      {boxes.map((box, boxIdx) => (
        <div
          key={boxIdx}
          style={{
            position: "absolute",
            top: `${(box.top + (box.adjustments?.topOffsetPct ?? 0)) * 100}%`,
            left: `${box.left * 100}%`,
            width: `${box.width * 100}%`,
            height: `${box.height * 100}%`,
            display: "flex",
            flexDirection: "column",
            justifyContent: box.vcenter ? "center" : "flex-start",
            alignItems: box.align === "center" ? "center" : "flex-start",
            overflow: "hidden",
            ...(box.adjustments?.horizontalPaddingPct
              ? { padding: `0 ${box.adjustments.horizontalPaddingPct * 100}%`, boxSizing: "border-box" as const }
              : {}),
          }}
        >
          {box.lines.map((line, lineIdx) => (
            <div
              key={lineIdx}
              style={{
                fontFamily:
                  box.font === "serif"
                    ? "'Times New Roman', Times, Georgia, serif"
                    : "'Calibri', 'Trebuchet MS', 'Helvetica Neue', Arial, sans-serif",
                // fontSizeRatio × containerWidth reproduces original deck proportions
                // at any rendered container width.
                fontSize: `${box.fontSizeRatio * (box.adjustments?.fontSizeMultiplier ?? 1) * Math.max(containerWidth, 480)}px`,
                fontWeight: box.bold ? 700 : 400,
                fontStyle: box.italic ? "italic" : "normal",
                color: "#ffffff",
                textAlign: box.align,
                // pre-wrap preserves authored hard breaks and the deliberate
                // inter-word spacing in slide 10 without browser reflow.
                whiteSpace: "pre-wrap",
                lineHeight: box.adjustments?.lineHeight ?? 1.1,
                textShadow: "0 1px 5px rgba(0,0,0,0.55)",
                width: "100%",
              }}
            >
              {renderLine(line, box.accentWords)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
