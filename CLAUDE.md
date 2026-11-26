# CLAUDE.md — Canary Commons

## Infrastructure cost and flight-readiness

Before investigating Mapbox/Netlify/Supabase cost, scaling, rate limits, or launch-readiness questions, read **[`docs/FLIGHT-READINESS.md`](docs/FLIGHT-READINESS.md)** first — it's the maintained record of prior findings, verified safeguards, decisions already made, and open questions. Update it rather than re-deriving the analysis from scratch.

## Security — never print secrets

**Hard rule for every session:** Never print, echo, or display secret keys, service-role keys, API keys, tokens, webhook secrets, or .env contents — not in commands, not in curl calls, not in output, not in summaries. When querying Supabase or any credentialed service, read the key from the environment (e.g. `$SUPABASE_SERVICE_ROLE_KEY`) so it never appears as literal text. Redact any credential that would otherwise show.
