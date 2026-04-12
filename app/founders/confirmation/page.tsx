"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function FounderConfirmationPage() {
  const referralCode = useRef<string | null>(null);

  useEffect(() => {
    referralCode.current = localStorage.getItem("referral_code");
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#d3e4f7",
        color: "#1f2a3a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: "100%",
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(31,42,58,0.10)",
          borderRadius: 20,
          padding: "44px 36px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
            lineHeight: 1.15,
            margin: 0,
            marginBottom: 18,
            fontWeight: 700,
          }}
        >
          You&apos;re in. This is already happening.
        </h1>

        <p
          style={{
            fontSize: "1.08rem",
            lineHeight: 1.72,
            color: "#506178",
            margin: 0,
            marginBottom: 36,
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Thank you for stepping in. Your first invitation is simple — add three
          lights. Place three meaningful things on the map that you know.
        </p>

        <Link
          href="/submit"
          style={{
            display: "inline-block",
            padding: "16px 28px",
            borderRadius: 999,
            background: "#0e3a66",
            color: "white",
            fontWeight: 700,
            fontSize: "1.05rem",
            textDecoration: "none",
            transition: "opacity 0.15s ease",
          }}
        >
          Add your first lights
        </Link>
      </div>
    </main>
  );
}
