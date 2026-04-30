import { supabaseAdmin } from "./supabaseAdmin";

/**
 * Reserved URL handles that cannot be used as seeder handles.
 * Includes all existing top-level routes and common reserved words.
 */
const RESERVED_HANDLES = new Set([
  // Existing top-level app routes
  "about",
  "api",
  "components",
  "constellation",
  "contributor",
  "edit",
  "founders",
  "lib",
  "map",
  "steward",
  "stories",
  "submit",
  "support",
  "types",
  // Explicitly listed reserved words
  "founder",
  "admin",
  "start",
  "place",
  "map-view",
  "login",
  "auth",
  "privacy",
  "terms",
  "contact",
  "home",
  // Defensive extras
  "dashboard",
  "settings",
  "profile",
  "search",
  "help",
]);

const HANDLE_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]{1}$/;

/**
 * Synchronous format-only validation.
 * Does NOT check database uniqueness.
 */
export function validateHandleFormat(handle: string): {
  valid: boolean;
  reason?: string;
} {
  if (!handle) return { valid: false, reason: "Handle is required" };
  if (handle.length < 2)
    return { valid: false, reason: "Handle must be at least 2 characters" };
  if (handle.length > 30)
    return { valid: false, reason: "Handle must be 30 characters or fewer" };
  if (handle !== handle.toLowerCase())
    return { valid: false, reason: "Handle must be lowercase" };
  if (!HANDLE_REGEX.test(handle))
    return {
      valid: false,
      reason:
        "Handle may only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen",
    };
  if (RESERVED_HANDLES.has(handle))
    return { valid: false, reason: "This handle is reserved" };
  return { valid: true };
}

/**
 * Full validation including database uniqueness check.
 * Must run server-side (uses supabaseAdmin).
 */
export async function isHandleAvailable(handle: string): Promise<boolean> {
  const format = validateHandleFormat(handle);
  if (!format.valid) return false;

  const { data } = await supabaseAdmin
    .from("seeders")
    .select("id")
    .eq("url_handle", handle)
    .limit(1);

  return !data || data.length === 0;
}
