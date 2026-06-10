"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import MapClient from "@/app/components/MapClient";
import { normalizeState as normalizeStateStr, normalizeCounty as normalizeCountyStr } from "@/app/lib/normalize";
import ListingCard from "../components/ListingCard";
import RegionSelector from "../components/RegionSelector";
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

  // ── Mobile drawer snap state ──
  type DrawerSnap = "peek" | "mid" | "full";
  const [drawerSnap, setDrawerSnap] = useState<DrawerSnap>("peek");
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startY: number;
    startTranslate: number;
    lastY: number;
    lastTime: number;
  } | null>(null);

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

  // Scroll the selected listing card into view (works in both mobile drawer and desktop sidebar)
  useEffect(() => {
    if (!selectedId) return;
    // Small delay so the DOM has rendered the highlighted card
    const t = setTimeout(() => {
      const el = document.querySelector(`[data-listing-id="${selectedId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
    return () => clearTimeout(t);
  }, [selectedId]);

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

  const mapListings = useMemo(() => {
    if (hasCountySelection) {
      if (isSearching) return [...directHits, ...relatedNearby];
      return countyListings;
    }
    if (hasStateSelection) return stateListings;
    return allListings;
  }, [
    allListings,
    stateListings,
    countyListings,
    hasStateSelection,
    hasCountySelection,
    isSearching,
    directHits,
    relatedNearby,
  ]);

  useEffect(() => {
    if (!selectedId) return;

    const visibleIds = new Set(mapListings.map((l) => l.id));
    if (!visibleIds.has(selectedId)) {
      setSelectedId(null);
    }
  }, [mapListings, selectedId]);

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

  /* ── Sidebar content shared between desktop and mobile drawer ── */
  function renderSidebarContent(opts: { showCountySearch: boolean; showActionButtons: boolean }) {
    return (
    <>
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

          {opts.showActionButtons && (
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
          )}
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

              {opts.showActionButtons && (
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
              )}
            </>
          ) : (
            <>
              {/* County search input */}
              {opts.showCountySearch && (
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
              )}

              {isSearching ? (
                <>
                  {/* Direct Hits */}
                  {directHits.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFD86B", marginBottom: 8 }}>
                        Direct Hits
                      </div>
                      {directHits.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} isSelected={selectedId === listing.id} fallbackLocation={effectiveState} onSelect={setSelectedId} />
                      ))}
                    </div>
                  )}

                  {/* Related Nearby */}
                  {relatedNearby.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFD86B", marginBottom: 8 }}>
                        Related Nearby
                      </div>
                      {relatedNearby.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} isSelected={selectedId === listing.id} fallbackLocation={effectiveState} onSelect={setSelectedId} />
                      ))}
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
                      {countyListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} isSelected={selectedId === listing.id} fallbackLocation={effectiveState} onSelect={setSelectedId} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.88 }}>
                      This county is still waiting for its first light — you could add one.
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
              {opts.showActionButtons && (
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
              )}

            </>
          )}
    </>
    );
  }

  /* ── Mobile: map-first with floating bar + bottom drawer ── */
  if (isMobile) {
    return (
      <main
        style={{
          position: "relative",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Map — full bleed, always visible */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background: "#08192d",
          }}
        >
          <MapClient
            listings={mapListings}
            selectedId={selectedId}
            onSelect={handlePinSelect}
            onRegionChange={setMapRegion}
            highlightCounty={hasCountySelection ? effectiveCounty : ""}
            highlightState={hasStateSelection ? effectiveState : ""}
            visible={true}
            isMobile={true}
          />
        </div>

        {/* Scoped mobile day-mode overrides for RegionSelector dropdowns */}
        <style>{`
          .mobile-day-bar section {
            background: rgba(255,255,255,0.3) !important;
            border-color: rgba(120,100,60,0.2) !important;
            border-left-color: rgba(120,100,60,0.35) !important;
            backdrop-filter: none !important;
          }
          .mobile-day-bar section div,
          .mobile-day-bar section label {
            color: #0a2540 !important;
            text-shadow: 0 1px 2px rgba(255,255,255,0.6) !important;
          }
          .mobile-day-bar section select {
            background: rgba(255,255,255,0.55) !important;
            color: #0a2540 !important;
            border-color: rgba(120,100,60,0.25) !important;
          }
          .mobile-day-bar section select option {
            background: #f5f9ff;
            color: #0a2540;
          }
          .mobile-search-input::placeholder {
            color: rgba(10,37,64,0.55);
            text-shadow: none;
            opacity: 1;
          }
          .mobile-day-drawer [data-listing-id] div {
            color: #0a2540 !important;
            text-shadow: 0 1px 2px rgba(255,255,255,0.6) !important;
          }
        `}</style>

        {/* Floating top bar — region selector + search */}
        <div
          className="mobile-day-bar"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 54,
            zIndex: 10,
            padding: "8px 10px",
            background:
              "linear-gradient(180deg, rgba(245,249,255,0.15) 0%, rgba(245,249,255,0.07) 80%, transparent 100%)",
            backdropFilter: "blur(8px)",
            color: "#0a2540",
            textShadow: "0 1px 2px rgba(255,255,255,0.6)",
          }}
        >
          <RegionSelector
            selectedState={selectedState}
            selectedCounty={selectedCounty}
            counties={counties}
            states={states}
            hasStateSelection={hasStateSelection}
            onStateChange={(newState) => {
              setSelectedState(newState);
              setSelectedCounty("All");
              setSelectedId(null);
              updateMapUrl(newState, "All");
            }}
            onCountyChange={(newCounty) => {
              setSelectedCounty(newCounty);
              setSelectedId(null);
              updateMapUrl(selectedState, newCounty);
            }}
          />

          {/* County search — only when a county is selected */}
          {hasCountySelection && (
            <input
              type="text"
              placeholder="Search this county..."
              value={countySearchQuery}
              onChange={(e) => setCountySearchQuery(e.target.value)}
              className="mobile-search-input"
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                padding: "9px 12px",
                borderRadius: 10,
                border: "1px solid rgba(138,96,16,0.25)",
                background: "rgba(255,255,255,0.6)",
                color: "#0a2540",
                fontSize: "0.88rem",
                fontWeight: 400,
                outline: "none",
                textShadow: "0 1px 2px rgba(255,255,255,0.6)",
              }}
            />
          )}
        </div>

        {/* Bottom drawer — slide-over sheet with snap positions */}
        <div
          ref={sheetRef}
          className="mobile-day-drawer"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "85vh",
            zIndex: 10,
            background: "rgba(245,249,255,0.15)",
            backdropFilter: "blur(8px)",
            borderTop: "1px solid rgba(138,96,16,0.25)",
            borderRadius: "18px 18px 0 0",
            color: "#0a2540",
            textShadow: "0 1px 2px rgba(255,255,255,0.6)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transform:
              drawerSnap === "full"
                ? "translateY(0px)"
                : drawerSnap === "mid"
                ? "translateY(40vh)"
                : "translateY(calc(85vh - 140px))",
            transition: dragRef.current
              ? "none"
              : "transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
            willChange: "transform",
          }}
        >
          {/* HEADER — drag grip: handle + action doors */}
          <div
            style={{
              flexShrink: 0,
              padding: "14px 14px 0",
              touchAction: "none",
            }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const sheet = sheetRef.current;
              if (!sheet) return;
              // Read current translateY from computed transform matrix
              const matrix = new DOMMatrix(
                getComputedStyle(sheet).transform
              );
              dragRef.current = {
                startY: touch.clientY,
                startTranslate: matrix.m42,
                lastY: touch.clientY,
                lastTime: Date.now(),
              };
              sheet.style.transition = "none";
            }}
            onTouchMove={(e) => {
              const drag = dragRef.current;
              const sheet = sheetRef.current;
              if (!drag || !sheet) return;
              const touch = e.touches[0];
              const delta = touch.clientY - drag.startY;
              const maxTranslate =
                window.innerHeight * 0.85 - 140;
              const newY = Math.max(
                0,
                Math.min(drag.startTranslate + delta, maxTranslate)
              );
              sheet.style.transform = `translateY(${newY}px)`;
              drag.lastY = touch.clientY;
              drag.lastTime = Date.now();
            }}
            onTouchEnd={() => {
              const drag = dragRef.current;
              const sheet = sheetRef.current;
              if (!drag || !sheet) return;

              const vh = window.innerHeight;
              const maxTranslate = vh * 0.85 - 140;

              // Current position from the sheet
              const matrix = new DOMMatrix(
                getComputedStyle(sheet).transform
              );
              const currentY = matrix.m42;

              // Velocity (positive = moving down)
              const elapsed = Math.max(Date.now() - drag.lastTime, 1);
              const velocity =
                (drag.lastY - drag.startY) / elapsed;

              // Snap targets in pixels
              const snaps: { name: DrawerSnap; y: number }[] = [
                { name: "full", y: 0 },
                { name: "mid", y: vh * 0.4 },
                { name: "peek", y: maxTranslate },
              ];

              let target: DrawerSnap;

              if (Math.abs(velocity) > 0.5) {
                // Flick: move one step in the flick direction
                const currentSnap = snaps.reduce((best, s) =>
                  Math.abs(s.y - currentY) <
                  Math.abs(best.y - currentY)
                    ? s
                    : best
                );
                const idx = snaps.findIndex(
                  (s) => s.name === currentSnap.name
                );
                if (velocity > 0 && idx < snaps.length - 1) {
                  target = snaps[idx + 1].name;
                } else if (velocity < 0 && idx > 0) {
                  target = snaps[idx - 1].name;
                } else {
                  target = currentSnap.name;
                }
              } else {
                // No flick: snap to nearest
                target = snaps.reduce((best, s) =>
                  Math.abs(s.y - currentY) <
                  Math.abs(best.y - currentY)
                    ? s
                    : best
                ).name;
              }

              dragRef.current = null;
              sheet.style.transition =
                "transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)";
              setDrawerSnap(target);
            }}
          >
            {/* Listing count */}
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                fontWeight: 500,
                color: "#0a2540",
                textShadow: "0 1px 2px rgba(255,255,255,0.6)",
                marginBottom: 6,
                lineHeight: 1.3,
              }}
            >
              {mapListings.length === 0
                ? "Growing Commons — No Lights Mapped Yet"
                : mapListings.length === 1
                ? "1 listing"
                : `${mapListings.length} listings`}
            </div>

            {/* Drawer handle indicator */}
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: "rgba(120,100,60,0.3)",
                margin: "0 auto 12px",
              }}
            />

            {/* Action doors — Add a Point of Light + Explore Online Resources */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Link
                href={submitListingHref}
                style={{
                  flex: 1,
                  display: "block",
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: mapListings.length === 0
                    ? "rgba(255,216,107,0.28)"
                    : "rgba(255,255,255,0.35)",
                  border: mapListings.length === 0
                    ? "1.5px solid rgba(255,216,107,0.6)"
                    : "1px solid rgba(120,100,60,0.2)",
                  boxShadow: mapListings.length === 0
                    ? "0 0 10px rgba(255,216,107,0.18)"
                    : "none",
                  textDecoration: "none",
                  textAlign: "center",
                  color: "#6b4f00",
                  fontSize: 12,
                  fontWeight: 600,
                  textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                }}
              >
                Add a Point of Light
              </Link>
              <Link
                href="/support"
                style={{
                  flex: 1,
                  display: "block",
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.35)",
                  border: "1px solid rgba(120,100,60,0.2)",
                  textDecoration: "none",
                  textAlign: "center",
                  color: "#6b4f00",
                  fontSize: 12,
                  fontWeight: 600,
                  textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                }}
              >
                Online Resources
              </Link>
            </div>
          </div>

          {/* SCROLLABLE list region */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              padding: "0 14px 24px",
            }}
          >
            <div style={{ position: "relative", zIndex: 1 }}>
              {renderSidebarContent({ showCountySearch: false, showActionButtons: false })}
            </div>
          </div>
        </div>

      </main>
    );
  }

  /* ── Desktop: unchanged sidebar + map layout ── */
  return (
    <main
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          padding: 16,
          overflowY: "auto",
          color: "rgba(211,227,247,0.85)",
          background:
            "linear-gradient(160deg, rgba(12,52,110,0.78) 0%, rgba(17,65,130,0.82) 50%, rgba(12,52,110,0.78) 100%)",
          backdropFilter: "blur(12px)",
          width: "380px",
          position: "relative" as const,
          boxShadow: "2px 0 24px rgba(8,25,45,0.13)",
          borderTop: "3px solid rgba(255,216,107,0.6)",
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

        <RegionSelector
          selectedState={selectedState}
          selectedCounty={selectedCounty}
          counties={counties}
          states={states}
          hasStateSelection={hasStateSelection}
          onStateChange={(newState) => {
            setSelectedState(newState);
            setSelectedCounty("All");
            setSelectedId(null);
            updateMapUrl(newState, "All");
          }}
          onCountyChange={(newCounty) => {
            setSelectedCounty(newCounty);
            setSelectedId(null);
            updateMapUrl(selectedState, newCounty);
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: "transparent",
          }}
        >
          {renderSidebarContent({ showCountySearch: true, showActionButtons: true })}
        </div>
      </div>

      {/* Map area */}
      <div
        style={{
          background: "#08192d",
          flex: 1,
          position: "relative" as const,
        }}
      >
        <MapClient
          listings={mapListings}
          selectedId={selectedId}
          onSelect={handlePinSelect}
          onRegionChange={setMapRegion}
          highlightCounty={hasCountySelection ? effectiveCounty : ""}
          highlightState={hasStateSelection ? effectiveState : ""}
          visible={true}
        />
      </div>
    </main>
  );
}