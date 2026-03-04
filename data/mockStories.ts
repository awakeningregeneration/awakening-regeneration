import type { Story } from "@/types/story";

export const mockStories: Story[] = [
  {
    id: "s1",
    createdAt: "2026-01-29",
    state: "CA",
    county: "Mendocino",
    title: "Seed library restocked",
    body:
      "The local seed library was restocked and reorganized by volunteers. People left notes about what grew well last season. It felt like a quiet exchange of trust.",
    link: "",
  },
  {
    id: "s2",
    createdAt: "2026-01-29",
    state: "CA",
    county: "El Dorado",
    title: "Repair circle instead of landfill",
    body:
      "A small repair circle fixed lamps, zippers, and a coffee grinder instead of throwing them away. Neighbors taught each other and laughed the whole time. The town felt less alone.",
    link: "",
  },
];
