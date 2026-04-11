"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ContributorResource {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  logo_url: string | null;
  category: string;
  practices: string[] | null;
  why_it_matters: string | null;
  affiliate_url: string | null;
  status: string;
  created_at: string;
}

function getDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function ResourceVisual({
  resource,
  size = 48,
}: {
  resource: ContributorResource;
  size?: number;
}) {
  const [imgError, setImgError] = useState(false);
  const domain = getDomain(resource.url);
  const logoSrc = resource.logo_url
    ? resource.logo_url
    : domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : null;

  if (logoSrc && !imgError) {
    return (
      <img
        src={logoSrc}
        alt=""
        width={size}
        height={size}
        onError={() => setImgError(true)}
        style={{ borderRadius: 10, objectFit: "contain" }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: "rgba(201,148,58,0.14)",
        color: "#c9943a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.44,
        flexShrink: 0,
      }}
    >
      {resource.name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

export default function ContributorDashboard() {
  const [resources, setResources] = useState<ContributorResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await fetch("/api/contributor");
        if (res.ok) {
          setResources(await res.json());
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
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                marginBottom: 4,
                fontSize: "1.05rem",
                color: "#506178",
              }}
            >
              Welcome, Lucia
            </p>
            <h1 style={{ fontSize: "2rem", margin: 0, fontWeight: 700 }}>
              Contributor Dashboard
            </h1>
          </div>
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
          <div style={{ display: "grid", gap: 20 }}>
            {resources.map((resource) => {
              const visitUrl =
                resource.affiliate_url || resource.url || "#";

              return (
                <article
                  key={resource.id}
                  style={{
                    background: "rgba(255,255,255,0.78)",
                    borderRadius: 20,
                    border: "1px solid rgba(31,42,58,0.08)",
                    padding: "28px 28px 24px",
                    boxShadow: "0 2px 12px rgba(31,42,58,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 16,
                    }}
                  >
                    <ResourceVisual resource={resource} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#70839a",
                          marginBottom: 6,
                        }}
                      >
                        {resource.category || "Uncategorized"}
                      </div>
                      <h2
                        style={{
                          fontSize: "1.12rem",
                          lineHeight: 1.3,
                          margin: 0,
                          fontWeight: 700,
                        }}
                      >
                        {resource.name}
                      </h2>
                    </div>
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: 999,
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
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

                  {resource.description && (
                    <p
                      style={{
                        fontSize: "0.98rem",
                        lineHeight: 1.65,
                        color: "#556679",
                        margin: 0,
                      }}
                    >
                      {resource.description}
                    </p>
                  )}

                  {resource.why_it_matters && (
                    <p
                      style={{
                        fontSize: "0.92rem",
                        lineHeight: 1.6,
                        color: "#6b7d92",
                        margin: 0,
                        fontStyle: "italic",
                        borderLeft: "3px solid rgba(201,148,58,0.35)",
                        paddingLeft: 14,
                      }}
                    >
                      {resource.why_it_matters}
                    </p>
                  )}

                  {resource.practices?.length ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 7,
                      }}
                    >
                      {resource.practices.map((practice) => (
                        <span
                          key={practice}
                          style={{
                            fontSize: "0.82rem",
                            color: "#70839a",
                            border: "1px solid rgba(31,42,58,0.10)",
                            borderRadius: 999,
                            padding: "5px 11px",
                            background: "rgba(255,255,255,0.6)",
                          }}
                        >
                          {practice}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 4,
                    }}
                  >
                    <a
                      href={visitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        padding: "11px 20px",
                        borderRadius: 999,
                        border: "1px solid rgba(31,42,58,0.14)",
                        color: "#1c4a7d",
                        fontWeight: 700,
                        fontSize: "0.92rem",
                        textDecoration: "underline",
                        textUnderlineOffset: 3,
                        background: "rgba(255,255,255,0.65)",
                      }}
                    >
                      Visit resource
                    </a>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        color: "#8a9ab0",
                      }}
                    >
                      {new Date(resource.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
