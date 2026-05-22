-- ============================================================
-- Convert constellation.category from TEXT to TEXT[]
-- Multi-category support (up to 3 per signal)
-- Applied to production database on May 21, 2026
-- This file is the canonical record of the schema change
-- ============================================================

ALTER TABLE constellation
  ALTER COLUMN category TYPE TEXT[]
  USING CASE WHEN category IS NOT NULL THEN ARRAY[category] ELSE NULL END;
