-- ============================================================
-- synonym_groups: auto-bump updated_at on UPDATE
-- Run manually in Supabase SQL Editor
-- Idempotent / safely re-runnable
-- ============================================================


-- ── 1. Trigger function ──

CREATE OR REPLACE FUNCTION set_synonym_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ── 2. Create the trigger ──

DROP TRIGGER IF EXISTS synonym_groups_updated_at_trigger ON synonym_groups;

CREATE TRIGGER synonym_groups_updated_at_trigger
  BEFORE UPDATE ON synonym_groups
  FOR EACH ROW
  EXECUTE FUNCTION set_synonym_groups_updated_at();
