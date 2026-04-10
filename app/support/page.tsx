import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type SupportResource = {
  id: string | number;
  name: string;
  description: string | null;
  url: string | null;
  category: string | null;
  practices: string[] | null;
  status?: string | null;
  created_at?: string | null;
};

const PRIMARY_CATEGORY_OPTIONS = [
  "Food & Nourishment",
  "Home & Shelter",
  "Health & Wellbeing",
  "Energy & Infrastructure",
  "Land & Ecology",
  "Materials & Goods",
  "Learning & Education",
  "Travel & Movement",
  "Community & Culture",
  "Communication & Conflict Transformation",
  "Finance & Systems",
] as const;

export default async function SupportPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; q?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedCategory = resolvedSearchParams.category ?? "All";
  const searchQuery = (resolvedSearchParams.q ?? "").trim().toLowerCase();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("affiliate_resources")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load support resources:", error.message);
  }

  const resources: SupportResource[] = (data ?? []) as SupportResource[];

  const categories = ["All", ...PRIMARY_CATEGORY_OPTIONS];

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      selectedCategory === "All" || resource.category === selectedCategory;

    const haystack = [
      resource.name,
      resource.description ?? "",
      resource.category ?? "",
      ...(resource.practices ?? []),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !searchQuery || haystack.includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

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
          <h1
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              lineHeight: 1.05,
              margin: 0,
              marginBottom: "18px",
              fontWeight: 700,
            }}
          >
            Support what is already life-giving
          </h1>

          <p
            style={{
              fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
              lineHeight: 1.7,
              color: "#506178",
              margin: 0,
              marginBottom: "36px",
            }}
          >
            Sometimes the local light is not visible yet. This space helps you
            find aligned options you can support from anywhere — while the
            constellation continues to grow.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "14px",
            gridTemplateColumns: "1fr",
            maxWidth: "760px",
            marginBottom: "36px",
            padding: "18px",
            border: "1px solid rgba(31,42,58,0.10)",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(6px)",
          }}
        >
          <form method="GET" style={{ display: "grid", gap: "14px" }}>
            <input
              type="text"
              name="q"
              placeholder="Search by name, description, or practices"
              defaultValue={resolvedSearchParams.q ?? ""}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(31,42,58,0.14)",
                fontSize: "0.98rem",
                background: "white",
                color: "#1f2a3a",
              }}
            />

            <select
              name="category"
              defaultValue={selectedCategory}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(31,42,58,0.14)",
                fontSize: "0.98rem",
                background: "white",
                color: "#1f2a3a",
              }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All categories" : category}
                </option>
              ))}
            </select>

            <button
              type="submit"
              style={{
                width: "fit-content",
                padding: "12px 18px",
                borderRadius: "999px",
                border: "1px solid rgba(31,42,58,0.14)",
                background: "rgba(255,255,255,0.9)",
                color: "#1c4a7d",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Apply filters
            </button>
          </form>

          <div
            style={{
              fontSize: "0.95rem",
              color: "#5f6f84",
            }}
          >
            {filteredResources.length} result
            {filteredResources.length === 1 ? "" : "s"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {filteredResources.length === 0 ? (
            <div
              style={{
                padding: "20px",
                borderRadius: "18px",
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(31,42,58,0.10)",
                color: "#506178",
              }}
            >
              No aligned options match this search yet.
            </div>
          ) : (
            filteredResources.map((resource) => (
              <article
                key={String(resource.id)}
                style={{
                  background: "rgba(255,255,255,0.72)",
                  borderRadius: "18px",
                  border: "1px solid rgba(31,42,58,0.10)",
                  padding: "24px 26px",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.28) inset",
                }}
              >
                <div
                  style={{
                    fontSize: "0.85rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#70839a",
                    marginBottom: "12px",
                  }}
                >
                  {resource.category || "Uncategorized"}
                </div>

                <h2
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.35,
                    margin: 0,
                    marginBottom: "14px",
                    fontWeight: 700,
                  }}
                >
                  {resource.name}
                </h2>

                {resource.description ? (
                  <p
                    style={{
                      fontSize: "1rem",
                      lineHeight: 1.6,
                      color: "#556679",
                      margin: 0,
                      marginBottom: "16px",
                    }}
                  >
                    {resource.description}
                  </p>
                ) : null}

                {resource.practices?.length ? (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    {resource.practices.map((practice) => (
                      <span
                        key={practice}
                        style={{
                          fontSize: "0.85rem",
                          color: "#70839a",
                          border: "1px solid rgba(31,42,58,0.12)",
                          borderRadius: "999px",
                          padding: "6px 12px",
                          background: "rgba(255,255,255,0.55)",
                        }}
                      >
                        {practice}
                      </span>
                    ))}
                  </div>
                ) : null}

                <a
                  href={resource.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "12px 18px",
                    borderRadius: "999px",
                    border: "1px solid rgba(31,42,58,0.16)",
                    color: "#1c4a7d",
                    fontWeight: 700,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    background: "rgba(255,255,255,0.6)",
                    pointerEvents: resource.url ? "auto" : "none",
                    opacity: resource.url ? 1 : 0.6,
                  }}
                >
                  Visit resource
                </a>
              </article>
            ))
          )}
        </div>

        <div
          style={{
            marginTop: "52px",
            textAlign: "center",
            color: "#5c6d82",
            fontSize: "1.05rem",
            lineHeight: 1.7,
          }}
        >
          <p style={{ marginBottom: "18px" }}>
            Know something that helps life move forward that others should be
            able to find?
          </p>

          <Link
            href="/support/submit"
            style={{
              display: "inline-block",
              padding: "14px 22px",
              borderRadius: "999px",
              border: "1px solid rgba(31,42,58,0.14)",
              background: "rgba(255,255,255,0.68)",
              color: "#1c4a7d",
              fontWeight: 700,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Add a resource
          </Link>
        </div>
      </section>
    </main>
  );
}