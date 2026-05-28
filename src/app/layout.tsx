import type { Metadata, Viewport } from "next";
import { Baloo_2, Noto_Sans_Devanagari } from "next/font/google";
import { Agentation } from "agentation";
import { Toaster } from "react-hot-toast";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${baloo2.variable} ${notoDevanagari.variable} font-sans`}>
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '12px',
              fontFamily: 'var(--font-baloo2), sans-serif',
              fontWeight: 500,
            },
            success: {
              style: {
                background: '#22c55e',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
        {children}
        <Agentation />
      </body>
    </html>
  );
}
