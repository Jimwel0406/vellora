"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThumbsUp, Send, ChevronRight } from "lucide-react";

interface QaItem {
  id: number;
  question: string;
  createdAt: Date;
  userName: string;
  upvotes: number;
  answers: { id: number; answer: string; createdAt: Date; userName: string }[];
}

export function ProductQa({
  items,
  productId,
  isLoggedIn,
  isStoreOwner,
}: {
  items: QaItem[];
  productId: number;
  isLoggedIn: boolean;
  isStoreOwner: boolean;
}) {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [upvoted, setUpvoted] = useState<Set<number>>(new Set());
  const [answerDrafts, setAnswerDrafts] = useState<Record<number, string>>({});
  const [openId, setOpenId] = useState<number | null>(null);

  function ask() {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/products/${productId}/qa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ask", question }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not post question.");
        return;
      }
      setQuestion("");
      router.refresh();
    });
  }

  function upvote(questionId: number) {
    if (upvoted.has(questionId)) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/products/${productId}/qa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upvote", questionId: String(questionId) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not upvote.");
        return;
      }
      setUpvoted((prev) => new Set(prev).add(questionId));
      router.refresh();
    });
  }

  function answer(questionId: number) {
    const text = (answerDrafts[questionId] ?? "").trim();
    if (!text) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/products/${productId}/qa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "answer", questionId: String(questionId), answer: text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not post answer.");
        return;
      }
      setAnswerDrafts((prev) => ({ ...prev, [questionId]: "" }));
      router.refresh();
    });
  }

  return (
    <section data-section="product-qa" className="section-product-qa">
      {/* Header */}
      <div className="mb-6">
        <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] text-terracotta font-label">
          Questions &amp; Answers
        </span>
        <div className="flex items-end justify-between mt-3">
          <h2 className="font-heading text-[24px] sm:text-[28px] lg:text-[32px] text-clay tracking-[-0.02em]">
            Got a question?
          </h2>
          {items.length > 0 && (
            <span className="text-[12px] text-clay/55 hidden sm:block">
              {items.length} {items.length === 1 ? "question" : "questions"}
            </span>
          )}
        </div>
      </div>

      {/* Ask box — inline */}
      <div className="border-t border-clay/15 pt-6 pb-8">
        {isLoggedIn ? (
          <>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              placeholder="Is there anything you'd like to know about this piece?"
              className="w-full border-0 border-b border-clay/15 bg-transparent focus:ring-0 focus:border-terracotta resize-none text-[15px] text-clay placeholder:text-clay/40 p-0 pb-2 outline-none transition-colors"
            />
            <div className="mt-3 flex items-center justify-between">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div />
              <button
                type="button"
                onClick={ask}
                disabled={pending || question.trim().length < 10}
                className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-terracotta hover:text-clay transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {pending ? "Posting..." : "Post question"}
                <Send className="w-3.5 h-3.5" aria-hidden />
              </button>
            </div>
          </>
        ) : (
          <p className="text-[15px] text-clay/60">
            <Link href="/login" className="underline underline-offset-4 hover:text-terracotta transition-colors">
              Sign in
            </Link>{" "}
            to ask a question about this product.
          </p>
        )}
      </div>

      {/* Questions list */}
      {items.length === 0 ? (
        <div className="border-t border-clay/15 py-8">
          <p className="text-[14px] text-clay/55 mb-0.5">
            No questions yet.
          </p>
          <p className="text-[13px] text-clay/60">
            Be the first to ask about this product.
          </p>
        </div>
      ) : (
        <div className="border-t border-clay/15 divide-y divide-clay/15">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-start gap-4 py-5 text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] text-clay font-medium leading-relaxed group-hover:text-terracotta transition-colors">
                      {item.question}
                    </p>
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <span className="text-[12px] text-clay/55 font-medium">
                        {item.userName}
                      </span>
                      <span className="text-clay/30">·</span>
                      <span className="text-[12px] text-clay/55">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {item.answers.length > 0 && (
                        <>
                          <span className="text-clay/30">·</span>
                          <span className="text-[12px] text-terracotta font-medium">
                            {item.answers.length} {item.answers.length === 1 ? "answer" : "answers"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 mt-0.5">
                    {item.upvotes > 0 && (
                      <span className="text-[12px] text-clay/55 tabular-nums">
                        {item.upvotes}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-4 h-4 text-clay/45 transition-transform duration-200 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded answer area */}
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden min-h-0">
                    <div className="pb-5 pl-0 sm:pl-6 space-y-4">
                      {/* Upvote */}
                      <button
                        type="button"
                        onClick={() => upvote(item.id)}
                        disabled={!isLoggedIn || upvoted.has(item.id)}
                        aria-label="Upvote this question"
                        className={`inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors ${
                          upvoted.has(item.id)
                            ? "text-terracotta"
                            : "text-clay/55 hover:text-clay"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" aria-hidden />
                        Helpful
                      </button>

                      {/* Answers */}
                      {item.answers.map((a) => (
                        <div key={a.id} className="border-l-2 border-clay/15 pl-4">
                          <p className="text-[15px] text-clay/75 leading-relaxed">
                            {a.answer}
                          </p>
                          <p className="mt-1.5 text-[12px] text-clay/55 font-medium">
                            {a.userName} · Answered{" "}
                            {new Date(a.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      ))}

                      {/* Store owner reply */}
                      {isStoreOwner && (
                        <div className="space-y-2 pt-2">
                          <textarea
                            value={answerDrafts[item.id] ?? ""}
                            onChange={(e) =>
                              setAnswerDrafts((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            rows={2}
                            placeholder="Reply as shop owner..."
                            className="w-full border-0 border-b border-clay/15 bg-transparent focus:ring-0 focus:border-terracotta resize-none text-[15px] text-clay placeholder:text-clay/40 p-0 pb-2 outline-none transition-colors"
                          />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => answer(item.id)}
                              disabled={pending || !(answerDrafts[item.id] ?? "").trim()}
                              className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-terracotta hover:text-clay transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {pending ? "Posting..." : "Reply"}
                              <Send className="w-3.5 h-3.5" aria-hidden />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}


