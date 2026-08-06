import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { resend, FROM_EMAIL } from "@/app/lib/resend";
import { notifyConstellationSubmissionEmail } from "@/app/lib/emails/notifyConstellationSubmission";

const NOTIFY_EMAIL = "founder@canarycommons.org";

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function getFaviconUrl(url: string): string | null {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      topic_id,
      suggested_topic_name,
      url,
      title,
      summary,
      submitter_email,
    } = body;

    if (type !== "link" && type !== "topic") {
      return NextResponse.json({ error: "Invalid submission type." }, { status: 400 });
    }

    if (type === "link") {
      if (!topic_id || typeof topic_id !== "string") {
        return NextResponse.json({ error: "Please select a topic." }, { status: 400 });
      }
      if (!url || !isValidUrl(url)) {
        return NextResponse.json({ error: "A valid URL is required." }, { status: 400 });
      }
      if (!title || typeof title !== "string" || !title.trim()) {
        return NextResponse.json({ error: "A title is required." }, { status: 400 });
      }
      if (!summary || typeof summary !== "string" || !summary.trim()) {
        return NextResponse.json({ error: "A summary is required." }, { status: 400 });
      }
    }

    if (type === "topic") {
      if (
        !suggested_topic_name ||
        typeof suggested_topic_name !== "string" ||
        !suggested_topic_name.trim()
      ) {
        return NextResponse.json({ error: "A topic name is required." }, { status: 400 });
      }
      if (!summary || typeof summary !== "string" || !summary.trim()) {
        return NextResponse.json(
          { error: "Please explain why this topic matters." },
          { status: 400 }
        );
      }
    }

    const emailTrimmed =
      submitter_email && typeof submitter_email === "string"
        ? submitter_email.trim()
        : null;
    if (emailTrimmed && (!emailTrimmed.includes("@") || !emailTrimmed.includes("."))) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Look up topic title for the notification email
    let topicTitle: string | null = null;
    if (type === "link" && topic_id) {
      const { data: topic } = await supabaseAdmin
        .from("constellation_topics")
        .select("title")
        .eq("id", topic_id)
        .maybeSingle();
      topicTitle = topic?.title ?? null;
    }

    const faviconUrl = type === "link" && url ? getFaviconUrl(url) : null;

    const { error: dbError } = await supabaseAdmin
      .from("constellation_submissions")
      .insert({
        type,
        topic_id: type === "link" ? (topic_id ?? null) : null,
        suggested_topic_name:
          type === "topic" ? (suggested_topic_name?.trim() ?? null) : null,
        url: url?.trim() || null,
        title: title?.trim() || null,
        summary: summary?.trim() || null,
        submitter_email: emailTrimmed || null,
        favicon_url: faviconUrl,
      });

    if (dbError) {
      console.error("constellation_submissions insert error:", dbError.message);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    // Send notification email — non-blocking, same pattern as bridge inquiry
    try {
      const emailContent = notifyConstellationSubmissionEmail({
        type,
        topicTitle,
        suggestedTopicName: suggested_topic_name?.trim() ?? null,
        url: url?.trim() ?? null,
        title: title?.trim() ?? null,
        summary: summary?.trim() ?? null,
        submitterEmail: emailTrimmed,
      });

      await resend.emails.send({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        ...(emailTrimmed ? { replyTo: emailTrimmed } : {}),
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
    } catch (emailErr) {
      console.error(
        "Constellation submission notification email failed:",
        emailErr instanceof Error ? emailErr.message : emailErr
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(
      "Constellation submit error:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
