import { risingConstellation } from "@/data/risingConstellation"

export default function ConstellationPage() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "60px 20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>
        The Rising Constellation
      </h1>

      <p style={{ marginBottom: 30, lineHeight: 1.6 }}>
        A world constellation of people, places, and efforts already rising
        toward more life-affirming ways of being.
        <br />
        <strong>Look outward and remember: this is rising everywhere.</strong>
      </p>

      <div style={{ display: "grid", gap: 20 }}>
        {risingConstellation.map((signal) => (
          <a
            key={signal.id}
            href={signal.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: 18,
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.1)",
              background: "white",
              textDecoration: "none",
              color: "black",
            }}
          >
            <h3 style={{ marginBottom: 6 }}>{signal.title}</h3>

            <div
              style={{
                fontSize: 13,
                opacity: 0.6,
                marginBottom: 8,
              }}
            >
              {signal.region}
            </div>

            <p style={{ margin: 0 }}>{signal.description}</p>
          </a>
        ))}
      </div>
    </main>
  )
}