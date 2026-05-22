-- ============================================================
-- Convert listings.category from TEXT to TEXT[]
-- Multi-category support (up to 5 per listing)
-- Applied to production database on May 21, 2026
-- This file is the canonical record of the schema change
-- ============================================================

ALTER TABLE listings
  ALTER COLUMN category TYPE TEXT[]
  USING CASE WHEN category IS NOT NULL THEN ARRAY[category] ELSE NULL END;
