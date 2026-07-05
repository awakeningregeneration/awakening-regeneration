const GOLD = "#FFD86B";
const BODY_COLOR = "#fff8e0";

const bodyStyle: React.CSSProperties = {
  fontSize: "clamp(1.05rem, 1.2vw, 1.15rem)",
  lineHeight: 1.68,
  color: BODY_COLOR,
  margin: "0 0 1.15em",
};

const orbs: { left: string; top: string; size: number; opacity: number }[] = [
  { left: "6%", top: "4%", size: 6, opacity: 0.7 },
  { left: "18%", top: "10%", size: 10, opacity: 0.68 },
  { left: "29%", top: "3%", size: 4, opacity: 0.6 },
  { left: "40%", top: "12%", size: 14, opacity: 0.45 },
  { left: "52%", top: "6%", size: 7, opacity: 0.7 },
  { left: "63%", top: "11%", size: 11, opacity: 0.62 },
  { left: "76%", top: "4%", size: 5, opacity: 0.65 },
  { left: "88%", top: "9%", size: 16, opacity: 0.45 },
  { left: "4%", top: "22%", size: 9, opacity: 0.68 },
  { left: "15%", top: "28%", size: 5, opacity: 0.65 },
  { left: "26%", top: "20%", size: 12, opacity: 0.55 },
  { left: "37%", top: "30%", size: 7, opacity: 0.68 },
  { left: "49%", top: "24%", size: 18, opacity: 0.45 },
  { left: "61%", top: "32%", size: 4, opacity: 0.55 },
  { left: "73%", top: "26%", size: 10, opacity: 0.65 },
  { left: "87%", top: "30%", size: 6, opacity: 0.68 },
  { left: "7%", top: "42%", size: 11, opacity: 0.6 },
  { left: "19%", top: "48%", size: 5, opacity: 0.62 },
  { left: "31%", top: "44%", size: 15, opacity: 0.45 },
  { left: "43%", top: "50%", size: 7, opacity: 0.68 },
  { left: "54%", top: "46%", size: 9, opacity: 0.65 },
  { left: "66%", top: "52%", size: 4, opacity: 0.55 },
  { left: "78%", top: "45%", size: 12, opacity: 0.55 },
  { left: "90%", top: "51%", size: 6, opacity: 0.68 },
  { left: "5%", top: "62%", size: 14, opacity: 0.45 },
  { left: "16%", top: "70%", size: 5, opacity: 0.65 },
  { left: "27%", top: "64%", size: 8, opacity: 0.7 },
  { left: "38%", top: "72%", size: 16, opacity: 0.45 },
  { left: "50%", top: "66%", size: 6, opacity: 0.68 },
  { left: "62%", top: "74%", size: 11, opacity: 0.62 },
  { left: "74%", top: "68%", size: 4, opacity: 0.55 },
  { left: "86%", top: "74%", size: 13, opacity: 0.45 },
  { left: "6%", top: "82%", size: 7, opacity: 0.7 },
  { left: "17%", top: "90%", size: 10, opacity: 0.68 },
  { left: "29%", top: "84%", size: 4, opacity: 0.6 },
  { left: "41%", top: "92%", size: 13, opacity: 0.45 },
  { left: "53%", top: "86%", size: 5, opacity: 0.65 },
  { left: "65%", top: "93%", size: 9, opacity: 0.7 },
  { left: "78%", top: "85%", size: 15, opacity: 0.45 },
  { left: "90%", top: "91%", size: 6, opacity: 0.68 },
];

function Atmosphere() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(26,72,130,0.32) 0%, rgba(5,16,31,1) 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(circle at 18% 14%, rgba(40,90,160,0.18) 0%, transparent 38%), radial-gradient(circle at 82% 12%, rgba(40,90,160,0.14) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(60,110,200,0.11) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {orbs.map((orb, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(${orb.left} - ${orb.size}px)`,
              top: `calc(${orb.top} - ${orb.size}px)`,
              width: orb.size * 3,
              height: orb.size * 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,220,140,${
                orb.opacity * 0.12
              }) 0%, transparent 70%)`,
            }}
          >
            <div
              style={{
                width: orb.size,
                height: orb.size,
                borderRadius: "50%",
                background: "rgba(255,240,190,0.72)",
                opacity: orb.opacity,
                boxShadow: `0 0 ${orb.size * 1.7}px ${
                  orb.size * 0.4
                }px rgba(255,220,140,0.18), 0 0 ${orb.size * 4.2}px ${
                  orb.size * 0.9
                }px rgba(255,200,100,0.06)`,
                filter: `blur(${orb.size * 0.15}px)`,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default function LetterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08192d] text-white">
      <Atmosphere />

      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20" style={{ zIndex: 2 }}>
        {/* Logo */}
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
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(1.5rem, 2.5vw, 1.75rem)",
              fontWeight: 600,
              color: BODY_COLOR,
              textAlign: "center",
              margin: "0 0 clamp(40px, 6vh, 60px)",
            }}
          >
            A Letter from the Founder
          </h1>

          {/* Body */}
          <p style={bodyStyle}>
            Canary Commons was born many years ago — some fifteen of
            them — and had an initial run I was never able to carry all the
            way forward. I tried to let it go and move on. The persistence of
            the dream never let me go.
          </p>

          <p style={bodyStyle}>
            I ran an inn on the Oregon coast, restoring it with care for where
            everything was sourced and the hands of participation along the way.
            And in that work I discovered two things at once: how hard it was to
            find the thoughtful — the well-sourced, the crafted, the
            made-with-care — and how astonishing it was every time I did. The
            individual, spectacular solutions to everyday life, living in harmony
            with the world around them. It was all there. Just hidden. Because
            care, most of the time, doesn&apos;t have an advertising budget.
          </p>

          <p style={bodyStyle}>
            Something else I know as essential: the forest grows strong when
            diversity is its understory and the branches of plenty have many
            offerings. This is true of life. Everywhere is different, and
            sustainability looks different from different places.
            Canary — and the songs leading us toward freedom and
            possibility — sounds different depending on the geography. This map
            is built to honor the local and be inspired by the global.
          </p>

          <p style={bodyStyle}>
            I learned the power of focus firsthand. I have spent my life working
            with the cast aside — those who cannot find refuge and health in the
            current structures — from children carrying abuse and passing it
            forward in violence, to the sick who have found no medical relief.
            From that work, and from the silent choices of courage I watched
            people make to redirect toward the open door, I know the depth of
            the power of attention. We grow what we give our vision to. We build
            the world we pay attention to, because our actions follow our
            focus — and now is the moment to build the world we want to live in.
          </p>

          <p style={bodyStyle}>
            And then the deepest reason, underneath all the others. I became a
            mother because that call was the clearest bell I have ever heard
            ringing — and I knew, in that surrender, that I must bring through
            what calls the pathways of peace forward. My life is a dedication to
            that: to a world of kindness she can live in fully, and dream past
            anything I&apos;m able to dream, because she&apos;s held by the
            peaceful paths so many people are quietly weaving beneath all the
            noise. I have always believed the overlooked are where the beauty is.
            This map is my way of pulling toward that world with everything
            I&apos;m worth.
          </p>

          <p style={bodyStyle}>
            So this is what Canary Commons is: a way to reveal, support, and
            draw attention to the people making the difference every day — to
            find them, learn about them, and take part in them. Not to name
            what&apos;s broken; that story is told everywhere already. But to
            lift what&apos;s alive, become it, and let the rest go.
          </p>

          <p style={bodyStyle}>
            I believe we are in a great turning, and that our choice of focus is
            the pivot point — and our power.
          </p>

          <p style={bodyStyle}>
            Seeds are the message carriers for tomorrow.
          </p>

          <p style={bodyStyle}>
            Together, we have this. We can, we will, we must — and it is
            definitely time now.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            We are right on time. Tomorrow is shining on the horizon.
            Let&apos;s welcome it together.
          </p>

          {/* Benediction + Signature */}
          <div
            style={{
              textAlign: "center",
              marginTop: "clamp(60px, 8vh, 100px)",
              paddingBottom: "clamp(40px, 6vh, 80px)",
            }}
          >
            <p
              style={{
                fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
                fontWeight: 600,
                letterSpacing: "0.18em",
                color: GOLD,
                margin: "0 0 40px",
                textTransform: "uppercase",
              }}
            >
              Connected, we dawn brighter
            </p>

            {/* Lotus mark */}
            <div style={{ marginBottom: 12 }}>
              <svg
                width="80"
                viewBox="0 0 110 80"
                role="img"
                aria-label="Ren — lotus mark"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block", margin: "0 auto" }}
              >
                <circle cx="55" cy="40" r="34" fill="#FFD86B" opacity="0.045" />
                <circle cx="55" cy="40" r="24" fill="#FFD86B" opacity="0.06" />
                <circle cx="55" cy="40" r="15" fill="#FFD86B" opacity="0.09" />
                <g
                  transform="translate(55,64)"
                  fill="#FFD86B"
                  fillOpacity="0.85"
                  stroke="#FFE9A8"
                  strokeWidth="0.7"
                  strokeLinejoin="round"
                >
                  <path
                    transform="rotate(-78)"
                    d="M0,0 C-10,-6 -6,-29 0,-35 C6,-29 10,-6 0,0 Z"
                  />
                  <path
                    transform="rotate(-52)"
                    d="M0,0 C-10,-6 -7,-33 0,-40 C7,-33 10,-6 0,0 Z"
                  />
                  <path
                    transform="rotate(-26)"
                    d="M0,0 C-11,-7 -7,-37 0,-45 C7,-37 11,-7 0,0 Z"
                  />
                  <path
                    transform="rotate(0)"
                    d="M0,0 C-11,-7 -7,-40 0,-48 C7,-40 11,-7 0,0 Z"
                  />
                  <path
                    transform="rotate(26)"
                    d="M0,0 C-11,-7 -7,-37 0,-45 C7,-37 11,-7 0,0 Z"
                  />
                  <path
                    transform="rotate(52)"
                    d="M0,0 C-10,-6 -7,-33 0,-40 C7,-33 10,-6 0,0 Z"
                  />
                  <path
                    transform="rotate(78)"
                    d="M0,0 C-10,-6 -6,-29 0,-35 C6,-29 10,-6 0,0 Z"
                  />
                </g>
                <path
                  d="M35,66 Q55,72 75,66"
                  fill="none"
                  stroke="#FFD86B"
                  strokeWidth="1.3"
                  opacity="0.7"
                />
              </svg>
            </div>

            <p
              style={{
                fontSize: "clamp(1.2rem, 1.6vw, 1.4rem)",
                fontWeight: 600,
                fontStyle: "italic",
                color: GOLD,
                margin: 0,
              }}
            >
              Ren
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
