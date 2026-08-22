"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") return;
    if (pathname.startsWith("/auth")) return;
    if (checkedRef.current) return;
    checkedRef.current = true;

    async function guardCheck() {
      try {
        const res = await fetch("/api/auth/guard", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.valid === false) {
          signOut({ callbackUrl: "/login?error=google-account-not-found" });
        }
      } catch {
        // Transient failure (slow compile, network hiccup). Retry once,
        // then leave the session alone rather than force-signing out.
        setTimeout(() => {
          fetch("/api/auth/guard", { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (data && data.valid === false) {
                signOut({ callbackUrl: "/login?error=google-account-not-found" });
              }
            })
            .catch(() => {
              /* leave the session alone */
            });
        }, 1500);
      }
    }

    guardCheck();
  }, [session, status, pathname]);

  return <>{children}</>;
}