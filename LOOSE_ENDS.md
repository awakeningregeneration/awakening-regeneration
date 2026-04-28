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
