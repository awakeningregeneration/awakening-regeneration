-- ============================================================
-- Phase 1b: Set url_handle NOT NULL after backfill
-- Run ONLY after: UPDATE seeders SET url_handle = 'lucia' WHERE name ILIKE '%lucia%';
-- ============================================================

ALTER TABLE seeders ALTER COLUMN url_handle SET NOT NULL;
