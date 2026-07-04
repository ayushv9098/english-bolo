import type { Metadata, Viewport } from "next";
import { Baloo_2, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import NativeAppInit from "@/components/native/NativeAppInit";
import OfflineNotice from "@/components/native/OfflineNotice";

const baloo2 = Baloo_2({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo2",
});

const notoDevanagari = Noto_Sans_Devanagari({ 
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-devanagari",
});

export const metadata: Metadata = {
  title: "AngreziBolo | Learn English Easily",
  description: "Learn English with an Indian touch. Improve your speaking, listening, and grammar through interactive daily lessons.",
  keywords: ["learn English online", "English speaking app", "Angrezi bolo", "free English lessons", "improve English communication"],
  openGraph: {
    title: "AngreziBolo | Learn English Easily",
    description: "Learn English with an Indian touch. Improve your speaking, listening, and grammar through interactive daily lessons.",
    siteName: "AngreziBolo",
    locale: "en_IN",
    type: "website",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#FF6B00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Let CSS env(safe-area-inset-*) work on notched devices inside the app.
  viewportFit: "cover",
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${baloo2.variable} ${notoDevanagari.variable} font-sans`}>
        <Script id="theme-script">
          {`try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}`}
        </Script>
        <ServiceWorkerRegister />
        <NativeAppInit />
        <OfflineNotice />
        {children}
      </body>
    </html>
  );
}
