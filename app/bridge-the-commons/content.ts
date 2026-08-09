// Bridge the Commons — slide + companion copy.
// Image mapping confirmed via pptx slide rels:
//   slide1→image1.jpeg, slide2→image2.jpg, …slide13→image13.jpg
// All images placed as /public/bridge/slideN.jpg.
//
// slideText: array of absolutely-positioned text boxes extracted from the source .pptx.
//   top / left / width / height — fractions of slide dimensions (0–1), from top_pct/left_pct/
//     width_pct/height_pct in slide-text-config.json. Negative left values and width > 1
//     are PPTX overhangs beyond the slide edge; overflow:hidden on the hero clips them.
//   fontSizeRatio — fontSizeRatioToSlideWidth from config. Rendering: fontSize = fontSizeRatio × containerWidthPx.
//   Slide canvas: 13.333in wide × 7.5in tall (960pt × 540pt).
//   All text color is white (deck theme bg1 = #FFFFFF).
//   Default font: Calibri/sans. Slide 10 uses Times New Roman/serif.
//   Line strings are preserved exactly from config, including trailing/leading spaces.

export interface SlideBox {
  lines: string[];          // each element is one hard-authored line
  fontSizeRatio: number;    // fontSize = fontSizeRatio × containerWidthPx
  bold: boolean;
  italic: boolean;
  align: "center" | "left";
  top: number;              // fraction of slide height (top_pct)
  left: number;             // fraction of slide width  (left_pct, can be negative)
  width: number;            // fraction of slide width  (width_pct)
  height: number;           // fraction of slide height (height_pct)
  vcenter?: boolean;        // vertically center content within box (slide 10's oversized box)
  font?: "serif";           // omit = Calibri/sans; "serif" = Times New Roman
  adjustments?: {
    topOffsetPct?: number;          // added to top after base calc; + = nudge down
    horizontalPaddingPct?: number;  // padding on each side as fraction of container width
    fontSizeMultiplier?: number;    // multiplied against fontSizeRatio; default 1
    lineHeight?: number;            // overrides default 1.1 line-height
  };
  accentWords?: string[];           // words/phrases to render in gold (#FFD86B)
}

export interface BridgeSection {
  num: number;
  slideText: SlideBox[];
  title: string;
  body: string[];
  quote?: string;
  scrim?: "left" | "bottom";  // directional gradient scrim layered on top of the base overlay
}

export interface ClosingSection {
  heading: string;
  body: string[];
}

export const bridgeSections: BridgeSection[] = [
  // ── SLIDE 1 ─────────────────────────────────────────────────────────────
  {
    num: 1,
    slideText: [
      {
        lines: [
          "It is time to remember that ",
          "attention is the first act of creation.",
        ],
        fontSizeRatio: 0.05,
        bold: true,
        italic: false,
        align: "center",
        top: 0.0917, left: -0.0218, width: 1.0218, height: 0.52,
        adjustments: { topOffsetPct: 0.20 },
      },
      {
        lines: ["Where our attention goes, energy follows."],
        fontSizeRatio: 0.0375,
        bold: false,
        italic: true,
        align: "center",
        top: 0.8889, left: -0.042, width: 1.0325, height: 0.0933,
      },
    ],
    title: "Attention Is the First Act of Creation",
    body: [
      "Attention is an active force, and where we place it becomes what we nourish.",
      "Nothing enters our care until it first enters our awareness. The more we attend to something, the more we support it — and the more of our life is given to it, for better or worse.",
      "Much of our attention today is pulled, interrupted, sold. Yet beneath that remains a real freedom: we can still choose where we place it — and in doing so, shape not only our own life, but the world we build together.",
    ],
    quote: "\u201CAttention is the rarest and purest form of generosity.\u201D — Simone Weil",
  },

  // ── SLIDE 2 ─────────────────────────────────────────────────────────────
  {
    num: 2,
    slideText: [
      {
        lines: ["Life grows where we give ", "our attention."],
        fontSizeRatio: 0.04583,
        bold: false,
        italic: false,
        align: "center",
        top: 0.1667, left: -0.0045, width: 0.9704, height: 0.2667,
        adjustments: { fontSizeMultiplier: 1.12 },
      },
      {
        lines: ["What happens to children deprived of attention?"],
        fontSizeRatio: 0.02292,
        bold: false,
        italic: true,
        align: "center",
        top: 0.8427, left: 0.0, width: 1.004, height: 0.0623,
        adjustments: { fontSizeMultiplier: 1.12 },
      },
    ],
    title: "The Gift of Attention",
    body: [
      "We \u201Cpay\u201D attention \u2014 the phrase itself tells us something: attention is precious, and finite.",
      "A child flourishes because someone is present. A garden thrives because someone tends it. Friendships deepen because they\u2019re nourished. Communities grow resilient because people keep caring for them.",
      "Attention precedes participation. What we tend, grows. What we neglect, fades. If this is true of a child, a garden, a friendship \u2014 what might it mean for a civilization?",
    ],
    quote: "Entire economies compete for our attention. It is mined, harvested, and directed toward what depletes the world we depend on.",
  },

  // ── SLIDE 3 ─────────────────────────────────────────────────────────────
  {
    num: 3,
    slideText: [
      {
        lines: ["Entire economies compete  ", "for our attention."],
        fontSizeRatio: 0.06042,
        bold: false,
        italic: false,
        align: "center",
        top: 0.0627, left: 0.0, width: 0.9986, height: 0.2712,
      },
      {
        lines: [
          "It is mined, harvested, and directed toward what ",
          "depletes the world we depend on.",
        ],
        fontSizeRatio: 0.04375,
        bold: false,
        italic: true,
        align: "center",
        top: 0.7972, left: 0.0, width: 1.0193, height: 0.2,
        adjustments: { topOffsetPct: 0.03 },
      },
    ],
    title: "What Happens When Attention Becomes Commodity",
    body: [
      "Attention shapes what gets built \u2014 not because it can be bought, but because it determines what follows: time, choices, culture.",
      "This is why nearly every modern institution \u2014 advertising, news, entertainment, politics, social media \u2014 competes for it. Attention has become one of the defining currencies of our age.",
      "Most of us no longer experience our attention as something we consciously give. It\u2019s requested, interrupted, redirected \u2014 rarely asked, only claimed.",
      "Attention itself isn\u2019t the problem. The question is who\u2019s directing it.",
    ],
  },

  // ── SLIDE 4 ─────────────────────────────────────────────────────────────
  {
    num: 4,
    slideText: [
      {
        lines: ["What we cannot see, we cannot support."],
        fontSizeRatio: 0.04583,
        bold: false,
        italic: false,
        align: "center",
        top: 0.1425, left: 0.0, width: 0.9893, height: 0.1121,
      },
      {
        lines: [
          "Where our attention isn\u2019t, is as important as where it is.",
          "We can take  back the power of our attention.",
        ],
        fontSizeRatio: 0.0375,
        bold: false,
        italic: true,
        align: "center",
        top: 0.7453, left: -0.0108, width: 1.0001, height: 0.1733,
      },
    ],
    title: "The Cost of Invisibility",
    body: [
      "Attention is finite. Every place we look is also countless places we are not looking. Each act of attention is also an act of omission. What remains unseen rarely has the opportunity to be chosen, supported, or sustained.",
      "Every year, thoughtful businesses, regenerative farms, neighborhood organizations, technologies that rewrite energy and health, and many a creative solution quietly disappear — not always because they failed, but because they never became visible enough to gather the support they needed.",
      "They did not lack value. They lacked visibility.",
      "How many answers already exist beyond the edge of our awareness? How many people are quietly repairing the world without ever becoming visible enough for others to find them? How many possibilities disappear before they ever have the chance to mature?",
      "Perhaps the greatest cost of the attention economy is not simply that some things receive too much attention. It is that so many life-giving things receive almost none.",
      "What if the greatest resource we have been missing is not innovation... but visibility?",
    ],
  },

  // ── SLIDE 5 ─────────────────────────────────────────────────────────────
  {
    num: 5,
    slideText: [
      {
        lines: [
          "What if most of the solutions we need...",
          "already exist?",
        ],
        fontSizeRatio: 0.04583,
        bold: true,
        italic: false,
        align: "center",
        top: 0.0, left: 0.0, width: 0.9865, height: 0.2513,
      },
      {
        lines: ["We simply can\u2019t find them."],
        fontSizeRatio: 0.0375,
        bold: false,
        italic: true,
        align: "center",
        top: 0.8176, left: 0.0, width: 1.0, height: 0.0943,
      },
    ],
    title: "What If the Answers Already Exist?",
    body: [
      "The future is shaped not only by what we create, but by what we choose to notice, support, and strengthen.",
      "What if many of the answers we are searching for already exist? What if new ways of restoring land, building community, producing energy, growing food, healing relationships, and creating healthier local economies are already quietly taking root?",
      "Many of these answers are not hidden because they lack value. They are hidden because they lack visibility and an advertising budget.",
      "Perhaps our greatest opportunity is not to invent an entirely new world, but to recognize, strengthen, and connect the one already engaged, innovative, and emerging around us.",
      "If we wish to live in another world, we begin by giving the world we wish to live in, our attention.",
    ],
  },

  // ── SLIDE 6 ─────────────────────────────────────────────────────────────
  {
    num: 6,
    slideText: [
      {
        lines: [
          "Imagine if the many different ways ",
          "people are already giving",
          "back to the whole\u2026.",
        ],
        fontSizeRatio: 0.04583,
        bold: false,
        italic: false,
        align: "center",
        top: 0.1117, left: 0.0, width: 1.0835, height: 0.4081,
      },
      {
        lines: ["Were simply easier to find\u2026"],
        fontSizeRatio: 0.04583,
        bold: false,
        italic: true,
        align: "center",
        top: 0.7311, left: 0.0, width: 1.0643, height: 0.1112,
      },
    ],
    title: "A Forest Holds Many",
    body: [
      "Healthy systems are not built on sameness. Nature has never depended upon one answer. A healthy forest is not sustained by a single species of tree. It is sustained by countless relationships between many different forms of life.",
      "Remove that diversity, and what appears strong becomes fragile. A mono crop falls to a mono pest. Human communities are no different. The small and place-specific matter. The local matters. The specific and individual matters.",
      "The ant opens the peony by chewing away the sap that seals the bud. Without countless small acts, living systems cease to function. Interdependence and complexity are the nature of the world we inhabit.",
      "Resilience is created by diversity and complexity. Resilience is created by adaptability in time and place. There are countless people restoring soil, repairing things that would otherwise go to the landfill, teaching about the specifics of an ecosystem, and saving seeds that grow in a specific region.",
      "No ONE changes the world, saves the world, or makes the difference. What if, added together, these things can make the difference, be the change, author the world into a place where peace and inhabitability collaborate?",
    ],
  },

  // ── SLIDE 7 ─────────────────────────────────────────────────────────────
  {
    num: 7,
    slideText: [
      {
        lines: [
          "No single answer can serve",
          "a world this complex.",
        ],
        fontSizeRatio: 0.06,
        bold: false,
        italic: false,
        align: "center",
        top: 0.0685, left: -0.016, width: 1.0509, height: 0.18,
        adjustments: { topOffsetPct: 0.025 },
      },
      {
        lines: [
          "We must support the small and many,",
          "leading to a sustainable tomorrow.",
        ],
        fontSizeRatio: 0.038,
        bold: false,
        italic: true,
        align: "center",
        top: 0.589, left: -0.0213, width: 1.0325, height: 0.209,
        adjustments: { topOffsetPct: 0.13, horizontalPaddingPct: 0.025 },
      },
    ],
    title: "Imagine Another Kind of Search",
    body: [
      "Imagine opening your phone to search for something you need — and discovering that every result helps nourish the world you would love to live in, and the one you wish generations to come will live in.",
      "Imagine if the thoughtful choices already surrounding you no longer had to compete for visibility simply to be found. What if the nearby café sourcing locally, the nursery restoring native habitat, the builder using reclaimed materials, the community organization quietly holding a neighborhood together were all a click away... and you didn't have to spend hours finding them.",
      "Imagine discovering them as easily as finding directions home — not because they outspent someone else to be discoverable.",
      "The internet has connected the world. What if it can also help us discover the people already caring for it, and we can use that ability to build and engage the world we wish to live in?",
      "Making the small visible is not simply an act of fairness. It is an ecological necessity. It is the counter-movement to the dominant forces that have prevailed.",
      "Can we use the incredible capacity of connection via the web, to reveal and uplift another path forward?",
    ],
  },

  // ── SLIDE 8 ─────────────────────────────────────────────────────────────
  {
    num: 8,
    slideText: [
      {
        // Box A spans a large vertical range; text top-aligns within it,
        // producing natural space between the two title lines and Box B.
        // Leading space on " Canary Commons" is preserved from config.
        lines: [" Canary Commons", "\u00A0", "A Visibility infrastructure "],
        fontSizeRatio: 0.04583,
        bold: true,
        italic: false,
        align: "center",
        top: 0.1412, left: 0.0, width: 0.9944, height: 0.7467,
      },
      {
        lines: [
          "The future where we live well isn\u2019t waiting to be invented. ",
          "\u00A0",
          "It\u2019s here.",
          "\u00A0",
          "If we can see it, we can strengthen it.",
        ],
        fontSizeRatio: 0.032,
        bold: false,
        italic: true,
        align: "center",
        top: 0.5599, left: 0.0058, width: 0.9887, height: 0.2533,
      },
    ],
    title: "Visibility Infrastructure — Introducing Canary Commons",
    body: [
      "If diversity gives life its resilience, then it also deserves infrastructure that helps it be seen. That is what Canary Commons was built to become. Canary Commons is not simply software.",
      "It is visibility infrastructure for the diverse and multifaceted expressions of care already present to become visible, discoverable, and supported.",
      "Designed as an interactive website — and soon a mobile app — it is built to become part of everyday life. Whether you are looking for a place to eat, a local business, a community organization, to understand where you are or where you are going more deeply, or a thoughtfully curated online resource, Canary Commons helps you discover the people, places, and projects already contributing to the world we long to live in.",
      "It does not create the good already present within a community. It reveals it. The map, the stories, the carefully curated resources, and the growing constellation are a testimony to the incredible solutions and pathways successfully changing the world, throughout the world — Canary Commons is built to make visible and accessible a world of good.",
      "So that we can choose it. Every day. In the small and the big, we can begin to dedicate each moment and choice to that which inspires and gives back, while simultaneously removing our energy from that which depletes.",
      "No one pays to appear. No one outranks another through advertising. Visibility belongs to contribution rather than competition.",
      "Canary Commons is locally stewarded because every community knows its own place best. What represents care in one region may look different in another, yet each community holds wisdom worth making visible. Each step adds up in a bigger picture.",
      "The work is beautifully simple: make the good easier to find on an equal playing field. Allow attention to become participation, and participation to strengthen what gives life.",
    ],
  },

  // ── SLIDE 9 ─────────────────────────────────────────────────────────────
  {
    num: 9,
    slideText: [
      {
        lines: ["The Scaffolding Now Exists"],
        fontSizeRatio: 0.075,
        bold: false,
        italic: false,
        align: "center",
        top: 0.1961, left: 0.0, width: 1.0001, height: 0.1423,
        adjustments: { topOffsetPct: -0.07 },
      },
      {
        lines: [
          "A way to make life giving visible, discoverable,",
          "and possible to support.",
        ],
        fontSizeRatio: 0.05,
        bold: true,
        italic: true,
        align: "center",
        top: 0.6491, left: 0.0, width: 1.0046, height: 0.2267,
      },
    ],
    title: "The Scaffolding Now Exists",
    body: [
      "Every thriving community depends upon forms of infrastructure we rarely notice. Roads carry people. Libraries organize knowledge. Trails guide us through forests. None of these are the destination. They simply make life possible.",
      "Canary Commons is another kind of infrastructure. It does not create the good already present within a community. It reveals it.",
      "The people were already here. The businesses were already here. The organizations, projects, farms, teachers, peace-makers, healers, and visionaries were already here.",
      "What was missing was a place where they could be discovered together instead of remaining scattered and largely invisible.",
      "That scaffolding now exists. The map exists. Stories have a home. Resources can be gathered. Communities can continue revealing the richness of their own place.",
      "Visibility changes possibility. Once something can be seen, it can be found. Once it can be found, it can be supported. What is supported becomes more likely to endure, grow, inspire — and change the world.",
    ],
  },

  // ── SLIDE 10 ────────────────────────────────────────────────────────────
  // Single full-height box (height_pct 1.0933 — extends beyond slide, clipped by overflow:hidden).
  // Vertically centered. Times New Roman throughout. All three lines bold + italic per config.
  // Inter-word spacing in line 2 preserved literally from config via white-space: pre-wrap.
  {
    num: 10,
    slideText: [
      {
        lines: ["How We Participate"],
        fontSizeRatio: 0.078,
        bold: true,
        italic: true,
        align: "center",
        top: 0.25, left: -0.0139, width: 1.0107, height: 0.16,
        font: "serif",
        adjustments: { topOffsetPct: -0.18 },
      },
      {
        lines: ["See       Choose       Strengthen        Inspire"],
        fontSizeRatio: 0.05,
        bold: true,
        italic: true,
        align: "center",
        top: 0.46, left: -0.0139, width: 1.0107, height: 0.12,
        font: "serif",
        adjustments: { topOffsetPct: -0.04 },
      },
      {
        lines: [
          "Focus your attention",
          "where it can make a difference",
        ],
        fontSizeRatio: 0.05,
        bold: true,
        italic: true,
        align: "center",
        top: 0.67, left: -0.0139, width: 1.0107, height: 0.18,
        font: "serif",
        adjustments: { topOffsetPct: 0.09 },
      },
    ],
    title: "Participating in the Commons",
    body: [
      "The Map helps you discover the people, places, businesses, organizations, and projects already taking care of life where you are — and wherever your travels take you. Every visit, every purchase, every conversation becomes a quiet act of strengthening the kind of world we hope to live in.",
      "The Stories remind us that every place carries wisdom. They preserve experience, share possibility, and deepen our relationship with the places we call home — and the ones we are just beginning to discover.",
      "Curated Resources extend the Commons beyond geography. When the answer isn't nearby, thoughtfully selected online resources allow us to continue supporting businesses whose values reflect the same care.",
      "The Constellation reminds us we are not alone. Across the world, people are quietly proving that another way of living is not only possible — it is already happening.",
      "Together these four spaces make it easier to discover what gives life, and participate in becoming stronger, feeding it through our ordinary daily choices.",
    ],
  },

  // ── SLIDE 11 ────────────────────────────────────────────────────────────
  {
    num: 11,
    slideText: [
      {
        lines: ["What Canary Commons Needs Now"],
        fontSizeRatio: 0.068,
        bold: false,
        italic: false,
        align: "center",
        top: 0.0324, left: 0.0, width: 1.0004, height: 0.18,
        adjustments: { topOffsetPct: 0.05 },
      },
      {
        lines: [
          "The vision has been carried.",
          "\u00A0",
          "The scaffolding has been built.",
          "\u00A0",
          "What it needs now is a bridge.",
        ],
        fontSizeRatio: 0.03958,
        bold: true,
        italic: true,
        align: "center",
        top: 0.6451, left: 0.0, width: 1.0073, height: 0.3467,
        adjustments: { topOffsetPct: 0.06 },
        accentWords: ["bridge."],
      },
    ],
    title: "Why I Built Canary",
    body: [
      "Canary Commons was born from my lived experience. While rebuilding an inn, I spent years searching for people whose work reflected extraordinary care — for the land, the materials they used, the people they served, and the communities they belonged to.",
      "Again and again I discovered how remarkably difficult they were to find. Then I found them. Little by little, person by person, task by task, the search for the invisible many. I discovered a third-generation mold maker melting reclaimed metals into elegant wind turbines capable of powering a home. I discovered paint makers blending beautiful zero-VOC colors from natural pigments. I found a craftsman recovering century-old logs from the bottom of a local lake — reclaiming forgotten timber while restoring the waters they came from.",
      "The effort it took to find these people, and the resources they had spent their careers, lives, and sometimes generations developing, was exceedingly difficult to find and breathtaking in their beauty, once found.",
      "Canary Commons was the dream born of the desire to live in the world they were creating. It became my desire and vision to make it possible for those incredible individuals doing the amazing in their own particular ways, solutioning the impossible piece by piece, to be seen, supported, cherished, uplifted.",
      "I believe we have the answers. We have the way. We have energy technology and we have people who have been able to de-escalate intense and large conflict. We have ways of growing things that do not harm. We have it all.",
      "Can we see it? Can we choose it? That is why I built Canary Commons.",
    ],
  },

  // ── SLIDE 12 ────────────────────────────────────────────────────────────
  // LEFT-ALIGNED — the only left-aligned slide.
  // Box is in the upper-left area: left_pct 0.0986, top_pct 0.1305.
  // Trailing spaces in lines preserved from config.
  {
    num: 12,
    slideText: [
      {
        lines: ["The gift of time ", "\u00A0", "for the Commons ", "\u00A0", "to fill with life."],
        fontSizeRatio: 0.0625,
        bold: false,
        italic: false,
        align: "center",
        top: 0.1305, left: 0.02, width: 0.6422, height: 0.52,
        accentWords: ["time", "life."],
        adjustments: { topOffsetPct: -0.05 },
      },
    ],
    scrim: "left",
    title: "Hold the Bridge",
    body: [
      "The foundation has been built. The first communities are appearing. Businesses are beginning to claim their place. Contributors are beginning to add to the Commons.",
      "The first signs of organic growth have begun. What the Commons needs now is time to mature: time to fill the map, time to gather stories, time to strengthen the technology, time to grow thoughtful partnerships, time for communities to make the Commons their own.",
      "Bridge capital creates that time. It allows the Commons to become the trusted public resource its infrastructure was designed to support.",
      "This is not funding an idea that might someday exist. It is carrying a bridge until the Commons can carry itself.",
    ],
  },

  // ── SLIDE 13 ────────────────────────────────────────────────────────────
  // Box B: all three lines at 36pt (fontSizeRatio 0.0375) — uniform per config.
  // Trailing spaces in Box B lines preserved from config.
  {
    num: 13,
    slideText: [
      {
        lines: [
          "Canary Commons was never meant to be carried by one person.",
          "It was meant to be stewarded by many.",
        ],
        fontSizeRatio: 0.04583,
        bold: true,
        italic: false,
        align: "center",
        top: 0.0299, left: -0.0108, width: 1.0112, height: 0.45,
        adjustments: { fontSizeMultiplier: 1.08, lineHeight: 1.55 },
      },
      {
        lines: [
          "Become the bridge between what already exists  ",
          "and those  waiting to find it.",
          "What we give our attention to, we feed.",
        ],
        fontSizeRatio: 0.0375,
        bold: false,
        italic: true,
        align: "center",
        top: 0.7693, left: -0.0262, width: 1.0484, height: 0.2623,
        adjustments: { topOffsetPct: 0.04 },
      },
    ],
    title: "Not by One",
    body: [
      "A commons is never built by one person. It begins with a vision. It becomes real through the diversity of many lives, many gifts, and many hands.",
      "The map will never be filled by one person. The stories cannot be written by one voice. No single organization can represent the wisdom of every community.",
      "That is the nature of a commons. Each place reveals its own character. Each person contributes something different. Each act of care strengthens the whole.",
      "Bridge stewardship exists for this season: to give Canary Commons the time to fill in with the many that it is built to make visible. The bridge creates the conditions for that future to emerge.",
      "My hope is simple: that together we make it easier for people to find what gives life, and in doing so, bring all the power of our attention and the energy that follows our focus — to a world worth living in.",
    ],
    quote: "\u201CNever doubt that a small group of thoughtful, committed citizens can change the world; indeed, it's the only thing that ever has.\u201D — Margaret Mead",
  },
];

export const bridgeClosing: ClosingSection[] = [
  {
    heading: "A Note About Business Structure and Stewardship",
    body: [
      "Canary Commons exists to answer a practical need: making the life-giving visible. To do that well, it needs to be responsive, adaptable, and capable of growing alongside the communities it serves.",
      "Businesses exist because they answer real needs. Craigslist answered the need for people to find one another. Canary Commons answers the need for people to find the people, places, businesses, organizations, stories, and resources that help life flourish.",
      "Over time, I intend to deepen that public mission through B Corp certification and a companion foundation. But first, the infrastructure itself must exist, mature, and become sustainable.",
      "Today, what needs building is the bridge between a functioning platform and a trusted public resource used by thousands of people. That bridge is what stewardship makes possible.",
      "Supporting Canary Commons is not a charitable donation in the tax sense. It is closer to backing a Kickstarter project, becoming a founding member of a museum, joining a CSA. It is helping a small business reach the point where it can sustainably serve the community it was built for. In return, founding stewards receive ongoing participation through letters from the field, recognition, and a window into what their support is helping bring into being.",
      "Contributions are not tax-deductible because Canary Commons is currently a for-profit public benefit company in development. If a tax deduction is your primary goal, this may not be the right fit. If your goal is to help establish infrastructure you believe should exist, I would be honored to have your stewardship and your support. Honored. Deeply. It is a lot to carry vision into the world. I thank you.",
    ],
  },
  {
    heading: "Why Stewardship?",
    body: [
      "Like many young ventures, Canary Commons doesn't simply need money — it needs time. Time to strengthen its wings and learn how to fly and carry weight.",
      "From the beginning, I have imagined Canary Commons as something fundamentally grassroots: cross-pollinated by many people, many places, many ideas, and many acts of care. Like the healthy ecosystems it exists to reveal, its strength comes through diversity — not only in what it makes visible, but in the people who help carry it forward.",
      "I don't want the Commons shaped by the priorities of a few — high dollars with an agenda. I hope it grows through the stewardship of many: people who believe this infrastructure should exist, who recognize its value, and who help give it the time to mature.",
      "In that sense, stewardship is more than financial support for an individual business. It is participation in bringing into being a resource that belongs in the world, and helps us all see and access the best possible.",
    ],
  },
];
