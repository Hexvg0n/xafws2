"use client"

import type React from "react"
import { ThemeProvider } from "next-themes"
import { ReactLenis } from "lenis/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
        {children}
      </ReactLenis>
    </ThemeProvider>
  )
}
