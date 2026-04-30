# Seeder System Design

**Canary Commons — Seeder-placed listings, outreach, attribution, and onboarding**

**Status:** Draft for review
**Date:** April 30, 2026
**Scope:** 3-6 month bridge period during the Founders push; system evolves after.

---

## 1. Why this exists

An empty map asking businesses to populate themselves doesn't work. Most people can't engage with a vision before it becomes tangible. Seeders make the map tangible — they identify and place real businesses doing life-forward work, so when those businesses encounter themselves on the map, the encounter is with something already alive.

Seeders are personal connections, brought in through direct conversation. They are not a public role and there is no application flow. Some may become employees as the project grows; this period is also a getting-to-know-each-other bridge.

---

## 2. The two attribution paths

The system already has one attribution path. We are adding a second. They stay separate.

### 2a. Referral-based (already built)

A seeder shares a referral code. Someone joins as a Founder using that code. The seeder gets 25% recurring for 12 months on monthly subscriptions, 15% one-time on custom contributions. Tracked in `seeder_referrals`.

### 2b. Listing-based (new)

A seeder places a business on the map. The business receives the three-email outreach sequence. If that business becomes a Founder — at any point — the seeder is credited. No date window. No expiration. Tracked in a new table: `seeder_listing_credits`.

These two paths can both apply to the same Founder in edge cases (a seeder lists a business and the business signs up via that same seeder's referral code). The system records both attributions; payout logic deduplicates so the seeder isn't paid twice for the same Founder. Single layer, locked.

---

## 3. Schema additions

### 3a. listings table — new fields

```
source              text NOT NULL DEFAULT 'community_submitted'
                    -- 'seeder_placed' | 'owner_submitted' | 'community_submitted'
placed_by_seeder_id uuid REFERENCES seeders(id)  -- nullable
outreach_status     text DEFAULT 'not_started'
                    -- 'not_started' | 'email_1_sent' | 'email_2_sent'
                    -- | 'email_3_sent' | 'claimed' | 'removed'
                    -- | 'unsubscribed' | 'bounced'
outreach_started_at timestamptz  -- when email 1 fired
last_outreach_at    timestamptz  -- when most recent email fired
```

`steward_email` is reused — it already exists on listings and serves as the outreach address pre-claim and the verified steward address post-claim. No parallel field.

### 3b. seeders table — new fields

```
url_handle              text UNIQUE NOT NULL
                        -- the URL part: 'lucia', 'renee', 'marcus'
active                  boolean DEFAULT true
bio                     text  -- nullable, for their seeder page
orientation_completed_at timestamptz  -- nullable
```

`url_handle` is assigned by Ren at onboarding. Lowercase, no spaces, no special characters. Reserved values (founder, admin, start, api, etc.) blocked at the application layer.

### 3c. New table: seeder_listing_credits

```
id                  uuid PRIMARY KEY
seeder_id           uuid REFERENCES seeders(id) NOT NULL
listing_id          uuid REFERENCES listings(id) NOT NULL
founder_id          uuid REFERENCES founders(id) NOT NULL
amount_cents        integer NOT NULL
payout_status       text DEFAULT 'pending'
                    -- 'pending' | 'paid' | 'voided'
created_at          timestamptz DEFAULT now()
paid_at             timestamptz  -- nullable
notes               text  -- nullable, for manual adjustments
```

Populated by the Founders webhook (see section 8). One row per credit event.

---

## 4. The seeder URL

Each seeder has a personal URL: `canarycommons.org/[url_handle]`.

### 4a. URL structure

```
canarycommons.org/lucia              -> seeder dashboard (auth required)
canarycommons.org/lucia/start        -> orientation (auth required)
canarycommons.org/lucia/place        -> place-a-new-light form (auth required)
canarycommons.org/lucia/map-view     -> cross-seeder county view (auth required)
canarycommons.org/lucia/login        -> magic-link login page (public)
```

### 4b. Authentication

Magic-link pattern, modeled on the existing stewardship token infrastructure:

1. Seeder visits `/lucia/login`, enters their email
2. System verifies the email matches `seeders.email` for that `url_handle`
3. If match: generate single-use token (24-byte `crypto.randomBytes`, base64url, 30-min expiry), store in `seeder_login_tokens` (new small table), email link to seeder
4. Seeder clicks link, lands on `/lucia/auth?token=xxx`
5. System validates token, sets a session cookie (longer expiry — 30 days, refreshable on activity), redirects to `/lucia` (or `/lucia/start` if `orientation_completed_at` is null)

Reuses the token generation logic from `app/lib/stewardshipTokens.ts`.

### 4c. Reserved handles

Block at application layer: founder, founders, admin, start, place, map-view, login, auth, api, support, submit, map, constellation, steward, edit, plus any existing top-level routes. Validated on seeder creation.

---

## 5. Seeder dashboard (/[handle])

What Lucia sees when she logs in.

### 5a. Layout

```
[ Header — Canary Commons logo, "Lucia's Seeder Page", logout ]

Welcome back, Lucia.

[ Place a new light -> ]   (large gold CTA, links to /lucia/place)

---

Your placements (24)

[ Filter: All | Awaiting outreach | In conversation |
          Claimed | Became Founders ]

  Bay Coffee Roasters — Coos County, OR
  Placed Apr 12 . Email 2 sent . No response yet
  [view] [resend] [edit]

  Coos Forest School — Coos County, OR
  Placed Apr 8 . Claimed Apr 14
  [view]

  Empire Wood Studio — Coos County, OR
  Placed Mar 28 . Email 3 sent . No response . Sequence complete
  [view] [edit]

  ...

---

Your credits

  3 placements have become Founders.
  Current month payout: $X.XX
  [ View payout history ]

---

[ See where other seeders are placing -> /lucia/map-view ]

[ Revisit orientation -> /lucia/start ]
```

### 5b. The placements list

Pulled from `listings WHERE placed_by_seeder_id = lucia.id ORDER BY created_at DESC`. Each row shows current `outreach_status`, links to view the public listing, and offers actions appropriate to status (e.g., resend email if bounced, edit if pre-claim).

### 5c. The credits panel

Pulled from `seeder_listing_credits WHERE seeder_id = lucia.id`. Shows count of converted placements, current month's payout, link to history. Quiet — not the focus of the page.

---

## 6. The cross-seeder view (/[handle]/map-view)

Visible to all logged-in seeders. The transparency is intentional and named at onboarding.

### 6a. Layout

```
Where lights are being placed across the country.

[ Filter: All seeders | Just me | All except me ]
[ Sort: County (alphabetical) | Most recent | State ]

---

Coos County, OR (4)
  Bay Coffee Roasters . placed by Marcus . Apr 12
    Email 2 sent . awaiting response
  Coos Forest School . placed by Marcus . Apr 8
    Claimed
  Empire Wood Studio . placed by Lucia . Mar 28
    Sequence complete . no response
  South Coast Seed Library . placed by Renee . Apr 28
    Just placed

Curry County, OR (0)

Deschutes County, OR (12)
  ...
```

### 6b. What seeders can see about each other's placements

- Business name and county
- Which seeder placed it
- Date placed
- Current outreach status (email 1/2/3 sent, claimed, no response, etc.)

### 6c. What seeders cannot see about each other's placements

- Steward email addresses
- Personal notes
- Each other's credits or payout amounts

The view is for coordination, not surveillance. Names are visible. Money is private.

---

## 7. Orientation (/[handle]/start)

Required before placing the first listing. The placement form (`/[handle]/place`) checks `orientation_completed_at` and redirects back to `/start` if null.

### 7a. The seven sections

Written in Ren's voice, in the same key as the three outreach emails. Brief outline:

1. **What Canary Commons is** — A living map of life-supporting work, made visible so it's easier to find, trust, and strengthen. Non-extractive, non-competitive, invitational.
2. **What seeding actually means** — You're identifying real businesses doing real life-forward work, and making them visible. Each light is a relationship opened, not a row added.
3. **Why thoughtfulness is the pay structure** — Direct conversation about money. Seeders earn 25% recurring on monthly Founder subscriptions for 12 months when a placed listing converts. Volume doesn't pay — alignment does.
4. **What makes a placement worth making** — Concrete criteria the seeder can use (real and operating, meaningful alignment, you can describe in 2-3 sentences why they belong, you have a real steward_email, you're willing to stand behind the placement).
5. **Personal outreach is welcome and encouraged** — The three automated emails are the floor, not the ceiling. The system handles businesses you don't have a direct line to. Personal outreach is what turns a placement into a relationship.
6. **What you'll see in your dashboard** — Walk-through of placements list, outreach status, the cross-seeder view (with transparency framed honestly), how credits show up.
7. **The boundaries** — Not sales, not a downline (single layer locked), not volume-based, and not permanent. This role is a bridge for 3-6 months, then evolves.

### 7b. The completion checkbox

At the bottom of `/start`:

```
[ ] I've read this and I'm ready to begin placing lights with care.

[ Begin -> ]   (becomes active when checkbox is checked)
```

On click: sets `seeders.orientation_completed_at = now()`, redirects to `/[handle]`.

The orientation remains accessible from a footer link on the dashboard. Seeders can revisit anytime.

---

## 8. The placement flow (/[handle]/place)

How a logged-in seeder places a new listing.

### 8a. The form

Modeled on the existing `/submit` form, but pre-attributed:

- All existing fields (business name, description, website, address, lat/lng, category, practices, image, etc.)
- `steward_email` is required (not optional as in community submission)
- `source` is set to `'seeder_placed'` automatically
- `placed_by_seeder_id` is set to the logged-in seeder's id automatically

### 8b. On submit

1. Listing is created with `status = 'active'`, `source = 'seeder_placed'`, `outreach_status = 'not_started'`
2. Email 1 fires immediately to `steward_email`
3. `outreach_status` updates to `'email_1_sent'`, `outreach_started_at` and `last_outreach_at` are set
4. Seeder is redirected to their dashboard with confirmation: "Bay Coffee Roasters has been placed. Email 1 has been sent to [email]."

### 8c. Duplicate prevention

Before submission, check if a listing already exists with the same `steward_email` OR same business name + city. If yes, show a warning: "This business may already be on the map — placed by [seeder name] on [date]. Are you sure you want to place it again?" Allow override but discourage.

---

## 9. The outreach state machine

### 9a. Cadence

- **Email 1** — fires immediately on listing creation
- **Email 2** — fires 7-10 days after Email 1, only if `outreach_status` is still `'email_1_sent'`
- **Email 3** — fires 21-30 days after Email 2, only if `outreach_status` is still `'email_2_sent'`

### 9b. Stop conditions

The sequence halts if at any point `outreach_status` becomes:

- `'claimed'` (steward verified via existing stewardship flow)
- `'removed'` (clicked remove link in any email)
- `'unsubscribed'` (clicked unsubscribe link)
- `'bounced'` (Resend webhook reports hard bounce)

### 9c. Implementation

A Netlify scheduled function modeled on `netlify/functions/synonym-digest.mts`. Runs daily (e.g., 9am Pacific). Queries listings due for next email:

```sql
-- Email 2 candidates
SELECT * FROM listings
WHERE source = 'seeder_placed'
  AND outreach_status = 'email_1_sent'
  AND last_outreach_at < now() - interval '7 days'
  AND last_outreach_at > now() - interval '11 days';

-- Email 3 candidates
SELECT * FROM listings
WHERE source = 'seeder_placed'
  AND outreach_status = 'email_2_sent'
  AND last_outreach_at < now() - interval '21 days'
  AND last_outreach_at > now() - interval '31 days';
```

For each candidate: send email via Resend, update `outreach_status` and `last_outreach_at`.

The 11-day and 31-day upper bounds prevent accidentally re-sending if the function fails to run for a few days then catches up — old listings outside the window stop progressing.

### 9d. Email templates

Three new templates in `app/lib/emails/`:

- `seederOutreach1.ts` — Recognition + Claim (already drafted)
- `seederOutreach2.ts` — Visibility + Story (already drafted)
- `seederOutreach3.ts` — Stewardship + Support (already drafted)

Two typos to fix in the drafts before templating:
- Email 1: "you're early support" -> "your early support"
- Email 1: "your work is a valued" -> "your work is valued"

Each email includes:

- **[ Claim / View Listing ]** link -> existing stewardship claim flow at `/steward/claim?listing=xxx`
- **[ Help Carry the Commons ]** link -> `/founders/join?listing=xxx&seeder=lucia` (carries attribution metadata into Stripe)
- **[ Remove Listing ]** link -> `/listings/[id]/remove?token=xxx` (new, see section 11)
- Unsubscribe link in footer

---

## 10. The "thank the seeder" gesture

On `/steward/verify/success` — the page a business lands on after verifying their claim email — extend the existing flow:

### 10a. The condition

Only show this gesture if the claimed listing has `source = 'seeder_placed'` and `placed_by_seeder_id IS NOT NULL`.

### 10b. The UI

```
You've claimed your listing.

[Seeder name] placed this listing because they saw your work
and thought it belonged. Would you like to send them a quick thank you?

[ Pre-filled message — editable ]

  Hi [seeder first name],
  Thank you for placing my business on Canary Commons.
  It means something to be seen.
  -- [Steward name]

[ Send thank you ]   [ Skip ]
```

### 10c. The route

The thank-you message is sent via Resend to the seeder's email. The reply-to is set to a Canary Commons routing address (not the steward's direct email) — protects both sides early in the relationship. If the seeder wants to respond, they can choose to reply with their own contact details.

Default state is "no message sent." This is opt-in, not opt-out. Skipping is fully honored — no nag, no follow-up.

---

## 11. The remove path

Each of the three outreach emails contains a [ Remove Listing ] link.

### 11a. Token generation

When Email 1 fires, a removal token is generated (24-byte `crypto.randomBytes`, base64url, no expiry — these tokens last as long as the listing exists pre-claim) and stored in a new field `listings.removal_token` (text, nullable). The link in all three emails uses the same token.

### 11b. The flow

1. Steward clicks [ Remove Listing ] link -> lands on `/listings/[id]/remove?token=xxx`
2. System validates token matches `listings.removal_token`
3. Page shows: "You're about to remove [Business Name] from Canary Commons. This is final. No further emails will be sent. Are you sure?" with two buttons: [ Yes, remove ] [ Keep listing ]
4. On confirm: `listings.status = 'removed'`, `outreach_status = 'removed'`, `removal_token = NULL`
5. Confirmation page: "Your listing has been removed. Thank you for your work, regardless. — Canary Commons"

### 11c. Post-sequence removal

After all three emails have been sent, the only remove path is via claiming the listing first (existing stewardship flow), then deleting. This is intentional — three emails were ignored, so engagement is required to remove. Community flagging (existing system, with "Closed or no longer active" reason already available) is the other path for stale listings.

---

## 12. The Founders webhook extension

### 12a. The new logic

When the Stripe webhook fires for a successful Founder checkout:

1. Existing logic runs (insert into founders, handle referral code if present)
2. New: Check if the customer's email matches any listing where `source = 'seeder_placed'` AND `status != 'removed'`
3. If a match exists:
   - Insert a row into `seeder_listing_credits` with the seeder, listing, founder, and amount
   - The amount is calculated using the same logic as `seeder_referrals` — 25% of the monthly subscription, recurring for 12 months
4. If both a referral code AND a placement match exist for the same seeder, only one credit is recorded (deduplication: prefer the placement attribution since it represents the earlier act of seeing)
5. If a referral code points to one seeder and a placement points to a different seeder, both attributions are recorded — but the system flags this for Ren's review before payout (rare edge case, deserves a human look)

### 12b. The payout flow

`seeder_listing_credits` payouts are processed monthly alongside `seeder_referrals` payouts. Same cadence, same Stripe Connect mechanism (or whatever the existing payout method is). Single seeder dashboard view in `/[handle]` shows credits from both sources.

---

## 13. Onboarding

Stays discretionary. No public application. No self-serve seeder signup.

### 13a. The flow

1. Ren has a personal conversation with a potential seeder
2. If aligned, Ren manually creates the seeder record in Supabase Studio:
   - name, email, url_handle, active = true
   - orientation_completed_at = NULL
3. Ren sends them a personal email with their seeder URL and a link to `/[handle]/login`
4. Seeder requests a magic link, logs in, lands on `/[handle]/start` (orientation)
5. Seeder reads orientation, checks the box, lands on dashboard, places first light

### 13b. The onboarding email

A new template: `seederWelcome.ts`, sent manually by Ren or triggered when the seeder record is created.

```
Subject: Your seeder page is ready

Hello [Name],

Your seeder page for Canary Commons is live at:
canarycommons.org/[handle]

This is yours — your dashboard, your orientation,
your view into where lights are being placed across the country.

To log in for the first time, request a magic link here:
canarycommons.org/[handle]/login

When you arrive, you'll find an orientation that walks
through what this work is and how it's held. Read it
before you place your first light.

Thank you for saying yes to this.

-- Ren
```

---

## 14. What's reused vs. what's new

### 14a. Reused directly

- Token generation (`app/lib/stewardshipTokens.ts`)
- Domain matching (`app/lib/domainMatch.ts`) — for the "Is this yours?" claim flow
- Resend infrastructure (`app/lib/resend.ts`)
- Existing email templates (`stewardVerification.ts`, `stewardEditLink.ts`, `welcomeFounder.ts`)
- Existing stewardship claim flow (`/api/steward/*` routes, `/steward/verify/success` page)
- Existing flag system (already has "Closed or no longer active" reason)
- Existing Founders flow (`/founders/join`, checkout API, webhook)
- Existing `seeder_referrals` table and payout logic
- Netlify scheduled function pattern (`netlify/functions/synonym-digest.mts`)

### 14b. Extended

- `listings` table — five new fields (section 3a)
- `seeders` table — four new fields (section 3b)
- Founders webhook — adds listing-attribution check (section 12)
- `/steward/verify/success` page — adds "thank the seeder" gesture, gated on source (section 10)
- Stripe checkout metadata — passes `listing_id` and `seeder_handle` from outreach email links (section 9d)

### 14c. Built fresh

- New table: `seeder_listing_credits` (section 3c)
- New table: `seeder_login_tokens` (section 4b)
- Seeder URL routing: `/[handle]`, `/[handle]/start`, `/[handle]/place`, `/[handle]/map-view`, `/[handle]/login`, `/[handle]/auth`
- Magic-link login flow for seeders (section 4b)
- Seeder dashboard UI (section 5)
- Cross-seeder view UI (section 6)
- Orientation page UI + completion gating (section 7)
- Place-a-new-light form (section 8)
- Outreach scheduled function (section 9c)
- Three outreach email templates (section 9d)
- Remove path: token, route, page (section 11)
- "Thank the seeder" route + email template (section 10)
- Onboarding email template (section 13b)
- Reserved handle blocklist validation (section 4c)

---

## 15. Build order (proposed)

When this is ready to build, suggested phasing:

**Phase 1 — Foundation**
- Schema additions (listings, seeders, seeder_listing_credits, seeder_login_tokens)
- Reserved handle validation
- Magic-link login flow + seeder auth middleware

**Phase 2 — Seeder surfaces**
- `/[handle]` dashboard (basic — placements list only)
- `/[handle]/start` orientation page (with Ren's copy)
- `/[handle]/place` form
- Orientation gating on placement form

**Phase 3 — Outreach**
- Three email templates
- Email-1-on-create trigger
- Outreach scheduled function (handles emails 2 and 3)
- Remove token + remove flow

**Phase 4 — Attribution**
- Founders webhook extension
- Credits panel on dashboard
- Payout integration

**Phase 5 — Coordination**
- Cross-seeder view (`/[handle]/map-view`)
- "Thank the seeder" gesture on `/steward/verify/success`
- Onboarding email template

Phases 1-3 are the minimum to start placing lights. Phase 4 is required before any Founder credits accrue. Phase 5 adds the coordination and relational layers.

---

## 16. Open questions

These are not blocking but worth deciding before build begins:

1. **Payout cadence** — monthly via Stripe Connect, or another method? The existing `seeder_referrals` system has `payouts_paid` (0-12) suggesting monthly. Confirm `seeder_listing_credits` follows the same.
2. **Edge case: seeder removes themselves** — if a seeder becomes inactive or asks to be removed, do existing credits keep accruing? My read: yes, the work was real. Confirm.
3. **Edge case: listing edited by another seeder** — current schema doesn't track this. Original `placed_by_seeder_id` retains attribution. Probably fine for the bridge period.
4. **Magic-link session duration** — proposed 30 days, refreshable on activity. Confirm or adjust.
5. **The thank-you message routing address** — needs a Canary Commons email like `connect@canarycommons.org` for relay. Confirm or pick a different address.

---

*End of design doc.*
