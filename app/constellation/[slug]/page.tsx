import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import ConstellationAtmosphere from "../ConstellationAtmosphere";
import LinkCard from "../LinkCard";
import ApproachRow from "../ApproachRow";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ approach?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { approach: approachId } = await searchParams;

  const { data: topic } = await supabaseAdmin
    .from("constellation_topics")
    .select("title, subheader")
    .eq("slug", slug)
    .maybeSingle();

  if (!topic) return { title: "Constellation — Canary Commons" };

  if (approachId) {
    const { data: approach } = await supabaseAdmin
      .from("constellation_approaches")
      .select("name, description")
      .eq("id", approachId)
      .maybeSingle();

    if (approach) {
      return {
        title: `${approach.name} — ${topic.title} — Constellation — Canary Commons`,
        description: approach.description || topic.subheader,
      };
    }
  }

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

export default async function ConstellationTopicPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { approach: approachId } = await searchParams;

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

  // Resolve each approach's examples once, in sort order, so both the
  // list view (just needs a count) and the detail view (needs the full
  // list) work from the same derived data.
  const approachesWithExamples = approaches.map((approach) => ({
    ...approach,
    examples: [...approach.constellation_example_approaches]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((cea) => cea.constellation_examples)
      .filter((ex): ex is ConstellationExample => ex !== null),
  }));

  // Drill-down state lives in the URL (?approach=<id>) rather than client
  // state, so a specific approach is a real, shareable, back-button-safe
  // link. An unrecognized/missing id just falls back to the list view.
  const selectedApproach = approachId
    ? approachesWithExamples.find((a) => a.id === approachId) ?? null
    : null;

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
        {/* Back link — context-aware: from an approach's entries, go back
            to this topic's approach list; from the approach list itself,
            go back to all topics. */}
        <div style={{ marginBottom: 40 }}>
          <Link
            href={selectedApproach ? `/constellation/${slug}` : "/constellation"}
            style={{
              fontSize: "0.85rem",
              color: "rgba(211,227,247,0.72)",
              textDecoration: "none",
            }}
          >
            {selectedApproach ? `← Back to ${topic.title}` : "← All topics"}
          </Link>
        </div>

        {/* Topic header */}
        <div style={{ marginBottom: "clamp(40px, 5vw, 60px)" }}>
          <p
            style={{
              fontSize: "0.78rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,216,107,0.75)",
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
              color: "rgba(211,227,247,0.88)",
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

        {/* Approaches: empty state, scannable list, or one approach's entries */}
        {approachesWithExamples.length === 0 ? (
          <p
            style={{
              color: "rgba(211,227,247,0.4)",
              fontSize: "0.95rem",
              fontStyle: "italic",
            }}
          >
            Content coming soon.
          </p>
        ) : selectedApproach ? (
          /* ── Detail view: just this one approach's entries ── */
          <div>
            <h2
              style={{
                fontSize: "clamp(1.15rem, 2vw, 1.45rem)",
                fontWeight: 650,
                color: "rgba(255,216,107,0.85)",
                margin: "0 0 10px",
                letterSpacing: "-0.01em",
              }}
            >
              {selectedApproach.name}
            </h2>

            {selectedApproach.description && (
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  color: "rgba(211,227,247,0.82)",
                  margin: "0 0 28px",
                  maxWidth: 580,
                }}
              >
                {selectedApproach.description}
              </p>
            )}

            {selectedApproach.examples.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {selectedApproach.examples.map((ex) => (
                  <LinkCard
                    key={ex.id}
                    url={ex.url}
                    title={ex.title}
                    summary={ex.summary}
                    favicon_url={ex.favicon_url}
                  />
                ))}
              </div>
            ) : (
              <p
                style={{
                  color: "rgba(211,227,247,0.4)",
                  fontSize: "0.95rem",
                  fontStyle: "italic",
                }}
              >
                No entries listed here yet.
              </p>
            )}
          </div>
        ) : (
          /* ── List view: scan the approaches, then drill into one ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {approachesWithExamples.map((approach) => (
              <ApproachRow
                key={approach.id}
                href={`/constellation/${slug}?approach=${approach.id}`}
                name={approach.name}
                exampleCount={approach.examples.length}
              />
            ))}
          </div>
        )}

        {/* Suggest a link footer */}
        <div style={{ marginTop: 52, textAlign: "center" }}>
          <Link
            href={`/constellation/submit?topic=${topic.id}`}
            style={{
              fontSize: "0.85rem",
              color: "rgba(211,227,247,0.65)",
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
