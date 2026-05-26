# Seeder Research Workflow

*How Ren and Claude work together to populate the Canary Commons
map with new listings via the bulk placement tool. Follow this
workflow every time Ren says "let's add some listings" or similar
— do not rebuild the process from scratch each session.*

---

## The workflow

When Ren wants to populate a region or theme, Claude:

1. **Researches the region/theme** — Claude does the legwork,
   not Ren.

2. **Surfaces candidates with EVERYDAY PRACTICAL as the
   predominant weight.** The map becomes useful when people can
   find what they actually use day to day:
   - Farmers markets, food co-ops, CSA pickups
   - Restaurants (from-scratch, locally-sourced, ethnic, seasonal)
   - Grocery stores, refill stores, bulk goods, butchers,
     fishmongers
   - Bakeries, cafes, coffee roasters
   - Thrift, consignment, sustainable clothing, repair shops
   - Bodywork, herbalism, acupuncture, somatic practitioners
   - Bookstores, record stores, makers' markets
   - Hardware/tool repair, cobblers, tailors
   - Anywhere people go on a Tuesday afternoon

3. **NONPROFITS AND COMMUNITY ORGS are part of the ecosystem
   and belong on the map** — land trusts, community gardens,
   food rescue orgs, repair cafes, tool libraries, mutual aid
   networks, watershed councils. Include them, but they should
   not be the bulk of any given batch. Rough mix per region:
   about 70-80% everyday practical businesses, 20-30%
   nonprofits/community orgs. The map's first job is daily
   usefulness; the orgs add the connective tissue.

4. **For each candidate, Claude provides:**
   - Business name
   - Website URL (clickable link so Ren can visually verify it)
   - City
   - One-line read on why it matches (what makes it life-forward)

5. **Ren scans the list and tells Claude which are yes.**

6. **Claude then produces ready-to-paste JSON** in the exact
   format documented in BULK_PLACEMENT_JSON.md, with city and
   state as explicit keys, full state name (not abbreviation),
   category and practices arrays drawn only from the canonical
   lists, and steward_email populated where it's publicly
   available OR no_public_email: true where it's
   contact-form-only.

7. **Ren pastes the JSON** into /[handle]/place/bulk and places
   each through the review cards.

---

## What Claude must NOT do

- Do not ask Ren to make the list. Ren wants Claude to research.
- Do not let nonprofits dominate the batch — keep them a
  minority share.
- Do not rebuild this workflow every session — read this file
  first.
- Do not produce JSON until Ren has confirmed which candidates
  are yes.
- Do not skip the website link — Ren needs to visually verify
  each one before approving.

---

## What Claude SHOULD do

- Bring forward 8-15 candidates per region in a single research
  pass so Ren has enough to scan and pick from.
- Use web_search liberally — finding good listings is what the
  tool is for.
- When listing candidates, format as a numbered list with name,
  link, city, one-line note. Not a table. Easy to scan.
- After Ren approves a subset, produce the JSON in a single
  fenced code block ready to paste.

---

## Connection to other docs

- **BULK_PLACEMENT_JSON.md** at repo root is the canonical JSON
  shape reference.
- **PROJECT_STATE.md** tracks project state.
- **LOOSE_ENDS.md** tracks deferred work.
- **This file (SEEDER_RESEARCH_WORKFLOW.md)** is the working
  pattern for populating the map.
