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
            src="/canary-logo-new.png"
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

          {/* ═══ HEADING ═══ */}
          <div
            style={{
              textAlign: "center",
              padding: "clamp(40px, 6vh, 80px) 0 clamp(60px, 8vh, 80px)",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 650,
                color: GOLD,
                margin: 0,
                lineHeight: 1.2,
                textShadow:
                  "0 0 18px rgba(255,216,107,0.3), 0 0 40px rgba(255,216,107,0.12)",
              }}
            >
              About
            </h1>
          </div>

          {/* ═══ OPENING ═══ */}
          <section style={glassCard}>
            <p style={bodyStyle}>
              Canary Commons is an interactive website — and soon a mobile
              app — that helps you discover the people, places, businesses,
              organizations, and stories already helping life flourish in
              your community and beyond.
            </p>

            <p style={bodyStyle}>
              It is an interactive guide to the good around you: a growing
              map of the people and projects whose way of living gives back
              to life instead of depleting it. Every point on the map leads
              to someone doing the quiet work of creating and nourishing a
              healthier, more whole world.
            </p>

            <p style={bodyStyle}>
              Our attention isn&apos;t passive. Where it goes, energy flows and
              action follows. What we give our attention to, we
              feed — and what we feed becomes the world we live in. Our
              attention is one of the most generative resources we have,
              yet much of it is spent on things we never consciously chose
              because there are profits to be made directing our gaze.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              Canary Commons is a place to reclaim that attention and place
              it where it is generative rather than extractive. As more
              life-supporting work becomes visible, it becomes easier to
              discover, easier to choose, and easier to strengthen. In
              return, the world we want to live in quietly grows around us.
            </p>
          </section>

          {/* ═══ MISSION LINE — set apart, emphasized ═══ */}
          <div
            style={{
              textAlign: "center",
              padding: "clamp(36px, 5vh, 56px) 0",
            }}
          >
            <p
              style={{
                fontSize: "clamp(1.22rem, 1.6vw, 1.42rem)",
                lineHeight: 1.65,
                fontWeight: 450,
                fontStyle: "italic",
                color: GOLD,
                margin: "0 auto",
                maxWidth: 620,
                textShadow:
                  "0 0 14px rgba(255,216,107,0.25), 0 0 32px rgba(255,216,107,0.10)",
              }}
            >
              Our mission is simple: make this life-supporting work more
              visible — so that we can give it our attention, and, as
              consumers and neighbors, make choices that help us grow into
              the world we want to inhabit.
            </p>
          </div>

          {/* ═══ WHAT THE COMMONS OFFERS ═══ */}
          <section style={glassCard}>
            <h2 style={sectionHeadingStyle}>What the Commons offers</h2>

            <p style={bodyStyle}>
              <span style={{ color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
                The Map
              </span>{" "}
              — Each yellow light is one of these places: somewhere to
              eat, shop, gather, or build a life that gives back instead
              of taking. Together they form a constellation of
              life-supporting work across North America and beyond.
            </p>

            <p style={bodyStyle}>
              <span style={{ color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
                The Stories
              </span>{" "}
              — Experience a place through the stories told about it.
              Whether you&apos;re traveling, putting down roots somewhere
              new, or looking closer at where you already live, the
              stories let you meet the people and places making a
              difference — and feel a place before you ever arrive.
            </p>

            <p style={bodyStyle}>
              <span style={{ color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
                Online Resources
              </span>{" "}
              — Online options you can reach from anywhere — for when the
              light near you isn&apos;t on the map yet.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              <span style={{ color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
                The Greater Constellation
              </span>{" "}
              — Signals of life-supporting work rising around the world,
              reminding us that we are not alone, and that there is good
              to be inspired by everywhere. Visit the Greater
              Constellation to explore projects happening across the
              globe.
            </p>
          </section>

          {/* ═══ HOW THE COMMONS WORKS ═══ */}
          <section style={glassCard}>
            <h2 style={sectionHeadingStyle}>How the Commons Works</h2>

            <p style={bodyStyle}>
              Canary Commons is built around a simple founding principle:
            </p>

            <p style={bodyStyle}>
              <em>Visibility should not belong to the highest bidder.</em>
            </p>

            <p style={bodyStyle}>
              There is no pay-to-play. Every place on the map is there
              because of what it contributes — not because it paid to be
              found. There is no charge for your place in the commons, and
              the map remains free for everyone to explore and use.
            </p>

            <p style={bodyStyle}>
              We believe that the people, businesses, organizations, farms,
              artists, educators, and community projects helping life
              flourish deserve to be visible because of the good they bring
              into the world — not because they purchased attention.
            </p>

            <p style={bodyStyle}>
              The platform itself has been built. What is unfolding now is
              the living commons: the careful work of discovering,
              verifying, and making visible the remarkable people and places
              already creating another way of living. This work is actively
              stewarded as the commons continues to grow.
            </p>

            <p style={bodyStyle}>
              During this founding season, those who choose to{" "}
              <Link
                href="/founders/join"
                style={{
                  color: GOLD,
                  fontWeight: 700,
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                }}
              >
                Steward the Commons
              </Link>{" "}
              help bridge this work from a completed platform to a richly
              populated public resource. As the commons matures into a
              trusted nationwide guide, Canary is designed to become
              sustainably supported through carefully chosen partnerships
              with mission-aligned online resources rather than by charging
              for visibility or access.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              Our hope is simple: to create a trusted, independent commons
              that remains free to use, free to join, and dedicated to
              helping us all discover, choose, and strengthen the people and
              places already giving back to life.
            </p>
          </section>

          {/* ═══ WHAT DOES IT MEAN TO BE LIFE-SUPPORTING? ═══ */}
          <section style={{ ...glassCard, marginBottom: "clamp(80px, 10vh, 100px)" }}>
            <h2 style={sectionHeadingStyle}>
              What does it mean to be life-supporting?
            </h2>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              To be life-supporting is to live in relationship with life
              and what sustains it — not to have power over it, or to
              extract from it. The ground we stand on, the energy that
              moves us, the fresh air that restores us, the water that
              sustains and cleanses. Only a healthy, respectful
              relationship with these elements can sustain and empower
              life.
            </p>
          </section>

          {/* ═══ LETTER LINK ═══ */}
          <p
            style={{
              textAlign: "center",
              fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
              color: "rgba(255,248,224,0.72)",
              margin: "0 0 24px",
            }}
          >
            <Link
              href="/letter"
              style={{
                color: "rgba(255,248,224,0.72)",
                textDecoration: "underline",
                textUnderlineOffset: 2,
              }}
            >
              Read a letter from the founder
            </Link>
          </p>

          {/* ═══ CONTACT ═══ */}
          <p
            style={{
              textAlign: "center",
              fontSize: "clamp(0.92rem, 1.05vw, 1rem)",
              color: "rgba(255,248,224,0.55)",
              margin: 0,
              paddingBottom: "clamp(40px, 6vh, 80px)",
            }}
          >
            Reach the project at{" "}
            <a
              href="mailto:hello@canarycommons.org"
              style={{
                color: "rgba(255,248,224,0.55)",
                textDecoration: "underline",
                textUnderlineOffset: 2,
              }}
            >
              hello@canarycommons.org
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
