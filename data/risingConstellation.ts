export type RisingSignal = {
  id: string
  title: string
  description: string
  region: string
  link: string
}

export const risingConstellation: RisingSignal[] = [
  {
    id: "norway-floating-wind",
    title: "Floating Wind Farms — Norway",
    description:
      "Norway is pioneering floating offshore wind platforms capable of generating massive amounts of clean energy in deep water.",
    region: "Norway",
    link: "https://www.equinor.com/energy/floating-wind",
  },
  {
    id: "soil-carbon-ranching",
    title: "Carbon Farming Restoring Soil",
    description:
      "Farmers across the world are rebuilding soil and drawing carbon from the atmosphere through regenerative agriculture.",
    region: "Global",
    link: "https://regenerationinternational.org/",
  },
  {
    id: "community-owned-energy",
    title: "Community-Owned Renewable Energy",
    description:
      "Communities across Europe are building locally owned renewable energy cooperatives.",
    region: "Europe",
    link: "https://rescoop.eu/",
  },
]