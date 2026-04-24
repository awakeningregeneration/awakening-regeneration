import Link from "next/link";

const GOLD = "#FFD86B";
const BODY_COLOR = "#fff8e0";

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: "clamp(1.5rem, 2.5vw, 1.75rem)",
  fontWeight: 600,
  color: BODY_COLOR,
  margin: "0 0 20px",
};

const bodyStyle: React.CSSProperties = {
  fontSize: "clamp(1.05rem, 1.2vw, 1.15rem)",
  lineHeight: 1.68,
  color: BODY_COLOR,
  margin: "0 0 1.15em",
};

const glassCard: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.09)",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(8px)",
  padding: "26px 28px",
  marginBottom: 16,
};

export default function AboutPage() {
  const lights: {
    left: string;
    top: string;
    size: number;
    opacity: number;
    glow: number;
    tone: "gold" | "cool";
  }[] = [
    // ── Upper band — edges ──
    { left: "3%", top: "3%", size: 4, opacity: 0.7, glow: 10, tone: "gold" },
    { left: "8%", top: "14%", size: 3, opacity: 0.65, glow: 8, tone: "cool" },
    { left: "14%", top: "7%", size: 3, opacity: 0.6, glow: 7, tone: "gold" },
    { left: "18%", top: "22%", size: 3, opacity: 0.55, glow: 7, tone: "cool" },
    { left: "21%", top: "11%", size: 6, opacity: 0.92, glow: 16, tone: "gold" },
    { left: "26%", top: "18%", size: 5, opacity: 0.85, glow: 12, tone: "gold" },
    { left: "32%", top: "5%", size: 3, opacity: 0.6, glow: 7, tone: "cool" },
    { left: "15%", top: "4%", size: 2, opacity: 0.55, glow: 6, tone: "gold" },
    { left: "28%", top: "12%", size: 3, opacity: 0.65, glow: 8, tone: "gold" },

    // ── CANARY ZONE ──
    { left: "46%", top: "20%", size: 7, opacity: 1.0, glow: 24, tone: "gold" },
    { left: "49%", top: "26%", size: 5, opacity: 0.95, glow: 20, tone: "gold" },
    { left: "52%", top: "22%", size: 9, opacity: 1.0, glow: 28, tone: "gold" },
    { left: "48%", top: "28%", size: 4, opacity: 0.9, glow: 18, tone: "gold" },
    { left: "54%", top: "24%", size: 6, opacity: 0.95, glow: 22, tone: "gold" },
    { left: "50%", top: "19%", size: 5, opacity: 0.92, glow: 20, tone: "gold" },
    { left: "45%", top: "30%", size: 3, opacity: 0.85, glow: 14, tone: "gold" },
    { left: "56%", top: "26%", size: 4, opacity: 0.88, glow: 16, tone: "gold" },
    { left: "44%", top: "18%", size: 4, opacity: 0.82, glow: 14, tone: "gold" },
    { left: "47%", top: "32%", size: 7, opacity: 0.95, glow: 22, tone: "gold" },
    { left: "58%", top: "20%", size: 5, opacity: 0.9, glow: 18, tone: "gold" },
    { left: "55%", top: "30%", size: 3, opacity: 0.78, glow: 12, tone: "gold" },
    { left: "42%", top: "24%", size: 3, opacity: 0.72, glow: 10, tone: "gold" },
    { left: "60%", top: "22%", size: 4, opacity: 0.8, glow: 14, tone: "gold" },

    // ── Upper band — right side ──
    { left: "66%", top: "9%", size: 10, opacity: 1.0, glow: 28, tone: "gold" },
    { left: "72%", top: "22%", size: 4, opacity: 0.75, glow: 10, tone: "cool" },
    { left: "78%", top: "14%", size: 7, opacity: 0.95, glow: 22, tone: "gold" },
    { left: "84%", top: "7%", size: 3, opacity: 0.55, glow: 7, tone: "cool" },
    { left: "89%", top: "20%", size: 5, opacity: 0.85, glow: 14, tone: "gold" },
    { left: "94%", top: "11%", size: 4, opacity: 0.7, glow: 10, tone: "cool" },
    { left: "97%", top: "4%", size: 3, opacity: 0.6, glow: 8, tone: "gold" },
    { left: "70%", top: "6%", size: 3, opacity: 0.65, glow: 9, tone: "gold" },
    { left: "82%", top: "18%", size: 4, opacity: 0.72, glow: 10, tone: "gold" },
    { left: "49%", top: "24%", size: 4, opacity: 0.7, glow: 10, tone: "cool" },
    { left: "55%", top: "20%", size: 3, opacity: 0.6, glow: 8, tone: "cool" },

    // ── Upper-middle band ──
    { left: "3%", top: "30%", size: 5, opacity: 0.82, glow: 14, tone: "gold" },
    { left: "10%", top: "34%", size: 3, opacity: 0.6, glow: 8, tone: "cool" },
    { left: "18%", top: "28%", size: 4, opacity: 0.72, glow: 10, tone: "gold" },
    { left: "25%", top: "35%", size: 6, opacity: 0.9, glow: 18, tone: "gold" },
    { left: "33%", top: "30%", size: 3, opacity: 0.58, glow: 7, tone: "cool" },
    { left: "40%", top: "32%", size: 4, opacity: 0.7, glow: 10, tone: "gold" },
    { left: "48%", top: "28%", size: 8, opacity: 1.0, glow: 24, tone: "gold" },
    { left: "56%", top: "34%", size: 3, opacity: 0.6, glow: 8, tone: "cool" },
    { left: "63%", top: "30%", size: 5, opacity: 0.82, glow: 14, tone: "gold" },
    { left: "70%", top: "35%", size: 4, opacity: 0.68, glow: 10, tone: "cool" },
    { left: "78%", top: "28%", size: 6, opacity: 0.92, glow: 18, tone: "gold" },
    { left: "86%", top: "33%", size: 3, opacity: 0.58, glow: 7, tone: "cool" },
    { left: "93%", top: "30%", size: 4, opacity: 0.72, glow: 10, tone: "gold" },
    { left: "15%", top: "32%", size: 3, opacity: 0.62, glow: 8, tone: "gold" },
    { left: "52%", top: "36%", size: 3, opacity: 0.65, glow: 9, tone: "gold" },

    // ── Middle belt ──
    { left: "6%", top: "42%", size: 4, opacity: 0.7, glow: 10, tone: "gold" },
    { left: "13%", top: "48%", size: 3, opacity: 0.58, glow: 7, tone: "cool" },
    { left: "22%", top: "44%", size: 6, opacity: 0.9, glow: 18, tone: "gold" },
    { left: "29%", top: "52%", size: 8, opacity: 1.0, glow: 24, tone: "gold" },
    { left: "36%", top: "46%", size: 3, opacity: 0.55, glow: 7, tone: "cool" },
    { left: "42%", top: "50%", size: 5, opacity: 0.82, glow: 14, tone: "gold" },
    { left: "45%", top: "55%", size: 10, opacity: 1.0, glow: 28, tone: "gold" },
    { left: "53%", top: "42%", size: 4, opacity: 0.75, glow: 10, tone: "cool" },
    { left: "58%", top: "48%", size: 3, opacity: 0.62, glow: 8, tone: "gold" },
    { left: "60%", top: "54%", size: 5, opacity: 0.85, glow: 14, tone: "gold" },
    { left: "68%", top: "44%", size: 7, opacity: 0.95, glow: 22, tone: "gold" },
    { left: "75%", top: "50%", size: 4, opacity: 0.72, glow: 10, tone: "cool" },
    { left: "83%", top: "46%", size: 5, opacity: 0.85, glow: 14, tone: "gold" },
    { left: "91%", top: "52%", size: 3, opacity: 0.58, glow: 7, tone: "cool" },
    { left: "17%", top: "50%", size: 3, opacity: 0.62, glow: 8, tone: "gold" },
    { left: "48%", top: "58%", size: 4, opacity: 0.72, glow: 10, tone: "gold" },

    // ── Lower belt ──
    { left: "5%", top: "62%", size: 5, opacity: 0.8, glow: 14, tone: "gold" },
    { left: "12%", top: "68%", size: 3, opacity: 0.6, glow: 8, tone: "cool" },
    { left: "20%", top: "64%", size: 4, opacity: 0.72, glow: 10, tone: "gold" },
    { left: "28%", top: "72%", size: 7, opacity: 0.95, glow: 22, tone: "gold" },
    { left: "35%", top: "66%", size: 3, opacity: 0.58, glow: 7, tone: "cool" },
    { left: "43%", top: "74%", size: 4, opacity: 0.75, glow: 10, tone: "gold" },
    { left: "50%", top: "68%", size: 9, opacity: 1.0, glow: 26, tone: "gold" },
    { left: "57%", top: "72%", size: 3, opacity: 0.62, glow: 8, tone: "cool" },
    { left: "64%", top: "66%", size: 5, opacity: 0.85, glow: 14, tone: "gold" },
    { left: "72%", top: "74%", size: 4, opacity: 0.7, glow: 10, tone: "cool" },
    { left: "80%", top: "68%", size: 6, opacity: 0.92, glow: 18, tone: "gold" },
    { left: "88%", top: "72%", size: 3, opacity: 0.58, glow: 7, tone: "cool" },
    { left: "95%", top: "66%", size: 4, opacity: 0.72, glow: 10, tone: "gold" },
    { left: "38%", top: "70%", size: 3, opacity: 0.65, glow: 9, tone: "gold" },
    { left: "55%", top: "62%", size: 3, opacity: 0.68, glow: 9, tone: "gold" },

    // ── Deep band ──
    { left: "4%", top: "80%", size: 4, opacity: 0.68, glow: 10, tone: "gold" },
    { left: "11%", top: "86%", size: 6, opacity: 0.9, glow: 18, tone: "gold" },
    { left: "19%", top: "82%", size: 3, opacity: 0.6, glow: 8, tone: "cool" },
    { left: "27%", top: "90%", size: 5, opacity: 0.82, glow: 14, tone: "gold" },
    { left: "34%", top: "84%", size: 9, opacity: 1.0, glow: 26, tone: "gold" },
    { left: "42%", top: "92%", size: 4, opacity: 0.68, glow: 10, tone: "cool" },
    { left: "50%", top: "86%", size: 7, opacity: 0.95, glow: 22, tone: "gold" },
    { left: "58%", top: "80%", size: 3, opacity: 0.62, glow: 8, tone: "gold" },
    { left: "65%", top: "88%", size: 5, opacity: 0.85, glow: 14, tone: "gold" },
    { left: "73%", top: "82%", size: 4, opacity: 0.72, glow: 10, tone: "cool" },
    { left: "80%", top: "94%", size: 10, opacity: 1.0, glow: 30, tone: "gold" },
    { left: "87%", top: "86%", size: 2, opacity: 0.4, glow: 5, tone: "cool" },
    { left: "93%", top: "90%", size: 5, opacity: 0.78, glow: 12, tone: "gold" },
    { left: "97%", top: "82%", size: 3, opacity: 0.5, glow: 6, tone: "gold" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08192d] text-white">
      {/* ── Original atmospheric background ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(26,72,130,0.28)_0%,_rgba(7,24,45,0.9)_38%,_rgba(5,16,31,1)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(88,156,255,0.12)_0%,_transparent_32%),radial-gradient(circle_at_80%_30%,_rgba(88,156,255,0.1)_0%,_transparent_28%),radial-gradient(circle_at_50%_80%,_rgba(88,156,255,0.08)_0%,_transparent_34%)]" />

      <div className="pointer-events-none absolute inset-0">
        {lights.map((light, index) => {
          const base = light.tone === "cool" ? "220,235,255" : "255,244,200";
          const haloBase =
            light.tone === "cool" ? "180,210,255" : "255,220,140";
          return (
            <div
              key={index}
              className="absolute flex items-center justify-center rounded-full"
              style={{
                left: `calc(${light.left} - ${light.size}px)`,
                top: `calc(${light.top} - ${light.size}px)`,
                width: `${light.size * 3}px`,
                height: `${light.size * 3}px`,
                background: `radial-gradient(circle, rgba(${haloBase},${
                  light.opacity * 0.12
                }) 0%, transparent 70%)`,
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: `${light.size}px`,
                  height: `${light.size}px`,
                  background: `rgba(${base},${light.opacity})`,
                  boxShadow: `0 0 ${light.glow * 0.85}px rgba(${base},${
                    light.opacity * 0.55
                  }), 0 0 ${light.glow * 1.7}px rgba(120,180,255,${
                    light.opacity * 0.18
                  })`,
                  filter: `blur(${light.size * 0.15}px)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Warm diffuse glow behind the canary */}
      <div
        className="canary-glow"
        style={{
          position: "absolute",
          left: "24%",
          top: "8%",
          width: "52%",
          height: "25%",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255,216,107,0.20) 0%, rgba(255,216,107,0.12) 25%, rgba(255,216,107,0.05) 55%, transparent 85%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Content ── */}
      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20">
        {/* Canary logo */}
        <div className="mx-auto max-w-3xl text-center">
          <img
            src="/canary-commons-logo.png"
            alt="Canary Commons"
            style={{
              width: "clamp(240px, 35vw, 380px)",
              height: "auto",
              display: "block",
              margin: "0 auto 20px",
              filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.3))",
            }}
          />
        </div>

        {/* Content column */}
        <div style={{ maxWidth: 700, margin: "0 auto" }}>

          {/* ═══ TOP BLESSING ═══ */}
          <div
            style={{
              textAlign: "center",
              padding: "clamp(40px, 6vh, 80px) 0 clamp(80px, 10vh, 120px)",
            }}
          >
            <p
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 650,
                fontStyle: "italic",
                color: GOLD,
                margin: 0,
                lineHeight: 1.2,
                textShadow:
                  "0 0 18px rgba(255,216,107,0.3), 0 0 40px rgba(255,216,107,0.12)",
              }}
            >
              All lights connected, we dawn brighter.
            </p>
          </div>

          {/* ═══ WHAT THIS IS ═══ */}
          <section style={glassCard}>
            <h2 style={sectionHeadingStyle}>What this is</h2>

            <p style={bodyStyle}>
              Canary Commons is a living platform that helps make visible what is
              already life-supporting — and a way for the people tending that work
              to find each other.
            </p>

            <p style={bodyStyle}>It has four layers.</p>

            <p style={bodyStyle}>
              <span style={{ color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
                The map
              </span>{" "}
              shows what is happening in specific places — farms, healing
              practices, repair shops, tool libraries, community spaces, land
              restoration, mutual aid, arts, housing, energy, education, and more.
              The yellow lights are the lights already on. Each one is a place.
            </p>

            <p style={bodyStyle}>
              <span style={{ color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
                The stories
              </span>{" "}
              let people share what is being tended, restored, planted, and
              brought to life where they are. A rose rooted here, not a perfect
              report.
            </p>

            <p style={bodyStyle}>
              <span style={{ color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
                The support layer
              </span>{" "}
              gathers aligned options for when the local light isn&apos;t visible yet —
              businesses, practitioners, and resources you can reach from anywhere.
            </p>

            <p style={bodyStyle}>
              <span style={{ color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
                The constellation
              </span>{" "}
              drifts wider — signals of life-forward work rising around the world,
              reminding us that this is not one place&apos;s effort. It is rising
              everywhere.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              Together, these layers hold a simple proposition: most maps show us
              where to extract, consume, or pass through. This one shows us where
              to participate, support, learn, build, and belong.
            </p>
          </section>

          {/* ═══ CENTERED ELEMENTAL PARAGRAPH ═══ */}
          <div style={{ ...glassCard, textAlign: "center" as const }}>
            <p
              style={{
                fontSize: "clamp(1.1rem, 1.3vw, 1.22rem)",
                lineHeight: 1.72,
                color: BODY_COLOR,
                margin: 0,
              }}
            >
              Life-forward is life in relationship with, not power over and
              extraction from — the ground on which we stand, the energy that
              warms and moves, the breath of fresh restorative air, and the vital
              water sustaining and cleansing. The elements in relationship, as what
              connects and holds us all.
            </p>
          </div>

          {/* ═══ A MAP OF DIRECTION ═══ */}
          <section style={glassCard}>
            <h2 style={sectionHeadingStyle}>A map of direction</h2>

            <p style={bodyStyle}>
              This is not a map of perfection. It is a map of direction.
            </p>

            <p style={bodyStyle}>
              We are not here to decide who is doing everything right. We are here
              to make visible what is moving toward regeneration, care, resilience,
              and community — and to help each point of light find the others.
            </p>

            <p style={bodyStyle}>
              It is up to your community to decide what life-forward means where
              you are. Diversity sustains. The ways forward are many-faceted.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              Every listing is a point of light. Individually, these places may
              seem small. Together, they form a constellation.
            </p>
          </section>

          {/* ═══ THE INVITATION ═══ */}
          <section style={glassCard}>
            <h2 style={sectionHeadingStyle}>The invitation</h2>

            <p style={bodyStyle}>
              If you are tending somewhere — add what you know, or invite the
              people doing the work to add themselves.
            </p>

            <p style={bodyStyle}>
              If you are looking for a practitioner, a business, or a resource
              aligned with how you want to live — search the support layer.
            </p>

            <p style={bodyStyle}>
              If you are looking for inspiration from the wider weaving — the
              constellation is drifting there.
            </p>

            <p style={bodyStyle}>
              If you want to help hold the foundation of this while the grassroots
              field fills in — you can{" "}
              <Link
                href="/founders"
                className="foundation-link"
              >
                become the Foundation
              </Link>
              .
            </p>

            <p
              style={{
                ...bodyStyle,
                fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
                color: "rgba(255,248,224,0.72)",
                marginTop: 8,
              }}
            >
              No meetings. No obligations. Participation at the pace of your life.
            </p>
          </section>

          {/* ═══ WHAT BELONGS HERE ═══ */}
          <section style={glassCard}>
            <h2 style={sectionHeadingStyle}>What belongs here</h2>

            <p style={bodyStyle}>
              If you are tending something life-forward, or you know of something
              that deserves to be seen, ask this:
            </p>

            <p
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontSize: "clamp(1.15rem, 1.4vw, 1.28rem)",
                lineHeight: 1.6,
                color: GOLD,
                margin: "28px 0",
              }}
            >
              Does this help people, land, community, or future generations in a
              life-supporting way?
            </p>

            <p style={bodyStyle}>If yes, it likely belongs here.</p>

            <p style={bodyStyle}>
              A few examples of what fits: farms and food projects, healing
              practices, repair shops, tool libraries, mutual aid networks, land
              restoration, community spaces, regenerative building, worker-owned
              businesses, education projects, arts and gathering places. The list
              is not the point. The direction is.
            </p>
          </section>

          {/* ═══ THE CANARY ═══ */}
          <section
            style={{ ...glassCard, textAlign: "center" as const, marginBottom: "clamp(80px, 10vh, 100px)" }}
          >
            <h2 style={{ ...sectionHeadingStyle, textAlign: "center" }}>
              The canary
            </h2>

            <p
              style={{
                ...bodyStyle,
                textAlign: "center",
                maxWidth: 560,
                margin: "0 auto",
              }}
            >
              The canaries are the ones who sense before. If we want to find our
              way to a kinder reality, we follow them to the places of common
              ground.
            </p>
          </section>

          {/* ═══ CLOSING — gold bookend, no heading ═══ */}
          <section
            style={{
              textAlign: "center",
              paddingBottom: "clamp(40px, 6vh, 80px)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)",
                  lineHeight: 1.4,
                  fontWeight: 600,
                  fontStyle: "italic",
                  color: GOLD,
                  textShadow:
                    "0 0 12px rgba(255,216,107,0.35), 0 0 24px rgba(255,216,107,0.20), 0 0 2px rgba(10,20,40,0.6)",
                }}
              >
                What we give our attention to, that is where we live our lives —
                against or for.
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)",
                  lineHeight: 1.4,
                  fontWeight: 600,
                  fontStyle: "italic",
                  color: GOLD,
                  textShadow:
                    "0 0 12px rgba(255,216,107,0.35), 0 0 24px rgba(255,216,107,0.20), 0 0 2px rgba(10,20,40,0.6)",
                }}
              >
                What we give our attention to grows.
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)",
                  lineHeight: 1.4,
                  fontWeight: 600,
                  fontStyle: "italic",
                  color: GOLD,
                  textShadow:
                    "0 0 12px rgba(255,216,107,0.35), 0 0 24px rgba(255,216,107,0.20), 0 0 2px rgba(10,20,40,0.6)",
                }}
              >
                Choose wisely, so your children too can choose.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
