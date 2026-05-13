"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OutreachMessageDisplay from "@/app/components/OutreachMessageDisplay";

type Placement = {
  id: string;
  title: string;
  city: string | null;
  state: string | null;
  outreach_status: string | null;
  steward_email: string | null;
  steward_id: string | null;
  created_at: string;
  status: string | null;
  bounce_info: string | null;
};

type Credit = {
  id: string;
  listing_id: string;
  amount_cents: number;
  payout_status: string;
  created_at: string;
};

type Props = {
  handle: string;
  seederName: string;
  referralCode: string | null;
  placements: Placement[];
  credits: Credit[];
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.canarycommons.org";

// Morning-sky orbs (same pattern as orientation + placement pages)
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
 * Status badge mapping.
 * Forward-compatible: includes commented-out soft_opt_out case
 * for Stage G when do_not_list_level field exists on listings.
 * See OPT_OUT_LAYERS.md.
 */
function getStatusBadge(
  outreachStatus: string | null,
  stewardEmail: string | null,
  listingStatus: string | null
): { label: string; color: string } {
  // Stage G: soft opt-out check will go here
  // if (listingStatus === 'removed' && doNotListLevel === 'seeder_only')
  //   return { label: "Soft opt-out", color: "rgba(148,170,196,0.5)" };

  switch (outreachStatus) {
    case "not_started":
      return stewardEmail
        ? {
            label: "Awaiting first email",
            color: "rgba(148,196,236,0.6)",
          }
        : { label: "No steward email", color: "rgba(148,196,236,0.4)" };
    case "email_1_sent":
      return { label: "Email 1 sent", color: "rgba(255,216,107,0.7)" };
    case "email_2_sent":
      return { label: "Email 2 sent", color: "rgba(255,200,80,0.7)" };
    case "email_3_sent":
      return {
        label: "Sequence complete",
        color: "rgba(255,180,60,0.7)",
      };
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

function humanizeBounceInfo(info: string | null): string {
  if (!info) return "The outreach email could not be delivered.";
  if (info.includes("complained") || info.includes("spam"))
    return "The recipient marked this email as spam.";
  if (info.includes("does not exist") || info.includes("not found"))
    return "The email address doesn't appear to exist.";
  if (info.includes("full") || info.includes("over quota"))
    return "The recipient's mailbox is full.";
  const msg = info.replace(/^email\.(bounced|complained):\s*/, "");
  return msg || "The outreach email could not be delivered.";
}

export default function DashboardClient({
  handle,
  seederName,
  referralCode,
  placements,
  credits,
}: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [expandedBounceId, setExpandedBounceId] = useState<string | null>(null);
  const [showOutreachModal, setShowOutreachModal] = useState(false);

  // Suppress unused variable — referralCode reserved for future use
  void referralCode;

  function handleCopyLink() {
    const url = `${siteUrl}/${handle}/join`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Derived counts for status summary
  const totalPlaced = placements.length;
  const inOutreach = placements.filter((p) =>
    p.outreach_status?.startsWith("email_")
  ).length;
  const claimed = placements.filter(
    (p) => p.outreach_status === "claimed"
  ).length;

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#0d2a4a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Outreach message modal */}
      {showOutreachModal && (
        <div
          onClick={() => setShowOutreachModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.4)",
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
              maxHeight: "85vh",
              overflow: "auto",
              borderRadius: 22,
              border: "1px solid rgba(255,255,255,0.6)",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              padding: "clamp(24px, 4vw, 36px)",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 650,
                color: "#8a6d2a",
                margin: "0 0 8px",
              }}
            >
              Copy this outreach message
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#3a5a7a",
                lineHeight: 1.5,
                margin: "0 0 16px",
              }}
            >
              Use this when reaching out by web form, chat, social DM,
              phone, or in person. Replace the bracketed placeholders
              before sending.
            </p>
            <OutreachMessageDisplay />
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <button
                type="button"
                onClick={() => setShowOutreachModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7c94",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
          {/* ── (a) HEADER ── */}
          <h2
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
              lineHeight: 1.3,
              fontWeight: 650,
              color: "#8a6d2a",
              margin: "0 0 16px",
              textAlign: "center",
            }}
          >
            Welcome, {seederName}.
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 28,
            }}
          >
            <Link
              href={`/${handle}/place`}
              style={{
                display: "inline-block",
                padding: "12px 24px",
                borderRadius: 999,
                border: "none",
                background: "#FFD86B",
                color: "#1a2a0e",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow:
                  "0 0 20px rgba(255,216,107,0.25), 0 4px 14px rgba(255,200,80,0.18)",
              }}
            >
              Place a new light
            </Link>
            <button
              type="button"
              onClick={() => setShowOutreachModal(true)}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                border: "1px solid rgba(138,109,42,0.2)",
                background: "rgba(255,248,230,0.35)",
                color: "rgba(138,109,42,0.7)",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              Copy outreach message
            </button>
          </div>

          {/* ── (b) STATUS SUMMARY ── */}
          {totalPlaced > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: 6,
                }}
              >
                {[
                  { count: totalPlaced, label: "placed" },
                  { count: inOutreach, label: "in outreach" },
                  { count: claimed, label: "claimed" },
                ].map(({ count, label }) => (
                  <div key={label} style={{ fontSize: "0.92rem", color: "#2a3a4a" }}>
                    <strong style={{ fontWeight: 700, color: "#0d2a4a" }}>
                      {count}
                    </strong>{" "}
                    {label}
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "#6b7c94",
                  textAlign: "center",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                Your contribution to the commons.
              </p>
            </div>
          )}

          {/* ── (c) PLACEMENTS LIST ── */}
          <div style={{ marginBottom: 28 }}>
            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: 650,
                color: "#8a6d2a",
                margin: "0 0 14px",
              }}
            >
              Your placements
            </h3>

            {placements.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#3a5a7a",
                    margin: "0 0 16px",
                  }}
                >
                  You haven&apos;t placed any lights yet.
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
                  Place your first light
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
                {placements.map((p) => {
                  const badge = getStatusBadge(
                    p.outreach_status,
                    p.steward_email,
                    p.status
                  );
                  const location = [p.city, p.state]
                    .filter(Boolean)
                    .join(", ");
                  const date = new Date(p.created_at).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  );
                  const isBounced = p.outreach_status === "bounced";
                  const isClaimed = !!p.steward_id;

                  return (
                    <div key={p.id}>
                      <div
                        onClick={() => {
                          if (isClaimed) return;
                          if (isBounced) {
                            setExpandedBounceId(
                              expandedBounceId === p.id ? null : p.id
                            );
                          } else {
                            router.push(`/edit/${p.id}`);
                          }
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 16px",
                          borderRadius:
                            expandedBounceId === p.id
                              ? "12px 12px 0 0"
                              : 12,
                          border: "1px solid rgba(100,150,220,0.15)",
                          background: "rgba(255,255,255,0.5)",
                          cursor: isClaimed ? "default" : "pointer",
                          transition: "background 0.15s",
                          opacity: isClaimed ? 0.6 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!isClaimed)
                            (e.currentTarget as HTMLElement).style.background =
                              "rgba(255,255,255,0.75)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isClaimed)
                            (e.currentTarget as HTMLElement).style.background =
                              "rgba(255,255,255,0.5)";
                        }}
                      >
                        {/* Title + location */}
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
                          {location && (
                            <div
                              style={{
                                fontSize: "0.82rem",
                                color: "#6b7c94",
                                marginTop: 2,
                              }}
                            >
                              {location}
                            </div>
                          )}
                          {isClaimed && (
                            <div
                              style={{
                                fontSize: "0.78rem",
                                color: "#8a9ab0",
                                marginTop: 4,
                                fontStyle: "italic",
                              }}
                            >
                              Listing claimed by steward, no longer needs
                              tending
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

                      {/* Bounce info inline panel */}
                      {expandedBounceId === p.id && isBounced && (
                        <div
                          style={{
                            padding: "14px 16px",
                            marginTop: -1,
                            marginBottom: 8,
                            borderRadius: "0 0 12px 12px",
                            border: "1px solid rgba(200,120,120,0.2)",
                            borderTop: "none",
                            background: "rgba(255,245,245,0.5)",
                            fontSize: "0.88rem",
                            lineHeight: 1.6,
                            color: "#2a3a4a",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 650,
                              color: "#0d2a4a",
                              marginBottom: 8,
                            }}
                          >
                            This email bounced
                          </div>
                          <p style={{ margin: "0 0 8px", color: "#6b7c94" }}>
                            {humanizeBounceInfo(p.bounce_info)}
                          </p>
                          <p style={{ margin: "0 0 14px" }}>
                            This email didn&apos;t reach who you intended. If
                            you can find another way to contact this business,
                            you might try again with a different address. If
                            not, this listing stays exactly where it is —
                            visible on the map, just without active outreach.
                          </p>
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              alignItems: "center",
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/edit/${p.id}`);
                              }}
                              style={{
                                padding: "8px 18px",
                                borderRadius: 999,
                                border: "none",
                                background: "#FFD86B",
                                color: "#1a2a0e",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                cursor: "pointer",
                              }}
                            >
                              View listing
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedBounceId(null);
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#6b7c94",
                                fontSize: "0.85rem",
                                cursor: "pointer",
                                textDecoration: "underline",
                                textUnderlineOffset: 2,
                              }}
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── (d) CREDITS PANEL ── */}
          {/* Note: Stage G's "Soft opt-outs" section will land above this,
              between placements list and credits panel. See OPT_OUT_LAYERS.md. */}
          <div style={{ marginBottom: 28 }}>
            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: 650,
                color: "#8a6d2a",
                margin: "0 0 14px",
              }}
            >
              Recognition credits
            </h3>

            {credits.length === 0 ? (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#6b7c94",
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                Credits accumulate when listings you&apos;ve placed convert to
                Founders. They appear here as the work grows.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {credits.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid rgba(100,150,220,0.15)",
                      background: "rgba(255,255,255,0.5)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span style={{ color: "#0d2a4a" }}>
                      ${(c.amount_cents / 100).toFixed(2)}
                    </span>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "#8a9ab0",
                        textTransform: "capitalize",
                      }}
                    >
                      {c.payout_status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── (d1) CROSS-SEEDER VIEW LINK ── */}
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <Link
              href={`/${handle}/map-view`}
              style={{
                fontSize: "0.82rem",
                color: "rgba(58,90,122,0.6)",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
            >
              All placements across the commons &rarr;
            </Link>
          </div>

          {/* ── (d2) DIRECT INVITATION LINK ── */}
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "rgba(107,124,148,0.7)",
                marginBottom: 6,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Your direct invitation link
            </div>
            <button
              onClick={handleCopyLink}
              style={{
                display: "inline-block",
                padding: "7px 14px",
                borderRadius: 8,
                border: "1px solid rgba(138,109,42,0.2)",
                background: "rgba(255,248,230,0.35)",
                color: "rgba(138,109,42,0.7)",
                fontSize: "0.78rem",
                fontWeight: 600,
                fontFamily: "monospace",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.15s",
              }}
            >
              {copied ? "✓ Copied!" : `${siteUrl}/${handle}/join`}
            </button>
          </div>

          {/* ── (e) FOOTER ── */}
          <div style={{ textAlign: "center" }}>
            <Link
              href={`/${handle}/start`}
              style={{
                fontSize: 13,
                color: "rgba(107,124,148,0.6)",
                textDecoration: "none",
                transition: "color 0.15s",
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
