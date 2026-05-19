# GROWTH_LIST.md

*Future architectural additions to build as Canary Commons matures.*

*This file is distinct from LOOSE_ENDS.md. LOOSE_ENDS holds small
deferred items, technical debt, and quick fixes that can be cleared
in a session. GROWTH_LIST holds bigger structural additions that
should be built when the project reaches a certain size, traffic
level, or maturity. Items here are not problems — they are
"build this when the time is right" architectural notes.*

*Read at session open alongside PROJECT_STATE.md and LOOSE_ENDS.md.*

---

## Items

- [ ] **listing_removal_log audit table** — When traffic and removal
  events justify the audit trail. Logs every removal event (soft and
  hard) with reason, seeder/steward attribution, and timestamp.
  Currently the do_not_list fields on listings are sufficient for the
  behavior; the audit log adds historical record for pattern analysis
  and edge-case investigation. Trigger condition: when removal events
  become numerous enough that "who removed this and why" becomes a
  recurring question.

- [ ] **Fuzzy business name matching for do_not_list checks** —
  Current matching is normalized exact match (lowercase, trimmed) on
  business_name + city + normalized_address. Won't catch "Bay Coffee"
  vs "Bay Coffee Roasters" as the same business. Add similarity-based
  matching when false-negatives become apparent. Could use pg_trgm or
  Levenshtein distance.

- [ ] **Indexes on search_logs (created_at and search_term)** —
  Currently fine at low volume. Add before monthly aggregation slows
  down. Worth doing before month three of real data. (Migrated from
  LOOSE_ENDS where this was originally tracked.)

- [ ] **Address format variation in normalization** — Some listings
  have just a street address, others have full "address, city, state,
  zip, country" strings. Matching works on both formats currently but
  may want to normalize to a standardized format when the do_not_list
  check becomes higher-stakes.

- [ ] **Directional prefix handling in address normalization** —
  "N./E./S./W." periods are preserved. "N. First St" and "N First St"
  would not match. Consider stripping periods from directional prefixes
  when matching becomes more sensitive.

- [ ] **Public-facing override flow for hard opt-outs** — Mirror
  the seeder Stage C override view on the public submit form
  when do_not_list_level = 'universal'. Same copy pattern,
  same reason-required override, writes do_not_list_override
  on the new listing. Build alongside Stage G's introduction
  of do_not_list_level. See OPT_OUT_LAYERS.md for full model.

- [ ] **Retroactive outreach for pre-system listings** — Listings
  placed before the seeder outreach system existed have no
  placed_by_seeder_id and don't get caught up in the cron by
  design. When time allows, audit existing listings and decide
  which (if any) should be retroactively assigned a seeder and
  entered into the outreach cadence. Most efficiently handled by
  Lucia and Ren walking through their own placements by hand.

- [ ] **Founders referral URL cleanup with /[handle]/join pattern** —
  Lucia's current Founders referral link is clunky; the seeder URL
  structure (/[handle]) suggests a clean parallel pattern for
  referrals (/[handle]/join). Phase 4 work, deserves architectural
  thought rather than quick patch. (Migrated from LOOSE_ENDS.)

- [ ] **Audit trail for seeder edits** — When a seeder edits a
  listing they placed, no record is currently kept of who edited
  what or when. Worth adding a lightweight audit table or audit
  columns (last_edited_by_seeder_id, last_edited_at) when seeder
  activity scales beyond Lucia.

- [ ] **Cross-seeder edit visibility** — Seeders currently cannot
  edit another seeder's placements (intentional, by design). If
  multi-seeder coordination ever needs this (e.g., handoffs,
  regional territory transfers), it would be a future build with
  explicit permission modeling.

- [ ] **Unify listing-name normalization into a shared utility** —
  Two listing-matching normalizations currently exist: seeder
  placement uses `normalizeName()` helper (in place-listing/
  route.ts), and the public submit route inlines its own logic
  (lowercase, strip articles, collapse spaces). Both do the same
  thing differently. Consider extracting into a shared utility
  (e.g. app/lib/normalizeName.ts) when the next match-related
  change comes through. Not blocking — both produce the same
  output for normal cases.

- [ ] **Admin tool for steward-email backfills** — The Ashland
  backfill (May 18) was done via a one-time script
  (scripts/backfill-email1.ts). The pattern is repeatable:
  query listings by city/state with outreach_status='not_started',
  send Email 1, update status. Worth building a small admin
  dashboard tool when the next batch placement happens, rather
  than writing a new script each time.

- [ ] **Accented character matching in title-based searches** —
  Dobrá Tea (with accented á) was caught during the Ashland
  backfill. Any title-based search or matching function
  (normalized_name, do_not_list checks, cross-seeder view
  filters) may fail to match if the query uses an unaccented
  character against an accented DB value or vice versa.
  Consider adding Unicode normalization (NFD/NFC folding) to
  search and matching paths when this becomes a real-world
  issue beyond Dobrá.

---

## Affiliate / Online Resources Infrastructure

- [ ] **Multi-contributor identity for /api/contributor** —
  Currently filters by hardcoded contributor_id = "contributor_001"
  (Lucia). When a second affiliate contributor is onboarded, this
  will need to move to a token or session-based identity model.
  The /contributor/submit form also hardcodes contributor_name =
  "Lucia" and status = "approved". All three values need to become
  dynamic.

### Affiliate Redirect Layer — /resource/[slug]

**Status:** ✓ BUILT (May 13, 2026). Migration applied, route
handler created, emit sites updated. Awaiting push to production.
Original spec preserved below for reference.

**Problem:**
Awin affiliate tracking links route through awin1.com. The
awin1.com domain is on widely-used ad-blocker filter lists (Peter
Lowe's Ad and tracking server list, uBlock Origin defaults, Brave
Shields, Firefox Strict mode, Safari content blockers). When a
user with any of these enabled clicks an Online Resource on CC,
they see a "Page blocked" warning before reaching the merchant.
Some click Proceed. Many close the tab silently. This is most
likely to affect the privacy-conscious audience that most aligns
with CC's values — they are statistically more likely to run ad
blockers.

CC operators do not see this on their own machines because they
typically aren't running these blockers. The friction is invisible
from the inside; the lost clicks would never surface as feedback.

**Approach: CC-owned redirect layer**

New route: `/resource/[slug]`

Flow:
1. User clicks "Visit Resource" on an Online Resource card.
2. Browser navigates to `canarycommons.org/resource/[slug]` (CC's
   own domain, not on any ad-blocker filter list).
3. CC's server immediately issues a 302 redirect to the
   affiliate_url stored on that resource (the Awin tracking URL).
4. Awin records the click server-side and redirects to the
   merchant destination.
5. User lands at merchant.

The user's browser still passes through awin1.com momentarily as
a redirect hop, but no page renders there and ad blockers
generally do not block redirect-target domains the way they block
visible navigation targets. Tracking still works — Awin still
receives the click, CC still earns commission.

**Schema change required:**
Add a `slug` column to affiliate_resources table. Auto-generate
from `name` field on insert/update via a slugify transform
(lowercase, hyphenated, alphanumeric only). Enforce uniqueness;
on collision, append numeric suffix. Backfill existing rows on
migration.

**Route behavior:**
- `/resource/[slug]` looks up affiliate_resources by slug.
- If row found and `affiliate_url` is present → 302 redirect to
  affiliate_url.
- If row found and `affiliate_url` is empty but `url` is present
  → 302 redirect to url (handles non-affiliate Online Resources
  that still want unified routing).
- If row not found → 404 with friendly copy pointing back to
  /support.

**UI change:**
All "Visit Resource" / external links on Online Resource cards
(anywhere on the site — public Online Resources page, county
search results, /contributor/submit listings view, anywhere else
they appear) point to `/resource/[slug]` instead of directly to
affiliate_url. Stewards/admin views may still show the raw
affiliate_url for verification purposes.

**Implementation: pure server-side redirect, no interstitial
page.** Fastest, lowest friction. Revisit interstitial if CC
wants more brand presence in the moment of transition.

**Transparency copy (Ren to write):**
This is the values-side counterpart to the technical layer. CC
will write and place on-site copy — likely on the Online Resources
index page, possibly also on a dedicated /about page — explaining:
- Online Resources is how Canary Commons sustains itself
  financially over the long term.
- These are affiliate relationships: when a visitor clicks through
  and purchases from a partner, CC receives a portion of that
  revenue.
- This funding model is what allows the local map to remain free,
  non-pay-to-play, and non-competitive between map listings.
- We curate Online Resources for alignment with CC's values, not
  for commission rates.

The redirect layer is not concealment — it's a smoother user
experience. The model itself is named clearly on the site.

**Decision criteria for revisiting:**
- Awin dashboard shows meaningful click volume → defer further;
  current setup is working.
- Awin dashboard shows low clicks despite good listings and good
  site traffic → build the redirect layer; ad-blocker friction is
  the likely culprit.
- Ren decides to actively scale Online Resources as a revenue arm
  → build the redirect layer as part of solidifying that system
  before adding more affiliate partners.

**Related/dependent work:**
- Slug column migration on affiliate_resources.
- Update all link-emit sites across the codebase to use
  `/resource/[slug]`.
- Coordinate with transparency copy placement so the redirect
  layer ships paired with the language, not separately.

---

## Email 1 / 2 / 3 Strategic Rewrite — May 18 2026

The current three-email outreach cadence is functioning correctly
and reads as honest and grounded. However, all three emails define
Canary Commons through *intention* (life-forward choices,
visibility, stewardship) without clearly naming the **practical
gap being filled** — which is the thing stewards and future users
actually need to understand.

### The gap to name explicitly:

It is hard to find small places doing great things. Both the
businesses doing the work, and the people seeking what they
offer, are on opposite sides of that same gap. Canary Commons is
the bridge.

### Strategic spine for the rewrite:

"Hey — cool new thing you're included in. It's useful because
it's bringing people to you, and making the things that make
tomorrow livable accessible to the people who want to find them.
It's hard to find small places doing great things. Canary
Commons fills that gap — for the businesses, and for the people."

### Specific addition for Email 1:

Insert (likely between current paragraph 2 and paragraph 3, but
feel into placement):

"As the map fills in, it becomes a downloadable app that helps
people find what cares for the long term — for the body, the
land, the community — wherever they are."

The body / land / community phrasing defines "life-forward"
inline without replacing the term. The term stays; the meaning
gets companioned the first time the reader meets it.

### Notes for execution:

- "Life-forward" stays as the chosen term. It does not get
  replaced. It gets supported.
- Update both the .ts template file AND EmailModals.tsx in
  lockstep — they currently match and must continue to match
  to prevent drift.
- Email 2 (Visibility) and Email 3 (Stewardship) need their own
  pass — feel for where the gap-naming and the
  app/network-effect thread should land in each. Each email has
  its own job in the arc; the strategic spine threads through
  all three but expresses differently in each.
- Don't lose the existing tone. It's honest, ungraspy, gives
  full agency, doesn't oversell. The rewrite is additive, not
  replacement.

### Files that will change:

- app/lib/emails/seederOutreach1Recognition.ts
- app/lib/emails/seederOutreach2Visibility.ts
- app/lib/emails/seederOutreach3Stewardship.ts
- app/components/EmailModals.tsx (Email1Recognition,
  Email2Visibility, Email3Stewardship functions)

---

## Decision criteria for graduating items here

When something is added to GROWTH_LIST:
1. It is not blocking current work
2. It is not a bug or cleanup task
3. It is a meaningful architectural addition or feature
4. The decision to build it depends on project size, traffic, or
   maturity rather than urgency

When something is removed from GROWTH_LIST:
1. It has been built (move to PROJECT_STATE.md "Done" section)
2. It is no longer relevant (delete with brief note in commit message)
