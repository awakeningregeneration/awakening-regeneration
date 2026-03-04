"use client";

import { useMemo, useState } from "react";
import MapClient from "../components/MapClient";

type ListingStatus = "community_submitted" | "pending_review";

export type Listing = {
  id: string;
  name: string;
  category: string;
  description: string;
  website?: string;
  city?: string;
  state?: string;
  lat: number;
  lng: number;
  status: ListingStatus;
  createdAt: string;
};

const starterListings: Listing[] = [
  {
    id: "seed-1",
    name: "Example Regenerative Project",
    category: "Farm",
    description: "Starter listing to prove the pipeline. Replace with real ones.",
    website: "https://example.com",
    city: "Ashland",
    state: "OR",
    lat: 42.1946,
    lng: -122.7095,
    status: "community_submitted",
    createdAt: new Date().toISOString(),
  },
];

export default function MapPage() {
  const [listings, setListings] = useState<Listing[]>(starterListings);

  // Mode A now; Mode B later:
  const DEFAULT_STATUS: ListingStatus = "community_submitted";

  function addListing(newListing: Omit<Listing, "id" | "createdAt">) {
    setListings((prev) => [
      {
        ...newListing,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  const mapCenter = useMemo(() => {
    // Center on first listing if we have one
    const first = listings[0];
    return first ? ([first.lng, first.lat] as [number, number]) : ([-122.7095, 42.1946] as [number, number]);
  }, [listings]);

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Regenerative Map (MVP)
      </h1>
      <p style={{ marginBottom: 16, maxWidth: 860 }}>
        Submit a project and it will appear immediately as <b>Community submitted</b>.
        (We’ll add “Pending review” mode later as traction grows.)
      </p>

      <SubmitProjectForm onSubmit={(values) => addListing({ ...values, status: DEFAULT_STATUS })} />

      <div style={{ height: 16 }} />

      <MapClient />
    </main>
  );
}

function SubmitProjectForm({
  onSubmit,
}: {
  onSubmit: (values: Omit<Listing, "id" | "createdAt">) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Farm");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  function reset() {
    setName("");
    setCategory("Farm");
    setDescription("");
    setWebsite("");
    setCity("");
    setState("");
    setLat("");
    setLng("");
  }

  return (
    <section style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
        Submit a Project
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          const latNum = Number(lat);
          const lngNum = Number(lng);

          if (!name.trim() || !description.trim()) {
            alert("Please add a name and short description.");
            return;
          }
          if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
            alert("Please enter valid latitude and longitude numbers.");
            return;
          }

          onSubmit({
            name: name.trim(),
            category,
            description: description.trim(),
            website: website.trim() || undefined,
            city: city.trim() || undefined,
            state: state.trim() || undefined,
            lat: latNum,
            lng: lngNum,
            status: "community_submitted", // will be overwritten by caller if needed
          });

          reset();
        }}
        style={{ display: "grid", gap: 10, maxWidth: 860 }}
      >
        <label>
          <div style={{ fontSize: 13, marginBottom: 4 }}>Name *</div>
          <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </label>

        <label>
          <div style={{ fontSize: 13, marginBottom: 4 }}>Category</div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            <option>Farm</option>
            <option>Nonprofit</option>
            <option>School</option>
            <option>Community</option>
            <option>Maker</option>
            <option>Healing</option>
            <option>Land Project</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          <div style={{ fontSize: 13, marginBottom: 4 }}>Description *</div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={inputStyle} />
        </label>

        <label>
          <div style={{ fontSize: 13, marginBottom: 4 }}>Website (optional)</div>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" style={inputStyle} />
        </label>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
          <label>
            <div style={{ fontSize: 13, marginBottom: 4 }}>City (optional)</div>
            <input value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} />
          </label>
          <label>
            <div style={{ fontSize: 13, marginBottom: 4 }}>State (optional)</div>
            <input value={state} onChange={(e) => setState(e.target.value)} style={inputStyle} />
          </label>
        </div>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
          <label>
            <div style={{ fontSize: 13, marginBottom: 4 }}>Latitude *</div>
            <input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="42.1946" style={inputStyle} />
          </label>
          <label>
            <div style={{ fontSize: 13, marginBottom: 4 }}>Longitude *</div>
            <input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="-122.7095" style={inputStyle} />
          </label>
        </div>

        <button type="submit" style={buttonStyle}>
          Add to Map (Community submitted)
        </button>
      </form>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.15)",
  fontSize: 14,
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.2)",
  fontWeight: 700,
  cursor: "pointer",
};
