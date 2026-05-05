-- ============================================================
-- Stage G: do_not_list_level field on listings
-- Distinguishes soft (seeder_only) from hard (universal) removal
-- Applied to production database on May 5, 2026
-- This file is the canonical record of the schema change
-- ============================================================

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS do_not_list_level TEXT
  CHECK (do_not_list_level IN ('seeder_only', 'universal'))
  DEFAULT NULL;
