-- Persistent outgoing queue for business-outreach email only.
-- Transactional email (magic links, receipts, verification, welcome)
-- is never queued — it keeps sending immediately, exactly as before.
--
-- One row per (listing_id, email_type) for the life of that outreach
-- step — retries reuse the same row (attempts++) rather than inserting
-- a new one, so re-running the candidate finder (seeder-outreach cron)
-- or re-placing/re-triggering never creates a duplicate send.
create table if not exists email_queue (
  id uuid primary key default gen_random_uuid(),
  email_type text not null check (email_type in ('email_1', 'email_2', 'email_3')),
  listing_id uuid not null references listings(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed')),
  attempts int not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  claimed_at timestamptz,
  sent_at timestamptz,
  unique (listing_id, email_type)
);

create index if not exists email_queue_status_created_idx
  on email_queue (status, created_at);

-- Internal server-side infrastructure table — not public data. RLS is
-- enabled with no policies for anon/authenticated, so PostgREST denies
-- both roles entirely. The service-role key used by every server-side
-- call site (Next.js API routes, Netlify scheduled functions) bypasses
-- RLS at the Postgres level regardless of policies, so none of this
-- feature's actual access is affected.
alter table email_queue enable row level security;

-- Debounce state for founder alerts — one row per alert type, holding
-- only the last time that specific alert fired. Lets the worker ask
-- "have I already told Ren about this recently?" without spamming on
-- every hourly run once a condition becomes true.
create table if not exists email_queue_alerts (
  alert_type text primary key,
  last_sent_at timestamptz not null
);

-- Same reasoning as email_queue above — internal infrastructure, no
-- anon/authenticated policies, service-role access unaffected.
alter table email_queue_alerts enable row level security;
