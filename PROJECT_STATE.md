# Canary Commons — Project State

*Living state of the work. Updated at the end of each session.*

*For architectural reference (stack, routes, components, schema), see PROJECT_MAP.md.*

*Last updated: May 23, 2026 (end of day)*

---

## System Overview (at a glance)

Canary Commons is a living map of regenerative, life-supporting efforts across the U.S. Built on Next.js, moving toward PWA status. Operates under Awakening Regeneration LLC.

### Surfaces
- **Map** — place-based listings, what's alive near you or where you're going
- **Constellation** — stories and inspiration layer
- **Online Resources** — affiliate / non-local / web-based offerings
- **Founders** — monetary support flow ($9 / $18 / $27 monthly + custom one-time)
- **Home** — landing and return

### Global Navigation
- **North Star nav** (built Apr 24) — top-right fixed, luminous glass dome with 8-point bi-tonal gold compass rose inside. Hover/tap opens dropdown to all surfaces.

### Database (23 tables)
- **Listings & moderation**: listings, listing_edits, listing_flags
- **Founders & Seeders**: founders, seeders, seeder_referrals
- **Stewardship**: stewards, steward_edit_sessions, stewardship_claims, stewardship_disputes, affiliate_stewards
- **Content & Story**: stories, constellation
- **Resources**: resources, support_resources, affiliate_resources, affiliate_partners
- **Feedback loop**: unmet_needs (captures failed searches — "tell us what you're looking for")
- **Search & synonyms**: search_logs, synonym_groups (39 seeded groups), synonym_candidates
- **Seeder system**: seeder_listing_credits, seeder_login_tokens (+ extensions to seeders and listings tables)

---

## Done (recent)

- **May 23** — Major session: bulk placement tooling + retroactive Email 1 + no-public-email workflow. Bulk placement tool built at /[handle]/place/bulk (commits 7de91c9, 52cdce5, 0c873d4): paste JSON array of listings, parse into editable review cards with category/practice toggle pills, place one at a time through existing /api/seeder/place-listing pipeline. BULK_PLACEMENT_JSON.md added as canonical JSON reference and to session-open reads. "Place a batch" button added to seeder dashboard. "Place another batch" return loop on batch completion screen. Retroactive Email 1 trigger built (commit 8367dae): extracted sendEmail1 shared utility from place-listing, new /api/seeder/trigger-email-1 endpoint, "Send Email 1 now" button on dashboard for eligible listings. Three Klamath Falls listings (Rare Bird, Asana Yoga, Klamath Grown) successfully sent Email 1 retroactively. Source-mismatch root cause identified: map sidebar "Add a Point of Light" links to /submit not /[handle]/place — decision: not fixing in code, Lucia redirected to use dashboard. No-public-email workflow built but NOT YET COMMITTED: checkbox on bulk cards, copyable Email 1 letter, "Contact form only" badge on dashboard, migration file at supabase/migrations/20260523_listings_no_public_email.sql. Needs migration + push + testing per LOOSE_ENDS.md.
- **May 21** — Multi-category support shipped (commit 4462289). listings.category, affiliate_resources.category, and constellation.category converted from TEXT to TEXT[] with ARRAY backfill. Migrations applied to production Supabase, code pushed and live. Listings and affiliate resources capped at 5 categories; constellation capped at 3. All API write paths updated (6 handlers). All forms converted to multi-select toggle pills. Display updated across map popups, cross-seeder view, support cards, contributor cards, constellation detail. Filters use "matches any" semantics. Search haystacks spread category arrays. Pre-existing data quality issue discovered: some listings have non-standard category values (e.g., "Land & Food", "Regenerative Food") that predate the validation system — these were in the database before the migration and are unchanged by it.
- **May 18** — Email rewrite intent captured but not executed. See GROWTH_LIST.md for full direction. The strategic gap to name: it is hard to find small places doing great things, and Canary Commons fills that gap for both sides.
- **May 18** — Ashland steward email backfill. Email 1 sent to 14 Ashland, OR listings that pre-dated full seeder outreach attachment. One-time script at scripts/backfill-email1.ts. Manual outreach (contact form) logged for Hummingbird Heart. Deja Vu Fashion Consignment left as quiet light (no public email available). Greenleaf Juicing Co. deleted (not actually in Ashland). Dobrá Tea naming caught — note the accented á for future queries. 14 listings now flowing through the standard 3-email cadence. Source-mismatch issue discovered and manually corrected: listings placed after the seeder system was set up were getting source='community_submitted' instead of 'seeder_placed'. Root cause identified May 23: map sidebar "Add a Point of Light" link points to /submit (public form) rather than seeder placement form, so seeders clicking that button bypass source tagging. Decision: not fixing in code — affected population is just Ren and Lucia, Lucia has been redirected to use the dashboard placement form.
- **May 15** — Affiliate transparency layer reshaped + compass caption. Retired the /resource/[slug] interstitial page approach; route reverted to a clean 302 redirect (no page render). Teaching about affiliates now lives at /support as a floating overlay: blurred backdrop, gold-bordered bubble (65% opacity border for visibility), single breathing light, two paragraphs of copy with ✦ ✦ trail marker at the start of the ad-blocker paragraph and "Small things added together make real differences" lifted to its own centered italic line. Cookie cc_support_intro_acknowledged (90 days, conditional Secure flag) gates the overlay. First visit shows overlay; dismiss via × or backdrop click or ESC sets cookie. Subsequent visits show a quiet gratitude line ("CC is supported by this curated list. Thank you.") with soft gold underline as interactivity affordance — clicking re-opens overlay without modifying cookie. /support page split into Server Component wrapper (reads cookie) + SupportPageClient.tsx + SupportIntroOverlay.tsx. Heading and subhead centered. North Star nav now has a compass caption bubble (app/components/CompassCaption.tsx): speech-bubble with upward notch pointing at compass, gold border, copy "A way of moving through this — or to wander." Two behaviors: homepage (/) shows 1.5s after load on first visit, lingers 15s, fades, cookie cc_compass_seen sets on fade-out; About (/about) is permanent but fades when nav dropdown opens. Compass sway animation (±2° over 10s) was considered and rejected — too subtle at actual size, bubble does the wayfinding. Hydration pattern established: use "mounted" flag for Client Components with useEffect-driven visibility; make cookie Secure flag conditional on HTTPS to prevent dev/production divergence.
- **May 14** — Clearing session + steward email refinement (pushed in commit 18eebb8). Two items cleared from LOOSE_ENDS: (1) Added BEFORE UPDATE trigger on synonym_groups (set_synonym_groups_updated_at) so updated_at auto-bumps on any UPDATE path including direct Supabase Studio edits. Migration applied to production. File saved at supabase/migrations/add_synonym_groups_updated_at_trigger.sql. (2) SUPABASE_PROJECT_REF in netlify/functions/synonym-digest.mts now reads from env var with fallback to hardcoded value. Netlify env var still to be added by Ren. Steward claim confirmation email expanded: orientation paragraph added between the existing "step away" paragraph and closing ornament — names CC as a living map of regenerative work, names the foundational-year sustaining context, and offers two parallel doorways to canarycommons.org/about and canarycommons.org/founders. File: app/lib/emails/stewardClaimConfirmation.ts.
- **May 13** — Affiliate redirect layer built (pushed in commit 18eebb8). /resource/[slug] route handler with no-cache headers ensures Awin tracking fires on every click. Three emit sites updated (support page, contributor dashboard, map sidebar) to route through redirect instead of direct affiliate_url. Database migration ran in production (slug column added to affiliate_resources with auto-generation trigger, collision handling, backfill of all existing rows, NOT NULL + UNIQUE constraints, index). Migration file saved at supabase/migrations/add_affiliate_resources_slug.sql. Founder notification email also built — new template at app/lib/emails/notifyFounderJoined.ts and wired into the Stripe webhook handler. Fires to founder@canarycommons.org after each successful founder signup, independent try/catch from the welcome email. Plain functional tone for quick scanning.
- **May 12** — Seeder edit path + steward gate fix (commit 5060a5b): seeders can now directly edit listings they placed via /edit/[id] (new seeder_edit mode). New API routes: /api/seeder/check-edit (validates seeder session + placed_by_seeder_id match) and /api/seeder/save-listing (server-side field allow-list, rejects system/stewardship fields). Steward existence check corrected system-wide: edit page now gates on steward_id (verified steward) instead of steward_email (outreach contact), fixing a bug where any listing with an outreach email incorrectly showed "this listing has a steward." Dashboard yields to claimed listings: placements with steward_id set render at 0.6 opacity with italic caption "Listing claimed by steward, no longer needs tending", no click navigation, no hover. Seeder edit access also revoked via check-edit when steward_id is set — once a business claims, tending shifts to the steward. Still counts in placement totals.
- **May 12** — /contributor/submit rebuilt (commit 19b0e34): personalized greeting for Lucia, inline listing of her existing Online Resource submissions with edit and delete, submit form for new entries below. Edit and delete go live immediately — no review queue, matching the Online Resources trust model (Lucia is trusted to publish and revise directly). New API handlers: PATCH /api/affiliates (update by id) and DELETE /api/affiliates (by query param id). Error feedback added: fetchResources, handleSave, and handleDelete show "Something went wrong — please refresh." flash on failure (4s) instead of silent failure.
- **May 5** — Founder flow audit (evening): golden path confirmed working end-to-end (/founders → Stripe checkout → founders row → welcome email → confirmation → seeder_referrals with 25% payout). Three gaps identified: (1) founder email rhythm not built (templates + scheduler), (2) listing-to-founder attribution not wired (Phase 4), (3) payout processing not built (Phase 5). Next work: Ren drafts Email 1 (Inspiration + Direction) and Email 2 (Participation + Reflection) in ChatGPT, then brings back to wire templates + Netlify scheduled function.
- **May 5** — Stage G shipped (commit 456c45a): removal flows + universal block enforcement. Soft removal at /listings/[id]/remove (token-authenticated two-step UX, sets do_not_list_level='seeder_only'). Hard removal in steward edit flow (reason selector, sets do_not_list_level='universal' with reason, per-listing session auth). Universal block enforcement in /api/listings POST — polite UNIVERSALLY_BLOCKED error with mailto link, respects do_not_list_override. New do_not_list_level TEXT column on listings with CHECK constraint. Migration applied to production. Also includes webhook cleanup: temporary diagnostic endpoint deleted, temporary logging removed.
- **May 5** — Webhook signature verification fixed (commit 30736ed, cleanup in 456c45a). Bug: route was reading "webhook-*" headers but Resend sends "svix-*" prefixed headers. Fix: read svix-* first with webhook-* fallback. email.delivered events now returning 200. Diagnostic endpoint and temporary logging both removed.
- **May 5** — Stage D.6 fully operational: both Lucia and Ren successfully onboarded via admin UI at /ren/admin. Welcome emails delivered end-to-end.
- **May 5** — Stage D.6 complete: admin UI for seeder onboarding at /[handle]/admin. Three-gate auth (session + handle match + admin email match against ADMIN_SEEDER_EMAIL), returns 404 on any failure. Creation form (name, email, handle) creates row + sends welcome email in one action via session-authed wrapper endpoints. Seeder list with placement counts, per-row resend welcome button (force=true, auto-clears "Sent!" after 5s). Morning-sky aesthetic. Shared logic at app/lib/adminSeederActions.ts (createSeeder + sendWelcome). Bearer-token endpoints preserved for curl use. No secrets cross to the browser.
- **May 5** — Stage D.6 backend shipped (pieces 1-4, commit aebe662): shared logic extraction at app/lib/adminSeederActions.ts (createSeeder + sendWelcome with force flag). Bearer-token endpoints refactored to thin wrappers. Session-authed wrapper endpoints at /api/admin/wrapper/create and /wrapper/welcome implement three-gate auth (session + seeder lookup + admin email match against ADMIN_SEEDER_EMAIL env var), returning notFound() on any failure for privacy. Page (piece 5) and Client (piece 6) pending next session.
- **May 5** — Stage E.1 complete: cross-seeder map view welcome copy added. Redesigned mid-implementation. Original plan was to swap dropdowns to static dataset; reframed to keep dynamic derivation and add welcome copy that makes "showing only worked territory" an intentional design choice. Copy: "You'll see only the states and counties where seeders are currently working. If the place you're thinking of isn't here yet, consider it an invitation."
- **May 4** — Ren seeder row created in production Supabase (url_handle='ren', active=true). Magic-link login flow tested end-to-end: Resend logs show 200 success, email arrived in Proton All Mail folder. Cross-seeder view confirmed loading at /ren/map-view, dashboard link confirmed, page renders correctly.
- **May 4** — Stage E shipped (commit 3ca24de): cross-seeder map view at /[handle]/map-view. Alphabetical listing list with category, address, seeder name, date, and status badge. Privacy boundary enforced — seeder names visible for coordination, steward emails never exposed. Empty state links to placement form. Dashboard link added in utility shelf. Shipped after Stage F because F was time-sensitive (outreach cadence blocked onboarding); E is a coordination tool that didn't block the pipeline. **Known bug: state/county dropdowns use dynamic derivation from listings, rendering empty with zero placements — see Stage E.1 in build plan and LOOSE_ENDS.md.**
- **May 4** — Stage F shipped (commit 13e305e): outreach cadence with daily cron (6am Pacific) firing Email 2 at 7 days and Email 3 at 14 days after previous email. Email templates lifted from orientation modal previews. Resend webhook route for bounce/complaint handling with svix signature verification. Dashboard bounce info inline panel with humanized bounce reasons. bounce_info TEXT column added to listings. Throttled at 50 emails per type per cron run. Deployed to production: bounce_info migration applied, Resend webhook registered (email.bounced/complained/delivered/opened/clicked), RESEND_WEBHOOK_SECRET set in .env.local and Netlify.
- **May 4** — Stage D.5 complete: seeder welcome email template (seederWelcome.ts) with dashboard CTA and direct invitation link. Manual admin endpoint (POST /api/admin/seeders/welcome) with Bearer ADMIN_SECRET auth, duplicate guard via welcomed_at, send-before-mark pattern. Migration: welcomed_at TIMESTAMPTZ added to seeders table.
- **May 3** — Stage F-prep complete: shared email header helper (centered 80px logo across all user-facing templates), steward claim confirmation email ("You've claimed [Business Name]") firing on both domain-match auto-approve and grace-period activation, outreach_status transition to 'claimed' wired into both stewardship paths. No Step 6 cron prerequisite — promoteIfGraceExpired handles the grace path inline.
- **May 3** — Stage D complete: real seeder dashboard at /[handle] replacing Phase 1 stub. Morning-sky aesthetic at 820px, centered "Place a new light" CTA, placements list with 9 status badge states (forward-compatible for Stage G soft opt-out), status summary (placed/in outreach/claimed), recognition credits panel placeholder, copy-on-click direct invitation link in utility register, "Revisit orientation" footer. OPT_OUT_LAYERS.md canonical reference doc added to repo.
- **May 3** — Stage C complete: placement form at /[handle]/place with morning-sky aesthetic, three-view flow (form/override/success), 8-field form (business name, description, category, practice pills, city+state, address, website, steward email), do_not_list override with database integrity (original opt-out preserved, new placement attributed with do_not_list_override flag), Email 1 fires through Resend on placement when steward_email provided
- **May 3** — Placement API: POST /api/seeder/place-listing with server-side validation, do_not_list check via normalized name matching (same algorithm as DB trigger), Mapbox geocoding with auto-county extraction from response context, removal token generation, Email 1 send
- **May 3** — Email 1 template: app/lib/emails/seederOutreach1Recognition.ts — Recognition + Claim email with three gold-pill CTAs (Claim/View Listing, Help Carry the Commons, Remove Listing) and triple ornaments. Tested end-to-end through Resend.
- **May 3** — Schema: do_not_list_override boolean column added to listings (default false, set true on conscious override)
- **May 2** — Stage B complete: orientation page at /[handle]/start with morning-sky aesthetic, ReactMarkdown rendering with custom typography, three accessible email modals (Recognition, Visibility, Stewardship) with full outreach copy, copy-on-click direct invitation link, completion gate (must open all three emails + check box), dashboard orientation redirect, /[handle]/join clean referral URL redirect. Dependencies: react-markdown 10.1.0, remark-gfm 4.0.1
- **May 2** — Stage A complete: do_not_list consent schema (do_not_list, do_not_list_reason, do_not_list_at, normalized_name, normalized_address) with normalize_listing_fields() trigger and backfill; NEXT_PUBLIC_SITE_URL env var replaces hardcoded URLs in 4 email templates; verifyPayload refactored into shared seederAuth.ts (verifySeederCookie + getSeederSessionFromCookieValue)
- **May 2** — SEEDER_ORIENTATION_DRAFT.md revised with dual-paths reframing: direct invitation + listing placement treated as equal seeder work paths; Foundation Builders introduction; /[handle]/join direct invitation link section added
- **Apr 30** — Seeder system Phase 1 complete: schema additions to listings (source, placed_by_seeder_id, outreach_status, outreach_started_at, last_outreach_at, removal_token) and seeders (url_handle, bio, phone, orientation_completed_at); new tables seeder_listing_credits and seeder_login_tokens; RLS enabled on seeders, seeder_listing_credits, seeder_login_tokens
- **Apr 30** — Seeder magic-link auth: POST /api/seeder/login-request sends 30-min token via Resend; GET /api/seeder/auth validates token, sets HMAC-signed 30-day session cookie (cc_seeder_session); reuses stewardshipTokens.ts for token generation; new SEEDER_SESSION_SECRET env var
- **Apr 30** — Seeder URL routing: app/[handle]/layout.tsx validates handle exists (404 if not); app/[handle]/login/page.tsx public login form; app/[handle]/page.tsx auth-gated dashboard stub; Next.js matches specific routes before [handle] so existing routes unaffected
- **Apr 30** — Handle validation: app/lib/reservedHandles.ts with format checks (lowercase alphanumeric + hyphens, 2-30 chars) and DB uniqueness; blocks all existing top-level routes + common reserved words
- **Apr 30** — Lucia backfilled with url_handle = 'lucia'; login flow tested end-to-end
- **Apr 28** — County-level search built: search input on sidebar filters listings into Direct Hits (substring), Related Nearby (synonym-expanded), and Online Resources (affiliate match). Empty state with "Add a Point of Light" CTA. Search clears on county change.
- **Apr 28** — Synonym feedback loop: search_logs table records every county search; synonym_groups table (39 seeded groups, 27 practices + 12 categories); synonym_candidates table with trigger automation (approve → creates new group, grouped → appends to existing group, rejected → no-op); Netlify scheduled function runs monthly digest, emails Ren with Supabase Studio deep link to review candidates
- **Apr 28** — Server-side synonym API (GET /api/synonyms?term=xxx) with 1-hour cached DB lookup; search-log API (POST /api/search-log) for fire-and-forget logging; synonymDigest email template
- **Apr 28** — Bug fix: searchSynonyms.ts was importing supabaseAdmin (service role) but being dynamically imported on the client where the key is undefined; moved to server-side API route
- **Apr 28** — LOOSE_ENDS.md created (8 tracked deferred items)
- **Apr 27** — Map pin rendering refactored from DOM markers (mapboxgl.Marker) to GeoJSON source + Mapbox circle layers. Pins now scale with zoom (tiny at country level, full glow at county level). Pulse animation reimplemented via requestAnimationFrame. Selected pin highlights via filter-based duplicate layers with warmer gold. Invisible hit-area layer ensures clicks register across the full light footprint.
- **Apr 27** — Pin clicks now update county/state bar and URL (handlePinSelect wrapped in useCallback for stable reference; GeoJSON source race condition fixed with mapLoadedRef + map.once("load") fallback)
- **Apr 27** — Popup repositioned to fixed upper-right at all viewports; custom gold close button (×) in upper-left replaces Mapbox built-in; overflow fix so close button isn't clipped by border-radius
- **Apr 27** — Map area background set to #08192d; ResizeObserver + visible prop trigger map.resize() on mobile view transitions (addresses black-screen issue)
- **Apr 25** — Listings taxonomy expansion: 7 new practices added (Trauma-Informed, Restorative, Somatic, Nonviolent, Peer Supported, Community Led, Justice-Oriented) across all 4 submit forms — total now 27
- **Apr 25** — Category rename: "Communication & Conflict Transformation" → "Conflict Transformation & Repair" across all forms, display filter, and database rows (direct SQL UPDATE in Supabase)
- **Apr 25** — Online Resources naming sweep: user-facing copy on /support and /support/submit unified to "Online Resources"; type SupportResource → OnlineResource; dead type files deleted; NAMING_MAP.md created as canonical alias reference
- **Apr 25** — County-level sidebar: restored 4 action buttons (About, Add a Point of Light, Explore Online Resources, The Constellation); removed redundant "Can't Find It Nearby?" card; underlined "See and Share Local Stories"; renamed "Explore Support Resources" → "Explore Online Resources"
- **Apr 25** — Ghost tables (support_resources, affiliate_partners) confirmed empty and unused by code; held in observation mode pending real data flow
- **Apr 24 (afternoon)** — PROJECT_STATE.md and PROJECT_MAP.md working pattern established (session opens by reading both files, closes with an update prompt)
- **Apr 24 (afternoon)** — Homepage cover map mobile fix: widened light spread (10%–87%), added mobile-specific dimming of center lights and boosting of edge lights (useIsMobile hook, debounced resize listener), added mobile text-shadow in globals.css for readability
- **Apr 24 (afternoon)** — Map page listing popup on mobile: repositioned to upper-right via CSS override, narrower width, tap-outside closes (existing X also works)
- **Apr 24 (afternoon)** — Map page sidebar cleanup: removed redundant state/county headings and count lines across all three conditional branches; kept "Pan around the state..." instruction
- **Apr 24 (afternoon)** — Map page "Not seeing it yet?" block restructured: removed the heading, added breathing room, all four items now consistent buttons (About Canary Commons, Add a Point of Light, Explore Support Resources, The Constellation / A World of Inspiration)
- **Apr 24 (afternoon)** — Constellation naming cohesion: floating pill removed; new inline button with two-line gold treatment ("The Constellation" primary / "A World of Inspiration" subtitle); North Star nav label updated to "The Constellation"
- **Apr 24 (afternoon)** — Button atmospheric treatments added: dawn wash (About), glow point (Add a Point of Light), bottom warmth (Explore Support Resources), star field (The Constellation)
- **Apr 24 (afternoon)** — Listing popup text alignment: headings and CTAs center-aligned with Title Case ("Can't Find It Nearby?", "Explore Aligned Options →", "View on Map →"); listing facts (name, location) stay left-aligned
- **Apr 24 (afternoon)** — Three hydration errors diagnosed and resolved: (1) inline <style> in page.tsx moved to globals.css, (2) mobile popup CSS handled via globals, (3) stale constellation-float CSS + .next build cache cleared
- **Apr 24** — North Star navigation built (glass dome + compass rose, top-right, dropdown to all surfaces)
- **Apr 24** — "Become the Foundation." CTA text corrected on /founders/join
- **Apr 24** — Stripe founders flow confirmed end-to-end and functional
- **Apr 24** — Both stewardship SQL migrations confirmed run (all stewardship tables exist, currently empty)
- **Apr 23** — Map tint method locked: setPaintProperty() in ThresholdMap.tsx
- **Apr 18** — Stewardship Steps 1–5 built locally; Step 3 tested live (verification email received)
- **Apr** — All major pages rebuilt with two registers: deep sky for browsing, morning sky for forms
- **Apr** — Seeder/Founder model locked: single-layer, 25% recurring (12-mo max) / 15% one-time
- **Apr** — Email templates scaffolded at app/lib/emails/ (welcomeFounder.ts first)

---

## Synonym candidate review workflow

Monthly cycle, automated end-to-end:

1. **Search logging** — every county-level search fires a POST to `/api/search-log` with term, county, state, and hit counts. Stored in `search_logs` table.
2. **Monthly digest** — Netlify scheduled function (`netlify/functions/synonym-digest.mts`) runs 1st of each month at 8am Pacific. Aggregates the previous month's search_logs, identifies candidates (3+ searches with avg ≤1 direct hit, OR 5+ searches not in any synonym group), inserts into `synonym_candidates`, emails Ren via Resend.
3. **Email** — from `synonyms@canarycommons.org`, contains candidate count, table of terms with occurrence counts and suggested groups, and a "Review Candidates" button linking to Supabase Studio filtered to `status = pending`.
4. **Review in Supabase Studio** — Ren opens the deep link, sees pending candidates. For each row, changes `status` to:
   - `approved` (no `suggested_group_id`) → trigger creates a new `synonym_groups` row with `terms = [search_term]`
   - `grouped` (set `suggested_group_id` first) → trigger appends `search_term` to that group's `terms` array
   - `rejected` → no synonym_groups change
   - All transitions auto-set `decided_at = now()`
5. **Live** — `getSynonyms` reads from `synonym_groups` with 1-hour cache. New synonyms are available to users within an hour of approval.

---

## Seeder system — phased build plan

**Phase 1 — Foundation** ✓ COMPLETE (Apr 30)
Schema additions, magic-link auth, /[handle]/ routing, dashboard stub.

**Phase 2+3 — Combined: Seeder surfaces + outreach cadence**
- Stage A ✓ COMPLETE (May 2): consent schema (do_not_list fields, normalized fields, normalization trigger), base URL env var extraction, verifyPayload refactor
- Stage B ✓ COMPLETE (May 2): orientation page with morning-sky aesthetic and email modals, completion gate, /[handle]/join redirect, dashboard orientation gating
- Stage C ✓ COMPLETE (May 3): placement form with do_not_list override flow, Email 1 fires on placement, auto-county geocoding, removal token generation
- Stage D ✓ COMPLETE (May 3): real dashboard with placements list replacing stub
- Stage D.5 ✓ COMPLETE (May 4): seeder welcome email via manual admin endpoint. Ren fires POST /api/admin/seeders/welcome with Bearer auth when ready to onboard. Template at app/lib/emails/seederWelcome.ts. welcomed_at column tracks delivery.
- Stage E ✓ COMPLETE (May 4): cross-seeder map view at /[handle]/map-view — coordination tool for distributed seeders. Shipped after Stage F (F was time-sensitive due to outreach cadence; E is a coordination tool that didn't block onboarding).
- Stage E.1 ✓ COMPLETE (May 5): welcome copy on cross-seeder map view. Kept dynamic derivation — empty dropdowns reframed as intentional (only shows worked territory).
- Stage D.6 ✓ COMPLETE (May 5): admin UI for seeder onboarding at /[handle]/admin. Create-with-welcome form, seeder list with placement counts, per-row resend welcome. Three-gate auth, session-authed wrapper endpoints, no secrets in browser.
- Stage F-prep ✓ COMPLETE: shared email header (logo across all user-facing templates), steward claim confirmation email, outreach_status transition to 'claimed' wired into both stewardship paths (domain-match auto-approve in verify route + grace-period activation in promoteIfGraceExpired). Both paths fully wired — no Step 6 cron prerequisite.
- Stage F ✓ COMPLETE (May 4): outreach cadence — daily cron for emails 2 and 3, Resend webhook for bounce/complaint handling, dashboard bounce info panel
- Stage G ✓ COMPLETE (May 5): removal flows — token-based soft removal (do_not_list_level='seeder_only'), steward hard removal with reason (do_not_list_level='universal'), universal block enforcement in public submit path. Phase 2+3 complete.

**Phase 4 — Attribution + Founder credit (future)**
Stripe webhook extension, "thank the seeder" gesture, seeder_listing_credits population.

**Phase 5 — Payout + reporting (future)**
Seeder payout tracking, admin reporting, seeder-facing earnings view.

---

## In Motion

- **Mobile pass partially complete** — Homepage cover map, map page listing popup, and sidebar all responsive. Remaining mobile work: bottom drawer ("lift two"), any other pages not yet tested on narrow viewports.

---

## Open

### Stewardship
- Step 6: grace-period auto-activation cron — not yet built
- Step 7: full dispute flow (notifications, resolution, admin review) — not yet built
- Steps 4 and 5 live-test verification — built but not yet live-tested
- Code-level audit of stewardship app-side: tables exist and are empty; need to confirm app code reads/writes to them correctly

### Seeder pathway
- First seeder assignment (Lucia handles manually for now) — someone is waiting
- Seeder relational entry arc design — how someone brought in by a seeder experiences arrival (orientation before ask, "invitation from [name]" warmth, pacing, where the Founders ask lives in flow). Bigger than /founders fix.
- QR code per seeder

### Content / service categories
- Trauma-Informed, Nonviolent, Restorative, Somatic, Justice-Oriented now exist as practices/values tags (added Apr 25). Deescalation not yet represented as a distinct tag — may not need one if covered by "Nonviolent" and "Restorative" in practice.

### Code hygiene
- Hydration error pattern: several SSR/CSR mismatches surfaced during Apr 24 work. Most resolved via moving inline <style> to globals.css or clearing stale build cache. Consider a future audit pass to convert remaining isMobile-driven inline style switches to CSS media queries where possible.
- Taxonomy arrays (practices + categories) are duplicated across 4 files rather than centralized. Intentionally held — the four layers (general listings, support/affiliate, contributor, constellation) may want to diverge as the platform's shape clarifies. Reconsider extraction (e.g. app/lib/taxonomy.ts) when layer-specific taxonomies stabilize.
- Ghost tables in Supabase (support_resources, affiliate_partners): confirmed empty and unused by code as of Apr 25. Held in observation mode — watch real data flow before deciding to drop.

### Polish
- Prose polish pass across the site
- Mobile bottom drawer ("lift two")

---

## Parked

*(items deferred, not active — add as they arise)*

---

## How we work

- **Session opens**: Claude reads PROJECT_STATE.md, LOOSE_ENDS.md, GROWTH_LIST.md, and BULK_PLACEMENT_JSON.md to ground in current state. PROJECT_MAP.md is consulted as needed for architectural reference. BULK_PLACEMENT_JSON.md is the canonical reference for the JSON shape the bulk placement tool at /[handle]/place/bulk expects.
- **Session closes**: Claude writes a Claude Code prompt that updates PROJECT_STATE.md (and RELEASE_CHECKLIST.md if launch-gate items moved)
- **Strategy in chat, execution in Claude Code (VS Code terminal)** — Claude writes targeted prompts, Ren pastes and reviews
- **Never git commit/push without Ren's explicit instruction**
- **Security rail**: warn before any action that could reveal secrets (API keys, service role keys, webhook secrets, .env contents)
