"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check } from "lucide-react";

const inputCls =
  "mt-1.5 block w-full rounded-lg border border-clay/10 bg-white px-3.5 py-3 text-sm text-clay shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/50 placeholder:text-clay/30 transition-all";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-clay/50";

export function PersonalInfoForm({
  name: initialName,
  email: initialEmail,
}: {
  name: string;
  email: string;
}) {
  const router = useRouter();
  const firstNameRef = useRef<HTMLInputElement>(null);

  const nameParts = initialName.trim().split(/\s+/);
  const [firstName, setFirstName] = useState(nameParts[0] ?? "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" "));
  const [email, setEmail] = useState(initialEmail);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) {
      setMsg({ type: "error", text: "First name is required." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          email: email.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: "Profile updated." });
        router.refresh();
      } else {
        setMsg({ type: "error", text: data.error || "Something went wrong" });
      }
    } catch {
      setMsg({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="firstName" className={labelCls}>
            First Name
          </label>
          <input
            id="firstName"
            ref={firstNameRef}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputCls}
            placeholder="First name"
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelCls}>
            Last Name
          </label>
          <input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputCls}
            placeholder="Last name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelCls}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
          placeholder="you@example.com"
        />
      </div>

      {msg && (
        <p
          role="status"
          className={`text-sm font-medium ${msg.type === "success" ? "text-emerald-600" : "text-red-500"}`}
        >
          {msg.text}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-terracotta hover:bg-clay text-white px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-terracotta/20 hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
        >
          <Check className="w-4 h-4" strokeWidth={2} />
          {loading ? "Saving..." : "Update Changes"}
        </button>
        <button
          type="button"
          onClick={() => firstNameRef.current?.focus()}
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-terracotta hover:text-clay transition-colors cursor-pointer"
        >
          <Pencil className="w-4 h-4" strokeWidth={2} />
          Edit Profile
        </button>
      </div>
    </form>
  );
}