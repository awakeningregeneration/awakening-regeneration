# Canary Commons — Loose Ends

*Running list of consciously deferred work. Anything postponed during a session lands here. Items graduate to PROJECT_STATE.md when they become active, or get deleted when they're no longer relevant.*

*For bigger architectural additions that depend on project maturity rather than urgency, see GROWTH_LIST.md.*

*Last updated: May 18, 2026*

---

- [ ] Revisit client-side affiliate filter approach if affiliate_resources crosses ~150 records
- [ ] State-level "All counties" search — different feature, separate design
- [ ] Synonym data shape — current flat string[] in synonym_groups.terms may evolve to weighted associations if needed; getSynonyms signature is the stable interface
- [ ] Watch logs for "tool library", "seed library", "library of things" searches — currently only partial match via Group 34 (learning & education); may warrant their own group or cross-group additions if traffic appears
- [ ] Verify Supabase Studio deep-link filter syntax (?filter=status%3Deq%3Apending) actually lands on a filtered view of pending candidates after first cron run on May 1. If not, adjust URL format.
- [ ] Magic-link round-trip test — Phase 1 deployed Apr 30. Cookie-signing mechanism confirmed working via dev-endpoint testing (Stages B, C, D all exercised the signed session cookie end-to-end). The production email delivery path (submit form -> Resend sends email -> click link -> land on dashboard) is the remaining untested leg, pending Lucia's availability to test on her real account.
- [ ] **End-to-end webhook verification on email.bounced and email.complained** — Webhook signature verification confirmed working (email.delivered returning 200 as of May 5). Bounce and complaint events have not yet been observed in production because no outreach has fired yet. Will surface naturally as the first seeder placements trigger the outreach cadence. Low urgency — the code path is verified, just awaiting real data.

- [ ] **Founder email rhythm — templates + scheduler (NEXT SESSION)** — Welcome email and confirmation page both promise "two kinds of emails" to founders. Neither template exists yet; no scheduler exists. Email 1: Inspiration + Direction (stories, places, signals). Email 2: Participation + Reflection (where have you noticed or supported something good). Ren is drafting both in ChatGPT (continuity with original founder voice), then brings drafts back for template wiring + Netlify scheduled function (modeled on seeder-outreach.mts). Twice-per-month cadence.

- [ ] **Proton first-contact mail routing (LOW PRIORITY, OBSERVATION)** — Magic-link emails to founder@canarycommons.org land in Proton's All Mail folder, not Inbox. Likely Proton's conservative first-contact handling for new sender domains (canarycommons.org via Resend). Should warm up over time. Worth verifying SPF/DKIM/DMARC are all green in Resend → Domains → canarycommons.org.

- [ ] **Affiliate ad-blocker friction — acceptable with transparency copy in place** — Users with strict ad blockers (uBlock + Peter Lowe's list) still see a warning when clicking through /resource/[slug] because awin1.com is on the filter list as a redirect destination. The /support overlay now gives full context about why the affiliate links exist and what they fund, so blocker users can proceed informed. This is acceptable given CC's design ethic. Revisit affiliate network alternatives (not Awin) once CC reaches a traffic threshold where other networks will accept the site — Awin remains the right choice for now given CC's current scale.

- [ ] **Cookie Secure flag: project-wide pattern** — When setting cookies client-side via document.cookie, always make the Secure flag conditional: `const secure = window.location.protocol === "https:" ? "; Secure" : ""`. Unconditional "; Secure" causes cookies to silently disappear in local HTTP dev, leading to server/client state divergence and hydration mismatches. Applied in cc_support_intro_acknowledged and cc_compass_seen cookies. Apply to any future client-side cookie-setting code.

- [ ] **Source-mismatch: seeder placements getting source='community_submitted'** — Listings placed by Ren and Lucia after the seeder system was set up were getting source='community_submitted' instead of 'seeder_placed' in the database. Manually corrected for the Ashland batch on May 18, 2026 via Supabase Studio. Root cause in the placement path is unknown — the seeder placement form at /[handle]/place POSTs to /api/seeder/place-listing which explicitly sets source='seeder_placed', so the mismatch suggests some placements may have gone through /api/listings (the public submit route) instead. Worth investigating before next batch placement so it stops happening.

- [ ] **Data consistency: outreach_status vs steward_id on claimed listings** — Dashboard counts use outreach_status === "claimed"; muted-row rendering uses steward_id !== null. If a listing can have one set without the other (e.g., steward_id set but outreach_status still at "email_3_sent", or outreach_status = "claimed" but steward_id still null), the counts and styling could diverge. Verify in Supabase by inspecting any currently-claimed listings. Both values should always be set together in the claim flow (/api/steward/verify and stewardshipPromotion.ts both write both fields), but worth confirming empirically.

## Email rewrite intent captured

See GROWTH_LIST.md → "Email 1 / 2 / 3 Strategic Rewrite — May 18 2026" for the full strategic direction. Not a blocker. Come back when the head is fresh.

- [ ] Verify seederWelcome email rendering in production — Stage D.5's welcome email and admin endpoint are built and deployed but not yet end-to-end tested. The first real send (when onboarding Lucia or another seeder) is the verification. If the email doesn't arrive or has rendering issues, troubleshoot the curl/auth/Netlify env var setup at that point. Recommendation for first real onboarding: either (a) onboard directly with the real seeder and watch for the email to arrive, or (b) if curl proves consistently finicky across environments, build a tiny admin UI button as a more reliable trigger. Do NOT test against a fake seeder row — the first real onboarding IS the test.
