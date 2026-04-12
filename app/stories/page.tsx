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

const lightPoints: { left: string; top: string; size: number; glow: number }[] = [
  { left: "6%", top: "8%", size: 4, glow: 10 },
  { left: "18%", top: "22%", size: 3, glow: 8 },
  { left: "32%", top: "12%", size: 6, glow: 14 },
  { left: "48%", top: "28%", size: 3, glow: 8 },
  { left: "62%", top: "16%", size: 5, glow: 12 },
  { left: "78%", top: "30%", size: 7, glow: 16 },
  { left: "88%", top: "10%", size: 4, glow: 10 },
  { left: "12%", top: "44%", size: 5, glow: 12 },
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
    border: "1px solid rgba(255,255,255,0.09)",
    background: "rgba(255,255,255,0.06)",
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
    color: "rgba(211,227,247,0.82)",
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
        background: "#08192d",
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
            "radial-gradient(ellipse at 50% 0%, rgba(26,72,130,0.32) 0%, rgba(5,16,31,1) 70%)",
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
            "radial-gradient(ellipse at 50% 45%, rgba(60,110,200,0.11) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Gold light points */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {lightPoints.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "rgba(255,244,200,0.75)",
              boxShadow: `0 0 ${p.glow}px rgba(255,220,140,0.42), 0 0 ${
                p.glow * 2
              }px rgba(255,200,100,0.14)`,
            }}
          />
        ))}
      </div>

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
                          color: "rgba(211,227,247,0.82)",
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
