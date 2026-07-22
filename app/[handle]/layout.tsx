import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import SeederHeader from "./SeederHeader";

/**
 * Layout for /[handle]/ routes.
 * Validates the handle exists in the seeders table.
 * Returns 404 for unknown handles — prevents /random-string from rendering.
 */

export default async function SeederLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const { data } = await supabaseAdmin
    .from("seeders")
    .select("id")
    .eq("url_handle", handle)
    .limit(1);

  if (!data || data.length === 0) {
    notFound();
  }

  return (
    <>
      <SeederHeader handle={handle} />
      {children}
    </>
  );
}
