/**
 * Monthly synonym digest email sent to Ren.
 *
 * Contains the month's candidate terms and a deep link
 * to the synonym_candidates table in Supabase Studio.
 */

type Candidate = {
  search_term: string;
  occurrence_count: number;
  avg_direct_hits: number | null;
  suggested_group_notes: string | null;
};

export function synonymDigestEmail(options: {
  month: string; // e.g. "April 2026"
  candidates: Candidate[];
  reviewUrl: string;
}): { subject: string; html: string; text: string } {
  const { month, candidates, reviewUrl } = options;
  const count = candidates.length;

  const subject = `Canary Commons synonyms — ${month} candidates`;

  const candidateRows =
    count === 0
      ? `<p style="color:#94c4ec;font-size:15px;line-height:1.6;">No new candidates this month. The loop is alive — nothing needed your attention.</p>`
      : candidates
          .map((c) => {
            const hits =
              c.avg_direct_hits !== null
                ? `, avg ${c.avg_direct_hits.toFixed(1)} direct hits`
                : "";
            const group = c.suggested_group_notes
              ? ` → may fit in: ${c.suggested_group_notes}`
              : "";
            return `<tr>
              <td style="padding:8px 12px;border-bottom:1px solid rgba(255,216,107,0.12);color:#e8f4ff;font-size:14px;">${c.search_term}</td>
              <td style="padding:8px 12px;border-bottom:1px solid rgba(255,216,107,0.12);color:#94c4ec;font-size:14px;">${c.occurrence_count}× searched${hits}${group}</td>
            </tr>`;
          })
          .join("\n");

  const candidateTable =
    count === 0
      ? candidateRows
      : `<table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px 12px;border-bottom:2px solid rgba(255,216,107,0.3);color:#FFD86B;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Term</th>
              <th style="text-align:left;padding:8px 12px;border-bottom:2px solid rgba(255,216,107,0.3);color:#FFD86B;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Details</th>
            </tr>
          </thead>
          <tbody>
            ${candidateRows}
          </tbody>
        </table>`;

  const html = `
<div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#08192d;color:#d3e3f7;padding:32px 24px;border-radius:16px;">
  <p style="font-size:16px;line-height:1.6;margin:0 0 20px;">
    Here's what people searched for on Canary Commons this month that
    didn't have a clear home in the synonym map. Each of these terms
    was typed into the county search bar and came back with few or no
    direct hits — which means either the listings haven't arrived yet,
    or the synonym map doesn't know how to connect the dots.
  </p>

  <p style="font-size:15px;line-height:1.6;color:#94c4ec;margin:0 0 24px;">
    <strong style="color:#FFD86B;">${count}</strong> candidate${count === 1 ? "" : "s"} this month.
  </p>

  ${candidateTable}

  <div style="text-align:center;margin:28px 0 16px;">
    <a href="${reviewUrl}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:#FFD86B;color:#08192d;font-weight:700;font-size:15px;text-decoration:none;">
      Review Candidates
    </a>
  </div>

  <p style="font-size:13px;color:#6a8aaa;line-height:1.5;margin:24px 0 0;text-align:center;">
    This link opens the synonym_candidates table in Supabase Studio,
    filtered to pending items. Change status to approved, grouped, or
    rejected — the trigger handles the rest.
  </p>
</div>
  `.trim();

  const textCandidates =
    count === 0
      ? "No new candidates this month."
      : candidates
          .map((c) => {
            const hits =
              c.avg_direct_hits !== null
                ? `, avg ${c.avg_direct_hits.toFixed(1)} direct hits`
                : "";
            return `  - "${c.search_term}" (${c.occurrence_count}× searched${hits})`;
          })
          .join("\n");

  const text = `Canary Commons synonyms — ${month} candidates

${count} candidate${count === 1 ? "" : "s"} this month.

${textCandidates}

Review candidates: ${reviewUrl}

Change status to approved, grouped, or rejected in Supabase Studio — the trigger handles the rest.`;

  return { subject, html, text };
}
