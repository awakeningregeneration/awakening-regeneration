-- Contributors: people who can submit affiliate resources via their own personal link.
-- Each contributor gets a unique slug that becomes their URL: /contributor/[slug]
-- contributor_id in affiliate_resources matches contributors.slug

CREATE TABLE IF NOT EXISTS contributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);
