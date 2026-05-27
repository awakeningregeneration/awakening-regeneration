"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import MapClient from "@/app/components/MapClient";
import { normalizeState as normalizeStateStr, normalizeCounty as normalizeCountyStr } from "@/app/lib/normalize";
import ListingImageTile from "../components/ListingImageTile";
import ElementalSeat from "../components/ElementalSeat";
import { getListingImage } from "../../lib/getListingImage";
import { useIsMobile } from "../lib/useIsMobile";
import { californiaCounties } from "@/data/californiaCounties";
import { allCounties } from "@/data/allCounties";
import type { Listing } from "@/types/listing";

type OnlineResource = {
  id: string | number;
  name: string;
  description: string | null;
  url: string | null;
  logo_url: string | null;
  category: string | null;
  practices: string[] | null;
  affiliate_url: string | null;
  slug: string | null;
};

const sidebarLights = [
  { left: "8%", top: "4%", size: 7, opacity: 0.55 },
  { left: "88%", top: "7%", size: 9, opacity: 0.6 },
  { left: "15%", top: "18%", size: 5, opacity: 0.45 },
  { left: "80%", top: "22%", size: 7, opacity: 0.5 },
  { left: "5%", top: "42%", size: 9, opacity: 0.6 },
  { left: "92%", top: "48%", size: 5, opacity: 0.45 },
  { left: "20%", top: "65%", size: 7, opacity: 0.5 },
  { left: "75%", top: "72%", size: 9, opacity: 0.55 },
  { left: "10%", top: "85%", size: 5, opacity: 0.48 },
  { left: "85%", top: "90%", size: 7, opacity: 0.52 },
];

const STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "District of Columbia",
];

type PropsRegion = { state?: string; county?: string };

export default function MapPage() {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedCounty, setSelectedCounty] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState<PropsRegion>({});
  const [storyCount, setStoryCount] = useState<number>(0);
  const [countySearchQuery, setCountySearchQuery] = useState("");
  const [onlineResources, setOnlineResources] = useState<OnlineResource[]>([]);
  const [synonymsCache, setSynonymsCache] = useState<string[]>([]);
  const searchLogTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<"browse" | "map">("browse");
  const swipeStartY = useRef<number>(0);

  // Auto-switch to map view when a listing is tapped on mobile
  useEffect(() => {
    if (isMobile && selectedId) {
      setMobileView("map");
    }
  }, [selectedId, isMobile]);

  // Reset to browse view when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileView("browse");
    }
  }, [isMobile]);

  const searchParams = useSearchParams();
  const router = useRouter();

  /** Push current region selection into the URL (without adding history) */
  function updateMapUrl(state: string, county: string) {
    const params = new URLSearchParams();
    if (state && state !== "All") params.set("state", state);
    if (county && county !== "All") params.set("county", county);
    const qs = params.toString();
    router.replace(qs ? `/map?${qs}` : "/map", { scroll: false });
  }

  /** Called when a map pin is clicked — re-anchors county/state to match the listing */
  const handlePinSelect = useCallback(
    (id: string, context?: { county?: string; state?: string }) => {
      setSelectedId(id);

      if (!context?.state) return;

      const pinState = context.state;
      const pinCounty = context.county
        ? context.county.replace(/\s+County$/i, "").trim()
        : "";

      const stateChanged = pinState !== selectedState;
      const countyChanged = pinCounty
        ? pinCounty.toLowerCase() !== selectedCounty.toLowerCase()
        : selectedCounty !== "All";

      if (stateChanged || countyChanged) {
        setSelectedState(pinState);
        setSelectedCounty(pinCounty || "All");

        const params = new URLSearchParams();
        params.set("state", pinState);
        if (pinCounty) params.set("county", pinCounty);
        router.push(`/map?${params.toString()}`, { scroll: false });
      }
    },
    [selectedState, selectedCounty, router]
  );

  useEffect(() => {
    async function loadListings() {
      const res = await fetch("/api/listings");
      const data = await res.json();

      const normalized = (Array.isArray(data) ? data : []).map((item) => ({
        ...item,
        name: item.name ?? item.title ?? "Untitled",
      }));

      setAllListings(normalized);
    }

    async function loadOnlineResources() {
      try {
        const res = await fetch("/api/affiliates");
        if (res.ok) {
          setOnlineResources(await res.json());
        }
      } catch {
        // quiet fail — online resources are supplementary
      }
    }

    void loadListings();
    void loadOnlineResources();
  }, []);

  // Clear search when county changes
  useEffect(() => {
    setCountySearchQuery("");
  }, [selectedCounty]);

  // Fetch synonyms when search query changes (debounced)
  useEffect(() => {
    const term = countySearchQuery.trim().toLowerCase();
    if (!term) {
      setSynonymsCache([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/synonyms?term=${encodeURIComponent(term)}`);
        const syns = res.ok ? await res.json() : [];
        setSynonymsCache(syns);
      } catch {
        setSynonymsCache([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [countySearchQuery]);

  useEffect(() => {
    const stateFromUrl = searchParams.get("state");
    const countyFromUrl = searchParams.get("county");

    if (stateFromUrl) {
      setSelectedState(stateFromUrl);
    }

    if (countyFromUrl) {
      setSelectedCounty(countyFromUrl);
    } else if (stateFromUrl) {
      setSelectedCounty("All");
    }

    if (stateFromUrl || countyFromUrl) {
      setSelectedId(null);
    }
  }, [searchParams]);

  const states = useMemo(() => {
    return ["All", ...STATES];
  }, []);

const counties = useMemo(() => {
  if (selectedState === "All") return ["All"];

  if (selectedState === "California") {
    return ["All", ...californiaCounties];
  }

  return ["All", ...(allCounties[selectedState] ?? [])];
}, [selectedState]);

  const hasStateSelection = selectedState !== "All";
  const hasCountySelection = selectedCounty !== "All";

  const effectiveState = hasStateSelection ? selectedState : "";
  const effectiveCounty = hasCountySelection ? selectedCounty : "";

  const stateListings = useMemo(() => {
    if (!effectiveState) return [];

    const target = normalizeStateStr(effectiveState);
    return allListings.filter(
      (l) =>
        !!l.state && normalizeStateStr(l.state) === target
    );
  }, [allListings, effectiveState]);

const countyListings = useMemo(() => {
  if (!effectiveState || !effectiveCounty) return [];

  const targetState = normalizeStateStr(effectiveState);
  const targetCounty = normalizeCountyStr(effectiveCounty);

  return allListings
    .filter((l) => {
      const stateOk =
        !!l.state && normalizeStateStr(l.state) === targetState;

      const countyOk =
        !!l.county &&
        normalizeCountyStr(l.county) === targetCounty;

      return stateOk && countyOk;
    })
    .sort((a, b) =>
      (a.name ?? a.title ?? "").localeCompare(b.name ?? b.title ?? "")
    );
}, [allListings, effectiveState, effectiveCounty]);

  const mapListings = useMemo(() => {
    if (hasCountySelection) return countyListings;
    if (hasStateSelection) return stateListings;
    return allListings;
  }, [
    allListings,
    stateListings,
    countyListings,
    hasStateSelection,
    hasCountySelection,
  ]);
  useEffect(() => {
    if (!selectedId) return;

    const visibleIds = new Set(mapListings.map((l) => l.id));
    if (!visibleIds.has(selectedId)) {
      setSelectedId(null);
    }
  }, [mapListings, selectedId]);

  // ── County search derivation ──

  function buildHaystack(l: Listing): string {
    return [
      l.name,
      l.title ?? "",
      l.description ?? "",
      ...(Array.isArray(l.category) ? l.category : [l.category ?? ""]),
      ...(l.practices ?? []),
      l.focus ?? "",
      l.invitation ?? "",
      l.address ?? "",
      l.city ?? "",
    ]
      .join(" ")
      .toLowerCase();
  }

  const searchTerm = countySearchQuery.trim().toLowerCase();
  const isSearching = searchTerm.length > 0;

  const directHits = useMemo(() => {
    if (!isSearching) return [];
    return countyListings.filter((l) => buildHaystack(l).includes(searchTerm));
  }, [countyListings, searchTerm, isSearching]);

  const directHitIds = useMemo(
    () => new Set(directHits.map((l) => l.id)),
    [directHits]
  );

  const relatedNearby = useMemo(() => {
    if (!isSearching || synonymsCache.length === 0) return [];
    return countyListings.filter((l) => {
      if (directHitIds.has(l.id)) return false;
      const hay = buildHaystack(l);
      return synonymsCache.some((syn) => hay.includes(syn));
    });
  }, [countyListings, isSearching, synonymsCache, directHitIds]);

  const onlineHits = useMemo(() => {
    if (!isSearching) return [];
    return onlineResources.filter((r) => {
      const hay = [
        r.name ?? "",
        r.description ?? "",
        ...(Array.isArray(r.category) ? r.category : [r.category ?? ""]),
        ...(r.practices ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(searchTerm);
    });
  }, [onlineResources, searchTerm, isSearching]);

  // Fire-and-forget search log (debounced 1s after typing stops)
  useEffect(() => {
    if (!isSearching) return;
    if (searchLogTimer.current) clearTimeout(searchLogTimer.current);

    searchLogTimer.current = setTimeout(() => {
      fetch("/api/search-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search_term: searchTerm,
          county: effectiveCounty || null,
          state: effectiveState || null,
          direct_hit_count: directHits.length,
          related_count: relatedNearby.length,
          online_count: onlineHits.length,
        }),
      }).catch(() => {});
    }, 1000);

    return () => {
      if (searchLogTimer.current) clearTimeout(searchLogTimer.current);
    };
  }, [searchTerm, isSearching, effectiveCounty, effectiveState, directHits.length, relatedNearby.length, onlineHits.length]);

  useEffect(() => {
    async function loadStories() {
      if (!hasCountySelection || !effectiveState || !effectiveCounty) {
        setStoryCount(0);
        return;
      }

      const params = new URLSearchParams();
      params.set("state", effectiveState);
      params.set("county", effectiveCounty);

      try {
        const res = await fetch(`/api/stories?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch stories");

        const data = await res.json();
        setStoryCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Failed to load story count:", error);
        setStoryCount(0);
      }
    }

    void loadStories();
  }, [hasCountySelection, effectiveState, effectiveCounty]);

  const submitListingHref = useMemo(() => {
    const params = new URLSearchParams();
    if (effectiveState) params.set("state", effectiveState);
    if (effectiveCounty) params.set("county", effectiveCounty);
    const qs = params.toString();
    return qs ? `/submit?${qs}` : "/submit";
  }, [effectiveState, effectiveCounty]);

  const storiesViewHref = useMemo(() => {
    const params = new URLSearchParams();
    if (effectiveState) params.set("state", effectiveState);
    if (effectiveCounty) params.set("county", effectiveCounty);
    const qs = params.toString();
    return qs ? `/stories?${qs}` : "/stories";
  }, [effectiveState, effectiveCounty]);

  const countyLightCount = countyListings.length;

  const liveRegionLabel =
    mapRegion.county && mapRegion.state
      ? `${
          mapRegion.county.includes("County")
            ? mapRegion.county
            : `${mapRegion.county} County`
        }, ${mapRegion.state}`
      : mapRegion.state || "";

  return (
    <main
      style={{
        display: isMobile ? undefined : "flex",
        height: "100vh",
        width: "100%",
        position: isMobile ? "relative" : undefined,
        overflow: isMobile ? "hidden" : undefined,
      }}
    >
      {/* Sidebar / Browse view */}
      <div
        style={{
          padding: 16,
          overflowY: "auto",
          color: "rgba(211,227,247,0.85)",
          background:
            "linear-gradient(160deg, rgba(12,52,110,0.78) 0%, rgba(17,65,130,0.82) 50%, rgba(12,52,110,0.78) 100%)",
          backdropFilter: "blur(12px)",
          ...(isMobile
            ? {
                position: "absolute" as const,
                inset: 0,
                zIndex: mobileView === "browse" ? 2 : 0,
                transform:
                  mobileView === "browse"
                    ? "translateX(0)"
                    : "translateX(-100%)",
                opacity: mobileView === "browse" ? 1 : 0,
                transition:
                  "transform 300ms ease, opacity 300ms ease",
              }
            : {
                width: "380px",
                position: "relative" as const,
                boxShadow: "2px 0 24px rgba(8,25,45,0.13)",
                borderTop: "3px solid rgba(255,216,107,0.6)",
              }),
        }}
      >
        {/* Sidebar emission light field */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {sidebarLights.map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: "rgba(255,210,80,0.82)",
                opacity: p.opacity,
                boxShadow: `0 0 ${p.size * 3}px ${
                  p.size
                }px rgba(255,200,60,0.45), 0 0 ${p.size * 6}px ${
                  p.size * 2
                }px rgba(255,170,40,0.2)`,
                pointerEvents: "none",
              }}
            />
          ))}
        </div>

        <section
          style={{
            position: "relative",
            zIndex: 1,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 14,
            border: "1px solid rgba(255,216,107,0.2)",
            borderLeft: "3px solid rgba(255,216,107,0.5)",
            padding: 16,
            marginBottom: 12,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(211,227,247,0.7)",
              marginBottom: 10,
            }}
          >
            Region
          </div>

          <label
            style={{
              display: "block",
              fontSize: 12,
              marginBottom: 6,
              color: "rgba(211,227,247,0.8)",
              opacity: hasStateSelection ? 0.85 : 0.45,
            }}
          >
            County
          </label>

          <select
            value={selectedCounty}
            disabled={!hasStateSelection}
            onChange={(e) => {
              const newCounty = e.target.value;
              setSelectedCounty(newCounty);
              setSelectedId(null);
              updateMapUrl(selectedState, newCounty);
            }}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid rgba(148,196,236,0.3)",
              background: "rgba(255,255,255,0.1)",
              color: "#e8f4ff",
              fontSize: 14,
              outlineColor: "rgba(255,216,107,0.6)",
              cursor: "pointer",
              opacity: hasStateSelection ? 1 : 0.65,
              marginBottom: 10,
            }}
          >
            {counties.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label
            style={{
              display: "block",
              fontSize: 12,
              marginBottom: 6,
              color: "rgba(211,227,247,0.8)",
              opacity: 0.85,
            }}
          >
            State
          </label>

          <select
            value={selectedState}
            onChange={(e) => {
              const newState = e.target.value;
              setSelectedState(newState);
              setSelectedCounty("All");
              setSelectedId(null);
              updateMapUrl(newState, "All");
            }}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid rgba(148,196,236,0.3)",
              background: "rgba(255,255,255,0.1)",
              color: "#e8f4ff",
              fontSize: 14,
              outlineColor: "rgba(255,216,107,0.6)",
              cursor: "pointer",
            }}
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </section>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: "transparent",
          }}
        >
          {!hasStateSelection ? (
            <>
              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1.35,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                A field of visible lights
              </div>

              <div style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.95 }}>
                You’re viewing the broader map. Choose a state to focus what’s
                visible there, then narrow further by county if you want to land
                in a specific place.
              </div>

              <div
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  lineHeight: 1.5,
                  opacity: 0.92,
                }}
              >
                {allListings.length} light
                {allListings.length === 1 ? "" : "s"} visible across the map.
              </div>

              {liveRegionLabel ? (
                <div
                  style={{
                    marginTop: 12,
                    padding: 10,
                    border: "1px solid rgba(255,216,107,0.15)",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    fontSize: 13,
                    lineHeight: 1.5,
                    opacity: 0.95,
                  }}
                >
                  Map center is currently over <strong>{liveRegionLabel}</strong>.
                </div>
              ) : null}

              <div
                style={{
                  marginTop: 14,
                  padding: 10,
                  border: "1px solid rgba(255,216,107,0.15)",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Want to add something?
                </div>

                <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.95 }}>
                  Choose a place first to ground the listing in a specific
                  region, or add a light directly and let the map place it.
                </div>
<div
  style={{
    marginTop: 10,
    padding: 10,
    border: "1px solid rgba(255,216,107,0.15)",
    borderRadius: 10,
    background: "rgba(255,255,255,0.04)",
    fontSize: 13,
    lineHeight: 1.5,
    opacity: 0.95,
  }}
>
  <Link
    href="/about"
    style={{
      textDecoration: "underline",
      textUnderlineOffset: 3,
      fontWeight: 600,
      color: "#FFD86B",
    }}
  >
    About Canary Commons
  </Link>
</div>
                <div style={{ marginTop: 8 }}>
                  <Link
                    href="/submit"
                    style={{
                      display: "block",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                      fontWeight: 600,
                      color: "#FFD86B",
                      fontSize: 13,
                    }}
                  >
                    Add a point of light
                  </Link>
                </div>
              </div>
            </>
          ) : hasStateSelection && !hasCountySelection ? (
            <>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  lineHeight: 1.55,
                  opacity: 0.95,
                }}
              >
                Pan around the state, or choose a county to focus more closely.
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                  {/* About Canary Commons — dawn wash */}
                  <Link
                    href="/about"
                    style={{
                      display: "block",
                      padding: "9px 14px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,216,107,0.2)",
                      textDecoration: "none",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        zIndex: 0,
                        background:
                          "linear-gradient(to top right, rgba(255,190,110,0.22) 0%, rgba(255,200,130,0.08) 55%, transparent 75%)",
                      }}
                    />
                    <span style={{ position: "relative", zIndex: 1, color: "#FFD86B", fontSize: 13, fontWeight: 600 }}>
                      About Canary Commons
                    </span>
                  </Link>

                  {/* Add a Point of Light — single glow point */}
                  <Link
                    href={submitListingHref}
                    style={{
                      display: "block",
                      padding: "9px 14px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,216,107,0.2)",
                      textDecoration: "none",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: "30%",
                        right: "20%",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#FFD86B",
                        boxShadow: "0 0 14px 6px rgba(255,216,107,0.45), 0 0 28px 12px rgba(255,216,107,0.15)",
                        pointerEvents: "none",
                        zIndex: 0,
                      }}
                    />
                    <span style={{ position: "relative", zIndex: 1, color: "#FFD86B", fontSize: 13, fontWeight: 600 }}>
                      Add a Point of Light
                    </span>
                  </Link>

                  {/* Explore Online Resources — bottom-edge warmth */}
                  <Link
                    href="/support"
                    style={{
                      display: "block",
                      padding: "9px 14px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,216,107,0.2)",
                      textDecoration: "none",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "65%",
                        pointerEvents: "none",
                        zIndex: 0,
                        background:
                          "linear-gradient(to top, rgba(255,190,110,0.28) 0%, rgba(255,200,130,0.1) 45%, transparent 100%)",
                      }}
                    />
                    <span style={{ position: "relative", zIndex: 1, color: "#FFD86B", fontSize: 13, fontWeight: 600 }}>
                      Explore Online Resources
                    </span>
                  </Link>

                  {/* The Constellation — starry pill */}
                  <Link
                    href="/constellation"
                    style={{
                      display: "block",
                      padding: "9px 14px",
                      borderRadius: 12,
                      background:
                        "radial-gradient(circle at 40% 40%, rgba(17,41,82,0.97) 0%, rgba(8,25,45,0.99) 100%)",
                      border: "1px solid rgba(255,216,107,0.2)",
                      textDecoration: "none",
                      textAlign: "center",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* Star field */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        zIndex: 0,
                        overflow: "hidden",
                      }}
                    >
                      {[
                        { left: "8%", top: "20%", size: 2 },
                        { left: "18%", top: "70%", size: 1.5 },
                        { left: "30%", top: "15%", size: 3 },
                        { left: "45%", top: "80%", size: 1.5 },
                        { left: "55%", top: "25%", size: 2 },
                        { left: "65%", top: "65%", size: 3 },
                        { left: "72%", top: "10%", size: 1.5 },
                        { left: "80%", top: "75%", size: 2 },
                        { left: "88%", top: "35%", size: 2.5 },
                        { left: "25%", top: "45%", size: 1.5 },
                        { left: "50%", top: "50%", size: 2 },
                        { left: "92%", top: "60%", size: 1.5 },
                      ].map((star, si) => (
                        <span
                          key={si}
                          style={{
                            position: "absolute",
                            left: star.left,
                            top: star.top,
                            width: star.size,
                            height: star.size,
                            borderRadius: "50%",
                            background: "rgba(255,244,200,0.9)",
                            boxShadow: `0 0 ${star.size * 3}px rgba(255,216,107,0.6)`,
                          }}
                        />
                      ))}
                    </div>
                    {/* Text */}
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div
                        style={{
                          color: "#FFD86B",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        The Constellation
                      </div>
                      <div
                        style={{
                          color: "rgba(255,216,107,0.65)",
                          fontSize: 11,
                          fontWeight: 400,
                          marginTop: 1,
                        }}
                      >
                        A World of Inspiration
                      </div>
                    </div>
                  </Link>
              </div>
            </>
          ) : (
            <>
              {/* County search input */}
              <input
                type="text"
                placeholder="Search this county..."
                value={countySearchQuery}
                onChange={(e) => setCountySearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.11)",
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  fontSize: "0.95rem",
                  outline: "none",
                  marginBottom: 12,
                }}
              />

              {isSearching ? (
                <>
                  {/* Direct Hits */}
                  {directHits.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFD86B", marginBottom: 8 }}>
                        Direct Hits
                      </div>
                      {directHits.map((listing) => {
                        const isSelected = selectedId === listing.id;
                        const locationParts = [listing.city, listing.state].filter(Boolean) as string[];
                        const imageUrl = getListingImage(listing.image_url, listing.website);
                        return (
                          <div
                            key={listing.id}
                            onClick={() => setSelectedId(listing.id)}
                            style={{
                              padding: 12, marginBottom: 8, borderRadius: 10, cursor: "pointer",
                              border: isSelected ? "2px solid rgba(255,216,107,0.6)" : "1px solid rgba(255,255,255,0.12)",
                              background: isSelected ? "rgba(255,216,107,0.2)" : "rgba(224,240,255,0.14)",
                              display: "flex", gap: 10, alignItems: "center", transition: "all 0.15s ease",
                              boxShadow: isSelected ? "0 2px 12px rgba(255,216,107,0.2)" : "0 1px 4px rgba(8,25,45,0.06)",
                            }}
                          >
                            <ListingImageTile imageUrl={imageUrl} name={listing.name} size="sm" />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, color: "#e8f4ff", fontSize: 15 }}>{listing.name}</div>
                              <div style={{ fontSize: 12, color: "rgba(148,196,236,0.8)", marginTop: 2 }}>{locationParts.join(", ") || effectiveState}</div>
                            </div>
                            <ElementalSeat element="spirit" size="sm" />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Related Nearby */}
                  {relatedNearby.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFD86B", marginBottom: 8 }}>
                        Related Nearby
                      </div>
                      {relatedNearby.map((listing) => {
                        const isSelected = selectedId === listing.id;
                        const locationParts = [listing.city, listing.state].filter(Boolean) as string[];
                        const imageUrl = getListingImage(listing.image_url, listing.website);
                        return (
                          <div
                            key={listing.id}
                            onClick={() => setSelectedId(listing.id)}
                            style={{
                              padding: 12, marginBottom: 8, borderRadius: 10, cursor: "pointer",
                              border: isSelected ? "2px solid rgba(255,216,107,0.6)" : "1px solid rgba(255,255,255,0.12)",
                              background: isSelected ? "rgba(255,216,107,0.2)" : "rgba(224,240,255,0.14)",
                              display: "flex", gap: 10, alignItems: "center", transition: "all 0.15s ease",
                              boxShadow: isSelected ? "0 2px 12px rgba(255,216,107,0.2)" : "0 1px 4px rgba(8,25,45,0.06)",
                            }}
                          >
                            <ListingImageTile imageUrl={imageUrl} name={listing.name} size="sm" />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, color: "#e8f4ff", fontSize: 15 }}>{listing.name}</div>
                              <div style={{ fontSize: 12, color: "rgba(148,196,236,0.8)", marginTop: 2 }}>{locationParts.join(", ") || effectiveState}</div>
                            </div>
                            <ElementalSeat element="spirit" size="sm" />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Online Resources */}
                  {onlineHits.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFD86B", marginBottom: 8 }}>
                        Online Resources
                      </div>
                      {onlineHits.map((r) => (
                        <a
                          key={String(r.id)}
                          href={r.slug ? `/resource/${r.slug}` : r.affiliate_url || r.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "block", padding: 12, marginBottom: 8, borderRadius: 10, cursor: "pointer",
                            border: "1px solid rgba(255,255,255,0.12)", background: "rgba(224,240,255,0.14)",
                            textDecoration: "none", color: "inherit", transition: "all 0.15s ease",
                          }}
                        >
                          <div style={{ fontWeight: 600, color: "#e8f4ff", fontSize: 14 }}>{r.name}</div>
                          {r.description && (
                            <div style={{ fontSize: 12, color: "rgba(148,196,236,0.75)", marginTop: 4, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {r.description}
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Empty state */}
                  {directHits.length === 0 && relatedNearby.length === 0 && onlineHits.length === 0 && (
                    <div style={{ textAlign: "center", padding: "20px 12px" }}>
                      <div style={{ fontSize: 14, color: "rgba(211,227,247,0.82)", lineHeight: 1.6, marginBottom: 14 }}>
                        Nothing here matches that — yet.
                        <br />
                        If you know of something that should be on this map, you&apos;re invited to add it.
                      </div>
                      <Link
                        href={submitListingHref}
                        style={{
                          display: "inline-block", padding: "10px 20px", borderRadius: 999,
                          background: "#FFD86B", color: "#1a2a0e", fontWeight: 700, fontSize: 14,
                          textDecoration: "none",
                          boxShadow: "0 0 20px rgba(255,216,107,0.25), 0 4px 14px rgba(255,200,80,0.18)",
                        }}
                      >
                        Add a Point of Light
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Unfiltered county view — existing listing cards */}
                  {countyLightCount > 0 ? (
                    <div style={{ marginTop: 12 }}>
                      {countyListings.map((listing) => {
                        const isSelected = selectedId === listing.id;
                        const locationParts = [listing.city, listing.state].filter(Boolean) as string[];
                        const imageUrl = getListingImage(listing.image_url, listing.website);
                        return (
                          <div
                            key={listing.id}
                            onClick={() => setSelectedId(listing.id)}
                            style={{
                              padding: 12, marginBottom: 8, borderRadius: 10, cursor: "pointer",
                              border: isSelected ? "2px solid rgba(255,216,107,0.6)" : "1px solid rgba(255,255,255,0.12)",
                              background: isSelected ? "rgba(255,216,107,0.2)" : "rgba(224,240,255,0.14)",
                              display: "flex", gap: 10, alignItems: "center", transition: "all 0.15s ease",
                              boxShadow: isSelected ? "0 2px 12px rgba(255,216,107,0.2)" : "0 1px 4px rgba(8,25,45,0.06)",
                            }}
                          >
                            <ListingImageTile imageUrl={imageUrl} name={listing.name} size="sm" />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, color: "#e8f4ff", fontSize: 15 }}>{listing.name}</div>
                              <div style={{ fontSize: 12, color: "rgba(148,196,236,0.8)", marginTop: 2 }}>{locationParts.join(", ") || effectiveState}</div>
                            </div>
                            <ElementalSeat element="spirit" size="sm" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.88 }}>
                      No lights mapped here yet.
                    </div>
                  )}
                </>
              )}

<div
  style={{
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    border: "1px solid rgba(255,216,107,0.4)",
    background:
      "linear-gradient(135deg, rgba(255,248,230,0.8) 0%, rgba(255,237,200,0.6) 100%)",
    transition: "box-shadow 0.2s ease",
    boxShadow: "0 2px 8px rgba(255,216,107,0.08)",
  }}
>
  <div
    style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.12em",
      color: "#b07d2a",
      textTransform: "uppercase",
      marginBottom: 6,
      textAlign: "center",
    }}
  >
    Story of Place
  </div>

  <div
    style={{
      fontSize: 13,
      color: "#5a3e1b",
      lineHeight: 1.5,
      marginBottom: 8,
      textAlign: "center",
    }}
  >
    A place for people to share local stories of what is being built, restored,
    planted, and brought to life here.
  </div>

  <div style={{ textAlign: "center" }}>
    <Link
      href={storiesViewHref}
      style={{
        color: "#b07d2a",
        fontWeight: 600,
        fontSize: 13,
        textDecoration: "underline",
        textUnderlineOffset: 3,
      }}
    >
      See and Share Local Stories
    </Link>
  </div>
</div>

              {/* Action buttons — same as state-level view */}
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                  {/* About Canary Commons — dawn wash */}
                  <Link
                    href="/about"
                    style={{
                      display: "block",
                      padding: "9px 14px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,216,107,0.2)",
                      textDecoration: "none",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        zIndex: 0,
                        background:
                          "linear-gradient(to top right, rgba(255,190,110,0.22) 0%, rgba(255,200,130,0.08) 55%, transparent 75%)",
                      }}
                    />
                    <span style={{ position: "relative", zIndex: 1, color: "#FFD86B", fontSize: 13, fontWeight: 600 }}>
                      About Canary Commons
                    </span>
                  </Link>

                  {/* Add a Point of Light — single glow point */}
                  <Link
                    href={submitListingHref}
                    style={{
                      display: "block",
                      padding: "9px 14px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,216,107,0.2)",
                      textDecoration: "none",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: "30%",
                        right: "20%",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#FFD86B",
                        boxShadow: "0 0 14px 6px rgba(255,216,107,0.45), 0 0 28px 12px rgba(255,216,107,0.15)",
                        pointerEvents: "none",
                        zIndex: 0,
                      }}
                    />
                    <span style={{ position: "relative", zIndex: 1, color: "#FFD86B", fontSize: 13, fontWeight: 600 }}>
                      Add a Point of Light
                    </span>
                  </Link>

                  {/* Explore Online Resources — bottom-edge warmth */}
                  <Link
                    href="/support"
                    style={{
                      display: "block",
                      padding: "9px 14px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,216,107,0.2)",
                      textDecoration: "none",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "65%",
                        pointerEvents: "none",
                        zIndex: 0,
                        background:
                          "linear-gradient(to top, rgba(255,190,110,0.28) 0%, rgba(255,200,130,0.1) 45%, transparent 100%)",
                      }}
                    />
                    <span style={{ position: "relative", zIndex: 1, color: "#FFD86B", fontSize: 13, fontWeight: 600 }}>
                      Explore Online Resources
                    </span>
                  </Link>

                  {/* The Constellation — starry pill */}
                  <Link
                    href="/constellation"
                    style={{
                      display: "block",
                      padding: "9px 14px",
                      borderRadius: 12,
                      background:
                        "radial-gradient(circle at 40% 40%, rgba(17,41,82,0.97) 0%, rgba(8,25,45,0.99) 100%)",
                      border: "1px solid rgba(255,216,107,0.2)",
                      textDecoration: "none",
                      textAlign: "center",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        zIndex: 0,
                        overflow: "hidden",
                      }}
                    >
                      {[
                        { left: "8%", top: "20%", size: 2 },
                        { left: "18%", top: "70%", size: 1.5 },
                        { left: "30%", top: "15%", size: 3 },
                        { left: "45%", top: "80%", size: 1.5 },
                        { left: "55%", top: "25%", size: 2 },
                        { left: "65%", top: "65%", size: 3 },
                        { left: "72%", top: "10%", size: 1.5 },
                        { left: "80%", top: "75%", size: 2 },
                        { left: "88%", top: "35%", size: 2.5 },
                        { left: "25%", top: "45%", size: 1.5 },
                        { left: "50%", top: "50%", size: 2 },
                        { left: "92%", top: "60%", size: 1.5 },
                      ].map((star, si) => (
                        <span
                          key={si}
                          style={{
                            position: "absolute",
                            left: star.left,
                            top: star.top,
                            width: star.size,
                            height: star.size,
                            borderRadius: "50%",
                            background: "rgba(255,244,200,0.9)",
                            boxShadow: `0 0 ${star.size * 3}px rgba(255,216,107,0.6)`,
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div
                        style={{
                          color: "#FFD86B",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        The Constellation
                      </div>
                      <div
                        style={{
                          color: "rgba(255,216,107,0.65)",
                          fontSize: 11,
                          fontWeight: 400,
                          marginTop: 1,
                        }}
                      >
                        A World of Inspiration
                      </div>
                    </div>
                  </Link>
              </div>

              {isMobile && countyLightCount > 0 && (
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(null);
                      setMobileView("map");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "#FFD86B",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}
                  >
                    View on Map →
                  </button>
                </div>
              )}

            </>
          )}
        </div>
      </div>

      {/* Map area */}
      <div
        style={{
          background: "#08192d",
          ...(isMobile
            ? {
                position: "absolute" as const,
                inset: 0,
                zIndex: mobileView === "map" ? 2 : 0,
                transform:
                  mobileView === "map"
                    ? "translateX(0)"
                    : "translateX(100%)",
                opacity: mobileView === "map" ? 1 : 0,
                transition:
                  "transform 300ms ease, opacity 300ms ease",
              }
            : {
                flex: 1,
                position: "relative" as const,
              }),
        }}
        onTouchStart={(e) => {
          if (isMobile && e.touches[0].clientY < 80) {
            swipeStartY.current = e.touches[0].clientY;
          }
        }}
        onTouchEnd={(e) => {
          if (
            isMobile &&
            swipeStartY.current > 0 &&
            e.changedTouches[0].clientY - swipeStartY.current >= 60
          ) {
            setMobileView("browse");
          }
          swipeStartY.current = 0;
        }}
      >
        {/* ← browse tab (mobile map view only) */}
        {isMobile && mobileView === "map" && (
          <button
            type="button"
            onClick={() => setMobileView("browse")}
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 10,
              background: "rgba(8, 25, 45, 0.85)",
              border: "1px solid rgba(255, 216, 107, 0.35)",
              color: "#FFD86B",
              padding: "8px 14px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              backdropFilter: "blur(8px)",
              cursor: "pointer",
            }}
          >
            ← browse
          </button>
        )}

        <MapClient
          listings={mapListings}
          selectedId={selectedId}
          onSelect={handlePinSelect}
          onRegionChange={setMapRegion}
          highlightCounty={hasCountySelection ? effectiveCounty : ""}
          highlightState={hasStateSelection ? effectiveState : ""}
          visible={!isMobile || mobileView === "map"}
        />

      </div>
    </main>
  );
}