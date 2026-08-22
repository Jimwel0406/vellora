import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "vendor" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "customer" | "vendor" | "admin";
    rememberMe?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "customer" | "vendor" | "admin";
    rememberMe?: boolean;
  }
}