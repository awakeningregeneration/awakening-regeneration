// app/stories/page.tsx
export default function StoriesPage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>
        Stories & Spotlights (MVP)
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#374151" }}>
        This space is for slow, human-scale stories of regeneration — told from more than one
        vantage point, so we remember that many truths can live side by side.
      </p>

      {/* Simple grounding / pause block */}
      <section
        style={{
          marginBottom: "1.5rem",
          padding: "0.9rem 1rem",
          borderRadius: "0.75rem",
          background: "rgba(219, 234, 254, 0.6)",
          border: "1px solid rgba(147, 197, 253, 0.9)",
        }}
      >
        <h2 style={{ fontSize: "1rem", margin: "0 0 0.4rem", color: "#1d4ed8" }}>
          A moment to land before you read
        </h2>
        <p style={{ fontSize: "0.92rem", margin: "0 0 0.25rem", color: "#1f2937" }}>
          Before taking in another story, let your body arrive:
        </p>
        <ul
          style={{
            margin: 0,
            paddingLeft: "1.1rem",
            fontSize: "0.9rem",
            color: "#111827",
          }}
        >
          <li>Notice one place in your body that feels a little more spacious than the rest.</li>
          <li>Let your breath soften there for three easy breaths.</li>
          <li>Remember: you don&apos;t have to hold the whole world to be in relationship with it.</li>
        </ul>
      </section>

      {/* Example multi-perspective story */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <article
          style={{
            padding: "0.9rem 1rem",
            borderRadius: "0.75rem",
            border: "1px solid rgba(156, 163, 175, 0.7)",
            background: "white",
          }}
        >
          <h2 style={{ fontSize: "1rem", margin: "0 0 0.4rem", color: "#064e3b" }}>
            From the land steward
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#374151", margin: 0 }}>
            &quot;When I first arrived here, the stream was choked with blackberry and trash. I didn&apos;t
            know where to begin, so I started with one small section. Each season we&apos;ve opened a
            little more light and a few more native plants have come back on their own.&quot;
          </p>
        </article>

        <article
          style={{
            padding: "0.9rem 1rem",
            borderRadius: "0.75rem",
            border: "1px solid rgba(156, 163, 175, 0.7)",
            background: "white",
          }}
        >
          <h2 style={{ fontSize: "1rem", margin: "0 0 0.4rem", color: "#6b21a8" }}>
            From a neighbor downstream
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#374151", margin: 0 }}>
            &quot;I didn&apos;t know what they were doing up there at first — I just noticed the water
            stopped smelling like algae in late summer. Later I found out there&apos;d been years of
            small, steady work upstream. It changed how I see this whole hillside.&quot;
          </p>
        </article>
      </section>

      <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
        In the full version of this app, each project will be able to hold more than one voice:
        steward, neighbor, visitor, and the place itself. This page is the gentle beginning of that
        pattern.
      </p>
    </main>
  );
}