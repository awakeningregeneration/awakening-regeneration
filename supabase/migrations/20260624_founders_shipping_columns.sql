-- Reflects the already-applied production schema for founder shipping columns.
-- Add shipping address + physical-mail preference columns to founders.
-- All nullable so opt-out contributors insert cleanly with nulls.
-- wants_physical_mail defaults to true (everyone gets mail unless they opt out).

ALTER TABLE public.founders
  ADD COLUMN IF NOT EXISTS wants_physical_mail BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS shipping_name TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address_line1 TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address_line2 TEXT,
  ADD COLUMN IF NOT EXISTS shipping_city TEXT,
  ADD COLUMN IF NOT EXISTS shipping_state TEXT,
  ADD COLUMN IF NOT EXISTS shipping_postal_code TEXT,
  ADD COLUMN IF NOT EXISTS shipping_country TEXT;
