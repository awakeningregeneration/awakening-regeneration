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
