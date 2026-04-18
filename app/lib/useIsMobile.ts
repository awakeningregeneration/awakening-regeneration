"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the viewport is below 768px.
 * Initializes to false on the server (avoids hydration mismatch).
 * Updates on resize via matchMedia listener.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);

    function onChange(e: MediaQueryListEvent) {
      setIsMobile(e.matches);
    }

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
