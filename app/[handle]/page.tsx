import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { createHmac } from "crypto";

/**
 * Seeder dashboard at /[handle].
 * Auth required — redirects to /[handle]/login if no valid session.
 * Phase 1 stub — Phase 2 will replace with the full dashboard.
 */

const SESSION_SECRET = process.env.SEEDER_SESSION_SECRET!;

type SeederSession = {
  seeder_id: string;
  handle: string;
};

function verifyPayload(signed: string): SeederSession | null {
  const parts = signed.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, sig] = parts;
  const json = Buffer.from(payloadB64, "base64url").toString();
  const expectedSig = createHmac("sha256", SESSION_SECRET)
    .update(json)
    .digest("base64url");

  if (sig !== expectedSig) return null;

  try {
    const payload = JSON.parse(json);
    if (typeof payload.exp === "number" && payload.exp < Date.now() / 1000) {
      return null;
    }
    return { seeder_id: payload.seeder_id, handle: payload.handle };
  } catch {
    return null;
  }
}

export default async function SeederDashboardPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  // Read session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cc_seeder_session")?.value;

  if (!sessionCookie) {
    redirect(`/${handle}/login`);
  }

  const session = verifyPayload(sessionCookie);

  if (!session) {
    redirect(`/${handle}/login`);
  }

  // If logged in as a different seeder, redirect to their dashboard
  if (session.handle !== handle) {
    redirect(`/${session.handle}`);
  }

  // Look up seeder name for the greeting
  const { data: seeder } = await supabaseAdmin
    .from("seeders")
    .select("name")
    .eq("id", session.seeder_id)
    .single();

  const name = seeder?.name || "Seeder";

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
      </div>
    </main>
  );
}
