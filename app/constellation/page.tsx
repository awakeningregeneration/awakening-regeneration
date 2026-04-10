import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type ConstellationSignal = {
  id: string;
  title: string;
  description: string;
  region: string | null;
  category: string | null;
  link: string;
  practices?: string[] | null;
  created_at?: string;
};

const PRIMARY_CATEGORIES = [
  "Land & Food",
  "Water & Flow",
  "Energy & Infrastructure",
  "Air & Atmosphere",
  "Community & Care",
];

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

  const signals: ConstellationSignal[] = (data ?? []) as ConstellationSignal[];

  const categories = ["All", ...PRIMARY_CATEGORIES];

  const filteredSignals =
    selectedCategory === "All"
      ? signals
      : signals.filter((signal) => signal.category === selectedCategory);

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

      <div style={{ pointerEvents: "none", position: "absolute", inset: 0 }}>
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
              boxShadow: `0 0 ${14 * light.glow}px rgba(255, 242, 170, 0.75)`,
            }}
          />
        ))}
      </div>

      <div style={{ position: "relative", maxWidth: 980, margin: "0 auto", padding: "70px 20px 90px" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: 12 }}>The Rising Constellation</h1>

        <p style={{ marginBottom: 30, color: "#d3e3f7" }}>
          A world constellation of people, places, and efforts already rising toward more life-affirming ways of being.
        </p>

        {/* CATEGORY FILTER */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
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
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: isActive
                    ? "1px solid rgba(255,216,107,0.45)"
                    : "1px solid rgba(255,255,255,0.12)",
                  background: isActive
                    ? "rgba(255,216,107,0.16)"
                    : "rgba(255,255,255,0.08)",
                  color: isActive ? "#ffe08a" : "#d3e3f7",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {category}
              </Link>
            );
          })}
        </div>

        {/* SIGNALS */}
        <div style={{ display: "grid", gap: 20 }}>
          {filteredSignals.map((signal) => (
            <a
              key={signal.id}
              href={signal.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: 20,
                borderRadius: 20,
                background: "white",
                color: "#1f2a3a",
                textDecoration: "none",
              }}
            >
              <h3>{signal.title}</h3>

              <div style={{ fontSize: 13, marginBottom: 8 }}>
                {signal.region} • {signal.category}
              </div>

              <p>{signal.description}</p>

              {/* PRACTICES (future-ready) */}
              {signal.practices?.length ? (
                <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {signal.practices.map((p) => (
                    <span
                      key={p}
                      style={{
                        fontSize: 12,
                        padding: "4px 8px",
                        borderRadius: 999,
                        background: "#eef5ff",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              ) : null}
            </a>
          ))}
        </div>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link href="/constellation/submit">Submit to the Constellation</Link>
        </div>
      </div>
    </main>
  );
}