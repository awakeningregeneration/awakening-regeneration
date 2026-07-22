/**
 * Internal notification email sent to Ren when someone submits
 * a Bridge the Commons large-gift inquiry.
 */

type Options = {
  name: string;
  email: string;
  giftRange: string;
  message: string | null;
};

const RANGE_LABELS: Record<string, string> = {
  "500-1000": "$500 – $1,000",
  "1000-5000": "$1,000 – $5,000",
  "5000+": "$5,000+",
};

export function notifyBridgeInquiryEmail(options: Options) {
  const { name, email, giftRange, message } = options;
  const rangeLabel = RANGE_LABELS[giftRange] || giftRange;

  const subject = `Bridge the Commons inquiry from ${name}`;

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a2a3a;">
  <h2 style="color: #8a6d2a; font-size: 18px; margin: 0 0 16px;">
    New Bridge the Commons inquiry
  </h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <tr>
      <td style="padding: 8px 0; font-weight: 600; vertical-align: top; width: 100px;">Name</td>
      <td style="padding: 8px 0;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Email</td>
      <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #1a2a3a;">${email}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Range</td>
      <td style="padding: 8px 0;">${rangeLabel}</td>
    </tr>
    ${message ? `<tr>
      <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Message</td>
      <td style="padding: 8px 0;">${message.replace(/\n/g, "<br>")}</td>
    </tr>` : ""}
  </table>
  <p style="margin: 20px 0 0; font-size: 13px; color: #6b7c94;">
    Reply directly to this person at ${email}.
  </p>
</div>`.trim();

  const text = [
    "New Bridge the Commons inquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Range: ${rangeLabel}`,
    message ? `Message: ${message}` : null,
    "",
    `Reply directly to ${email}.`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject, html, text };
}
