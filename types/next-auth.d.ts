import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "root" | "admin" | "contributor";
      name?: string | null;
      email?: string | null;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "root" | "admin" | "contributor";
  }
}
