-- ============================================================
-- Canary Commons — Stewardship Layer Migration
-- Run manually in the Supabase SQL Editor.
-- ============================================================

-- ── 1. stewards table ────────────────────────────────────────

CREATE TABLE stewards (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      uuid        NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  email           text        NOT NULL,
  display_name    text,
  declared_at     timestamptz NOT NULL DEFAULT now(),
  verified_at     timestamptz,
  activated_at    timestamptz,
  verification_path text      NOT NULL CHECK (verification_path IN ('domain_match', 'declaration')),
  status          text        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'verified_waiting_grace', 'active', 'revoked', 'disputed'))
);

CREATE INDEX idx_stewards_listing_id ON stewards (listing_id);
CREATE INDEX idx_stewards_email      ON stewards (email);
CREATE INDEX idx_stewards_status     ON stewards (status);

-- ── 2. stewardship_claims table ──────────────────────────────

CREATE TABLE stewardship_claims (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  steward_id            uuid        NOT NULL REFERENCES stewards(id) ON DELETE CASCADE,
  verification_token    text        NOT NULL UNIQUE,
  token_expires_at      timestamptz NOT NULL,
  grace_period_ends_at  timestamptz,
  declaration_text      text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_claims_verification_token ON stewardship_claims (verification_token);
CREATE INDEX idx_claims_steward_id         ON stewardship_claims (steward_id);

-- ── 3. stewardship_disputes table ────────────────────────────

CREATE TABLE stewardship_disputes (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id            uuid        NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  disputed_steward_id   uuid        NOT NULL REFERENCES stewards(id) ON DELETE CASCADE,
  disputer_email        text        NOT NULL,
  disputer_context      text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  resolved_at           timestamptz,
  resolution_notes      text,
  status                text        NOT NULL DEFAULT 'open'
                                    CHECK (status IN ('open', 'upheld', 'rejected'))
);

-- ── 4. Add stewardship columns to listings ───────────────────

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS steward_id    uuid,
  ADD COLUMN IF NOT EXISTS steward_email text;

-- FK added separately so the stewards table exists first.
-- ON DELETE SET NULL: if a steward record is removed, the listing
-- becomes unclaimed rather than cascading.
ALTER TABLE listings
  ADD CONSTRAINT fk_listings_steward
  FOREIGN KEY (steward_id) REFERENCES stewards(id) ON DELETE SET NULL;

-- ── 5. Enable Row Level Security (tables start locked) ───────

ALTER TABLE stewards             ENABLE ROW LEVEL SECURITY;
ALTER TABLE stewardship_claims   ENABLE ROW LEVEL SECURITY;
ALTER TABLE stewardship_disputes ENABLE ROW LEVEL SECURITY;

-- Service-role access (the app uses SUPABASE_SERVICE_ROLE_KEY
-- which bypasses RLS, so no policies are needed for the app
-- to read/write. Public/anon access is denied by default.)
