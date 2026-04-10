export type Listing = {
  id: string
  name: string
  description?: string
  category?: string
  tags?: string[]
  website?: string
  city?: string
  state?: string
  county?: string
  lat: number
  lng: number
}