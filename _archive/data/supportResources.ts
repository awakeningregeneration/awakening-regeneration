import type { SupportResource } from "../app/types/supportResource";

export const supportResources: SupportResource[] = [
  {
    id: "water-filter-example",
    title: "Water Filter Example",
    category: "Food & Nourishment",
    description: "A practical option for cleaner daily drinking water.",
    whyItMatters: "Clean water is one of the basic conditions that supports life.",
    websiteUrl: "https://example.com",
    affiliateUrl: "",
    tags: ["water", "filtration", "clean water"],
  },
  {
    id: "non-toxic-home-example",
    title: "Non-Toxic Home Example",
    category: "Home & Shelter",
    description: "An aligned option for lower-toxin home materials.",
    whyItMatters:
      "What surrounds daily life shapes exposure, comfort, and long-term wellbeing.",
    websiteUrl: "https://example.com",
    affiliateUrl: "",
    tags: ["home", "materials", "non-toxic", "healthy home"],
  },
  {
    id: "garden-soil-example",
    title: "Garden + Soil Example",
    category: "Land & Ecology",
    description:
      "A resource for building healthier soil and regenerative growing practices.",
    whyItMatters:
      "Living soil is one of the foundations of resilient, life-supporting systems.",
    websiteUrl: "https://example.com",
    affiliateUrl: "",
    tags: ["soil", "garden", "regenerative", "growing food"],
  },
];