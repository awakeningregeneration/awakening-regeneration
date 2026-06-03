# CLAUDE.md — Canary Commons

## Security — never print secrets

**Hard rule for every session:** Never print, echo, or display secret keys, service-role keys, API keys, tokens, webhook secrets, or .env contents — not in commands, not in curl calls, not in output, not in summaries. When querying Supabase or any credentialed service, read the key from the environment (e.g. `$SUPABASE_SERVICE_ROLE_KEY`) so it never appears as literal text. Redact any credential that would otherwise show.
