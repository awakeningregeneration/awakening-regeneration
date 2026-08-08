-- ============================================================
-- Migration: constellation_approaches, constellation_examples,
--            constellation_example_approaches
-- Created: 2026-08-08
-- ============================================================

-- ── constellation_approaches ────────────────────────────────
CREATE TABLE IF NOT EXISTS constellation_approaches (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id    uuid NOT NULL REFERENCES constellation_topics(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE constellation_approaches ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public_select_approaches"
  ON constellation_approaches FOR SELECT
  TO public
  USING (true);

-- Service role full access
CREATE POLICY "service_role_all_approaches"
  ON constellation_approaches FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── constellation_examples ──────────────────────────────────
CREATE TABLE IF NOT EXISTS constellation_examples (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  url         text NOT NULL,
  summary     text NOT NULL DEFAULT '',
  favicon_url text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE constellation_examples ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public_select_examples"
  ON constellation_examples FOR SELECT
  TO public
  USING (true);

-- Service role full access
CREATE POLICY "service_role_all_examples"
  ON constellation_examples FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── constellation_example_approaches ────────────────────────
CREATE TABLE IF NOT EXISTS constellation_example_approaches (
  example_id  uuid NOT NULL REFERENCES constellation_examples(id) ON DELETE CASCADE,
  approach_id uuid NOT NULL REFERENCES constellation_approaches(id) ON DELETE CASCADE,
  sort_order  integer NOT NULL DEFAULT 0,
  PRIMARY KEY (example_id, approach_id)
);

ALTER TABLE constellation_example_approaches ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public_select_example_approaches"
  ON constellation_example_approaches FOR SELECT
  TO public
  USING (true);

-- Service role full access
CREATE POLICY "service_role_all_example_approaches"
  ON constellation_example_approaches FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_constellation_approaches_topic_id
  ON constellation_approaches(topic_id);

CREATE INDEX IF NOT EXISTS idx_constellation_approaches_sort_order
  ON constellation_approaches(topic_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_constellation_example_approaches_approach_id
  ON constellation_example_approaches(approach_id);

CREATE INDEX IF NOT EXISTS idx_constellation_example_approaches_example_id
  ON constellation_example_approaches(example_id);

-- ── DATA MIGRATION: Fire Wise topic ─────────────────────────
-- Migrates existing constellation_links rows for the Fire Wise topic
-- into the new approaches/examples/join structure.
--
-- Approaches:
--   1. Restoring Resilient Landscapes
--   2. Returning Good Fire
--   3. Indigenous & Cultural Fire
--
-- Examples:
--   A. America's Longleaf Restoration Initiative  → approaches 1 + 2
--   B. Karuk Tribe Cultural Fire Program          → approach 3
--   C. Firesticks Alliance                        → approach 3
--   D. Arnhem Land Fire Abatement (ALFA)          → approach 3

DO $$
DECLARE
  v_topic_id          uuid;
  v_approach_resilient  uuid;
  v_approach_good_fire  uuid;
  v_approach_indigenous uuid;
  v_example_longleaf    uuid;
  v_example_karuk       uuid;
  v_example_firesticks  uuid;
  v_example_alfa        uuid;
BEGIN
  -- Locate the Fire Wise topic (slug may be 'firewise' or 'fire-wise')
  SELECT id INTO v_topic_id
  FROM constellation_topics
  WHERE slug IN ('firewise', 'fire-wise')
     OR title ILIKE '%fire wise%'
     OR title ILIKE '%firewise%'
  LIMIT 1;

  IF v_topic_id IS NULL THEN
    RAISE NOTICE 'Fire Wise topic not found — skipping data migration. Add it first, then re-run this block.';
    RETURN;
  END IF;

  -- ── Approaches ──────────────────────────────────────────────
  INSERT INTO constellation_approaches (topic_id, name, description, sort_order)
  VALUES (
    v_topic_id,
    'Restoring Resilient Landscapes',
    'Rebuilding fire-adapted ecosystems through replanting, prescribed burning, and landscape-scale partnerships that bring forests and grasslands back into balance.',
    1
  ) RETURNING id INTO v_approach_resilient;

  INSERT INTO constellation_approaches (topic_id, name, description, sort_order)
  VALUES (
    v_topic_id,
    'Returning Good Fire',
    'Reintroducing fire as an ecological tool — prescribed burns, fuel reduction, and seasonal burning management to restore healthy fire regimes that landscapes evolved with.',
    2
  ) RETURNING id INTO v_approach_good_fire;

  INSERT INTO constellation_approaches (topic_id, name, description, sort_order)
  VALUES (
    v_topic_id,
    'Indigenous & Cultural Fire',
    'Learning from and supporting Indigenous communities whose millennial burning traditions maintained fire-adapted landscapes long before industrial fire suppression began.',
    3
  ) RETURNING id INTO v_approach_indigenous;

  -- ── Examples ────────────────────────────────────────────────
  INSERT INTO constellation_examples (title, url, summary, favicon_url)
  VALUES (
    'America''s Longleaf Restoration Initiative',
    'https://www.americaslongleaf.org/',
    'A range-wide, multi-partner effort to restore longleaf pine ecosystems across the southeastern U.S. through prescribed burning, replanting, and landowner partnerships.',
    'https://www.google.com/s2/favicons?domain=americaslongleaf.org&sz=64'
  ) RETURNING id INTO v_example_longleaf;

  INSERT INTO constellation_examples (title, url, summary, favicon_url)
  VALUES (
    'Karuk Tribe Cultural Fire Program',
    'https://www.karuk.us/departments/natural-resources-dnr/eco-culture-revitalization',
    'The Karuk Tribe''s revitalization of millennia-old cultural burning practices along the Klamath River, restoring fire-adapted ecosystems and reducing wildfire risk.',
    'https://www.google.com/s2/favicons?domain=karuk.us&sz=64'
  ) RETURNING id INTO v_example_karuk;

  INSERT INTO constellation_examples (title, url, summary, favicon_url)
  VALUES (
    'Firesticks Alliance',
    'https://firesticks.org.au/',
    'An Indigenous-led Australian network that trains cultural fire practitioners and partners with communities to restore Country through traditional burning knowledge.',
    'https://www.google.com/s2/favicons?domain=firesticks.org.au&sz=64'
  ) RETURNING id INTO v_example_firesticks;

  INSERT INTO constellation_examples (title, url, summary, favicon_url)
  VALUES (
    'Arnhem Land Fire Abatement (ALFA)',
    'https://www.alfant.com.au/',
    'An Aboriginal-owned organization supporting Traditional Owners across Arnhem Land, Australia, in managing savanna fire across 80,000+ km² through customary burning practices.',
    'https://www.google.com/s2/favicons?domain=alfant.com.au&sz=64'
  ) RETURNING id INTO v_example_alfa;

  -- ── Attach examples to approaches ───────────────────────────
  -- Longleaf belongs to BOTH Restoring Resilient Landscapes and Returning Good Fire
  INSERT INTO constellation_example_approaches (example_id, approach_id, sort_order)
  VALUES (v_example_longleaf, v_approach_resilient, 1);

  INSERT INTO constellation_example_approaches (example_id, approach_id, sort_order)
  VALUES (v_example_longleaf, v_approach_good_fire, 1);

  -- Indigenous examples
  INSERT INTO constellation_example_approaches (example_id, approach_id, sort_order)
  VALUES (v_example_karuk, v_approach_indigenous, 1);

  INSERT INTO constellation_example_approaches (example_id, approach_id, sort_order)
  VALUES (v_example_firesticks, v_approach_indigenous, 2);

  INSERT INTO constellation_example_approaches (example_id, approach_id, sort_order)
  VALUES (v_example_alfa, v_approach_indigenous, 3);

  RAISE NOTICE 'Fire Wise data migration complete: 3 approaches, 4 examples, 5 join rows.';
END $$;
