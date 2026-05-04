-- ============================================================
-- Stage F: bounce_info field on listings
-- Applied to production database on May 4, 2026
-- This file is the canonical record of the schema change
-- ============================================================

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS bounce_info TEXT DEFAULT NULL;
