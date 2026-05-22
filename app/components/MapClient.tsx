"use client";

import { useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Listing } from "@/types/listing";
import ListingImageTile from "./ListingImageTile";
import { getListingImage } from "../../lib/getListingImage";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type Region = { state?: string; county?: string };

type Props = {
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string, context?: { county?: string; state?: string }) => void;
  onRegionChange?: (region: Region) => void;
  highlightCounty?: string;
  highlightState?: string;
  visible?: boolean;
};

const FLAG_REASON_OPTIONS = [
  "Incorrect information",
  "Closed or no longer active",
  "Promotional / spam",
  "Misleading category or description",
  "Harmful or inappropriate",
  "Other",
];

/* ── GeoJSON helpers ── */

function listingsToGeoJSON(listings: Listing[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: listings.map((l) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [l.lng, l.lat] },
      properties: {
        id: l.id,
        county: l.county ?? "",
        state: l.state ?? "",
      },
    })),
  };
}

/* ── Pulse animation constants ── */
const PULSE_PERIOD = 2200; // ms — matches original 2.2s arPulse
const PULSE_SELECTED_PERIOD = 1550; // ms — matches original 1.55s selected

/* ── Zoom-interpolated expressions ── */

// Base layers
const DOT_RADIUS: mapboxgl.ExpressionSpecification = [
  "interpolate", ["linear"], ["zoom"],
  3, 2,
  5, 3.5,
  7, 5,
  9, 7,
  12, 10,
];
const HALO_RADIUS: mapboxgl.ExpressionSpecification = [
  "interpolate", ["linear"], ["zoom"],
  3, 3,
  5, 5,
  7, 8,
  9, 12,
  12, 18,
];
const GLOW_RADIUS: mapboxgl.ExpressionSpecification = [
  "interpolate", ["linear"], ["zoom"],
  3, 5,
  5, 10,
  7, 18,
  9, 28,
  12, 40,
];
const GLOW_OPACITY: mapboxgl.ExpressionSpecification = [
  "interpolate", ["linear"], ["zoom"],
  3, 0.15,
  7, 0.35,
  12, 0.55,
];

// Selected layers — boosted
const DOT_RADIUS_SEL: mapboxgl.ExpressionSpecification = [
  "interpolate", ["linear"], ["zoom"],
  3, 2.6,
  5, 4.5,
  7, 6.5,
  9, 9,
  12, 13,
];
const HALO_RADIUS_SEL: mapboxgl.ExpressionSpecification = [
  "interpolate", ["linear"], ["zoom"],
  3, 4.2,
  5, 7,
  7, 11,
  9, 17,
  12, 25,
];
const GLOW_RADIUS_SEL: mapboxgl.ExpressionSpecification = [
  "interpolate", ["linear"], ["zoom"],
  3, 7.5,
  5, 15,
  7, 27,
  9, 42,
  12, 60,
];

const SOURCE_ID = "listings-source";

export default function MapClient({
  listings,
  selectedId,
  onSelect,
  onRegionChange,
  highlightCounty,
  highlightState,
  visible = true,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapLoadedRef = useRef(false);
  const listingsRef = useRef(listings);
  const geocodeTimerRef = useRef<number | null>(null);
  const geocodeCacheRef = useRef<Map<string, Region>>(new Map());
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const popupImageRootRef = useRef<Root | null>(null);
  const animFrameRef = useRef<number>(0);
  const prevSelectedRef = useRef<string | null>(null);
  const onSelectRef = useRef(onSelect);

  listingsRef.current = listings;
  onSelectRef.current = onSelect;

  const isFiltered = !!(highlightState || highlightCounty);

  const [flagListingId, setFlagListingId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState("");
  const [flagDetails, setFlagDetails] = useState("");
  const [flagError, setFlagError] = useState("");
  const [flagSuccess, setFlagSuccess] = useState("");
  const [isFlagSubmitting, setIsFlagSubmitting] = useState(false);

  function openFlagModal(listingId: string) {
    setFlagListingId(listingId);
    setFlagReason("");
    setFlagDetails("");
    setFlagError("");
    setFlagSuccess("");
    setIsFlagSubmitting(false);
  }

  function closeFlagModal() {
    if (isFlagSubmitting) return;
    setFlagListingId(null);
    setFlagReason("");
    setFlagDetails("");
    setFlagError("");
    setFlagSuccess("");
  }

  async function handleSubmitFlag() {
    if (!flagListingId) return;

    if (!flagReason.trim()) {
      setFlagError("Please choose a reason.");
      return;
    }
    if (!flagDetails.trim()) {
      setFlagError("Please add a brief note.");
      return;
    }

    setFlagError("");
    setFlagSuccess("");
    setIsFlagSubmitting(true);

    try {
      const response = await fetch("/api/listings/flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: flagListingId,
          reason: flagReason.trim(),
          details: flagDetails.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to flag listing.");
      }

      if (data?.result?.status === "duplicate") {
        setFlagError("You already flagged this listing today.");
        return;
      }

      const count = data?.result?.flag_count;
      const hidden = typeof count === "number" && count >= 5;

      if (hidden) {
        setFlagSuccess(
          "This listing has reached the community flag limit and is now hidden."
        );
        window.setTimeout(() => window.location.reload(), 1200);
        return;
      }

      setFlagSuccess(
        typeof count === "number"
          ? `Flag received. Current flag count: ${count}.`
          : "Flag received."
      );
      window.setTimeout(() => closeFlagModal(), 1000);
    } catch (error) {
      setFlagError(
        error instanceof Error ? error.message : "Failed to flag listing."
      );
    } finally {
      setIsFlagSubmitting(false);
    }
  }

  /* ── Inject popup CSS (once) ── */
  useEffect(() => {
    if (document.getElementById("ar-popup-styles")) return;

    const style = document.createElement("style");
    style.id = "ar-popup-styles";
    style.innerHTML = `
      .mapboxgl-popup-content {
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        border-radius: 20px !important;
        position: relative !important;
      }
      .mapboxgl-popup-tip {
        display: none !important;
      }
      .mapboxgl-popup-close-button {
        display: none !important;
      }
      .ar-popup-close {
        position: absolute;
        top: 8px;
        left: 10px;
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        color: #FFD86B;
        border: none;
        border-radius: 0;
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        z-index: 30;
        padding: 0;
        transition: color 0.15s ease, transform 0.15s ease;
      }
      .ar-popup-close:hover {
        color: #fff8e0;
        transform: scale(1.1);
      }
      .ar-popup {
        background: radial-gradient(circle at 30% 20%, rgba(17,41,82,0.97) 0%, rgba(8,25,45,0.99) 100%);
        border: 1px solid rgba(255,216,107,0.35);
        border-radius: 20px;
        box-shadow: 0 0 24px rgba(255,216,107,0.12), 0 8px 32px rgba(0,0,0,0.4);
        padding: 16px;
        min-width: 220px;
        max-width: 300px;
        color: rgba(211,227,247,0.95);
        position: relative;
        overflow: visible;
      }
      .ar-popup-stars {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
        border-radius: 20px;
      }
      .ar-popup-content {
        position: relative;
        z-index: 1;
      }
      .ar-popup-title {
        color: rgba(224,242,255,0.98);
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 6px 0;
      }
      .ar-popup-description {
        color: rgba(148,196,236,0.85);
        font-size: 13px;
        line-height: 1.45;
        margin: 0 0 8px 0;
      }
      .ar-popup-address {
        font-size: 13px;
        color: rgba(148,196,236,0.75);
        line-height: 1.4;
        margin: 0 0 6px 0;
      }
      .ar-popup-meta {
        font-size: 12px;
        color: rgba(148,196,236,0.7);
        margin: 0 0 8px 0;
        font-weight: 500;
      }
      .ar-popup-practices {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 10px;
      }
      .ar-popup-practice-tag {
        font-size: 11px;
        color: #FFD86B;
        background: rgba(255,216,107,0.12);
        border: 1px solid rgba(255,216,107,0.3);
        border-radius: 10px;
        padding: 2px 8px;
        font-weight: 500;
      }
      .ar-popup-link {
        display: block;
        margin-top: 8px;
        margin-bottom: 0;
        color: #FFD86B;
        font-weight: 600;
        font-size: 14px;
        text-decoration: none;
      }
      .ar-popup-link:hover {
        text-decoration: underline;
      }
      .ar-popup-action {
        background: none;
        border: none;
        padding: 0;
        font-size: 13px;
        color: rgba(148,196,236,0.7);
        text-decoration: underline;
        cursor: pointer;
        display: block;
        margin-bottom: 6px;
      }
      /* Anchor popup to upper-right at all viewports */
      .mapboxgl-popup {
        position: fixed !important;
        top: 14px !important;
        right: 14px !important;
        left: auto !important;
        bottom: auto !important;
        transform: none !important;
        max-width: 360px !important;
        z-index: 20 !important;
      }
      .mapboxgl-popup .mapboxgl-popup-content {
        max-width: 360px !important;
      }
      @media (max-width: 767px) {
        .mapboxgl-popup {
          max-width: 68vw !important;
        }
        .mapboxgl-popup .mapboxgl-popup-content {
          max-width: 68vw !important;
        }
        .ar-popup {
          max-width: none !important;
          min-width: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  /* ── Map initialization ── */
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-98.5795, 39.8283],
      zoom: 4,
    });

    mapRef.current = map;

    // ResizeObserver for real container resizes (orientation, window)
    const ro = new ResizeObserver(() => {
      map.resize();
    });
    ro.observe(mapContainerRef.current);

    // Reverse geocode on map movement (region indicator)
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

    /* ── Add circle layers once map loads ── */
    map.on("load", () => {
      mapLoadedRef.current = true;

      // Populate source with current listings (may already have data from API)
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: listingsToGeoJSON(listingsRef.current),
        promoteId: "id",
      });

      // --- Base layers (all listings) ---

      // Layer 1: Outer glow
      map.addLayer({
        id: "listings-glow",
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-radius": GLOW_RADIUS,
          "circle-color": "rgba(255,180,100,0.3)",
          "circle-blur": 1,
          "circle-opacity": GLOW_OPACITY,
        },
      });

      // Layer 2: Halo (pulse target)
      map.addLayer({
        id: "listings-halo",
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-radius": HALO_RADIUS,
          "circle-color": "rgba(255,210,110,0.55)",
          "circle-blur": 0.6,
          "circle-opacity": 0.55,
        },
      });

      // Layer 3: Core dot
      map.addLayer({
        id: "listings-dot",
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-radius": DOT_RADIUS,
          "circle-color": "#fff0c3",
          "circle-stroke-width": [
            "interpolate", ["linear"], ["zoom"],
            3, 0.3,
            9, 1,
          ] as mapboxgl.ExpressionSpecification,
          "circle-stroke-color": "rgba(255,255,255,0.85)",
          "circle-opacity": 1,
        },
      });

      // --- Selected layers (filtered to selected listing) ---

      const noMatchFilter: mapboxgl.ExpressionSpecification = ["==", ["get", "id"], ""];

      map.addLayer({
        id: "listings-glow-selected",
        type: "circle",
        source: SOURCE_ID,
        filter: noMatchFilter,
        paint: {
          "circle-radius": GLOW_RADIUS_SEL,
          "circle-color": "rgba(255,180,100,0.45)",
          "circle-blur": 1,
          "circle-opacity": [
            "interpolate", ["linear"], ["zoom"],
            3, 0.25,
            7, 0.5,
            12, 0.7,
          ] as mapboxgl.ExpressionSpecification,
        },
      });

      map.addLayer({
        id: "listings-halo-selected",
        type: "circle",
        source: SOURCE_ID,
        filter: noMatchFilter,
        paint: {
          "circle-radius": HALO_RADIUS_SEL,
          "circle-color": "rgba(255,235,175,0.7)",
          "circle-blur": 0.5,
          "circle-opacity": 0.7,
        },
      });

      map.addLayer({
        id: "listings-dot-selected",
        type: "circle",
        source: SOURCE_ID,
        filter: noMatchFilter,
        paint: {
          "circle-radius": DOT_RADIUS_SEL,
          "circle-color": "#fffad7",
          "circle-stroke-width": [
            "interpolate", ["linear"], ["zoom"],
            3, 0.5,
            9, 1.2,
          ] as mapboxgl.ExpressionSpecification,
          "circle-stroke-color": "rgba(255,255,255,0.95)",
          "circle-opacity": 1,
        },
      });

      // --- Invisible hit-area layer (above all visual layers) ---

      map.addLayer({
        id: "listings-hit",
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            3, 8,
            7, 18,
            9, 32,
            12, 48,
          ] as mapboxgl.ExpressionSpecification,
          "circle-opacity": 0,
          "circle-color": "#000",
        },
      });

      // --- Click & cursor handlers (on hit area) ---

      map.on("click", "listings-hit", (e) => {
        const feature = e.features?.[0];
        if (!feature || !feature.properties) return;
        const props = feature.properties;
        onSelect(props.id, {
          county: props.county || undefined,
          state: props.state || undefined,
        });
      });

      map.on("mouseenter", "listings-hit", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "listings-hit", () => {
        map.getCanvas().style.cursor = "";
      });

      // --- Pulse animation loop ---

      function animatePulse() {
        const m = mapRef.current;
        if (!m || !m.getLayer("listings-halo")) {
          animFrameRef.current = requestAnimationFrame(animatePulse);
          return;
        }

        const now = Date.now();

        // Base halo pulse
        const tBase = (now % PULSE_PERIOD) / PULSE_PERIOD;
        const progressBase = Math.min(tBase / 0.55, 1);
        const easedBase = 1 - Math.pow(1 - progressBase, 2);
        const baseOpacity = 0.55 * (1 - easedBase);
        m.setPaintProperty("listings-halo", "circle-opacity", baseOpacity);

        // Selected halo pulse (faster)
        if (m.getLayer("listings-halo-selected")) {
          const tSel = (now % PULSE_SELECTED_PERIOD) / PULSE_SELECTED_PERIOD;
          const progressSel = Math.min(tSel / 0.55, 1);
          const easedSel = 1 - Math.pow(1 - progressSel, 2);
          const selOpacity = 0.7 * (1 - easedSel);
          m.setPaintProperty("listings-halo-selected", "circle-opacity", selOpacity);
        }

        animFrameRef.current = requestAnimationFrame(animatePulse);
      }

      animFrameRef.current = requestAnimationFrame(animatePulse);
    });

    return () => {
      mapLoadedRef.current = false;
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      map.off("moveend", handleMoveEnd);
      popupRef.current?.remove();
      if (popupImageRootRef.current) {
        const r = popupImageRootRef.current;
        popupImageRootRef.current = null;
        queueMicrotask(() => r.unmount());
      }
      map.remove();
      mapRef.current = null;
    };
  }, [onRegionChange, onSelect]);

  /* ── Update GeoJSON source when listings change ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyData = () => {
      const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
      if (source) {
        source.setData(listingsToGeoJSON(listings));
      }

      // fitBounds when filtered
      if (!selectedId && listings.length > 0 && isFiltered) {
        const bounds = new mapboxgl.LngLatBounds();
        listings.forEach((l) => bounds.extend({ lng: l.lng, lat: l.lat }));
        map.fitBounds(bounds, { padding: 70, duration: 650, maxZoom: 9 });
      }
    };

    if (mapLoadedRef.current) {
      applyData();
    } else {
      // Map hasn't loaded yet — wait for the source to be created
      map.once("load", applyData);
    }
  }, [listings, selectedId, isFiltered]);

  /* ── Update selected-layer filters when selection changes ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const filter: mapboxgl.ExpressionSpecification = selectedId
      ? ["==", ["get", "id"], selectedId]
      : ["==", ["get", "id"], ""];

    if (map.getLayer("listings-glow-selected")) {
      map.setFilter("listings-glow-selected", filter);
    }
    if (map.getLayer("listings-halo-selected")) {
      map.setFilter("listings-halo-selected", filter);
    }
    if (map.getLayer("listings-dot-selected")) {
      map.setFilter("listings-dot-selected", filter);
    }

    prevSelectedRef.current = selectedId;
  }, [selectedId]);

  /* ── Return to national view when filters clear ── */
  useEffect(() => {
    if (!isFiltered && mapRef.current) {
      mapRef.current.flyTo({
        center: [-98.5795, 39.8283],
        zoom: 4,
        duration: 900,
      });
    }
  }, [isFiltered]);

  /* ── Visible prop → map.resize() for mobile ── */
  useEffect(() => {
    if (visible && mapRef.current) {
      // Small delay to let the CSS transform settle
      const t = setTimeout(() => mapRef.current?.resize(), 50);
      return () => clearTimeout(t);
    }
  }, [visible]);

  /* ── Popup rendering ── */
  useEffect(() => {
    if (!selectedId) {
      popupRef.current?.remove();
      popupRef.current = null;
      if (popupImageRootRef.current) {
        const r = popupImageRootRef.current;
        popupImageRootRef.current = null;
        queueMicrotask(() => r.unmount());
      }
      return;
    }

    const map = mapRef.current;
    if (!map) return;

    const listing = listings.find((l) => l.id === selectedId);
    if (!listing) return;

    map.flyTo({
      center: [listing.lng, listing.lat],
      zoom: Math.max(map.getZoom(), 9),
      duration: 800,
    });

    popupRef.current?.remove();

    if (popupImageRootRef.current) {
      const prevRoot = popupImageRootRef.current;
      popupImageRootRef.current = null;
      queueMicrotask(() => prevRoot.unmount());
    }

    const popupNode = document.createElement("div");
    popupNode.className = "ar-popup";

    // Custom close button
    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML = "\u00D7";
    closeBtn.className = "ar-popup-close";
    closeBtn.onclick = () => {
      onSelectRef.current("", undefined);
    };
    popupNode.appendChild(closeBtn);

    // Background star field
    const starsDiv = document.createElement("div");
    starsDiv.className = "ar-popup-stars";
    [
      { left: "10%", top: "15%", size: 2 },
      { left: "25%", top: "70%", size: 1.5 },
      { left: "40%", top: "10%", size: 2.5 },
      { left: "60%", top: "80%", size: 1.5 },
      { left: "70%", top: "20%", size: 2 },
      { left: "85%", top: "60%", size: 2 },
      { left: "15%", top: "45%", size: 1.5 },
      { left: "50%", top: "40%", size: 1.5 },
      { left: "90%", top: "30%", size: 2.5 },
      { left: "35%", top: "55%", size: 1.5 },
    ].forEach((s) => {
      const star = document.createElement("span");
      star.style.cssText = `position:absolute;left:${s.left};top:${s.top};width:${s.size}px;height:${s.size}px;border-radius:50%;background:rgba(255,244,200,0.85);box-shadow:0 0 ${s.size * 2}px rgba(255,216,107,0.5);pointer-events:none;`;
      starsDiv.appendChild(star);
    });
    popupNode.appendChild(starsDiv);

    const contentDiv = document.createElement("div");
    contentDiv.className = "ar-popup-content";
    popupNode.appendChild(contentDiv);

    // Image tile
    const imageContainer = document.createElement("div");
    imageContainer.style.marginBottom = "10px";
    contentDiv.appendChild(imageContainer);

    const resolvedImage = getListingImage(listing.image_url, listing.website);
    const imageRoot = createRoot(imageContainer);
    imageRoot.render(
      <ListingImageTile
        imageUrl={resolvedImage}
        name={listing.title ?? listing.name ?? ""}
        size="md"
      />
    );
    popupImageRootRef.current = imageRoot;

    const title = document.createElement("h3");
    title.className = "ar-popup-title";
    title.textContent = listing.title ?? listing.name ?? "";
    contentDiv.appendChild(title);

    if (listing.description) {
      const description = document.createElement("p");
      description.className = "ar-popup-description";
      description.textContent = listing.description;
      contentDiv.appendChild(description);
    }

    if (listing.address?.trim()) {
      const addressEl = document.createElement("div");
      addressEl.className = "ar-popup-address";
      addressEl.textContent = listing.address.trim();
      contentDiv.appendChild(addressEl);
    }

    const meta = document.createElement("div");
    meta.className = "ar-popup-meta";
    meta.textContent = `${Array.isArray(listing.category) ? listing.category.join(" \u00B7 ") : listing.category || ""} \u00B7 ${listing.city || ""}${
      listing.state ? ", " + listing.state : ""
    }`;
    contentDiv.appendChild(meta);

    if (listing.practices && listing.practices.length > 0) {
      const practicesContainer = document.createElement("div");
      practicesContainer.className = "ar-popup-practices";
      listing.practices.forEach((practice) => {
        const tag = document.createElement("span");
        tag.className = "ar-popup-practice-tag";
        tag.textContent = practice;
        practicesContainer.appendChild(tag);
      });
      contentDiv.appendChild(practicesContainer);
    }

    if (listing.website) {
      const link = document.createElement("a");
      link.className = "ar-popup-link";
      link.href = listing.website.startsWith("http")
        ? listing.website
        : `https://${listing.website}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Visit website";
      contentDiv.appendChild(link);
    }

    let destination = "";
    if (listing.address?.trim()) {
      const parts = [listing.address.trim(), listing.city, listing.state]
        .filter(Boolean)
        .join(", ");
      destination = encodeURIComponent(parts);
    } else if (listing.city && listing.state) {
      destination = encodeURIComponent(`${listing.city}, ${listing.state}`);
    } else {
      destination = `${listing.lat},${listing.lng}`;
    }

    const directionsLink = document.createElement("a");
    directionsLink.className = "ar-popup-link";
    directionsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    directionsLink.target = "_blank";
    directionsLink.rel = "noopener noreferrer";
    directionsLink.textContent = "Get directions →";
    contentDiv.appendChild(directionsLink);

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "ar-popup-action";
    editButton.textContent = "Suggest an edit";
    editButton.addEventListener("click", () => {
      window.open(`/edit/${listing.id}`, "_blank");
    });
    contentDiv.appendChild(editButton);

    const flagButton = document.createElement("button");
    flagButton.type = "button";
    flagButton.className = "ar-popup-action";
    flagButton.textContent = "Flag this listing";
    flagButton.addEventListener("click", () => {
      openFlagModal(listing.id);
    });
    contentDiv.appendChild(flagButton);

    const popup = new mapboxgl.Popup({
      offset: 18,
      closeButton: false,
      closeOnClick: true,
    })
      .setLngLat([listing.lng, listing.lat])
      .setDOMContent(popupNode)
      .addTo(map);

    popup.on("close", () => {
      // Clear selection so the same listing can be re-clicked
      onSelectRef.current("", undefined);
    });

    popupRef.current = popup;
  }, [selectedId, listings]);

  return (
    <>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      {flagListingId ? (
        <div
          onClick={closeFlagModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(8, 25, 45, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 560,
              borderRadius: 24,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(245, 250, 255, 0.98)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.20)",
              padding: 24,
              color: "#1e2a38",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                lineHeight: 1.2,
                marginBottom: 12,
              }}
            >
              Flag this listing
            </div>

            <div
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "#4a5a70",
                marginBottom: 18,
              }}
            >
              <strong>This map is community-kept.</strong>
              <br />
              If something about this listing is incorrect, inactive, misleading,
              or doesn&apos;t belong here, please let us know why.
            </div>

            <div
              style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}
            >
              Choose a reason
            </div>

            <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
              {FLAG_REASON_OPTIONS.map((option) => {
                const selected = flagReason === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setFlagReason(option);
                      setFlagError("");
                    }}
                    style={{
                      textAlign: "left",
                      borderRadius: 16,
                      border: selected
                        ? "1px solid rgba(14,58,102,0.28)"
                        : "1px solid rgba(0,0,0,0.10)",
                      background: selected
                        ? "rgba(14,58,102,0.10)"
                        : "white",
                      color: "#1e2a38",
                      padding: "12px 14px",
                      fontSize: 14,
                      lineHeight: 1.4,
                      cursor: "pointer",
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Tell us what needs attention
            </div>

            <textarea
              value={flagDetails}
              onChange={(e) => setFlagDetails(e.target.value)}
              placeholder="Please add a brief note."
              rows={4}
              style={{
                width: "100%",
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.10)",
                background: "white",
                color: "#1e2a38",
                padding: "12px 14px",
                fontSize: 14,
                lineHeight: 1.5,
                resize: "vertical",
                outline: "none",
                marginBottom: 14,
              }}
            />

            {flagError ? (
              <div
                style={{
                  marginBottom: 14,
                  borderRadius: 14,
                  border: "1px solid rgba(190, 24, 93, 0.18)",
                  background: "rgba(255, 241, 242, 0.95)",
                  color: "#b42318",
                  padding: "10px 12px",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {flagError}
              </div>
            ) : null}

            {flagSuccess ? (
              <div
                style={{
                  marginBottom: 14,
                  borderRadius: 14,
                  border: "1px solid rgba(16, 185, 129, 0.18)",
                  background: "rgba(236, 253, 245, 0.96)",
                  color: "#047857",
                  padding: "10px 12px",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {flagSuccess}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={closeFlagModal}
                disabled={isFlagSubmitting}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: "white",
                  color: "#0e3a66",
                  padding: "11px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: isFlagSubmitting ? "not-allowed" : "pointer",
                  opacity: isFlagSubmitting ? 0.6 : 1,
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmitFlag}
                disabled={isFlagSubmitting}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: "#0e3a66",
                  color: "white",
                  padding: "11px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: isFlagSubmitting ? "not-allowed" : "pointer",
                  opacity: isFlagSubmitting ? 0.7 : 1,
                }}
              >
                {isFlagSubmitting ? "Submitting..." : "Submit flag"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
