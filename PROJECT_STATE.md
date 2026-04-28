# Canary Commons — Project State

*Living state of the work. Updated at the end of each session.*

*For architectural reference (stack, routes, components, schema), see PROJECT_MAP.md.*

*Last updated: April 27, 2026*

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

### Database (18 tables)
- **Listings & moderation**: listings, listing_edits, listing_flags
- **Founders & Seeders**: founders, seeders, seeder_referrals
- **Stewardship**: stewards, steward_edit_sessions, stewardship_claims, stewardship_disputes, affiliate_stewards
- **Content & Story**: stories, constellation
- **Resources**: resources, support_resources, affiliate_resources, affiliate_partners
- **Feedback loop**: unmet_needs (captures failed searches — "tell us what you're looking for")

---

## Done (recent)

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
