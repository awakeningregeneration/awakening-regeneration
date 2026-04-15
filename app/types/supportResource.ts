export type SupportResource = {
  id: string;
  title: string;
  category: string;
  description: string;
  whyItMatters?: string;
  websiteUrl: string;
  affiliateUrl?: string;
  tags?: string[];
  image_url?: string;
};