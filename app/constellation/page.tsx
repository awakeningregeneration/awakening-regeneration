import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type ConstellationSignal = {
  id: string;
  title: string;
  description: string;
  region: string | null;
  category: string | null;
  link: string;
  created_at?: string;
};

export default async function ConstellationPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedCategory = resolvedSearchParams.category ?? "All";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("constellation")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load constellation:", error.message);
  }

  const risingConstellation: ConstellationSignal[] = (data ?? []) as ConstellationSignal[];

  const categories = [
    "All",
    ...Array.from(
      new Set(
        risingConstellation
          .map((signal) => signal.category)
          .filter((category): category is string => Boolean(category && category.trim()))
      )
    ),
  ];

  const filteredSignals =
    selectedCategory === "All"
      ? risingConstellation
      : risingConstellation.filter((signal) => signal.category === selectedCategory);

  const lights = [
    { left: "8%", top: "10%", size: 10, glow: 1.2 },
    { left: "18%", top: "18%", size: 7, glow: 0.9 },
    { left: "30%", top: "12%", size: 9, glow: 1.1 },
    { left: "44%", top: "16%", size: 8, glow: 1.05 },
    { left: "58%", top: "10%", size: 10, glow: 1.25 },
    { left: "72%", top: "18%", size: 7, glow: 0.95 },
    { left: "86%", top: "12%", size: 9, glow: 1.15 },

    { left: "12%", top: "34%", size: 8, glow: 1.05 },
    { left: "24%", top: "28%", size: 6, glow: 0.85 },
    { left: "38%", top: "38%", size: 9, glow: 1.15 },
    { left: "52%", top: "30%", size: 7, glow: 0.9 },
    { left: "66%", top: "36%", size: 10, glow: 1.2 },
    { left: "80%", top: "30%", size: 8, glow: 1.05 },
    { left: "90%", top: "40%", size: 7, glow: 0.9 },

    { left: "10%", top: "58%", size: 9, glow: 1.1 },
    { left: "22%", top: "70%", size: 7, glow: 0.9 },
    { left: "36%", top: "62%", size: 10, glow: 1.2 },
    { left: "50%", top: "74%", size: 8, glow: 1.05 },
    { left: "64%", top: "60%", size: 7, glow: 0.95 },
    { left: "78%", top: "68%", size: 10, glow: 1.25 },
    { left: "90%", top: "62%", size: 8, glow: 1.05 },

    { left: "14%", top: "86%", size: 6, glow: 0.8 },
    { left: "30%", top: "90%", size: 8, glow: 1.0 },
    { left: "46%", top: "88%", size: 7, glow: 0.9 },
    { left: "62%", top: "92%", size: 9, glow: 1.15 },
    { left: "80%", top: "86%", size: 7, glow: 0.9 },
  ];

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#08192d",
        color: "white",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top, rgba(26,72,130,0.28) 0%, rgba(7,24,45,0.9) 38%, rgba(5,16,31,1) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(88,156,255,0.12) 0%, transparent 32%), radial-gradient(circle at 80% 30%, rgba(88,156,255,0.10) 0%, transparent 28%), radial-gradient(circle at 50% 80%, rgba(88,156,255,0.08) 0%, transparent 34%)",
        }}
      />

      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
        }}
      >
        {lights.map((light, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: light.left,
              top: light.top,
              width: light.size,
              height: light.size,
              borderRadius: 999,
              background: "#fff7cc",
              boxShadow: `0 0 ${14 * light.glow}px rgba(255, 242, 170, 0.75), 0 0 ${28 * light.glow}px rgba(120, 180, 255, 0.28)`,
              opacity: 0.95,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          maxWidth: 980,
          margin: "0 auto",
          padding: "70px 20px 90px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto 40px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#9fb8d8",
              marginBottom: 14,
            }}
          >
            Awakening Regeneration
          </div>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              lineHeight: 1.05,
              margin: "0 0 16px",
              color: "white",
            }}
          >
            The Rising Constellation
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 18,
              lineHeight: 1.8,
              color: "#d3e3f7",
            }}
          >
            A world constellation of people, places, and efforts already rising
            toward more life-affirming ways of being.
            <br />
            <strong>Look outward and remember: this is rising everywhere.</strong>
          </p>
        </div>

        <section
          style={{
            maxWidth: 860,
            margin: "0 auto 28px",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            padding: 24,
          }}
        >
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: 28,
              color: "white",
            }}
          >
            What this is
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.8,
              color: "#d3e3f7",
            }}
          >
            The Rising Constellation is a place to gather signals from around the
            world that remind us another future is already being built. These are
            projects, places, movements, and efforts that help reveal what is
            becoming possible across cultures, countries, and systems.
          </p>
        </section>

        <section
          style={{
            maxWidth: 860,
            margin: "0 auto 28px",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            padding: 24,
          }}
        >
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: 28,
              color: "white",
            }}
          >
            Why it exists
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.8,
              color: "#d3e3f7",
            }}
          >
            This page is here to help people see patterns of life-forward change
            beyond their immediate surroundings. The local map helps people find
            where they can participate near them. The constellation helps people
            remember that this work is rising everywhere.
          </p>
        </section>

        <div
          style={{
            maxWidth: 860,
            margin: "0 auto 20px",
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <Link
                key={category}
                href={
                  category === "All"
                    ? "/constellation"
                    : `/constellation?category=${encodeURIComponent(category)}`
                }
                style={{
                  display: "inline-block",
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: isActive
                    ? "1px solid rgba(255,224,138,0.45)"
                    : "1px solid rgba(255,255,255,0.12)",
                  background: isActive
                    ? "rgba(255,216,107,0.16)"
                    : "rgba(255,255,255,0.08)",
                  color: isActive ? "#ffe08a" : "#d3e3f7",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  boxShadow: isActive ? "0 0 18px rgba(255,216,107,0.10)" : "none",
                }}
              >
                {category}
              </Link>
            );
          })}
        </div>

        <div
          style={{
            display: "grid",
            gap: 20,
            maxWidth: 860,
            margin: "0 auto",
          }}
        >
          {filteredSignals.length > 0 ? (
            filteredSignals.map((signal) => (
              <a
                key={signal.id}
                href={signal.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: 20,
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(248,252,255,0.92)",
                  textDecoration: "none",
                  color: "#1f2a3a",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: 22,
                    lineHeight: 1.25,
                  }}
                >
                  {signal.title}
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 10,
                    fontSize: 13,
                    color: "#6b7c94",
                  }}
                >
                  <span>{signal.region || "Global"}</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "rgba(14,58,102,0.08)",
                      color: "#0e3a66",
                      fontWeight: 600,
                    }}
                  >
                    {signal.category || "Uncategorized"}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "#4a5a70",
                    lineHeight: 1.7,
                  }}
                >
                  {signal.description}
                </p>
              </a>
            ))
          ) : (
            <div
              style={{
                padding: 24,
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.08)",
                color: "#d3e3f7",
              }}
            >
              No constellation signals found for this category yet.
            </div>
          )}
        </div>

        <div
          style={{
            maxWidth: 860,
            margin: "42px auto 0",
            textAlign: "center",
          }}
        >
          <Link
            href="/constellation/submit"
            style={{
              display: "inline-block",
              padding: "14px 22px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,216,107,0.14)",
              color: "#ffe08a",
              textDecoration: "none",
              fontWeight: 600,
              boxShadow: "0 0 20px rgba(255,216,107,0.10)",
            }}
          >
            Submit to the Constellation
          </Link>
        </div>
      </div>
    </main>
  );
}