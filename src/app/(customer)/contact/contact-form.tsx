"use client";

import { useState } from "react";

const inputClass =
  "mt-1.5 block w-full h-11 md:h-9 rounded-[5px] border border-[#E5E5E5] bg-white px-3 text-[12px] text-[#10232B] outline-none transition-colors placeholder:text-[#B9B4AC] focus:border-[#C98255] disabled:bg-[#F5F3EF] disabled:cursor-not-allowed";

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
      <div className="mt-6 flex flex-col items-center gap-3 rounded-[5px] border border-[#C9E3CF] bg-[#F2FAF4] px-5 py-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3E7C4F]">
          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <h3 className="text-[14px] font-semibold text-[#10232B]">Message Sent</h3>
        <p className="max-w-[260px] text-[12px] leading-relaxed text-[#555555]">
          Thanks for reaching out! We&apos;ll get back to you as soon as possible.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-1 h-9 rounded-full border border-[#C98255] px-6 text-[11px] font-medium text-[#C98255] transition-colors hover:bg-[#C98255] hover:text-white"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
      <label className="block">
        <span className="text-[11px] font-medium text-[#10232B]">Name</span>
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
        <span className="text-[11px] font-medium text-[#10232B]">Email</span>
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
        <span className="text-[11px] font-medium text-[#10232B]">Subject</span>
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
        <span className="text-[11px] font-medium text-[#10232B]">Message</span>
        <textarea
          name="message"
          required
          rows={4}
          disabled={status === "submitting"}
          className="mt-1.5 block w-full h-[90px] md:h-[75px] resize-none rounded-[5px] border border-[#E5E5E5] bg-white px-3 py-2 text-[12px] text-[#10232B] outline-none transition-colors placeholder:text-[#B9B4AC] focus:border-[#C98255] disabled:bg-[#F5F3EF] disabled:cursor-not-allowed"
          placeholder="Write your message here"
        />
      </label>

      {error && (
        <p className="mt-2 text-[12px] text-[#B4552F] font-medium" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full h-11 md:h-9 rounded-full bg-[#C98255] text-[11px] font-medium text-white transition-colors hover:bg-[#B5703F] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending..." : "Send Now"}
      </button>
    </form>
  );
}
