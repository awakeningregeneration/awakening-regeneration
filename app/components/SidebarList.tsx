"use client";

import { useEffect, useRef } from "react";
import type { Listing } from "../../types/listing";

type Props = {
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function preview(text: string, maxChars = 110) {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars).trimEnd() + "…";
}

export default function SidebarList({ listings, selectedId, onSelect }: Props) {
  // Keep refs to each card so we can scroll to the selected one
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // When selection changes, scroll it into view
  useEffect(() => {
    if (!selectedId) return;

    const el = itemRefs.current[selectedId];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center", // centers it in the visible list area
      });
    }
  }, [selectedId]);

  return (
    <div style={{ padding: 16 }}>
      {listings.map((listing) => {
        const isSelected = listing.id === selectedId;

        return (
          <div
            key={listing.id}
            ref={(el) => {
              itemRefs.current[listing.id] = el;
            }}
            onClick={() => onSelect(listing.id)}
            style={{
              border: isSelected ? "2px solid #f97316" : "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              cursor: "pointer",
              background: isSelected ? "#fff7ed" : "white",
            }}
          >
            {/* Title */}
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {listing.name}
            </div>

            {/* Meta */}
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              {listing.category} • {listing.city}, {listing.state}
            </div>

            {/* Preview ONLY when not selected */}
            {!isSelected && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: "#374151",
                  lineHeight: 1.35,
                }}
              >
                {preview(listing.description, 110)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
