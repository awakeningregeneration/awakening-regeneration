-- ============================================================
-- Add no_public_email flag to listings
-- Indicates the business has no public email address and was
-- reached via contact form, chat, social DM, or phone instead.
-- Run manually in Supabase SQL Editor.
-- ============================================================

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS no_public_email BOOLEAN NOT NULL DEFAULT false;
