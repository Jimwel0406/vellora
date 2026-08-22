"use client";

import { useEffect, useState } from "react";
import { PageHeader, Panel, fieldInput, fieldLabel, primaryButton, Skeleton } from "@/components/shared/dashboard-ui";
import { Ticket, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface Promo {
  id: number;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
}

const money = (cents: number | null) => (cents == null ? "—" : `$${(cents / 100).toFixed(2)}`);

export default function AdminPromosPage() {
  const [rows, setRows] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    code: "",
    discountType: "percent" as "percent" | "fixed",
    discountValue: "10",
    minOrderAmount: "",
    maxUses: "",
    expiresAt: "",
  });

  async function fetchRows(): Promise<Promo[]> {
    const res = await fetch("/api/promo-codes");
    if (res.ok) {
      const data = await res.json();
      return data.promoCodes ?? [];
    }
    return [];
  }

  async function load(showSpinner = false) {
    if (showSpinner) setLoading(true);
    try {
      setRows(await fetchRows());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    fetchRows()
      .then((r) => {
        if (active) setRows(r);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/promo-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        discountType: form.discountType,
        discountValue: form.discountValue,
        minOrderAmount: form.minOrderAmount ? String(Number(form.minOrderAmount) * 100) : null,
        maxUses: form.maxUses ? form.maxUses : null,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }
    setForm({ code: "", discountType: "percent", discountValue: "10", minOrderAmount: "", maxUses: "", expiresAt: "" });
    await load(true);
  }

  async function toggle(promo: Promo) {
    await fetch("/api/promo-codes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: promo.id, active: !promo.active }),
    });
    await load(true);
  }

  async function remove(promo: Promo) {
    if (!confirm(`Delete promo code ${promo.code}?`)) return;
    await fetch("/api/promo-codes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: promo.id }),
    });
    await load(true);
  }

  const discountLabel = (p: Promo) =>
    p.discountType === "percent" ? `${p.discountValue}% off` : `${money(p.discountValue)} off`;

  return (
    <div data-section="admin-promos" className="section-admin-promos">
      <PageHeader
        eyebrow="Management"
        title="Promo Codes"
        description="Create discounts shoppers can apply at checkout. The platform absorbs the discount."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="New promo code" className="lg:col-span-1">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label htmlFor="code" className={fieldLabel}>Code</label>
              <input id="code" type="text" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="WELCOME10" className={fieldInput} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="discountType" className={fieldLabel}>Type</label>
                <select id="discountType" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as "percent" | "fixed" })} className={fieldInput}>
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
              </div>
              <div>
                <label htmlFor="discountValue" className={fieldLabel}>{form.discountType === "percent" ? "Percent" : "Amount ($)"}</label>
                <input id="discountValue" type="number" min="1" required value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className={fieldInput} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="minOrder" className={fieldLabel}>Min order ($)</label>
                <input id="minOrder" type="number" min="0" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} placeholder="None" className={fieldInput} />
              </div>
              <div>
                <label htmlFor="maxUses" className={fieldLabel}>Max uses</label>
                <input id="maxUses" type="number" min="1" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="Unlimited" className={fieldInput} />
              </div>
            </div>
            <div>
              <label htmlFor="expiresAt" className={fieldLabel}>Expires</label>
              <input id="expiresAt" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={fieldInput} />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className={`${primaryButton} w-full`}>
              <Plus className="w-4 h-4" aria-hidden /> Create code
            </button>
          </form>
        </Panel>

        <Panel title="Active codes" className="lg:col-span-2" bodyClassName="p-0">
          {loading ? (
            <div className="p-5 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center px-6 py-12">
              <span className="w-12 h-12 rounded-xl bg-clay/[0.06] flex items-center justify-center mb-4">
                <Ticket className="w-5 h-5 text-clay/40" aria-hidden />
              </span>
              <p className="font-semibold text-clay">No promo codes yet</p>
              <p className="text-sm text-clay/50 mt-1">Create your first code on the left.</p>
            </div>
          ) : (
            <ul className="divide-y divide-clay/5">
              {rows.map((p) => (
                <li key={p.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-clay">{p.code}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta">
                        {discountLabel(p)}
                      </span>
                    </div>
                    <p className="text-xs text-clay/50 mt-1">
                      Min {money(p.minOrderAmount)} &middot; {p.usedCount}/{p.maxUses ?? "∞"} used
                      {p.expiresAt ? ` · expires ${new Date(p.expiresAt).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggle(p)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-clay/60 hover:text-clay transition-colors cursor-pointer"
                      aria-pressed={p.active}
                    >
                      {p.active ? <ToggleRight className="w-5 h-5 text-emerald-600" aria-hidden /> : <ToggleLeft className="w-5 h-5 text-clay/40" aria-hidden />}
                      {p.active ? "Active" : "Disabled"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(p)}
                      aria-label={`Delete ${p.code}`}
                      className="p-1.5 rounded-lg text-clay/40 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
