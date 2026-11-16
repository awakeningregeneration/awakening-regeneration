"use client";

import Link from "next/link";

type Props = {
  href: string;
  name: string;
  exampleCount: number;
};

export default function ApproachRow({ href, name, exampleCount }: Props) {
  const hasContent = exampleCount > 0;

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "18px 22px",
          borderRadius: 14,
          border: hasContent
            ? "1px solid rgba(255,216,107,0.16)"
            : "1px solid rgba(255,255,255,0.07)",
          background: hasContent
            ? "rgba(255,216,107,0.03)"
            : "rgba(255,255,255,0.015)",
          cursor: "pointer",
          transition: "border-color 0.18s ease, background 0.18s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = hasContent
            ? "rgba(255,216,107,0.4)"
            : "rgba(255,255,255,0.16)";
          e.currentTarget.style.background = hasContent
            ? "rgba(255,216,107,0.06)"
            : "rgba(255,255,255,0.035)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = hasContent
            ? "rgba(255,216,107,0.16)"
            : "rgba(255,255,255,0.07)";
          e.currentTarget.style.background = hasContent
            ? "rgba(255,216,107,0.03)"
            : "rgba(255,255,255,0.015)";
        }}
      >
        <span
          style={{
            fontSize: "clamp(1rem, 1.3vw, 1.1rem)",
            fontWeight: 600,
            color: hasContent ? "rgba(255,238,200,0.95)" : "rgba(255,248,220,0.68)",
            lineHeight: 1.35,
          }}
        >
          {name}
        </span>

        {hasContent ? (
          <span
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.82rem",
              color: "rgba(255,216,107,0.75)",
              whiteSpace: "nowrap",
            }}
          >
            {exampleCount} {exampleCount === 1 ? "entry" : "entries"}
            <span>→</span>
          </span>
        ) : (
          <span
            style={{
              flexShrink: 0,
              fontSize: "0.78rem",
              fontStyle: "italic",
              color: "rgba(211,227,247,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            Coming soon
          </span>
        )}
      </div>
    </Link>
  );
}
