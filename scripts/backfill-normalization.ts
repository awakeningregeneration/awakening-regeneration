/**
 * One-time backfill: normalize existing location data in the listings table.
 *
 * Applies the shared normalization utility (app/lib/normalize.ts) to
 * state, county, and city fields on all active listings. Compares stored
 * values against what the normalizer would produce and updates any that
 * differ.
 *
 * Two modes:
 *   DRY-RUN (default): npx tsx scripts/backfill-normalization.ts
 *   APPLY:             npx tsx scripts/backfill-normalization.ts --apply
 *
 * Idempotent — safe to re-run. If everything is already canonical,
 * dry-run reports "0 rows would change" and apply mode does nothing.
 *
 * Only operates on the listings table. The stories table was empty at
 * the time of writing (May 26, 2026) and is skipped.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { normalizeState, normalizeCounty, normalizeCity } from "../app/lib/normalize";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required env vars. Check .env.local for:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL");
  console.error("  SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const applyMode = process.argv.includes("--apply");

type Change = {
  id: string;
  title: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
};

type RowUpdate = {
  id: string;
  title: string;
  changes: Change[];
  update: Record<string, string | null>;
};

function norm(value: string | null, normalizer: (v?: string) => string): string | null {
  if (!value) return null;
  const result = normalizer(value);
  return result || null;
}

async function main() {
  console.log("");
  console.log(applyMode
    ? "=== APPLY MODE — changes will be written to production ==="
    : "=== DRY-RUN MODE — no changes will be written ==="
  );
  console.log("");

  const { data: rows, error } = await supabase
    .from("listings")
    .select("id, title, city, state, county")
    .eq("status", "active");

  if (error) {
    console.error("Failed to fetch listings:", error.message);
    process.exit(1);
  }

  if (!rows || rows.length === 0) {
    console.log("No active listings found.");
    return;
  }

  console.log(`Scanned ${rows.length} active listings.\n`);

  const updates: RowUpdate[] = [];

  for (const row of rows) {
    const changes: Change[] = [];
    const update: Record<string, string | null> = {};

    const newState = norm(row.state, normalizeState);
    if (newState !== row.state) {
      changes.push({ id: row.id, title: row.title, field: "state", oldValue: row.state, newValue: newState });
      update.state = newState;
    }

    const newCounty = norm(row.county, normalizeCounty);
    if (newCounty !== row.county) {
      changes.push({ id: row.id, title: row.title, field: "county", oldValue: row.county, newValue: newCounty });
      update.county = newCounty;
    }

    const newCity = norm(row.city, normalizeCity);
    if (newCity !== row.city) {
      changes.push({ id: row.id, title: row.title, field: "city", oldValue: row.city, newValue: newCity });
      update.city = newCity;
    }

    if (changes.length > 0) {
      updates.push({ id: row.id, title: row.title, changes, update });
    }
  }

  // Summary stats
  const stateChanges = updates.reduce((n, u) => n + u.changes.filter(c => c.field === "state").length, 0);
  const countyChanges = updates.reduce((n, u) => n + u.changes.filter(c => c.field === "county").length, 0);
  const cityChanges = updates.reduce((n, u) => n + u.changes.filter(c => c.field === "city").length, 0);

  console.log(`${updates.length} rows would change:`);
  console.log(`  ${stateChanges} state changes`);
  console.log(`  ${countyChanges} county changes`);
  console.log(`  ${cityChanges} city changes`);
  console.log("");

  if (updates.length === 0) {
    console.log("Everything is already canonical. Nothing to do.\n");
    return;
  }

  // Show examples
  const allChanges = updates.flatMap(u => u.changes);
  const showCount = Math.min(allChanges.length, 20);
  for (let i = 0; i < showCount; i++) {
    const c = allChanges[i];
    console.log(`  [${c.id}] ${c.title} — ${c.field} '${c.oldValue}' → '${c.newValue}'`);
  }
  if (allChanges.length > 20) {
    console.log(`  ... and ${allChanges.length - 20} more`);
  }
  console.log("");

  if (!applyMode) {
    console.log("To apply these changes, re-run with --apply\n");
    return;
  }

  // Apply updates
  let updated = 0;
  let failed = 0;
  const failures: { id: string; title: string; error: string }[] = [];

  for (const row of updates) {
    const { error: updateError } = await supabase
      .from("listings")
      .update(row.update)
      .eq("id", row.id);

    if (updateError) {
      console.error(`FAIL [${row.id}] ${row.title}: ${updateError.message}`);
      failed++;
      failures.push({ id: row.id, title: row.title, error: updateError.message });
    } else {
      for (const c of row.changes) {
        console.log(`Updated [${c.id}] ${c.title}: ${c.field} '${c.oldValue}' → '${c.newValue}'`);
      }
      updated++;
    }
  }

  console.log(`\nDone. Updated ${updated} rows.`);
  if (failed > 0) {
    console.log(`${failed} failures:`);
    for (const f of failures) {
      console.log(`  [${f.id}] ${f.title}: ${f.error}`);
    }
  }
  console.log("");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
