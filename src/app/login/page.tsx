"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, AlertCircle } from "lucide-react";
import { LogoMark } from "@/components/shared/logo-mark";

const EMAIL_KEY = "vellora_last_email";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [error, setError] = useState(
    searchParams.get("error") === "google-account-not-found"
      ? "google-account-not-found"
      : ""
  );
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailRef.current) {
      const lastEmail = localStorage.getItem(EMAIL_KEY);
      if (lastEmail) emailRef.current.value = lastEmail;
    }
  }, []);

  function handleEmailFocus() {
    if (emailRef.current) emailRef.current.readOnly = false;
  }
  function handlePasswordFocus() {
    if (passwordRef.current) passwordRef.current.readOnly = false;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      rememberMe: String(rememberMe),
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      localStorage.setItem(EMAIL_KEY, email);
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      {/* Eyebrow */}
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta font-label">
        Curated Marketplace
      </p>

      {/* Heading */}
      <h1 className="mt-5 text-[36px] sm:text-[42px] lg:text-[48px] font-heading font-semibold text-clay leading-[1.05] tracking-[-0.02em]">
        Welcome back
      </h1>
      <p className="mt-3 text-[15px] text-clay/60 leading-relaxed">
        Sign in to continue shopping from your favorite stores.
      </p>

      {/* Form card */}
      <div className="mt-8 sm:mt-10 bg-white rounded-xl border border-clay/10 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-[0.2em] font-label text-clay">
              Email Address
            </label>
            <div className="relative group">
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@vellora.com"
                readOnly
                onFocus={handleEmailFocus}
                autoComplete="off"
                className="w-full h-12 rounded-lg border border-clay/15 bg-[#FAF7EF] px-4 pr-11 text-[14px] text-clay transition-all placeholder:text-clay/40 focus:border-terracotta/60 focus:ring-2 focus:ring-terracotta/10 outline-none"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-clay/25 group-focus-within:text-terracotta transition-colors" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-[0.2em] font-label text-clay">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-semibold text-terracotta hover:text-clay transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative group">
              <input
                ref={passwordRef}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                readOnly
                onFocus={handlePasswordFocus}
                autoComplete="off"
                className="w-full h-12 rounded-lg border border-clay/15 bg-[#FAF7EF] px-4 pr-11 text-[14px] text-clay transition-all placeholder:text-clay/40 focus:border-terracotta/60 focus:ring-2 focus:ring-terracotta/10 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-clay/25 hover:text-clay/60 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Stay signed in */}
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-clay/20 text-terracotta focus:ring-terracotta/30 accent-terracotta"
            />
            <span className="text-[13px] text-clay/60 select-none">Stay signed in for 30 days</span>
          </label>

          {/* Errors */}
          {error && error === "google-account-not-found" ? (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[13px] font-bold text-red-700">
                  No account found with this Google email
                </p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-red-600/80">
                  Please register first to continue.
                </p>
              </div>
            </div>
          ) : error ? (
            <p className="text-[13px] text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
          ) : null}

          {/* Sign In */}
          <button
            type="submit"
            className="w-full bg-terracotta text-white h-12 rounded-lg text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-clay transition-all duration-300 active:scale-[0.98]"
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <div className="h-px flex-1 bg-clay/10" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-clay/50">or</span>
            <div className="h-px flex-1 bg-clay/10" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-lg border border-clay/15 text-[13px] font-semibold text-clay hover:bg-[#FAF7EF] transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>
        </form>

        {/* Create account */}
        <p className="text-[13px] text-center text-clay/60 mt-7">
          New to the marketplace?{" "}
          <Link href="/register" className="text-terracotta font-bold hover:text-clay transition-colors">
            Create an account
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-[10px] text-clay/50">
        &copy; 2026 Vellora. Multi-vendor marketplace.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-[#FAF7EF] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 lg:px-10 h-16 lg:h-20 border-b border-clay/8 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 select-none" draggable={false}>
          <LogoMark className="h-6 w-6 lg:h-7 lg:w-7 text-clay" />
          <span className="text-lg lg:text-xl font-black tracking-tighter uppercase text-clay">
            VELLORA
          </span>
        </Link>
        <Link
          href="/"
          className="text-[11px] font-semibold text-clay/60 hover:text-clay transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 12H5m7-7l-7 7 7 7" strokeWidth="1.5" />
          </svg>
          Back to Shop
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_1fr]">

        {/* Left — Login form */}
        <div className="flex items-center justify-center px-5 sm:px-8 lg:px-12 py-10 lg:py-16 order-2 lg:order-1">
          <Suspense fallback={<div className="w-full max-w-[420px] text-center text-clay/40 py-20">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Right — Editorial brand panel (desktop) */}
        <div className="relative hidden lg:block h-auto overflow-hidden order-1 lg:order-2">
          <img
            src="/auth-hero.jpg"
            alt="Curated products in a natural shopping bag"
            className="absolute inset-0 w-full h-full object-cover"
            width="1920"
            height="1080"
          />
          {/* Readability gradient — strongest at bottom where text sits */}
          <div className="absolute inset-0 bg-gradient-to-t from-clay/80 via-clay/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-clay/10 to-transparent" />

          {/* Copy overlay */}
          <div className="absolute inset-x-0 bottom-0 p-10 lg:p-14">
            <LogoMark className="h-9 w-9 text-sand" />
            <p className="mt-6 text-[28px] lg:text-[34px] font-heading font-semibold text-sand leading-[1.15] tracking-[-0.01em] max-w-md">
              Shop thoughtfully curated goods from independent stores.
            </p>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-sand/60 font-label">
              Electronics &middot; Home &middot; Lifestyle
            </p>
          </div>
        </div>

        {/* Mobile brand visual */}
        <div className="relative lg:hidden h-48 sm:h-56 overflow-hidden order-1">
          <img
            src="/auth-hero.jpg"
            alt="Curated products in a natural shopping bag"
            className="absolute inset-0 w-full h-full object-cover"
            width="1920"
            height="1080"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-clay/70 via-clay/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="text-[20px] sm:text-[24px] font-heading font-semibold text-sand leading-snug max-w-sm">
              Shop thoughtfully curated goods from independent stores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
