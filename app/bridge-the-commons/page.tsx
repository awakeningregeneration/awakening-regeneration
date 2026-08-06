import type { Metadata } from "next";
import Link from "next/link";
import { bridgeSections, bridgeClosing } from "./content";
import SlideHero from "./SlideHero";

export const metadata: Metadata = {
  title: "Bridge the Commons — Canary Commons",
  description:
    "A long-form companion to the Canary Commons stewardship narrative — why visibility infrastructure matters, and how stewardship bridges the commons into being.",
  robots: { index: false, follow: false },
};

const GOLD = "#FFD86B";
const BODY_COLOR = "#fff8e0";
const BG = "#08192d";

const bodyStyle: React.CSSProperties = {
  fontSize: "clamp(1.05rem, 1.2vw, 1.15rem)",
  lineHeight: 1.68,
  color: BODY_COLOR,
  margin: "0 0 1.15em",
};

export default function BridgeTheCommonsPage() {
  return (
    <main
      style={{
        background: BG,
        minHeight: "100vh",
        color: BODY_COLOR,
        paddingBottom: 100,
        position: "relative",
      }}
    >
      {/* ── Subtle star field — fixed, behind all content ── */}
      {([
        { left: "6%",  top: "8%",  size: 5, opacity: 0.65 },
        { left: "91%", top: "5%",  size: 4, opacity: 0.55 },
        { left: "78%", top: "14%", size: 6, opacity: 0.6  },
        { left: "15%", top: "31%", size: 4, opacity: 0.5  },
        { left: "88%", top: "38%", size: 5, opacity: 0.55 },
        { left: "4%",  top: "55%", size: 4, opacity: 0.5  },
        { left: "94%", top: "52%", size: 5, opacity: 0.55 },
        { left: "22%", top: "68%", size: 4, opacity: 0.5  },
        { left: "82%", top: "72%", size: 4, opacity: 0.52 },
        { left: "10%", top: "85%", size: 5, opacity: 0.5  },
        { left: "70%", top: "90%", size: 4, opacity: 0.48 },
        { left: "48%", top: "6%",  size: 3, opacity: 0.5  },
      ] as { left: string; top: string; size: number; opacity: number }[]).map((orb, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: "rgba(255,240,190,0.9)",
            opacity: orb.opacity,
            boxShadow: "0 0 10px 4px rgba(255,216,107,0.35), 0 0 28px 8px rgba(255,200,100,0.15)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}
      {/* ── Page header ── */}
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "clamp(56px, 9vw, 88px) 24px 0",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.78rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,216,107,0.55)",
            margin: "0 0 16px",
          }}
        >
          Canary Commons
        </p>
        <h1
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            lineHeight: 1.15,
            fontWeight: 700,
            color: GOLD,
            margin: "0 0 20px",
            textShadow:
              "0 0 40px rgba(255,216,107,0.25), 0 0 80px rgba(255,200,80,0.1)",
          }}
        >
          Bridge the Commons
        </h1>
        <p
          style={{
            fontSize: "clamp(1rem, 1.3vw, 1.1rem)",
            lineHeight: 1.65,
            color: "rgba(255,248,224,0.7)",
            maxWidth: 560,
            margin: "0 auto 0",
          }}
        >
          A companion narrative to the Canary Commons stewardship deck —
          on attention, visibility, and why this commons needs to exist.
        </p>
      </div>

      {/* ── 13 sections ── */}
      {bridgeSections.map((section, idx) => {
        const isLast = idx === bridgeSections.length - 1;

        return (
          <article key={section.num}>
            {/* Reading column wrapper */}
            <div
              style={{
                maxWidth: 700,
                margin: "0 auto",
                padding: "0 24px",
              }}
            >
              {/* ── Section top spacing ── */}
              <div style={{ height: "clamp(56px, 7vw, 80px)" }} />

              {/* ── Hero image ── */}
              <SlideHero
                num={section.num}
                boxes={section.slideText}
                title={section.title}
                priority={section.num <= 2}
                scrim={section.scrim}
              />

              {/* ── Section title ── */}
              <h2
                style={{
                  fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)",
                  fontWeight: 650,
                  letterSpacing: "0.01em",
                  color: GOLD,
                  margin: "28px 0 20px",
                }}
              >
                {section.title}
              </h2>

              {/* ── Body paragraphs ── */}
              {section.body.map((para, i) => (
                <p key={i} style={bodyStyle}>
                  {para}
                </p>
              ))}

              {/* ── Quote (when present) ── */}
              {section.quote && (
                <blockquote
                  style={{
                    margin: "32px 0 8px",
                    padding: "0 0",
                    textAlign: "center",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(1.15rem, 1.5vw, 1.35rem)",
                    lineHeight: 1.65,
                    color: "rgba(255,248,224,0.95)",
                    borderTop: "1px solid rgba(255,216,107,0.18)",
                    borderBottom: "1px solid rgba(255,216,107,0.18)",
                    paddingTop: 28,
                    paddingBottom: 24,
                    textShadow: "0 0 32px rgba(255,216,107,0.22), 0 1px 8px rgba(0,0,0,0.5)",
                  }}
                >
                  {section.quote}
                </blockquote>
              )}

              {/* ── Section divider (not after the last section) ── */}
              {!isLast && (
                <div
                  style={{
                    marginTop: section.quote ? 48 : 24,
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                  }}
                />
              )}
            </div>
          </article>
        );
      })}

      {/* ── Closing sections (no imagery) ── */}
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* ── Star row separator ── */}
        <div
          style={{
            marginTop: "clamp(56px, 7vw, 80px)",
            paddingTop: "clamp(40px, 5vw, 56px)",
            borderTop: "1px solid rgba(255,216,107,0.12)",
          }}
        >
          <p
            aria-hidden="true"
            style={{
              textAlign: "center",
              color: "rgba(255,216,107,0.7)",
              fontSize: "0.75rem",
              letterSpacing: "1.4em",
              paddingLeft: "1.4em",
              margin: "0 0 clamp(40px, 5vw, 56px)",
            }}
          >
            ✦ ✦ ✦ ✦ ✦
          </p>
        </div>

        {bridgeClosing.map((section, idx) => (
          <div key={section.heading} style={{ marginBottom: idx < bridgeClosing.length - 1 ? 52 : 0 }}>
            <h2
              style={{
                fontSize: "clamp(1.25rem, 1.8vw, 1.55rem)",
                fontWeight: 700,
                color: GOLD,
                margin: "0 0 20px",
                textShadow: "0 0 24px rgba(255,216,107,0.18)",
              }}
            >
              {section.heading}
            </h2>
            {section.body.map((para, i) => (
              <p key={i} style={bodyStyle}>
                {para}
              </p>
            ))}
          </div>
        ))}

        {/* ── Call to action ── */}
        <div
          style={{
            marginTop: 64,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: 52,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "clamp(1rem, 1.2vw, 1.1rem)",
              lineHeight: 1.65,
              color: "rgba(255,248,224,0.78)",
              marginBottom: 28,
            }}
          >
            If this resonates, stewardship is the bridge.
          </p>
          <Link
            href="/founders/join"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              borderRadius: 999,
              background: GOLD,
              color: "#1a2a0e",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              boxShadow:
                "0 0 32px rgba(255,216,107,0.22), 0 4px 16px rgba(255,200,80,0.16)",
              marginBottom: 20,
            }}
          >
            Steward the Commons →
          </Link>

          {/* PDF link — hidden until BridgeTheCommons.pdf is placed in /public.
              To restore: remove the outer comment tags.
          <div style={{ marginTop: 16 }}>
            <a
              href="/BridgeTheCommons.pdf"
              style={{
                fontSize: "0.88rem",
                color: "rgba(159,184,216,0.58)",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Download this as a PDF →
            </a>
          </div>
          */}
        </div>
      </div>
    </main>
  );
}
