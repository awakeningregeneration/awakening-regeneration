# Archived homepage — pre "Follow the Canary" (2026-10-07)

This is a snapshot of the Canary Commons homepage (`/`) exactly as it existed
immediately before work began on the new "Follow the Canary" homepage
concept (constellation-formation hero, new copy/CTA). It was taken for
reference and easy rollback — not because anything was being deleted.

The live site was **not changed** when this archive was created. It's a
copy, taken at git commit `7b5e2714b59a42f21bf9f01bd28c031ad2f249a3`
(`main`, "Save constellation-Canary homepage prototypes (WIP, not live)").
That commit (and everything before it) still has these exact files in their
original locations, so this archive is also fully redundant with git
history — it just makes the "before" state easy to find and read without
digging through `git log`.

## What's in here

```
app/page.tsx                     — the homepage component itself
app/components/ThresholdMap.tsx  — the decorative background map, used
                                    only by the homepage (verified via
                                    grep: no other page imports it)
app/layout.tsx.reference         — the root layout the homepage rendered
                                    inside of (shared by every page — see
                                    note below)
public/canary-logo-new.png       — the logo image the homepage displays
                                    (also a shared asset — see note below)
```

All four files are **byte-identical copies** of what was live in the
working tree at archive time (verified with `diff`/`shasum` before
committing this archive).

## What the old homepage actually was

`app/page.tsx` rendered:
- A full-bleed decorative sky (gradient layers + small gold "orb" divs)
  with `<ThresholdMap />` as a Mapbox-based animated backdrop showing
  ~30 hardcoded glow points across the continental US (decorative only —
  not real listing data, no click handlers).
- The Canary Commons logo (`canary-logo-new.png`).
- An "ABOUT" link to `/about`.
- The headline "MAKE A DIFFERENCE WITH EVERY CHOICE" and the line "See
  what's rising around you, near and far."
- A state `<select>` + "Enter" button that pushed to `/map?state=<chosen>`.
- A Caveat-font reflective line ("Still spreading beneath the surface...").
- A "Stewardship" button linking to `/founders`.

Everything else about the page (the `STATES` list, styling, layout) lives
entirely inside `app/page.tsx` itself — it has no other dependent files
beyond the two above.

## What's shared, not homepage-exclusive

- **`app/layout.tsx`** wraps every page on the site (fonts, metadata,
  `<NorthStarNav />`). It is included here only as a **reference** copy
  (renamed `.reference` so it's never mistaken for something to restore
  directly) — restoring the old homepage does not mean restoring this
  file, since it still serves the current site unchanged.
- **`public/canary-logo-new.png`** is used by ~10 other pages (`/about`,
  `/letter`, `/stories`, `/support`, login, etc.) as well as the old
  homepage. It is not going anywhere as part of this redesign; it's
  included here purely so this archive is self-contained for recreating
  the old homepage's visuals without having to cross-reference the live
  `public/` directory.

## How to restore the old homepage later, if wanted

1. Copy `app/page.tsx` from this archive back to the real `app/page.tsx`.
2. Copy `app/components/ThresholdMap.tsx` from this archive back to the
   real `app/components/ThresholdMap.tsx` (only needed if that file has
   since been changed or removed for the new homepage).
3. Leave `app/layout.tsx` and `public/canary-logo-new.png` alone — they're
   shared and should already be in place from the live site.
4. Rebuild (`npm run build`) and verify `/` renders as before.

Equivalently: `git checkout 7b5e2714b59a42f21bf9f01bd28c031ad2f249a3 -- app/page.tsx app/components/ThresholdMap.tsx`
restores the same two files directly from git history.
