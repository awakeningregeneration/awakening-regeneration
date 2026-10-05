"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function detectIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOSUA = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ Safari reports a desktop-class UA by default, so also
  // catch touch-capable "MacIntel" as iPad.
  const isIPadDesktopUA =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return isIOSUA || isIPadDesktopUA;
}

function detectChromeFamily(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Chrome|CriOS|Chromium|Edg\//.test(navigator.userAgent);
}

function detectAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/.test(navigator.userAgent);
}

// True only when on iOS AND the browser is actually Safari — other iOS
// browsers (Chrome, Firefox, in-app browsers) carry their own UA token
// even though they share Safari's underlying engine.
function detectIOSSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return !/CriOS|FxiOS|EdgiOS|OPiOS|GSA/.test(ua);
}

function detectStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const iosStandalone = (
    window.navigator as Navigator & { standalone?: boolean }
  ).standalone;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    iosStandalone === true
  );
}

/**
 * Isolated install-prompt and platform-detection logic shared by the
 * "+ Add Canary App" nav item and the /install page. Captures the native
 * `beforeinstallprompt` event where the browser provides one, detects
 * iOS/Android/Safari, and detects whether the app is already running as an
 * installed standalone app.
 */
export function useInstallPrompt() {
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isChromeFamily, setIsChromeFamily] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(detectIOS());
    setIsAndroid(detectAndroid());
    setIsSafari(detectIOSSafari());
    setIsChromeFamily(detectChromeFamily());
    setIsStandalone(detectStandalone());

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredRef.current = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };
    const handleInstalled = () => {
      deferredRef.current = null;
      setCanInstall(false);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const deferred = deferredRef.current;
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    deferredRef.current = null;
    setCanInstall(false);
  }, []);

  return {
    canInstall,
    isIOS,
    isAndroid,
    isSafari,
    isChromeFamily,
    isStandalone,
    promptInstall,
  };
}
