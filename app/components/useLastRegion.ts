"use client";

const STORAGE_KEY = "canary_last_region";

export interface LastRegion {
  state: string;
  county: string;
}

/**
 * Defensive, synchronous read of the last-visited region. Safe to call
 * outside React lifecycle. Never throws — any missing key, malformed
 * JSON, or non-string field is treated as "no saved region."
 */
export function readLastRegion(): LastRegion | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const state = (parsed as Record<string, unknown>).state;
      const county = (parsed as Record<string, unknown>).county;
      if (typeof state === "string" && typeof county === "string") {
        const trimmedState = state.trim();
        const trimmedCounty = county.trim();
        if (trimmedState && trimmedCounty) {
          return { state: trimmedState, county: trimmedCounty };
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Remembers the last state/county explored on the map, on this device
 * only. Separate from the user-chosen "home" location — updates
 * automatically as the visitor browses, with no explicit action needed.
 */
export function writeLastRegion(state: string, county: string): void {
  try {
    const value: LastRegion = { state, county };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail quietly
  }
}
