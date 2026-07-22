"use client";

import { usePathname } from "next/navigation";

export default function SeederHeader({ handle }: { handle: string }) {
  const pathname = usePathname();

  // Don't show the back link on the dashboard itself
  const isDashboard = pathname === `/${handle}`;

  if (isDashboard) return null;

  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        padding: "12px 20px 0",
      }}
    >
      <a
        href={`/${handle}`}
        style={{
          color: "#6b7c94",
          fontSize: "0.82rem",
          textDecoration: "underline",
          textUnderlineOffset: 2,
        }}
      >
        ← Dashboard
      </a>
    </div>
  );
}
