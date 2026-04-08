import Link from "next/link";

export default function FoundersPage() {
  return (
    <main className="min-h-screen bg-[#dbeafe] text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-sky-700">
            Canary Commons
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Become a Founder
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            Founders help turn on the first lights. They help seed visibility,
            participation, and early momentum so people can find what is already
            making life better where they live.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold">What this is</h2>
            <p className="mt-3 leading-7 text-slate-700">
              Founders are early supporters of Canary Commons who help strengthen
              the map, direct attention toward life-giving efforts, and support
              the emergence of a visible regenerative commons.
            </p>
          </section>

          <section className="rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold">What founders do</h2>
            <ul className="mt-3 space-y-2 leading-7 text-slate-700">
              <li>Seed businesses, projects, and places onto the map</li>
              <li>Redirect attention toward life-supporting options</li>
              <li>Help establish early momentum and trust</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold">What founders receive</h2>
            <ul className="mt-3 space-y-2 leading-7 text-slate-700">
              <li>Early participation in shaping the platform</li>
              <li>Direct connection to the emerging network</li>
              <li>Founding-role recognition as the commons takes root</li>
            </ul>
          </section>
<section className="rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
  <h2 className="text-xl font-semibold">Contribution</h2>
  <p className="mt-3 leading-7 text-slate-700">
    Founders make a small monthly contribution of $9/month for one year.
    This supports the early building phase and helps establish the
    foundation of a visible, life-supporting commons.
  </p>
</section>
          <section className="rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold">Seed referral pathway</h2>
            <p className="mt-3 leading-7 text-slate-700">
              If someone invited you into this, you can include their referral
              code or name when you join so their contribution is tracked.
            </p>
          </section>
        </div>

        <div className="mt-10 rounded-2xl bg-sky-900 px-6 py-8 text-white shadow-sm">
          <h2 className="text-2xl font-semibold">
            Help turn on the first lights
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-sky-100">
            Join as an early founder and help strengthen a public-facing map of
            regenerative, life-forward participation.
          </p>
<p className="mt-3 max-w-2xl leading-7 text-sky-200">
  This is a simple, meaningful commitment to help bring this into the world.
</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/founders/join"
              className="rounded-xl bg-amber-300 px-5 py-3 font-medium text-slate-900 transition hover:opacity-90"
            >
              Become a Founder
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-sky-300 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}