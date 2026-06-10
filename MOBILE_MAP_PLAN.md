# Mobile Map Redesign — Plan

*Agreed June 2, 2026. Do not build until Ren approves the implementation approach.*

---

## Arrival philosophy

The why behind the mobile build.

Canary Commons has TWO arrival surfaces, divided by one threshold: installing the app to the home screen.

### 1. Orientation (for newcomers, in a browser)

The landing page and About exist to welcome someone, show them what this is and how it feels, and carry them to trust. Their ultimate job is to lead the person to ONE action: add Canary Commons to their home screen. Orientation's destination is the install — not endless browsing.

### 2. Living the light (for the trusted, installed user)

Launched from the home-screen icon, the app opens straight into the living map — map-first, centered on the user's location, nearby lights already glowing. No landing page, no orientation, no preamble. About, The Constellation, Founders, and Home all live in the North Star dropdown menu — always reachable, never in the way.

### The threshold

The home-screen install is the membrane between "I'm oriented" and "now let me live the light." Installing is the user's chosen act of belonging. A returning-visitor cookie is a softer fallback for those who've clearly been here before but haven't installed yet — they get a gentler, faster entry in the browser.

### Design consequence

Every feature has a clear home. If it ORIENTS a newcomer, it belongs in the funnel toward install (landing/About). If it serves the TRUSTED user finding what matters to them, it belongs on the map surface or in the star menu. The PWA-launched experience should differ from the browser-first-visit experience: home-screen launch → straight to located map; fresh browser visit → welcoming front door.

### Guiding intent

Build everything now so it transitions to full app/PWA reality as seamlessly as possible, and soon. The mobile map rebuild IS the installed-app surface — the destination the whole orientation funnel points at. People install what they trust and want to keep; the living located map is that thing.

---

## Goal

On mobile (<768px), the `/map` page should be map-first — map visible by default, controls layered over it — instead of the current sidebar-first two-panel slide system where the map is hidden behind a "View on Map" link. Desktop (≥768px, the `!isMobile` branch) is UNCHANGED. The landing page is UNCHANGED — it stays the orienting front door carrying About + Founders.

## Root cause (confirmed in code)

On mobile the map is passed `visible=false` whenever `mobileView === "browse"`, and `"browse"` is the default. So the map loads but is switched off until the user finds the buried "View on Map →" link. The entire mobile experience is sidebar-first because the sidebar was promoted to full-screen, not because the map doesn't work.

## Flow

Landing page → "Choose a state → Enter" → land directly in the LIVE state map, zoomed above that state, lights glowing across it, county = "All / to be determined." County selection happens AS a map interaction via a floating region bar — not a separate screen.

## Mobile layout

- **Map fills the screen**, full bleed, default-visible (map gets `visible=true` by default on mobile).
- **Region selector** = slim floating bar on top (State ▾ / County ▾); selecting pans/zooms the map, never navigates away.
- **Listings** = bottom drawer over the map; swipe up to browse, tap a listing pulses its light, tap a light scrolls the drawer. "Add a Point of Light" and "Explore Online Resources" live in/near the drawer.
- **Empty county**: map stays visible (region shown dark); drawer says "This county is still waiting for its first light — you could add one." Never a dead text page.
- **North Star menu** floats persistent in the corner as the guide (About, The Constellation, Founders, Home).

## Framing — relocation, not new construction

The mobile rebuild rehouses pieces that already exist and work on desktop — the region selectors (state/county), the "Search this county" input, the listing list, the lit Mapbox map, the North Star menu, and the "Explore Online Resources" door (links to `/support`). None of these are being invented. The mobile build moves them into a layered arrangement: region + search ride a floating bar on top, the listing list becomes a bottom drawer, the map becomes the always-visible hero.

## Search → map decision

Today the county search filters only the listing list (`directHits` / `relatedNearby` / `onlineHits`); the map pins always show all listings for the region. The rebuild WILL wire search results to also narrow the lit pins, so the map field contracts to match the search.

**Rationale:** The lit lights matching the search is orienting and useful — it lets someone see what is around a target area (e.g. places to eat near where they'll be in Portland), not just everything in the county which may be a pain to reach. It serves users who orient by looking rather than reading.

**NOTE:** Because the search input and the map are shared between desktop and mobile, this enhancement applies to BOTH surfaces.

## Keep distinct

The lit map and its drawer are the local living layer (points of light people placed). Online Resources (`/support`) is the separate affiliate/economic layer. Same screen, conceptually distinct — do not blur them.

## Build order

The sequence to take it in:

### Step 1 — Extraction pass

No visual change. Desktop must stay pixel-identical. Extract the listing-card markup (currently copy-pasted in 3 places inside `MapPageClient.tsx`) into one `ListingCard` component, and the two region dropdowns into one `RegionSelector` component. Safe prep; its own step.

### Step 2 — Mobile layout flip + search-dims-pins wire

Map always visible on mobile. Region selector becomes the floating top bar. Listing list + search become the bottom drawer. "Add a Point of Light" and "Explore Online Resources" move into/near the drawer. Retire the old "View on Map →" and "← browse" buttons. Only modify the mobile (truthy `isMobile`) side of each ternary; leave the desktop branch untouched. Wire search hits to the map's pins so the lit field narrows with the search.

### Step 3 — Drawer choreography polish

Swipe-up to browse, tap a listing pulses its light, tap a light scrolls the drawer, empty-county copy ("This county is still waiting for its first light — you could add one."), and the 240px CompassCaption mobile fix.

## Technical notes to heed when building

- **Mapbox black-screen / `map.resize()` (UPDATED after recon)**: The current 50ms-delayed `map.resize()` reveal exists ONLY because the map is suppressed (`visible=false` when `mobileView === "browse"`, the default). In the always-visible rebuild, the visible-effect fires once on mount and the existing `ResizeObserver` handles all later container resizes. The black-screen trap is REDUCED by always-visible, not increased — do not over-fear it in future sessions.
- **CompassCaption bubble**: Currently 240px wide with no mobile handling — on narrow screens it may run off the right edge of the viewport. Address in Step 3.
- **Keep the desktop `!isMobile` branch untouched.** All changes are inside the `isMobile` code paths only.

## Principle

Map-first, text-in-a-drawer. Same ingredients as desktop, layered instead of sequenced.

---

## Current state (for reference)

### Landing page "Enter" routing

`handleEnterPlace()` in `app/page.tsx` pushes to `/map?state={selectedState}`. Same on mobile and desktop — state is passed as a query param, map page reads it via `useSearchParams()`.

### Mobile breakpoint

`useIsMobile()` (`app/lib/useIsMobile.ts`) returns `true` at `max-width: 767px`. This single boolean controls the entire layout switch on the map page.

### Current mobile layout (the problem)

The map page (`app/map/MapPageClient.tsx`) uses a two-panel slide system on mobile:

- **Panel A ("browse")**: The sidebar rendered full-screen (`position: absolute; inset: 0`). Contains state dropdown, county dropdown, search bar, listing cards. This is the DEFAULT view — `mobileView` state initializes to `"browse"`.
- **Panel B ("map")**: The Mapbox GL map rendered full-screen, hidden behind Panel A (`translateX(100%); opacity: 0`). Passed `visible=false` while browse is active.

Only one panel is visible at a time. They slide in/out with a 300ms CSS transition.

### How a mobile user experiences it

1. Land on `/map` → see the **browse panel** (dropdowns + text list). No map visible.
2. Pick a state → county dropdown populates.
3. Pick a county → listings appear as text cards in a scrollable list.
4. Find the "View on Map →" link at the bottom of the listing list (easy to miss).
5. Tap it → slides to the **map panel** with pins.
6. On the map panel, a small "← browse" pill (top-left) returns to the sidebar.

The map is loaded and has pins — but it's hidden on a panel the user has to discover.

### Key files

- `app/map/MapPageClient.tsx` — the two-panel layout, all mobile/desktop branching
- `app/lib/useIsMobile.ts` — the 767px breakpoint
- `app/components/MapClient.tsx` — the Mapbox GL wrapper (receives `visible` prop)
- `app/page.tsx` — landing page, "Enter" routes to `/map?state=...`
