/**
 * Internal notification email sent to Ren when someone submits
 * a link or topic suggestion via the Constellation form.
 */

type Options = {
  type: "link" | "topic";
  topicTitle?: string | null;        // existing topic name (link submissions)
  suggestedTopicName?: string | null; // proposed name (topic suggestions)
  url?: string | null;
  title?: string | null;
  summary?: string | null;           // "why it matters" for topic suggestions
  submitterEmail?: string | null;
};

export function notifyConstellationSubmissionEmail(options: Options) {
  const { type, topicTitle, suggestedTopicName, url, title, summary, submitterEmail } =
    options;

  const isLink = type === "link";
  const topicDisplay = isLink
    ? (topicTitle ?? "(unknown topic)")
    : (suggestedTopicName ?? "(unnamed)");

  const subject = isLink
    ? `New Constellation link — ${topicDisplay}`
    : `New Constellation topic suggestion — ${topicDisplay}`;

  const typeLabel = isLink ? "Link submission" : "Topic suggestion";
  const summaryLabel = isLink ? "Summary" : "Why it matters";

  const rows: { label: string; value: string }[] = [
    { label: "Type", value: typeLabel },
    { label: isLink ? "Topic" : "Suggested topic", value: topicDisplay },
    ...(title ? [{ label: "Title", value: title }] : []),
    ...(url
      ? [
          {
            label: "URL",
            value: `<a href="${url}" style="color:#1a2a3a;">${url}</a>`,
          },
        ]
      : []),
    {
      label: summaryLabel,
      value: (summary ?? "").replace(/\n/g, "<br>"),
    },
    ...(submitterEmail
      ? [
          {
            label: "Submitter email",
            value: `<a href="mailto:${submitterEmail}" style="color:#1a2a3a;">${submitterEmail}</a>`,
          },
        ]
      : []),
  ];

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a2a3a;">
  <h2 style="color: #1a5a3a; font-size: 18px; margin: 0 0 16px;">
    ${subject}
  </h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    ${rows
      .map(
        (r) => `
    <tr>
      <td style="padding: 8px 0; font-weight: 600; vertical-align: top; width: 140px;">${r.label}</td>
      <td style="padding: 8px 0;">${r.value}</td>
    </tr>`
      )
      .join("")}
  </table>
  ${
    submitterEmail
      ? `<p style="margin: 20px 0 0; font-size: 13px; color: #6b7c94;">Reply directly to ${submitterEmail}.</p>`
      : ""
  }
</div>`.trim();

  const textRows = [
    `Type: ${typeLabel}`,
    `${isLink ? "Topic" : "Suggested topic"}: ${topicDisplay}`,
    ...(title ? [`Title: ${title}`] : []),
    ...(url ? [`URL: ${url}`] : []),
    `${summaryLabel}: ${summary ?? ""}`,
    ...(submitterEmail ? [`Submitter email: ${submitterEmail}`] : []),
  ];

  const text = [
    subject,
    "",
    ...textRows,
    ...(submitterEmail ? ["", `Reply directly to ${submitterEmail}.`] : []),
  ].join("\n");

  return { subject, html, text };
}
