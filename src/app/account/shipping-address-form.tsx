"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MapPin } from "lucide-react";

export type SavedShipping = {
  shippingName: string;
  shippingLine1: string;
  shippingLine2: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingPhone: string;
};

const inputCls =
  "mt-1.5 block w-full rounded-lg border border-clay/10 bg-white px-3.5 py-3 text-sm text-clay shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/50 placeholder:text-clay/30 transition-all";
const labelCls =
  "block text-[11px] font-bold uppercase tracking-widest text-clay/50";

export function ShippingAddressForm({ address }: { address: SavedShipping }) {
  const router = useRouter();
  const [form, setForm] = useState<SavedShipping>(address);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const set =
    (key: keyof SavedShipping) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.shippingName.trim() || !form.shippingLine1.trim() || !form.shippingCity.trim()) {
      setMsg({ type: "error", text: "Name, address line 1, and city are required." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: "Shipping address saved. It will pre-fill at checkout." });
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
    <form onSubmit={save} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label htmlFor="shippingName" className={labelCls}>
            Full Name
          </label>
          <input
            id="shippingName"
            value={form.shippingName}
            onChange={set("shippingName")}
            className={inputCls}
            placeholder="Jane Smith"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="shippingLine1" className={labelCls}>
            Address Line 1
          </label>
          <input
            id="shippingLine1"
            value={form.shippingLine1}
            onChange={set("shippingLine1")}
            className={inputCls}
            placeholder="123 Market Street"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="shippingLine2" className={labelCls}>
            Address Line 2 <span className="text-clay/40 normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="shippingLine2"
            value={form.shippingLine2}
            onChange={set("shippingLine2")}
            className={inputCls}
            placeholder="Apt, suite, unit..."
          />
        </div>
        <div>
          <label htmlFor="shippingCity" className={labelCls}>
            City
          </label>
          <input
            id="shippingCity"
            value={form.shippingCity}
            onChange={set("shippingCity")}
            className={inputCls}
            placeholder="New York"
          />
        </div>
        <div>
          <label htmlFor="shippingState" className={labelCls}>
            State / Province
          </label>
          <input
            id="shippingState"
            value={form.shippingState}
            onChange={set("shippingState")}
            className={inputCls}
            placeholder="NY"
          />
        </div>
        <div>
          <label htmlFor="shippingPostalCode" className={labelCls}>
            ZIP / Postal Code
          </label>
          <input
            id="shippingPostalCode"
            value={form.shippingPostalCode}
            onChange={set("shippingPostalCode")}
            className={inputCls}
            placeholder="10001"
          />
        </div>
        <div>
          <label htmlFor="shippingCountry" className={labelCls}>
            Country
          </label>
          <input
            id="shippingCountry"
            value={form.shippingCountry}
            onChange={set("shippingCountry")}
            className={inputCls}
            placeholder="United States"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="shippingPhone" className={labelCls}>
            Phone <span className="text-clay/40 normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="shippingPhone"
            value={form.shippingPhone}
            onChange={set("shippingPhone")}
            className={inputCls}
            placeholder="+1 555 000 0000"
          />
        </div>
      </div>

      {msg && (
        <p
          role="status"
          className={`text-sm font-medium ${msg.type === "success" ? "text-emerald-600" : "text-red-500"}`}
        >
          {msg.text}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 bg-terracotta hover:bg-clay text-white px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-terracotta/20 hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
      >
        <MapPin className="w-4 h-4" strokeWidth={2} />
        {loading ? "Saving..." : "Save Shipping Address"}
        {!loading && msg?.type === "success" && <Check className="w-4 h-4" strokeWidth={2} />}
      </button>
    </form>
  );
}