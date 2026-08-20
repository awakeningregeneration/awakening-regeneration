import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import ContributorDashboardClient from "./ContributorDashboardClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function ContributorSlugPage({ params }: Props) {
  const { slug } = await params;

  const { data: contributor } = await supabaseAdmin
    .from("contributors")
    .select("name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (!contributor) notFound();

  return <ContributorDashboardClient slug={contributor.slug} name={contributor.name} />;
}
