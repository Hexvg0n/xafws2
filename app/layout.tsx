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
  title: "XaffReps - Premium Replica Community",
  description: "The ultimate destination for high-quality replica reviews, batches, and community insights.",
  keywords: ["replica", "fashion", "reviews", "community", "batches"],
    generator: 'v0.dev'
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