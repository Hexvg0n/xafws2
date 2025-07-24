// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      // Dodajemy rolę 'user' do typu
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
    // Dodajemy rolę 'user' do typu
    role: "root" | "admin" | "adder" | "user";
  }
}