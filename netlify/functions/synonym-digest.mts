import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

/**
 * Monthly synonym digest — runs 1st of each month at 8am Pacific (15:00 UTC).
 *
 * 1. Aggregates search_logs from the previous month
 * 2. Identifies candidate terms via detection logic
 * 3. Inserts candidates into synonym_candidates
 * 4. Sends digest email to Ren with deep link to Supabase Studio
 */

const supabase = createClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL!;
const FROM_EMAIL = "Canary Commons <synonyms@canarycommons.org>";

// Supabase Studio deep link for synonym_candidates filtered to pending
function buildReviewUrl(): string {
  const projectRef = "lzqlmzqjpztnzgriqyok";
  const tableId = process.env.SUPABASE_SYNONYM_CANDIDATES_TABLE_ID || "";
  if (tableId) {
    return `https://supabase.com/dashboard/project/${projectRef}/editor/${tableId}?filter=status%3Deq%3Apending`;
  }
  // Fallback: link to the project editor without table filter
  return `https://supabase.com/dashboard/project/${projectRef}/editor`;
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

type AggRow = {
  search_term: string;
  count: number;
  avg_hits: number;
};

export default async function handler() {
  const now = new Date();

  // Period: first day of previous month → first day of this month
  const periodEnd = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthLabel = getMonthLabel(periodStart);

  console.log(`[synonym-digest] Running for ${monthLabel}`);
  console.log(`[synonym-digest] Period: ${periodStart.toISOString()} → ${periodEnd.toISOString()}`);

  // 1. Fetch search logs for the period
  const { data: logs, error: logsErr } = await supabase
    .from("search_logs")
    .select("search_term, direct_hit_count")
    .gte("created_at", periodStart.toISOString())
    .lt("created_at", periodEnd.toISOString());

  if (logsErr) {
    console.error("[synonym-digest] Failed to fetch search logs:", logsErr.message);
    return new Response("Failed to fetch search logs", { status: 500 });
  }

  // 2. Aggregate by search_term
  const agg = new Map<string, { count: number; totalHits: number }>();
  for (const log of logs ?? []) {
    const term = (log.search_term || "").trim().toLowerCase();
    if (!term) continue;
    const entry = agg.get(term) || { count: 0, totalHits: 0 };
    entry.count += 1;
    entry.totalHits += log.direct_hit_count ?? 0;
    agg.set(term, entry);
  }

  // 3. Load existing synonym groups to check membership
  const { data: groups } = await supabase
    .from("synonym_groups")
    .select("terms");

  const allSynonymTerms = new Set<string>();
  for (const group of groups ?? []) {
    for (const t of group.terms ?? []) {
      allSynonymTerms.add(t.toLowerCase());
    }
  }

  // 4. Apply candidate detection logic
  const candidates: AggRow[] = [];
  for (const [term, stats] of agg) {
    const avgHits = stats.totalHits / stats.count;
    const isLowHit = stats.count >= 3 && avgHits <= 1;
    const isOrphan = stats.count >= 5 && !allSynonymTerms.has(term);

    if (isLowHit || isOrphan) {
      candidates.push({ search_term: term, count: stats.count, avg_hits: avgHits });
    }
  }

  // Sort by occurrence count descending
  candidates.sort((a, b) => b.count - a.count);

  console.log(`[synonym-digest] ${candidates.length} candidates identified from ${agg.size} unique terms`);

  // 5. Attempt to suggest a group for each candidate
  type CandidateInsert = {
    search_term: string;
    occurrence_count: number;
    avg_direct_hits: number;
    suggested_group_id: string | null;
    status: string;
    period_start: string;
    period_end: string;
  };

  const inserts: CandidateInsert[] = [];

  // Load groups with IDs for suggestion matching
  const { data: groupsWithIds } = await supabase
    .from("synonym_groups")
    .select("id, terms, notes");

  for (const c of candidates) {
    let suggestedId: string | null = null;

    // Simple heuristic: find a group where any term is a substring of
    // the candidate or vice versa
    if (groupsWithIds) {
      for (const g of groupsWithIds) {
        const match = (g.terms ?? []).some((t: string) => {
          const gl = t.toLowerCase();
          return gl.includes(c.search_term) || c.search_term.includes(gl);
        });
        if (match) {
          suggestedId = g.id;
          break;
        }
      }
    }

    inserts.push({
      search_term: c.search_term,
      occurrence_count: c.count,
      avg_direct_hits: Math.round(c.avg_hits * 10) / 10,
      suggested_group_id: suggestedId,
      status: "pending",
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
    });
  }

  // 6. Insert candidates
  if (inserts.length > 0) {
    const { error: insertErr } = await supabase
      .from("synonym_candidates")
      .insert(inserts);

    if (insertErr) {
      console.error("[synonym-digest] Failed to insert candidates:", insertErr.message);
    }
  }

  // 7. Build and send email
  const reviewUrl = buildReviewUrl();

  const emailCandidates = candidates.map((c) => {
    const suggestedGroup = inserts.find((i) => i.search_term === c.search_term);
    let groupNotes: string | null = null;
    if (suggestedGroup?.suggested_group_id && groupsWithIds) {
      const g = groupsWithIds.find((g: { id: string }) => g.id === suggestedGroup.suggested_group_id);
      if (g?.notes) groupNotes = g.notes;
    }
    return {
      search_term: c.search_term,
      occurrence_count: c.count,
      avg_direct_hits: c.avg_hits,
      suggested_group_notes: groupNotes,
    };
  });

  // Import the email template dynamically (it's an ESM module)
  const { synonymDigestEmail } = await import("../../app/lib/emails/synonymDigest.js");
  const email = synonymDigestEmail({
    month: monthLabel,
    candidates: emailCandidates,
    reviewUrl,
  });

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
    console.log(`[synonym-digest] Email sent to ${ADMIN_EMAIL}`);
  } catch (emailErr) {
    console.error("[synonym-digest] Failed to send email:", emailErr);
  }

  return new Response(
    JSON.stringify({
      month: monthLabel,
      candidates: candidates.length,
      emailSent: true,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

export const config: Config = {
  // 1st of each month at 8am Pacific (15:00 UTC)
  schedule: "0 15 1 * *",
};
