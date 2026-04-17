# Canary Commons — Project State

**Last updated:** April 16, 2026 (evening)
**Purpose:** Living diary of what is currently in motion, what just finished, and what's next. Update after every meaningful change. For full architecture and system map, see PROJECT_MAP.md.

---

## What just finished (April 16, 2026)

The full Founders Stripe loop was built out today. At the start of the day, only the Stripe product and price tiers existed. By end of day:

- **Rotated two compromised keys**: SUPABASE_SERVICE_ROLE_KEY and RESEND_API_KEY. Old keys still exist but unused. New keys live in .env.local and Netlify.
- **Added 9 columns to Supabase tables**: founders (tier, amount, stripe_customer_id, stripe_subscription_id, subscription_status) and seeder_referrals (tier, amount, payout_amount, payouts_paid).
- **Added unique constraint** on founders.stripe_customer_id to prevent duplicate rows from webhook retries.
- **Built the Checkout API route** at app/api/checkout/route.ts — tested locally, successfully redirects to Stripe Checkout with correct tier, one-time amount, and referral code.
- **Wired the Join page** at app/founders/join/page.tsx — "Join the Foundation" button now calls the API, captures ?ref= URL parameters, shows loading and error states.
- **Refined the confirmation page copy** at app/founders/confirmation/page.tsx — softer language, one clear pathway to the map, tie-in to the email rhythm.
- **Built the Stripe Webhook handler** at app/api/stripe/webhook/route.ts — receives checkout.session.completed and customer.subscription.deleted events, writes to founders and seeder_referrals, handles cancellations.
- **Registered the webhook in Stripe** as "canary-commons-prod" pointing at https://www.canarycommons.org/api/stripe/webhook, listening to 2 events, using API version 2026-03-25.dahlia.
- **Added STRIPE_WEBHOOK_SECRET** to .env.local and Netlify.
- **Built the Welcome email flow** — app/lib/emails/welcomeFounder.ts (Ren's letter, exact wording preserved), app/lib/resend.ts (helper with FROM_EMAIL = "Ren at Canary Commons <founder@canarycommons.org>"), wired into webhook handler to fire after successful founder insert.

## Current state of the loop

- [x] Stripe product + 3 pricing tiers ($9 / $18 / $27)
- [x] Stripe env vars in .env.local + Netlify (secret key, publishable key, 3 price IDs, webhook secret)
- [x] Supabase founders and seeder_referrals tables have Stripe columns
- [x] Checkout API route (app/api/checkout/route.ts) — tested locally
- [x] Join page wired with button + ?ref= capture
- [x] Confirmation page copy refined
- [x] Webhook handler code
- [x] Webhook registered in Stripe
- [x] Welcome email template + wiring
- [ ] Resend DNS verification — as of April 16 6:38 PM, domain canarycommons.org is in "Pending" status with "DNS verified" but "Verifying domain" still spinning. Will flip to "Verified" on its own within hours. Code is wired and waiting; emails will fire as soon as Resend flips green.
- [ ] Deploy to production

## Next up

1. Push today's local work to production (git commit + push to main). Netlify will auto-deploy.
2. Verify the live site works end-to-end: visit /founders, pick a tier, complete a real Stripe payment with a test card or small real amount, confirm the founders row appears in Supabase, confirm the welcome email arrives.
3. Revoke the old Supabase and Resend keys once production deploy confirms the new keys work.

## Known gaps (deferred, not urgent)

- **Seeder claim pathway for missed referrals**: if a seeder verbally tells Ren they brought someone in but the person didn't use the link, handle manually in Supabase for now. Build a claim form later if this becomes frequent.
- **Seeder payout mechanism**: the 25% recurring payout tracking lives in seeder_referrals (payouts_paid counter), but actual money transfer to seeders is still manual. Stripe Connect integration is a future step.
- **Pre-launch data cleanup**: 5 test rows exist in founders table from early April (name="AR", status="pending", referred_by="ren"). Clean these before public launch. Also audit listings, stories, constellation for test data.
- **Admin view for Ren**: currently, to see Founders or manage them, Ren opens Supabase Table Editor. A simple admin dashboard on the site would be nicer long-term, but not urgent.
- **Resend email drafts for months 1-3**: Ren plans to pre-draft the first 3 months of bi-monthly Founder emails (Inspiration+Direction and Participation+Reflection templates) so they queue ahead. Templates will live at app/lib/emails/ alongside welcomeFounder.ts.

## Security rotation log

- **April 16, 2026**: Rotated SUPABASE_SERVICE_ROLE_KEY (exposed in chat transcript). New key in .env.local and Netlify. Old key still exists in Supabase — revoke after production deploy confirms new key works.
- **April 16, 2026**: Rotated RESEND_API_KEY (same reason). New key named "production-cc". Old key "production" still exists in Resend — revoke after production deploy confirms new key works.

## Working strategy

- Strategy and direction happen in claude.ai chat
- Ren pastes Claude Code prompts into VS Code terminal — changes land in the codebase
- Ren reviews visually on localhost before pushing
- Never run `git commit` or `git push` in Claude Code prompts without Ren's explicit instruction
