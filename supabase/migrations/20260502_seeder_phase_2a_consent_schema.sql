-- ============================================================
-- Phase 2a (Stage A of Phase 2+3 build)
-- Applied to production database on May 2, 2026
-- This file is the canonical record of the schema change
-- ============================================================

-- ── A) Listings table: consent fields ──

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS do_not_list BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS do_not_list_reason TEXT;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS do_not_list_at TIMESTAMPTZ;

-- ── B) Listings table: normalized fields ──

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS normalized_name TEXT;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS normalized_address TEXT;

-- ── C) Normalization function ──

CREATE OR REPLACE FUNCTION normalize_listing_fields()
RETURNS TRIGGER AS $$
DECLARE
  v_name TEXT;
  v_addr TEXT;
BEGIN
  -- Normalize business name (from title column)
  IF NEW.title IS NOT NULL THEN
    v_name := lower(trim(NEW.title));
    -- Strip leading articles
    v_name := regexp_replace(v_name, '^(the|a|an)\s+', '', 'i');
    -- Collapse multiple spaces
    v_name := regexp_replace(v_name, '\s+', ' ', 'g');
    NEW.normalized_name := v_name;
  ELSE
    NEW.normalized_name := NULL;
  END IF;

  -- Normalize address
  IF NEW.address IS NOT NULL AND trim(NEW.address) != '' THEN
    v_addr := lower(trim(NEW.address));

    -- Normalize common suffixes (word boundary at end of token)
    v_addr := regexp_replace(v_addr, '\mstreet\M', 'st', 'g');
    v_addr := regexp_replace(v_addr, '\mavenue\M', 'ave', 'g');
    v_addr := regexp_replace(v_addr, '\mroad\M', 'rd', 'g');
    v_addr := regexp_replace(v_addr, '\mdrive\M', 'dr', 'g');
    v_addr := regexp_replace(v_addr, '\mboulevard\M', 'blvd', 'g');
    v_addr := regexp_replace(v_addr, '\mlane\M', 'ln', 'g');
    v_addr := regexp_replace(v_addr, '\mcourt\M', 'ct', 'g');
    v_addr := regexp_replace(v_addr, '\mplace\M', 'pl', 'g');
    v_addr := regexp_replace(v_addr, '\mcircle\M', 'cir', 'g');
    v_addr := regexp_replace(v_addr, '\mhighway\M', 'hwy', 'g');
    v_addr := regexp_replace(v_addr, '\mparkway\M', 'pkwy', 'g');

    -- Strip suite/ste/unit indicators and everything after them
    -- "123 main st suite 4" → "123 main st"
    -- "123 main st ste 4b"  → "123 main st"
    -- "123 main st #4"      → "123 main st"
    -- "123 main st unit 4"  → "123 main st"
    v_addr := regexp_replace(v_addr, '\s*(suite|ste|unit|apt|#)\s*\S*$', '', 'i');

    -- Strip trailing periods and whitespace
    v_addr := regexp_replace(v_addr, '[\.\s]+$', '');

    -- Collapse multiple spaces
    v_addr := regexp_replace(v_addr, '\s+', ' ', 'g');

    NEW.normalized_address := v_addr;
  ELSE
    NEW.normalized_address := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── D) Trigger ──

DROP TRIGGER IF EXISTS listings_normalize ON listings;

CREATE TRIGGER listings_normalize
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION normalize_listing_fields();

-- ── E) Backfill existing rows ──
-- Setting title = title fires the trigger for every row,
-- populating normalized_name and normalized_address.

UPDATE listings SET title = title;
