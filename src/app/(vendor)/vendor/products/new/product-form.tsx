"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, X } from "lucide-react";
import { ProductTagCheckboxes } from "../_components/tag-checkboxes";
import { FeatureList } from "../_components/feature-list";
import {
  VendorPageHeader,
  Card,
  primaryBtn,
  inputClass,
  labelClass,
} from "../../_components/vendor-ui";

interface Category {
  id: number;
  name: string;
}

export function ProductForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>(["", ""]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      urls.push(data.publicUrl);
    }

    setImages((prev) => [...prev, ...urls]);
    setUploading(false);
    e.target.value = "";
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (images.length === 0) {
      setError("Add at least one product image.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const blurb = (form.get("description") as string).trim();
    const price = parseFloat(form.get("price") as string);
    const categoryValue = (form.get("category") as string) || "";

    const featureList = features
      .map((s) => s.trim())
      .filter(Boolean);

    const description = [blurb, ...featureList].join("|");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price,
        images,
        tags: selectedTags,
        categoryId: categoryValue ? parseInt(categoryValue) : null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/vendor/products");
    router.refresh();
  }

  return (
    <div data-section="vendor-product-form" className="section-vendor-product-form max-w-xl">
      <VendorPageHeader eyebrow="Catalog" title="Add Product" />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="name" className={labelClass}>
              Product Name
            </label>
            <input id="name" name="name" type="text" required className={inputClass} />
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              placeholder="Describe the product, materials, and what makes it special."
              className={`${inputClass} h-auto py-3 resize-y`}
            />
          </div>

          <div className="space-y-1">
            <span className={labelClass}>
              Key Features{" "}
              <span className="font-normal normal-case tracking-normal text-clay/40">
                (shown as bullet points on the product page)
              </span>
            </span>
            <FeatureList values={features} onChange={setFeatures} />
          </div>

          <div className="space-y-1">
            <span className={labelClass}>Tags</span>
            <ProductTagCheckboxes
              selected={selectedTags}
              onChange={setSelectedTags}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="category" className={labelClass}>
              Category{" "}
              <span className="font-normal normal-case tracking-normal text-clay/40">
                (optional)
              </span>
            </label>
            <select id="category" name="category" className={inputClass}>
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="price" className={labelClass}>
              Price (USD)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>
              Product Images{" "}
              <span className="font-normal normal-case tracking-normal text-clay/40">
                (at least 1 required)
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="mt-2 block w-full text-sm text-clay/60 file:mr-4 file:rounded-lg file:border-0 file:bg-clay/10 file:px-4 file:py-2 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:text-clay hover:file:bg-clay/20"
            />
            {uploading && (
              <p className="text-sm text-clay flex items-center gap-2 mt-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </p>
            )}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {images.map((url) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      alt="Product"
                      className="w-20 h-20 object-cover rounded-lg border border-clay/10"
                      width="80"
                      height="80"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      aria-label="Remove image"
                      className="absolute -top-2 -right-2 w-5 h-5 bg-terracotta text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={uploading}
            className={primaryBtn + " w-full"}
          >
            Create product
          </button>
        </form>
      </Card>
    </div>
  );
}