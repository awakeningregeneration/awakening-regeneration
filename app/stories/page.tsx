import Link from "next/link";

type StoriesPageProps = {
  searchParams?: Promise<{
    state?: string;
    county?: string;
  }>;
};

type Story = {
  id: string;
  created_at: string;
  state: string;
  county: string;
  title?: string | null;
  body: string;
  link?: string | null;
};

const lightPoints: {
  left: string;
  top: string;
  size: number;
  opacity: number;
  tier: 1 | 2 | 3;
}[] = [
  // Tier 1 — 15 tiny (2–4px, opacity 0.5–0.7)
  { left: "3%", top: "5%", size: 3, opacity: 0.6, tier: 1 },
  { left: "8%", top: "18%", size: 2, opacity: 0.5, tier: 1 },
  { left: "15%", top: "8%", size: 4, opacity: 0.7, tier: 1 },
  { left: "12%", top: "32%", size: 2, opacity: 0.55, tier: 1 },
  { left: "5%", top: "50%", size: 3, opacity: 0.6, tier: 1 },
  { left: "18%", top: "68%", size: 2, opacity: 0.5, tier: 1 },
  { left: "8%", top: "82%", size: 4, opacity: 0.7, tier: 1 },
  { left: "82%", top: "6%", size: 3, opacity: 0.65, tier: 1 },
  { left: "90%", top: "20%", size: 2, opacity: 0.55, tier: 1 },
  { left: "78%", top: "38%", size: 4, opacity: 0.7, tier: 1 },
  { left: "95%", top: "54%", size: 2, opacity: 0.5, tier: 1 },
  { left: "85%", top: "70%", size: 3, opacity: 0.6, tier: 1 },
  { left: "92%", top: "85%", size: 4, opacity: 0.7, tier: 1 },
  { left: "40%", top: "4%", size: 2, opacity: 0.55, tier: 1 },
  { left: "55%", top: "92%", size: 3, opacity: 0.6, tier: 1 },

  // Tier 2 — 15 medium (5–8px, opacity 0.65–0.85)
  { left: "6%", top: "12%", size: 7, opacity: 0.8, tier: 2 },
  { left: "14%", top: "22%", size: 5, opacity: 0.7, tier: 2 },
  { left: "3%", top: "36%", size: 8, opacity: 0.85, tier: 2 },
  { left: "10%", top: "58%", size: 6, opacity: 0.75, tier: 2 },
  { left: "16%", top: "76%", size: 7, opacity: 0.8, tier: 2 },
  { left: "4%", top: "88%", size: 5, opacity: 0.7, tier: 2 },
  { left: "86%", top: "14%", size: 8, opacity: 0.85, tier: 2 },
  { left: "94%", top: "32%", size: 6, opacity: 0.75, tier: 2 },
  { left: "80%", top: "48%", size: 7, opacity: 0.8, tier: 2 },
  { left: "88%", top: "62%", size: 5, opacity: 0.7, tier: 2 },
  { left: "94%", top: "78%", size: 8, opacity: 0.85, tier: 2 },
  { left: "82%", top: "90%", size: 6, opacity: 0.75, tier: 2 },
  { left: "28%", top: "8%", size: 5, opacity: 0.7, tier: 2 },
  { left: "68%", top: "12%", size: 7, opacity: 0.78, tier: 2 },
  { left: "45%", top: "86%", size: 6, opacity: 0.72, tier: 2 },

  // Tier 3 — 10 bright (9–14px, opacity 0.75–0.95)
  { left: "5%", top: "8%", size: 12, opacity: 0.88, tier: 3 },
  { left: "12%", top: "45%", size: 10, opacity: 0.82, tier: 3 },
  { left: "8%", top: "72%", size: 14, opacity: 0.95, tier: 3 },
  { left: "90%", top: "8%", size: 11, opacity: 0.85, tier: 3 },
  { left: "94%", top: "42%", size: 14, opacity: 0.92, tier: 3 },
  { left: "88%", top: "76%", size: 9, opacity: 0.78, tier: 3 },
  { left: "20%", top: "28%", size: 10, opacity: 0.8, tier: 3 },
  { left: "78%", top: "22%", size: 14, opacity: 0.95, tier: 3 },
  { left: "30%", top: "84%", size: 11, opacity: 0.85, tier: 3 },
  { left: "72%", top: "88%", size: 9, opacity: 0.75, tier: 3 },
];

export default async function StoriesPage({
  searchParams,
}: StoriesPageProps) {
  const params = (await searchParams) ?? {};
  const state = params.state ?? "";
  const county = params.county ?? "";

  const countyLabel = county
    ? county.includes("County")
      ? county
      : `${county} County`
    : "";

  const placeLabel =
    countyLabel && state
      ? `${countyLabel}, ${state}`
      : countyLabel || state || "this place";

  const qs = new URLSearchParams();
  if (state) qs.set("state", state);
  if (county) qs.set("county", county);

  const storiesUrl = qs.toString()
    ? `http://localhost:3000/api/stories?${qs.toString()}`
    : `http://localhost:3000/api/stories`;

  const mapHref = qs.toString() ? `/map?${qs.toString()}` : "/map";
  const addStoryHref = qs.toString()
    ? `/stories/submit?${qs.toString()}`
    : "/stories/submit";

  let stories: Story[] = [];

  try {
    const res = await fetch(storiesUrl, { cache: "no-store" });

    if (res.ok) {
      stories = await res.json();
    }
  } catch (error) {
    console.error("Failed to load stories:", error);
  }

  const hasStories = stories.length > 0;

  const cardStyle: React.CSSProperties = {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.13)",
    backdropFilter: "blur(8px)",
    padding: "22px 22px",
    marginBottom: 18,
  };

  const headingStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.96)",
    fontWeight: 600,
    margin: 0,
  };

  const bodyTextStyle: React.CSSProperties = {
    color: "rgba(235,245,255,0.95)",
    lineHeight: 1.65,
  };

  const smallLabelStyle: React.CSSProperties = {
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(159,184,216,0.65)",
    marginBottom: 10,
  };

  const goldLinkStyle: React.CSSProperties = {
    color: "#FFD86B",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: 14,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#112952",
        color: "white",
        position: "relative",
        overflow: "hidden",
        padding: "32px 20px 48px",
      }}
    >
      {/* Atmosphere layer 1 — top glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(60,130,220,0.45) 0%, rgba(5,16,31,1) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Atmosphere layer 2 — soft center bloom */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(80,140,230,0.28) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Atmosphere layer 3 — faint white luminosity */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Gold light points */}
      {lightPoints.map((p, i) => {
        let boxShadow = "";
        if (p.tier === 1) {
          boxShadow = "0 0 6px 1px rgba(255,220,140,0.20)";
        } else if (p.tier === 2) {
          boxShadow =
            "0 0 12px 2px rgba(255,220,140,0.30), 0 0 24px 4px rgba(255,200,100,0.12)";
        } else {
          boxShadow =
            "0 0 18px 3px rgba(255,220,140,0.40), 0 0 36px 6px rgba(255,200,100,0.16), 0 0 60px 10px rgba(255,180,80,0.06)";
        }
        const hasCore = p.tier === 3 && p.size >= 14;
        return (
          <div
            key={i}
            style={{
              position: "fixed",
              left: `calc(${p.left} - ${p.size}px)`,
              top: `calc(${p.top} - ${p.size}px)`,
              width: p.size * 3,
              height: p.size * 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `radial-gradient(circle, rgba(255,220,140,${
                p.opacity * 0.12
              }) 0%, transparent 70%)`,
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: 3,
            }}
          >
            <div
              style={{
                position: "relative",
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: "rgba(255,244,200,1)",
                opacity: p.opacity,
                boxShadow,
                filter: `blur(${p.size * 0.15}px)`,
              }}
            >
              {hasCore && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: p.size * 0.4,
                    height: p.size * 0.4,
                    borderRadius: "50%",
                    background: "rgba(255,250,230,0.9)",
                  }}
                />
              )}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        {/* Back */}
        <div style={{ marginBottom: 18 }}>
          <Link
            href={mapHref}
            style={{
              textDecoration: "underline",
              textUnderlineOffset: 3,
              color: "rgba(159,184,216,0.65)",
              fontSize: 14,
            }}
          >
            Back to map
          </Link>
        </div>

        {/* Header + Rose/Thorn */}
        <section style={cardStyle}>
          <div style={smallLabelStyle}>Story of place</div>

          <h1
            style={{
              ...headingStyle,
              fontSize: 30,
              lineHeight: 1.15,
              marginBottom: 12,
            }}
          >
            {placeLabel}
          </h1>

          <div
            style={{
              ...bodyTextStyle,
              fontSize: 16,
              maxWidth: 640,
            }}
          >
            <p style={{ marginBottom: 10 }}>
              The world has become practiced in reporting the thorn — what is
              broken, extractive, alarming, and in need of repair.
            </p>

            <p style={{ marginBottom: 10 }}>
              The thorn is real, and what needs healing cannot be denied.
            </p>

            <p style={{ marginBottom: 10 }}>The rose is real too.</p>

            <p>
              The rose is what is already healing, already working, already
              beautiful, and already helping life take root. The rose is the
              beauty that calms and belongs you.
            </p>
          </div>
        </section>

        {/* STORIES LIST */}
        {hasStories ? (
          <section style={cardStyle}>
            <div
              style={{
                ...headingStyle,
                fontSize: 18,
                marginBottom: 14,
              }}
            >
              Roses rooted here
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {stories.map((story) => (
                <article
                  key={story.id}
                  style={{
                    padding: "16px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  {story.title && (
                    <div
                      style={{
                        ...headingStyle,
                        fontSize: 18,
                        marginBottom: 8,
                      }}
                    >
                      {story.title}
                    </div>
                  )}

                  <div
                    style={{
                      ...bodyTextStyle,
                      fontSize: 15,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {story.body}
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 12,
                      color: "rgba(159,184,216,0.65)",
                    }}
                  >
                    {story.county}, {story.state}
                  </div>

                  {story.link && (
                    <div style={{ marginTop: 8 }}>
                      <a
                        href={story.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: "underline",
                          textUnderlineOffset: 3,
                          color: "rgba(235,245,255,0.95)",
                          fontSize: 14,
                        }}
                      >
                        Visit link
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section style={cardStyle}>
            <div
              style={{
                ...headingStyle,
                fontSize: 20,
                marginBottom: 12,
              }}
            >
              No roses have been shared here yet.
            </div>

            <div
              style={{
                ...bodyTextStyle,
                fontSize: 15,
                marginBottom: 14,
              }}
            >
              No roses have been named here yet. That doesn’t mean nothing is
              happening — it means the seeing and sharing has not begun here yet.
            </div>

            <div
              style={{
                ...bodyTextStyle,
                fontSize: 15,
              }}
            >
              What is growing here? What is helping life take root? What rose
              belongs to this place?
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={cardStyle}>
          <div
            style={{
              ...headingStyle,
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            Share a rose from this place
          </div>

          <div
            style={{
              ...bodyTextStyle,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            Stories help make visible what is healing, growing, and becoming
            possible here.
          </div>

          <Link href={addStoryHref} style={goldLinkStyle}>
            Share a rose
          </Link>
        </section>

        {/* Constellation */}
        <section style={{ ...cardStyle, marginBottom: 0 }}>
          <div
            style={{
              ...headingStyle,
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            Looking for inspiration from the wider world?
          </div>

          <div
            style={{
              ...bodyTextStyle,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            Explore roses from other places where people are helping life take
            root in different ways.
          </div>

          <Link href="/constellation" style={goldLinkStyle}>
            Explore the constellation of stories
          </Link>
        </section>
      </div>
    </main>
  );
}
