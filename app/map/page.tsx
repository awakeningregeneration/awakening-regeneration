"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MapClient from "@/app/components/MapClient";
import type { Listing } from "@/types/listing";

type Region = { state?: string; county?: string };

export default function MapPage() {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedCounty, setSelectedCounty] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>({});
const [storyCount, setStoryCount] = useState<number>(0);
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

    loadListings();
  }, []);

  const states = useMemo(() => {
    const s = new Set<string>();
    allListings.forEach((l) => {
      if (l.state) s.add(l.state);
    });
    return ["All", ...Array.from(s).sort()];
  }, [allListings]);

  const counties = useMemo(() => {
    const c = new Set<string>();
    allListings.forEach((l) => {
      const matchesState = selectedState === "All" || l.state === selectedState;
      if (matchesState && l.county) c.add(l.county);
    });
    return ["All", ...Array.from(c).sort()];
  }, [allListings, selectedState]);

  const effectiveState =
    selectedState !== "All" ? selectedState : mapRegion.state || "";

  const effectiveCounty =
    selectedCounty !== "All" ? selectedCounty : mapRegion.county || "";

  const activeListings = useMemo(() => {
    if (!effectiveCounty) return [];

    return allListings
      .filter((l) => {
        const countyOk =
          !!l.county &&
          l.county.toLowerCase() === effectiveCounty.toLowerCase();

        const stateOk = effectiveState
          ? !!l.state && l.state.toLowerCase() === effectiveState.toLowerCase()
          : true;

        return countyOk && stateOk;
      })
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [allListings, effectiveCounty, effectiveState]);

  useEffect(() => {
    if (!selectedId) return;
    const stillThere = activeListings.some((l) => l.id === selectedId);
    if (!stillThere) setSelectedId(null);
  }, [activeListings, selectedId]);
  useEffect(() => {
  async function loadStories() {
    if (!effectiveCounty || !effectiveState) {
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

  loadStories();
}, [effectiveState, effectiveCounty]);

  const hasCountyContext = Boolean(effectiveCounty);
  const hasListingsHere = activeListings.length > 0;

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

  const countyLabel = effectiveCounty
    ? effectiveCounty.includes("County")
      ? effectiveCounty
      : `${effectiveCounty} County`
    : "";

  return (
    <main style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div
        style={{
          width: 380,
          padding: 16,
          overflowY: "auto",
          borderRight: "1px solid rgba(0,0,0,0.12)",
          background: "#fafafa",
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
              marginBottom: 10,
              background: "white",
            }}
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
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
            County
          </label>

          <select
            value={selectedCounty}
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
            }}
          >
            {counties.map((c) => (
              <option key={c} value={c}>
                {c}
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
        >
          <div
            style={{
              fontSize: 16,
              lineHeight: 1.35,
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            {hasCountyContext
              ? `${countyLabel}${effectiveState ? `, ${effectiveState}` : ""}`
              : "Choose a place"}
          </div>

          {!hasCountyContext ? (
            <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.82 }}>
              Enter a state and county, or move the map into a place you want to
              explore.
            </div>
          ) : (
            <>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>
                Visible here
              </div>

              {hasListingsHere ? (
                <>
                  <div style={{ fontSize: 13, lineHeight: 1.45, opacity: 0.85 }}>
                    {activeListings.length} light
                    {activeListings.length === 1 ? "" : "s"} visible in this
                    place
                  </div>

                  <div style={{ marginTop: 12 }}>
                    {activeListings.map((listing) => {
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
                    Place it in the constellation
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
    Story of place
  </div>

  <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.82, marginBottom: 8 }}>
    {storyCount > 0
      ? `${storyCount} stor${storyCount === 1 ? "y" : "ies"} visible here.`
      : "Begin the story of this place."}
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
    {storyCount > 0 ? "Explore stories" : "Add the first story"}
  </Link>
</div>
            </>
          )}
        </section>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <MapClient
          listings={hasCountyContext ? activeListings : []}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRegionChange={setMapRegion}
          highlightCounty={effectiveCounty}
          highlightState={effectiveState}
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
          {hasCountyContext ? (
            <>
              <div style={{ fontWeight: 700 }}>
                {countyLabel}
                {effectiveState ? `, ${effectiveState}` : ""}
              </div>
              <div style={{ marginTop: 4, opacity: 0.88 }}>
                A living map of places where life-affirming options are visible.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700 }}>A living map</div>
              <div style={{ marginTop: 4, opacity: 0.88 }}>
                Move into a place, or choose a state and county to see what is
                visible there.
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