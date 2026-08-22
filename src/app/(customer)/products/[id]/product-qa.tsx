"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, HelpCircle, ThumbsUp, Send } from "lucide-react";

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
    <section data-section="product-qa" className="section-product-qa max-w-[1400px] mx-auto px-10 pt-[96px] max-sm:px-5">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-terracotta">
            Ask the shop
          </span>
          <h2 className="font-serif italic text-3xl sm:text-4xl text-[#1A1A1A] mt-6">
            Questions &amp; answers
          </h2>
        </div>
      </div>

      {/* Ask box */}
      <div className="mt-10 bg-white border border-clay/10 rounded-[20px] p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-4 h-4 text-terracotta" aria-hidden />
          <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-clay">
            Ask a question
          </h3>
        </div>
        {isLoggedIn ? (
          <>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="Is there anything you'd like to know about this piece?"
              className="w-full rounded-xl border border-clay/15 bg-transparent px-4 py-3 text-sm text-clay placeholder:text-clay/40 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30 transition-colors resize-none"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={ask}
                disabled={pending || question.trim().length < 10}
                className="inline-flex items-center gap-2 bg-clay hover:bg-terracotta text-white text-[11px] font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-colors disabled:opacity-40"
              >
                {pending ? "Posting…" : "Post question"}
                <Send className="w-3.5 h-3.5" aria-hidden />
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-clay/60">
            Sign in to ask a question about this product.
          </p>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {/* Questions list */}
      {items.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-[20px] border border-dashed border-clay/15 py-14 text-center">
          <HelpCircle className="w-8 h-8 text-clay/20 mb-3" aria-hidden />
          <p className="text-sm text-clay/50">No questions yet. Be the first to ask.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-clay/10 rounded-[20px] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => upvote(item.id)}
                  disabled={!isLoggedIn || upvoted.has(item.id)}
                  aria-label="Upvote this question"
                  className={`flex flex-col items-center gap-0.5 shrink-0 rounded-xl border px-3 py-2 transition-colors ${
                    upvoted.has(item.id)
                      ? "border-terracotta/40 bg-terracotta/5 text-terracotta"
                      : "border-clay/15 text-clay/50 hover:border-clay/30 hover:text-clay"
                  } disabled:opacity-50`}
                >
                  <ThumbsUp className="w-4 h-4" aria-hidden />
                  <span className="text-xs font-bold">{item.upvotes}</span>
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] text-clay leading-relaxed font-medium">
                    {item.question}
                  </p>
                  <p className="mt-1.5 text-[11px] text-clay/40 font-semibold uppercase tracking-wider">
                    {item.userName} ·{" "}
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  {item.answers.map((a) => (
                    <div key={a.id} className="mt-4 ml-0 sm:ml-6 rounded-xl bg-sand/50 border border-clay/5 p-4">
                      <p className="text-sm text-clay/80 leading-relaxed">{a.answer}</p>
                      <p className="mt-1.5 text-[11px] text-clay/40 font-semibold uppercase tracking-wider">
                        {a.userName} · Answered{" "}
                        {new Date(a.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ))}

                  {isStoreOwner && (
                    <div className="mt-4 ml-0 sm:ml-6 space-y-2">
                      <textarea
                        value={answerDrafts[item.id] ?? ""}
                        onChange={(e) =>
                          setAnswerDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        rows={2}
                        placeholder="Reply as shop owner…"
                        className="w-full rounded-xl border border-clay/15 bg-transparent px-4 py-3 text-sm text-clay placeholder:text-clay/40 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30 transition-colors resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => answer(item.id)}
                          disabled={pending || !(answerDrafts[item.id] ?? "").trim()}
                          className="inline-flex items-center gap-2 rounded-lg border border-clay/15 text-clay text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 hover:border-terracotta/40 hover:text-terracotta transition-colors disabled:opacity-40"
                        >
                          {pending ? "Posting…" : "Answer"}
                          <Send className="w-3.5 h-3.5" aria-hidden />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}