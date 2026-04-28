import { supabaseAdmin } from "./supabaseAdmin";

/**
 * DB-backed synonym lookup with 1-hour in-memory cache.
 *
 * Reads all synonym groups from the synonym_groups table.
 * For a given search term, finds every group where the term appears
 * (as a substring match against any member), and returns the union
 * of all members from those groups (excluding the original term).
 *
 * Cache refreshes at most once per hour. The first search after
 * cache expiry pays the DB roundtrip; everyone else hits cache.
 */

type SynonymGroup = {
  id: string;
  terms: string[];
};

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let cachedGroups: SynonymGroup[] = [];
let cacheTimestamp = 0;

async function loadGroups(): Promise<SynonymGroup[]> {
  const now = Date.now();
  if (cachedGroups.length > 0 && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedGroups;
  }

  const { data, error } = await supabaseAdmin
    .from("synonym_groups")
    .select("id, terms");

  if (error) {
    console.error("Failed to load synonym groups:", error.message);
    // Return stale cache if available, empty array if not
    return cachedGroups;
  }

  cachedGroups = (data ?? []) as SynonymGroup[];
  cacheTimestamp = now;
  return cachedGroups;
}

/**
 * Returns all synonym terms for a given search term.
 *
 * Matching is bidirectional: if "thrift" appears in a group with
 * "clothing" and "secondhand", then getSynonyms("thrift") returns
 * ["clothing", "secondhand", ...] and getSynonyms("clothing")
 * returns ["thrift", "secondhand", ...].
 *
 * Uses substring matching against group members so that searching
 * "solar" matches a group containing "solar" even if the group
 * also contains "renewable energy".
 */
export async function getSynonyms(term: string): Promise<string[]> {
  if (!term.trim()) return [];

  const groups = await loadGroups();
  const needle = term.trim().toLowerCase();
  const result = new Set<string>();

  for (const group of groups) {
    const matched = group.terms.some((t) => {
      const lower = t.toLowerCase();
      return lower.includes(needle) || needle.includes(lower);
    });

    if (matched) {
      for (const t of group.terms) {
        if (t.toLowerCase() !== needle) {
          result.add(t.toLowerCase());
        }
      }
    }
  }

  return Array.from(result);
}
