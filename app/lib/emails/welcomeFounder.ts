/**
 * Welcome email sent to a new Founder after successful Stripe checkout.
 *
 * Copy lives here so Ren can find and revise it easily.
 * The HTML is a plain letter — no banners, no logos, no social icons.
 */

export function welcomeFounderEmail(options: {
  name?: string;
}): { subject: string; html: string; text: string } {
  const greeting = options.name
    ? `Welcome, ${options.name},`
    : "Welcome,";

  const subject = "You're in.";

  // ─── Plain text ───────────────────────────────────────────
  const text = `${greeting}

You've stepped into something that is already growing.

This is a living map — not built by one person collecting, but by people noticing and placing what's alive around them. What you just did helps make more of it visible.

We'll keep this simple to begin.

If something comes to mind — a place, a person, something that matters where you are — you can place it on the map.

Start with three.
Not because it's a rule, but because it's enough to feel the shape of this.

→ Visit the map and place a point of light
https://www.canarycommons.org/map

You'll see where something is missing. You can add what you know.

If nothing comes to mind right away, that's okay too. This works just as well when you let it surface over a day or two.

There's also another way this grows.

You can share this with a few people you trust — and let them place what they see. This map builds through people, not promotion.

Over time, you'll receive two kinds of emails from us:
• one that shares what's already working — stories, places, and signals from around the country
• one that asks, simply, where you've noticed or supported something good

Nothing here is meant to rush you. Just to give you a place to look, and a way to take part.

You're part of what makes this visible now.

— Ren
Canary Commons

You're receiving this because you just joined Canary Commons as a Founder.`;

  // ─── HTML ─────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; background-color:#fafafa; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Georgia,serif; color:#1a2332;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%;">
          <tr>
            <td style="font-size:16px; line-height:1.7; color:#1a2332;">

              <p style="margin:0 0 18px;">${greeting}</p>

              <p style="margin:0 0 18px;">
                You've stepped into something that is already growing.
              </p>

              <p style="margin:0 0 18px;">
                This is a living map &mdash; not built by one person collecting, but by people noticing and placing what's alive around them. What you just did helps make more of it visible.
              </p>

              <p style="margin:0 0 18px;">
                We'll keep this simple to begin.
              </p>

              <p style="margin:0 0 18px;">
                If something comes to mind &mdash; a place, a person, something that matters where you are &mdash; you can place it on the map.
              </p>

              <p style="margin:0 0 6px;">
                <strong>Start with three.</strong>
              </p>
              <p style="margin:0 0 28px;">
                Not because it's a rule, but because it's enough to feel the shape of this.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td align="center" style="border-radius:999px; background-color:#FFD86B;">
                    <a href="https://www.canarycommons.org/map"
                       target="_blank"
                       style="display:inline-block; padding:14px 28px; color:#1a2a0e; font-weight:700; font-size:16px; text-decoration:none; border-radius:999px;">
                      &rarr; Visit the map and place a point of light
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 18px;">
                You'll see where something is missing. You can add what you know.
              </p>

              <p style="margin:0 0 18px;">
                If nothing comes to mind right away, that's okay too. This works just as well when you let it surface over a day or two.
              </p>

              <p style="margin:0 0 18px;">
                There's also another way this grows.
              </p>

              <p style="margin:0 0 18px;">
                You can share this with a few people you trust &mdash; and let them place what they see. This map builds through people, not promotion.
              </p>

              <p style="margin:0 0 18px;">
                Over time, you'll receive two kinds of emails from us:
              </p>

              <ul style="margin:0 0 18px; padding-left:20px; line-height:1.7;">
                <li style="margin-bottom:6px;">one that shares what's already working &mdash; stories, places, and signals from around the country</li>
                <li>one that asks, simply, where you've noticed or supported something good</li>
              </ul>

              <p style="margin:0 0 18px;">
                Nothing here is meant to rush you. Just to give you a place to look, and a way to take part.
              </p>

              <p style="margin:0 0 28px;">
                You're part of what makes this visible now.
              </p>

              <p style="margin:0 0 0;">
                &mdash; Ren<br />
                Canary Commons
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:32px 0 0; font-size:13px; color:#7a8699; line-height:1.5;">
              You're receiving this because you just joined Canary Commons as a Founder.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
