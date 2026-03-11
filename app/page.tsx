import Link from "next/link";

const cards = [
  {
    title: "Take Part Near You",
    description:
      "Find life-supporting places you can engage. Your presence, your participation, and your choices help light them up.",
    href: "/map",
    primary: true,
  },
  {
    title: "Traveling or Curious?",
    description: "Search another region to see what’s alive there.",
    href: "/map",
  },
  {
    title: "Need Inspiration?",
    description:
      "Connect with stories and people living a future where life is in harmony.",
    href: "/constellation",
  },
];

export default function HomePage() {
  return (<main className="relative min-h-screen overflow-hidden bg-[#04142b] text-white">
      <BackgroundGlow />
      <MapWhisper />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl text-center">
          <div className="mx-auto mb-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,_rgba(255,225,150,1)_0%,_rgba(255,205,110,0.65)_20%,_rgba(255,185,80,0.35)_42%,_rgba(255,170,40,0.15)_60%,_transparent_78%)] blur-[0.8px]" />

          <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            A billion points of light connected,
            <br className="hidden sm:block" /> we dawn brighter.
          </h1>

          <p className="mt-8 text-xl text-white/88">Your attention is your vote.</p>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
            Your time, your presence, and your dollars help light up what is
            life-giving. Every choice makes a difference.
          </p>

          <p className="mt-12 text-lg text-white/80">Where would you like to begin?</p>

          <div className="mt-8 space-y-5 text-left">
            {cards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className={`group block rounded-3xl border px-6 py-6 transition duration-200 ${
                  card.primary
                    ? "border-white/18 bg-white/10 shadow-[0_0_40px_rgba(255,210,120,0.08)] hover:bg-white/14"
                    : "border-white/14 bg-white/7 hover:bg-white/10"
                }`}
              >
                <div className="text-2xl font-semibold tracking-tight text-white">
                  {card.title}
                </div>
                <p className="mt-3 text-lg leading-8 text-white/72 transition group-hover:text-white/84">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
function BackgroundGlow() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top, rgba(14,36,68,0.35) 0%, rgba(4,20,43,0.88) 30%, rgba(4,20,43,1) 72%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(80,130,220,0.12) 0%, transparent 55%)",
        }}
      />

      <div
        className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,205,120,0.32) 0%, rgba(255,180,80,0.14) 22%, rgba(255,170,50,0.06) 40%, transparent 68%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.02), transparent 22%, transparent 78%, rgba(255,255,255,0.015))",
        }}
      />
    </>
  );
}
function MapWhisper() {
  const dots = [
    { top: "10%", left: "14%", size: 9, opacity: 0.42 },
    { top: "16%", left: "30%", size: 8, opacity: 0.35 },
    { top: "20%", left: "72%", size: 10, opacity: 0.38 },
    { top: "27%", left: "12%", size: 8, opacity: 0.3 },
    { top: "31%", left: "82%", size: 9, opacity: 0.35 },
    { top: "39%", left: "24%", size: 10, opacity: 0.32 },
    { top: "44%", left: "66%", size: 8, opacity: 0.3 },
    { top: "53%", left: "15%", size: 9, opacity: 0.3 },
    { top: "57%", left: "80%", size: 10, opacity: 0.34 },
    { top: "64%", left: "34%", size: 8, opacity: 0.28 },
    { top: "71%", left: "62%", size: 9, opacity: 0.3 },
    { top: "79%", left: "20%", size: 8, opacity: 0.26 },
    { top: "82%", left: "76%", size: 9, opacity: 0.28 },

    { top: "22%", left: "52%", size: 11, opacity: 0.25 },
    { top: "48%", left: "50%", size: 10, opacity: 0.24 },
    { top: "72%", left: "48%", size: 9, opacity: 0.26 },

    { top: "36%", left: "42%", size: 8, opacity: 0.24 },
    { top: "60%", left: "40%", size: 9, opacity: 0.26 },
    { top: "18%", left: "60%", size: 8, opacity: 0.24 },
    { top: "76%", left: "60%", size: 9, opacity: 0.26 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.13]"
        viewBox="0 0 1200 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M80 700 C180 620, 300 650, 390 590 S620 500, 720 520 S930 640, 1120 560"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
        />
        <path
          d="M120 250 C250 210, 330 260, 430 240 S610 180, 760 220 S990 320, 1100 260"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        <path
          d="M180 120 C260 200, 240 320, 330 410 S520 610, 470 760"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <path
          d="M860 110 C790 200, 810 300, 760 390 S660 540, 700 760"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <path
          d="M250 520 C360 470, 480 480, 590 450 S830 390, 980 430"
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1"
        />
      </svg>

      {dots.map((dot, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[rgba(255,220,160,1)] blur-[0.4px]"
          style={{
            top: dot.top,
            left: dot.left,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
            boxShadow: "0 0 36px rgba(255,210,140,0.55)",
          }}
        />
      ))}
    </div>
  );
}