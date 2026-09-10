"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import {
  VendorPageHeader,
  Card,
  primaryBtn,
  inputClass,
  labelClass,
} from "../_components/vendor-ui";

export function StoreSettingsForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  });

  useEffect(() => {
    fetch("/api/stores")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            slug: data.slug || "",
          });
        }
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const description = form.get("description") as string;

    const res = await fetch("/api/stores", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSuccess("Store settings saved");
    setTimeout(() => setSuccess(""), 3000);
    router.refresh();
  }

  if (loading)
    return (
      <div className="flex items-center gap-2 text-clay text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </div>
    );

  return (
    <div data-section="vendor-settings" className="section-vendor-settings max-w-xl">
      <VendorPageHeader eyebrow="Store" title="Store Settings" />

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
              defaultValue={formData.name}
              className={inputClass}
            />
            <p className="text-[11px] text-clay/40 mt-1 text-right">
              {formData.name.length}/50
            </p>
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={formData.description}
              className={`${inputClass} h-auto py-3 resize-y`}
            />
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
                {formData.slug}
              </span>
            </div>
            <p className="text-[11px] text-clay mt-1.5">
              Your store link is permanent and can&apos;t be changed.
            </p>
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}
          {success && (
            <p className="flex items-center gap-2 text-sm text-emerald-700">
              <Check className="w-4 h-4" />
              {success}
            </p>
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
            ) : success ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : (
              "Save settings"
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}