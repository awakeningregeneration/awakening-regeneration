"use client";

import { useState } from "react";
import Link from "next/link";

type Placement = {
  id: string;
  title: string;
  category: string | null;
  city: string | null;
  state: string | null;
  county: string | null;
  address: string | null;
  created_at: string;
  outreach_status: string | null;
  status: string | null;
  placed_by_seeder_id: string | null;
};

type Props = {
  handle: string;
  placements: Placement[];
  seederMap: Record<string, string>;
  states: string[];
  countiesByState: Record<string, string[]>;
};

// Morning-sky orbs (same pattern as dashboard + orientation pages)
const orbs = [
  { left: "6%", top: "8%", size: 5, opacity: 0.6 },
  { left: "18%", top: "15%", size: 3, opacity: 0.45 },
  { left: "32%", top: "6%", size: 6, opacity: 0.65 },
  { left: "48%", top: "22%", size: 4, opacity: 0.5 },
  { left: "64%", top: "12%", size: 7, opacity: 0.7 },
  { left: "82%", top: "18%", size: 4, opacity: 0.55 },
  { left: "10%", top: "38%", size: 6, opacity: 0.65 },
  { left: "42%", top: "44%", size: 3, opacity: 0.4 },
  { left: "72%", top: "40%", size: 8, opacity: 0.7 },
  { left: "22%", top: "68%", size: 5, opacity: 0.55 },
  { left: "56%", top: "72%", size: 4, opacity: 0.5 },
  { left: "88%", top: "85%", size: 6, opacity: 0.6 },
];

/**
 * Simplified status badge for cross-seeder view.
 * No stewardEmail parameter — that field is private to the
 * placing seeder and never exposed here.
 */
function getStatusBadge(
  outreachStatus: string | null,
  listingStatus: string | null
): { label: string; color: string } {
  // Stage G: soft opt-out check will go here
  void listingStatus;

  switch (outreachStatus) {
    case "not_started":
      return { label: "Awaiting outreach", color: "rgba(148,196,236,0.6)" };
    case "email_1_sent":
      return { label: "Email 1 sent", color: "rgba(255,216,107,0.7)" };
    case "email_2_sent":
      return { label: "Email 2 sent", color: "rgba(255,200,80,0.7)" };
    case "email_3_sent":
      return { label: "Sequence complete", color: "rgba(255,180,60,0.7)" };
    case "claimed":
      return { label: "Claimed", color: "rgba(120,200,140,0.7)" };
    case "removed":
      return { label: "Removed", color: "rgba(148,170,196,0.5)" };
    case "unsubscribed":
      return { label: "Unsubscribed", color: "rgba(196,148,148,0.5)" };
    case "bounced":
      return { label: "Bounced", color: "rgba(200,120,120,0.6)" };
    default:
      return { label: "Unknown", color: "rgba(148,196,236,0.4)" };
  }
}

export default function MapViewClient({
  handle,
  placements,
  seederMap,
  states,
  countiesByState,
}: Props) {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");

  const availableCounties = selectedState
    ? countiesByState[selectedState] || []
    : [];

  const filteredPlacements =
    selectedState && selectedCounty
      ? placements
          .filter(
            (p) => p.state === selectedState && p.county === selectedCounty
          )
          .sort((a, b) =>
            (a.title || "").localeCompare(b.title || "")
          )
      : [];

  function handleStateChange(value: string) {
    setSelectedState(value);
    setSelectedCounty("");
  }

  const selectStyle: React.CSSProperties = {
    flex: "1 1 200px",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(100,150,220,0.2)",
    background: "rgba(255,255,255,0.6)",
    color: "#0d2a4a",
    fontSize: "0.9rem",
    fontWeight: 500,
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%236b7c94' stroke-width='1.5'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    cursor: "pointer",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#0d2a4a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Morning-sky atmosphere */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(180,210,255,0.9) 0%, rgba(120,170,230,0.85) 25%, rgba(70,120,200,0.9) 60%, rgba(30,70,150,1) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.18) 0%, transparent 58%)",
          pointerEvents: "none",
        }}
      />
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: "rgba(255,244,200,0.65)",
            opacity: orb.opacity,
            boxShadow:
              "0 0 8px 3px rgba(255,220,140,0.18), 0 0 20px 5px rgba(255,200,100,0.08)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 820,
          margin: "0 auto",
          padding: "clamp(44px, 7vw, 72px) 20px 72px",
        }}
      >
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.6)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(12px)",
            padding: "clamp(24px, 5vw, 40px)",
          }}
        >
          {/* ── Heading ── */}
          <h2
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
              lineHeight: 1.3,
              fontWeight: 650,
              color: "#8a6d2a",
              margin: "0 0 8px",
              textAlign: "center",
            }}
          >
            All placements across the commons
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#3a5a7a",
              textAlign: "center",
              lineHeight: 1.5,
              margin: "0 0 12px",
            }}
          >
            Browse what seeders are placing across the country.
            <br />
            Useful before placing a new light yourself.
          </p>
          <p
            style={{
              fontSize: "0.82rem",
              color: "#6b7c94",
              textAlign: "center",
              lineHeight: 1.5,
              fontStyle: "italic",
              margin: "0 0 24px",
            }}
          >
            You&apos;ll see only the states and counties where seeders are
            currently working. If the place you&apos;re thinking of isn&apos;t
            here yet, consider it an invitation.
          </p>

          {/* ── Dropdowns ── */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              style={selectStyle}
            >
              <option value="">Select a state</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              disabled={!selectedState}
              style={{
                ...selectStyle,
                opacity: selectedState ? 1 : 0.5,
                cursor: selectedState ? "pointer" : "not-allowed",
              }}
            >
              <option value="">
                {selectedState ? "Select a county" : "Choose a state first"}
              </option>
              {availableCounties.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* ── Content area ── */}
          {!selectedState ? (
            <p
              style={{
                fontSize: "0.9rem",
                color: "#6b7c94",
                textAlign: "center",
                fontStyle: "italic",
                padding: "20px 0",
                margin: 0,
              }}
            >
              Choose a state and county to see placements.
            </p>
          ) : !selectedCounty ? (
            <p
              style={{
                fontSize: "0.9rem",
                color: "#6b7c94",
                textAlign: "center",
                fontStyle: "italic",
                padding: "20px 0",
                margin: 0,
              }}
            >
              Choose a county to see placements.
            </p>
          ) : filteredPlacements.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#3a5a7a",
                  margin: "0 0 16px",
                }}
              >
                No placements here yet — ready to light it up?
              </p>
              <Link
                href={`/${handle}/place`}
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  borderRadius: 999,
                  background: "#FFD86B",
                  color: "#1a2a0e",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  boxShadow:
                    "0 0 20px rgba(255,216,107,0.25), 0 4px 14px rgba(255,200,80,0.18)",
                }}
              >
                Place a light here
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {filteredPlacements.map((p) => {
                const badge = getStatusBadge(p.outreach_status, p.status);
                const date = new Date(p.created_at).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                );
                const seederName = p.placed_by_seeder_id
                  ? seederMap[p.placed_by_seeder_id] || "Seeder"
                  : "Seeder";

                // Build metadata line: Category · Address · Placed by Name
                // Filter nulls so missing address doesn't leave empty segment
                const metaParts = [
                  Array.isArray(p.category) ? p.category.join(" \u00B7 ") : p.category,
                  p.address,
                  `Placed by ${seederName}`,
                ].filter(Boolean);

                return (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: "1px solid rgba(100,150,220,0.15)",
                      background: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {/* Title + metadata */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 650,
                          color: "#0d2a4a",
                          fontSize: "0.95rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.title}
                      </div>
                      {metaParts.length > 0 && (
                        <div
                          style={{
                            fontSize: "0.82rem",
                            color: "#6b7c94",
                            marginTop: 2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {metaParts.join(" \u00B7 ")}
                        </div>
                      )}
                    </div>

                    {/* Status badge */}
                    <div
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: badge.color,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#0d2a4a",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {badge.label}
                    </div>

                    {/* Date */}
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "#8a9ab0",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {date}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Footer ── */}
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link
              href={`/${handle}`}
              style={{
                fontSize: 13,
                color: "rgba(107,124,148,0.6)",
                textDecoration: "none",
                marginRight: 20,
              }}
            >
              Back to dashboard
            </Link>
            <Link
              href={`/${handle}/start`}
              style={{
                fontSize: 13,
                color: "rgba(107,124,148,0.6)",
                textDecoration: "none",
              }}
            >
              Revisit orientation
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
