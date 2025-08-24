// app/layout.tsx

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  // Podstawowe informacje
  title: "XaffReps",
  description: "Szukaj itemów, znajdź najlepszy batch, sprawdź szybko item lub przekonwertuj link. Wszystko w jednym miejscu.",
  keywords: ["replica", "fashion", "reviews", "community", "batches", "repy", "w2c", "best batch"],
  
  // Informacje Open Graph (dla Discord, Facebook itp.)
  openGraph: {
    title: "XaffReps",
    description: "Wszystko, czego potrzebujesz w jednym miejscu.",
    url: "https://xaffreps.xyz", 
    siteName: "XaffReps",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "XaffReps - Logo",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },

  // Twitter Card (dla lepszego wyświetlania na Twitterze/X)
  twitter: {
    card: "summary_large_image",
    title: "XaffReps - Najlepsze polskie rep community",
    description: "Wszystko, czego potrzebujesz w świecie replik, w jednym miejscu.",
    images: ["/og-image.png"], // Ta sama grafika co w Open Graph
  },

  // Ikony (Favicon)
  icons: {
    icon: "/favicon.ico", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${inter.variable} font-sans antialiased bg-[#0d0d0d] text-white/90 relative`}
      >
        {/* Top gradient - bardziej miękkie przejścia */}
        <div
          className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-br from-emerald-400/10 from-10% via-teal-500/5 via-40% to-transparent to-90% -z-10"
          style={{
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
            filter: "blur(20px)",
          }}
        />

        {/* Bottom gradient - rozmyte krawędzie */}
        <div
          className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-tl from-teal-500/10 from-10% via-green-500/5 via-40% to-transparent to-90% -z-10"
          style={{
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
            filter: "blur(20px)",
          }}
        />

        <Providers>
          <Navbar />
          <main className="min-h-screen relative z-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}