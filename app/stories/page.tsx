import { Suspense } from "react";
import StoriesPageClient from "./StoriesPageClient";

type StoriesPageProps = {
  searchParams?: Promise<{
    state?: string;
    county?: string;
  }>;
};

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const params = (await searchParams) ?? {};
  return (
    <Suspense>
      <StoriesPageClient
        initialState={params.state ?? ""}
        initialCounty={params.county ?? ""}
      />
    </Suspense>
  );
}
