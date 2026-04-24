"use client";

import { useEffect, useRef, useState } from "react";
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
  // Widened spread: left edge lights shifted -7 to -8, right edge shifted +8
  // Range now: left 16%–85%, top 25%–66%
  { left: 33, top: 63, size: 8, glow: 0.9 },
  { left: 16, top: 52, size: 7, glow: 0.8 },   // was 24
  { left: 20, top: 33, size: 7, glow: 0.82 },  // was 27

  { left: 22, top: 60, size: 9, glow: 0.92 },  // was 29
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
  { left: 78, top: 46, size: 9, glow: 0.92 },  // was 70
  { left: 80, top: 25, size: 6, glow: 0.72 },  // was 72

  { left: 83, top: 54, size: 7, glow: 0.8 },   // was 75
  { left: 85, top: 36, size: 8, glow: 0.84 },   // was 77

  // Additional points — central/sparse US states with brightness variance
  // Dimmer points (~70-80% glow)
  { left: 42, top: 42, size: 6, glow: 0.62 },   // Kansas — Wichita area
  { left: 44, top: 36, size: 5, glow: 0.58 },   // Nebraska — Lincoln area
  { left: 40, top: 38, size: 5, glow: 0.65 },   // Kansas — Topeka area
  { left: 48, top: 56, size: 6, glow: 0.60 },   // Oklahoma — OKC area
  { left: 36, top: 58, size: 5, glow: 0.62 },   // Arkansas — Little Rock area
  { left: 52, top: 66, size: 5, glow: 0.58 },   // Mississippi — Jackson area

  // Brighter points (larger/hotter)
  { left: 44, top: 30, size: 11, glow: 0.98 },  // Iowa — Des Moines area
  { left: 56, top: 58, size: 11, glow: 0.96 },  // Alabama — Birmingham area
  { left: 66, top: 42, size: 10, glow: 0.95 },  // West Virginia — Charleston area

  // Standard brightness
  { left: 46, top: 44, size: 7, glow: 0.82 },   // Missouri — Kansas City area
  { left: 50, top: 42, size: 8, glow: 0.84 },   // Missouri — St. Louis area
  { left: 38, top: 50, size: 7, glow: 0.80 },   // Arkansas — Fayetteville area
  { left: 54, top: 54, size: 7, glow: 0.82 },   // Tennessee — Nashville area
  { left: 60, top: 56, size: 8, glow: 0.84 },   // Georgia — Atlanta area
];

const faintLights = [
  { left: 10, top: 42 },  // was 18
  { left: 13, top: 34 },  // was 21
  { left: 21, top: 66 },  // was 28
  { left: 34, top: 29 },
  { left: 36, top: 54 },
  { left: 42, top: 63 },
  { left: 44, top: 28 },
  { left: 50, top: 68 },
  { left: 58, top: 30 },
  { left: 63, top: 58 },
  { left: 66, top: 27 },
  { left: 79, top: 64 },  // was 71
  { left: 82, top: 33 },  // was 74
  { left: 87, top: 48 },  // was 79
];

/* ── Mobile light adjustment ──
   Text zone: left 25%–75%, top 15%–80%
   Inside text zone: dim to 0.45× size/glow
   Outside (edges): boost to 1.2× size/glow */
const MOBILE_DIM = 0.45;
const MOBILE_EDGE_BOOST = 1.2;

function isEdgeLight(left: number): boolean {
  return left < 25 || left > 75;
}

function mobileAdjust(p: LightPoint): LightPoint {
  if (isEdgeLight(p.left)) {
    return {
      ...p,
      size: Math.min(p.size * MOBILE_EDGE_BOOST, 14),
      glow: Math.min(p.glow * MOBILE_EDGE_BOOST, 1.0),
    };
  }
  // Text zone: left 25-75, top 15-80
  if (p.top >= 15 && p.top <= 80) {
    return {
      ...p,
      size: p.size * MOBILE_DIM,
      glow: p.glow * MOBILE_DIM,
    };
  }
  return p;
}

function useMobileDetect(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    function check() {
      setIsMobile(window.innerWidth < 768);
    }

    function onResize() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(check, 150);
    }

    check();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return isMobile;
}

export default function ThresholdMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMobileDetect();

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-98, 39],
      zoom: 3.2,
      attributionControl: false,
      interactive: false,
      projection: "mercator",
    });

    map.on("load", () => {
      // Water — gentle luminous cyan-blue
      if (map.getLayer("water")) {
        map.setPaintProperty("water", "fill-color", "#6b85c8");
      }

      if (map.getLayer("water-shadow")) {
        map.setPaintProperty("water-shadow", "fill-color", "#5a75b6");
      }

      // Land — lifted with more violet in the navy
      const landLayer = map.getLayer("land");
      if (landLayer) {
        const prop = landLayer.type === "background" ? "background-color" : "fill-color";
        map.setPaintProperty("land", prop, "#3d4878");
        console.log("land layer type:", landLayer.type, "→ used", prop);
      }

      // Landuse — match violet-warmed land
      if (map.getLayer("landuse")) {
        map.setPaintProperty("landuse", "fill-color", "#3d4878");
      }

      // National parks — match violet-warmed land
      if (map.getLayer("national-park")) {
        map.setPaintProperty("national-park", "fill-color", "#3d4878");
      }

      // Waterway (rivers) — warmer violet-blue
      if (map.getLayer("waterway")) {
        map.setPaintProperty("waterway", "line-color", "#5a6ea4");
      }

      // Admin boundaries — violet-blue family
      if (map.getLayer("admin-0-boundary")) {
        map.setPaintProperty("admin-0-boundary", "line-color", "#6373a0");
      }

      if (map.getLayer("admin-1-boundary")) {
        map.setPaintProperty("admin-1-boundary", "line-color", "#6373a0");
      }

      // Log available layers for further tuning
      console.log("Available map layers:", map.getStyle().layers.map((l: { id: string }) => l.id));
    });

    return () => map.remove();
  }, []);

  const displayPoints = isMobile ? points.map(mobileAdjust) : points;

  // Faint lights: on mobile, edge ones get slightly larger/brighter
  const faintSize = 5;
  const faintOpacity = 0.82;

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 2 }}>
      <div style={{ position: "absolute", inset: 0 }}>
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
        {displayPoints.map((p, i) => (
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
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: faintOpacity }}>
        {faintLights.map((p, i) => {
          const edge = isEdgeLight(p.left);
          const sz = isMobile && edge ? faintSize * MOBILE_EDGE_BOOST : isMobile ? faintSize * MOBILE_DIM : faintSize;
          const op = isMobile && edge ? 0.9 : isMobile ? 0.4 : 0.82;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${sz}px`,
                height: `${sz}px`,
                borderRadius: "50%",
                background: `rgba(255,242,190,${op})`,
                boxShadow: `0 0 ${isMobile && edge ? 14 : 10}px rgba(255,220,140,${isMobile && edge ? 0.58 : 0.48})`,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
