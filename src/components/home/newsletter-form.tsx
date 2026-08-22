"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  return (
    <div>
      <form className="flex flex-col sm:flex-row gap-0">
        <input
          className="flex-grow bg-white/10 backdrop-blur-md border border-white/30 px-8 py-5 text-sm focus:outline-none focus:bg-white/20 transition-all placeholder:text-white/50"
          placeholder="Enter your email"
          type="email"
          required
        />
        <button
          type="submit"
          className="bg-white text-clay px-10 py-5 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-terracotta hover:text-white transition-colors duration-500 whitespace-nowrap"
          onClick={async (e) => {
            e.preventDefault();
            const form = e.currentTarget.closest("form")!;
            const email = (form.querySelector("input") as HTMLInputElement).value;
            if (!email) return;
            await fetch("/api/newsletter", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            form.querySelector("input")!.value = "";
            setStatus("success");
          }}
        >
          Subscribe
        </button>
      </form>
      {status === "success" && (
        <p className="mt-4 text-sm font-medium text-white/90">
          You&apos;re subscribed! Check your inbox to confirm.
        </p>
      )}
    </div>
  );
}
