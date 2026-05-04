"use client";

/**
 * Three email preview components for the orientation page modals.
 * Button-styled elements are visual only — non-functional in modal context.
 * Content matches the exact email copy from the design doc.
 */

const goldPill: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 22px",
  borderRadius: 999,
  background: "#FFD86B",
  color: "#1a2a0e",
  fontWeight: 700,
  fontSize: 14,
  textDecoration: "none",
  cursor: "default",
  margin: "8px 0",
};

const subtlePill: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 18px",
  borderRadius: 999,
  border: "1px solid rgba(138,109,42,0.3)",
  background: "rgba(255,248,230,0.3)",
  color: "#8a6d2a",
  fontWeight: 600,
  fontSize: 13,
  textDecoration: "none",
  cursor: "default",
  margin: "8px 0",
};

const bodyText: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.7,
  color: "#1a2a3a",
  margin: "0 0 14px",
};

const subjectLine: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#8a6d2a",
  letterSpacing: "0.06em",
  marginBottom: 16,
};

const ornament: React.CSSProperties = {
  textAlign: "center" as const,
  color: "rgba(138,109,42,0.3)",
  fontSize: 18,
  letterSpacing: "0.5em",
  margin: "24px 0 8px",
};

const footer: React.CSSProperties = {
  fontSize: 13,
  color: "#6a7a8a",
  lineHeight: 1.6,
  marginTop: 20,
  fontStyle: "italic",
};

export function Email1Recognition() {
  return (
    <div>
      <div style={subjectLine}>Subject: You have been noticed</div>

      <p style={bodyText}>Hello [Business Name],</p>

      <p style={bodyText}>
        We know unsolicited email can be frustrating. We&apos;re reaching out
        only because your work was added to a public community resource, and we
        wanted to give you full control over how (or whether) it appears.
      </p>

      <p style={bodyText}>
        Someone in your community came across what you&apos;re doing and added
        your business to Canary Commons — a living map of people, places, and
        projects helping make life-forward choices more visible, actionable, and
        easier to find.
      </p>

      <p style={bodyText}>
        This project exists to make the things choosing life forward — for
        ourselves, and for those who come after — visible, actionable, and
        supportable, so the work already happening in communities is easier to
        find, easier to trust, and easier to strengthen.
      </p>

      <p style={bodyText}>Your listing is now live here:</p>

      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <span style={goldPill}>Claim / View Listing</span>
      </div>

      <p style={bodyText}>
        You&apos;re welcome to leave it as it is. You&apos;re also welcome to
        claim it, refine it, or shape how your work appears on the map.
      </p>

      <p style={bodyText}>From here, you can:</p>
      <ul style={{ ...bodyText, paddingLeft: 20, marginBottom: 14 }}>
        <li>claim or refine your listing</li>
        <li>share more about your work</li>
        <li>participate in how your community defines life forward</li>
      </ul>

      <p style={bodyText}>
        Canary Commons is being built as a non-competitive public commons. Your
        listing here is free to keep, free to shape, and never reduced for
        choosing not to contribute. Contribution does not buy placement,
        priority, or reach.
      </p>

      <p style={bodyText}>
        This work takes real resource to build. Canary Commons is grass-roots-funded
        by people who recognize what it is and want to help carry it through its
        early growth. That help is a bridge — not the beginning, not the destination
        — meant to steady the work until it can be carried by the communities it
        serves.
      </p>

      <p style={bodyText}>
        If this feels worth helping carry, your early support is appreciated:
      </p>

      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <span style={goldPill}>Help Carry the Commons</span>
      </div>

      <p style={bodyText}>
        And if this doesn&apos;t feel like a fit, you can remove your listing at
        any time — no explanation needed.
      </p>

      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <span style={subtlePill}>Remove Listing</span>
      </div>

      <p style={bodyText}>
        Whether you stay listed here or not, your work is valued for representing
        choices that future generations will be thankful for.
      </p>

      <p style={bodyText}>
        With respect,
        <br />
        Canary Commons
      </p>

      <p style={footer}>
        This is one of three brief notes from CC. You don&apos;t need to do
        anything. Not doing anything at all is fine, you are already listed, and
        you&apos;ll hear from us no more than two more times.
      </p>

      <div style={ornament}>❋ &nbsp; ❋ &nbsp; ❋</div>
    </div>
  );
}

export function Email2Visibility() {
  return (
    <div>
      <div style={subjectLine}>Subject: Help shape what people find when they find you</div>

      <p style={bodyText}>Hello [Business Name],</p>

      <p style={bodyText}>
        Reaching out, briefly. Canary Commons is growing — a living map of
        people, places, and projects helping make life-forward choices visible,
        actionable, and supportable, so we can all step toward a healthier future
        for ourselves and for those who come after.
      </p>

      <p style={bodyText}>Your listing is part of that growing map.</p>

      <p style={bodyText}>
        As more people begin using it to find local businesses, trusted services,
        and aligned work in their region, the strongest listings will be the ones
        shaped by the people doing the work themselves.
      </p>

      <p style={bodyText}>
        If you&apos;d like, this is a good moment to refine your listing and
        share a little more about what people should know when they find you.
      </p>

      <p style={bodyText}>You can:</p>
      <ul style={{ ...bodyText, paddingLeft: 20, marginBottom: 14 }}>
        <li>update your listing</li>
        <li>clarify what you offer</li>
        <li>share your story</li>
        <li>help people understand what makes your work meaningful</li>
      </ul>

      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <span style={goldPill}>Refine Your Listing</span>
      </div>

      <p style={bodyText}>
        Your listing remains free whether or not you contribute. Canary Commons
        is non-competitive — businesses here are not ranked against one another,
        and contribution does not buy greater visibility. The aim is not to
        compete for attention. It&apos;s to make life-serving work easier to find.
      </p>

      <p style={bodyText}>
        If helping carry the project through its early growth feels worthwhile,
        that bridge keeps it independent and public until it can stand on its own.
      </p>

      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <span style={goldPill}>Help Carry the Commons</span>
      </div>

      <p style={bodyText}>
        And if it&apos;s not a fit, you can remove your listing at any time.
      </p>

      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <span style={subtlePill}>Remove Listing</span>
      </div>

      <p style={bodyText}>
        Thank you for all you are doing to inhabit the planet and community in a
        thoughtful way.
      </p>

      <p style={bodyText}>
        &mdash; Canary Commons
      </p>

      <p style={footer}>
        This is the second of three brief notes. You&apos;ll hear from us once
        more, and then no further. Not acting is honored — your listing stays
        exactly as it is, free as it has always been.
      </p>

      <div style={ornament}>❋ &nbsp; ❋ &nbsp; ❋</div>
    </div>
  );
}

export function Email3Stewardship() {
  return (
    <div>
      <div style={subjectLine}>Subject: Help strengthen what this is becoming</div>

      <p style={bodyText}>Hello [Business Name],</p>

      <p style={bodyText}>
        A last note from us. Canary Commons was built to make the things choosing
        life forward — for ourselves and for those who come after — easier to
        find, easier to trust, and easier to support.
      </p>

      <p style={bodyText}>
        Not by asking communities to start from scratch — but by helping make
        visible what is already being done, and making it easier for people to
        find and strengthen it.
      </p>

      <p style={bodyText}>Your listing is part of that effort.</p>

      <p style={bodyText}>
        Some businesses simply stay visible here. Some refine their listing. Some
        share their story. Some choose to help carry the work itself.
      </p>

      <p style={bodyText}>
        If this feels aligned with the kind of future you&apos;re helping build,
        there are a few ways to take part:
      </p>
      <ul style={{ ...bodyText, paddingLeft: 20, marginBottom: 14 }}>
        <li>claim and shape your listing</li>
        <li>share your story</li>
        <li>help carry forward what your community is choosing</li>
      </ul>

      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <span style={goldPill}>Choose How to Participate</span>
      </div>

      <p style={bodyText}>
        Canary Commons is free to be part of, and your place here is not
        contingent on contribution. Contribution does not buy placement,
        priority, or reach. It helps carry a non-competitive public commons
        through its early growth — a bridge until the work can be carried by the
        communities it serves.
      </p>

      <p style={bodyText}>
        This project is grass-roots-funded by people who recognize what it is. If
        that feels like you, your help matters.
      </p>

      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <span style={goldPill}>Help Carry the Commons</span>
      </div>

      <p style={bodyText}>
        Thank you for contributing to the kind of world this project was built to
        make easier to find.
      </p>

      <p style={bodyText}>
        With thanks,
        <br />
        Canary Commons
      </p>

      <p style={footer}>
        This is the last of three brief notes. You won&apos;t hear from us again
        unless you choose to engage. You are always welcome to participate.
      </p>

      <div style={ornament}>❋ &nbsp; ❋ &nbsp; ❋</div>
    </div>
  );
}
