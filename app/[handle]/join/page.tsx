import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export default async function SeederJoinRedirect({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  // Look up seeder by handle
  const { data: seeder } = await supabaseAdmin
    .from("seeders")
    .select("referral_code")
    .ilike("url_handle", handle)
    .single();

  if (seeder?.referral_code) {
    redirect(`/founders?ref=${encodeURIComponent(seeder.referral_code)}`);
  }

  // Graceful fallback: unknown handle or no referral code
  redirect("/founders");
}
