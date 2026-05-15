/**
 * Internal notification email sent to Ren when a new Founder joins.
 * Fires alongside (but independently from) the welcome email to the founder.
 * Plain and functional — designed for quick scanning, not warmth.
 */

const TIER_LABELS: Record<string, string> = {
  tier_1: "$9/mo",
  tier_2: "$18/mo",
  tier_3: "$27/mo",
};

export function notifyFounderJoinedEmail(options: {
  name: string;
  email: string;
  tier: string;
  amount: number;
  referralCode: string | null;
  isSubscription: boolean;
}): { subject: string; html: string; text: string } {
  const { name, email, tier, amount, referralCode, isSubscription } = options;

  const displayName = name || "(no name provided)";
  const tierLabel = isSubscription
    ? TIER_LABELS[tier] || `$${amount}/mo`
    : `One-time $${amount}`;
  const referralLine = referralCode
    ? `Referral code: ${referralCode}`
    : "No referral code used";
  const timestamp = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = `New founder joined: ${displayName}`;

  const text = `New founder joined.

Name: ${displayName}
Email: ${email}
Tier: ${tierLabel}
${referralLine}
Signed up: ${timestamp}

The welcome email has been sent to them automatically.`;

  const html = `
<div style="max-width:480px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;padding:24px;">
  <p style="font-size:15px;line-height:1.6;margin:0 0 16px;font-weight:600;">New founder joined.</p>

  <table style="font-size:14px;line-height:1.8;border-collapse:collapse;">
    <tr><td style="padding:2px 12px 2px 0;color:#6a7a8a;">Name</td><td>${displayName}</td></tr>
    <tr><td style="padding:2px 12px 2px 0;color:#6a7a8a;">Email</td><td>${email}</td></tr>
    <tr><td style="padding:2px 12px 2px 0;color:#6a7a8a;">Tier</td><td>${tierLabel}</td></tr>
    <tr><td style="padding:2px 12px 2px 0;color:#6a7a8a;">Referral</td><td>${referralLine}</td></tr>
    <tr><td style="padding:2px 12px 2px 0;color:#6a7a8a;">Signed up</td><td>${timestamp}</td></tr>
  </table>

  <p style="font-size:13px;line-height:1.6;color:#6a7a8a;margin:16px 0 0;">
    The welcome email has been sent to them automatically.
  </p>
</div>`.trim();

  return { subject, html, text };
}
