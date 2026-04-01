"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AffiliateResource = {
  id?: number;
  name: string;
  description: string;
  url: string;
  category: string;
};

export default function AffiliatesPage() {
  const [resources, setResources] = useState<AffiliateResource[]>([]);

  useEffect(() => {
    fetch("/api/affiliates")
      .then((res) => res.json())
      .then((data) => {
        setResources(data);
      });
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        Support Life Anywhere
      </h1>

      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Affiliate links to aligned resources when local options aren’t available.
      </p>

      <Link href="/affiliates/submit">
        ➕ Add an affiliate link
      </Link>

      <div style={{ marginTop: "2rem" }}>
        {resources.length === 0 ? (
          <p>No affiliate links yet.</p>
        ) : (
          resources.map((r, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ marginBottom: "0.25rem" }}>{r.name}</h3>

              <p style={{ marginBottom: "0.5rem", color: "#444" }}>
                {r.description}
              </p>

              <p style={{ marginBottom: "0.5rem" }}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit →
                </a>
              </p>

              <small style={{ color: "#888" }}>{r.category}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}