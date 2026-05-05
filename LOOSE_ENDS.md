# Canary Commons — Loose Ends

*Running list of consciously deferred work. Anything postponed during a session lands here. Items graduate to PROJECT_STATE.md when they become active, or get deleted when they're no longer relevant.*

*For bigger architectural additions that depend on project maturity rather than urgency, see GROWTH_LIST.md.*

*Last updated: May 5, 2026*

---

- [ ] Revisit client-side affiliate filter approach if affiliate_resources crosses ~150 records
- [ ] State-level "All counties" search — different feature, separate design
- [ ] Synonym data shape — current flat string[] in synonym_groups.terms may evolve to weighted associations if needed; getSynonyms signature is the stable interface
- [ ] Watch logs for "tool library", "seed library", "library of things" searches — currently only partial match via Group 34 (learning & education); may warrant their own group or cross-group additions if traffic appears
- [ ] Add BEFORE UPDATE trigger on synonym_groups to auto-bump updated_at when terms array is edited directly in Supabase Studio (current trigger handles this for the "grouped" approval path, but not for manual edits to existing groups)
- [ ] Move SUPABASE_PROJECT_REF from hardcoded value in netlify/functions/synonym-digest.mts to an env var. Currently fine because there's one Supabase project; revisit if staging is added.
- [ ] Verify Supabase Studio deep-link filter syntax (?filter=status%3Deq%3Apending) actually lands on a filtered view of pending candidates after first cron run on May 1. If not, adjust URL format.
- [ ] Magic-link round-trip test — Phase 1 deployed Apr 30. Cookie-signing mechanism confirmed working via dev-endpoint testing (Stages B, C, D all exercised the signed session cookie end-to-end). The production email delivery path (submit form -> Resend sends email -> click link -> land on dashboard) is the remaining untested leg, pending Lucia's availability to test on her real account.
- [ ] **Stage D.6 — finish UI next session** — Build app/[handle]/admin/page.tsx (Server Component with three-gate auth + seeder list with placement counts) and app/[handle]/admin/AdminClient.tsx (creation form + per-row resend welcome button). Architecture decisions locked. Backend endpoints ready to receive calls. ADMIN_SEEDER_EMAIL env var must be set in .env.local AND Netlify before the page is reachable in production.

- [ ] **Resend webhook secret mismatch (LOW PRIORITY)** — Webhook events arriving with 401 "Invalid signature" responses. The RESEND_WEBHOOK_SECRET in Netlify doesn't byte-for-byte match what Resend signs with. Doesn't affect email sending (uses RESEND_API_KEY which is correct). Fix path: Stage D.6 (admin UI for seeder onboarding) is the natural moment to generate a fresh secret, paste cleanly into both .env.local and Netlify, redeploy.

- [ ] **Proton first-contact mail routing (LOW PRIORITY, OBSERVATION)** — Magic-link emails to founder@canarycommons.org land in Proton's All Mail folder, not Inbox. Likely Proton's conservative first-contact handling for new sender domains (canarycommons.org via Resend). Should warm up over time. Worth verifying SPF/DKIM/DMARC are all green in Resend → Domains → canarycommons.org.

- [ ] Verify seederWelcome email rendering in production — Stage D.5's welcome email and admin endpoint are built and deployed but not yet end-to-end tested. The first real send (when onboarding Lucia or another seeder) is the verification. If the email doesn't arrive or has rendering issues, troubleshoot the curl/auth/Netlify env var setup at that point. Recommendation for first real onboarding: either (a) onboard directly with the real seeder and watch for the email to arrive, or (b) if curl proves consistently finicky across environments, build a tiny admin UI button as a more reliable trigger. Do NOT test against a fake seeder row — the first real onboarding IS the test.
