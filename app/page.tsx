"use client";

import Link from "next/link";
import CanaryFormationHero from "@/app/components/CanaryFormationHero";

export default function HomePage() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        color: "white",
      }}
    >
      {/* Night sky + the Canary gathering from it — z0 */}
      <CanaryFormationHero />

      {/* Content — identity, question, CTA, thesis — z3 */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          padding: "clamp(400px, 54vh, 600px) 28px 32px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 760,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Supporting sentence — context before the question */}
          <p
            style={{
              maxWidth: 480,
              margin: "0 auto 22px",
              fontSize: "clamp(0.98rem, 1.25vw, 1.08rem)",
              fontWeight: 400,
              lineHeight: 1.65,
              color: "rgba(255,248,224,0.72)",
            }}
          >
            They put her in the coal mine because she was sensitive enough to
            know something was wrong.
          </p>

          {/* The question — strongest typographic emphasis */}
          <h1
            style={{
              maxWidth: 740,
              margin: "0 auto 44px",
              fontSize: "clamp(2rem, 4.6vw, 3.1rem)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              lineHeight: 1.22,
              color: "#fffdf6",
            }}
          >
            What happens if we follow her out?
          </h1>

          {/* CTA — quiet but the one clear action; the bird stands in for the word */}
          <div>
            <Link
              href="/map?follow=1"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#FFD86B",
                textDecoration: "none",
                borderBottom: "2px solid rgba(255,216,107,0.55)",
                paddingBottom: 6,
                transition: "border-color 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderBottomColor = "#FFD86B";
                e.currentTarget.style.color = "#ffe9ad";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderBottomColor =
                  "rgba(255,216,107,0.55)";
                e.currentTarget.style.color = "#FFD86B";
              }}
            >
              <span>Follow the</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/canary-cta-bird.png"
                alt="Canary"
                style={{
                  height: "1.5em",
                  width: "auto",
                  display: "inline-block",
                  transform: "translateY(1px)",
                }}
              />
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
