export default function AboutPage() {
  const lights = [
    { left: "8%", top: "12%", size: 10, glow: 1.2 },
    { left: "18%", top: "22%", size: 7, glow: 0.9 },
    { left: "28%", top: "10%", size: 9, glow: 1.1 },
    { left: "42%", top: "18%", size: 8, glow: 1.05 },
    { left: "55%", top: "12%", size: 10, glow: 1.25 },
    { left: "68%", top: "20%", size: 7, glow: 0.95 },
    { left: "82%", top: "14%", size: 9, glow: 1.15 },
    { left: "90%", top: "26%", size: 6, glow: 0.85 },

    { left: "12%", top: "36%", size: 8, glow: 1.05 },
    { left: "24%", top: "30%", size: 6, glow: 0.85 },
    { left: "36%", top: "40%", size: 9, glow: 1.15 },
    { left: "49%", top: "34%", size: 7, glow: 0.9 },
    { left: "63%", top: "38%", size: 10, glow: 1.2 },
    { left: "76%", top: "32%", size: 8, glow: 1.05 },
    { left: "88%", top: "42%", size: 7, glow: 0.9 },

    { left: "10%", top: "56%", size: 9, glow: 1.1 },
    { left: "20%", top: "68%", size: 7, glow: 0.9 },
    { left: "33%", top: "60%", size: 10, glow: 1.2 },
    { left: "46%", top: "72%", size: 8, glow: 1.05 },
    { left: "58%", top: "58%", size: 7, glow: 0.95 },
    { left: "71%", top: "66%", size: 10, glow: 1.25 },
    { left: "84%", top: "60%", size: 8, glow: 1.05 },

    { left: "14%", top: "84%", size: 6, glow: 0.8 },
    { left: "30%", top: "88%", size: 8, glow: 1.0 },
    { left: "44%", top: "86%", size: 7, glow: 0.9 },
    { left: "61%", top: "90%", size: 9, glow: 1.15 },
    { left: "78%", top: "84%", size: 7, glow: 0.9 },
    { left: "90%", top: "92%", size: 6, glow: 0.8 },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08192d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(26,72,130,0.28)_0%,_rgba(7,24,45,0.9)_38%,_rgba(5,16,31,1)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(88,156,255,0.12)_0%,_transparent_32%),radial-gradient(circle_at_80%_30%,_rgba(88,156,255,0.1)_0%,_transparent_28%),radial-gradient(circle_at_50%_80%,_rgba(88,156,255,0.08)_0%,_transparent_34%)]" />

      <div className="pointer-events-none absolute inset-0">
        {lights.map((light, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-[#fff7cc]"
            style={{
              left: light.left,
              top: light.top,
              width: `${light.size}px`,
              height: `${light.size}px`,
              boxShadow: `0 0 ${14 * light.glow}px rgba(255, 242, 170, 0.75), 0 0 ${28 * light.glow}px rgba(120, 180, 255, 0.28)`,
              opacity: 0.95,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-sm uppercase tracking-[0.22em] text-[#9fb8d8]">
            Awakening Regeneration
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            About this map
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#d3e3f7]">
            A living orientation to what this platform is, why it exists, and
            what kinds of lights belong here.
          </p>
          </div>

         

        <div className="mx-auto mt-12 grid max-w-4xl gap-6">
          <section className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-sm sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              What this is
            </h2>

            <div className="mt-5 space-y-5 text-[17px] leading-8 text-[#d3e3f7]">
              <p>
                Awakening Regeneration is a map of what is already
                life-supporting.
              </p>

              <p>
                It exists to help people find, support, and participate in the
                places, projects, and people that are working toward a more
                life-giving way of living — locally and everywhere.
              </p>

              <p>
                Most maps show us where to extract, consume, or pass through.
                This map is different. This map helps us see where we can
                participate, support, learn, build, and belong.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-sm sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Why it exists
            </h2>

            <div className="mt-5 space-y-5 text-[17px] leading-8 text-[#d3e3f7]">
              <p>
                This is not a map of perfection. It is a map of direction.
              </p>

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
                Every listing on this map is a point of light — something that
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
                This map can hold farms, food projects, repair shops, tool
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
                If you are unsure whether something belongs, ask:
              </p>

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
              <p>You can use this map to:</p>

              <ul className="space-y-3 pl-6 text-[#d3e3f7]">
                <li className="list-disc">Find places near you</li>
                <li className="list-disc">Explore other regions</li>
                <li className="list-disc">Read stories of place</li>
                <li className="list-disc">Add something that should be visible</li>
                <li className="list-disc">Support projects and businesses</li>
                <li className="list-disc">Help build the map over time</li>
              </ul>

              <p>
                This map grows through participation. It becomes more useful,
                more true, and more alive as people help reveal what is already
                here.
              </p>
              <div className="mt-8 pt-6 text-center">
  <p className="text-xl font-semibold tracking-wide text-[#f3d36a] sm:text-2xl">
    A Billion Points of Light Connected, We Dawn Brighter.
  </p>
</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}