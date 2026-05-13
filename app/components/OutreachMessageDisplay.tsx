"use client";

import { useState } from "react";
import { OUTREACH_TEMPLATE } from "@/app/lib/outreachTemplate";

/**
 * Shared component for displaying the composite outreach message
 * with a "Copy to clipboard" button. Used on both the seeder
 * dashboard modal and the placement form inline section.
 */

export default function OutreachMessageDisplay() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(OUTREACH_TEMPLATE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <textarea
        readOnly
        value={OUTREACH_TEMPLATE}
        style={{
          width: "100%",
          minHeight: 280,
          padding: "14px 16px",
          borderRadius: 12,
          border: "1px solid rgba(100,150,220,0.2)",
          background: "rgba(255,255,255,0.6)",
          color: "#0d2a4a",
          fontSize: "0.88rem",
          lineHeight: 1.6,
          resize: "vertical",
          outline: "none",
          fontFamily: "inherit",
        }}
      />
      <div style={{ marginTop: 12, textAlign: "center" }}>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            padding: "10px 20px",
            borderRadius: 999,
            border: "none",
            background: "#FFD86B",
            color: "#1a2a0e",
            fontWeight: 700,
            fontSize: "0.88rem",
            cursor: "pointer",
            boxShadow:
              "0 0 20px rgba(255,216,107,0.25), 0 4px 14px rgba(255,200,80,0.18)",
          }}
        >
          {copied ? "Copied!" : "Copy to clipboard"}
        </button>
      </div>
    </div>
  );
}
