"use client";

type Props = {
  url: string;
  title: string;
  summary: string;
  favicon_url: string | null;
};

export default function LinkCard({ url, title, summary, favicon_url }: Props) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
          padding: "20px 24px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.09)",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(20,55,120,0.18) 0%, rgba(5,14,26,0.55) 100%)",
          backdropFilter: "blur(6px)",
          cursor: "pointer",
          transition: "border-color 0.18s ease, box-shadow 0.18s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,216,107,0.3)";
          e.currentTarget.style.boxShadow = "0 0 24px rgba(255,216,107,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Favicon */}
        <div
          style={{
            width: 20,
            height: 20,
            flexShrink: 0,
            marginTop: 3,
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {favicon_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon_url}
              alt=""
              width={20}
              height={20}
              style={{ display: "block" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span style={{ fontSize: 11, color: "rgba(211,227,247,0.35)" }}>◎</span>
          )}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "rgba(255,248,220,0.92)",
              marginBottom: 6,
              lineHeight: 1.35,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "0.88rem",
              lineHeight: 1.6,
              color: "rgba(211,227,247,0.82)",
            }}
          >
            {summary}
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            flexShrink: 0,
            fontSize: "0.85rem",
            color: "rgba(255,216,107,0.65)",
            marginTop: 3,
          }}
        >
          ↗
        </div>
      </div>
    </a>
  );
}
