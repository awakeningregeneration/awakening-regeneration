"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import type { Listing } from "../../types/listing";
import ListingImageTile from "./ListingImageTile";
import { getListingImage } from "../../lib/getListingImage";

type Props = {
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
};

function preview(text: string, maxChars = 110) {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars).trimEnd() + "…";
}

export default function SidebarList({
  listings,
  selectedId,
  onSelect,
  search,
  setSearch,
  category,
  setCategory,
}: Props) {
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
  <div style={{ padding: 16, width: 360, overflowY: "auto", background: "#f8fafc" }}>
    <div style={{ marginBottom: 16 }}>
      <input
        type="text"
        placeholder="Search by name, city, state, or category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          marginBottom: 10,
          borderRadius: 8,
          border: "1px solid #d1d5db",
          fontSize: 14,
        }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #d1d5db",
          fontSize: 14,
          background: "white",
        }}
      >
        <option value="All">All categories</option>
        {[...new Set(listings.map((listing) => listing.category))]
          .sort()
          .map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
      </select>
    </div>

    {listings.map((listing) => {
        const isSelected = listing.id === selectedId;
        const imageUrl = getListingImage(listing.image_url, listing.website);

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
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <ListingImageTile
              imageUrl={imageUrl}
              name={listing.name}
              size="sm"
            />

            <div style={{ flex: 1, minWidth: 0 }}>
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
                  {preview(listing.description ?? "", 110)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
