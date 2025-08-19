// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      // ZMIANA: Dodajemy 'user' jako możliwą rolę
      role: "root" | "admin" | "adder" | "user";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    // ZMIANA: Dodajemy 'user' jako możliwą rolę
    role: "root" | "admin" | "adder" | "user";
  }
}