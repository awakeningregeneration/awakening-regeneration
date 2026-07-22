-- Bridge the Commons — large-gift inquiry table.
-- Stores inquiries from donors wanting to give outside the Stripe tiers.
-- No payment processing; Ren follows up personally.

CREATE TABLE IF NOT EXISTS public.bridge_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  gift_range TEXT NOT NULL CHECK (gift_range IN ('500-1000', '1000-5000', '5000+')),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'responded', 'gift_received')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
