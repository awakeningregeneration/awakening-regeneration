-- Guard against duplicate steward claim confirmation emails.
-- Checked before sending; set immediately after successful send.

ALTER TABLE public.stewards
  ADD COLUMN IF NOT EXISTS confirmation_email_sent_at TIMESTAMPTZ DEFAULT NULL;
