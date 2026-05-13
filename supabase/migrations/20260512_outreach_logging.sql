-- ============================================================
-- Outreach logging: new columns + CHECK constraint extension
-- Applied to production via Supabase Studio on May 12, 2026
-- This file is the canonical record of the schema change
-- ============================================================

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS outreach_methods TEXT[] DEFAULT NULL;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS outreach_notes TEXT DEFAULT NULL;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS manual_outreach_at TIMESTAMPTZ DEFAULT NULL;

-- Extend outreach_status CHECK to include 'manual_outreach_sent'
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_outreach_status_check;
ALTER TABLE listings ADD CONSTRAINT listings_outreach_status_check
  CHECK (outreach_status IN ('not_started', 'email_1_sent', 'email_2_sent',
                              'email_3_sent', 'claimed', 'removed',
                              'unsubscribed', 'bounced', 'manual_outreach_sent'));
