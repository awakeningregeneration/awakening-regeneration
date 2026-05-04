# Canary Commons — Project State

*Living state of the work. Updated at the end of each session.*

*For architectural reference (stack, routes, components, schema), see PROJECT_MAP.md.*

*Last updated: May 3, 2026*

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
- Stage D.5: seeder welcome email — fires when a seeder row is created. Welcomes them by name, includes their dashboard link (canarycommons.org/[handle]) and their direct invitation link (canarycommons.org/[handle]/join) with brief explanation of each. Email template at app/lib/emails/seederWelcome.ts. Trigger mechanism TBD (database trigger calling Resend, or manual send via admin action — decide at Stage D.5 design time).
- Stage E: cross-seeder view at /[handle]/map-view
- Stage F-prep ✓ COMPLETE: shared email header (logo across all user-facing templates), steward claim confirmation email, outreach_status transition to 'claimed' wired into both stewardship paths (domain-match auto-approve in verify route + grace-period activation in promoteIfGraceExpired). Both paths fully wired — no Step 6 cron prerequisite.
- Stage F: outreach cadence — scheduled function for emails 2 and 3, bounce handling
- Stage G: removal flows — token-based soft removal, steward hard removal with reason

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

- **Session opens**: Claude reads PROJECT_STATE.md and RELEASE_CHECKLIST.md to ground in current state. PROJECT_MAP.md is consulted as needed for architectural reference.
- **Session closes**: Claude writes a Claude Code prompt that updates PROJECT_STATE.md (and RELEASE_CHECKLIST.md if launch-gate items moved)
- **Strategy in chat, execution in Claude Code (VS Code terminal)** — Claude writes targeted prompts, Ren pastes and reviews
- **Never git commit/push without Ren's explicit instruction**
- **Security rail**: warn before any action that could reveal secrets (API keys, service role keys, webhook secrets, .env contents)
