"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { LogoMark } from "@/components/shared/logo-mark";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }
      setState("sent");
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div data-section="auth-forgot-password" className="section-auth-forgot-password w-full max-w-[440px] z-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-terracotta">Account recovery</p>
      <h1 className="mt-4 font-heading text-4xl lg:text-5xl text-clay leading-tight">Reset your password</h1>
      <p className="mt-3 text-sm text-clay/60">
        Enter your account email and we&apos;ll send you a link to set a new password.
      </p>

      <div className="mt-8 bg-white rounded-2xl border border-clay/10 shadow-[0px_8px_40px_rgba(61,43,31,0.06)] p-6 sm:p-8">
        {state === "sent" ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden />
              <div>
                <p className="text-[13px] font-bold text-emerald-700">Check your inbox</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-emerald-700/80">
                  If an account exists for {email}, a reset link has been sent. The link expires in 1 hour.
                </p>
              </div>
            </div>
            <Link href="/login" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-clay/50 hover:text-clay transition-colors">
              <ArrowLeft className="w-4 h-4" aria-hidden /> Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-widest text-clay/50">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@vellora.com"
                  className="w-full h-12 rounded-lg border border-clay/20 bg-white px-4 pr-11 text-sm text-clay transition-all placeholder:text-clay/30 focus:border-terracotta/70 focus:ring-2 focus:ring-terracotta/15 outline-none"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-clay/30" aria-hidden />
              </div>
            </div>

            {state === "error" && message && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" aria-hidden />
                <p className="text-[13px] text-red-700">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={state === "loading"}
              className="w-full bg-terracotta text-white h-12 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-terracotta/25 hover:bg-clay transition-all duration-300 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {state === "loading" ? "Sending…" : "Send reset link"}
            </button>

            <p className="text-[13px] text-center text-clay/60">
              Remembered it?{" "}
              <Link href="/login" className="text-terracotta font-bold hover:underline inline-block">
                Back to sign in
              </Link>
            </p>
          </form>
        )}
      </div>

      <footer className="mt-8 text-center">
        <p className="text-[10px] text-clay/30">&copy; 2026 Vellora. Multi-vendor marketplace.</p>
      </footer>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-dvh bg-sand flex flex-col relative overflow-hidden">
      <header className="flex items-center justify-between px-5 lg:px-10 h-20 border-b border-clay/10 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 select-none" draggable={false}>
          <LogoMark className="h-7 w-7 lg:h-8 lg:w-8 text-foreground" />
          <h1 className="text-xl lg:text-2xl font-black tracking-tighter uppercase text-foreground">VELLORA</h1>
        </Link>
        <Link href="/login" className="text-[11px] font-semibold text-clay/50 hover:text-clay transition-colors inline-flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" aria-hidden /> Back to Sign in
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 lg:px-12 py-10 lg:py-16">
        <Suspense fallback={<div className="w-full max-w-[480px] text-center text-clay/40 py-20">Loading...</div>}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}