# Flight Readiness & Infrastructure Cost Reference

**Status:** living document. Last updated **2026-11-27**.
**Purpose:** a single, maintained source of truth for what Canary Commons costs to run, how that scales with real usage, what's already protected against abuse/surprise bills, and what's still open. Written so a nontechnical founder can read the summary and a developer (human or Claude Code) can act on the detail.

Before re-investigating Mapbox/Netlify/Supabase cost or scaling questions from scratch, **read this document first** and update it rather than rebuilding the analysis.

---

## Executive summary

- **Current cost: effectively $0/month in infrastructure overage** at today's real traffic (~113 Mapbox web map loads in the most recent billing window). The one exception is Mapbox's Permanent Geocoding product, which has no free tier at all and is already producing small charges from normal listing-placement activity.
- **The previous primary risk — redundant geocoding, not outage risk — is now fixed.** Through 2026-11-26, the map asked Mapbox to re-identify a region it already knew roughly **5 times per visit** (county selection, marker clicks, Home, and clearing filters each triggered a redundant lookup). As of commit `539b28a` (deployed 2026-11-26), those four triggers are removed; only the initial on-load lookup and genuine free-panning still geocode. The remaining structural risk is **Netlify pausing the entire site** ("Site not available") if its monthly credit allotment is exhausted, on either plan, unless auto-recharge is explicitly on — this is a harder failure mode than anything Mapbox or Supabase does.
- **Both fixes are now implemented and live in production** (deployed 2026-11-26): the redundant reverse-geocode skip in `app/components/MapClient.tsx` (commit `539b28a`), and the server-only Mapbox geocoding token (commit `cb8a2c8`).
- **Netlify plan and billing history confirmed 2026-11-27:** Personal plan, $9/month, 1,000 credits/month, **auto-recharge disabled**. Two completed billing periods used 192 and 304 credits respectively (well under the allotment); the current period shows ~945 credits remaining as of Nov 27. Since auto-recharge is off, the pause risk described above is live, not hypothetical, if usage ever climbs enough to exhaust the allotment — see §1/§6/§7.
- **Next actions:** (a) watch the next Mapbox Statistics window to confirm the real post-fix ratio (§2's projection table still uses the pre-fix ~5× figure as a conservative baseline until new data comes in — see §8); (b) confirm Supabase plan + spend-cap status directly in its dashboard — not visible from code (Netlify's is now confirmed, above); (c) watch the Netlify credit balance against the §6 thresholds (500 remaining → review, 250 remaining → purchase/upgrade decision). *(The Mapbox $5 Permanent Geocoding charge is now resolved — see below and §7 — no further action needed on it.)*
- **When to come back and re-read this document:** after any sustained jump in traffic, after crossing roughly 1,000 active listings, after any Mapbox/Netlify/Supabase pricing change, or before any planned marketing push/campaign. See the checklist in §8.

---

## 1. Current architecture and baseline

### Services in use

| Layer | Provider | Role |
|---|---|---|
| Hosting / serverless functions | Netlify | Next.js app hosting, API routes as functions, scheduled functions (email cadence, synonym digest) |
| Database | Supabase (Postgres + PostgREST) | Listings, stewards, seeders, search logs, synonyms, affiliates, email queue |
| Interactive map | Mapbox GL JS | Client-side map rendering (styles, tiles, fonts) |
| Geocoding | Mapbox Geocoding API (Temporary + Permanent tiers) | Address → coordinates (listing creation/edit) and coordinates → region (map pan indicator) |
| Outreach email | Resend | Three-letter seeder outreach sequence, steward verification, founder emails |
| Payments | Stripe | Founding Stewardship contributions |

### Verified plan tiers, allowances, and billing behavior

**Mapbox** (documented pricing, fetched live 2026-11-26):

| Product | Free allowance / mo | Above free |
|---|---|---|
| Web map loads | 50,000 | $5.00/1k (50k–100k) → $4.00/1k (100k–200k) → $3.00/1k (200k–1M) → $2.50/1k (1M–5M) |
| Temporary Geocoding | 100,000 | $0.75/1k (100k–500k) → $0.60/1k (500k–1M) → $0.45/1k (1M–5M) |
| Permanent Geocoding | **none** | Billed in **1,000-request blocks per billing cycle, not a linear per-request rate**: 0 requests = $0; 1–1,000 requests = $5; 1,001–2,000 requests = $10; each additional block of up to 1,000 adds $5. (Confirmed directly with Mapbox Support — Yana, 2026-11-26. See §7, now resolved.) |
| Static Images API | 50,000 | $1.00/1k (50k–500k) → $0.80/1k (500k–1M) |

No code path in this repository calls the Static Images API — the 7 requests Mapbox's dashboard shows for the most recent window don't trace to anything here (see §7).

**Temporary vs. Permanent is controlled entirely by the `permanent=true` query parameter on the geocoding request — there is no separate endpoint or token for it.** Omitting it (the default) bills as Temporary Geocoding; adding it bills as Permanent Geocoding, block-billed as above. In this codebase, `permanent=true` is used only in the four routes that store the result long-term (seeder `place-listing`/`save-listing`, steward `save`, public `/submit` → `/api/listings`) — correctly, since Mapbox's terms prohibit storing Temporary-tier results for later use. `geocode-preview` and the client-side map region-indicator correctly omit it, since neither persists a result. **This is already correct in the current code; no change needed here.**

**Netlify** — pricing moved to a credit-based model (confirmed live 2026-11-26): Free = 300 credits/mo; Pro = $20/mo base → 3,000 credits/mo. Bandwidth 20 credits/GB (≈$0.13/GB); compute 10 credits/GB-hour (≈$0.07); web requests 2 credits/10k (≈$0.01); production deploys 15 credits each (≈$0.10).

**This project's actual Netlify plan, verified 2026-11-27 from account billing:** **Personal, $9/month, 1,000 credits/month. Auto-recharge disabled.** (Personal sits between the generic Free and Pro tiers referenced in Netlify's public pricing above — its allotment and price are account-specific, confirmed directly rather than from the public pricing page.) Because auto-recharge is off, exhausting the 1,000-credit allotment in any given period will pause the site (§7) rather than bill an overage — there is currently no automatic safety net past the included credits.

**Verified Netlify billing history (account dashboard, checked 2026-11-27):**

| Billing period | Credits used | Bandwidth | Web requests | Function compute |
|---|---|---|---|---|
| Sep 25 – Oct 24, 2026 | 192 / 1,000 | 177.7 MB | 31,000 | 3.3 GB-hours |
| Oct 25 – Nov 24, 2026 | 304 / 1,000 | 485.5 MB | 33,000 | 7.9 GB-hours |
| Nov 25 – Dec 24, 2026 (current, in progress) | ~55 used so far → **~945 remaining as of Nov 27** | — | — | — |

Both completed periods used well under half the monthly allotment. The current period's pace (~55 credits in the first 2–3 days) is a small sample and shouldn't be extrapolated into a monthly projection on its own — just the latest checkpoint.

**Supabase** — Free: 500 MB DB, 5 GB egress + 5 GB cached egress, 50k MAU, unlimited API requests, shared-CPU Micro compute, pauses after 1 week inactivity. Pro ($25/mo base): 8 GB DB included (then $0.125/GB), 250 GB egress (then $0.09/GB) + 250 GB cached egress (then $0.03/GB), 100k MAU (then $0.00325/MAU), $10/mo compute credit. Pro's spend cap is **on by default**. **Which plan this project is on, and the spend-cap setting, is likewise not verifiable from code.**

### Latest observed usage

- Mapbox Statistics, **Oct 27 – Nov 26, 2026**: 113 web map loads · 7 Static Images API requests (unexplained — see §7) · 572 Temporary Geocoding requests · 22 Permanent Geocoding requests. Temporary Geocoding spiked around **Nov 21–22**, coinciding with the site "becoming more publicly accessible" — plausibly visitor traffic, not seeding (bulk seeding had not yet begun as of that window; see the Nov 26 audit for the full reasoning).
- Mapbox invoice: a **$5 charge** tied to the 22 Permanent Geocoding requests. **Resolved (2026-11-27):** Mapbox Support confirmed Permanent Geocoding bills in 1,000-request blocks per cycle, not a linear per-request rate — 1 to 1,000 requests in a cycle costs a flat $5 regardless of exactly how many of the 1,000 were used. 22 requests correctly falls in the first block → $5 is the right charge, not a billing error. See §7.

### Listings and payload size

| Metric | Oct 9, 2026 | Nov 26, 2026 (measured live) |
|---|---|---|
| Active listings | 509 | 544 |
| Multi-location rows (`listing_locations`) | — | 17 |
| `/api/listings` payload, raw JSON | ~714 KB (reported) | **489 KB** |
| `/api/listings` payload, gzip (what actually ships) | — | **102 KB** |
| `/api/listings` payload, brotli | — | **79 KB** |

Growth rate: +35 active listings over ~48 days ≈ **0.73 listings/day** average so far — well under the 10–20/day bulk-seeding pace being planned.

The raw-size drop despite more rows is most likely explained by a field-list trim already present in the code (`PUBLIC_LISTING_FIELDS` in `app/api/listings/route.ts` carries a comment noting `removal_token` and other internal-only columns were deliberately excluded) — not independently re-verified against whatever method produced the October figure.

---

## 2. Visitor cost model

### What happens, action by action

| Visitor action | Mapbox | Netlify function | Supabase |
|---|---|---|---|
| Open `/map` (first time this session) | 1 web map load + 1 reverse-geocode (fires on `load`) | `GET /api/listings`, `GET /api/affiliates` | 2 reads, both edge-cached 30s (`Cache-Control: public, s-maxage=30, stale-while-revalidate=60`) |
| Select a county/state | 0 — fixed 2026-11-26 (commit `539b28a`), see §4/§5 | none | none — filters the already-loaded dataset client-side |
| Click each of 10 markers (desktop) | 0 — fixed 2026-11-26 (commit `539b28a`) | none | none |
| Click markers (mobile) | 0 — map doesn't recenter on mobile marker-select | none | none |
| Free pan/zoom to a new area | 1 reverse-geocode per settled position — **the one legitimate case** | none | none |
| Use "Home" | 0 — fixed 2026-11-26 (commit `539b28a`) | none | none |
| Clear filters back to default view | 0 — fixed 2026-11-26 (commit `539b28a`) | none | none |
| Type a search term | 0–1 per changed result set (can also recenter the map → same redundant path) | `GET /api/synonyms` (200ms debounce), `POST /api/search-log` (1s debounce) | 1 read (`synonym_groups`) + 1 write (`search_logs`) per completed term |
| Close tab, return later | repeats the "open /map" cost exactly | same two GETs | 2 reads again (30s cache almost certainly expired) |

A realistic single session (open, pick a county, click 10 markers, one pan, Home, one search, return once later) produces on the order of **14 Mapbox geocoding calls**, of which only 1–2 were strictly necessary — this ratio (measured as ~5 calls per map load from the Nov window: 572 ÷ 113) is the main lever in §5/§6.

`/api/listings` and `GET /api/listings` take **no query parameters** — every map open downloads the entire active-listings table regardless of which region the visitor looks at. Cost scales with total listing count, not visitor behavior (see §3).

### Cost projections — 1,000 to 1,000,000 monthly map opens

Built from the measured ~5× geocoding ratio and documented tiered pricing above, assuming **no changes are deployed yet** (today's behavior):

| Map opens/mo | Plausible unique visitors* | Mapbox web loads | Mapbox temp. geocoding (~5×) | Mapbox cost | Listings bandwidth (gzip) |
|---|---|---|---|---|---|
| 1,000 | ~700–900 | 1,000 | 5,000 | $0 | ~100 MB |
| 10,000 | ~7,000–8,500 | 10,000 | 50,000 | $0 | ~1.0 GB |
| 50,000 | ~33,000–42,000 | 50,000 | 250,000 | ~$113 | ~5.1 GB |
| 100,000 | ~65,000–83,000 | 100,000 | 500,000 | ~$550 | ~10 GB |
| 500,000 | ~330,000–420,000 | 500,000 | 2,500,000 | ~$2,825 | ~51 GB |
| 1,000,000 | ~670,000–830,000 | 1,000,000 | 5,000,000 | ~$5,450 | ~102 GB |

*Assumes 1.2–1.5 map opens per unique visitor/month on average — **an estimate, not measured analytics.** This is the one number in this table that isn't grounded in a measured or documented figure; treat the "unique visitors" column as illustrative only.

**What the now-deployed geocoding fix (commit `539b28a`, §4/§5) is worth:** removing the four redundant triggers plausibly cuts the ratio from ~5× to ~1.5–2×. At 100,000 map opens, that moves temporary-geocoding cost from roughly $300 of the $550 total down toward $0–38 — the highest-leverage, lowest-risk lever available, and it changed nothing visible to a visitor. The table above still uses the pre-fix ~5× ratio as the conservative baseline; **re-measure against the next full Mapbox Statistics window and update this table once real post-fix data is available** (see §8 checklist).

---

## 3. Listing-growth cost model

- **New listing creation** (public `/submit`, seeder `/place` and `/place/bulk`) always geocodes exactly once per listing — necessary, non-repeating cost. Public submission is rate-limited (20/hr/IP) and capped at 10 locations per submission (§4); seeder placement has no rate limit but requires an authenticated seeder session.
- **Single-location edits never re-geocode** — the primary listing's lat/lng isn't in the writable field list for either `save-listing` (seeder) or `steward/save` routes. (Side effect, not a cost issue: the pin doesn't move if someone edits the address text.)
- **Multi-location edits re-geocode unconditionally on every save**, confirmed in both `app/api/seeder/save-listing/route.ts` and `app/api/steward/save/route.ts`: `geocodeForEdit()` runs for every extra location on every save, even when that save only touched the description or a category — and again on every retried save. Currently low-volume (17 multi-location rows total) but worth fixing before multi-location listings and edit/retry volume both grow; **not yet implemented.**
- **`/api/listings` payload scales directly with total listing count** (§1), and that scaling compounds with visitor growth multiplicatively, not additively — double the listings and double the visitors, and this one payload's total bandwidth quadruples:

  | Total active listings | Raw payload | Gzip payload |
  |---|---|---|
  | 544 (today) | 489 KB | 102 KB |
  | 1,000 | ~900 KB | ~187 KB |
  | 5,000 | ~4.5 MB | ~935 KB |
  | 20,000 | ~18 MB | ~3.7 MB |

  At 20,000 listings — plausible within a year or two at 10–20/day — every map open ships ~3.7 MB of listing data alone, before map tiles or the app bundle. **No region-scoping or pagination exists on this endpoint today; this is the single most consequential unaddressed cost lever for the medium term** (§5/§6).
- Permanent Geocoding cost from new placements scales with **seeding pace**, not visitor traffic, and — now that block billing (§1/§7) is confirmed — in **steps of $5 per 1,000 requests per billing cycle**, not a smooth per-request rate: at the planned 10–20 businesses/day (~300–600 placements/month, each one Permanent Geocoding call), that's comfortably within the first 1,000-request block → a flat **$5/month**, regardless of whether it's 300 or 900 placements that month. The next step up only happens if placement + multi-location-edit + retry volume together cross 1,000 requests in a single cycle, at which point cost jumps to $10, then $15, in discrete $5 steps — not gradually. This is a different cost shape than the rest of this document's per-request projections and is worth remembering when extrapolating.

---

## 4. Existing safeguards

### Rate limits and quotas — verified in current code (2026-11-26)

| Protection | Status | Setting | Added |
|---|---|---|---|
| `POST /api/listings` rate limit | ✅ active | 20/hour/IP | Oct 9, 2026 (`9312760`) |
| Multi-location submission cap | ✅ active | 10 locations/submission | Oct 9, 2026 (`9312760`) |
| `POST /api/geocode-preview` rate limit | ✅ active | 30/hour/IP | Oct 9, 2026 (`9312760`) |
| `POST /api/steward/claim` rate limit | ✅ active | 5/hour/IP | Oct 9, 2026 (`9312760`) |

All four were re-verified directly against the current code during the 2026-11-26 audit, not assumed from history. Honest limitation carried from the original implementation: the limiter (`app/lib/rateLimit.ts`) is **in-memory, per server instance** — resets on redeploy, no cross-instance coordination. A real deterrent against casual scripted abuse, not a hard distributed guarantee (this is stated in the code's own comments, not an outside assumption).

**Not rate-limited:** seeder `place-listing` and `save-listing` (both trigger Permanent Geocoding). Lower realistic exposure since both require an authenticated seeder session first, but the gap exists.

### Caching and data-fetching behavior — verified

- `GET /api/listings` and `GET /api/affiliates` both send `Cache-Control: public, s-maxage=30, stale-while-revalidate=60` — real, working mitigation: Supabase is only re-queried roughly once per 30 seconds of sustained traffic, not once per visitor. Does **not** reduce per-visitor bandwidth, only how often Supabase regenerates the response.
- `/api/listings` fetches the full listings table and the full `listing_locations` table on every call, with no query parameters, no pagination, no region filtering.
- The main listings fetch in `MapPageClient.tsx` runs once per page mount (`useEffect` with an empty dependency array) — county/state selection, search, and marker clicks all filter the already-loaded dataset client-side; they do **not** trigger additional `/api/listings` calls.

### Token architecture and security

- **As of 2026-11-26, deployed to production:** server-side geocoding calls (`geocode-preview`, seeder `place-listing` and `save-listing`, steward `save`, public `/submit` → `/api/listings`) read a dedicated, server-only `MAPBOX_GEOCODING_TOKEN` env var, never bundled to the browser. Map rendering and the client-side region-indicator reverse-geocode in `MapClient.tsx` still use the original `NEXT_PUBLIC_MAPBOX_TOKEN`, which remains browser-exposed — inherent to any client-rendered Mapbox GL map, and the client-side reverse-geocode call structurally cannot use a server-only token, since it runs in the browser.
- **Verified post-deploy** (2026-11-26): homepage and `/map` load (200), `/api/listings` serves real data, `POST /api/geocode-preview` succeeds end-to-end with the new token (confirming the env var is correctly configured), and no 500s from a missing-token condition.
- **Residual exposure, by design, not yet closed:** the public token must retain Geocoding scope (not just map-display scope) for the client-side region-indicator feature to keep working as-is. Full separation (public token scoped to map display only) would require routing that one remaining client-side call through a server proxy instead — a larger change, not yet proposed for implementation, noted as a future option only.
- Netlify env var configuration itself (which context it's set for, whether it's marked server-only) could not be independently verified from this codebase — confirmed functionally instead, by the above successful post-deploy calls.

### Performance and mobile-map fixes

- **2026-11-15** (`8e3ff1f`): fixed a stuck-sheet bug on the mobile map's bottom drawer — the selected listing now scrolls within its own list container, and a stray `main.scrollTop` is reset. Verified on-device before the temporary debug overlay used to diagnose it was removed.
- **2026-06-09**: mobile map-first rebuild — the mobile `/map` page became map-as-hero (full-bleed, always-visible map with a floating top bar and a scrollable 45vh bottom drawer), retiring the old hidden browse/map toggle. Desktop layout unaffected.
- **2026-06-10**: mobile map drawer polish, search-to-pins wiring, keyboard-interaction fix.

### What's verified vs. historical-only

Everything in this §4 table and the token-architecture bullets above was re-checked directly against the live code or a live production call on 2026-11-26. The two pending items below are the only safeguards from recent work that are **not yet live**:

| Item | Status |
|---|---|
| Server-only geocoding token | ✅ implemented, committed (`cb8a2c8`), **pushed and deployed**, functionally verified in production |
| Redundant reverse-geocode skip (county-select, marker-click, Home, clear-filters) | ✅ implemented, committed (`539b28a`), **pushed and deployed**, `tsc`/build verified before push, production chunk fingerprint confirmed live post-deploy |
| Multi-location unconditional re-geocode-on-save fix | recommended (§3), **not implemented** |
| `/api/listings` region-scoping or pagination | recommended (§3/§6), **not implemented** |
| Client-side session cache for `/api/listings` on return visits | recommended, **not implemented** |

---

## 5. Decisions already made

**Launch on Netlify Personal, monitor usage, upgrade or purchase credits when traffic warrants it (decided October 2026; plan and billing history independently verified 2026-11-27).** Confirmed account details: Personal plan, $9/month, 1,000 credits/month, auto-recharge disabled. Rationale as given: avoid paying for infrastructure headroom before real usage exists, with the explicit intention to revisit once traffic data justified the cost. Two completed billing periods (192 and 304 credits used, both well under the 1,000 allotment) support staying on this plan for now — see §1 for the full billing history and §6 for the specific credit-balance thresholds (500 remaining → review, 250 remaining → purchase/upgrade decision) that operationalize "when traffic justifies it." **Do not reopen this decision without new usage evidence; the numbers in this document, kept current, are exactly what "new evidence" should look like.**

**Mapbox remains the map/geocoding provider.** Per the 2026-11-26 audit's explicit conclusion: switching providers is not worth it at any volume modeled in §2 on its own — Mapbox's tiered pricing stays cheap relative to typical revenue-per-visitor at this stage even at 1,000,000 map opens/month (~$5,450 at the pre-fix ~5× ratio, dominated almost entirely by that now-fixed redundant-geocoding ratio). The threshold worth re-evaluating this at: **sustained volume above roughly 200,000–300,000 map opens/month**, re-measured against the actual post-fix ratio (commit `539b28a`, deployed 2026-11-26) once enough real usage has accumulated. Below that, the already-shipped fix is cheaper than a migration.

**Viral-readiness guardrails (Oct 9, 2026, `9312760`).** Added the four rate limits and the multi-location cap in §4, specifically so a crafted or scripted request couldn't trigger unbounded paid Mapbox calls or flood the map with instantly-public listings (Canary's governance model publishes submissions immediately — intentional, unchanged). Verified at the time against exact-boundary pass/429 behavior and confirmed the protected paid action didn't fire once limited; all temporary test data was removed afterward, leaving exactly 509 real listings.

**Mapbox token separation (2026-11-26).** Implemented and deployed specifically to limit blast radius if the public, browser-exposed token is ever extracted and used directly against Mapbox's API outside this app's control — a risk that exists independent of how much legitimate traffic the site gets. Rationale: a geocoding-scoped secret token, never shipped to any client, cannot be abused the way the single previously-shared token could.

---

## 6. Growth triggers and action thresholds

Thresholds are grounded in documented provider limits where noted; everything else is an explicitly **proposed operating threshold** set by this audit, not an invented provider restriction.

| Metric | Current baseline (2026-11-26) | Warning threshold | Action threshold | Recommended action | Where to check |
|---|---|---|---|---|---|
| Mapbox web map loads/mo | 113 | 25,000 *(proposed — 50% of documented free tier)* | 45,000 *(documented free tier: 50,000)* | Confirm real visitor growth vs. a traffic anomaly; budget for the $5/1k-and-up tier if genuine | Mapbox dashboard → Statistics |
| Mapbox Temporary Geocoding/mo | 572 | 60,000 *(proposed — ~60% of documented 100,000 free tier)* | 90,000 *(documented free tier: 100,000)* | Confirm the §4/§5 redundant-call fix is deployed; if it is and this is still climbing, it's genuine traffic | Mapbox dashboard → Statistics |
| Mapbox Permanent Geocoding/mo | 22 (billed as 1 block = $5) | **900 requests in the current cycle** *(proposed — approaching the next $5 block boundary at 1,000)* | **1,000 requests in the current cycle** *(documented block boundary — crossing it adds another $5, flat)* | Below 900: no action, cost is a flat $5/mo regardless of exact count. At/near 900: check whether placement + multi-location-edit + retry volume is about to cross into a second block before the cycle resets | Mapbox dashboard → Statistics |
| Mapbox Permanent Geocoding invoice | $5 for 22 requests — **confirmed correct, block-billed** (Mapbox Support, Yana, 2026-11-26) | — | any charge that doesn't match $5 × ⌈requests ÷ 1,000⌉ for the cycle *(proposed — would now be a genuine anomaly, not expected billing behavior)* | Recompute expected charge as $5 × ⌈requests ÷ 1,000⌉ before assuming an error | Mapbox Billing |
| Netlify credits remaining/mo | ~945 remaining as of Nov 27, 2026 (Personal, 1,000/mo, verified) | **500 credits remaining** *(internal operating threshold, not a Netlify limit)* | **250 credits remaining** *(internal operating threshold, not a Netlify limit)* | At 500: review actual consumption and expected traffic for the rest of the period. At 250: make a purchase-or-upgrade decision before exhaustion — auto-recharge is currently disabled, so exhaustion pauses the site, not an overage bill. Also check balance and projected demand before any significant outreach push. | Netlify dashboard → Usage/Billing |
| Netlify bandwidth / function compute | Sep–Oct: 177.7 MB / 3.3 GB-hrs. Oct–Nov: 485.5 MB / 7.9 GB-hrs (both verified) | — *(folded into the credit balance above under the current pricing model)* | — | Watch for a sudden jump in either figure between periods as an early signal before the credit balance itself gets low | Netlify dashboard → Usage |
| Supabase egress/mo | unknown — plan not verified | 60% of plan allowance *(proposed)* | 90% of plan allowance *(proposed)* | Confirm plan + spend-cap setting; this is the metric that compounds with listing count (§3) | Supabase dashboard → Usage |
| Supabase database size | unknown | 60% of plan allowance *(proposed)* | 90% of plan allowance *(proposed)* | Check growth is from listings, not an unrelated table (logs, etc.) | Supabase dashboard → Database |
| `/api/listings` raw payload size | 489 KB | 1 MB *(proposed)* | 2 MB *(proposed)* | Implement region-scoping/pagination (§3/§6) before this becomes materially expensive | Run the measurement script referenced in §8, or `curl` the endpoint directly |
| Active listing count | 544 | 1,000 *(proposed)* | 5,000 *(proposed)* | Re-run the payload measurement in §1/§3; revisit the region-scoping fix's priority | Supabase `listings` table, `status='active'` count |

---

## 7. Known risks and open questions

- **RESOLVED 2026-11-27 — Mapbox's $5 charge for 22 Permanent Geocoding requests.** Confirmed directly with Mapbox Support (Yana, 2026-11-26): Permanent Geocoding is billed in **1,000-request blocks per billing cycle**, not a smooth linear per-request rate. 0 requests = $0; 1–1,000 requests = $5 flat; 1,001–2,000 = $10; each further block of up to 1,000 adds $5. 22 requests falls in the first block, so $5 is the correct charge — **not a billing error, and nothing further to chase here.** (This was the one number in the original audit that didn't trace to a documented rate — it traces correctly now that the actual billing mechanic, block pricing rather than per-request pricing, is known.)
- **No confirmed hard spending cap exists on Mapbox.** Both web map loads and Temporary Geocoding bill automatically past their free tiers with no evidence of an automatic stop; Permanent Geocoding has no free tier and bills a flat $5 from the very first request in a cycle (block-billed, §1). If Mapbox offers an account-level usage cap or alert, it would need to be configured directly in the Mapbox account — not verifiable or settable from this codebase.
- **Netlify pauses the entire site, not just one feature, when monthly credits run out** — on either plan, unless auto-recharge is explicitly enabled (which then bills automatically instead of pausing). **Verified 2026-11-27: this project is on Netlify Personal, $9/month, 1,000 credits/month, with auto-recharge disabled** — so this is a live, active risk, not a hypothetical one. The two most recent completed billing periods used 192 and 304 credits respectively, well under the allotment, and the current period shows ~945 remaining as of Nov 27 — comfortable headroom today, but this is a harder failure mode than anything Mapbox or Supabase does, and it's worth tracking against the §6 thresholds (500/250 credits remaining) rather than assuming the current comfortable margin holds as traffic grows.
- **Public-token geocoding exposure, partially mitigated.** The server-only `MAPBOX_GEOCODING_TOKEN` (§4) closes the risk for the four named server routes. The public `NEXT_PUBLIC_MAPBOX_TOKEN` still necessarily carries Geocoding scope for the client-side region indicator, and remains extractable from the browser bundle by design (inherent to any client-rendered Mapbox GL map) — a URL-restricted public token raises the bar against casual abuse but is not a hard guarantee against a determined actor who replays the correct referrer.
- **Unverified account-level facts remaining:** current Supabase plan tier and spend-cap status; whether Mapbox has any account-level usage cap configured. (Netlify's plan and auto-recharge status were confirmed 2026-11-27 — see above and §1.)
- **Unresolved scaling question:** the "unique visitors per map open" ratio used throughout §2 (1.2–1.5×) is an estimate, not measured analytics — if real usage data becomes available (e.g. from an analytics tool), the entire §2 projection table should be recalculated against it rather than this placeholder assumption.
- **The 7 Mapbox Static Images API requests in the Nov 2026 window don't trace to any code path in this repository.** Low-value either way (7 requests), but noted rather than silently dropped.

---

## 8. Change log and review process

### Change log

| Date | Finding / decision | Status |
|---|---|---|
| 2026-10-09 | Viral-readiness guardrails added: 4 rate limits + 10-location submission cap (`9312760`) | ✅ Implemented, deployed, re-verified 2026-11-26 |
| 2026-10-09 | Baseline: 509 active listings | Historical reference point |
| 2026-10-11 | Two pre-launch readiness fixes shipped (`92c8dc2`): invalid `/stories&listingId=` URL on unfiltered map; blank `/founders/confirmation` without a session_id | ✅ Implemented, deployed |
| 2026-10 (undated) | Decision: launch on Netlify Personal plan, revisit when traffic justifies upgrading | Recorded as stated at the time; plan and billing history independently verified 2026-11-27 (see below) |
| 2026-11-15 | Mobile map bottom-drawer stuck-sheet scroll bug fixed and verified on-device (`8e3ff1f`) | ✅ Implemented, deployed |
| 2026-11-26 | Full flight-readiness/cost audit completed — visitor journey traced, payload measured (489 KB raw/102 KB gzip, 544 listings), documented pricing fetched live, projections built for 1K–1M map opens/month | Findings recorded in this document |
| 2026-11-26 | Mapbox server-only geocoding token (`MAPBOX_GEOCODING_TOKEN`) implemented | ✅ Implemented, committed (`cb8a2c8`), **pushed and deployed**, functionally verified in production |
| 2026-11-26 | Redundant reverse-geocode calls (county-select, marker-click, Home, clear-filters) identified and fixed in `MapClient.tsx` (commit `539b28a`) | ✅ Implemented, committed, **pushed and deployed**, `tsc`/build verified, production chunk fingerprint confirmed post-deploy |
| 2026-11-26 | `docs/FLIGHT-READINESS.md` committed locally (`e014dab`), then pushed/deployed alongside `539b28a` after user confirmation | ✅ Committed and pushed |
| 2026-11-26 | `docs/FLIGHT-READINESS.md` created; linked from `CLAUDE.md` | ✅ This document |
| 2026-11-27 | Netlify plan and billing history verified from account dashboard: Personal, $9/mo, 1,000 credits/mo, auto-recharge disabled; Sep 25–Oct 24 used 192 credits, Oct 25–Nov 24 used 304 credits, current period (Nov 25–Dec 24) ~945 remaining as of Nov 27. Proposed review thresholds recorded (500 remaining → review, 250 remaining → purchase/upgrade decision) as internal operating thresholds, not Netlify-imposed limits | ✅ Verified and recorded (documentation only — no infrastructure or application change) |
| 2026-11-27 | **$5-for-22-requests Mapbox Permanent Geocoding discrepancy resolved**, per Mapbox Support (Yana, 2026-11-26): the product bills in 1,000-request blocks per cycle ($5 flat per block), not a linear per-request rate — 22 requests correctly falls in the first block. Updated §1 pricing table, §3 listing-growth cost model, §6 thresholds, and §7 to reflect block billing; confirmed existing code already scopes `permanent=true` correctly (only the four routes that store results long-term) | ✅ Resolved and recorded (documentation only — no infrastructure or application change) |

### Review checklist — run this after any of the following

- [ ] Monthly map opens have grown materially (e.g. crossed the next threshold row in §6)
- [ ] Active listing count has grown materially (e.g. crossed 1,000, 5,000; see §6)
- [ ] Any Mapbox, Netlify, or Supabase pricing page has changed
- [ ] Any infrastructure change was made (new token, new caching rule, new rate limit, plan upgrade/downgrade)
- [ ] A planned traffic event is coming (campaign, press, partnership) — check Netlify auto-recharge and Supabase spend-cap settings *before*, not after

**How to update this document rather than recreate it:**
1. Re-measure the live numbers: active listing count and `/api/listings` payload size (raw + gzip) — a simple script against the Supabase tables and the live endpoint, same method used for the 2026-11-26 figures in §1.
2. Re-fetch current pricing for any provider whose page changed, and update §1/§2/§6.
3. Update the §1 "Latest observed usage" block with the new Mapbox Statistics window and date.
4. Add a new row to the §8 change log — don't delete or overwrite prior rows; this document's value is the history.
5. Re-run the §2 projection table only if the per-open geocoding ratio has changed (e.g. once the pending fix in §4 is deployed, recalculate using the new real ratio instead of the ~5× figure).
