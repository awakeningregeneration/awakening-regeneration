import { supportResources } from "@/data/supportResources";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#04142b] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.18em] text-white/60">
            Support Life Anywhere
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            When you can’t find it nearby, here are aligned options.
          </h1>

          <p className="mt-5 text-lg leading-8 text-white/75">
            Sometimes the local light is not visible yet. This page exists to
            help you find more harmonious, life-supporting options online while
            the wider constellation continues to grow.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {supportResources.map((item) => {
            const href = item.affiliateUrl || item.websiteUrl;

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-white/50">
                  {item.category}
                </p>

                <h2 className="mt-2 text-xl font-medium">{item.title}</h2>

                <p className="mt-3 text-sm leading-7 text-white/75">
                  {item.description}
                </p>

                {item.whyItMatters && (
                  <p className="mt-4 text-sm leading-7 text-white/60">
                    <span className="text-white/80">Why this is here:</span>{" "}
                    {item.whyItMatters}
                  </p>
                )}

                {item.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65"
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
                  className="mt-6 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  Visit resource
                </a>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}