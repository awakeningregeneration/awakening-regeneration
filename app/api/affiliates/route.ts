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

    const contributor_id = body.contributor_id?.trim() || null;
    const contributor_name = body.contributor_name?.trim() || null;
    const affiliate_url = body.affiliate_url?.trim() || null;
    const why_it_matters = body.why_it_matters?.trim() || null;
    const image_url = body.image_url?.trim() || null;

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
          status: contributor_id ? (body.status?.trim() || "approved") : "pending",
          ...(contributor_id && { contributor_id }),
          ...(contributor_name && { contributor_name }),
          ...(affiliate_url && { affiliate_url }),
          ...(why_it_matters && { why_it_matters }),
          ...(image_url && { image_url }),
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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }

    const update: Record<string, unknown> = {};
    const fields = [
      "name",
      "description",
      "url",
      "category",
      "affiliate_url",
      "why_it_matters",
      "image_url",
    ] as const;

    for (const f of fields) {
      if (body[f] !== undefined) {
        update[f] = typeof body[f] === "string" ? body[f].trim() || null : body[f];
      }
    }

    if (body.practices !== undefined) {
      update.practices = Array.isArray(body.practices)
        ? body.practices.filter((p: unknown) => typeof p === "string" && (p as string).trim()).map((p: unknown) => (p as string).trim())
        : [];
    }

    // name, description, url, category must not be emptied
    if (update.name === null || update.description === null || update.url === null || update.category === null) {
      return NextResponse.json(
        { error: "Name, description, URL, and category are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("affiliate_resources")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Affiliate PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update resource." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }

    const { error } = await supabase
      .from("affiliate_resources")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Affiliate DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete resource." },
      { status: 500 }
    );
  }
}