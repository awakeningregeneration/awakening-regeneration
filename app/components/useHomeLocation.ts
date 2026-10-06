"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "canary_home";

export interface HomeLocation {
  state: string;
  county: string;
}

/**
 * Defensive, synchronous read of the saved home location. Safe to call
 * outside React lifecycle (e.g. inside another effect). Never throws —
 * any missing key, malformed JSON, or non-string field is treated as
 * "no saved home."
 */
export function readHomeLocation(): HomeLocation | null {
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
 * One user-chosen home location, remembered locally on this device only.
 * No account, no geolocation, nothing sent to a server.
 */
export function useHomeLocation() {
  const [home, setHomeState] = useState<HomeLocation | null>(null);

  useEffect(() => {
    setHomeState(readHomeLocation());
  }, []);

  const setHome = useCallback((state: string, county: string) => {
    const value: HomeLocation = { state, county };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // localStorage unavailable (private mode, quota, etc.) — fail quietly
    }
    setHomeState(value);
  }, []);

  return { home, setHome };
}
