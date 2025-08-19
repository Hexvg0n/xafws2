// components/providers.tsx

"use client";

import type React from "react";
import { ThemeProvider } from "next-themes";
import { ReactLenis } from "lenis/react";
import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "./context/WishlistProvider";
import { PreferencesProvider } from "./context/PreferencesProvider"; // <-- DODAJ IMPORT

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PreferencesProvider> {/* <-- OWIŃ APLIKACJĘ (KOLEJNOŚĆ WAŻNA) */}
        <WishlistProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
              {children}
            </ReactLenis>
          </ThemeProvider>
        </WishlistProvider>
      </PreferencesProvider>
    </SessionProvider>
  );
}