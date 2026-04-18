"use client";

import { useMemo, useState } from "react";
import MapClient from "@/app/components/MapClient";
import SidebarList from "@/app/components/SidebarList";
import { mockListings } from "@/data/mockListings";
import type { Listing } from "@/types/listing";

export default function MapWithSidebar() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const base = mockListings
      .filter((l) => (category === "All" ? true : l.category === category))
      .filter((l) => {
        if (!q) return true;
        const hay = `${l.name} ${l.city} ${l.state} ${l.category}`.toLowerCase();
        return hay.includes(q);
      })
      // Pre-pop friendly: stable, calming scan order
      .sort((a, b) => {
        const sa = `${a.state}|${a.city}|${a.category}|${a.name}`.toLowerCase();
        const sb = `${b.state}|${b.city}|${b.category}|${b.name}`.toLowerCase();
        return sa.localeCompare(sb);
      });

    // If selection is filtered out, clear it (prevents “ghost selection”)
    if (selectedId && !base.some((l) => l.id === selectedId)) {
      setSelectedId(null);
    }

    return base;
  }, [search, category, selectedId]);

  // For category dropdown, we want categories from the whole dataset, not just filtered.
  const allListings: Listing[] = mockListings;

  return (
    <main
      style={{
        display: "flex",
        height: "calc(100vh - 24px)",
        gap: 0,
        border: "1px solid rgba(0,0,0,0.10)",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <SidebarList
        listings={filtered.length ? filtered : filtered}
        selectedId={selectedId}
        onSelect={setSelectedId}
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <div style={{ flex: 1, padding: 12 }}>
        <MapClient listings={filtered} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </main>
  );
}
