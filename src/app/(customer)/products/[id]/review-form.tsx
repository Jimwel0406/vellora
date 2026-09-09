"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export function ReviewForm({ productId }: { productId: number }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }

    setRating(0);
    setComment("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-colors"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= (hover || rating)
                  ? "fill-rating text-rating"
                  : "text-clay/15"
              } transition-colors`}
            />
          </button>
        ))}
      </div>

      <textarea
        placeholder="Share your thoughts on this piece..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className="w-full border-0 border-b border-clay/15 bg-transparent focus:ring-0 focus:border-terracotta resize-none text-[15px] text-clay placeholder:text-clay/40 p-0 pb-2 outline-none transition-colors"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={rating === 0 || submitting}
        className="text-[12px] font-bold uppercase tracking-[0.12em] text-terracotta hover:text-clay py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
