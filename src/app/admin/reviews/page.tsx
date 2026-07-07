"use client";

import React, { useState, useEffect } from "react";
import { Star, Check, EyeOff, Loader2, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  status: string; // PENDING, APPROVED, HIDDEN
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING"); // PENDING, APPROVED, HIDDEN

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((rev) => (rev.id === id ? { ...rev, status: newStatus } : rev))
        );
      } else {
        alert("Failed to moderate review");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = reviews.filter((r) => r.status === filter);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-800">Reviews Moderation</h1>
          <p className="text-xs text-neutral-500 mt-1">Approve or hide customer submissions for landing page display.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200 shrink-0">
          {["PENDING", "APPROVED", "HIDDEN"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === status
                  ? "bg-white text-neutral-800 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {status.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-2 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
          <span className="text-xs text-neutral-500">Checking reviews list...</span>
        </div>
      )}

      {/* Reviews cards grid */}
      {!loading && (
        <>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header info */}
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                      <div>
                        <h3 className="text-xs font-bold text-neutral-800">{review.name}</h3>
                        <span className="text-[9px] text-neutral-400 font-medium">
                          Submitted {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex space-x-0.5 text-amber-500 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < review.rating ? "fill-current" : "text-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Comment text */}
                    <p className="text-xs text-neutral-500 italic leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-100 mt-4">
                    {review.status !== "APPROVED" && (
                      <button
                        onClick={() => handleUpdateStatus(review.id, "APPROVED")}
                        className="w-full flex items-center justify-center space-x-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-[10px] font-bold py-2 shadow-sm transition-colors focus:outline-none col-span-2 last:col-span-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    {review.status !== "HIDDEN" && (
                      <button
                        onClick={() => handleUpdateStatus(review.id, "HIDDEN")}
                        className="w-full flex items-center justify-center space-x-1.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-full text-[10px] font-bold py-2 transition-colors focus:outline-none col-span-2 last:col-span-1"
                      >
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Hide</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-neutral-200 bg-white rounded-2xl shadow-sm text-xs text-neutral-400 leading-normal flex flex-col items-center justify-center space-y-2">
              <MessageSquare className="h-8 w-8 text-neutral-300" />
              <span>No feedbacks found in this category.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
