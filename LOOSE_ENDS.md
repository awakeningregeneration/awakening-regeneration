# Canary Commons — Loose Ends

*Running list of consciously deferred work. Anything postponed during a session lands here. Items graduate to PROJECT_STATE.md when they become active, or get deleted when they're no longer relevant.*

*Last updated: April 28, 2026*

---

- [ ] Revisit client-side affiliate filter approach if affiliate_resources crosses ~150 records
- [ ] State-level "All counties" search — different feature, separate design
- [ ] Synonym data shape — current flat string[] in synonym_groups.terms may evolve to weighted associations if needed; getSynonyms signature is the stable interface
- [ ] Watch logs for "tool library", "seed library", "library of things" searches — currently only partial match via Group 34 (learning & education); may warrant their own group or cross-group additions if traffic appears
- [ ] Add indexes on search_logs (created_at) and search_logs (search_term) before monthly aggregation gets slow — currently fine at low volume, worth doing before month three of real data
- [ ] Add BEFORE UPDATE trigger on synonym_groups to auto-bump updated_at when terms array is edited directly in Supabase Studio (current trigger handles this for the "grouped" approval path, but not for manual edits to existing groups)
- [ ] Move SUPABASE_PROJECT_REF from hardcoded value in netlify/functions/synonym-digest.mts to an env var. Currently fine because there's one Supabase project; revisit if staging is added.
- [ ] Verify Supabase Studio deep-link filter syntax (?filter=status%3Deq%3Apending) actually lands on a filtered view of pending candidates after first cron run on May 1. If not, adjust URL format.
- [ ] Founders referral URL cleanup — Lucia's current referral link is clunky; propose /[handle]/join redirect pattern that mirrors seeder dashboard URL. Phase 4 work, not blocking. (See SEEDER_SYSTEM_DESIGN.md §12.)
- [ ] Base URL extraction to env var — https://www.canarycommons.org is currently hardcoded in stewardship and seeder login email templates. Extract to NEXT_PUBLIC_SITE_URL or similar env var. Low priority cleanup.
- [ ] seederAuth.ts / dashboard verifyPayload duplication — the dashboard page (app/[handle]/page.tsx) duplicates verifyPayload logic from seederAuth.ts because Server Components use cookies() from next/headers, while seederAuth expects a Request object. Phase 2 refactor opportunity: extract to a shared utility that accepts either source.
- [ ] Magic-link round-trip test — Phase 1 deployed Apr 30 verified at page-load level (login form renders correctly at /lucia/login), but the full round-trip (submit form -> email arrives -> click link -> land on dashboard with valid session) is pending Lucia's availability to test on her real account.
