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
  category: string;

  description?: string;
  website?: string;

  city: string;
  state: string;

  // ✅ add this for the state → county flow
  county?: string;

  lng: number;
  lat: number;

  // Meaning layer (already in your saved state)
  focus?: string;
  invitation?: Invitation;

  status?: "active" | "hidden";
  flag_count?: number;

  createdAt?: string;
};
