-- ============================================================
-- Canary Commons — Steward Edit Sessions
-- Run manually in the Supabase SQL Editor.
-- ============================================================

CREATE TABLE steward_edit_sessions (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  steward_id          uuid        NOT NULL REFERENCES stewards(id) ON DELETE CASCADE,
  listing_id          uuid        NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  session_token       text        NOT NULL UNIQUE,
  token_expires_at    timestamptz NOT NULL,
  used_at             timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_edit_sessions_token   ON steward_edit_sessions (session_token);
CREATE INDEX idx_edit_sessions_listing ON steward_edit_sessions (listing_id);

ALTER TABLE steward_edit_sessions ENABLE ROW LEVEL SECURITY;
