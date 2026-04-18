import { createClient } from '@supabase/supabase-js'

// Server-side client using service role (NEVER expose service key to the browser)
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL as string
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  return createClient(url, key, { auth: { persistSession: false } })
}

// Server-side client using anon for safe reads
export function supabaseAnon() {
  const url = process.env.SUPABASE_URL as string
  const key = process.env.SUPABASE_ANON_KEY as string
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
  return createClient(url, key, { auth: { persistSession: false } })
}
