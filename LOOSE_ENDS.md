# Canary Commons — Loose Ends

*Running list of consciously deferred work. Anything postponed during a session lands here. Items graduate to PROJECT_STATE.md when they become active, or get deleted when they're no longer relevant.*

*For bigger architectural additions that depend on project maturity rather than urgency, see GROWTH_LIST.md.*

*Last updated: June 23, 2026*

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

- [ ] **Data consistency: outreach_status vs steward_id on claimed listings** — Dashboard counts use outreach_status === "claimed"; muted-row rendering uses steward_id !== null. If a listing can have one set without the other (e.g., steward_id set but outreach_status still at "email_3_sent", or outreach_status = "claimed" but steward_id still null), the counts and styling could diverge. Verify in Supabase by inspecting any currently-claimed listings. Both values should always be set together in the claim flow (/api/steward/verify and stewardshipPromotion.ts both write both fields), but worth confirming empirically.

## Email rewrite intent captured

See GROWTH_LIST.md → "Email 1 / 2 / 3 Strategic Rewrite — May 18 2026" for the full strategic direction. Not a blocker. Come back when the head is fresh.

- [ ] **Category badge styling consistency check deferred** — During multi-category display update, badge styles across map popup (inline text with ·), support cards (uppercase label), contributor cards (uppercase label), and constellation detail (uppercase label) were kept as-is. The inline text join on map popups reads differently from the badge rendering on cards. Harmonizing is a polish task, not blocking.

- [ ] Verify seederWelcome email rendering in production — Stage D.5's welcome email and admin endpoint are built and deployed but not yet end-to-end tested. The first real send (when onboarding Lucia or another seeder) is the verification. If the email doesn't arrive or has rendering issues, troubleshoot the curl/auth/Netlify env var setup at that point. Recommendation for first real onboarding: either (a) onboard directly with the real seeder and watch for the email to arrive, or (b) if curl proves consistently finicky across environments, build a tiny admin UI button as a more reliable trigger. Do NOT test against a fake seeder row — the first real onboarding IS the test.

## Needs testing when Ren returns (built 2026-05-23, untested)

The "no public email" workflow was built end-to-end but never tested live. Before relying on it, test:

- [ ] Place a listing through the bulk tool with the "No public email" checkbox checked. Confirm the listing lands in Supabase with no_public_email = true and outreach_status = 'not_started' and last_outreach_at IS NULL.
- [ ] Confirm the "Copy letter" button on the bulk card copies the correct Email 1 text to clipboard.
- [ ] On the seeder dashboard, confirm the listing displays the "Contact form only" badge (not "No steward email").
- [ ] Confirm the "Copy outreach letter" button on the dashboard row copies the same Email 1 text.
- [ ] Confirm "Send Email 1 now" does NOT appear on no_public_email = true rows.
- [ ] Live test case: A Leap of Taste in Klamath Falls. Either flip its no_public_email flag manually via SQL, or re-place it through the bulk tool with the checkbox checked.
- [ ] Verify whether migration supabase/migrations/20260523_listings_no_public_email.sql has been run against production Supabase. Code was committed and pushed (349d2ab) but production migration status is unconfirmed. Check by looking for the no_public_email column on the listings table in Supabase Studio. If not yet run, run it before any of the live tests above.

## From the June 9 session

- [x] ~~**Drawer swipe gesture.**~~ Shipped Jun 10 — draggable slide-over sheet with peek/mid/full snap points, hand-rolled touch handling, PEEK_HEIGHT=210px constant. Tested on real iPhone.

- [x] ~~**Jun 9 session work is UNCOMMITTED.**~~ Committed and pushed (058222e, Jun 9).

## From the June 23 session

- [ ] **MAILING ADDRESS CAPTURE — not built.** The flow promises physical mail (quarterly Notes from the Field for subscribers; first-edition welcome letter + seeds for one-time gifts) but collects no shipping address. Settled decisions: everyone normally gets physical mail (both subscription and one-time paths); US-only shipping; physical mail is OPT-OUT (default on) so non-US contributors can still join and decline paper; opt-out members get EMAILS ONLY (no physical, no digital version of the letter — there is deliberately no digital twin); shipping fields saved to founders row via webhook. Build order: add nullable shipping_* columns + wants_physical_mail boolean (default true) to founders table FIRST, then wire checkout + webhook together. Resume phrase: "let's finish up the mailing address tidbit."

- [ ] **TEST DATA CLEANUP.** The live founders table and seeder_referrals contain test rows from Jun 23 one-time gift testing (refunded in Stripe, but the DB rows remain). Clean these before real contributors arrive so the first real founder isn't mis-numbered.

- [ ] **Step-down mechanic ($18/$28/$42 → $12 base after 12 months).** The $12 Stripe Price exists but is not wired. The step-down line on the page is display copy only. Needs: Stripe Subscription Schedule (two-phase: foundation-year price for 12 months, then $12 base indefinitely) set at checkout time. See implementation plan in earlier session recon.

## From the June 10 session

- [ ] **Steward claims awaiting click — Rebekah (Takubeh) and Jill (Asana Yoga).** Both have fresh 72h verification links in their inboxes (sent Jun 10 via /api/steward/reverify). Status is still `pending` until they click. This will be the first successful end-to-end steward claim on the platform.

- [ ] **Rebekah duplicate stewardship_claims row.** She has two pending rows: original (2026-05-27) and a duplicate (2026-06-03, declaration_text NULL, same email). After she successfully verifies, delete the stale leftover row — keep the verified one, delete the unverified duplicate.

- [ ] **Mobile drawer peek height tuning.** PEEK_HEIGHT=210px is a first-pass value based on layout math. May want a small nudge after more real-phone feel. Not urgent.

- [ ] **Mobile keyboard tap-to-dismiss: verify pin taps still work.** The tap-to-blur onClick handler is on the map wrapper div (fires before Mapbox's internal handlers). Should not swallow pin taps — but confirm on a real phone when convenient.

- [ ] **Claude Code auto-update failing.** "Auto-update failed" errors and tool freezes during this session. Run `npm i -g @anthropic-ai/claude-code` to update before next heavy session.

## Search match quality

- [ ] **County search under-matches — matching logic needs improvement.** Observed on the live map: searching "thrift" does not return all thrift-related listings, and "thrift clothing" returned zero stores that do carry clothing. This is SEPARATE from the pins-mirroring fix shipped June 10 (pins now faithfully mirror whatever the list returns — but if the list under-matches, the pins faithfully mirror a too-short list). The open work is the MATCHING logic itself: how `directHits` / `relatedNearby` in `MapPageClient.tsx` decide what counts as a match against the search term and the synonyms cache (`buildHaystack` + `searchTerm.includes` + `synonymsCache`). Likely needs: (1) review of synonym vocabulary/coverage in the `synonym_groups` table, (2) partial/multi-word matching (e.g. "thrift clothing" should match listings that contain "thrift" OR "clothing", not only the exact substring), (3) possibly category-aware matching so searching a category term surfaces all listings in that category. Deferred deliberately; revisit as its own focused session.

## From the June 2 session

- [x] ~~**Founder pipeline never fired in production.**~~ Verified Jun 23 — live test-card checkout confirmed end-to-end: founders row written, welcome/confirmation email delivered, internal notification to founder@canarycommons.org delivered. Both subscription and one-time paths verified.

- [x] ~~**Mobile map renders as a dropdown list instead of an actual map on phones — HIGHEST PRIORITY.**~~ Fixed Jun 9 — mobile is now map-first with floating bar + bottom drawer. The old browse/map two-panel swap is retired.

- [ ] **Seeder Email 1 reframe (designed, not yet built).** Simplify to one doorway: "you've been noticed, here you are" pointing at the live listing on the map. Steward claim becomes the natural path from the listing card itself. Remove link stays but moves to fine print. Requires the public listing card to have a steward path first (see next item).

- [ ] **Public listing card has no steward path and no easy remove door.** Currently offers only "Suggest an edit" and "Flag this listing." Before the Email 1 reframe can hand off to the listing card, it needs a visible claim/steward entry point and a plain remove option. Design and build before Email 1 reframe.

- [ ] **Reverify rate-limit: soften to once per hour.** Current reverify endpoint rejects if the current token hasn't expired, meaning a steward who loses the second email is locked out for the full 72h window. Soften to allow one re-issue per hour. Code comment in app/api/steward/reverify/route.ts marks the spot.

## From the May 26 normalization pass

- [ ] Watch for any edge cases the new database trigger surfaces. The trigger normalizes city/state/county on every INSERT/UPDATE. If anything ever fails to insert with a normalization-related error message, the trigger is the place to look. Migration file: supabase/migrations/20260526_extend_normalize_listing_fields.sql.

- [ ] If state abbreviations ever start appearing in the data as "Or" or "Ca" (visibly wrong Title-Cased two-letter forms), it means someone wrote a state abbreviation directly to the database via Supabase Studio or manual SQL, bypassing the JS utility. The trigger intentionally does not expand abbreviations. Manual correction is the fix, and it's a signal that someone needs the canonical format documented somewhere visible.

- [ ] The scripts/backfill-normalization.ts file remains in the repo as a re-runnable cleanup tool. It's idempotent — dry-run shows zero changes when data is canonical. Safe to leave; remove only if it becomes confusing as a historical artifact.

## Supabase platform changes

- [ ] **Supabase Data API explicit grants — deadline Oct 30, 2026.** Supabase is changing the default behavior so that tables in the `public` schema will no longer be exposed to the Data API (supabase-js, PostgREST, /rest/v1/, /graphql/v1/) without explicit GRANT statements. Effective May 30, 2026 for new projects; Oct 30, 2026 for all existing projects including ours. Existing tables keep their current grants and will continue working — this is forward-looking only.

  **What needs to happen before Oct 30, 2026:**

  1. Update the migration template pattern so every new table-creation migration includes explicit GRANT statements for anon, authenticated, and service_role (per Supabase's documented pattern). Also include ALTER TABLE ... ENABLE ROW LEVEL SECURITY and any needed RLS policies.

  2. Run the Security Advisor in the Supabase dashboard once to audit the current grants posture on existing tables — confirm no surprises.

  3. Be aware: existing migrations create tables without explicit grants. If the project ever needs to be rebuilt from migrations (recovery, fresh environment, staging clone) in a context where the new default applies, those tables will not be exposed to the Data API. Not a fix-today item, but worth knowing as a future fragility.

  **Pattern for new migrations** (per Supabase docs):

  ```sql
  grant select on public.your_table to anon;
  grant select, insert, update, delete on public.your_table to authenticated;
  grant select, insert, update, delete on public.your_table to service_role;
  alter table public.your_table enable row level security;
  -- plus RLS policies as appropriate
  ```

  PostgREST returns a "42501" error with the exact GRANT statement if a grant is missing — so failures will be diagnostic rather than silent.
