import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import ConstellationAtmosphere from "../ConstellationAtmosphere";
import LinkCard from "../LinkCard";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: topic } = await supabaseAdmin
    .from("constellation_topics")
    .select("title, subheader")
    .eq("slug", slug)
    .maybeSingle();

  if (!topic) return { title: "Constellation — Canary Commons" };

  return {
    title: `${topic.title} — Constellation — Canary Commons`,
    description: topic.subheader,
  };
}

type Topic = {
  id: string;
  slug: string;
  title: string;
  subheader: string;
};

type ConstellationExample = {
  id: string;
  title: string;
  url: string;
  summary: string;
  favicon_url: string | null;
};

type ExampleApproachJoin = {
  sort_order: number;
  constellation_examples: ConstellationExample | null;
};

type Approach = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  constellation_example_approaches: ExampleApproachJoin[];
};

const GOLD = "#FFD86B";

export default async function ConstellationTopicPage({ params }: Props) {
  const { slug } = await params;

  const { data: topic } = await supabaseAdmin
    .from("constellation_topics")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<Topic>();

  if (!topic) notFound();

  const { data: approachRows } = await supabaseAdmin
    .from("constellation_approaches")
    .select(`
      id, name, description, sort_order,
      constellation_example_approaches (
        sort_order,
        constellation_examples ( id, title, url, summary, favicon_url )
      )
    `)
    .eq("topic_id", topic.id)
    .order("sort_order", { ascending: true });

  const approaches: Approach[] = (approachRows ?? []) as unknown as Approach[];

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
          maxWidth: 780,
          margin: "0 auto",
          padding: "clamp(80px, 12vw, 120px) 24px clamp(60px, 8vw, 100px)",
        }}
      >
        {/* Back link */}
        <div style={{ marginBottom: 40 }}>
          <Link
            href="/constellation"
            style={{
              fontSize: "0.85rem",
              color: "rgba(211,227,247,0.5)",
              textDecoration: "none",
            }}
          >
            ← All topics
          </Link>
        </div>

        {/* Topic header */}
        <div style={{ marginBottom: "clamp(40px, 5vw, 60px)" }}>
          <p
            style={{
              fontSize: "0.78rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,216,107,0.5)",
              margin: "0 0 14px",
            }}
          >
            Constellation
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              fontWeight: 700,
              lineHeight: 1.12,
              color: GOLD,
              margin: "0 0 18px",
              textShadow:
                "0 0 40px rgba(255,216,107,0.2), 0 0 80px rgba(255,200,80,0.08)",
            }}
          >
            {topic.title}
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
              lineHeight: 1.65,
              color: "rgba(211,227,247,0.65)",
              margin: 0,
              maxWidth: 580,
            }}
          >
            {topic.subheader}
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            marginBottom: "clamp(32px, 4vw, 48px)",
          }}
        />

        {/* Approaches or empty state */}
        {approaches.length === 0 ? (
          <p
            style={{
              color: "rgba(211,227,247,0.4)",
              fontSize: "0.95rem",
              fontStyle: "italic",
            }}
          >
            Content coming soon.
          </p>
        ) : (
          <div>
            {approaches.map((approach, idx) => {
              // Sort examples by their join-table sort_order
              const examples = [...approach.constellation_example_approaches]
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map((cea) => cea.constellation_examples)
                .filter((ex): ex is ConstellationExample => ex !== null);

              return (
                <div key={approach.id}>
                  {/* Approach name */}
                  <h2
                    style={{
                      fontSize: "clamp(1.15rem, 2vw, 1.45rem)",
                      fontWeight: 650,
                      color: "rgba(255,216,107,0.85)",
                      margin: "0 0 10px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {approach.name}
                  </h2>

                  {/* Approach description */}
                  {approach.description && (
                    <p
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        color: "rgba(211,227,247,0.55)",
                        margin: "0 0 20px",
                        maxWidth: 580,
                      }}
                    >
                      {approach.description}
                    </p>
                  )}

                  {/* Example LinkCards */}
                  {examples.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
                      {examples.map((ex) => (
                        <LinkCard
                          key={ex.id}
                          url={ex.url}
                          title={ex.title}
                          summary={ex.summary}
                          favicon_url={ex.favicon_url}
                        />
                      ))}
                    </div>
                  )}

                  {/* Thin divider between approaches, not after last */}
                  {idx < approaches.length - 1 && (
                    <div
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        margin: "clamp(24px, 3vw, 36px) 0",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Suggest a link footer */}
        <div style={{ marginTop: 52, textAlign: "center" }}>
          <Link
            href={`/constellation/submit?topic=${topic.id}`}
            style={{
              fontSize: "0.85rem",
              color: "rgba(211,227,247,0.42)",
              textDecoration: "none",
            }}
          >
            Suggest a link for this topic →
          </Link>
        </div>
      </div>
    </main>
  );
}
