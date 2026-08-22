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
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: "customer" | "vendor" | "admin";
  }
}
