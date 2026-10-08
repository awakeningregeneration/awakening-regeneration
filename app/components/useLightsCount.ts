"use client";

import { useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 60_000;
const COUNT_ENDPOINT = "/api/listings/count";

/**
 * Lightweight, resilient polling for the published-listing count.
 *
 * - Seeded from whatever count the caller already has (e.g. the map's
 *   own listings fetch), so the number is correct immediately rather
 *   than waiting on the first poll.
 * - Polls a count-only endpoint every 60s — never the full listings
 *   payload, and independent of the map's own data fetch.
 * - Pauses entirely while the tab is hidden (no timer, no requests);
 *   polls once immediately on return, then resumes the normal interval.
 * - Fails quietly: a failed or malformed response is ignored outright —
 *   the last known good value is never replaced with 0 or an error
 *   state, and the number never changes except to a real value the
 *   server actually returned.
 */
export function useLightsCount(initialCount: number): number {
  const [count, setCount] = useState(initialCount);
  const hasPolledRef = useRef(false);

  // Track the caller's own count until the first successful poll takes
  // over — covers the window before the map's own listings fetch (and
  // therefore initialCount) has resolved.
  useEffect(() => {
    if (!hasPolledRef.current) {
      setCount(initialCount);
    }
  }, [initialCount]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    function clearTimer() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

    async function poll() {
      try {
        const res = await fetch(COUNT_ENDPOINT, { cache: "no-store" });
        if (!res.ok) return; // fail quietly — keep the last known good value
        const data = await res.json();
        const next = data?.count;
        if (cancelled) return;
        if (typeof next === "number" && Number.isFinite(next) && next >= 0) {
          hasPolledRef.current = true;
          setCount(next);
        }
        // malformed payload: silently ignored, last known good value stands
      } catch {
        // network error — fail quietly, try again next interval
      }
    }

    function scheduleNext() {
      clearTimer();
      if (document.hidden || cancelled) return; // paused while hidden
      timer = setTimeout(async () => {
        await poll();
        scheduleNext();
      }, POLL_INTERVAL_MS);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        clearTimer();
      } else {
        // Catch up immediately on return, then resume the normal cadence.
        void poll().then(scheduleNext);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (!document.hidden) {
      scheduleNext();
    }

    return () => {
      cancelled = true;
      clearTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return count;
}
