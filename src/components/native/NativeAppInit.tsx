"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Runs native-only setup when the deployed site is loaded inside the Capacitor
 * Android/iOS shell: colours the status bar (theme-aware), hides the splash
 * screen once the web app has painted, and wires the Android hardware back
 * button to the webview's history. No-op in a normal browser.
 *
 * Mounted once in the root layout. Renders nothing.
 */
export default function NativeAppInit() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ StatusBar, Style }, { SplashScreen }, { App }] = await Promise.all([
        import("@capacitor/status-bar"),
        import("@capacitor/splash-screen"),
        import("@capacitor/app"),
      ]);

      // Match the status bar to the app's surface colour + current theme.
      const applyStatusBar = async () => {
        const isDark = document.documentElement.classList.contains("dark");
        try {
          await StatusBar.setOverlaysWebView({ overlay: false });
          await StatusBar.setBackgroundColor({ color: isDark ? "#12121A" : "#FDF6F0" });
          await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
        } catch {
          // setBackgroundColor is Android-only; ignore on platforms that lack it.
        }
      };
      await applyStatusBar();

      // Re-apply when the user toggles dark mode (html.dark class flips).
      const themeObserver = new MutationObserver(() => {
        void applyStatusBar();
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // Hide the splash once React has mounted and painted.
      try {
        await SplashScreen.hide();
      } catch {
        /* no splash on this platform */
      }

      // Android hardware back: go back in history, or exit at the root.
      const backSub = await App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack && window.history.length > 1) {
          window.history.back();
        } else {
          void App.exitApp();
        }
      });

      cleanup = () => {
        themeObserver.disconnect();
        void backSub.remove();
      };
    })();

    return () => cleanup?.();
  }, []);

  return null;
}
