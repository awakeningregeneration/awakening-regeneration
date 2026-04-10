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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#d3e4f7",
        color: "#1f1f1c",
        padding: "32px 20px 48px",
      }}
    >
      <div
        style={{
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
              color: "inherit",
              fontSize: 14,
            }}
          >
            Back to map
          </Link>
        </div>

        {/* Header + Rose/Thorn */}
        <section
          style={{
            padding: "20px 20px 18px",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 16,
            background: "rgba(255,255,255,0.78)",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              opacity: 0.65,
              marginBottom: 8,
            }}
          >
            Story of place
          </div>

          <h1
            style={{
              fontSize: 30,
              lineHeight: 1.15,
              fontWeight: 600,
              margin: 0,
              marginBottom: 12,
            }}
          >
            {placeLabel}
          </h1>

          <div
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              opacity: 0.85,
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
          <section
            style={{
              padding: "20px",
              border: "1px solid rgba(0,0,0,0.10)",
              borderRadius: 16,
              background: "white",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
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
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(0,0,0,0.02)",
                  }}
                >
                  {story.title && (
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      {story.title}
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: 15,
                      lineHeight: 1.65,
                      whiteSpace: "pre-wrap",
                      opacity: 0.88,
                    }}
                  >
                    {story.body}
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 12,
                      opacity: 0.6,
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
                          color: "inherit",
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
          <section
            style={{
              padding: "20px",
              border: "1px solid rgba(0,0,0,0.10)",
              borderRadius: 16,
              background: "white",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              No roses have been shared here yet.
            </div>

            <div
              style={{
                fontSize: 15,
                lineHeight: 1.65,
                opacity: 0.82,
                marginBottom: 14,
              }}
            >
              No roses have been named here yet. That doesn’t mean nothing is
              happening — it means the seeing and sharing has not begun here yet.
            </div>

            <div
              style={{
                fontSize: 15,
                lineHeight: 1.65,
                opacity: 0.82,
              }}
            >
              What is growing here? What is helping life take root? What rose
              belongs to this place?
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          style={{
            padding: "20px",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 16,
            background: "rgba(0,0,0,0.03)",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Share a rose from this place
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              opacity: 0.8,
              marginBottom: 12,
            }}
          >
            Stories help make visible what is healing, growing, and becoming
            possible here.
          </div>

          <Link
            href={addStoryHref}
            style={{
              textDecoration: "underline",
              textUnderlineOffset: 3,
              fontWeight: 600,
              color: "inherit",
              fontSize: 14,
            }}
          >
            Share a rose
          </Link>
        </section>

        {/* Constellation */}
        <section
          style={{
            padding: "20px",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 16,
            background: "rgba(255,255,255,0.72)",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Looking for inspiration from the wider world?
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              opacity: 0.8,
              marginBottom: 12,
            }}
          >
            Explore roses from other places where people are helping life take
            root in different ways.
          </div>

          <Link
            href="/constellation"
            style={{
              textDecoration: "underline",
              textUnderlineOffset: 3,
              fontWeight: 600,
              color: "inherit",
              fontSize: 14,
            }}
          >
            Explore the constellation of stories
          </Link>
        </section>
      </div>
    </main>
  );
}