import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const NAME_MAX = 150;
const DESCRIPTION_MAX = 1000;
const URL_MAX = 500;
const EMAIL_MAX = 200;
const ALIGNMENT_MAX = 600;
const PROGRAM_NAME_MAX = 150;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function hashIp(ip: string) {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

// Modest in-memory per-IP rate limit for the public application form.
// Resets on server restart/redeploy and is per-instance only — a
// best-effort deterrent, not a hard guarantee, which matches "modest"
// protection for a review-queue endpoint (a bot flooding this only
// clutters the pending queue, it never reaches the public site).
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const submissionLog = new Map<string, number[]>();

function isRateLimited(ipHash: string): boolean {
  const now = Date.now();
  const timestamps = (submissionLog.get(ipHash) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  submissionLog.set(ipHash, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

export async function GET() {
  // Explicit column list — affiliate_resources now also holds applicant
  // contact info (contact_email, alignment_note, partnership_path,
  // program_name, program_url) that must never reach the public API.
  const { data, error } = await supabase
    .from("affiliate_resources")
    .select(
      "id, name, description, url, category, practices, affiliate_url, why_it_matters, logo_url, image_url, slug, created_at"
    )
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

    // Honeypot — a real applicant never sees or fills this field (hidden
    // in the form). A bot that fills every input will fill it too. Quiet
    // success with no insert, so bots get no signal to adapt to.
    if (typeof body.company_fax === "string" && body.company_fax.trim() !== "") {
      return NextResponse.json(
        { message: "Affiliate submitted for review." },
        { status: 201 }
      );
    }

    const ipHash = hashIp(getClientIp(req));
    if (isRateLimited(ipHash)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const name = body.name?.trim();
    const description = body.description?.trim();
    const url = body.url?.trim();
    const category = Array.isArray(body.category)
      ? body.category.map((c: unknown) => typeof c === "string" ? c.trim() : "").filter(Boolean).slice(0, 5)
      : typeof body.category === "string" && body.category.trim()
        ? [body.category.trim()]
        : [];

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

    if (!name || !description || !url || category.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (name.length > NAME_MAX || description.length > DESCRIPTION_MAX || url.length > URL_MAX) {
      return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
    }

    if (!isValidUrl(url)) {
      return NextResponse.json({ error: "Please enter a valid website URL." }, { status: 400 });
    }

    if (affiliate_url && (!isValidUrl(affiliate_url) || affiliate_url.length > URL_MAX)) {
      return NextResponse.json({ error: "Please enter a valid affiliate link." }, { status: 400 });
    }

    // The partnership-application fields below are only required on the
    // public application path. The trusted-contributor path (identified
    // by contributor_id, same as the existing status default) skips them
    // entirely — contributors aren't applying, they're trusted insiders
    // adding resources directly, exactly as before this change.
    let contact_email: string | null = null;
    let alignment_note: string | null = null;
    let partnership_path: string | null = null;
    let program_name: string | null = null;
    let program_url: string | null = null;

    if (!contributor_id) {
      contact_email = body.contact_email?.trim() || "";
      alignment_note = body.alignment_note?.trim() || "";
      partnership_path = body.partnership_path?.trim() || "";
      program_name = body.program_name?.trim() || null;
      program_url = body.program_url?.trim() || null;

      if (!contact_email || !EMAIL_RE.test(contact_email) || contact_email.length > EMAIL_MAX) {
        return NextResponse.json({ error: "Please enter a valid contact email." }, { status: 400 });
      }

      if (!alignment_note || alignment_note.length > ALIGNMENT_MAX) {
        return NextResponse.json(
          { error: "Please answer how your work helps life move forward." },
          { status: 400 }
        );
      }

      if (partnership_path !== "has_program" && partnership_path !== "wants_direct") {
        return NextResponse.json(
          { error: "Please choose a partnership option." },
          { status: 400 }
        );
      }

      if (partnership_path === "has_program") {
        if (!program_name && !program_url) {
          return NextResponse.json(
            { error: "Please provide your program name or program URL." },
            { status: 400 }
          );
        }
        if (program_name && program_name.length > PROGRAM_NAME_MAX) {
          return NextResponse.json({ error: "Program name is too long." }, { status: 400 });
        }
        if (program_url && (!isValidUrl(program_url) || program_url.length > URL_MAX)) {
          return NextResponse.json({ error: "Please enter a valid program URL." }, { status: 400 });
        }
      } else {
        // wants_direct — program fields are not applicable
        program_name = null;
        program_url = null;
      }
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
          ...(contact_email && { contact_email }),
          ...(alignment_note && { alignment_note }),
          ...(partnership_path && { partnership_path }),
          ...(program_name && { program_name }),
          ...(program_url && { program_url }),
        },
      ]);

    if (error) {
      console.error("Affiliate insert error:", error);
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
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
      "affiliate_url",
      "why_it_matters",
      "image_url",
    ] as const;

    for (const f of fields) {
      if (body[f] !== undefined) {
        update[f] = typeof body[f] === "string" ? body[f].trim() || null : body[f];
      }
    }

    if (body.category !== undefined) {
      update.category = Array.isArray(body.category)
        ? body.category.filter((c: unknown) => typeof c === "string" && (c as string).trim()).slice(0, 5)
        : [];
    }

    if (body.practices !== undefined) {
      update.practices = Array.isArray(body.practices)
        ? body.practices.filter((p: unknown) => typeof p === "string" && (p as string).trim()).map((p: unknown) => (p as string).trim())
        : [];
    }

    // name, description, url, category must not be emptied
    if (update.name === null || update.description === null || update.url === null || (Array.isArray(update.category) && update.category.length === 0)) {
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
