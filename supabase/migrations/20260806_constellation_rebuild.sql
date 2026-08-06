-- ── Drop old constellation table (existing ~20 rows discarded) ─────────────────
DROP TABLE IF EXISTS constellation;

-- ── constellation_topics ───────────────────────────────────────────────────────
CREATE TABLE constellation_topics (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  title       text        NOT NULL,
  subheader   text        NOT NULL,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── constellation_links ────────────────────────────────────────────────────────
CREATE TABLE constellation_links (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id    uuid        NOT NULL REFERENCES constellation_topics(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  url         text        NOT NULL,
  summary     text        NOT NULL,
  favicon_url text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── constellation_submissions (moderation queue — nothing auto-publishes) ───────
CREATE TABLE constellation_submissions (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  type                  text        NOT NULL CHECK (type IN ('link', 'topic')),
  -- link submission fields
  topic_id              uuid        REFERENCES constellation_topics(id) ON DELETE SET NULL,
  -- topic suggestion fields
  suggested_topic_name  text,
  -- shared fields
  url                   text,
  title                 text,
  summary               text,         -- "why it matters" for topic suggestions
  submitter_email       text,
  favicon_url           text,         -- pre-computed at submit time for easy Studio promotion
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- ── Grants (Supabase Oct 2026 forward pattern) ─────────────────────────────────
GRANT SELECT ON constellation_topics      TO anon;
GRANT SELECT ON constellation_links       TO anon;
GRANT INSERT ON constellation_submissions TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON constellation_topics      TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON constellation_links       TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON constellation_submissions TO service_role;

-- ── RLS ────────────────────────────────────────────────────────────────────────
ALTER TABLE constellation_topics      ENABLE ROW LEVEL SECURITY;
ALTER TABLE constellation_links       ENABLE ROW LEVEL SECURITY;
ALTER TABLE constellation_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read topics"
  ON constellation_topics FOR SELECT USING (true);

CREATE POLICY "Public read links"
  ON constellation_links FOR SELECT USING (true);

CREATE POLICY "Public submit"
  ON constellation_submissions FOR INSERT WITH CHECK (true);
-- service_role key bypasses RLS by default — no additional policy needed for admin access
