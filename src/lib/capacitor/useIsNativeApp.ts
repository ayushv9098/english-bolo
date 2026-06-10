"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Returns true only when the app is running inside the native Capacitor shell
 * (the Android/iOS app), false in a normal web browser.
 *
 * Starts as `false` on both server render and first client paint to avoid a
 * hydration mismatch, then flips to the real value after mount. Use it to hide
 * features that don't work inside the native webview (e.g. Google OAuth, which
 * Google blocks in embedded webviews).
 */
export function useIsNativeApp() {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  return isNative;
}
