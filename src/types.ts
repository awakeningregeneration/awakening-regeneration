export type PriceLevel = '$' | '$$' | '$$$'

export type Listing = {
  id: string
  org_id: string | null
  region_id: string | null
  status: 'draft'|'pending'|'published'|'rejected'
  address: string | null
  city: string | null
  lat: number | null
  lng: number | null
  hours_json?: any
  volunteer_friendly: boolean
  pickup: boolean
  price: PriceLevel | null
  created_at: string
  updated_at: string
  org?: Org
}

export type Org = {
  id: string
  name: string
  website?: string | null
  email?: string | null
  phone?: string | null
  description?: string | null
  story_snippet?: string | null
  hero_image_url?: string | null
}

export type Story = {
  id: string
  listing_id?: string | null
  title: string
  body_markdown: string
  cover_image_url?: string | null
  featured: boolean
  published_at?: string | null
}

export type Submission = {
  id: string
  payload_json: any
  email?: string | null
  status: 'new'|'review'|'approved'|'rejected'
  notes?: string | null
  created_at: string
}
