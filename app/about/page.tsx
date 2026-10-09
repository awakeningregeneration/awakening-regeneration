"use client";

import { useState } from "react";
import Link from "next/link";
import DawningBrighter from "@/app/components/DawningBrighter";

const GOLD = "#FFD86B";
const BODY_COLOR = "#fff8e0";

// Chapter marker — centered, gold, visually distinct from body copy.
// Used only for the page's major section headings (see visual grammar
// note above each section below): centered gold = new chapter,
// left-aligned gold = an item within that chapter, white = body copy.
const chapterHeadingStyle: React.CSSProperties = {
  fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
  fontWeight: 650,
  color: GOLD,
  textAlign: "center",
  margin: "0 0 30px",
  textShadow:
    "0 0 16px rgba(255,216,107,0.22), 0 0 36px rgba(255,216,107,0.08)",
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

  // Subtle hover/focus lift for the clickable Canary invitation below —
  // no separate button chrome, just the bird itself responding.
  const [birdHover, setBirdHover] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08192d] text-white">
      {/* ── Dawn preview background (About page only) ── */}
      <DawningBrighter lift="dawn" />

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

          {/* ═══ ANOTHER WAY IS ALREADY HERE ═══ */}
          <section style={glassCard}>
            <h2 style={chapterHeadingStyle}>Another way is already here.</h2>

            <p style={bodyStyle}>
              There is already a world of answers in the direction the
              canary would lead if we released her from the coal mine.
              Canary Commons was built to make those lights easier to see
              — and easier to choose.
            </p>

            <p style={bodyStyle}>
              We do not all have to choose the same thing. Canary is
              designed to be user-led. In your community, you help decide
              what is Canary-friendly — what is making a difference and
              helping build a world that cares for the life we pass
              forward.
            </p>

            <p style={bodyStyle}>
              The map is here to help you find what is happening around
              you — and make it easier to put your money, time, attention,
              and participation toward the things that give back.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              <Link
                href="/install"
                style={{
                  color: GOLD,
                  fontWeight: 600,
                  fontStyle: "italic",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                Canary is an app — a pocket bird to take you to the places
                where canaries thrive.
              </Link>
            </p>
          </section>

          {/* ═══ WHAT WE GIVE OUR ATTENTION TO, WE FEED ═══ */}
          <section style={glassCard}>
            <h2 style={chapterHeadingStyle}>
              What we give our attention to, we feed.
            </h2>

            <p style={bodyStyle}>
              Our attention isn&apos;t passive. Where it goes, energy flows
              and action follows.
            </p>

            <p style={bodyStyle}>
              Much of our attention is spent on things we never consciously
              chose. There are powerful systems built around capturing our
              gaze — particularly with what is frightening, divisive,
              broken, or difficult to look away from.
            </p>

            <p style={bodyStyle}>
              Meanwhile, quieter things are happening everywhere. We live
              in a world where technology makes a lot possible. We can
              choose it to direct us to those things worth our support and
              participation.
            </p>

            <p style={bodyStyle}>
              Someone is restoring a watershed. Someone opened a bakery
              using grain grown nearby. Someone built a tool library
              instead of another store. Someone figured out how to restore
              land after fire. A cooperative is keeping wealth in its
              community. A small business is making something useful
              without asking the earth to absorb the cost. Neighbors found
              a way to solve something together.
            </p>

            <p style={bodyStyle}>They may not have the biggest advertising budget.</p>

            <p style={bodyStyle}>They may not be the loudest story.</p>

            <p style={bodyStyle}>
              But{" "}
              <strong style={{ color: GOLD }}>they are already here.</strong>
            </p>

            <p style={bodyStyle}>
              Canary Commons is a place to redirect some of our attention
              toward them.
            </p>

            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              As life-supporting work becomes easier to see, it becomes
              easier to discover, easier to choose, and easier to
              strengthen.
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
              The mission is simple: make what is already life-giving
              easier to see, choose, and strengthen.
            </p>
          </div>

          {/* ═══ WHAT THE COMMONS OFFERS ═══ */}
          <section style={glassCard}>
            <h2 style={chapterHeadingStyle}>What the Commons offers</h2>

            {/* The Map */}
            <p style={bodyStyle}>
              <span style={{ color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
                The Map
              </span>
            </p>
            <p style={{ ...bodyStyle, color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
              Find the lights already on around you.
            </p>
            <p style={bodyStyle}>
              Each light is a place doing some piece of life differently —
              somewhere to eat, shop, gather, learn, repair, heal, grow,
              share, or participate.
            </p>
            <p style={bodyStyle}>
              We started by mapping Oregon. Now the map grows as people
              find and add the lights around them.
            </p>
            <p style={bodyStyle}>
              No one light is the answer. No one way is <em>the</em> way.
              Together, by refocusing where we give our life energy, we
              can give wings to a whole other way of living. It&apos;s
              already here. Now let&apos;s feed it — and let the rest go.
            </p>
            <p style={{ ...bodyStyle, color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
              Every light added makes another way easier to see.
            </p>

            {/* Online Resources */}
            <p style={{ ...bodyStyle, marginTop: "1.6em" }}>
              <span style={{ color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
                Online Resources
              </span>
            </p>
            <p style={{ ...bodyStyle, color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
              Look local first. When what you need isn&apos;t available
              locally, look here.
            </p>
            <p style={bodyStyle}>
              Canary&apos;s Online Resources offer aligned options you can
              reach from anywhere.
            </p>
            <p style={bodyStyle}>
              These partnerships are part of the economic engine of the
              Commons. Canary helps people discover and support businesses
              working toward a more life-giving world; participating
              partners, in return, help sustain the infrastructure that
              keeps Canary free for local businesses and free for the
              people who use it.
            </p>
            <p style={bodyStyle}>
              It is a reciprocal model:{" "}
              <strong style={{ color: GOLD }}>
                move support toward what is life-giving, and let that
                support keep the Commons open.
              </strong>
            </p>

            {/* The Greater Constellation */}
            <p style={{ ...bodyStyle, marginTop: "1.6em" }}>
              <span style={{ color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
                The Greater Constellation
              </span>
            </p>
            <p style={bodyStyle}>
              Sometimes the answer isn&apos;t nearby — but someone,
              somewhere, has already begun finding it.
            </p>
            <p style={bodyStyle}>
              The Greater Constellation gathers signals of life-supporting
              work from around the world: approaches to restoration,
              cooperation, conflict, protection, community, ecology, and
              other questions we&apos;re often told have no good answers.
            </p>
            <p style={bodyStyle}>It isn&apos;t a collection of perfect solutions.</p>
            <p style={bodyStyle}>It&apos;s somewhere else to look.</p>
            <p style={bodyStyle}>A way to ask:</p>
            <p style={{ ...bodyStyle, color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
              Has anyone already found another way through this?
            </p>

            <p
              style={{
                ...bodyStyle,
                marginTop: "1.6em",
                color: GOLD,
                fontWeight: 600,
                fontStyle: "italic",
              }}
            >
              Stunningly, the answer to that question is yes.
            </p>

            {/* Stories of Place */}
            <p style={{ ...bodyStyle, marginTop: "1.6em" }}>
              <span style={{ color: GOLD, fontWeight: 600, fontStyle: "italic" }}>
                Stories of Place
              </span>
            </p>
            <p style={bodyStyle}>A place is more than a pin on a map.</p>
            <p style={bodyStyle}>
              Behind the bakery, farm, restoration project, community
              space, cooperative, or neighborhood effort is a story:
              something was needed, someone imagined something different,
              people tried things, learned things, failed at things, and
              found things that worked.
            </p>
            <p style={bodyStyle}>Stories of Place let that wisdom travel.</p>
            <p style={bodyStyle}>
              As people tell the stories of what is happening where they
              live — what inspired it, how it came to be, what was learned
              along the way — we can begin to experience a place through
              the people tending it.
            </p>
            <p style={{ ...bodyStyle, marginBottom: 0 }}>
              And perhaps something discovered in one place becomes
              possible in another.
            </p>
          </section>

          {/* ═══ HOW THE COMMONS WORKS ═══ */}
          <section style={glassCard}>
            <h2 style={chapterHeadingStyle}>How the Commons works</h2>

            <p style={bodyStyle}>
              <em>Visibility should not belong to the highest bidder.</em>
            </p>

            <p style={bodyStyle}>There is no pay-to-play on the local map.</p>

            <p style={bodyStyle}>
              A place belongs in the Commons because of what it
              contributes — not because it purchased attention. Local
              businesses, organizations, farms, artists, educators,
              community projects, and other lights are listed freely, and
              Canary remains free for people to explore and use.
            </p>

            <p style={bodyStyle}>That&apos;s intentional.</p>

            <p style={bodyStyle}>
              The people and places helping life flourish deserve to
              become visible because of the good they bring into the world
              — not because they won a bidding war for attention.
            </p>

            <p style={bodyStyle}>Canary is supported differently.</p>

            <p style={bodyStyle}>
              During this founding season,{" "}
              <Link
                href="/founders/join"
                style={{
                  color: GOLD,
                  fontWeight: 700,
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                }}
              >
                Stewards of the Commons
              </Link>{" "}
              help carry the work of finding the lights, tending the
              infrastructure, gathering stories, and growing the map.
            </p>

            <p style={bodyStyle}>
              Over the long term,{" "}
              <strong style={{ color: GOLD }}>
                Online Resource partnerships
              </strong>{" "}
              are designed to become Canary&apos;s economic backbone:
              creating reciprocal relationships in which aligned businesses
              receive discovery and support, while their participation
              helps keep the local Commons open and accessible.
            </p>

            <p style={bodyStyle}>
              The map does not need to become an advertising marketplace
              in order to survive.
            </p>

            <p
              style={{
                ...bodyStyle,
                marginBottom: 0,
                color: GOLD,
                fontWeight: 600,
                fontStyle: "italic",
              }}
            >
              The Commons can belong to the Commons.
            </p>
          </section>

          {/* ═══ FOLLOW THE CANARY — open invitation, echoes the homepage.
              Not a card: this is deliberately open against the dawn
              atmosphere. Clicking the bird sends visitors into the
              actual campaign experience on /map — no animation or
              overlay is recreated here. ═══ */}
          <div
            style={{
              textAlign: "center",
              padding: "clamp(40px, 6vh, 64px) 0 clamp(36px, 5vh, 56px)",
            }}
          >
            <p style={{ ...bodyStyle, maxWidth: 560, margin: "0 auto 16px" }}>
              They put the canary in the coal mine because she was
              sensitive enough to know something was wrong.
            </p>

            <p
              style={{
                fontSize: "clamp(1.3rem, 2.2vw, 1.6rem)",
                lineHeight: 1.5,
                fontWeight: 600,
                fontStyle: "italic",
                color: GOLD,
                margin: "0 auto 44px",
                maxWidth: 560,
                textShadow:
                  "0 0 16px rgba(255,216,107,0.25), 0 0 36px rgba(255,216,107,0.1)",
              }}
            >
              What happens if we follow her out?
            </p>

            <Link
              href="/map?follow=1"
              aria-label="Follow the Canary — enter the map"
              onMouseEnter={() => setBirdHover(true)}
              onMouseLeave={() => setBirdHover(false)}
              onFocus={() => setBirdHover(true)}
              onBlur={() => setBirdHover(false)}
              style={{
                display: "inline-block",
                transition: "transform 0.3s ease",
                transform: birdHover ? "scale(1.07)" : "scale(1)",
              }}
            >
              <img
                src="/canary-cta-bird.png"
                alt=""
                style={{
                  width: "clamp(110px, 16vw, 170px)",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                  transition: "filter 0.3s ease",
                  filter: birdHover
                    ? "drop-shadow(0 0 28px rgba(255,216,107,0.55)) drop-shadow(0 8px 20px rgba(0,0,0,0.3))"
                    : "drop-shadow(0 0 14px rgba(255,216,107,0.28)) drop-shadow(0 6px 16px rgba(0,0,0,0.28))",
                }}
              />
              <div
                style={{
                  marginTop: 10,
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  color: GOLD,
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  opacity: birdHover ? 1 : 0.85,
                }}
              >
                Follow the Canary →
              </div>
            </Link>
          </div>

          {/* ═══ CONNECTED, WE DAWN BRIGHTER — final line, open against
              the dawn, outside any card ═══ */}
          <div
            style={{
              textAlign: "center",
              padding: "clamp(16px, 2.5vh, 28px) 0 clamp(70px, 10vh, 110px)",
            }}
          >
            <p
              style={{
                fontSize: "clamp(1.9rem, 3.8vw, 2.7rem)",
                fontWeight: 650,
                color: GOLD,
                margin: 0,
                lineHeight: 1.25,
                textShadow:
                  "0 0 22px rgba(255,216,107,0.32), 0 0 48px rgba(255,216,107,0.15)",
              }}
            >
              Connected, we dawn brighter.
            </p>
          </div>

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
