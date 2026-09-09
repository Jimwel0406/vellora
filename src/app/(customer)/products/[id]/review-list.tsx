"use client";

import { useState } from "react";
import { Star, ArrowRight } from "lucide-react";

const INITIAL_VISIBLE = 4;

type ReviewItem = {
  id: number;
  name: string;
  rating: number;
  createdAt: string;
  comment: string | null;
};

export function ReviewList({ reviews }: { reviews: ReviewItem[] }) {
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const showMore = reviews.length > visible;

  if (reviews.length === 0) {
    return (
      <div className="py-8">
        <p className="text-[15px] text-clay/60 leading-relaxed">
          No reviews yet. Be the first to share your experience with this product.
        </p>
      </div>
    );
  }

  const firstReview = reviews[0];
  const restReviews = reviews.slice(1, visible);

  return (
    <div>
      {/* First review — large, prominent, editorial */}
      {firstReview && (
        <article className="pb-10 mb-10 border-b border-clay/15">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex gap-0.5 text-rating">
              {Array.from({ length: firstReview.rating }).map((_, i) => (
                <Star key={i} className="w-[18px] h-[18px] fill-rating" />
              ))}
            </div>
            <span className="text-[13px] text-clay/55 font-medium">
              {new Date(firstReview.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {firstReview.comment && (
            <blockquote className="text-[22px] sm:text-[26px] lg:text-[28px] text-clay leading-[1.45] font-heading tracking-[-0.015em] mb-5">
              &ldquo;{firstReview.comment}&rdquo;
            </blockquote>
          )}
          <p className="text-[14px] text-clay/60 font-medium">
            — {firstReview.name}
          </p>
        </article>
      )}

      {/* Remaining reviews — compact editorial entries */}
      {restReviews.length > 0 && (
        <div className="divide-y divide-clay/15">
          {restReviews.map((review) => (
            <article key={review.id} className="py-6 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex gap-0.5 text-rating">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-rating" />
                  ))}
                </div>
                <span className="text-[12px] text-clay/50 font-medium">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {review.comment && (
                <p className="text-[15px] text-clay/75 leading-relaxed mb-2">
                  {review.comment}
                </p>
              )}
              <p className="text-[12px] text-clay/55 font-medium">
                — {review.name}
              </p>
            </article>
          ))}
        </div>
      )}

      {/* Show all */}
      {showMore && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setVisible(reviews.length)}
            className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-terracotta hover:text-clay transition-colors cursor-pointer group"
          >
            Show all {reviews.length} reviews
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  );
}
