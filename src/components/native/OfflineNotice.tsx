"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Full-screen "no internet" overlay shown only inside the native app. The app
 * loads its content from the live site over the network, so without a
 * connection the webview would otherwise show a blank/broken page. Hidden in a
 * normal browser (the browser shows its own offline UI).
 */
export default function OfflineNotice() {
  const [isNative, setIsNative] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    setIsNative(true);

    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!isNative || !offline) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-3 bg-surface px-8 text-center">
      <div className="text-5xl">📡</div>
      <h2 className="text-lg font-extrabold text-brand-dark">No internet</h2>
      <p className="max-w-xs text-sm text-muted">
        AngreziBolo needs an internet connection. Please check your network and
        try again.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="btn-primary mt-2"
      >
        Retry
      </button>
    </div>
  );
}
