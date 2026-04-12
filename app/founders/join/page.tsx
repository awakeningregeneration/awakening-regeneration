"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function JoinContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "";
  const [selectedTier, setSelectedTier] = useState("$9");
  const [oneTime, setOneTime] = useState("");

  useEffect(() => {
    if (ref) {
      localStorage.setItem("referral_code", ref);
    }
  }, [ref]);

  const tiers = [
    { value: "$9", label: "$9/month", title: "Foundation Builder" },
    { value: "$18", label: "$18/month", title: "Supporting Foundation Builder" },
    { value: "$27", label: "$27/month", title: "Sustaining Foundation Builder" },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#d3e4f7",
        color: "#1f2a3a",
        padding: "48px 20px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <p
          style={{
            fontSize: "0.88rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#506178",
            marginBottom: 12,
          }}
        >
          Canary Commons
        </p>

        <h1
          style={{
            fontSize: "clamp(2rem, 4.5vw, 2.8rem)",
            lineHeight: 1.1,
            margin: 0,
            marginBottom: 24,
            fontWeight: 700,
          }}
        >
          You&apos;re stepping into something that is already alive.
        </h1>

        <div style={{ maxWidth: 600, marginBottom: 44 }}>
          <p
            style={{
              fontSize: "1.06rem",
              lineHeight: 1.78,
              color: "#506178",
              margin: 0,
              marginBottom: 18,
            }}
          >
            Canary Commons exists to make what is life-giving visible — without
            hierarchy, without tolls, without anyone paying for placement. Every
            listing on this map is equal. That is not an accident. It is the
            design.
          </p>

          <p
            style={{
              fontSize: "1.06rem",
              lineHeight: 1.78,
              color: "#506178",
              margin: 0,
              marginBottom: 18,
            }}
          >
            Right now, the map is being populated organically — by the people of
            place, adding what they know and love where they live. That process
            takes time. It takes trust. It takes roots.
          </p>

          <p
            style={{
              fontSize: "1.06rem",
              lineHeight: 1.78,
              color: "#1f2a3a",
              margin: 0,
              marginBottom: 18,
              fontWeight: 600,
            }}
          >
            Foundation Builders are the bridge while that happens.
          </p>

          <p
            style={{
              fontSize: "1.06rem",
              lineHeight: 1.78,
              color: "#506178",
              margin: 0,
              marginBottom: 18,
            }}
          >
            Your contribution supports the infrastructure that holds this — the
            technology, the people tending it, and the debt carried to bring it
            into being. It sustains the platform while the grassroots field fills
            in.
          </p>

          <p
            style={{
              fontSize: "1.06rem",
              lineHeight: 1.78,
              color: "#506178",
              margin: 0,
              marginBottom: 18,
            }}
          >
            What you are helping build will never charge for visibility. No
            business will pay more to appear first. No community will be priced
            out of the map. That is the promise this platform is built on.
          </p>

          <p
            style={{
              fontSize: "1.06rem",
              lineHeight: 1.78,
              color: "#1f2a3a",
              margin: 0,
              fontWeight: 600,
            }}
          >
            You are helping make sure it keeps its word.
          </p>
        </div>

        {/* What this looks like */}
        <div
          style={{
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(31,42,58,0.10)",
            borderRadius: 20,
            padding: "28px 28px 24px",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              margin: 0,
              marginBottom: 20,
            }}
          >
            What this looks like
          </h2>

          <p
            style={{
              fontSize: "1.06rem",
              lineHeight: 1.78,
              color: "#506178",
              margin: 0,
              marginBottom: 18,
            }}
          >
            Once you join, you&apos;ll receive a short email twice a month — not
            a newsletter, more like a letter from the field. It carries a few
            signals: something rising in the constellation, something worth
            supporting, something to notice where you live.
          </p>

          <p
            style={{
              fontSize: "1.06rem",
              lineHeight: 1.78,
              color: "#506178",
              margin: 0,
              marginBottom: 18,
            }}
          >
            Your one ongoing invitation: add three lights. Place three meaningful
            things on the map that you know — or invite the people tending those
            places to add themselves.
          </p>

          <p
            style={{
              fontSize: "1.06rem",
              lineHeight: 1.78,
              color: "#506178",
              margin: 0,
            }}
          >
            That&apos;s it. No meetings. No obligations beyond that. Just
            participation at the pace of your life.
          </p>
        </div>

        {/* Contribution tiers */}
        <div
          style={{
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(31,42,58,0.10)",
            borderRadius: 20,
            padding: "28px 28px 24px",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              margin: 0,
              marginBottom: 20,
            }}
          >
            Monthly contribution
          </h2>

          <div style={{ display: "grid", gap: 12 }}>
            {tiers.map((tier) => {
              const isSelected = selectedTier === tier.value;
              return (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => setSelectedTier(tier.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "18px 20px",
                    borderRadius: 14,
                    border: isSelected
                      ? "2px solid #0e3a66"
                      : "1px solid rgba(31,42,58,0.12)",
                    background: isSelected
                      ? "rgba(14,58,102,0.06)"
                      : "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: isSelected
                        ? "6px solid #0e3a66"
                        : "2px solid rgba(31,42,58,0.25)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "1.02rem",
                        color: "#1f2a3a",
                      }}
                    >
                      {tier.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#506178",
                        marginTop: 2,
                      }}
                    >
                      {tier.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* One-time contribution */}
        <div
          style={{
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(31,42,58,0.10)",
            borderRadius: 20,
            padding: "24px 28px",
            marginBottom: 32,
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#1f2a3a",
              marginBottom: 10,
            }}
          >
            Additional one-time contribution to the foundation
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="$ (optional)"
            value={oneTime}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9.]/g, "");
              setOneTime(v);
            }}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid rgba(31,42,58,0.14)",
              fontSize: "0.98rem",
              background: "white",
              color: "#1f2a3a",
            }}
          />
        </div>

        {/* CTA */}
        <Link
          href="/founders/confirmation"
          style={{
            display: "block",
            textAlign: "center",
            padding: "16px 24px",
            borderRadius: 999,
            background: "#0e3a66",
            color: "white",
            fontWeight: 700,
            fontSize: "1.05rem",
            textDecoration: "none",
            transition: "opacity 0.15s ease",
          }}
        >
          Join the Foundation
        </Link>

        {/* Footer note */}
        <p
          style={{
            marginTop: 36,
            fontSize: "0.82rem",
            lineHeight: 1.65,
            color: "#7a8a9e",
            textAlign: "center",
            maxWidth: 540,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          This is not a nonprofit. Resources flow through this system to support
          the people tending it, the technology that holds it, and life-forward
          initiatives as it grows.
        </p>
      </div>
    </main>
  );
}

export default function FounderJoinPage() {
  return (
    <Suspense>
      <JoinContent />
    </Suspense>
  );
}
