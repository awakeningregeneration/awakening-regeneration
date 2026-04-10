import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET() {
  const { data, error } = await supabase
    .from("affiliate_resources")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Affiliate fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate links." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name?.trim();
    const description = body.description?.trim();
    const url = body.url?.trim();
    const category = body.category?.trim();

    const practices = Array.isArray(body.practices)
      ? body.practices
          .map((item: unknown) =>
            typeof item === "string" ? item.trim() : ""
          )
          .filter(Boolean)
      : [];

    if (!name || !description || !url || !category) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("affiliate_resources")
      .insert([
        {
          name,
          description,
          url,
          category,
          practices,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Affiliate insert error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to add affiliate link." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Affiliate submitted for review.", resource: data },
      { status: 201 }
    );
  } catch (err) {
    console.error("Affiliate POST error:", err);
    return NextResponse.json(
      { error: "Failed to add affiliate link." },
      { status: 500 }
    );
  }
}