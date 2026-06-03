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
            This resource is built to redirect energy from the things we do not
            want to those that we do. The world is full of extraction based
            conglomerates that are reducing livability on the planet. There are
            also a world of endeavors and the incredible people behind them out
            there seeking to do great things and actively doing great things with
            limited resources. They don&apos;t have billionaire publicity
            budgets. Our attention is focused by those who have the capacity to
            influence.
          </p>

          <p style={bodyStyle}>
            This map — soon an app — is built on the premise that we build what
            we pay attention to as our actions follow our attention. Now is the
            moment to build the world we want to live in.
          </p>

          <p style={bodyStyle}>
            This map/app/resource and inspiration guide is built to reveal,
            support, draw attention to and center all of the amazing people
            making the difference every day. I believe we have the ability to
            redirect the trajectory of what is by redirecting our focus.
          </p>

          <p style={bodyStyle}>
            What I have discovered along the way is that there are way more
            amazing things happening out there that help us live in kind
            relationship with the world and each other. Our job is to lift them,
            support them, become them, and let the rest go.
          </p>

          <p style={bodyStyle}>
            Functionally as an app this will allow you to find those things,
            learn about them, and participate in them.
          </p>

          <p style={bodyStyle}>
            The front facing languaging of this project may feel obscure. The
            reason for that is simple – the best of intentions and the words that
            match them have been bought and repurposed for extraction. If you add
            something to this map, you will find those words are available in the
            infrastructure that supports your listing and participation.
          </p>

          <p style={bodyStyle}>
            If you are here, you are here because you want to participate in the
            things that I have loosely called life forward. It is not a perfect
            pair of words to carry the weight. They are words that describe
            instead of label.
          </p>

          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            If you recognize yourself in the words, may this map serve you – as
            a guide to what aligns with a kinder and more resilient way of
            living, or as a place where what you offer becomes visible and
            supported. May we all find our way to kinder options, together, one
            step at a time.
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
              Connected we dawn brighter
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
