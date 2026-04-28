import { NextResponse } from "next/server";
import { getSynonyms } from "@/app/lib/searchSynonyms";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get("term") || "";

  if (!term.trim()) {
    return NextResponse.json([]);
  }

  const synonyms = await getSynonyms(term);
  return NextResponse.json(synonyms);
}
