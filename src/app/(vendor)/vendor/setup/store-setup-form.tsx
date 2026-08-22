"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Store, ArrowRight } from "lucide-react";
import {
  VendorPageHeader,
  Card,
  primaryBtn,
  inputClass,
  labelClass,
} from "../_components/vendor-ui";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function StoreSetupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [hasStore, setHasStore] = useState(false);

  useEffect(() => {
    fetch("/api/stores")
      .then((r) => r.json())
      .then((data) => {
        if (data?.name) {
          setName(data.name || "");
          setSlug(data.slug || "");
          setDescription(data.description || "");
          setHasStore(true);
        }
        setLoading(false);
      });
  }, []);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setName(value);
    if (!hasStore) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const res = await fetch("/api/stores", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSuccess("Store is live");
    setTimeout(() => router.push("/vendor"), 900);
  }

  if (loading)
    return (
      <div className="flex items-center gap-2 text-clay/50 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </div>
    );

  return (
    <div
      data-section="vendor-store-setup"
      className="section-vendor-store-setup max-w-xl"
    >
      <VendorPageHeader
        eyebrow="Onboarding"
        title="Set Up Your Store"
        subtitle="This is where shoppers will find you. You can change any of this later."
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="name" className={labelClass}>
              Store Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={50}
              placeholder="e.g. Meadow & Co."
              value={name}
              onChange={handleNameChange}
              className={inputClass}
            />
            <p className="text-[11px] text-clay/40 mt-1 text-right">
              {name.length}/50
            </p>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>
              Store URL
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-clay/20 bg-sand/60 px-4">
              <span className="text-sm text-clay/40 whitespace-nowrap">
                vellora.app/stores/
              </span>
              <span className="flex-1 h-12 flex items-center text-sm text-clay">
                {slug || "my-store"}
              </span>
            </div>
            <p className="text-[11px] text-clay/50 mt-1.5">
              Your store link is generated from your store name and can&apos;t
              be changed later.
            </p>
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className={labelClass}>
              Store Description{" "}
              <span className="font-normal normal-case tracking-normal text-clay/40">
                (optional)
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Tell shoppers what you make and why it's special."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} h-auto py-3 resize-y`}
            />
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}
          {success && (
            <p className="text-sm text-emerald-700">Store is live — taking you to your dashboard…</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className={primaryBtn + " w-full inline-flex items-center justify-center gap-2"}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Store className="w-4 h-4" />
                Create my store
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}