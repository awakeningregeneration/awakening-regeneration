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

type ConstellationLink = {
  id: string;
  topic_id: string;
  title: string;
  url: string;
  summary: string;
  favicon_url: string | null;
  created_at: string;
};

type Topic = {
  id: string;
  slug: string;
  title: string;
  subheader: string;
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

  const { data: links } = await supabaseAdmin
    .from("constellation_links")
    .select("*")
    .eq("topic_id", topic.id)
    .order("created_at", { ascending: true });

  const linkList: ConstellationLink[] = links ?? [];

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

        {/* Link cards */}
        {linkList.length === 0 ? (
          <p
            style={{
              color: "rgba(211,227,247,0.4)",
              fontSize: "0.95rem",
              fontStyle: "italic",
            }}
          >
            No links yet — check back soon.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {linkList.map((link) => (
              <LinkCard
                key={link.id}
                url={link.url}
                title={link.title}
                summary={link.summary}
                favicon_url={link.favicon_url}
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
