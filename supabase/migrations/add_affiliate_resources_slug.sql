-- ============================================================
-- Affiliate redirect layer: slug column + auto-generation
-- Run manually in Supabase SQL Editor
-- ============================================================


-- ── 1. Add slug column (nullable initially for backfill) ──

ALTER TABLE affiliate_resources
  ADD COLUMN IF NOT EXISTS slug TEXT;


-- ── 2. Slug generation function ──
-- Lowercases, replaces non-alphanumeric with hyphens, collapses
-- consecutive hyphens, trims, and appends -2/-3/etc. on collision.
-- exclude_id prevents a row from colliding with itself on UPDATE.

CREATE OR REPLACE FUNCTION generate_affiliate_slug(
  input_name TEXT,
  exclude_id BIGINT DEFAULT NULL
) RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  candidate TEXT;
  counter INTEGER := 2;
BEGIN
  -- Lowercase and replace non-alphanumeric with hyphens
  base_slug := lower(input_name);
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  -- Trim leading and trailing hyphens
  base_slug := trim(both '-' from base_slug);

  -- Handle empty result
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'resource';
  END IF;

  -- Check for collisions
  candidate := base_slug;
  LOOP
    IF exclude_id IS NOT NULL THEN
      EXIT WHEN NOT EXISTS (
        SELECT 1 FROM affiliate_resources
        WHERE slug = candidate AND id != exclude_id
      );
    ELSE
      EXIT WHEN NOT EXISTS (
        SELECT 1 FROM affiliate_resources
        WHERE slug = candidate
      );
    END IF;
    candidate := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;

  RETURN candidate;
END;
$$ LANGUAGE plpgsql;


-- ── 3. Trigger function ──
-- On INSERT: always generate slug from name.
-- On UPDATE: regenerate slug only if name changed.

CREATE OR REPLACE FUNCTION affiliate_resources_set_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.slug := generate_affiliate_slug(NEW.name);
  ELSIF TG_OP = 'UPDATE' AND NEW.name IS DISTINCT FROM OLD.name THEN
    NEW.slug := generate_affiliate_slug(NEW.name, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ── 4. Create the trigger ──

DROP TRIGGER IF EXISTS affiliate_resources_slug_trigger ON affiliate_resources;

CREATE TRIGGER affiliate_resources_slug_trigger
  BEFORE INSERT OR UPDATE ON affiliate_resources
  FOR EACH ROW
  EXECUTE FUNCTION affiliate_resources_set_slug();


-- ── 5. Backfill existing rows ──
-- Ordered by created_at ASC so older rows get the cleaner slug.
-- Each row calls generate_affiliate_slug with its own id excluded
-- so it doesn't collide with itself.

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT id, name
    FROM affiliate_resources
    WHERE slug IS NULL
    ORDER BY created_at ASC
  LOOP
    UPDATE affiliate_resources
    SET slug = generate_affiliate_slug(r.name, r.id)
    WHERE id = r.id;
  END LOOP;
END;
$$;


-- ── 6. Enforce NOT NULL and UNIQUE after backfill ──

ALTER TABLE affiliate_resources
  ALTER COLUMN slug SET NOT NULL;

ALTER TABLE affiliate_resources
  ADD CONSTRAINT affiliate_resources_slug_unique UNIQUE (slug);


-- ── 7. Index for fast lookups ──
-- The redirect route queries by slug on every click.

CREATE INDEX IF NOT EXISTS idx_affiliate_resources_slug
  ON affiliate_resources(slug);
