# OPT_OUT_LAYERS.md

*The layered consent model for Canary Commons listings — who can be
blocked from listing a business, by whom, and why.*

*This file is the canonical reference for opt-out behavior across
all surfaces (seeder placement, public submit, community submit).
When implementing any flow that touches do_not_list logic, read this
first.*

*Last updated: May 3, 2026*

---

## The core principle

A business being on Canary Commons is a relational gesture, not a
unilateral one. Someone places it; the business may or may not want
to be there; the community may or may not want it there.

Because the gesture is relational, the gesture of *removal* needs to
be relational too. "Take me off" can mean different things depending
on who said it and what they meant. The system honors the difference.

There are two distinct levels of opt-out, with different implications
for who is blocked from re-placing the listing.

---

## Level 1 — Soft opt-out (seeder-block only)

**Trigger:** A steward clicks "Remove Listing" from an outreach email
without claiming the listing. A simple, low-friction "take this off"
gesture. No reason given, no claim, no further interaction.

**What it means:** "I (or someone at this business) don't want to be
contacted through seeder outreach about this listing."

**Who is blocked:**
- All seeders, permanently. No seeder may ever re-place this business.
  No seeder may restart the three-email outreach cycle on this business.
  This is a hard block at the seeder layer.
- The public is NOT blocked. The community submit form remains open
  to this business. If a community member places it, the listing
  comes back — without triggering any outreach cycle, because the
  source is community_submitted, not seeder_placed.

**Why it works this way:**
- The email may have gone to the wrong person at the business.
- The receptionist may have clicked "remove" without checking with
  the owner.
- The person may have been having a bad day.
- The business may genuinely not want strangers (seeders) doing
  outreach about them, but may still want to exist on a community
  map made by people who love them.

Soft opt-out says: "not via this channel." It does not say: "I
never want to exist on the commons."

**What the seeder sees:**
- At placement time: the system silently blocks placement. The seeder
  cannot override. (Soft opt-outs are not overridable by seeders —
  the entire point is that seeders are the channel being closed.)
- On their dashboard: a "Soft opt-outs" dropdown shows businesses
  they placed that have soft-opted-out. Read-only. Closure for the
  outreach attempt.

**What the public sees:**
- Nothing. The public submit form proceeds normally. There is no
  notification, no warning, no override prompt. The block is
  invisible to the public because it does not apply to them.

---

## Level 2 — Hard opt-out (universal block with override)

**Trigger:** A business owner claims the listing (proves they're the
steward), then declares opt-out with a reason. A conscious, attributed,
"we as this business do not want to be on the map" gesture.

**What it means:** "We, as this business, do not want to exist on
Canary Commons. This is a declaration from the business itself."

**Who is blocked:**
- All seeders. (Same as Level 1.)
- The public, with override available. The community submit form
  shows the same "Wait — we have a record on this business" view
  that seeders see, with the option to override-with-reason for
  genuine different-business or new-ownership cases.

**Why it works this way:**
- A claimed opt-out is a verified declaration from the business.
- It still allows for the case where the business changes hands, or
  where two different businesses share a name, or where someone in
  the community knows something the system doesn't.
- The override-with-reason creates a record of the conscious choice
  rather than silently allowing duplicate placement.

**What the seeder sees:**
- At placement time: the existing Stage C override flow. "Wait — we
  have a record on this business" → cancel or place-anyway-with-reason.
- The seeder can override (because the override is for genuine
  different-business cases, not for circumventing the opt-out).

**What the public sees:**
- The same override view, mirroring the seeder experience. Same copy
  pattern: "What we know is this business asked not to be listed.
  If you know something we don't, you can place it anyway." Same
  reason-required override.

---

## Schema

A new field is added to the listings table:

```sql
do_not_list_level TEXT CHECK (do_not_list_level IN ('seeder_only', 'universal')) DEFAULT NULL
```

- `NULL` — no opt-out (default state)
- `'seeder_only'` — Level 1, soft opt-out
- `'universal'` — Level 2, hard opt-out

The existing `do_not_list` boolean stays as a quick-check field
(true when `do_not_list_level IS NOT NULL`). The level field carries
the semantic distinction.

The existing `do_not_list_override` boolean on listings continues to
record when a seeder OR public submitter consciously overrode a
universal block.

---

## Behavioral matrix

| Event                              | do_not_list_level | Seeder placement | Public submission |
|------------------------------------|-------------------|------------------|-------------------|
| No opt-out                         | NULL              | Allowed          | Allowed           |
| Soft opt-out (Email "Remove" click)| 'seeder_only'     | Hard-blocked     | Allowed silently  |
| Hard opt-out (claimed + declared)  | 'universal'       | Override flow    | Override flow     |

---

## Build order

- **Stage C ✓** — Override flow infrastructure built for seeder
  placement (do_not_list_override field, three-view flow, override
  notification copy). Currently treats all do_not_list = true rows
  as universal. The seeder_only level does not yet exist.
- **Stage D** — Lucia's dashboard. Soft opt-outs dropdown displays
  listings she placed where do_not_list_level = 'seeder_only'.
  Read-only at this stage; the schema change is tracked here as
  a Stage G prerequisite.
- **Stage G** — Removal flows. Add do_not_list_level field. Wire
  the soft opt-out path: when a steward clicks "Remove Listing"
  from Email 1 without claiming, set do_not_list_level =
  'seeder_only'. Wire the public submit form to the same override
  view that seeders see, gated on do_not_list_level = 'universal'.
  When a steward claims and then declares opt-out with reason,
  set do_not_list_level = 'universal'.

---

## Why this distinction matters

Most platforms treat "remove me" as a single gesture with a single
meaning. Canary Commons does not, because the platform itself is a
relational instrument, not a directory. A community member's love
for a business is a different thing than a stranger's outreach about
that business. The opt-out system honors that difference.

The seeder layer is closeable without closing the community layer.
The community layer is closeable only by the business itself, and
even then with room for the community to push back consciously when
they know something the record doesn't.

This is a small piece of the larger pattern: guide not control,
reveal not rank, invite not require.
