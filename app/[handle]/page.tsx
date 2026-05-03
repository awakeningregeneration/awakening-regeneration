import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSessionFromCookieValue } from "@/app/lib/seederAuth";
import Link from "next/link";

/**
 * Seeder dashboard at /[handle].
 * Auth required — redirects to /[handle]/login if no valid session.
 * Orientation required — redirects to /[handle]/start if not completed.
 * Phase 1 stub — Phase 2 will replace with the full dashboard.
 */

export default async function SeederDashboardPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  // Read session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cc_seeder_session")?.value;
  const session = getSeederSessionFromCookieValue(sessionCookie);

  if (!session) {
    redirect(`/${handle}/login`);
  }

  if (session.handle !== handle) {
    redirect(`/${session.handle}`);
  }

  // Look up seeder
  const { data: seeder } = await supabaseAdmin
    .from("seeders")
    .select("name, orientation_completed_at")
    .eq("id", session.seeder_id)
    .single();

  if (!seeder) {
    redirect(`/${handle}/login`);
  }

  // Orientation gate
  if (!seeder.orientation_completed_at) {
    redirect(`/${handle}/start`);
  }

  const name = seeder.name || "Seeder";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#08192d",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <img
          src="/canary-commons-logo.png"
          alt="Canary Commons"
          style={{
            width: "clamp(180px, 30vw, 260px)",
            height: "auto",
            display: "block",
            margin: "0 auto 32px",
            filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.3))",
          }}
        />
        <h1
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
            fontWeight: 650,
            margin: "0 0 16px",
            color: "rgba(255,255,255,0.95)",
          }}
        >
          Welcome, {name}.
        </h1>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: "rgba(211,227,247,0.7)",
          }}
        >
          Dashboard coming in Phase 2.
        </p>

        {/* Revisit orientation link */}
        <Link
          href={`/${handle}/start`}
          style={{
            display: "inline-block",
            marginTop: 32,
            fontSize: 13,
            color: "rgba(148,196,236,0.5)",
            textDecoration: "none",
            transition: "color 0.15s",
          }}
        >
          Revisit orientation
        </Link>
      </div>
    </main>
  );
}
