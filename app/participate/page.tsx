"use client";

import { useState } from "react";

export type Listing = {
  id: string;
  name: string;
  category: string;
  description: string;
  website: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  status: "active" | "hidden";
  createdAt: string;
};

const orbs: { left: string; top: string; size: number; opacity: number }[] = [
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

function Atmosphere() {
  return (
    <>
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
    </>
  );
}

export default function MapPage() {
  const [listings, setListings] = useState<Listing[]>([]);

  const DEFAULT_STATUS: "active" | "hidden" = "active";

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

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#0d2a4a",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(44px, 7vw, 72px) 24px 72px",
      }}
    >
      <Atmosphere />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 860,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontSize: "0.82rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            margin: 0,
            marginBottom: 14,
          }}
        >
          Canary Commons
        </p>

        <h1
          style={{
            fontSize: "clamp(1.8rem, 3.8vw, 2.4rem)",
            fontWeight: 650,
            marginBottom: 10,
            color: "rgba(255,255,255,0.96)",
            lineHeight: 1.15,
          }}
        >
          Participate
        </h1>

        <p
          style={{
            marginBottom: 24,
            maxWidth: 720,
            color: "rgba(255,255,255,0.85)",
            fontSize: "1.02rem",
            lineHeight: 1.65,
          }}
        >
          Submit a project and it will appear in the review pipeline.
        </p>

        <SubmitProjectForm
          onSubmit={(values) => addListing({ ...values, status: DEFAULT_STATUS })}
        />

        <div style={{ height: 20 }} />

        {listings.length > 0 && (
          <section
            style={{
              borderRadius: 22,
              border: "1px solid rgba(255,255,255,0.6)",
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(12px)",
              padding: "clamp(20px, 3vw, 28px)",
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginTop: 0,
                marginBottom: 14,
                color: "#0d2a4a",
              }}
            >
              Submitted in this session
            </h2>

            <ul style={{ margin: 0, paddingLeft: 18, color: "#3a5a7a" }}>
              {listings.map((listing) => (
                <li key={listing.id} style={{ marginBottom: 12 }}>
                  <b style={{ color: "#0d2a4a" }}>{listing.name}</b> — {listing.category}
                  <div style={{ fontSize: 14, marginTop: 4, color: "#3a5a7a" }}>
                    {listing.description}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
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

  const labelTextStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    color: "#0d2a4a",
  };

  return (
    <section
      style={{
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.6)",
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(12px)",
        padding: "clamp(24px, 4vw, 36px)",
      }}
    >
      <h2
        style={{
          fontSize: 20,
          fontWeight: 650,
          marginTop: 0,
          marginBottom: 16,
          color: "#0d2a4a",
        }}
      >
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
            website: website.trim(),
            city: city.trim(),
            state: state.trim(),
            lat: latNum,
            lng: lngNum,
            status: "active",
          });

          reset();
        }}
        style={{ display: "grid", gap: 14 }}
      >
        <label>
          <div style={labelTextStyle}>Name *</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label>
          <div style={labelTextStyle}>Category</div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ ...inputStyle, appearance: "none" }}
          >
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
          <div style={labelTextStyle}>Description *</div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>

        <label>
          <div style={labelTextStyle}>Website (optional)</div>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://…"
            style={inputStyle}
          />
        </label>

        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
          <label>
            <div style={labelTextStyle}>City (optional)</div>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label>
            <div style={labelTextStyle}>State (optional)</div>
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={inputStyle}
            />
          </label>
        </div>

        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
          <label>
            <div style={labelTextStyle}>Latitude *</div>
            <input
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="42.1946"
              style={inputStyle}
            />
          </label>

          <label>
            <div style={labelTextStyle}>Longitude *</div>
            <input
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="-122.7095"
              style={inputStyle}
            />
          </label>
        </div>

        <button type="submit" style={buttonStyle}>
          Add to Map
        </button>
      </form>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 12,
  border: "1px solid rgba(100,150,220,0.25)",
  background: "rgba(255,255,255,0.9)",
  color: "#0d2a4a",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  marginTop: 4,
  padding: "15px 24px",
  borderRadius: 999,
  border: "none",
  background: "#FFD86B",
  color: "#1a2a0e",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 0 28px rgba(255,216,107,0.35), 0 4px 14px rgba(255,200,80,0.22)",
};
