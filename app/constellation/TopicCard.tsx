"use client";

import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  subheader: string;
  /** Whether this topic has at least one approach — determines which of
   * the two visual treatments the card gets (see app/constellation/page.tsx
   * for how this is derived from the existing data). */
  hasContent: boolean;
};

export default function TopicCard({ slug, title, subheader, hasContent }: Props) {
  return (
    <Link href={`/constellation/${slug}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          padding: "28px 28px 26px",
          borderRadius: 18,
          border: hasContent
            ? "1px solid rgba(255,216,107,0.22)"
            : "1px solid rgba(255,255,255,0.07)",
          background: hasContent
            ? "radial-gradient(ellipse at 50% 0%, rgba(255,216,107,0.07) 0%, rgba(20,55,120,0.22) 40%, rgba(5,14,26,0.6) 100%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(20,55,120,0.12) 0%, rgba(5,14,26,0.5) 100%)",
          backdropFilter: "blur(8px)",
          cursor: "pointer",
          transition: "border-color 0.18s ease, box-shadow 0.18s ease",
          height: "100%",
          boxSizing: "border-box",
          boxShadow: hasContent ? "0 0 22px rgba(255,216,107,0.06)" : "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = hasContent
            ? "rgba(255,216,107,0.55)"
            : "rgba(255,255,255,0.18)";
          e.currentTarget.style.boxShadow = hasContent
            ? "0 0 36px rgba(255,216,107,0.18)"
            : "0 0 20px rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = hasContent
            ? "rgba(255,216,107,0.22)"
            : "rgba(255,255,255,0.07)";
          e.currentTarget.style.boxShadow = hasContent
            ? "0 0 22px rgba(255,216,107,0.06)"
            : "none";
        }}
      >
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
            fontWeight: 650,
            color: hasContent ? "#FFE9B8" : "rgba(255,248,220,0.68)",
            lineHeight: 1.3,
            textShadow: hasContent
              ? "0 0 18px rgba(255,216,107,0.25)"
              : "none",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "0.88rem",
            lineHeight: 1.6,
            color: hasContent
              ? "rgba(211,227,247,0.82)"
              : "rgba(211,227,247,0.5)",
          }}
        >
          {subheader}
        </p>

        {hasContent ? (
          <p
            style={{
              margin: "16px 0 0",
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "rgba(255,216,107,0.85)",
            }}
          >
            EXPLORE →
          </p>
        ) : (
          <p
            style={{
              margin: "16px 0 0",
              fontSize: "0.78rem",
              fontStyle: "italic",
              color: "rgba(211,227,247,0.35)",
            }}
          >
            Coming soon
          </p>
        )}
      </div>
    </Link>
  );
}
