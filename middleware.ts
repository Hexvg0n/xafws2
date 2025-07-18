// middleware.ts

// Importujemy tylko domyślny middleware z next-auth
export { default } from "next-auth/middleware";

// Określamy, że ten middleware ma chronić wszystkie ścieżki
// zaczynające się od /admin/
export const config = {
  matcher: ["/admin/:path*"],
};