import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readFileSync } from "fs";
import { join } from "path";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getSeederSessionFromCookieValue } from "@/app/lib/seederAuth";
import StartPageClient from "./StartPageClient";

export default async function StartPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  // Auth check
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cc_seeder_session")?.value;
  const session = getSeederSessionFromCookieValue(sessionCookie);

  if (!session) {
    redirect(`/${handle}/login`);
  }

  if (session.handle !== handle) {
    redirect(`/${session.handle}/start`);
  }

  // Look up seeder
  const { data: seeder } = await supabaseAdmin
    .from("seeders")
    .select("name, orientation_completed_at, referral_code")
    .eq("id", session.seeder_id)
    .single();

  if (!seeder) {
    redirect(`/${handle}/login`);
  }

  // Read orientation markdown
  const mdPath = join(process.cwd(), "SEEDER_ORIENTATION_DRAFT.md");
  let markdown = readFileSync(mdPath, "utf-8");

  // Substitute [your-handle] with actual handle
  markdown = markdown.replace(/\[your-handle\]/g, handle);

  return (
    <StartPageClient
      markdown={markdown}
      handle={handle}
      seederName={seeder.name || "Seeder"}
      orientationCompletedAt={seeder.orientation_completed_at || null}
      referralCode={seeder.referral_code || null}
    />
  );
}
