# How I Operate Canary Commons

*The everyday operator's guide to the platform I built — how to log in, what each of my pages does, where the logins live, and what I can only do outside my own UI.*

## My login address

https://canarycommons.org/ren/login

### How to get in (do this first, every time)

1. Go to my login address: https://canarycommons.org/ren/login
2. Enter my admin email. Use the same email registered as founder/admin — a different address keeps bouncing to a 404.
3. Check my inbox for the magic-link login email. Click the link (good for 30 minutes). That sets my session.
4. Now go to https://canarycommons.org/ren/admin — it opens instead of showing 404.

A 404 on /ren/admin almost always means "not logged in." The page is built to hide behind a 404, not a login screen. Log in first, then it opens.

## Most common task — re-send a seeder's welcome/invite email

1. In Supabase Studio, open the `seeders` table, find her row, correct the email field, save. (The admin page can't edit emails — only Supabase can.)
2. Go to https://canarycommons.org/ren/admin, find her in the list, click "Resend welcome" on her row. It sends to whatever email is now in her row.

Order matters: fix the email in Supabase first, then resend — otherwise it goes to the wrong address again.

## My pages (operator routes — log in first)

- https://canarycommons.org/ren — My seeder dashboard. See all placed listings with status badges, place new listings, trigger Email 1 to stewards, copy outreach letters for contact-form-only businesses, see recognition credits, copy my direct invitation link.
- https://canarycommons.org/ren/admin — Seeder management hub. Create new seeders (name + email + handle → sends welcome email automatically), view all seeders with placement counts, resend welcome emails per-row. Gated to me only; returns 404 to anyone else.
- https://canarycommons.org/ren/place — Place one listing. Single placement form: name, description, category, practices, location, website, steward email. Geocodes automatically; fires Email 1 if a steward email is given.
- https://canarycommons.org/ren/place/bulk — Place listings in bulk. Paste a JSON array, review each as an editable card, place one at a time. Up to 50 per batch.
- https://canarycommons.org/ren/map-view — Cross-seeder map view. Every seeder-placed listing across the whole map, grouped by state/county with attribution. For spotting gaps and avoiding duplicates.
- https://canarycommons.org/ren/start — Seeder orientation. The orientation every new seeder completes before accessing their dashboard. Revisit anytime from the dashboard footer.
- https://canarycommons.org/ren/login — My login (magic link). Enter my email, get a 30-minute login link, click it, land on the dashboard with a 30-day session cookie. This is my login address.
- https://canarycommons.org/founders/join — Tending / contribution page. Public-facing — also where I test the checkout flow. Three tiers ($18/$28/$42) plus the one-time gift path.

## My key files — where things are written down

When I lose the thread, I start here. Every session opens by reading the first three.

- PROJECT_STATE.md — The current state of the build. Read at the start of every session.
- LOOSE_ENDS.md — Small deferred items and technical debt.
- GROWTH_LIST.md — Future architectural additions, for when the project matures.
- OPERATING.md — This guide — how to run the platform day to day.
- NAMING_MAP.md — Canonical reference for the Online Resources vs. affiliate_resources naming split.
- SEEDER_RESEARCH_WORKFLOW.md — How to research businesses for seeding listings.
- BULK_PLACEMENT_JSON.md — The JSON format for bulk listing placement.
- EMAIL_REWRITE_DRAFTS.md — The steward outreach email drafts.
- CLAUDE.md — Standing instructions for Claude Code (including: never print secrets).

Session rhythm: open by reading PROJECT_STATE.md, LOOSE_ENDS.md, and GROWTH_LIST.md; close with a Claude Code prompt that updates PROJECT_STATE.md.

## Systems & logins (fill in my login email once)

- GitHub — the source code repository. https://github.com — logged in as: (fill in). Check: commit history.
- Netlify — hosts the live site; stores environment variables; runs the daily outreach function. https://app.netlify.com — logged in as: (fill in). Check: deploy status, build logs, env vars, Functions.
- Supabase — the database & backend (founders, listings, seeders; auth; incoming webhooks). https://supabase.com/dashboard — logged in as: (fill in). Check: Table Editor, SQL Editor, logs.
- Resend — sends all outgoing mail (seeder welcome, steward outreach, confirmations, digest). https://resend.com — logged in as: (fill in). Check: email logs & delivery status; domain verification.
- Stripe — all founder payments (subscriptions, one-time gifts, webhooks). https://dashboard.stripe.com — logged in as: (fill in). Check: payments, customers, subscriptions, webhook logs.
- Mapbox — renders the map tiles & styling on /map. https://account.mapbox.com — logged in as: (fill in). Check: access token, monthly usage.
- Domain / DNS — where canarycommons.org is registered and points from. (fill in registrar URL) — logged in as: (fill in). Check: DNS records, domain renewal date.
- Mailbox — the founder@canarycommons.org inbox. (fill in mail host URL) — logged in as: (fill in). Check: sending/receiving founder mail.
- AWIN — affiliate network behind Online Resources (awin1.com redirects). https://www.awin.com — logged in as: (fill in). Check: affiliate links, tracking, payouts.
- Google Drive — where I keep docs & reference files like this one. https://drive.google.com — logged in as: (fill in). Check: saved documents.

Security: Never put API keys, service-role keys, webhook secrets, or .env contents in this document. Keys live inside each service's settings and in Netlify's environment variables — this file only holds where things are, not the keys themselves.

## Things I can only do outside my own pages

- Edit a seeder's email, name, or handle — Supabase Studio → seeders table → edit the row directly.
- Deactivate a seeder — Supabase Studio → set active = false on their seeders row.
- View/manage founders (contributors) — Supabase Studio → founders table (no admin UI for this).
- View/manage seeder referral payouts — Supabase Studio → seeder_referrals table.
- Cancel or refund a Stripe subscription/payment — Stripe Dashboard → Customers or Payments.
- Review synonym candidates — Supabase Studio → synonym_candidates table (status = pending). Monthly digest email has a deep link.
- Clean up test data — Supabase Studio → delete test rows from founders and seeder_referrals.
- Run the outreach cron manually — Netlify → Functions → seeder-outreach → trigger manually (else runs daily 6am Pacific).
- Check bounce/complaint status — seeder dashboard shows bounce info per listing; raw data in listings.bounce_info; Resend shows delivery logs.
- Rotate API keys — rotate in Stripe / Supabase / Resend, then update in Netlify env vars + local .env.local.
- Update Stripe price IDs (repricing) — Stripe → create new Prices, then update STRIPE_PRICE_TIER_1/2/3 in Netlify env vars + .env.local.
- Verify steward claims manually — Supabase Studio → stewardship_claims + stewards tables, or /api/steward/reverify with the old token.
- Remove a listing (admin) — steward or seeder can do it through their flows; for admin removal, edit do_not_list_level in Supabase.

## Troubleshooting — start here when something's off

- /ren/admin shows 404 — Not logged in. Go to /ren/login first, click the magic link, then reopen /ren/admin.
- Someone didn't get an email — Supabase (is the address right?) → Resend logs (did it send / bounce?).
- Site is down or a change didn't show up — Netlify → latest deploy + build log.
- A payment didn't record — Stripe (payment + webhook logs) → Supabase (did the row land?).
- Map won't load — Mapbox → token + usage.
- Email sending as wrong address / not at all — Resend → domain verification → then DNS records.

---

*Last updated: _____________  •  Maintained by Ren*
