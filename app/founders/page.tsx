import { redirect } from "next/navigation";

export default async function FoundersRedirect({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const queryString = new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((v) => [key, v])
        : value
          ? [[key, value]]
          : []
    )
  ).toString();

  const destination = queryString
    ? `/founders/join?${queryString}`
    : "/founders/join";
  redirect(destination);
}
