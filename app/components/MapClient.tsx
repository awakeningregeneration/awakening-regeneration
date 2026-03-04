"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Listing } from "@/types/listing";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type Region = { state?: string; county?: string };

type Props = {
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRegionChange?: (region: Region) => void;
  highlightCounty?: string; // county currently being viewed
  highlightState?: string;  // state currently being viewed
};

function norm(s?: string) {
  return (s || "").trim().toLowerCase();
}

export default function MapClient({
  listings,
  selectedId,
  onSelect,
  onRegionChange,
  highlightCounty,
  highlightState,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const geocodeTimerRef = useRef<number | null>(null);
  const geocodeCacheRef = useRef<Map<string, Region>>(new Map());

  // Inject marker styles once
  useEffect(() => {
    if (document.getElementById("ar-marker-glow-styles")) return;

    const style = document.createElement("style");
    style.id = "ar-marker-glow-styles";
    style.innerHTML = `
      @keyframes arPulse {
        0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.9; }
        55%  { transform: translate(-50%, -50%) scale(1.7); opacity: 0.0; }
        100% { transform: translate(-50%, -50%) scale(1.7); opacity: 0.0; }
      }

      .ar-marker {
        position: relative;
        width: 30px;
        height: 30px;
        cursor: pointer;
        touch-action: manipulation;
      }

      .ar-shadow {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 20px;
        height: 20px;
        border-radius: 999px;
        transform: translate(-50%, -50%);
        background: radial-gradient(
          circle,
          rgba(0,0,0,0.72) 0%,
          rgba(0,0,0,0.42) 45%,
          rgba(0,0,0,0.0) 78%
        );
        pointer-events: none;
      }

      .ar-halo {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 12px;
        height: 12px;
        border-radius: 999px;
        transform: translate(-50%, -50%);
        background: rgba(255, 210, 110, 0.55);
        animation: arPulse 2.2s ease-out infinite;
        pointer-events: none;
      }

      .ar-ring {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 14px;
        height: 14px;
        border-radius: 999px;
        transform: translate(-50%, -50%);
        border: 2px solid rgba(0,0,0,0.35);
        box-shadow: 0 0 0 1px rgba(255,255,255,0.25) inset;
        pointer-events: none;
      }

      .ar-dot {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 10px;
        height: 10px;
        border-radius: 999px;
        transform: translate(-50%, -50%);
        background: rgba(255, 240, 195, 1);
        border: 1px solid rgba(255,255,255,0.85);
        box-shadow:
          0 0 14px rgba(255, 235, 180, 1),
          0 0 34px rgba(255, 200, 120, 0.9),
          0 0 70px rgba(255, 150, 80, 0.55);
      }

      /* Subtle warmth boost for markers in the county you’re currently viewing */
      .ar-marker--in-county .ar-dot {
        box-shadow:
          0 0 16px rgba(255, 245, 205, 1),
          0 0 40px rgba(255, 210, 135, 0.95),
          0 0 84px rgba(255, 165, 95, 0.65);
      }
      .ar-marker--in-county .ar-halo {
        background: rgba(255, 225, 145, 0.62);
      }

      .ar-marker--selected .ar-dot {
        background: rgba(255, 250, 215, 1);
        box-shadow:
          0 0 18px rgba(255, 250, 215, 1),
          0 0 48px rgba(255, 220, 150, 1),
          0 0 96px rgba(255, 160, 90, 0.7);
        border: 1px solid rgba(255,255,255,0.95);
      }

      .ar-marker--selected .ar-halo {
        animation-duration: 1.55s;
        background: rgba(255, 235, 175, 0.7);
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Create map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-98.5795, 39.8283],
      zoom: 4,
    });

    mapRef.current = map;

    // On move end, reverse geocode the center to show county/state
    const handleMoveEnd = () => {
      if (!onRegionChange) return;
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || mapboxgl.accessToken;
      if (!token) return;

      if (geocodeTimerRef.current) {
        window.clearTimeout(geocodeTimerRef.current);
      }

      geocodeTimerRef.current = window.setTimeout(async () => {
        const m = mapRef.current;
        if (!m) return;

        const c = m.getCenter();
        const lng = Number(c.lng.toFixed(3));
        const lat = Number(c.lat.toFixed(3));
        const cacheKey = `${lng},${lat}`;

        const cached = geocodeCacheRef.current.get(cacheKey);
        if (cached) {
          onRegionChange(cached);
          return;
        }

        try {
          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=district,region&country=us&limit=1&access_token=${token}`;
          const res = await fetch(url);
          if (!res.ok) return;

          const data = await res.json();
          const feature = data?.features?.[0];

          let county = "";
          let state = "";

          if (feature?.place_type?.includes("district")) {
            county = feature.text || "";
          }

          const ctx = feature?.context || [];
          for (const item of ctx) {
            if (typeof item?.id === "string" && item.id.startsWith("region.")) {
              state = item.text || "";
            }
          }

          if (feature?.place_type?.includes("region") && !state) {
            state = feature.text || "";
          }

          county = county.replace(/\s+County$/i, "");

          const region = { county, state };
          geocodeCacheRef.current.set(cacheKey, region);
          onRegionChange(region);
        } catch {
          // quiet fail
        }
      }, 450);
    };

    map.on("moveend", handleMoveEnd);
    map.on("load", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd);
      map.remove();
      mapRef.current = null;
    };
  }, [onRegionChange]);

  // Rebuild markers whenever listings change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    markersRef.current = listings.map((listing) => {
      const markerEl = document.createElement("div");
      markerEl.className = "ar-marker";

      const shadow = document.createElement("div");
      shadow.className = "ar-shadow";

      const halo = document.createElement("div");
      halo.className = "ar-halo";

      const ring = document.createElement("div");
      ring.className = "ar-ring";

      const dot = document.createElement("div");
      dot.className = "ar-dot";

      markerEl.appendChild(shadow);
      markerEl.appendChild(halo);
      markerEl.appendChild(ring);
      markerEl.appendChild(dot);

      if (selectedId === listing.id) markerEl.classList.add("ar-marker--selected");

      // county warmth highlight
      const inCounty =
        highlightCounty &&
        listing.county &&
        norm(listing.county) === norm(highlightCounty) &&
        (!highlightState || norm(listing.state) === norm(highlightState));

      if (inCounty) markerEl.classList.add("ar-marker--in-county");

      const handleSelect = (e: Event) => {
        e.stopPropagation();
        onSelect(listing.id);
      };

      markerEl.addEventListener("click", handleSelect);
      markerEl.addEventListener("touchstart", handleSelect);

      return new mapboxgl.Marker(markerEl)
        .setLngLat({ lng: listing.lng, lat: listing.lat })
        .addTo(map);
    });

    if (!selectedId && listings.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      listings.forEach((l) => bounds.extend({ lng: l.lng, lat: l.lat }));
      map.fitBounds(bounds, { padding: 70, duration: 650, maxZoom: 9 });
    }
  }, [listings, onSelect, selectedId, highlightCounty, highlightState]);

  // Update selected + in-county warmth without rebuilding markers
  useEffect(() => {
    markersRef.current.forEach((marker, idx) => {
      const el = marker.getElement();
      const listing = listings[idx];
      if (!el || !listing) return;

      // selected
      if (selectedId === listing.id) el.classList.add("ar-marker--selected");
      else el.classList.remove("ar-marker--selected");

      // in-county warmth
      const inCounty =
        highlightCounty &&
        listing.county &&
        norm(listing.county) === norm(highlightCounty) &&
        (!highlightState || norm(listing.state) === norm(highlightState));

      if (inCounty) el.classList.add("ar-marker--in-county");
      else el.classList.remove("ar-marker--in-county");
    });
  }, [selectedId, listings, highlightCounty, highlightState]);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />;
}
