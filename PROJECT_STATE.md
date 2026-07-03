# Canary Commons — Project State

*Living state of the work. Updated at the end of each session.*

*For architectural reference (stack, routes, components, schema), see PROJECT_MAP.md.*

*Last updated: July 2, 2026*

---

## System Overview (at a glance)

Canary Commons is a living map of regenerative, life-supporting efforts across the U.S. Built on Next.js, moving toward PWA status. Operates under Awakening Regeneration LLC.

### Surfaces
- **Map** — place-based listings, what's alive near you or where you're going
- **Constellation** — stories and inspiration layer
- **Online Resources** — affiliate / non-local / web-based offerings
- **Founders** — monetary support flow ($18 / $28 / $42 monthly + custom one-time)
- **Home** — landing and return

### Global Navigation
- **North Star nav** (built Apr 24, reordered Jun 9) — top-right fixed, luminous glass dome with 8-point bi-tonal gold compass rose inside. Hover/tap opens dropdown. Current item order: About, Map, Story of Place (/stories), Online Resources, The Constellation, Founders. "Home" intentionally removed — the homepage is the orientation gateway; there is no back-out from the living surface by design.

### Two Skies (established Jun 9)
Canary Commons now operates in two visual registers:
- **Night sky** — orientation pages (Home, About, Constellation, Founder's Letter, Founders/Join). Deep navy (#08192d), gold (#FFD86B), pale text. The sky you arrive under.
- **Day sky** — the mobile map surface (the living layer). Light frosted fog, dark navy text (#0a2540), bronze accents (#6b4f00). The sky you live under.
- Desktop map retains the night-sky sidebar (unchanged). The day register is mobile-only.
- The install (home-screen PWA) is the threshold between orientation and living — dawn between the two skies. See MOBILE_MAP_PLAN.md for the full arrival philosophy.

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

- **Jul 2** — Front-of-site copy pass: homepage, About page, compass label, OG card, Story of Place.

  **Story of Place (app/stories/):** Full rebuild. Rose/thorn framing removed throughout — all "rose" / "roses" references replaced with "story" / "stories" in plain warm language. New entry-door flow: arriving at `/stories` with no place shows "STORY OF PLACE" as the centered heading, an invitation line, two definition paragraphs, and a state/county picker (reuses the same county data and normalization as the map page). Selecting a place updates the URL and fetches stories client-side. The "this place" fallback heading removed entirely. Text now floats over the night-sky constellation (card container removed from the header area, matching the About page's treatment); picker stays grounded in a subtle container. Page converted from a server component to a thin server wrapper (`page.tsx`) + client component (`StoriesPageClient.tsx`) to support interactive dropdowns. Submit/read loop verified: both paths use the same `normalizeState`/`normalizeCounty` from `app/lib/normalize.ts`, so stories stored under a normalized state+county pair are correctly retrieved by the same pair. Files created: `app/stories/StoriesPageClient.tsx`. Files modified: `app/stories/page.tsx`.

  **Homepage:** New hero copy: "A constellation of sustainable, life-supporting places and projects across North America and beyond." / "Diversity sustains us. What we give our attention to grows. Let's turn toward a brighter future together." Contribute button reads "Tend the Commons" with a brightened, tightened supporting line "Your Contribution Matters" clustered beneath it as a visual unit. OG card image text, meta description (metadata, OpenGraph, Twitter), and alt text all updated to match the new hero register. OPERATING.md added to the repo as the everyday operator's guide.

  **About page:** Full copy rewrite. New structure: heading "About", opening three paragraphs (attention as generative resource / redirection of gaze / visibility thesis), emphasized gold italic mission line ("Our mission is simple: make this life-supporting work more visible...") set apart with generous spacing as a resting point, "What the Commons offers" section (The Map, The Stories, Online Resources, The Greater Constellation), and "What does it mean to be life-supporting?" section. Old sections removed: "What this is" (4-layer description), "A map of direction", "The invitation", "What belongs here", "The canary", the three-line gold closing bookend, and the "All lights connected, we dawn brighter" top blessing.

  **Compass label:** Updated from "A way of moving through this — or to wander." to "Site Compass" (label) / "navigate, or wander." (quiet invitation). Box resized from fixed 240px to auto-width that hugs the text snugly. Show/hide behavior unchanged (timed on homepage, static-open on About).

- **Jun 23** — Founders/tending page restructure + repriced tiers + standalone one-time gift checkout.

  **Tier repricing:** $9/$18/$27 → $18/$28/$42 (foundation year). Old "Foundation Builder" / "Supporting" / "Sustaining" tier names removed; tiers display as bare dollar amounts. New Stripe Price objects created; Netlify env vars (STRIPE_PRICE_TIER_1/2/3) repointed. TIER_AMOUNTS in webhook updated so seeder payout math is correct. A $12 base Stripe Price also created, reserved for the future step-down mechanic (not yet wired). Old prices archived, not deleted. Committed fb86f59.

  **Tending page restructure:** app/founders/join/page.tsx rebuilt. Threshold entry frame replaces old headline ("Become the Foundation") + philosophy card + "What you receive" / "What you're asked" cards. "Tending the Commons" is now the centered gold top title (eyebrow removed). Three bare tiers with deselectable toggle. Step-down line displayed: "After twelve months, every subscription settles to a $12 base." (display copy only — mechanic not built). Unified "Tend the Commons" CTA button. Body copy brightened for readability; night-sky atmosphere preserved. Committed 44f8152.

  **Unified contribution flow:** Three working paths through a single button: (1) subscribe-only (tier selected, no one-time), (2) subscribe + one-time gift bundled as first-charge line item (tier selected + amount entered), (3) one-time-only (no tier, just a gift amount). Tier selection and one-time amount are independent — neither clears the other. Button disabled until a tier or valid one-time amount (>= $5) is present.

  **Standalone one-time gift checkout:** New `mode: "payment"` branch in app/api/checkout/route.ts (server-side $5 floor). Webhook fork in app/api/stripe/webhook/route.ts: `handleOneTimeGift` writes founders row (tier="gift", status="completed", no subscription ID), `linkSeederReferralOneTime` at 15% payout (vs 25% recurring for subscriptions). New email template app/lib/emails/oneTimeGiftConfirmation.ts ("Your first Notes from the Field is on its way"). Subscription checkout path left completely untouched. Confirmed end-to-end with a live $5 test card (since refunded): payment → webhook 200 → founders row written → one-time confirmation email delivered → internal notification to founder@canarycommons.org delivered. Committed 93125f6.

  **Bug fix during testing:** founders table had a NOT NULL constraint on the `why` column, blocking one-time inserts (email send is gated on successful insert, so both failed silently). Fixed via: `ALTER TABLE public.founders ALTER COLUMN why DROP NOT NULL`. The entire one-time loop worked after this.

  **Confirmation page fork:** app/founders/confirmation/page.tsx now branches on checkout mode. One-time gift givers see "Thank you. Your gift is received." + Notes from the Field body + quiet map link. Subscribers see the existing "You're in. This is already happening." screen unchanged. New read-only endpoint app/api/checkout/session/route.ts returns only the session mode (no customer data exposed).

  **Files created:** app/lib/emails/oneTimeGiftConfirmation.ts, app/api/checkout/session/route.ts. **Files modified:** app/api/checkout/route.ts (one-time payment branch added beside subscription path), app/api/stripe/webhook/route.ts (handleOneTimeGift + linkSeederReferralOneTime + mode fork), app/founders/join/page.tsx (full restructure), app/founders/confirmation/page.tsx (gift/subscription fork), app/lib/emails/notifyFounderJoined.ts (tier labels updated).

- **Jun 15** — Homepage restructure + OG card update (see separate entries below).

- **Jun 10** — Mobile map drawer polish + search-to-pins + keyboard fix + steward verification 404 fix.

  **Drawer listing count + empty-state highlight:** Added a listing-count line as the first child of the drawer header strip, above the bronze handle bar. Count reflects the currently filtered set (`mapListings.length`): "N listings" / "1 listing" / "Growing Commons — No Lights Mapped Yet" when empty. When count is 0, the "Add a Point of Light" action door gets a gold/bronze highlight (fill, border, glow) to draw the eye; "Online Resources" keeps its calm style. Highlight disappears when count > 0.

  **Search narrows map pins:** Wired the county search to also narrow the map pins. Previously, typing in the county search narrowed only the sidebar/drawer listing list (`directHits` + `relatedNearby`) while the map continued showing all `countyListings`. Fix: relocated `mapListings` memo below the search derivation and added a branch — when `hasCountySelection && isSearching`, `mapListings` resolves to `[...directHits, ...relatedNearby]` instead of full `countyListings`. MapClient already reacts to its `listings` prop, so pins and `fitBounds` update automatically. Applies to both mobile and desktop (intentional — per MOBILE_MAP_PLAN.md "Search → map decision"). No changes to MapClient.tsx.

  **Drawer peek height:** Increased visible peek height from 140px to 210px so the taller header (count line + handle bar + both action doors + a listing crest) all show at rest. Defined `PEEK_HEIGHT = 210` as a single constant used in the resting transform AND both touch-handler clamps.

  **Mobile keyboard handling:** Fixed a real bug where focusing the county search input on iOS opened the keyboard, trapping the user — the bottom-anchored drawer was hidden behind the keyboard with no way to dismiss or reach it. Root cause: `<main>` was `height: 100vh`, which does not shrink when the iOS keyboard opens. Fix: (1) Changed to `100dvh` (dynamic viewport height, iOS 15.4+/~97% of iPhones) so the container tracks the visual viewport. (2) Added `onKeyDown` blur-on-Enter to dismiss the keyboard (search filters live, so Enter = done typing). (3) Added `inputMode="search"` so the iOS keyboard shows a "Search" key. (4) Added tap-map-to-dismiss: `onClick` on the map wrapper div blurs the active element. The blur handler fires before Mapbox's internal click handlers and does not interfere with pin taps, pan, or zoom.

  **Steward verification 404 — root cause found and fixed (commit 5ded70b).** The steward verification email link pointed to `/steward/verify?token=...` (a page route that does not exist) instead of the API handler at `/api/steward/verify?token=...`. Every steward who ever clicked a confirmation link hit a Next.js 404. No steward had ever successfully verified from an email click. Fixed in `app/lib/emails/stewardVerification.ts` line 23 — the single link-generation function used by the claim route, the reverify endpoint, and all resend flows. One-line fix. The June 2 token-expiry work (72h window, reverify endpoint, resend button on failed page) was correctly built and is now reachable. A full sweep of `stewardship_claims` confirmed only Rebekah (Takubeh) and Jill (Asana Yoga) were affected — no other stranded stewards. Both re-issued fresh 72h verification links via `/api/steward/reverify`; emails sent successfully.

  **Files modified:** app/map/MapPageClient.tsx (listing count, empty-state highlight, mapListings search wiring, PEEK_HEIGHT, 100dvh, keyboard handlers — mobile branch only, desktop untouched), app/lib/emails/stewardVerification.ts (verify URL fix).

- **Jun 9** — Mobile map-first rebuild (Steps 1–3 of MOBILE_MAP_PLAN.md). The mobile /map page is now map-as-hero: the Mapbox map fills the viewport full-bleed and is always visible (no more hidden browse/map swap). Layout: floating top bar (RegionSelector + county search) over the map, bottom drawer (45vh, listing cards + action doors) scrollable over the map, North Star nav persistent in top-right corner. Retired the old mobileView state, "View on Map →" button, "← browse" button, and swipe-down-from-top return handler. Desktop is completely unchanged (sidebar + map side-by-side).

  **Component extraction (Step 1):** ListingCard (app/components/ListingCard.tsx) and RegionSelector (app/components/RegionSelector.tsx) extracted from inline markup in MapPageClient.tsx — reused in both mobile and desktop paths. ListingImageTile, ElementalSeat, getListingImage moved into ListingCard; MapPageClient no longer imports them directly.

  **Shared content parametrization:** The sidebar/drawer content is rendered via `renderSidebarContent({ showCountySearch, showActionButtons })` — desktop passes both true (unchanged output), mobile passes both false (county search lives in the floating bar; action buttons live as drawer-top doors and in the North Star nav).

  **Day register (mobile fog treatment):** Light frosted fog rgba(245,249,255,0.15) blur 8px on drawer + bar. Dark navy text #0a2540 with light text-shadow 0 1px 2px rgba(255,255,255,0.6). Gold accents → bronze #6b4f00. Dropdowns dark-on-light via scoped CSS (.mobile-day-bar). Search input: white-tinted rgba(255,255,255,0.6), dark text, muted dark placeholder via ::placeholder rule. ListingCard text forced dark via scoped CSS (.mobile-day-drawer [data-listing-id] div { color:#0a2540 !important }) — ListingCard.tsx itself NOT modified (desktop needs its pale colors). This scoped override is intentional and is the first place to look if card text misbehaves on mobile.

  **Tap-linking:** Tapping a listing card sets selectedId → map highlights the pin (boosted glow/halo/dot layers). Tapping a map pin sets selectedId → matching card scrolls into view in the drawer (data-listing-id attribute + scrollIntoView({ behavior:"smooth", block:"nearest" })). Both directions work on mobile and desktop.

  **Selection popup (portal fix):** The real Mapbox popup (with its real Flag reason-picker modal and real Suggest-an-edit/steward-claim flow) is reused — not rebuilt. On mobile, the popup element is portaled to document.body after creation to escape the map wrapper's stacking context (position:absolute;zIndex:0 created a trap). Mobile popup CSS: full-screen centered flex container with semi-transparent backdrop, z-index 9999. No flyTo on mobile (map stays put). Backdrop-tap and × both dismiss. Flag modal also portaled to body on mobile (z-index 10000). Desktop popup unchanged (top-right, in-map, with flyTo).

  **Nav reorder:** North Star nav items changed to: About, Map, Story of Place (/stories), Online Resources, The Constellation, Founders. "Home" removed by design.

  **Other fixes:** Empty-county text: "This county is still waiting for its first light — you could add one." CompassCaption width: min(240px, calc(100vw - 32px)) for mobile viewport safety (renders on / and /about only, not /map).

  **Throwaway trial routes deleted:** app/fog-trial/ and app/dawning-trial/ removed. "fog-trial" and "dawning-trial" removed from RESERVED_HANDLES. DawningBrighter component (app/components/DawningBrighter.tsx) remains in repo for future use on real pages.

  **Files created:** app/components/ListingCard.tsx, app/components/RegionSelector.tsx. **Files modified:** app/map/MapPageClient.tsx (mobile branch rewritten; desktop untouched), app/components/MapClient.tsx (isMobile prop, flyTo guard, popup portal, flag modal portal), app/components/NorthStarNav.tsx (NAV_ITEMS reorder), app/components/CompassCaption.tsx (responsive width), app/lib/reservedHandles.ts (trial entries removed).

- **Jun 2** — Stewardship verification recovery flow. Two real stewards (Jill at Asana Yoga, Rebekah at Takubeh) both claimed listings, received the verification email, and never clicked — the 24h window was too short and the expired-link page was a dead end. Changes: (1) Token expiry extended from 24h to 72h in app/api/steward/claim/route.ts. (2) Verification email rewritten: subject now "One click to confirm your place — [Business Name]", opening line makes clicking explicitly required ("that click is what makes you the steward"), copy updated to 72h in both plain text and HTML. File: app/lib/emails/stewardVerification.ts. (3) New reverify endpoint at app/api/steward/reverify/route.ts — accepts expired token, checks steward is still pending, generates fresh token with new 72h window, sends new verification email. Rate-limited: rejects if current token hasn't expired (comment notes future softening to once-per-hour). (4) Expired-link page (app/steward/verify/failed/page.tsx) rebuilt with gold "Resend confirmation link" button that calls the reverify endpoint, shows success/error feedback. Verify route now passes expired token through in redirect URL. (5) Post-claim success state on edit page (app/edit/[id]/page.tsx) made visually prominent: gold heading "Almost there — check your email now", explicit 72h window, "that click is the last step — the commons is holding your place until then." Previously a quiet line people were missing.
- **Jun 2** — OG metadata + www consistency fix. metadataBase, og:url, and OG image logo src all pointed at https://canarycommons.org (no www) while the live site 301-redirects to https://www.canarycommons.org. Facebook debugger showed blank preview card due to the mismatch. Fixed all three to use www in app/layout.tsx and app/opengraph-image.tsx. Updated og:title to "Canary Commons", og:description to "Connected, we dawn brighter. A living map of places, people, and projects making life-forward choices visible and findable." Browser tab title unchanged.
- **Jun 2** — Synonym digest sender fix. Monthly cron at netlify/functions/synonym-digest.mts was sending from synonyms@canarycommons.org (unverified, 422 from Resend). Changed to founder@canarycommons.org (verified sender). Internal-only email to Ren, no customer-facing impact.
- **Jun 2** — CLAUDE.md created at repo root with standing security rule: never print, echo, or display secret keys, service-role keys, API keys, tokens, webhook secrets, or .env contents in any form.
- **May 26** — Full normalization cleanup. Centralized all location and business name normalization into a single shared utility at app/lib/normalize.ts (exports toTitleCase, normalizeState, normalizeCounty, normalizeCity, normalizeName). Removed ~145 lines of duplicated logic from app/api/listings/route.ts and app/api/seeder/place-listing/route.ts — both now import from the shared utility. Applied normalization to previously-untouched edit paths (app/api/seeder/save-listing/route.ts and app/api/steward/save/route.ts) so steward and seeder edits no longer introduce drift. Stories table normalized on both write (POST /api/stories) and read (GET /api/stories) — was previously stored and filtered as-submitted. Map page read paths (app/map/MapPageClient.tsx) updated to use canonical comparison via shared utility — replaced local case-insensitive comparison and inline county suffix-stripping with normalizeState/normalizeCounty. Backfilled 28 existing listings rows from bare county names to canonical " County" suffix format via scripts/backfill-normalization.ts (dry-run/apply two-mode design, idempotent). Database trigger normalize_listing_fields() extended via migration supabase/migrations/20260526_extend_normalize_listing_fields.sql — now also normalizes city, state, county on INSERT/UPDATE as a backstop for direct Supabase Studio edits. Trigger uses INITCAP-based Title Case and county suffix handling; intentionally does NOT replicate state abbreviation expansion (that logic stays in the JS utility, drift via direct DB edit will be visibly wrong on review). Net result: data is canonical across the system, all write paths normalize before insert, all read paths normalize user input before matching, database enforces canonical format as last line of defense. Full audit confirmed no same-place-stored-twice rows existed in listings, stories table was empty so no backfill needed there, constellation.region was clean. Migration applied to production Supabase via SQL Editor manually.
- **May 23** — Major session: bulk placement tooling + retroactive Email 1 + no-public-email workflow. Bulk placement tool built at /[handle]/place/bulk (commits 7de91c9, 52cdce5, 0c873d4): paste JSON array of listings, parse into editable review cards with category/practice toggle pills, place one at a time through existing /api/seeder/place-listing pipeline. BULK_PLACEMENT_JSON.md added as canonical JSON reference and to session-open reads. "Place a batch" button added to seeder dashboard. "Place another batch" return loop on batch completion screen. Retroactive Email 1 trigger built (commit 8367dae): extracted sendEmail1 shared utility from place-listing, new /api/seeder/trigger-email-1 endpoint, "Send Email 1 now" button on dashboard for eligible listings. Three Klamath Falls listings (Rare Bird, Asana Yoga, Klamath Grown) successfully sent Email 1 retroactively. Source-mismatch root cause identified: map sidebar "Add a Point of Light" links to /submit not /[handle]/place — decision: not fixing in code, Lucia redirected to use dashboard. No-public-email workflow committed and pushed (349d2ab + df9a458). Includes: checkbox on bulk cards, copyable Email 1 letter via shared OUTREACH_TEMPLATE, "Contact form only" badge on dashboard, migration file at supabase/migrations/20260523_listings_no_public_email.sql. Still needs live testing per LOOSE_ENDS.md; migration run status in production Supabase to be verified.
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

- **Steward verification — first successful end-to-end claim pending.** Fresh 72h verification links sent to Rebekah (Takubeh) and Jill (Asana Yoga) on Jun 10. Awaiting their click to confirm the first successful steward verification on the platform. Other pages not yet tested on narrow viewports.

---

## Next: Homepage restructure

Decided June 15. Simplify the homepage, pulling it off the concept-about-concept register. Remove the "connected we dawn brighter" line / DawningBrighter concept-line from the hero entirely.

### New structure, top to bottom

1. **Canary Commons logo**
2. **About**
3. **Hero line** (exact copy, preserve verbatim): "There's a constellation of small and diverse solutions being created and tended everywhere, beneath the noise. Diversity sustains. Our attention is the fuel."
4. **"explore the commons"** — moves up the visual field, leads into the state directory / region selector (already-built explore door, slight rename)
5. **"tend the commons"** — the contribution / founders door
6. **Closing line** (exact copy, preserve verbatim): "your participation makes a difference"

### Design notes

- Hero deliberately ends on "our attention is the fuel." No "return your attention" / CTA line in the hero — the two buttons complete the gesture, so the line would be redundant. Less is more.
- "explore" = receive posture; "tend" = give posture. Receive-then-give breath, top to bottom.
- The closing line is the last thing on the page. Do not add a supporting line beneath it — the white space is intentional.

### Related context (in progress, not finalized — feel-revisit, not tasks)

- **Founders page reframing** into two sections: "what you receive" (explore the commons) and "what you contribute" (tend the commons).
- **Founders monthly model** moving toward analog correspondence: a quarterly physical "Evidence from the Field" letter as the centerpiece, with a lighter monthly digital signal between. One-time gift gets seed packet + welcome letter. Year-one elevated contribution steps down to base subscription after 12 months, stated openly. Product framing: orientation/witness, not "positive news."
- **"tend"** is the shared verb for the giving posture across both homepage and founders page.

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
