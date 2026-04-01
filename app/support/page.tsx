import { supportResources } from "@/data/supportResources";
import Link from "next/link";

export default function SupportPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#d3e4f7",
        color: "#1f2a3a",
      }}
    >
      <section
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "64px 24px",
        }}
      >
        <div style={{ maxWidth: "760px" }}>
          <p
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#6b7c94",
              margin: 0,
            }}
          >
            Support Life Anywhere
          </p>

          <h1
            style={{
              marginTop: "12px",
              fontSize: "2.5rem",
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#1f2a3a",
            }}
          >
            When you can’t find it nearby, here are aligned options.
          </h1>

          <p
            style={{
              marginTop: "20px",
              fontSize: "1.125rem",
              lineHeight: 1.8,
              color: "#4a5a70",
            }}
          >
            Sometimes the local light is not visible yet. This page exists to
            help you find more harmonious, life-supporting options online while
            the wider constellation continues to grow.
          </p>
        </div>

        <div
          style={{
            marginTop: "48px",
            display: "grid",
            gap: "24px",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {supportResources.map((item) => {
            const href = item.affiliateUrl || item.websiteUrl;

            return (
              <article
                key={item.id}
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: "rgba(255,255,255,0.78)",
                  padding: "24px",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "#6b7c94",
                    margin: 0,
                  }}
                >
                  {item.category}
                </p>

                <h2
                  style={{
                    marginTop: "8px",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#1f2a3a",
                  }}
                >
                  {item.title}
                </h2>

                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "14px",
                    lineHeight: 1.8,
                    color: "#4a5a70",
                  }}
                >
                  {item.description}
                </p>

                {item.whyItMatters && (
                  <p
                    style={{
                      marginTop: "16px",
                      fontSize: "14px",
                      lineHeight: 1.8,
                      color: "#5b6b82",
                    }}
                  >
                    <span style={{ color: "#1f2a3a", fontWeight: 600 }}>
                      Why this is here:
                    </span>{" "}
                    {item.whyItMatters}
                  </p>
                )}

                {item.tags?.length ? (
                  <div
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                  {item.tags.map((tag: string) => (
                      <span
                        key={tag}
                        style={{
                          borderRadius: "999px",
                          border: "1px solid rgba(0,0,0,0.10)",
                          padding: "4px 12px",
                          fontSize: "12px",
                          color: "#5b6b82",
                          background: "rgba(255,255,255,0.55)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    marginTop: "24px",
                    display: "inline-flex",
                    borderRadius: "999px",
                    border: "1px solid rgba(0,0,0,0.18)",
                    padding: "10px 16px",
                    fontSize: "14px",
                    color: "#0e3a66",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    fontWeight: 600,
                    background: "rgba(255,255,255,0.85)",
                  }}
                >
                  Visit resource
                </a>
              </article>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "50px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              marginBottom: "10px",
              color: "#4a5a70",
            }}
          >
            Know an aligned business or resource others should be able to find?
          </p>

          <Link href="/affiliates/submit">
            <span
              style={{
                display: "inline-block",
                padding: "10px 18px",
                borderRadius: "999px",
                border: "1px solid rgba(0,0,0,0.18)",
                background: "rgba(255,255,255,0.85)",
                color: "#0e3a66",
                cursor: "pointer",
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Submit your aligned affiliate business
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}