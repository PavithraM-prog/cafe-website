"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
import { Award, ShoppingBag, Clock, MapPin, Phone, Star, Send, Loader2, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";

interface Order {
  id: string;
  items: any; // [{ productId, name, price, quantity, image }]
  total: number;
  discount: number;
  paymentStatus: string;
  status: string; // PENDING, PREPARING, READY, DELIVERED, CANCELLED
  address: string;
  phone: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Review Form state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Fetch past orders
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error("Failed to load order history:", e);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setReviewName(user.name);
      fetchOrders();
    }
  }, [user]);

  const handleReorder = (order: Order) => {
    // Add all items in the order back to cart
    try {
      const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
      items.forEach((item: any) => {
        addToCart({
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
        }, item.quantity);
      });
      router.push("/cart");
    } catch (err) {
      console.error("Reorder failed:", err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment || !reviewRating) {
      setReviewError("Please fill out your name and write a comment.");
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError(null);
      setReviewSuccess(null);

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reviewName,
          rating: parseInt(reviewRating),
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviewSuccess("Review submitted! It will appear on our homepage after admin approval.");
        setReviewComment("");
      } else {
        setReviewError(data.error || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      setReviewError("An error occurred. Please try again.");
    } finally {
      setReviewLoading(false);
    }
  };

  const getOrderStatusColor = (status: string) => {
    if (status === "DELIVERED") return "bg-green-100 text-green-700 border-green-200";
    if (status === "CANCELLED") return "bg-red-100 text-red-700 border-red-200";
    if (status === "READY") return "bg-indigo-100 text-indigo-700 border-indigo-200";
    if (status === "PREPARING") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-amber-100 text-amber-700 border-amber-200"; // PENDING
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 animate-fade-in-up">
        {/* Upper Welcoming Details */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-borderColor/40 mb-12">
          <div className="space-y-1">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Welcome Back, {user?.name}!</h1>
            <p className="text-xs text-textMuted font-light">Manage your order history, claim rewards, and submit reviews.</p>
          </div>

          {/* Loyalty Points display */}
          <div className="flex items-center space-x-4 bg-gradient-to-r from-[#4A2C2A] via-[#3E2321] to-[#251311] border border-[#FFF8E7]/10 text-white p-5 rounded-2xl shadow-xl">
            <Award className="h-10 w-10 text-amber-300 shrink-0 animate-pulse" />
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-amber-200 uppercase tracking-widest block">Loyalty Points</span>
              <span className="text-2xl font-extrabold font-sans leading-none">{user?.loyaltyPoints || 0} pts</span>
              <span className="text-[9px] text-[#FFF8E7]/80 block font-light">Earn 1 point for every ₹1 spent!</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Past Orders list */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center space-x-2.5 pb-2 border-b border-borderColor/40 uppercase tracking-wide">
              <ShoppingBag className="h-5 w-5 text-accent" />
              <span>Order History & Tracking</span>
            </h2>

            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-2">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-xs text-textMuted uppercase tracking-wider font-bold">Loading history...</span>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => {
                  const orderItems = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
                  return (
                    <div
                      key={order.id}
                      className="border border-borderColor/40 bg-cardBg rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-accent/10"
                    >
                      {/* Order info bar */}
                      <div className="bg-[#FFF8E7]/30 border-b border-borderColor/40 px-6 py-4 flex flex-wrap justify-between items-center gap-3">
                        <div className="space-y-0.5">
                          <span className="text-xs text-textMuted font-semibold block">
                            Order placed on {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-textMuted/80 font-mono">ID: {order.id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getOrderStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                          <button
                            onClick={() => handleReorder(order)}
                            className="rounded-full bg-accent hover:bg-accent-hover text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 shadow-sm transition-all hover:scale-105 active:scale-95"
                          >
                            Reorder
                          </button>
                        </div>
                      </div>

                      {/* Items list summary */}
                      <div className="p-6 space-y-4">
                        <div className="divide-y divide-borderColor/30">
                          {orderItems.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                              <div className="flex items-center space-x-3 min-w-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-10 w-10 object-cover rounded bg-secondary shrink-0 border border-borderColor/40 shadow-sm"
                                />
                                <div className="truncate">
                                  <h4 className="text-xs font-bold text-foreground truncate">{item.name}</h4>
                                  <span className="text-[10px] text-textMuted">Qty: {item.quantity}</span>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-primary font-sans shrink-0">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Address & Phone details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-normal pt-4 border-t border-borderColor/30 text-textMuted font-medium">
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 text-accent shrink-0 mt-0.5" />
                            <span>{order.address}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-accent shrink-0" />
                            <span>{order.phone}</span>
                          </div>
                        </div>

                        {/* Pricing details */}
                        <div className="flex justify-end pt-4 border-t border-borderColor/30 text-xs font-medium">
                          <div className="text-right space-y-1">
                            {order.discount > 0 && (
                              <p className="text-green-700 font-bold uppercase tracking-wider">Discount: -{formatCurrency(order.discount)}</p>
                            )}
                            <p className="text-sm font-extrabold text-foreground uppercase tracking-wide">
                              Paid Total: <span className="text-primary font-sans text-base ml-1">{formatCurrency(order.total)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 text-xs text-textMuted italic font-semibold border border-dashed border-borderColor/60 rounded-3xl bg-[#FFF8E7]/10">
                You haven't placed any orders yet. Visit the Menu to get started!
              </div>
            )}
          </div>

          {/* User Review Submission Widget */}
          <div className="lg:col-span-4 border border-borderColor/40 bg-cardBg p-8 sm:p-10 rounded-3xl shadow-xl space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground pb-3 border-b border-borderColor/40 uppercase tracking-wide">
              Review Cozy Beans
            </h2>
            <p className="text-xs text-[#7A635B] leading-relaxed font-light">
              We value your feedback. Let us know how you liked our service, foods, or cozy atmosphere.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Display Name *</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="E.g. Sarah M."
                  className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Rating *</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                  className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent cursor-pointer"
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Good)</option>
                  <option value="3">3 Stars (Average)</option>
                  <option value="2">2 Stars (Poor)</option>
                  <option value="1">1 Star (Very Bad)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Your Comment *</label>
                <textarea
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="E.g. The coffee and pastries were delicious! Staff is warm."
                  rows={4}
                  className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent resize-none"
                />
              </div>

              {/* Status responses */}
              {reviewSuccess && (
                <div className="text-xs text-green-700 bg-green-50 border border-green-200 p-3.5 rounded-xl font-semibold leading-relaxed">
                  ✓ {reviewSuccess}
                </div>
              )}

              {reviewError && (
                <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-3.5 rounded-xl font-semibold leading-relaxed">
                  ⚠️ {reviewError}
                </div>
              )}

              <button
                type="submit"
                disabled={reviewLoading}
                className="w-full flex items-center justify-center space-x-2 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-widest py-3.5 shadow-lg transition-all duration-300 focus:outline-none hover:scale-[1.005] active:scale-95 disabled:opacity-50"
              >
                {reviewLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Review</span>
                    <Send className="h-3.5 w-3.5 text-white" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
