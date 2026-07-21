# Canary Commons — Listing Research & Bulk Placement Guidelines

## 1. What Qualifies

A listing qualifies if it matches one or more of the 27 canonical practice tags built into the platform:

Organic, Regenerative, Permaculture, Fair Trade, Biodegradable, Compostable, Recycled Materials, Upcycled Materials, Low Waste, Zero Waste, Local, Worker-Owned / Cooperative, Community Owned, Renewable Energy, Educational, Accessible / Sliding Scale, Volunteer Run, Nonprofit / Mission Driven, Indigenous Led, Women Led, Trauma-Informed, Restorative, Somatic, Nonviolent, Peer Supported, Community Led, Justice-Oriented.

**Weighting principle:** When choosing which candidates to research and place, lean proportionally toward everyday-use categories — Food & Nourishment, Materials & Goods, Health & Wellbeing, places people reach for daily (coffee shops, thrift stores, grocers, cafes) — over categories that read as advocacy or mission-showcase (e.g. Conflict Transformation & Repair, Finance & Systems). The goal is a map someone opens thinking "heading out for coffee, let's see who's organic and fair trade nearby" — not a map that only surfaces "here's who's protecting the environment today." Both matter; everyday-use just shouldn't be crowded out.

---

## 2. Research Checklist Per Listing

- **Confirm the business is actually located where you think it is.** A past incident placed a business in the wrong city entirely — verify the address before drafting.
- **Look for a verified public email if possible.** If none exists, flag it for the `no_public_email` workflow instead of leaving `steward_email` blank incorrectly.
- **Note unusual name formatting** (accented characters, etc.) — this is a flag to be aware of for search/matching, not a reason to exclude a listing.

---

## 3. Bulk JSON Structure

Bulk placement happens at `/[handle]/place/bulk` — paste a JSON array (max 50 items), reviewed as editable cards, placed one at a time via `/api/seeder/place-listing`.

### Example

```json
[
  {
    "business_name": "Example Place",
    "description": "A short description of the place, at least 10 characters.",
    "category": ["Food & Nourishment"],
    "practices": ["Organic", "Local"],
    "city": "Ashland",
    "state": "Oregon",
    "address": "123 Main St, Ashland, OR 97520",
    "website": "https://example.com",
    "steward_email": "owner@example.com",
    "no_public_email": false
  }
]
```

### Fields

| Field | Required | Rules |
|---|---|---|
| `business_name` | Yes | 2–200 chars. `title` also works as an alias. `name` does **NOT** work despite old docs saying so. |
| `description` | Yes | 10–2000 chars. |
| `category` | Yes | Array, 1+ values from the 11 canonical categories (see below). |
| `practices` | Yes | Array, 1+ values from the 27 canonical practices listed in Section 1. |
| `city` | Yes | Min 2 chars, Title Case (e.g. `"Ashland"`). |
| `state` | Yes | Full name, Title Case (e.g. `"Oregon"`, not `"OR"`). |
| `address` | Yes (UI) | Required by the UI to enable placement. Fed to Mapbox geocoding — a bad address produces a 400 error. |
| `website` | No | If present, must be a parseable URL. Auto-prepends `https://` if no scheme is provided. |
| `steward_email` | No | If present, must contain `@` and `.`. If valid and `no_public_email` is false, Email 1 fires automatically on placement. |
| `no_public_email` | No | Boolean, default `false`. Set `true` to suppress outreach email even when `steward_email` is set. |

### The 11 canonical categories

Food & Nourishment, Home & Shelter, Health & Wellbeing, Energy & Infrastructure, Land & Ecology, Materials & Goods, Learning & Education, Travel & Movement, Community & Culture, Conflict Transformation & Repair, Finance & Systems.

### Critical traps

- **Silent stripping of invalid values.** Category and practice values that don't exactly match the canonical lists are silently stripped at parse time. You'll end up with an empty array and hit an API error ("at least 1 required") with no clear indication why. Double-check spelling and casing against the canonical lists above.
- **County is not supplied in the JSON.** It is derived automatically from Mapbox geocoding off the address. Always verify after placement that the assigned county matches reality — a slightly-off address can silently produce the wrong county.

---

## 4. Placement Path

Always place through the seeder dashboard / placement form as a seeder — never the public `/submit` route. Using `/submit` assigns the wrong source tag (`community_submitted` instead of `seeder_placed`) and leaves `placed_by_seeder_id` null, requiring manual database correction.

---

## 5. Do-Not-List Check

Before insertion, the system checks for any existing listing where `do_not_list = true` matching on `normalized_name` + `city`. If matched, the bulk tool blocks placement with no override option. If you hit this and believe the placement should be overridden, use the single-placement form at `/[handle]/place` instead — it has an override flow.
