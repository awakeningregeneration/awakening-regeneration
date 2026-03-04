"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import MapClient from "@/app/components/MapClient";
import { mockListings } from "@/data/mockListings";
import { mockStories } from "@/data/mockStories";
import type { Listing } from "@/types/listing";

type Region = { state?: string; county?: string };

export default function MapPage() {
  const allListings = useMemo(() => mockListings, []);

  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedCounty, setSelectedCounty] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // live region from map exploration (no user location prompt)
  const [mapRegion, setMapRegion] = useState<Region>({});

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

  const filteredListings = useMemo(() => {
    return allListings.filter((l) => {
      const stateOk = selectedState === "All" || l.state === selectedState;
      const countyOk =
        selectedCounty === "All" || (l.county && l.county === selectedCounty);
      return stateOk && countyOk;
    });
  }, [allListings, selectedState, selectedCounty]);

  // If filters change and selectedId is no longer visible, clear selection
  useEffect(() => {
    if (!selectedId) return;
    const stillThere = filteredListings.some((l) => l.id === selectedId);
    if (!stillThere) setSelectedId(null);
  }, [filteredListings, selectedId]);

  // Prefer dropdown region if user chose it; otherwise use live map region
  const effectiveState =
    selectedState !== "All" ? selectedState : mapRegion.state || "";
  const effectiveCounty =
    selectedCounty !== "All" ? selectedCounty : mapRegion.county || "";

  // County-specific listing count (for the county currently being viewed/selected)
  const countyLightCount = useMemo(() => {
    if (!effectiveCounty) return null;
    const count = allListings.filter(
      (l) =>
        l.county &&
        l.county.toLowerCase() === effectiveCounty.toLowerCase()
    ).length;
    return count;
  }, [allListings, effectiveCounty]);

  // County-specific story count
  const countyStoryCount = useMemo(() => {
    if (!effectiveCounty || !effectiveState) return null;
    const count = mockStories.filter(
      (s) =>
        s.state.toLowerCase() === effectiveState.toLowerCase() &&
        s.county.toLowerCase() === effectiveCounty.toLowerCase()
    ).length;
    return count;
  }, [effectiveCounty, effectiveState]);
const submitListingHref = useMemo(() => {
  const params = new URLSearchParams();
  if (effectiveState) params.set("state", effectiveState);
  if (effectiveCounty) params.set("county", effectiveCounty);
  const qs = params.toString();
  return qs ? `/submit?${qs}` : "/submit";
}, [effectiveState, effectiveCounty]);
  // Stories links (view + submit)
  const storiesViewHref = useMemo(() => {
    const params = new URLSearchParams();
    if (effectiveState) params.set("state", effectiveState);
    if (effectiveCounty) params.set("county", effectiveCounty);
    const qs = params.toString();
    return qs ? `/stories?${qs}` : "/stories";
  }, [effectiveState, effectiveCounty]);

  const storiesSubmitHref = useMemo(() => {
    const params = new URLSearchParams();
    if (effectiveState) params.set("state", effectiveState);
    if (effectiveCounty) params.set("county", effectiveCounty);
    const qs = params.toString();
    return qs ? `/stories/submit?${qs}` : "/stories/submit";
  }, [effectiveState, effectiveCounty]);

  return (
    <main style={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 380,
          padding: 16,
          overflowY: "auto",
          borderRight: "1px solid rgba(0,0,0,0.12)",
          background: "#fafafa",
        }}
      >
        {/* Threshold */}
        <section
          style={{
            marginBottom: 12,
            padding: "14px 14px 12px",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 12,
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div style={{ fontSize: 18, lineHeight: 1.25, fontWeight: 600 }}>
            Some lights are already on.
          </div>
          <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.35, opacity: 0.82 }}>
            This map turns toward what’s alive and life-supporting.
          </div>
        </section>

        {/* Add listing button */}
        <Link
          href={submitListingHref}
          style={{ display: "block", textDecoration: "none", marginBottom: 16 }}
        >
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.14)",
              background: "rgba(255,255,255,0.9)",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            See something missing? Add it here
            <div style={{ marginTop: 4, fontSize: 12, fontWeight: 400, opacity: 0.75 }}>
              (Prefills the region you’re looking at)
            </div>
          </div>
        </Link>

        {/* Geography controls */}
        <section
          style={{
            marginBottom: 16,
            padding: 12,
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 12,
            background: "rgba(255,255,255,0.6)",
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Region</div>

          <label style={{ display: "block", fontSize: 12, marginBottom: 6, opacity: 0.85 }}>
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

          <label style={{ display: "block", fontSize: 12, marginBottom: 6, opacity: 0.85 }}>
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

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
            Showing {filteredListings.length} light{filteredListings.length === 1 ? "" : "s"}
          </div>
        </section>

        {/* Listings */}
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          Explore
        </div>

        {filteredListings.map((listing) => {
          const isSelected = selectedId === listing.id;
          return (
            <div
              key={listing.id}
              onClick={() => setSelectedId(listing.id)}
              style={{
                padding: "10px 12px",
                marginBottom: 8,
                borderRadius: 10,
                cursor: "pointer",
                background: isSelected ? "rgba(0,0,0,0.08)" : "transparent",
              }}
            >
              <div style={{ fontWeight: 600 }}>{listing.name}</div>
              <div style={{ fontSize: 12, opacity: 0.72 }}>
                {listing.city}, {listing.state}
                {listing.county ? ` • ${listing.county} County` : ""}
              </div>
            </div>
          );
        })}
      </div>

      {/* Map + Overlays */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapClient
          listings={filteredListings}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRegionChange={setMapRegion}
          highlightCounty={effectiveCounty}
          highlightState={effectiveState}
        />

        {/* County label + lights + stories + invitation */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(0,0,0,0.58)",
            color: "rgba(255,255,255,0.93)",
            fontSize: 13,
            lineHeight: 1.3,
            maxWidth: 390,
          }}
        >
          <div style={{ fontWeight: 700 }}>
            {effectiveCounty ? `${effectiveCounty} County` : "Exploring"}
            {effectiveState ? `, ${effectiveState}` : ""}
          </div>

          <div style={{ marginTop: 4, opacity: 0.88 }}>
            {effectiveCounty ? (
              countyLightCount && countyLightCount > 0 ? (
                <>Lights on here: {countyLightCount}</>
              ) : (
                <>No lights here yet</>
              )
            ) : (
              <>Move the map to name the county</>
            )}
          </div>

          {/* Stories line */}
          {effectiveCounty && effectiveState ? (
            <div style={{ marginTop: 6 }}>
              {countyStoryCount && countyStoryCount > 0 ? (
                <Link
                  href={storiesViewHref}
                  style={{
                    color: "rgba(255,255,255,0.95)",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    fontWeight: 600,
                  }}
                >
                  Stories from this place ({countyStoryCount})
                </Link>
              ) : (
                <Link
                  href={storiesSubmitHref}
                  style={{
                    color: "rgba(255,255,255,0.95)",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    fontWeight: 600,
                  }}
                >
                  Know a good story here? Add one.
                </Link>
              )}
            </div>
          ) : null}

          {/* Listing invitation line (only when county is known and has 0 lights) */}
          {effectiveCounty && countyLightCount === 0 ? (
            <div style={{ marginTop: 6 }}>
              <Link
                href={submitListingHref}
                style={{
                  color: "rgba(255,255,255,0.95)",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  fontWeight: 600,
                }}
              >
                See something missing? Add a light.
              </Link>
            </div>
          ) : null}
        </div>

        {/* Bottom Orientation Text */}
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
            lineHeight: 1.4,
            textAlign: "center",
            maxWidth: 640,
            pointerEvents: "none",
          }}
        >
          <div>There is somewhere else to look.</div>
          <div>Another story is already being written.</div>
          <div>Come see where tomorrow’s children are playing.</div>
        </div>
      </div>
    </main>
  );
}
