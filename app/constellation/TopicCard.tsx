"use client";

import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  subheader: string;
};

export default function TopicCard({ slug, title, subheader }: Props) {
  return (
    <Link href={`/constellation/${slug}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          padding: "28px 28px 26px",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.1)",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(20,55,120,0.22) 0%, rgba(5,14,26,0.6) 100%)",
          backdropFilter: "blur(8px)",
          cursor: "pointer",
          transition: "border-color 0.18s ease, box-shadow 0.18s ease",
          height: "100%",
          boxSizing: "border-box",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,216,107,0.35)";
          e.currentTarget.style.boxShadow = "0 0 32px rgba(255,216,107,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
            fontWeight: 650,
            color: "rgba(255,248,220,0.95)",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "0.88rem",
            lineHeight: 1.6,
            color: "rgba(211,227,247,0.82)",
          }}
        >
          {subheader}
        </p>
      </div>
    </Link>
  );
}
