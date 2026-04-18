import Link from "next/link";

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

    // ── CANARY ZONE — bright cluster inside the silhouette (44-60% left, 18-32% top) ──
    { left: "46%", top: "20%", size: 7, opacity: 1.0, glow: 24, tone: "gold" },
    { left: "49%", top: "26%", size: 5, opacity: 0.95, glow: 20, tone: "gold" },
    { left: "52%", top: "22%", size: 9, opacity: 1.0, glow: 28, tone: "gold" },
    { left: "48%", top: "28%", size: 4, opacity: 0.9, glow: 18, tone: "gold" },
    { left: "54%", top: "24%", size: 6, opacity: 0.95, glow: 22, tone: "gold" },
    { left: "50%", top: "19%", size: 5, opacity: 0.92, glow: 20, tone: "gold" },
    { left: "45%", top: "30%", size: 3, opacity: 0.85, glow: 14, tone: "gold" },
    { left: "56%", top: "26%", size: 4, opacity: 0.88, glow: 16, tone: "gold" },
    // Extended canary surround
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

      {/* Warm diffuse glow behind the canary — she is made of light */}
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

      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div style={{ marginBottom: 18 }}>
          <Link
            href="/map"
            style={{
              color: "#FFD86B",
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            ← Return to the map
          </Link>
        </div>

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

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            About this project
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#d3e3f7]">
            A living orientation to what this platform is, why it exists, and
            what kinds of lights belong here.
          </p>

          <div className="mt-8 space-y-4 text-[17px] leading-8 text-[#d3e3f7]">
            <p>Life moves through a few simple needs:</p>

            <p className="font-medium text-[#f4f8ff]">
              air, water, soil, energy, and relationship.
            </p>

            <p>
              Canary Commons helps make visible what is already moving in those
              directions — in many different forms, across many different
              places.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6">
          <section className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-sm sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              What this is
            </h2>

            <div className="mt-5 space-y-5 text-[17px] leading-8 text-[#d3e3f7]">
              <p>
                Canary Commons is a living platform that helps make visible what
                is already life-supporting.
              </p>

              <p>
                It exists to help people find, support, and participate in the
                places, projects, and people that are working toward a more
                life-giving way of living — locally and everywhere.
              </p>

              <p>
                Most maps show us where to extract, consume, or pass through.
                This is different. It helps us see where we can participate,
                support, learn, build, and belong.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-sm sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Why it exists
            </h2>

            <div className="mt-5 space-y-5 text-[17px] leading-8 text-[#d3e3f7]">
              <p>This is not a map of perfection. It is a map of direction.</p>

              <p>
                We are not here to decide who is doing everything “right.” We
                are here to make visible what is moving toward regeneration,
                care, resilience, and community.
              </p>

              <p>
                What we give our attention to grows. Where we direct our time,
                money, energy, and care — that is what shapes the future.
              </p>

              <p>
                Every listing in this field is a point of light — something that
                is contributing, in its own way, to a more life-supporting
                future. Individually, these places may seem small. Together,
                they form a constellation.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-sm sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              What belongs here
            </h2>

            <div className="mt-5 space-y-5 text-[17px] leading-8 text-[#d3e3f7]">
              <p>
                This project can hold farms, food projects, repair shops, tool
                libraries, community spaces, education projects, land
                restoration efforts, healing practices, mutual aid networks,
                local businesses, arts spaces, housing projects, regenerative
                building efforts, energy projects, and other life-forward work.
              </p>

              <p>
                It is not about fitting everything into a perfect box. It is
                about helping people find what is already making life more
                possible, more connected, more resilient, and more alive.
              </p>

              <p>
                These expressions often support the basic conditions of life —
                breathable air, drinkable water, living soil, clean energy, and
                relationships rooted in care and reciprocity.
              </p>

              <p>If you are unsure whether something belongs, ask:</p>

              <p className="rounded-2xl border border-white/10 bg-black/15 px-5 py-4 font-medium text-[#f4f8ff]">
                Does this help people, land, community, or future generations
                in a life-supporting way?
              </p>

              <p>If yes, it likely belongs here.</p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-sm sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              How to participate
            </h2>

            <div className="mt-5 space-y-5 text-[17px] leading-8 text-[#d3e3f7]">
              <p>You can use this project to:</p>

              <ul className="space-y-3 pl-6 text-[#d3e3f7]">
                <li className="list-disc">Find places near you</li>
                <li className="list-disc">Explore other regions</li>
                <li className="list-disc">Read stories of place</li>
                <li className="list-disc">Add something that should be visible</li>
                <li className="list-disc">Support projects and businesses</li>
                <li className="list-disc">Help build the field over time</li>
              </ul>

              <p>
                This project grows through participation. It becomes more
                useful, more true, and more alive as people help reveal what is
                already here.
              </p>

              <div className="mt-8 pt-6 text-center">
                <p className="text-xl font-semibold tracking-wide text-[#f3d36a] sm:text-2xl">
                  All lights connected, we dawn brighter.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}