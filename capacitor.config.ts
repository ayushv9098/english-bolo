import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.angrezibolo.app',
  appName: 'AngreziBolo',
  // We load the live site over the network (server.url below), so webDir is only
  // a fallback bundle. Keep it tiny — it is not the real app.
  webDir: 'capacitor-www',
  server: {
    // The deployed Next.js app. The native shell opens this URL fullscreen.
    url: 'https://english-bolo.vercel.app',
    cleartext: false,
  },
  android: {
    // Helps Supabase/SSR cookies behave like a normal browser session.
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#FFE5D9',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#FF6B00',
    },
  },
};

export default config;
