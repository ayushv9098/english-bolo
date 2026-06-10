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
  title: "AngreziBolo",
  description: "Learn English with an Indian touch",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply saved theme before paint to avoid a flash of the wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${baloo2.variable} ${notoDevanagari.variable} font-sans`}>
        <ServiceWorkerRegister />
        <NativeAppInit />
        <OfflineNotice />
        {children}
      </body>
    </html>
  );
}
