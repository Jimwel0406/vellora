"use client";

import { useState } from "react";
import { Star, ChevronDown } from "lucide-react";

const INITIAL_VISIBLE = 6;

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
      <div className="flex flex-col items-start justify-center py-10">
        <Star className="w-8 h-8 text-terracotta mb-5" />
        <p className="font-serif italic text-2xl text-[#1A1A1A] mb-3">
          Be the first to review
        </p>
        <p className="text-[15px] text-clay/50 max-w-md leading-relaxed">
          This piece hasn&apos;t been reviewed yet. Your experience will help other
          shoppers make an informed choice.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory sm:snap-none sm:grid sm:grid-cols-2 pb-2 sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0 max-sm:scroll-pl-5 max-sm:scroll-pr-5">
        {reviews.map((review, i) => (
          <div
            key={review.id}
            className={`w-[82%] min-w-[270px] shrink-0 snap-start sm:w-auto bg-white border border-clay/5 rounded-[16px] p-6 transition-shadow duration-300 hover:shadow-[0_16px_32px_-20px_rgba(61,43,31,0.15)] ${
              i >= visible ? "sm:hidden" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm text-[#1A1A1A]">
                {review.name}
              </p>
              <div className="flex gap-0.5 text-ochre">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-ochre" />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-clay/40 mb-3">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {review.comment && (
              <p className="text-sm text-clay/60 leading-relaxed">{review.comment}</p>
            )}
          </div>
        ))}
      </div>

      {showMore && (
        <div className="hidden sm:block mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisible(reviews.length)}
            className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-terracotta hover:text-clay transition-colors cursor-pointer"
          >
            Show all {reviews.length} reviews
            <ChevronDown className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </>
  );
}