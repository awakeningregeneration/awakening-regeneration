import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import ConstellationAtmosphere from "./ConstellationAtmosphere";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Constellation — Canary Commons",
  description:
    "A world of solutions, strategies, and answers to the most challenging problems on earth.",
};

type Topic = {
  id: string;
  slug: string;
  title: string;
  subheader: string;
  sort_order: number;
  created_at: string;
};

const GOLD = "#FFD86B";

export default async function ConstellationPage() {
  const { data: topics } = await supabaseAdmin
    .from("constellation_topics")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const list: Topic[] = topics ?? [];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050e1a",
        color: "white",
        position: "relative",
      }}
    >
      <ConstellationAtmosphere />

      {/* Logo */}
      <div style={{ position: "fixed", top: 18, left: 24, zIndex: 10 }}>
        <img
          src="/canary-logo-new.png"
          alt="Canary Commons"
          style={{
            width: "clamp(140px, 18vw, 200px)",
            height: "auto",
            display: "block",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
          }}
        />
      </div>

      {/* Page content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(80px, 12vw, 120px) 24px clamp(60px, 8vw, 100px)",
        }}
      >
        {/* Header */}
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto clamp(48px, 6vw, 72px)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.78rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,216,107,0.55)",
              margin: "0 0 14px",
            }}
          >
            Canary Commons
          </p>
          <h1
            style={{
              fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: GOLD,
              margin: "0 0 20px",
              textShadow:
                "0 0 40px rgba(255,216,107,0.22), 0 0 80px rgba(255,200,80,0.1)",
            }}
          >
            Constellation
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
              lineHeight: 1.65,
              color: "rgba(211,227,247,0.72)",
              margin: 0,
            }}
          >
            A world of solutions, strategies, and answers to the most
            challenging problems on earth.
          </p>
        </div>

        {/* Topic grid */}
        {list.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "rgba(211,227,247,0.45)",
              fontSize: "0.95rem",
              fontStyle: "italic",
            }}
          >
            Topics coming soon.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {list.map((topic) => (
              <Link
                key={topic.id}
                href={`/constellation/${topic.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    padding: "28px 28px 26px",
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background:
                      "radial-gradient(ellipse at 50% 0%, rgba(20,55,120,0.22) 0%, rgba(5,14,26,0.6) 100%)",
                    backdropFilter: "blur(8px)",
                    cursor: "pointer",
                    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
                    height: "100%",
                    boxSizing: "border-box" as const,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,216,107,0.35)";
                    e.currentTarget.style.boxShadow =
                      "0 0 32px rgba(255,216,107,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 10px",
                      fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
                      fontWeight: 650,
                      color: "rgba(255,248,220,0.95)",
                      lineHeight: 1.3,
                    }}
                  >
                    {topic.title}
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.88rem",
                      lineHeight: 1.6,
                      color: "rgba(211,227,247,0.58)",
                    }}
                  >
                    {topic.subheader}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer link */}
        <div style={{ marginTop: 64, textAlign: "center" }}>
          <Link
            href="/constellation/submit"
            style={{
              fontSize: "0.85rem",
              color: "rgba(211,227,247,0.45)",
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(255,216,107,0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(211,227,247,0.45)";
            }}
          >
            Suggest a link or topic →
          </Link>
        </div>
      </div>
    </main>
  );
}
