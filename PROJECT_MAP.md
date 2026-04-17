# Canary Commons — Project Map

**Purpose:** Static architecture atlas. What IS this system, structurally. Rarely changes. For current work in progress, see PROJECT_STATE.md.

**Last updated:** April 16, 2026

---

## Stack overview

**Frontend / Server framework:** Next.js 16.2.2 (App Router)

**Language:** TypeScript

**External services:**
- **Netlify** — hosting and deploys (project: amazing-cajeta-67dce9, domain www.canarycommons.org)
- **Supabase** — database (project ID: lzqlmzqjpztnzgriqyok)
- **Stripe** — payment processing (product: Foundation Builder, prod_UKCE3Byr37Hz0Z)
- **Resend** — transactional email (sender: founder@canarycommons.org)
- **Mapbox** — map tiles and geocoding
- **Cloudflare** — DNS, SSL, email routing (forwards canarycommons.org addresses to Proton)

**Key npm packages:**
- `next@^16.2.2` — framework
- `react@19.2.0`, `react-dom@19.2.0` — UI
- `stripe@^22.0.2` — Stripe Node SDK
- `@supabase/supabase-js@^2.98.0` — Supabase client
- `resend@^6.10.0` — Resend email SDK
- `mapbox-gl@^3.17.0` — Mapbox GL JS
- `tailwindcss@^4` — utility CSS

---

## Environment variables (.env.local)

Names only — values are never stored in this file.

| Variable | Scope | Service |
|---|---|---|
| NEXT_PUBLIC_MAPBOX_TOKEN | client | Mapbox |
| NEXT_PUBLIC_SUPABASE_URL | client | Supabase |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | client | Supabase |
| SUPABASE_URL | server | Supabase (duplicate of public URL) |
| SUPABASE_SERVICE_ROLE_KEY | server | Supabase |
| RESEND_API_KEY | server | Resend |
| STRIPE_SECRET_KEY | server | Stripe |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | client | Stripe |
| STRIPE_PRICE_TIER_1 | server | Stripe ($9/mo price ID) |
| STRIPE_PRICE_TIER_2 | server | Stripe ($18/mo price ID) |
| STRIPE_PRICE_TIER_3 | server | Stripe ($27/mo price ID) |
| STRIPE_WEBHOOK_SECRET | server | Stripe (webhook signing) |

---

## Page structure (app routes)

### /
- **File:** app/page.tsx
- **Purpose:** Landing page. State selector → enter the map. Headline "Connected, We Dawn Brighter." with ThresholdMap background.

### /about
- **File:** app/about/page.tsx
- **Purpose:** About the project — what it is, why it exists, what belongs here, how to participate. Deep sky atmosphere.

### /map
- **File:** app/map/page.tsx (Suspense wrapper) + app/map/MapPageClient.tsx (main UI)
- **Purpose:** Interactive Mapbox map with sidebar. State/county dropdowns, listing cards with image tiles, Story of Place, affiliate handoff, constellation bubble. Dark navy sidebar.

### /submit
- **File:** app/submit/page.tsx (Suspense wrapper) + app/submit/SubmitPageClient.tsx (form)
- **Purpose:** "Reveal a point of light" — public form to add a listing to the map. POSTs to /api/listings with geocoding.

### /edit/[id]
- **File:** app/edit/[id]/page.tsx
- **Purpose:** Suggest an edit to an existing listing. POSTs to /api/listings/edit.

### /support
- **File:** app/support/page.tsx
- **Purpose:** Affiliate resource directory. Featured rotation (date-seeded), search + category filter, unmet-needs capture. Deep night sky atmosphere.

### /support/submit
- **File:** app/support/submit/page.tsx
- **Purpose:** Public form to submit an affiliate resource. POSTs to /api/affiliates. Morning sky atmosphere.

### /stories
- **File:** app/stories/page.tsx
- **Purpose:** Stories of place — rose/thorn storytelling for a specific region. Server component, fetches from /api/stories. Dusk atmosphere with 40 tiered light points.

### /stories/submit
- **File:** app/stories/submit/page.tsx (Suspense wrapper) + app/stories/submit/StoriesSubmitPageClient.tsx (form)
- **Purpose:** Submit a story. POSTs to /api/stories. Morning sky atmosphere.

### /constellation
- **File:** app/constellation/page.tsx
- **Purpose:** Drifting pill field of global inspiration signals. Client component, fetches from /api/constellation. 120-star field, search bar, category filter, detail overlay with image tile. Deepest register (#050e1a).

### /constellation/submit
- **File:** app/constellation/submit/page.tsx
- **Purpose:** Submit a signal to the constellation. POSTs to /api/constellation. Morning sky atmosphere.

### /founders
- **File:** app/founders/page.tsx
- **Purpose:** "Become a Founder" overview with info cards. Passes ?ref= forward. Deep sky with 40-orb emission halo field.

### /founders/join
- **File:** app/founders/join/page.tsx
- **Purpose:** Founder orientation + tier selection ($9/$18/$27). "Join the Foundation" button → POST to /api/checkout → redirect to Stripe Checkout. Captures ?ref= as referral code.

### /founders/confirmation
- **File:** app/founders/confirmation/page.tsx
- **Purpose:** Post-checkout landing. "You're in. This is already happening." Reads referral_code from localStorage. Morning sky atmosphere.

### /contributor
- **File:** app/contributor/page.tsx
- **Purpose:** Lucia's contributor dashboard. Fetches from /api/contributor. Shows all submitted affiliate resources with status.

### /contributor/submit
- **File:** app/contributor/submit/page.tsx
- **Purpose:** Lucia's internal form. Submits with contributor_id="contributor_001", contributor_name="Lucia", status="approved". Morning sky atmosphere.

### /participate
- **File:** app/participate/page.tsx
- **Purpose:** MVP participate/submit form (local-only, session-based). Morning sky atmosphere.

---

## API routes

### GET /api/listings
- **File:** app/api/listings/route.ts
- **Purpose:** Returns all active listings from `listings` table. Uses anon key.

### POST /api/listings
- **File:** app/api/listings/route.ts
- **Purpose:** Creates a new listing. Normalizes state/county/city, geocodes via Mapbox, inserts with status="active". Accepts image_url (conditional spread).

### POST /api/listings/edit
- **File:** app/api/listings/edit/route.ts
- **Purpose:** Submits a suggested edit for an existing listing.

### POST /api/listings/flag
- **File:** app/api/listings/flag/route.ts
- **Purpose:** Flags a listing. Community moderation — listings auto-hide at 5 flags.

### GET /api/affiliates
- **File:** app/api/affiliates/route.ts
- **Purpose:** Returns all approved affiliate resources from `affiliate_resources` table.

### POST /api/affiliates
- **File:** app/api/affiliates/route.ts
- **Purpose:** Submits a new affiliate resource. Status is "pending" for public submissions, "approved" for contributor submissions (when contributor_id is present). Accepts image_url (conditional spread).

### GET /api/contributor
- **File:** app/api/contributor/route.ts
- **Purpose:** Returns all affiliate resources for contributor_001 (Lucia's dashboard).

### GET /api/constellation
- **File:** app/api/constellation/route.ts
- **Purpose:** Returns all constellation signals, ordered by created_at desc.

### POST /api/constellation
- **File:** app/api/constellation/route.ts
- **Purpose:** Submits a new constellation signal (title, description, region, category, practices, link).

### GET /api/stories
- **File:** app/api/stories/route.ts
- **Purpose:** Returns stories, optionally filtered by state/county query params.

### POST /api/stories
- **File:** app/api/stories/route.ts
- **Purpose:** Submits a new story of place.

### POST /api/founders
- **File:** app/api/founders/route.ts
- **Purpose:** Legacy founder interest form submission (pre-Stripe). Inserts into founders table.

### POST /api/unmet-needs
- **File:** app/api/unmet-needs/route.ts
- **Purpose:** Captures unmet search needs from the support directory when no results are found.

### POST /api/checkout
- **File:** app/api/checkout/route.ts
- **Purpose:** Creates a Stripe Checkout Session. Accepts { tier, oneTimeAmount?, referralCode? }. Returns { url } for redirect to Stripe.

### POST /api/stripe/webhook
- **File:** app/api/stripe/webhook/route.ts
- **Purpose:** Stripe webhook receiver. Handles checkout.session.completed (writes founders + seeder_referrals, sends welcome email via Resend) and customer.subscription.deleted (marks records canceled).

---

## Shared library files

### app/lib/supabaseAdmin.ts
- Supabase admin client using SUPABASE_SERVICE_ROLE_KEY. No session persistence. Used by webhook handler and other server-side operations.

### app/lib/supabase.ts
- Exports `supabasePublic` (browser-safe, anon key) and `supabaseServer` (service role, server-only).

### app/lib/resend.ts
- Resend client instance and `FROM_EMAIL` constant ("Ren at Canary Commons <founder@canarycommons.org>").

### app/lib/emails/welcomeFounder.ts
- Welcome email template. Returns { subject, html, text }. Ren's letter — exact wording. Gold CTA button to /map.

### lib/getListingImage.ts
- Image URL resolver. Priority: image_url → Google favicon from website domain → null. Used by ListingImageTile, SidebarList, MapClient popup.

### lib/supabaseAdmin.ts
- Empty file (0 bytes). Appears to be a leftover — the real admin client is at app/lib/supabaseAdmin.ts.

---

## Shared components

### app/components/MapClient.tsx
- Mapbox GL JS map component. Renders markers with animated glow, builds popups via DOM APIs with star-field backdrop and React-mounted ListingImageTile. Handles flag modal. Injects CSS for marker and popup styling.

### app/components/ListingImageTile.tsx
- Shared image tile. Props: imageUrl, name, size (sm/md/lg). Shows image with onError fallback to gold initials tile.

### app/components/SidebarList.tsx
- Sidebar listing component with search + category filter. Uses ListingImageTile at sm size. Currently only referenced by MapWithSidebar.tsx (not in use by the live /map route).

### app/components/ThresholdMap.tsx
- Homepage backdrop. Non-interactive Mapbox map at zoom 3.2 with warm gold light overlay and faint background points.

---

## Type definitions

### types/listing.ts
- `Listing` type with id, name, title, category, description, website, city, state, county, lng, lat, focus, invitation, status, flag_count, image_url, practices, createdAt.
- `Invitation` union type.

### types/constellation.ts
- `ConstellationSignal` type with id, title, description, region, category, link, practices, image_url, created_at.

### types/founder.ts
- (verify — may be empty or minimal)

### types/supportResource.ts
- (verify — 0 bytes)

### types/story.ts
- (verify — 0 bytes)

### app/types/listing.ts
- Parallel `Listing` type (simpler — fewer fields than top-level types/listing.ts).

### app/types/supportResource.ts
- `SupportResource` type with id, title, category, description, whyItMatters, websiteUrl, affiliateUrl, tags, image_url.

### app/types/stories.ts
- Story type definitions.

---

## Data files

### data/allCounties.ts
- Complete US county dataset. `Record<string, string[]>` keyed by state name. 51 states (50 + DC), 3,143 counties. Generated from US Census national_county2020.txt.

### data/californiaCounties.ts
- 58 California counties as a flat string array. Predates allCounties.ts. Still used as the California branch in MapPageClient.tsx.

### data/mockListings.ts, data/mockStories.ts, data/risingConstellation.ts, data/supportResources.ts
- Legacy mock/seed data files from early development. May still be referenced by MapWithSidebar.tsx (dead code path).

---

## Supabase tables

### founders
People who sign up as Founders via Stripe.
- id, name, email, city, state, why, referral_code, referred_by, status, created_at
- Stripe columns: tier, amount, stripe_customer_id (unique), stripe_subscription_id, subscription_status

### seeders
People who refer Founders in. Compensated per payout model.
- id, name, email, referral_code (unique), active, created_at

### seeder_referrals
Links a seeder to a founder they brought in. Drives payout tracking.
- id, seeder_id (FK→seeders), founder_email, founder_name, stripe_customer_id, month_joined, status, created_at
- Payout columns: tier, amount (cents), payout_amount (cents, 25% of amount), payouts_paid (0–12)

### listings
Map data — the "points of light."
- id, title, description, website, address, city, state, county, category, practices, lng, lat, status, flag_count, image_url, created_at

### listing_edits
Suggested edits to listings, pending review.

### listing_flags
Community flags on listings.

### affiliate_resources
The support directory entries.
- id, name, description, url, category, practices, status, created_at
- Contributor columns: contributor_id, contributor_name, affiliate_url, why_it_matters, image_url, logo_url

### constellation
Global inspiration signals.
- id, title, description, region, category, link, practices, image_url, created_at

### stories
Stories of place.
- id, state, county, title, body, link, created_at

### unmet_needs
Captured search terms when support directory returns no results.
- id, search_term, category, created_at

### Other tables (verify)
- affiliate_partners, affiliate_stewards — may be empty or legacy
- resources, support_resources — may overlap with affiliate_resources

---

## Dead code / cleanup candidates

- **app/map/MapWithSidebar.tsx** — alternative map layout using SidebarList + mockListings. Not imported by any live route.
- **app/components/FlagListingButton.tsx/** — an empty directory (not a file). Should be `rmdir`'d.
- **lib/supabaseAdmin.ts** — 0-byte file. Real admin client is at app/lib/supabaseAdmin.ts.
- **lib/supabaseAdmin.tscd, lib/supabaseAdmin.tsnpm** — junk files from shell typos.
- **types/story.ts, types/supportResource.ts** — 0-byte placeholder files. Real types are in app/types/.
- **data/mockListings.ts, data/mockStories.ts, data/risingConstellation.ts, data/supportResources.ts** — legacy seed data, likely unused by live routes.
- **5 test rows in founders table** — name="AR", status="pending", from early April.

---

## Visual registers

The site uses four distinct visual atmospheres:

1. **Deep night sky** (#08192d) — /about, /support, /founders, /founders/join. Warm gold emission halo orbs, radial-gradient atmosphere layers, glassy dark cards.

2. **Dusk** (#112952) — /stories. Slightly lighter blue, brighter orbs, three-tier star field with inner cores on brightest.

3. **Deepest void** (#050e1a) — /constellation. Darkest register. 120-star three-tier field, drifting entry pills with inner luminosity.

4. **Morning sky** (radial gradient from pale blue to deep blue) — all form/submit pages. White glassy cards, gold practice pills, gold submit buttons, 12 fixed warm orbs.

5. **Map sidebar** (linear gradient navy) — /map sidebar panel. 10 flat gold orbs, gold-accented region selector, dark listing cards.

6. **Homepage** — radial gradient blue with ThresholdMap backdrop. Gold headline accent. Unique register.
