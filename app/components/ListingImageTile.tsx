"use client";

import { useState } from "react";

type Size = "sm" | "md" | "lg";

type Props = {
  imageUrl: string | null;
  name: string;
  size: Size;
};

const SIZE_SPEC: Record<
  Size,
  {
    width: number | string;
    height: number;
    borderRadius: number;
    fontSize: number;
  }
> = {
  sm: { width: 40, height: 40, borderRadius: 6, fontSize: 13 },
  md: { width: 64, height: 64, borderRadius: 8, fontSize: 18 },
  lg: { width: "100%", height: 128, borderRadius: 8, fontSize: 28 },
};

function getInitials(name: string): string {
  const trimmed = (name || "").trim();
  if (!trimmed) return "?";
  return trimmed.slice(0, 2).toUpperCase();
}

export default function ListingImageTile({ imageUrl, name, size }: Props) {
  const [errored, setErrored] = useState(false);
  const spec = SIZE_SPEC[size];

  const baseStyle: React.CSSProperties = {
    width: spec.width,
    height: spec.height,
    borderRadius: spec.borderRadius,
    flexShrink: 0,
  };

  if (imageUrl && !errored) {
    return (
      <img
        src={imageUrl}
        alt={name}
        onError={() => setErrored(true)}
        style={{
          ...baseStyle,
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  }

  return (
    <div
      aria-label={name}
      style={{
        ...baseStyle,
        background: "#08192d",
        border: "1px solid rgba(255,216,107,0.3)",
        color: "#FFD86B",
        fontWeight: 600,
        fontSize: spec.fontSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: "0.04em",
      }}
    >
      {getInitials(name)}
    </div>
  );
}
