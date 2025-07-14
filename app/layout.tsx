import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Navbar } from "@/components/navbar"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "RepMafia - Premium Replica Community",
  description: "The ultimate destination for high-quality replica reviews, batches, and community insights.",
  keywords: ["replica", "fashion", "reviews", "community", "batches"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${inter.variable} font-sans antialiased bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] text-white/90`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
