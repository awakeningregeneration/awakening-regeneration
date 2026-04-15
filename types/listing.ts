export type Invitation =
  | "Visit"
  | "Volunteer"
  | "Learn"
  | "Buy"
  | "Donate"
  | "Partner"
  | "Other";

export type Listing = {
  id: string;

  name: string;
  title?: string;

  category: string;

  description?: string;
  website?: string;

  city: string;
  state: string;
  county?: string;

  lng: number;
  lat: number;

  focus?: string;
  invitation?: Invitation;

  status?: "active" | "hidden";
  flag_count?: number;

  image_url?: string;

  createdAt?: string;
};