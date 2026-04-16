"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import MapClient from "@/app/components/MapClient";
import ListingImageTile from "../components/ListingImageTile";
import { getListingImage } from "../../lib/getListingImage";
import { californiaCounties } from "@/data/californiaCounties";
import { allCounties } from "@/data/allCounties";
import type { Listing } from "@/types/listing";

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
          width: "380px",
          padding: 16,
          overflowY: "auto",
          position: "relative",
          color: "rgba(211,227,247,0.85)",
          background:
            "linear-gradient(160deg, rgba(12,52,110,0.78) 0%, rgba(17,65,130,0.82) 50%, rgba(12,52,110,0.78) 100%)",
          backdropFilter: "blur(12px)",
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
              setSelectedCounty(e.target.value);
              setSelectedId(null);
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
              setSelectedState(e.target.value);
              setSelectedCounty("All");
              setSelectedId(null);
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
                  color: "rgba(211,227,247,0.9)",
                }}
              >
                {countyLabel}
                {effectiveState ? `, ${effectiveState}` : ""}
              </div>

              <div
                style={{
                  fontSize: 12,
                  marginBottom: 10,
                  color: "rgba(211,227,247,0.6)",
                }}
              >
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
                      const imageUrl = getListingImage(
                        listing.image_url,
                        listing.website
                      );

                      return (
                        <div
                          key={listing.id}
                          onClick={() => setSelectedId(listing.id)}
                          style={{
                            padding: 12,
                            marginBottom: 8,
                            borderRadius: 10,
                            cursor: "pointer",
                            border: isSelected
                              ? "2px solid rgba(255,216,107,0.6)"
                              : "1px solid rgba(255,255,255,0.12)",
                            background: isSelected
                              ? "rgba(255,216,107,0.2)"
                              : "rgba(224,240,255,0.14)",
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                            transition: "all 0.15s ease",
                            boxShadow: isSelected
                              ? "0 2px 12px rgba(255,216,107,0.2)"
                              : "0 1px 4px rgba(8,25,45,0.06)",
                          }}
                        >
                          <ListingImageTile
                            imageUrl={imageUrl}
                            name={listing.name}
                            size="sm"
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 600,
                                color: "#e8f4ff",
                                fontSize: 15,
                              }}
                            >
                              {listing.name}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "rgba(148,196,236,0.8)",
                                marginTop: 2,
                              }}
                            >
                              {locationParts.join(", ") || effectiveState}
                            </div>
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
                  marginTop: 12,
                  padding: 16,
                  borderRadius: 14,
                  border: "1px solid rgba(148,196,236,0.25)",
                  background: "rgba(255,255,255,0.06)",
                  transition: "box-shadow 0.2s ease",
                  boxShadow: "0 2px 8px rgba(255,216,107,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#e8f4ff",
                    marginBottom: 4,
                  }}
                >
                  Can&apos;t find it nearby?
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(148,196,236,0.8)",
                    lineHeight: 1.45,
                    marginBottom: 10,
                  }}
                >
                  We&apos;ve gathered aligned options that ship to you — same
                  values, wider reach.
                </div>
                <Link
                  href="/support"
                  style={{
                    display: "inline-block",
                    background: "rgba(255,216,107,0.15)",
                    border: "1px solid rgba(255,216,107,0.5)",
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#7a5c00",
                    textDecoration: "none",
                  }}
                >
                  Explore aligned options →
                </Link>
              </div>
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
    }}
  >
    A place for people to share local stories of what is being built, restored,
    planted, and brought to life here.
  </div>

  <Link
    href={storiesViewHref}
    style={{
      color: "#b07d2a",
      fontWeight: 600,
      fontSize: 13,
      textDecoration: "none",
    }}
  >
    See and Share Local Stories
  </Link>
</div>

            </>
          )}
        </div>
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

        <Link
          href="/constellation"
          style={{
            position: "absolute",
            bottom: 80,
            right: 16,
            zIndex: 10,
            display: "inline-block",
            minWidth: 180,
            padding: "12px 18px",
            borderRadius: 20,
            background:
              "radial-gradient(circle at 40% 40%, rgba(17,41,82,0.97) 0%, rgba(8,25,45,0.99) 100%)",
            border: "1px solid rgba(255,216,107,0.35)",
            boxShadow:
              "0 0 18px rgba(255,216,107,0.15), 0 4px 24px rgba(0,0,0,0.35)",
            backdropFilter: "blur(8px)",
            textDecoration: "none",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 28px rgba(255,216,107,0.28), 0 4px 24px rgba(0,0,0,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 18px rgba(255,216,107,0.15), 0 4px 24px rgba(0,0,0,0.35)";
          }}
        >
          {/* Background star field */}
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
            ].map((star, i) => (
              <span
                key={i}
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

          {/* Foreground text */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "rgba(211,227,247,0.95)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              A world of inspiration
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}