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
  onSelect: (id: string) => void;
  onRegionChange?: (region: Region) => void;
  highlightCounty?: string;
  highlightState?: string;
};

const FLAG_REASON_OPTIONS = [
  "Incorrect information",
  "Closed or no longer active",
  "Promotional / spam",
  "Misleading category or description",
  "Harmful or inappropriate",
  "Other",
];

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
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const popupImageRootRef = useRef<Root | null>(null);

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
        headers: {
          "Content-Type": "application/json",
        },
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
        window.setTimeout(() => {
          window.location.reload();
        }, 1200);
        return;
      }

      setFlagSuccess(
        typeof count === "number"
          ? `Flag received. Current flag count: ${count}.`
          : "Flag received."
      );

      window.setTimeout(() => {
        closeFlagModal();
      }, 1000);
    } catch (error) {
      setFlagError(
        error instanceof Error ? error.message : "Failed to flag listing."
      );
    } finally {
      setIsFlagSubmitting(false);
    }
  }

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

      .mapboxgl-popup-content {
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        border-radius: 20px !important;
      }

      .mapboxgl-popup-tip {
        display: none !important;
      }

      .mapboxgl-popup-close-button {
        color: rgba(255,216,107,0.7) !important;
        font-size: 22px !important;
        line-height: 1 !important;
        width: 44px !important;
        height: 44px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
        top: 4px !important;
        right: 4px !important;
        border-radius: 50% !important;
        background: transparent !important;
        z-index: 2 !important;
      }

      .mapboxgl-popup-close-button:hover {
        color: #FFD86B !important;
        background: rgba(255,216,107,0.1) !important;
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
        overflow: hidden;
      }

      .ar-popup-stars {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 0;
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
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-98.5795, 39.8283],
      zoom: 4,
    });

    mapRef.current = map;

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
      popupRef.current?.remove();
      if (popupImageRootRef.current) {
        const r = popupImageRootRef.current;
        popupImageRootRef.current = null;
        queueMicrotask(() => r.unmount());
      }
      map.remove();
      mapRef.current = null;
    };
  }, [onRegionChange]);

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

      if (selectedId === listing.id) {
        markerEl.classList.add("ar-marker--selected");
      }

      const inCounty =
        highlightCounty &&
        listing.county &&
        norm(listing.county) === norm(highlightCounty) &&
        (!highlightState || norm(listing.state) === norm(highlightState));

      if (inCounty) {
        markerEl.classList.add("ar-marker--in-county");
      }

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

    if (!selectedId && listings.length > 0 && isFiltered) {
      const bounds = new mapboxgl.LngLatBounds();
      listings.forEach((l) => bounds.extend({ lng: l.lng, lat: l.lat }));
      map.fitBounds(bounds, { padding: 70, duration: 650, maxZoom: 9 });
    }
  }, [listings, onSelect, selectedId, highlightCounty, highlightState, isFiltered]);

  useEffect(() => {
    markersRef.current.forEach((marker, idx) => {
      const el = marker.getElement();
      const listing = listings[idx];
      if (!el || !listing) return;

      if (selectedId === listing.id) el.classList.add("ar-marker--selected");
      else el.classList.remove("ar-marker--selected");

      const inCounty =
        highlightCounty &&
        listing.county &&
        norm(listing.county) === norm(highlightCounty) &&
        (!highlightState || norm(listing.state) === norm(highlightState));

      if (inCounty) el.classList.add("ar-marker--in-county");
      else el.classList.remove("ar-marker--in-county");
    });
  }, [selectedId, listings, highlightCounty, highlightState]);

  // Return to national view when filters clear back to "All"
  useEffect(() => {
    if (!isFiltered && mapRef.current) {
      mapRef.current.flyTo({
        center: [-98.5795, 39.8283],
        zoom: 4,
        duration: 900,
      });
    }
  }, [isFiltered]);

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

    // Unmount any existing image tile root before building a new popup
    if (popupImageRootRef.current) {
      const prevRoot = popupImageRootRef.current;
      popupImageRootRef.current = null;
      queueMicrotask(() => prevRoot.unmount());
    }

    const popupNode = document.createElement("div");
    popupNode.className = "ar-popup";

    // Background star field
    const starsDiv = document.createElement("div");
    starsDiv.className = "ar-popup-stars";
    const starPositions = [
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
    ];
    starPositions.forEach((s) => {
      const star = document.createElement("span");
      star.style.cssText = `position:absolute;left:${s.left};top:${s.top};width:${s.size}px;height:${s.size}px;border-radius:50%;background:rgba(255,244,200,0.85);box-shadow:0 0 ${s.size * 2}px rgba(255,216,107,0.5);pointer-events:none;`;
      starsDiv.appendChild(star);
    });
    popupNode.appendChild(starsDiv);

    // Content wrapper (sits above the stars via z-index)
    const contentDiv = document.createElement("div");
    contentDiv.className = "ar-popup-content";
    popupNode.appendChild(contentDiv);

    // Image tile — mounted as a React root inside the popup DOM
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

    const description = document.createElement("p");
    description.className = "ar-popup-description";
    description.textContent = listing.description || "";

    contentDiv.appendChild(title);

    if (listing.description) {
      contentDiv.appendChild(description);
    }

    // Street address (when present)
    if (listing.address && listing.address.trim()) {
      const addressEl = document.createElement("div");
      addressEl.className = "ar-popup-address";
      addressEl.textContent = listing.address.trim();
      contentDiv.appendChild(addressEl);
    }

    // Category + location meta line
    const meta = document.createElement("div");
    meta.className = "ar-popup-meta";
    meta.textContent = `${listing.category || ""} · ${listing.city || ""}${
      listing.state ? ", " + listing.state : ""
    }`;
    contentDiv.appendChild(meta);

    // Practices tags
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

    // Get directions link
    let destination = "";
    if (listing.address && listing.address.trim()) {
      const parts = [listing.address.trim(), listing.city, listing.state]
        .filter(Boolean)
        .join(", ");
      destination = encodeURIComponent(parts);
    } else if (listing.city && listing.state) {
      destination = encodeURIComponent(
        `${listing.city}, ${listing.state}`
      );
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

    popupRef.current = new mapboxgl.Popup({
      offset: 18,
      closeButton: true,
      closeOnClick: true,
    })
      .setLngLat([listing.lng, listing.lat])
      .setDOMContent(popupNode)
      .addTo(map);
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
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Choose a reason
            </div>

            <div
              style={{
                display: "grid",
                gap: 10,
                marginBottom: 20,
              }}
            >
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

       <div
  style={{
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
  }}
>
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