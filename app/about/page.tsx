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
    // Upper band
    { left: "4%", top: "6%", size: 2, opacity: 0.35, glow: 4, tone: "gold" },
    { left: "9%", top: "18%", size: 3, opacity: 0.55, glow: 6, tone: "cool" },
    { left: "14%", top: "9%", size: 2, opacity: 0.4, glow: 5, tone: "gold" },
    { left: "21%", top: "14%", size: 4, opacity: 0.7, glow: 9, tone: "gold" },
    { left: "17%", top: "28%", size: 2, opacity: 0.3, glow: 4, tone: "cool" },
    { left: "26%", top: "22%", size: 5, opacity: 0.8, glow: 11, tone: "gold" },
    { left: "32%", top: "7%", size: 2, opacity: 0.45, glow: 5, tone: "cool" },
    { left: "38%", top: "17%", size: 6, opacity: 0.85, glow: 13, tone: "gold" },
    { left: "44%", top: "12%", size: 8, opacity: 0.95, glow: 18, tone: "gold" },
    { left: "49%", top: "26%", size: 3, opacity: 0.55, glow: 6, tone: "cool" },
    { left: "55%", top: "8%", size: 4, opacity: 0.7, glow: 9, tone: "gold" },
    { left: "61%", top: "20%", size: 2, opacity: 0.4, glow: 4, tone: "cool" },
    { left: "66%", top: "11%", size: 10, opacity: 1.0, glow: 22, tone: "gold" },
    { left: "72%", top: "24%", size: 3, opacity: 0.6, glow: 7, tone: "cool" },
    { left: "78%", top: "16%", size: 5, opacity: 0.85, glow: 12, tone: "gold" },
    { left: "84%", top: "9%", size: 2, opacity: 0.35, glow: 4, tone: "cool" },
    { left: "89%", top: "22%", size: 4, opacity: 0.7, glow: 9, tone: "gold" },
    { left: "94%", top: "13%", size: 3, opacity: 0.55, glow: 6, tone: "cool" },

    // Middle belt
    { left: "6%", top: "36%", size: 3, opacity: 0.5, glow: 6, tone: "gold" },
    { left: "13%", top: "44%", size: 2, opacity: 0.35, glow: 4, tone: "cool" },
    { left: "22%", top: "40%", size: 4, opacity: 0.75, glow: 10, tone: "gold" },
    { left: "29%", top: "52%", size: 7, opacity: 0.92, glow: 15, tone: "cool" },
    { left: "36%", top: "46%", size: 2, opacity: 0.3, glow: 3, tone: "gold" },
    { left: "45%", top: "54%", size: 9, opacity: 1.0, glow: 20, tone: "gold" },
    { left: "53%", top: "42%", size: 3, opacity: 0.6, glow: 7, tone: "cool" },
    { left: "60%", top: "50%", size: 2, opacity: 0.4, glow: 4, tone: "gold" },
    { left: "68%", top: "38%", size: 5, opacity: 0.8, glow: 12, tone: "cool" },
    { left: "75%", top: "48%", size: 3, opacity: 0.55, glow: 6, tone: "gold" },
    { left: "83%", top: "44%", size: 4, opacity: 0.75, glow: 10, tone: "gold" },
    { left: "91%", top: "54%", size: 2, opacity: 0.35, glow: 4, tone: "cool" },

    // Lower band
    { left: "7%", top: "66%", size: 3, opacity: 0.55, glow: 6, tone: "cool" },
    { left: "16%", top: "74%", size: 5, opacity: 0.85, glow: 12, tone: "gold" },
    { left: "24%", top: "68%", size: 2, opacity: 0.4, glow: 4, tone: "gold" },
    { left: "34%", top: "80%", size: 8, opacity: 0.96, glow: 18, tone: "gold" },
    { left: "43%", top: "72%", size: 3, opacity: 0.6, glow: 7, tone: "cool" },
    { left: "52%", top: "84%", size: 4, opacity: 0.7, glow: 9, tone: "gold" },
    { left: "59%", top: "68%", size: 2, opacity: 0.35, glow: 4, tone: "cool" },
    { left: "67%", top: "76%", size: 10, opacity: 1.0, glow: 22, tone: "gold" },
    { left: "76%", top: "82%", size: 3, opacity: 0.5, glow: 6, tone: "gold" },
    { left: "85%", top: "70%", size: 5, opacity: 0.8, glow: 11, tone: "cool" },
    { left: "93%", top: "88%", size: 2, opacity: 0.3, glow: 3, tone: "gold" },
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
          <p className="mb-3 text-sm uppercase tracking-[0.22em] text-[#9fb8d8]">
            Canary Commons
          </p>

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