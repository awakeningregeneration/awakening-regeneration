# Email Rewrite Drafts — May 19 2026

Working drafts for the three-email steward outreach cadence. 
These will replace the current copy in:

- app/lib/emails/seederOutreach1Recognition.ts
- app/lib/emails/seederOutreach2Visibility.ts  
- app/lib/emails/seederOutreach3Stewardship.ts
- app/components/EmailModals.tsx (Email1Recognition, 
  Email2Visibility, Email3Stewardship)

## Cadence change to apply at same time:

Current: Email 1 at Day 0, Email 2 at Day 7, Email 3 at Day 21
New: Email 1 at Day 0, Email 2 at Day 28, Email 3 at Day 42

File to change for cadence: 
netlify/functions/seeder-outreach.mts

Currently filters:
- Email 2: outreach_started_at <= 7 days ago
- Email 3: last_outreach_at <= 14 days ago

Change to:
- Email 2: outreach_started_at <= 28 days ago
- Email 3: last_outreach_at <= 14 days ago (unchanged — 14 days 
  after Email 2 = Day 42 total)

---

## EMAIL 1 — Recognition + Claim (FINAL)

**Subject:** You have been noticed

Hello [Business Name],

Someone in your community came across what you're doing and added your business to Canary Commons — a living map of people, places, and projects helping make life-forward choices more visible, actionable, and easier to find.

As the map fills in, it becomes a downloadable app that helps people find what cares for the long term — for the body, the land, the community — wherever they are. The more the map grows, the more useful it becomes: travelers find aligned places in new towns, locals discover what they didn't know was right around the corner, and the small businesses doing the meaningful work become easier to find by the people who are actively looking for them.

This project exists to make the things choosing life forward — for ourselves, and for those who come after — visible, actionable, and supportable, so the work already happening in communities is easier to find, easier to trust, and easier to strengthen.

Your listing is now live here:

[Claim / View Listing]

You're welcome to leave it as it is. You're also welcome to claim it, refine it, or shape how your work appears on the map.

From here, you can:
- claim or refine your listing
- share more about your work
- participate in how your community defines life forward

Canary Commons is being built as a non-competitive public commons. Your listing here is free to keep, free to shape, and never reduced for choosing not to contribute. Contribution does not buy placement, priority, or reach.

This work takes real resource to build. Canary Commons is grass-roots-funded by people who recognize what it is and want to help carry it through its early growth. That help is a bridge — not the beginning, not the destination — meant to steady the work until it can be carried by the communities it serves.

If this feels worth helping carry, your early support is appreciated:

[Help Carry the Commons]

And if this doesn't feel like a fit, you can remove your listing at any time — no explanation needed.

[Remove Listing]

Whether you stay listed here or not, your work is valued for representing choices that future generations will be thankful for.

With respect,
Canary Commons

www.canarycommons.org
founder@canarycommons.org

*This is one of three brief notes from CC, spaced over six weeks. You don't need to do anything. Not doing anything at all is fine, you are already listed, and you'll hear from us no more than two more times.*

❋ ❋ ❋

---

## EMAIL 2 — Visibility + Story (FINAL)

**Subject:** Help shape what people find when they find you

Hello [Business Name],

A second brief note. Canary Commons is growing — a living map of people, places, and projects helping make life-forward choices visible, actionable, and supportable, so we can all step toward a healthier future for ourselves and for those who come after.

Your listing is part of that growing map.

It's hard to find small places doing great things. Both the people doing the work and the people looking for it have been on opposite sides of that same gap. Canary Commons is being built to close it — for both sides.

As the map fills in, what's on it becomes findable. Travelers passing through can locate aligned places they'd otherwise never know about. Locals can discover what's been right around the corner all along. And the businesses already doing meaningful work get reached by the people actively looking for them — not through advertising, not through algorithms, but through a map that's just trying to make the good already happening easier to find.

As more people begin using Canary Commons to find local businesses, trusted services, and aligned work in their region, the strongest listings will be the ones shaped by the people doing the work themselves.

If you'd like, this is a good moment to refine your listing and share a little more about what people should know when they find you.

You can:
- update your listing
- clarify what you offer
- share your story
- help people understand what makes your work meaningful

[Refine Your Listing]

Your listing remains free whether or not you contribute. Canary Commons is non-competitive — businesses here are not ranked against one another, and contribution does not buy greater visibility. The aim is not to compete for attention. It's to make life-serving work easier to find.

If helping carry the project through its early growth feels worthwhile, that bridge keeps it independent and public until it can stand on its own.

[Help Carry the Commons]

And if it's not a fit, you can remove your listing at any time.

[Remove Listing]

*This is the second of three emails. If you don't do anything at all, your listing will remain on the map.*

Thank you for all you are doing to inhabit the planet and community in a thoughtful way.

— Canary Commons

www.canarycommons.org
founder@canarycommons.org

❋ ❋ ❋

## EMAIL 3 — Stewardship + Support (FINAL)

**Subject:** Help strengthen what this is becoming

Hello [Business Name],

A last note from us. Canary Commons was built to make the things choosing life forward — for ourselves and for those who come after — easier to find, easier to trust, and easier to support.

Not by asking communities to start from scratch — but by helping make visible what is already being done, and making it easier for people to find and strengthen it.

The map is filling in. As it does, it becomes a downloadable app that helps people find what cares for the long term — for the body, the land, the community — wherever they are. The small places doing meaningful work get reached by the people actively looking for them. The seekers find what's been hard to find.

Your listing is part of that effort.

Some businesses simply stay visible here. Some refine their listing. Some share their story. Some choose to help carry the work itself.

If this feels aligned with the kind of future you're helping build, there are a few ways to take part:
- claim and shape your listing
- share your story
- help carry forward what your community is choosing

[Choose How to Participate]

Canary Commons is free to be part of, and your place here is not contingent on contribution. Contribution does not buy placement, priority, or reach. It helps carry a non-competitive public commons through its early growth — a bridge until the work can be carried by the communities it serves.

This project is grass-roots-funded by people who recognize what it is. If that feels like you, your help matters.

[Help Carry the Commons]

*This is the last of three emails. If you don't do anything at all, your listing will remain on the map. You won't hear from us again unless you choose to engage. You are always welcome to participate.*

Thank you for contributing to the kind of world this project was built to make easier to find.

With thanks,
Canary Commons

www.canarycommons.org
founder@canarycommons.org

❋ ❋ ❋
