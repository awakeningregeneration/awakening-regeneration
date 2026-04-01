"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import MapClient from "@/app/components/MapClient";
import { californiaCounties } from "@/data/californiaCounties";
import type { Listing } from "@/types/listing";

type PropsRegion = { state?: string; county?: string };

export default function MapPage() {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedCounty, setSelectedCounty] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState<PropsRegion>({});
  const [storyCount, setStoryCount] = useState<number>(0);

  const searchParams = useSearchParams();

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

    void loadListings();
  }, []);

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
    const s = new Set<string>();
    allListings.forEach((l) => {
      if (l.state) s.add(l.state);
    });
    return ["All", ...Array.from(s).sort()];
  }, [allListings]);

const counties = useMemo(() => {
  if (selectedState === "All") return ["All"];

  if (selectedState === "California") {
    return ["All", ...californiaCounties];
  }

  const c = new Set<string>();
  allListings.forEach((l) => {
    if (l.state === selectedState && l.county) {
      const cleanedCounty = l.county.replace(/\s+County$/i, "");
      c.add(cleanedCounty);
    }
  });

  return ["All", ...Array.from(c).sort()];
}, [allListings, selectedState]);

  const hasStateSelection = selectedState !== "All";
  const hasCountySelection = selectedCounty !== "All";

  const effectiveState = hasStateSelection ? selectedState : "";
  const effectiveCounty = hasCountySelection ? selectedCounty : "";

  const stateListings = useMemo(() => {
    if (!effectiveState) return [];

    return allListings.filter(
      (l) =>
        !!l.state && l.state.toLowerCase() === effectiveState.toLowerCase()
    );
  }, [allListings, effectiveState]);

const countyListings = useMemo(() => {
  if (!effectiveState || !effectiveCounty) return [];

  const normalizeCounty = (value?: string | null) =>
    (value || "").replace(/\s+County$/i, "").trim().toLowerCase();

  return allListings
    .filter((l) => {
      const stateOk =
        !!l.state && l.state.toLowerCase() === effectiveState.toLowerCase();

      const countyOk =
        !!l.county &&
        normalizeCounty(l.county) === normalizeCounty(effectiveCounty);

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
const selectedListing = useMemo(() => {
  return allListings.find((l) => l.id === selectedId) || null;
}, [allListings, selectedId]);
  useEffect(() => {
    if (!selectedId) return;

    const visibleIds = new Set(mapListings.map((l) => l.id));
    if (!visibleIds.has(selectedId)) {
      setSelectedId(null);
    }
  }, [mapListings, selectedId]);

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

  const stateLightCount = stateListings.length;
  const countyLightCount = countyListings.length;

  const countyLabel = effectiveCounty
    ? effectiveCounty.includes("County")
      ? effectiveCounty
      : `${effectiveCounty} County`
    : "";

  const liveRegionLabel =
    mapRegion.county && mapRegion.state
      ? `${
          mapRegion.county.includes("County")
            ? mapRegion.county
            : `${mapRegion.county} County`
        }, ${mapRegion.state}`
      : mapRegion.state || "";

  return (
    <main style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div
        style={{
          width: 380,
          padding: 16,
          overflowY: "auto",
          borderRight: "1px solid rgba(0,0,0,0.12)",
          background: "#dce9f8",
        }}
      >
        <section
          style={{
            marginBottom: 16,
            padding: 12,
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 12,
            background: "rgba(255,255,255,0.72)",
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
            Region
          </div>

          <label
            style={{
              display: "block",
              fontSize: 12,
              marginBottom: 6,
              opacity: hasStateSelection ? 0.85 : 0.45,
            }}
          >
            County
          </label>

          <select
            value={selectedCounty}
            disabled={!hasStateSelection}
            onChange={(e) => {
              setSelectedCounty(e.target.value);
              setSelectedId(null);
            }}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.15)",
              background: "white",
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
              opacity: 0.85,
            }}
          >
            State
          </label>

          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCounty("All");
              setSelectedId(null);
            }}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.15)",
              background: "white",
            }}
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </section>

        <section
          style={{
            marginBottom: 16,
            padding: "14px 14px 12px",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 12,
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(6px)",
          }}
        >{selectedListing && (
  <div
    style={{
      marginBottom: 14,
      padding: 12,
      border: "1px solid rgba(0,0,0,0.12)",
      borderRadius: 12,
      background: "rgba(255,255,255,0.85)",
    }}
  >
    <div style={{ fontWeight: 700, fontSize: 15 }}>
      {selectedListing.name}
    </div>

    <div
      style={{
        fontSize: 12,
        opacity: 0.7,
        marginTop: 2,
        marginBottom: 6,
      }}
    >
      {selectedListing.category} • {selectedListing.city},{" "}
      {selectedListing.state}
    </div>

    <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.9 }}>
      {selectedListing.description}
    </div>

    {selectedListing.website && (
      <a
        href={selectedListing.website}
        target="_blank"
        style={{
          display: "inline-block",
          marginTop: 8,
          textDecoration: "underline",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Visit website
      </a>
    )}
  </div>
)}
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

              <div style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.84 }}>
                You’re viewing the broader map. Choose a state to focus what’s
                visible there, then narrow further by county if you want to land
                in a specific place.
              </div>

              <div
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  lineHeight: 1.5,
                  opacity: 0.8,
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
                    border: "1px solid rgba(0,0,0,0.10)",
                    borderRadius: 10,
                    background: "rgba(0,0,0,0.03)",
                    fontSize: 13,
                    lineHeight: 1.5,
                    opacity: 0.84,
                  }}
                >
                  Map center is currently over <strong>{liveRegionLabel}</strong>.
                </div>
              ) : null}

              <div
                style={{
                  marginTop: 14,
                  padding: 10,
                  border: "1px solid rgba(0,0,0,0.10)",
                  borderRadius: 10,
                  background: "rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Want to add something?
                </div>

                <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.82 }}>
                  Choose a place first to ground the listing in a specific
                  region, or add a light directly and let the map place it.
                </div>
<div
  style={{
    marginTop: 10,
    padding: 10,
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 10,
    background: "rgba(0,0,0,0.03)",
    fontSize: 13,
    lineHeight: 1.5,
    opacity: 0.85,
  }}
>
  <div style={{ fontWeight: 600, marginBottom: 6 }}>
    What is this map?
  </div>

  <Link
    href="/about"
    style={{
      textDecoration: "underline",
      textUnderlineOffset: 3,
      fontWeight: 600,
      color: "inherit",
    }}
  >
    About Awakening Regeneration
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
                      color: "inherit",
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
                  fontSize: 16,
                  lineHeight: 1.35,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                {effectiveState}
              </div>

              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>
                Visible in this state
              </div>

              <div style={{ fontSize: 13, lineHeight: 1.45, opacity: 0.85 }}>
                {stateLightCount} light{stateLightCount === 1 ? "" : "s"} visible
                in {effectiveState}.
              </div>

              <div
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  lineHeight: 1.55,
                  opacity: 0.82,
                }}
              >
                Pan around the state, or choose a county to focus more closely.
              </div>

              <div
                style={{
                  marginTop: 14,
                  padding: 10,
                  border: "1px solid rgba(0,0,0,0.10)",
                  borderRadius: 10,
                  background: "rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Not seeing it yet?
                </div>
<div
  style={{
    marginTop: 10,
    padding: 10,
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 10,
    background: "rgba(0,0,0,0.03)",
    fontSize: 13,
    lineHeight: 1.5,
    opacity: 0.85,
  }}
>
  <div style={{ fontWeight: 600, marginBottom: 6 }}>
    What is this map?
  </div>

  <Link
    href="/about"
    style={{
      textDecoration: "underline",
      textUnderlineOffset: 3,
      fontWeight: 600,
      color: "inherit",
    }}
  >
    About Awakening Regeneration
  </Link>
</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.82 }}>
                  Choose a county to focus the map more precisely, or add a new
                  point of light in {effectiveState}.
                </div>

                <div style={{ marginTop: 8 }}>
                  <Link
                    href={submitListingHref}
                    style={{
                      display: "block",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                      fontWeight: 600,
                      color: "inherit",
                      fontSize: 13,
                      marginBottom: 6,
                    }}
                  >
                    Add a point of light
                  </Link>

                  <Link
                    href="/support"
                    style={{
                      display: "block",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                      fontWeight: 600,
                      color: "inherit",
                      fontSize: 13,
                    }}
                  >
                    Explore support resources
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1.35,
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                {countyLabel}
                {effectiveState ? `, ${effectiveState}` : ""}
              </div>

              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>
                Visible here
              </div>

              {countyLightCount > 0 ? (
                <>
                  <div style={{ fontSize: 13, lineHeight: 1.45, opacity: 0.85 }}>
                    {countyLightCount} light
                    {countyLightCount === 1 ? "" : "s"} visible in this place.
                  </div>

                  <div style={{ marginTop: 12 }}>
                    {countyListings.map((listing) => {
                      const isSelected = selectedId === listing.id;
                      const locationParts = [listing.city, listing.state].filter(
                        Boolean
                      ) as string[];

                      return (
                        <div
                          key={listing.id}
                          onClick={() => setSelectedId(listing.id)}
                          style={{
                            padding: "10px 12px",
                            marginBottom: 8,
                            borderRadius: 10,
                            cursor: "pointer",
                            border: "1px solid rgba(0,0,0,0.08)",
                            background: isSelected
                              ? "rgba(0,0,0,0.08)"
                              : "rgba(0,0,0,0.02)",
                          }}
                        >
                          <div style={{ fontWeight: 600 }}>{listing.name}</div>
                          <div
                            style={{
                              fontSize: 12,
                              opacity: 0.72,
                              marginTop: 2,
                            }}
                          >
                            {locationParts.join(", ") || effectiveState}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.88 }}>
                  No lights mapped here yet.
                </div>
              )}

              <div
                style={{
                  marginTop: 14,
                  padding: 10,
                  border: "1px solid rgba(0,0,0,0.10)",
                  borderRadius: 10,
                  background: "rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Not seeing it here?
                </div>

                <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.82 }}>
                  Help make this place more visible, or look beyond this area for
                  aligned options.
                </div>

                <div style={{ marginTop: 8 }}>
                  <Link
                    href={submitListingHref}
                    style={{
                      display: "block",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                      fontWeight: 600,
                      color: "inherit",
                      fontSize: 13,
                      marginBottom: 6,
                    }}
                  >
                    Place it on the Map
                  </Link>

                  <Link
                    href="/support"
                    style={{
                      display: "block",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                      fontWeight: 600,
                      color: "inherit",
                      fontSize: 13,
                    }}
                  >
                    See Additional Options
                  </Link>
                </div>
              </div>
<div
  style={{
    marginTop: 14,
    padding: 10,
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 10,
    background: "rgba(0,0,0,0.03)",
  }}
>
  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
    Story of Place
  </div>

  <div
    style={{
      fontSize: 13,
      lineHeight: 1.5,
      opacity: 0.82,
      marginBottom: 8,
    }}
  >
    A place for people to share local stories of what is being built, restored,
    planted, and brought to life here.
  </div>

  <Link
    href={storiesViewHref}
    style={{
      textDecoration: "underline",
      textUnderlineOffset: 3,
      fontWeight: 600,
      color: "inherit",
      fontSize: 13,
    }}
  >
    See and Share Local Stories
  </Link>
</div>

              <div
                style={{
                  marginTop: 14,
                  padding: 10,
                  border: "1px solid rgba(0,0,0,0.10)",
                  borderRadius: 10,
                  background: "rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Looking Beyond this Place?
                </div>

                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    opacity: 0.82,
                    marginBottom: 8,
                  }}
                >
                  Explore stories of inspiration from around the world.
                </div>

                <Link
                  href="/constellation"
                  style={{
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    fontWeight: 600,
                    color: "inherit",
                    fontSize: 13,
                  }}
                >
                  Explore the Constellation
                </Link>
              </div>
            </>
          )}
        </section>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <MapClient
          listings={mapListings}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRegionChange={setMapRegion}
          highlightCounty={hasCountySelection ? effectiveCounty : ""}
          highlightState={hasStateSelection ? effectiveState : ""}
        />

        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            padding: "12px 14px",
            borderRadius: 12,
            background: "rgba(0,0,0,0.58)",
            color: "rgba(255,255,255,0.93)",
            fontSize: 13,
            lineHeight: 1.35,
            maxWidth: 420,
          }}
        >
          {!hasStateSelection ? (
            <>
              <div style={{ fontWeight: 700 }}>A living map</div>
              <div style={{ marginTop: 4, opacity: 0.88 }}>
                Lights are visible across the country. Choose a state to focus
                what’s present there.
              </div>
            </>
          ) : hasStateSelection && !hasCountySelection ? (
            <>
              <div style={{ fontWeight: 700 }}>{effectiveState}</div>
              <div style={{ marginTop: 4, opacity: 0.88 }}>
                A state view of places where life-affirming options are visible.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700 }}>
                {countyLabel}
                {effectiveState ? `, ${effectiveState}` : ""}
              </div>
              <div style={{ marginTop: 4, opacity: 0.88 }}>
                A living map of places where life-affirming options are visible.
              </div>
            </>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 14px",
            borderRadius: 12,
            background: "rgba(0,0,0,0.50)",
            color: "rgba(255,255,255,0.92)",
            fontSize: 13,
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          Take part
        </div>
      </div>
    </main>
  );
}