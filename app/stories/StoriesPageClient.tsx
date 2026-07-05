"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { californiaCounties } from "@/data/californiaCounties";
import { allCounties } from "@/data/allCounties";

type Story = {
  id: string;
  created_at: string;
  state: string;
  county: string;
  title?: string | null;
  body: string;
  link?: string | null;
};

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming", "District of Columbia",
];

const lightPoints: {
  left: string;
  top: string;
  size: number;
  opacity: number;
  tier: 1 | 2 | 3;
}[] = [
  // Tier 1 — 15 tiny
  { left: "3%", top: "5%", size: 3, opacity: 0.6, tier: 1 },
  { left: "8%", top: "18%", size: 2, opacity: 0.5, tier: 1 },
  { left: "15%", top: "8%", size: 4, opacity: 0.7, tier: 1 },
  { left: "12%", top: "32%", size: 2, opacity: 0.55, tier: 1 },
  { left: "5%", top: "50%", size: 3, opacity: 0.6, tier: 1 },
  { left: "18%", top: "68%", size: 2, opacity: 0.5, tier: 1 },
  { left: "8%", top: "82%", size: 4, opacity: 0.7, tier: 1 },
  { left: "82%", top: "6%", size: 3, opacity: 0.65, tier: 1 },
  { left: "90%", top: "20%", size: 2, opacity: 0.55, tier: 1 },
  { left: "78%", top: "38%", size: 4, opacity: 0.7, tier: 1 },
  { left: "95%", top: "54%", size: 2, opacity: 0.5, tier: 1 },
  { left: "85%", top: "70%", size: 3, opacity: 0.6, tier: 1 },
  { left: "92%", top: "85%", size: 4, opacity: 0.7, tier: 1 },
  { left: "40%", top: "4%", size: 2, opacity: 0.55, tier: 1 },
  { left: "55%", top: "92%", size: 3, opacity: 0.6, tier: 1 },
  // Tier 2 — 15 medium
  { left: "6%", top: "12%", size: 7, opacity: 0.8, tier: 2 },
  { left: "14%", top: "22%", size: 5, opacity: 0.7, tier: 2 },
  { left: "3%", top: "36%", size: 8, opacity: 0.85, tier: 2 },
  { left: "10%", top: "58%", size: 6, opacity: 0.75, tier: 2 },
  { left: "16%", top: "76%", size: 7, opacity: 0.8, tier: 2 },
  { left: "4%", top: "88%", size: 5, opacity: 0.7, tier: 2 },
  { left: "86%", top: "14%", size: 8, opacity: 0.85, tier: 2 },
  { left: "94%", top: "32%", size: 6, opacity: 0.75, tier: 2 },
  { left: "80%", top: "48%", size: 7, opacity: 0.8, tier: 2 },
  { left: "88%", top: "62%", size: 5, opacity: 0.7, tier: 2 },
  { left: "94%", top: "78%", size: 8, opacity: 0.85, tier: 2 },
  { left: "82%", top: "90%", size: 6, opacity: 0.75, tier: 2 },
  { left: "28%", top: "8%", size: 5, opacity: 0.7, tier: 2 },
  { left: "68%", top: "12%", size: 7, opacity: 0.78, tier: 2 },
  { left: "45%", top: "86%", size: 6, opacity: 0.72, tier: 2 },
  // Tier 3 — 10 bright
  { left: "5%", top: "8%", size: 12, opacity: 0.88, tier: 3 },
  { left: "12%", top: "45%", size: 10, opacity: 0.82, tier: 3 },
  { left: "8%", top: "72%", size: 14, opacity: 0.95, tier: 3 },
  { left: "90%", top: "8%", size: 11, opacity: 0.85, tier: 3 },
  { left: "94%", top: "42%", size: 14, opacity: 0.92, tier: 3 },
  { left: "88%", top: "76%", size: 9, opacity: 0.78, tier: 3 },
  { left: "20%", top: "28%", size: 10, opacity: 0.8, tier: 3 },
  { left: "78%", top: "22%", size: 14, opacity: 0.95, tier: 3 },
  { left: "30%", top: "84%", size: 11, opacity: 0.85, tier: 3 },
  { left: "72%", top: "88%", size: 9, opacity: 0.75, tier: 3 },
];

export default function StoriesPageClient({
  initialState,
  initialCounty,
}: {
  initialState: string;
  initialCounty: string;
}) {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCounty, setSelectedCounty] = useState(initialCounty);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  const hasPlace = selectedState !== "" && selectedCounty !== "";

  const counties = useMemo(() => {
    if (!selectedState) return [];
    if (selectedState === "California") return californiaCounties;
    return allCounties[selectedState] ?? [];
  }, [selectedState]);

  const countyLabel = selectedCounty
    ? selectedCounty.includes("County")
      ? selectedCounty
      : `${selectedCounty} County`
    : "";

  const placeLabel =
    countyLabel && selectedState
      ? `${countyLabel}, ${selectedState}`
      : countyLabel || selectedState || "";

  const addStoryHref = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedState) params.set("state", selectedState);
    if (selectedCounty) params.set("county", selectedCounty);
    const qs = params.toString();
    return qs ? `/stories/submit?${qs}` : "/stories/submit";
  }, [selectedState, selectedCounty]);

  const fetchStories = useCallback(async (state: string, county: string) => {
    if (!state || !county) {
      setStories([]);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("state", state);
      params.set("county", county);
      const res = await fetch(`/api/stories?${params.toString()}`);
      if (res.ok) {
        setStories(await res.json());
      } else {
        setStories([]);
      }
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount if arriving with place params
  useEffect(() => {
    if (initialState && initialCounty) {
      fetchStories(initialState, initialCounty);
    }
  }, [initialState, initialCounty, fetchStories]);

  function handleStateChange(newState: string) {
    setSelectedState(newState);
    setSelectedCounty("");
    setStories([]);
  }

  function handleCountyChange(newCounty: string) {
    setSelectedCounty(newCounty);
    if (selectedState && newCounty) {
      const params = new URLSearchParams();
      params.set("state", selectedState);
      params.set("county", newCounty);
      router.replace(`/stories?${params.toString()}`, { scroll: false });
      fetchStories(selectedState, newCounty);
    }
  }

  const cardStyle: React.CSSProperties = {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.13)",
    backdropFilter: "blur(8px)",
    padding: "22px 22px",
    marginBottom: 18,
  };

  const headingStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.96)",
    fontWeight: 600,
    margin: 0,
  };

  const bodyTextStyle: React.CSSProperties = {
    color: "rgba(235,245,255,0.95)",
    lineHeight: 1.65,
  };

  const goldLinkStyle: React.CSSProperties = {
    color: "#FFD86B",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: 14,
  };

  const selectStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 200,
    padding: "11px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    fontSize: 15,
    outline: "none",
    backdropFilter: "blur(6px)",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#112952",
        color: "white",
        position: "relative",
        overflow: "hidden",
        padding: "32px 20px 48px",
      }}
    >
      {/* Atmosphere layer 1 */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(60,130,220,0.45) 0%, rgba(5,16,31,1) 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Atmosphere layer 2 */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(80,140,230,0.28) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      {/* Atmosphere layer 3 */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Gold light points */}
      {lightPoints.map((p, i) => {
        let boxShadow = "";
        if (p.tier === 1) {
          boxShadow = "0 0 6px 1px rgba(255,220,140,0.20)";
        } else if (p.tier === 2) {
          boxShadow =
            "0 0 12px 2px rgba(255,220,140,0.30), 0 0 24px 4px rgba(255,200,100,0.12)";
        } else {
          boxShadow =
            "0 0 18px 3px rgba(255,220,140,0.40), 0 0 36px 6px rgba(255,200,100,0.16), 0 0 60px 10px rgba(255,180,80,0.06)";
        }
        const hasCore = p.tier === 3 && p.size >= 14;
        return (
          <div
            key={i}
            style={{
              position: "fixed",
              left: `calc(${p.left} - ${p.size}px)`,
              top: `calc(${p.top} - ${p.size}px)`,
              width: p.size * 3,
              height: p.size * 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `radial-gradient(circle, rgba(255,220,140,${
                p.opacity * 0.12
              }) 0%, transparent 70%)`,
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: 3,
            }}
          >
            <div
              style={{
                position: "relative",
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: "rgba(255,244,200,1)",
                opacity: p.opacity,
                boxShadow,
                filter: `blur(${p.size * 0.15}px)`,
              }}
            >
              {hasCore && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: p.size * 0.4,
                    height: p.size * 0.4,
                    borderRadius: "50%",
                    background: "rgba(255,250,230,0.9)",
                  }}
                />
              )}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <img
            src="/canary-logo-new.png"
            alt="Canary Commons"
            style={{
              width: "clamp(200px, 30vw, 320px)",
              height: "auto",
              display: "block",
              margin: "0 auto 12px",
              filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.3))",
            }}
          />
        </div>

        {/* ── HEADER — floats over constellation ── */}
        <section style={{ marginBottom: 28 }}>
          {/* Heading — centered */}
          <h1
            style={{
              ...headingStyle,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              lineHeight: 1.15,
              textAlign: "center",
              marginBottom: 16,
              textShadow:
                "0 0 18px rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {hasPlace ? placeLabel : "STORY OF PLACE"}
          </h1>

          {/* Invitation line — always visible, adjusts wording */}
          <p
            style={{
              fontSize: "clamp(1.05rem, 1.2vw, 1.15rem)",
              lineHeight: 1.6,
              fontStyle: "italic",
              color: "rgba(255,248,224,0.88)",
              textAlign: "center",
              maxWidth: 620,
              margin: "0 auto 20px",
              textShadow: "0 1px 6px rgba(0,0,0,0.3)",
            }}
          >
            {hasPlace
              ? "Come into the lived experience of those who are doing the little things that add up to a big difference."
              : "Choose a place and come into the lived experience of those who are doing the little things that add up to a big difference."}
          </p>

          {/* Definition paragraphs — only in STATE A, floating */}
          {!hasPlace && (
            <div
              style={{
                fontSize: "clamp(1.02rem, 1.15vw, 1.12rem)",
                lineHeight: 1.68,
                color: "#fff8e0",
                maxWidth: 640,
                margin: "0 auto 24px",
                textShadow: "0 1px 6px rgba(0,0,0,0.3)",
              }}
            >
              <p style={{ marginBottom: 12 }}>
                Story is how we&apos;ve always made meaning and passed it on.
                Long before maps or data, we knew a place through the stories
                told about it — who tends it, what grows there, the good that
                people sow into the ground they share.
              </p>
              <p style={{ margin: 0 }}>
                The stories here carry that: the lived experience of people in
                place, and the good they&apos;re growing. Not what&apos;s broken
                and in need of repair — that&apos;s told everywhere
                already — but what&apos;s alive, already healing, already worth
                passing on.
              </p>
            </div>
          )}

          {/* Place picker — grounded in a subtle container */}
          <div
            style={{
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(6px)",
              padding: "14px 16px",
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              style={selectStyle}
            >
              <option value="">Choose a state</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {selectedState && (
              <select
                value={selectedCounty}
                onChange={(e) => handleCountyChange(e.target.value)}
                style={selectStyle}
              >
                <option value="">Choose a county</option>
                {counties.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
          </div>
        </section>

        {/* ── STORIES / EMPTY STATE — only when place is chosen ── */}
        {hasPlace && !loading && (
          <>
            {stories.length > 0 ? (
              <section style={cardStyle}>
                <div
                  style={{
                    ...headingStyle,
                    fontSize: 18,
                    marginBottom: 14,
                  }}
                >
                  Stories from here
                </div>

                <div style={{ display: "grid", gap: 14 }}>
                  {stories.map((story) => (
                    <article
                      key={story.id}
                      style={{
                        padding: "16px",
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.07)",
                        background: "rgba(255,255,255,0.04)",
                      }}
                    >
                      {story.title && (
                        <div
                          style={{
                            ...headingStyle,
                            fontSize: 18,
                            marginBottom: 8,
                          }}
                        >
                          {story.title}
                        </div>
                      )}

                      <div
                        style={{
                          ...bodyTextStyle,
                          fontSize: 15,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {story.body}
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          fontSize: 12,
                          color: "rgba(159,184,216,0.65)",
                        }}
                      >
                        {story.county}, {story.state}
                      </div>

                      {story.link && (
                        <div style={{ marginTop: 8 }}>
                          <a
                            href={story.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              textDecoration: "underline",
                              textUnderlineOffset: 3,
                              color: "rgba(235,245,255,0.95)",
                              fontSize: 14,
                            }}
                          >
                            Visit link
                          </a>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <section style={cardStyle}>
                <div
                  style={{
                    ...headingStyle,
                    fontSize: 20,
                    marginBottom: 12,
                  }}
                >
                  This place is waiting for its stories.
                </div>

                <div
                  style={{
                    ...bodyTextStyle,
                    fontSize: 15,
                    marginBottom: 14,
                  }}
                >
                  This place is waiting for the stories that shape the
                  life-supporting expressions already here. If you have
                  something to share, please contribute.
                </div>

                <div
                  style={{
                    ...bodyTextStyle,
                    fontSize: 15,
                  }}
                >
                  Every garden starts with a seed.
                </div>
              </section>
            )}

            {/* CTA */}
            <section style={cardStyle}>
              <div
                style={{
                  ...headingStyle,
                  fontSize: 16,
                  marginBottom: 8,
                }}
              >
                Share a story from this place
              </div>

              <div
                style={{
                  ...bodyTextStyle,
                  fontSize: 14,
                  marginBottom: 12,
                }}
              >
                Stories make visible what&apos;s healing, growing, and becoming
                possible here.
              </div>

              <Link href={addStoryHref} style={goldLinkStyle}>
                Share a story
              </Link>
            </section>

            {/* Constellation */}
            <section style={{ ...cardStyle, marginBottom: 0 }}>
              <div
                style={{
                  ...headingStyle,
                  fontSize: 16,
                  marginBottom: 8,
                }}
              >
                Looking for inspiration from the wider world?
              </div>

              <div
                style={{
                  ...bodyTextStyle,
                  fontSize: 14,
                  marginBottom: 12,
                }}
              >
                Explore stories from other places where people are helping life
                take root in different ways.
              </div>

              <Link href="/constellation" style={goldLinkStyle}>
                Explore the constellation of stories
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
