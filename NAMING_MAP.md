# Canary Commons — Naming Map

*Reference doc for understanding the naming relationships in the Online Resources system.*

*Last updated: April 25, 2026*

---

## The core concept

"Online Resources" is a directory of web-based, affiliate-eligible offerings that align with Canary Commons' values. Users browse, search, and filter these resources. Contributors (currently just Lucia) can submit resources that bypass the review queue.

The system has one data model but multiple names across different layers. This doc maps them so you don't have to guess which name refers to which.

---

## Name mapping

| Layer | Name | Why |
|-------|------|-----|
| **User-facing** (nav, headings, UI copy) | **Online Resources** | Unified in April 2026. This is what users see everywhere. |
| **Database table** | `affiliate_resources` | Original name from when the system was called "affiliate resources." Kept to avoid a migration and to preserve existing data. |
| **API endpoint** | `/api/affiliates` (GET and POST) | Matches the database table name. Renaming would break any external integrations. |
| **Route path** | `/support` and `/support/submit` | Original URL path from when the page was called "support resources." Kept to avoid breaking any external links or bookmarks. |
| **TypeScript type** | `OnlineResource` | Renamed from `SupportResource` in April 2026 for clarity. Defined inline in `app/support/page.tsx`. |
| **Contributor flow** | `/contributor` and `/contributor/submit` | Lucia's privileged submission path. Same `affiliate_resources` table, but submissions auto-approve and carry `contributor_id`. |
| **Contributor API** | `/api/contributor` (GET) | Returns rows from `affiliate_resources` where `contributor_id = "contributor_001"`. Scoped view of the same data. |

---

## Why the names diverge

Internal names (table, API, route) stayed put to protect data integrity and avoid breaking external links. User-facing language was unified to "Online Resources" because that's what the concept actually is — resources available online, not tied to a physical location on the map.

The system is not two separate things. It's one table (`affiliate_resources`) with two entry points:
- **Public** (`/support/submit`): submits with `status: "pending"`, requires approval
- **Contributor** (`/contributor/submit`): submits with `status: "approved"`, auto-published

Both feed the same display page at `/support`.

---

## Ghost tables (unused in code)

These tables exist in Supabase but are never read from or written to by any code in this repo:

- **`support_resources`** — Likely from an earlier iteration before the system consolidated on `affiliate_resources`. Pending investigation: check if it holds data worth migrating, then drop.
- **`affiliate_partners`** — Purpose unclear. May have been intended for a partner/vendor relationship model that was never built. Pending investigation: check row count and schema, then decide.

Do not drop these without first checking their contents in Supabase.

---

## Contributor model

Currently single-contributor:
- **Lucia** is the only contributor, hardcoded as `contributor_id: "contributor_001"`, `contributor_name: "Lucia"`
- The `/contributor` dashboard is scoped to her ID
- If contributors expand beyond Lucia, the model will need auth and dynamic contributor IDs

---

## If you're renaming things

- **Safe to rename**: TypeScript types, variable names, UI copy, component names — anything that doesn't touch the database or URLs
- **Rename with caution**: API paths (`/api/affiliates`) — check for external consumers first
- **Don't rename without migration**: database table (`affiliate_resources`) — existing data and queries depend on it
- **Don't rename without redirects**: route paths (`/support`) — external links may point here
