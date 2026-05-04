-- ============================================================
-- Phase 2c (Stage C): do_not_list override field
-- Applied to production database on May 3, 2026
-- This file is the canonical record of the schema change
-- ============================================================

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS do_not_list_override BOOLEAN NOT NULL DEFAULT false;
