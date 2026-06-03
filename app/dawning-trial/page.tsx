// ────────────────────────────────────────────────────
// THROWAWAY TRIAL — delete before launch. Not linked anywhere.
// Compare DawningBrighter at different dial settings.
// Reachable only by typing /dawning-trial in the browser.
// ────────────────────────────────────────────────────

import DawningBrighter from "@/app/components/DawningBrighter";

const labelStyle: React.CSSProperties = {
  position: "absolute",
  top: 16,
  left: 20,
  zIndex: 10,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#0d2a4a",
  background: "rgba(255,255,255,0.75)",
  padding: "5px 12px",
  borderRadius: 999,
};

const headingStyle: React.CSSProperties = {
  fontSize: "clamp(1.5rem, 2.5vw, 1.75rem)",
  fontWeight: 650,
  color: "#0d2a4a",
  margin: "0 0 16px",
};

const bodyStyle: React.CSSProperties = {
  fontSize: "clamp(1.05rem, 1.2vw, 1.15rem)",
  lineHeight: 1.68,
  color: "#0d2a4a",
  margin: "0 0 14px",
};

const mutedStyle: React.CSSProperties = {
  fontSize: "0.82rem",
  color: "#6b7c94",
  margin: "0 0 14px",
};

function SampleContent() {
  return (
    <>
      <h2 style={headingStyle}>A heading on the dawn field</h2>
      <p style={bodyStyle}>
        This is representative body text sitting on the Dawning Brighter
        register. It should be comfortably readable — dark navy on the light
        dawn gradient, with gold light points visible behind the text. The
        line height is generous, the measure is narrow, the reading pace is
        slow.
      </p>
      <p style={bodyStyle}>
        Scroll within this section to feel how the text moves over the still
        sky. The field should stay anchored while the words drift upward.
        This is the reading experience we are tuning for.
      </p>
      <p style={mutedStyle}>
        Small muted label text — category, date, metadata. Should be legible
        but quiet.
      </p>
      <p style={bodyStyle}>
        A second body paragraph to give the section enough content to scroll
        over the sky. Notice the gold light points — are they present but
        quiet, or are they distracting? Is the gradient warm enough to feel
        like morning, or still too deep?
      </p>
      <p style={bodyStyle}>
        One more paragraph. The field behind this text should feel like a
        place you want to be — not too dark, not too bright, not too busy.
        A dawn you would read by.
      </p>
      <p style={mutedStyle}>
        Final muted line. The contrast here matters — it needs to be readable
        without straining, but recede behind the primary body text.
      </p>
    </>
  );
}

type SectionProps = {
  label: string;
  lift: "calm" | "balanced" | "bright";
  density: "sparse" | "moderate" | "full";
  glow: "dim" | "soft" | "bright";
};

function TrialSection({ label, lift, density, glow }: SectionProps) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/*
        Wrapper overrides DawningBrighter's position:fixed to position:absolute
        so the field is contained within this section, not pinned to viewport.
      */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            /* Override any position:fixed children to act as absolute within this container */
          }}
        >
          <style>{`
            .trial-section-${lift}-${density}-${glow} [style*="position: fixed"],
            .trial-section-${lift}-${density}-${glow} [style*="position:fixed"] {
              position: absolute !important;
            }
          `}</style>
          <div className={`trial-section-${lift}-${density}-${glow}`}>
            <DawningBrighter lift={lift} density={density} glow={glow} />
          </div>
        </div>
      </div>

      {/* Label */}
      <div style={labelStyle}>{label}</div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 600,
          margin: "0 auto",
          padding: "80px 24px 60px",
        }}
      >
        <SampleContent />
      </div>

      {/* Section divider */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "rgba(0,0,0,0.08)",
          zIndex: 5,
        }}
      />
    </section>
  );
}

export default function DawningTrialPage() {
  return (
    <main>
      <TrialSection
        label="bright + sparse + dim"
        lift="bright"
        density="sparse"
        glow="dim"
      />
      <TrialSection
        label="bright + sparse + soft"
        lift="bright"
        density="sparse"
        glow="soft"
      />
      <TrialSection
        label="bright + moderate + dim"
        lift="bright"
        density="moderate"
        glow="dim"
      />
      <TrialSection
        label="balanced + sparse + dim"
        lift="balanced"
        density="sparse"
        glow="dim"
      />
      <TrialSection
        label="balanced + moderate + soft (current Morning Sky default)"
        lift="balanced"
        density="moderate"
        glow="soft"
      />
      <TrialSection
        label="calm + sparse + dim"
        lift="calm"
        density="sparse"
        glow="dim"
      />
    </main>
  );
}
