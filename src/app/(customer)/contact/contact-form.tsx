"use client";

import { useState } from "react";

const inputClass =
  "mt-2 block w-full h-12 bg-transparent border-0 border-b border-clay/15 text-[15px] sm:text-[16px] text-clay placeholder:text-clay/35 focus:outline-none focus:border-terracotta transition-colors pb-2 disabled:opacity-40 disabled:cursor-not-allowed";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Message could not be sent. Please try again.");
      }
      form.reset();
      setStatus("success");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="py-12 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10 mb-4">
          <svg className="h-5 w-5 text-terracotta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-[18px] font-semibold text-clay">Message sent</h3>
        <p className="mt-2 text-[14px] text-clay/55 max-w-[280px] mx-auto">
          Thanks for reaching out! We&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-[12px] font-bold uppercase tracking-[0.12em] text-terracotta hover:text-clay transition-colors"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className="block">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-clay/45 font-label">
          Name
        </span>
        <input
          name="name"
          type="text"
          required
          disabled={status === "submitting"}
          className={inputClass}
          placeholder="Your name"
        />
      </label>

      <label className="block">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-clay/45 font-label">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          disabled={status === "submitting"}
          className={inputClass}
          placeholder="you@email.com"
        />
      </label>

      <label className="block">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-clay/45 font-label">
          Subject
        </span>
        <input
          name="subject"
          type="text"
          required
          disabled={status === "submitting"}
          className={inputClass}
          placeholder="How can we help?"
        />
      </label>

      <label className="block">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-clay/45 font-label">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={5}
          disabled={status === "submitting"}
          className="mt-2 block w-full bg-transparent border-0 border-b border-clay/15 text-[15px] sm:text-[16px] text-clay placeholder:text-clay/35 focus:outline-none focus:border-terracotta transition-colors pb-2 resize-none h-[120px] sm:h-[140px] disabled:opacity-40 disabled:cursor-not-allowed"
          placeholder="Write your message here"
        />
      </label>

      {error && (
        <p className="text-[13px] text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full h-[50px] rounded-full bg-terracotta text-[12px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-[#8B4513] hover:shadow-[0_4px_16px_rgba(166,99,75,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
