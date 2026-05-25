# Bulk Placement JSON Reference

The bulk placement tool lives at `/[handle]/place/bulk` (e.g.,
`/ren/place/bulk`). It accepts a JSON array of listing objects
pasted into a textarea, parses them into editable review cards,
and places each one individually through the standard seeder
placement pipeline at `/api/seeder/place-listing`.

---

## Required fields

| Key | Type | Notes |
|-----|------|-------|
| `business_name` | string | Also accepts `title` as alias |
| `description` | string | At least 10 characters |
| `address` | string | Full street address |
| `city` | string | Required separately — not derived from address |
| `state` | string | Full state name (e.g., "Oregon" not "OR") |
| `category` | string[] | At least one required. Must be from the canonical list below. Max 5. |

## Optional fields

| Key | Type | Notes |
|-----|------|-------|
| `website` | string | URL of the business |
| `steward_email` | string | If present and non-empty, Email 1 fires on placement (unless no_public_email is true) |
| `practices` | string[] | Must be from the canonical list below. Non-matching values are silently stripped at parse time. |
| `no_public_email` | boolean | If true, listing is marked as contact-form-only. Email 1 will not fire even if steward_email is populated. Default: false. |

---

## Canonical CATEGORIES (11 values)

These are the only accepted category strings. Anything else
is silently stripped at parse time.

```
Food & Nourishment
Home & Shelter
Health & Wellbeing
Energy & Infrastructure
Land & Ecology
Materials & Goods
Learning & Education
Travel & Movement
Community & Culture
Conflict Transformation & Repair
Finance & Systems
```

## Canonical PRACTICES (27 values)

These are the only accepted practice strings. Anything else
is silently stripped at parse time.

```
Organic
Regenerative
Permaculture
Fair Trade
Biodegradable
Compostable
Recycled Materials
Upcycled Materials
Low Waste
Zero Waste
Local
Worker-Owned / Cooperative
Community Owned
Renewable Energy
Educational
Accessible / Sliding Scale
Volunteer Run
Nonprofit / Mission Driven
Indigenous Led
Women Led
Trauma-Informed
Restorative
Somatic
Nonviolent
Peer Supported
Community Led
Justice-Oriented
```

---

## Example: single listing

```json
[
  {
    "business_name": "A Leap of Taste",
    "description": "Downtown café and grocery sourcing locally from regional farms. Community gathering space with rotating local art.",
    "category": ["Food & Nourishment"],
    "practices": ["Local", "Community Owned"],
    "city": "Klamath Falls",
    "state": "Oregon",
    "address": "907 Main St, Klamath Falls, OR 97601",
    "website": "https://aleapoftaste.com",
    "steward_email": "hello@aleapoftaste.com"
  }
]
```

## Example: three listings in a batch

```json
[
  {
    "business_name": "Sunridge Farm",
    "description": "Family-run regenerative farm offering CSA shares and farm-stand produce. Practices no-till, cover cropping, and rotational grazing.",
    "category": ["Food & Nourishment", "Land & Ecology"],
    "practices": ["Regenerative", "Organic", "Local"],
    "city": "Talent",
    "state": "Oregon",
    "address": "1234 Wagner Creek Rd, Talent, OR 97540",
    "website": "https://sunridgefarm.example.com",
    "steward_email": "info@sunridgefarm.example.com"
  },
  {
    "business_name": "Rogue Repair Collective",
    "description": "Volunteer-run repair café fixing bikes, electronics, and small appliances. Free, donation-based.",
    "category": ["Materials & Goods", "Community & Culture"],
    "practices": ["Low Waste", "Volunteer Run", "Community Led", "Accessible / Sliding Scale"],
    "city": "Medford",
    "state": "Oregon",
    "address": "312 E Main St, Medford, OR 97501"
  },
  {
    "business_name": "Siskiyou Wellness Center",
    "description": "Integrative health practice offering acupuncture, herbal medicine, and somatic bodywork on a sliding scale.",
    "category": ["Health & Wellbeing"],
    "practices": ["Somatic", "Accessible / Sliding Scale", "Trauma-Informed"],
    "city": "Ashland",
    "state": "Oregon",
    "address": "45 N Main St, Ashland, OR 97520",
    "website": "https://siskiyouwellness.example.com",
    "steward_email": "hello@siskiyouwellness.example.com"
  }
]
```

---

## Notes

- **Maximum 50 listings per batch.** The parser rejects arrays
  longer than 50.

- **Invalid category and practice strings are silently stripped
  at parse time**, not flagged as errors. If the pasted JSON
  contains `"practices": ["Local Sourcing"]`, the card renders
  with practices=[] (no pills selected) because "Local Sourcing"
  is not in the canonical list. The seeder can then click valid
  pills to add practices.

- **steward_email is optional.** If omitted or empty, the listing
  is placed with `outreach_status = 'not_started'` and Email 1
  does not fire. The "Send Email 1 now" button on the seeder
  dashboard can trigger it later after a steward email is added.

- **The parser accepts `business_name`, `title`, or `name`** as
  the name field. All three map to the listing's `title` column
  in the database.

- **city and state must be separate fields.** The geocoder uses
  them independently. Do not rely on the address string to
  provide city/state — they must be explicit.

- **state should be the full name** (e.g., "Oregon"), not the
  abbreviation ("OR"). The API normalizes abbreviations but
  the full name is preferred.
