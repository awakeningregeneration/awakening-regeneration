-- ============================================================
-- Extend normalize_listing_fields() to also normalize city,
-- state, and county on INSERT and UPDATE.
--
-- The authoritative normalization logic lives in
-- app/lib/normalize.ts (TypeScript) and is applied by all
-- app-layer code paths. This trigger is a backstop for direct
-- database edits that bypass the app layer (Supabase Studio,
-- manual SQL, future code paths that forget to normalize).
--
-- The trigger handles common drift patterns (Title Case, trim,
-- append " County") but does NOT do full parity with the JS
-- utility. Intentional limitations:
--   - State abbreviations (OR → Oregon) are NOT expanded.
--     INITCAP produces "Or" for "OR", which is visibly wrong
--     and will get noticed and corrected manually. Full
--     abbreviation parity would require a 50-state lookup
--     table inside the trigger.
--   - No article stripping on city/state/county (only on
--     normalized_name for title matching).
--
-- Run manually in Supabase SQL Editor. Idempotent — safe to
-- re-run (uses CREATE OR REPLACE FUNCTION).
-- ============================================================

CREATE OR REPLACE FUNCTION normalize_listing_fields()
RETURNS TRIGGER AS $$
DECLARE
  v_name TEXT;
  v_addr TEXT;
  v_county_base TEXT;
BEGIN
  -- ── Normalize business name (from title column) ──
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

  -- ── Normalize address ──
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
    v_addr := regexp_replace(v_addr, '\s*(suite|ste|unit|apt|#)\s*\S*$', '', 'i');

    -- Strip trailing periods and whitespace
    v_addr := regexp_replace(v_addr, '[\.\s]+$', '');

    -- Collapse multiple spaces
    v_addr := regexp_replace(v_addr, '\s+', ' ', 'g');

    NEW.normalized_address := v_addr;
  ELSE
    NEW.normalized_address := NULL;
  END IF;

  -- ── Normalize city (Title Case) ──
  IF NEW.city IS NULL OR trim(NEW.city) = '' THEN
    NEW.city := NULL;
  ELSE
    NEW.city := initcap(lower(trim(NEW.city)));
  END IF;

  -- ── Normalize state (Title Case) ──
  -- Note: does NOT expand abbreviations (OR → Oregon). That
  -- logic lives in the JS utility. INITCAP("OR") produces "Or"
  -- which is visibly wrong and will be caught on review.
  IF NEW.state IS NULL OR trim(NEW.state) = '' THEN
    NEW.state := NULL;
  ELSE
    NEW.state := initcap(lower(trim(NEW.state)));
  END IF;

  -- ── Normalize county (Title Case + " County" suffix) ──
  IF NEW.county IS NULL OR trim(NEW.county) = '' THEN
    NEW.county := NULL;
  ELSE
    -- Strip trailing " County" (case-insensitive) if present
    v_county_base := regexp_replace(trim(NEW.county), '\s+[Cc][Oo][Uu][Nn][Tt][Yy]$', '');
    v_county_base := trim(v_county_base);
    IF v_county_base = '' THEN
      NEW.county := NULL;
    ELSE
      NEW.county := initcap(lower(v_county_base)) || ' County';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger binding already exists from the original migration
-- (20260502_seeder_phase_2a_consent_schema.sql). CREATE OR
-- REPLACE FUNCTION updates the function in place without
-- needing to recreate the trigger.
