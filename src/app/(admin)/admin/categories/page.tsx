"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, fieldInput, fieldLabel, primaryButton } from "@/components/shared/dashboard-ui";
import { Pencil, Trash2, Check, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  async function refresh() {
    const updated = await fetch("/api/categories").then((r) => r.json());
    setCategories(updated);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }
    setName("");
    router.refresh();
    await refresh();
  }

  async function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setError("");
  }

  async function saveEdit(id: number) {
    if (!editingName.trim()) return;
    setError("");
    const res = await fetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editingName }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }
    setEditingId(null);
    router.refresh();
    await refresh();
  }

  async function remove(cat: Category) {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    setError("");
    const res = await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cat.id }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }
    router.refresh();
    await refresh();
  }

  return (
    <div data-section="admin-categories" className="section-admin-categories max-w-lg">
      <PageHeader
        eyebrow="Management"
        title="Categories"
        description="Group products into browseable collections. Rename or remove categories freely."
      />

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <div className="flex-1">
          <label htmlFor="name" className={fieldLabel}>New category</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            required
            className={`${fieldInput} mt-2`}
          />
        </div>
        <button type="submit" className={`${primaryButton} self-end`}>
          Add
        </button>
      </form>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {categories.length === 0 ? (
        <p className="text-sm text-clay/50">No categories yet.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="bg-white border border-clay/10 rounded-xl px-4 py-3 shadow-[0_1px_2px_rgba(61,43,31,0.04)]"
            >
              {editingId === cat.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                    className={`${fieldInput} mt-0 h-10`}
                    aria-label="Category name"
                  />
                  <button
                    type="button"
                    onClick={() => saveEdit(cat.id)}
                    aria-label="Save"
                    className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    aria-label="Cancel"
                    className="p-2 rounded-lg text-clay/40 hover:bg-clay/[0.05] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" aria-hidden />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-clay truncate">{cat.name}</p>
                    <p className="text-xs text-clay/40">/{cat.slug}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(cat)}
                      aria-label={`Rename ${cat.name}`}
                      className="p-2 rounded-lg text-clay/40 hover:text-clay hover:bg-clay/[0.05] transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(cat)}
                      aria-label={`Delete ${cat.name}`}
                      className="p-2 rounded-lg text-clay/40 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}