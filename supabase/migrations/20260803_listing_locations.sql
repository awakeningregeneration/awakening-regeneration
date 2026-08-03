-- listing_locations: child table for multi-location listings
-- Each row is one physical location tied to a single parent listing.
-- The parent listings row retains its existing address/lat/lng (primary or first location).
-- Map renders one pin per listing_locations row, all linking to the same listing_id.

CREATE TABLE listing_locations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id    UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  address       TEXT,
  city          TEXT NOT NULL,
  state         TEXT NOT NULL,
  county        TEXT,
  lat           DOUBLE PRECISION NOT NULL,
  lng           DOUBLE PRECISION NOT NULL,
  label         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX listing_locations_listing_id_idx ON listing_locations(listing_id);
