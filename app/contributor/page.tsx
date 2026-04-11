"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ContributorResource {
  id: string;
  name: string;
  category: string;
  status: string;
  created_at: string;
}

export default function ContributorDashboard() {
  const [resources, setResources] = useState<ContributorResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await fetch("/api/contributor");
        if (res.ok) {
          const data = await res.json();
          setResources(data);
        }
      } catch (error) {
        console.error("Failed to fetch contributor resources:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#d3e4f7",
        color: "#1f2a3a",
        padding: "48px 20px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h1 style={{ fontSize: "2rem", margin: 0, fontWeight: 700 }}>
            Contributor Dashboard
          </h1>
          <Link
            href="/contributor/submit"
            style={{
              padding: "12px 20px",
              borderRadius: 999,
              border: "1px solid rgba(31,42,58,0.14)",
              background: "rgba(255,255,255,0.9)",
              color: "#1c4a7d",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Add a resource
          </Link>
        </div>

        {loading ? (
          <p style={{ color: "#5b6b80" }}>Loading...</p>
        ) : resources.length === 0 ? (
          <div
            style={{
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(31,42,58,0.10)",
              borderRadius: 18,
              padding: "28px 24px",
              textAlign: "center",
              color: "#5b6b80",
            }}
          >
            <p style={{ margin: 0 }}>
              No submissions yet.{" "}
              <Link
                href="/contributor/submit"
                style={{ color: "#1c4a7d", fontWeight: 600 }}
              >
                Submit your first resource
              </Link>
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {resources.map((resource) => (
              <div
                key={resource.id}
                style={{
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(31,42,58,0.10)",
                  borderRadius: 18,
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.05rem",
                      fontWeight: 600,
                    }}
                  >
                    {resource.name}
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "0.88rem",
                      color: "#5b6b80",
                    }}
                  >
                    {resource.category} &middot;{" "}
                    {new Date(resource.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    background:
                      resource.status === "approved"
                        ? "#d4edda"
                        : resource.status === "pending"
                        ? "#fff3cd"
                        : "#f0f0f0",
                    color:
                      resource.status === "approved"
                        ? "#155724"
                        : resource.status === "pending"
                        ? "#856404"
                        : "#555",
                  }}
                >
                  {resource.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
