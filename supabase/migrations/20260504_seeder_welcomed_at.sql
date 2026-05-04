-- ============================================================
-- Stage D.5: welcomed_at timestamp on seeders
-- Applied to production database on May 4, 2026
-- This file is the canonical record of the schema change
-- ============================================================

ALTER TABLE seeders
  ADD COLUMN IF NOT EXISTS welcomed_at TIMESTAMPTZ DEFAULT NULL;
