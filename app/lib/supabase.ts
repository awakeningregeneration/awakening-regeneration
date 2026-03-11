import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// safe for browser
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

// server-only use (NEVER import into client components)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);