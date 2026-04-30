/**
 * Magic-link login email for seeders.
 * Sent when a seeder requests a login link via /[handle]/login.
 */

export function seederLoginLinkEmail(options: {
  name: string;
  loginUrl: string;
}): { subject: string; html: string; text: string } {
  const { name, loginUrl } = options;

  const subject = "Your Canary Commons login link";

  const html = `
<div style="max-width:560px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1e2a38;padding:24px;">
  <p style="font-size:16px;line-height:1.6;">Hi ${name},</p>
  <p style="font-size:16px;line-height:1.6;">
    Here's your login link for Canary Commons. It's valid for 30 minutes
    and can only be used once.
  </p>
  <div style="text-align:center;margin:28px 0;">
    <a href="${loginUrl}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:#FFD86B;color:#08192d;font-weight:700;font-size:15px;text-decoration:none;">
      Log In
    </a>
  </div>
  <p style="font-size:14px;line-height:1.6;color:#5a6a7a;">
    If you didn't request this link, you can safely ignore this email.
  </p>
</div>`.trim();

  const text = `Hi ${name},

Here's your login link for Canary Commons. It's valid for 30 minutes and can only be used once.

${loginUrl}

If you didn't request this link, you can safely ignore this email.`;

  return { subject, html, text };
}
