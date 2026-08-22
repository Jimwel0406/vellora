import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? [Google] : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email as string;
        const password = credentials.password as string;
        const rememberMe = credentials.rememberMe === "true";
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .then((res) => res[0]);
        if (!user) return null;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role as "customer" | "vendor" | "admin",
          rememberMe,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const exists = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email!))
          .then((r) => r[0]);
        if (!exists) {
          const randomPassword = randomBytes(24).toString("hex");
          const hashed = await bcrypt.hash(randomPassword, 12);
          await db.insert(users).values({
            name: user.name || user.email!.split("@")[0],
            email: user.email!,
            password: hashed,
            role: "customer",
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // For Google sign-in, use the database user ID, not Google's ID
        if (account?.provider === "google") {
          const dbUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email!))
            .then((r) => r[0]);
          if (dbUser) {
            token.id = dbUser.id.toString();
            token.role = dbUser.role as "customer" | "vendor" | "admin";
          }
        } else {
          token.id = user.id;
          token.role = user.role;
        }
        token.email = user.email;
        token.rememberMe = user.rememberMe;
        // Only use short session if user explicitly unchecked "Remember me"
        const days = user.rememberMe === false ? 1 : 30;
        token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * days;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role ?? "customer";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
