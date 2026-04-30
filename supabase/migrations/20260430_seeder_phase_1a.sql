-- ============================================================
-- Phase 1a: Seeder system foundation
-- ============================================================

-- ── A) Listings table additions ──

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'community_submitted'
    CHECK (source IN ('seeder_placed', 'owner_submitted', 'community_submitted'));

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS placed_by_seeder_id UUID REFERENCES seeders(id) ON DELETE SET NULL;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS outreach_status TEXT DEFAULT 'not_started'
    CHECK (outreach_status IN ('not_started', 'email_1_sent', 'email_2_sent',
                               'email_3_sent', 'claimed', 'removed',
                               'unsubscribed', 'bounced'));

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS outreach_started_at TIMESTAMPTZ;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS last_outreach_at TIMESTAMPTZ;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS removal_token TEXT;

-- ── B) Seeders table additions ──
-- url_handle nullable initially — backfill then SET NOT NULL in Part 1b.

ALTER TABLE seeders
  ADD COLUMN IF NOT EXISTS url_handle TEXT UNIQUE;

ALTER TABLE seeders
  ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE seeders
  ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE seeders
  ADD COLUMN IF NOT EXISTS orientation_completed_at TIMESTAMPTZ;

-- ── C) New table: seeder_listing_credits ──

CREATE TABLE IF NOT EXISTS seeder_listing_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeder_id UUID REFERENCES seeders(id) ON DELETE RESTRICT NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE RESTRICT NOT NULL,
  founder_id UUID REFERENCES founders(id) ON DELETE RESTRICT NOT NULL,
  amount_cents INTEGER NOT NULL,
  payout_status TEXT DEFAULT 'pending'
    CHECK (payout_status IN ('pending', 'paid', 'voided')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE (seeder_id, listing_id, founder_id)
);

-- ── D) New table: seeder_login_tokens ──

CREATE TABLE IF NOT EXISTS seeder_login_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeder_id UUID REFERENCES seeders(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_seeder_login_tokens_token
  ON seeder_login_tokens(token);

-- ── E) Row Level Security ──

ALTER TABLE seeder_listing_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE seeder_login_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE seeders ENABLE ROW LEVEL SECURITY;
