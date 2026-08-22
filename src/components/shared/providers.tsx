"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthGuard } from "@/components/shared/auth-guard";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const tryReload = () => {
      if (sessionStorage.getItem("vellora_checkout_return") === "1") {
        sessionStorage.removeItem("vellora_checkout_return");
        window.location.reload();
      }
    };
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload();
      } else {
        tryReload();
      }
    };
    const onFocus = () => tryReload();
    const onVisible = () => {
      if (document.visibilityState === "visible") tryReload();
    };
    window.addEventListener("pageshow", onShow);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("pageshow", onShow);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <SessionProvider>
      <AuthGuard>
        {children}
      </AuthGuard>
    </SessionProvider>
  );
}
