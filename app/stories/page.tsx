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
        background: "#f7f7f5",
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
        <div style={{ marginBottom: 18 }}>
          <Link
            href={county || state ? `/map` : "/"}
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
              marginBottom: 10,
            }}
          >
            {placeLabel}
          </h1>

          <div
            style={{
              fontSize: 16,
              lineHeight: 1.5,
              opacity: 0.82,
              maxWidth: 640,
            }}
          >
            Places hold memory, relationship, effort, and quiet forms of care.
            This is where the story of a place can become visible.
          </div>
        </section>

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
              Stories
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
                  {story.title ? (
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      {story.title}
                    </div>
                  ) : null}

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

                  {story.link ? (
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
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : (
          <>
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
                The story of {placeLabel} is still gathering here.
              </div>

              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  opacity: 0.82,
                  marginBottom: 14,
                }}
              >
                No local stories have been shared in this space yet. That
                doesn&apos;t mean nothing is happening. It means the telling has
                not begun here yet.
              </div>

              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  opacity: 0.82,
                }}
              >
                What is tending life here? What is growing quietly? What belongs
                to the story of this place?
              </div>
            </section>
          </>
        )}

        <section
          style={{
            padding: "20px",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 16,
            background: "rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Add to the story layer
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              opacity: 0.8,
              marginBottom: 12,
            }}
          >
            A story helps make visible what lives here and what this place is
            becoming.
          </div>

          <Link
            href={
              county || state
                ? `/stories/submit?county=${encodeURIComponent(
                    county
                  )}&state=${encodeURIComponent(state)}`
                : "/stories/submit"
            }
            style={{
              textDecoration: "underline",
              textUnderlineOffset: 3,
              fontWeight: 600,
              color: "inherit",
              fontSize: 14,
            }}
          >
            Add a story
          </Link>
        </section>
      </div>
    </main>
  );
}