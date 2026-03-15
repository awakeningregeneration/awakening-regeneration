import Link from "next/link";

type Signal = {
  id: string;
  title?: string | null;
  description?: string | null;
  link?: string | null;
  category?: string | null;
  created_at?: string | null;
};

async function getSignals(): Promise<Signal[]> {
  try {
    const res = await fetch("http://localhost:3000/api/constellation", {
      cache: "no-store",
    });

    if (!res.ok) return [];

    return res.json();
  } catch (error) {
    console.error("Failed to load constellation signals:", error);
    return [];
  }
}

export default async function ConstellationPage() {
  const signals = await getSignals();

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
          maxWidth: 920,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <Link
            href="/"
            style={{
              textDecoration: "underline",
              textUnderlineOffset: 3,
              color: "inherit",
              fontSize: 14,
            }}
          >
            Back home
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
          <h1
            style={{
              fontSize: 30,
              lineHeight: 1.15,
              fontWeight: 600,
              margin: 0,
              marginBottom: 12,
            }}
          >
            The Rising Constellation
          </h1>

          <div
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              opacity: 0.84,
              maxWidth: 760,
            }}
          >
            A world constellation of people, places, and efforts already rising
            toward more life-affirming ways of being.
            <br />
            <strong>Look outward and remember: this is rising everywhere.</strong>
          </div>
        </section>

        <section
          style={{
            marginBottom: 18,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Link
            href="/constellation/submit"
            style={{
              textDecoration: "underline",
              textUnderlineOffset: 3,
              fontWeight: 600,
              color: "inherit",
              fontSize: 14,
            }}
          >
            Add to the Rising Constellation
          </Link>
        </section>

        {signals.length > 0 ? (
          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            {signals.map((signal) => (
              <article
                key={signal.id}
                style={{
                  padding: "18px 18px 16px",
                  border: "1px solid rgba(0,0,0,0.10)",
                  borderRadius: 16,
                  background: "white",
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    lineHeight: 1.25,
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  {signal.title || "Untitled signal"}
                </div>

                {signal.category ? (
                  <div
                    style={{
                      fontSize: 13,
                      opacity: 0.6,
                      marginBottom: 10,
                    }}
                  >
                    {signal.category}
                  </div>
                ) : null}

                {signal.description ? (
                  <div
                    style={{
                      fontSize: 16,
                      lineHeight: 1.65,
                      opacity: 0.86,
                      marginBottom: signal.link ? 12 : 0,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {signal.description}
                  </div>
                ) : null}

                {signal.link ? (
                  <a
                    href={signal.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                      fontWeight: 600,
                      color: "inherit",
                      fontSize: 14,
                    }}
                  >
                    Visit link
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <section
            style={{
              padding: "20px",
              border: "1px solid rgba(0,0,0,0.10)",
              borderRadius: 16,
              background: "white",
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              The constellation is still gathering here.
            </div>

            <div
              style={{
                fontSize: 15,
                lineHeight: 1.65,
                opacity: 0.82,
                marginBottom: 12,
              }}
            >
              No signals have been added yet. This page is here to gather signs
              of life from around the world — efforts, technologies, projects,
              and places that remind us another future is already underway.
            </div>

            <Link
              href="/constellation/submit"
              style={{
                textDecoration: "underline",
                textUnderlineOffset: 3,
                fontWeight: 600,
                color: "inherit",
                fontSize: 14,
              }}
            >
              Add the first signal
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}