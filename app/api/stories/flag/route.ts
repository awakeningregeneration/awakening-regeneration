import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

function hashIp(ip: string) {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const storyId = body.storyId;
    const reason = body.reason;
    const details = body.details || "";

    if (!storyId) {
      return NextResponse.json({ error: "Missing storyId." }, { status: 400 });
    }

    if (!reason) {
      return NextResponse.json({ error: "Missing reason." }, { status: 400 });
    }

    const ip = getClientIp(req);
    const ipHash = hashIp(ip);
    const day = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase.rpc("flag_story", {
      p_story_id: storyId,
      p_ip_hash: ipHash,
      p_day: day,
      p_reason: reason,
      p_details: details,
    });

    if (error) {
      console.error("Flag story error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      result: data,
    });
  } catch (error) {
    console.error("POST /api/stories/flag error:", error);

    return NextResponse.json(
      { error: "Failed to flag story." },
      { status: 500 }
    );
  }
}
