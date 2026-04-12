"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type LightPoint = {
  left: number;
  top: number;
  size: number;
  glow: number;
};

const points: LightPoint[] = [
  { left: 33, top: 63, size: 8, glow: 0.9 },
  { left: 24, top: 52, size: 7, glow: 0.8 },
  { left: 27, top: 33, size: 7, glow: 0.82 },

  { left: 29, top: 60, size: 9, glow: 0.92 },
  { left: 31, top: 47, size: 7, glow: 0.8 },
  { left: 33, top: 28, size: 6, glow: 0.75 },

  { left: 37, top: 62, size: 8, glow: 0.88 },
  { left: 39, top: 49, size: 10, glow: 0.96 },
  { left: 41, top: 31, size: 7, glow: 0.8 },

  { left: 45, top: 65, size: 8, glow: 0.86 },
  { left: 47, top: 51, size: 8, glow: 0.88 },
  { left: 49, top: 33, size: 7, glow: 0.8 },

  { left: 53, top: 61, size: 9, glow: 0.92 },
  { left: 55, top: 48, size: 7, glow: 0.8 },
  { left: 57, top: 26, size: 6, glow: 0.74 },

  { left: 60, top: 64, size: 8, glow: 0.88 },
  { left: 62, top: 50, size: 8, glow: 0.86 },
  { left: 64, top: 32, size: 7, glow: 0.78 },

  { left: 68, top: 60, size: 8, glow: 0.86 },
  { left: 70, top: 46, size: 9, glow: 0.92 },
  { left: 72, top: 25, size: 6, glow: 0.72 },

  { left: 75, top: 54, size: 7, glow: 0.8 },
  { left: 77, top: 36, size: 8, glow: 0.84 },
];

export default function ThresholdMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [-98, 39],
      zoom: 3.2,
      attributionControl: false,
      interactive: false,
      projection: "mercator",
    });

    return () => map.remove();
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.72 }}>
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "100%",
            filter: "brightness(1.03) saturate(1.1)",
          }}
        />
      </div>

      {/* Blue atmosphere / headline readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 50% 18%, rgba(34,78,168,0.56) 0%, rgba(30,72,154,0.30) 34%, rgba(24,58,128,0.00) 72%)",
        }}
      />

      {/* Side and bottom fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `
            linear-gradient(to right,
              rgba(40,86,170,0.26) 0%,
              rgba(40,86,170,0.08) 18%,
              rgba(40,86,170,0.00) 34%,
              rgba(40,86,170,0.00) 66%,
              rgba(40,86,170,0.08) 82%,
              rgba(40,86,170,0.26) 100%
            ),
            linear-gradient(to bottom,
              rgba(22,52,122,0.08) 0%,
              rgba(22,52,122,0.00) 26%,
              rgba(22,52,122,0.00) 72%,
              rgba(22,52,122,0.22) 100%
            )
          `,
        }}
      />

     {/* Soft deep-ocean wash */}
<div
  style={{
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(circle at 50% 62%, rgba(38,92,190,0.10) 0%, rgba(20,48,112,0.05) 38%, rgba(9,22,45,0.00) 75%)",
    mixBlendMode: "screen",
  }}
/>

      {/* Lights */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {points.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size * 2.8}px`,
              height: `${p.size * 2.8}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,245,210,1.0) 0%, rgba(255,220,140,0.78) 28%, rgba(255,200,110,0.32) 55%, rgba(255,200,110,0.08) 72%, transparent 100%)",
                boxShadow: `0 0 ${p.size * 2.2 * p.glow}px rgba(255,210,120,0.42)`,
                opacity: 0.82,
              }}
            />

            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: `${Math.max(4, p.size * 0.95)}px`,
                height: `${Math.max(4, p.size * 0.95)}px`,
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                background: "rgba(255,246,220,0.92)",
                boxShadow: `0 0 ${p.size * 1.0}px rgba(255,235,170,0.62)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Faint background lights */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.82 }}>
        {[
          { left: 18, top: 42 },
          { left: 21, top: 34 },
          { left: 28, top: 66 },
          { left: 34, top: 29 },
          { left: 36, top: 54 },
          { left: 42, top: 63 },
          { left: 44, top: 28 },
          { left: 50, top: 68 },
          { left: 58, top: 30 },
          { left: 63, top: 58 },
          { left: 66, top: 27 },
          { left: 71, top: 64 },
          { left: 74, top: 33 },
          { left: 79, top: 48 },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: "5px",
height: "5px",
borderRadius: "50%",
background: "rgba(255,242,190,0.82)",
boxShadow: "0 0 10px rgba(255,220,140,0.48)",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
            </div>
    </div>
  );
}