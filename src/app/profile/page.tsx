"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { Award, ShoppingBag, Clock, MapPin, Phone, Star, Send, Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";
=======
import { Award, ShoppingBag, Clock, MapPin, Phone, Star, Send, Loader2, ArrowRight, CreditCard, Printer, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
>>>>>>> 10e7606 (Final project)

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
  payments?: any[];
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Upper Welcoming Details */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-borderColor mb-12">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Welcome Back, {user?.name}!</h1>
            <p className="text-xs text-textMuted mt-1">Manage your order history, claim rewards, and submit reviews.</p>
          </div>

          {/* Loyalty Points display */}
          <div className="flex items-center space-x-4 bg-primary border border-borderColor text-white p-5 rounded-2xl shadow-md">
            <Award className="h-10 w-10 text-amber-300 shrink-0" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-amber-200 uppercase tracking-widest block">Loyalty Points</span>
              <span className="text-2xl font-extrabold font-sans leading-none">{user?.loyaltyPoints || 0} pts</span>
              <span className="text-[9px] text-white/80 block">Earn 1 point for every ₹1 spent!</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Past Orders list */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span>Order History & Tracking</span>
            </h2>

            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-2">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-xs text-textMuted">Loading order histories...</span>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => {
                  const orderItems = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
                  const successPayment = order.payments?.find((p: any) => p.paymentStatus === "SUCCESS");
                  const failedPayment = order.payments?.find((p: any) => p.paymentStatus === "FAILED");
                  const txnId = successPayment?.transactionId || failedPayment?.transactionId || "N/A";
                  
                  return (
                    <div
                      key={order.id}
                      className="border border-borderColor bg-cardBg rounded-2xl overflow-hidden shadow-sm"
                    >
                      {/* Order info bar */}
                      <div className="bg-secondary/40 border-b border-borderColor px-5 py-4 flex flex-wrap justify-between items-center gap-3">
                        <div className="space-y-0.5">
                          <span className="text-xs text-textMuted font-medium block">
                            Order placed on {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-textMuted font-mono">ID: {order.id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getOrderStatusColor(
                              order.status
                            )}`}
                          >
                            Order: {order.status}
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              order.paymentStatus === "PAID"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : order.paymentStatus === "FAILED"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : "bg-amber-100 text-amber-700 border-amber-200"
                            }`}
                          >
                            Payment: {order.paymentStatus}
                          </span>
                          <button
                            onClick={() => handleReorder(order)}
<<<<<<< HEAD
                            className="rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4.5 py-1.5 shadow-sm transition-colors"
=======
                            className="rounded-full bg-[#f2ede4] hover:bg-borderColor/30 text-foreground text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 shadow-sm transition-all hover:scale-105"
>>>>>>> 10e7606 (Final project)
                          >
                            Reorder
                          </button>
                        </div>
                      </div>

                      {/* Items list summary */}
                      <div className="p-5 space-y-4">
                        <div className="divide-y divide-borderColor/60">
                          {orderItems.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                              <div className="flex items-center space-x-3 min-w-0">
                                <div className="relative h-10 w-10 overflow-hidden rounded bg-secondary shrink-0">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="truncate">
                                  <h4 className="text-xs font-bold text-foreground truncate">{item.name}</h4>
                                  <span className="text-[10px] text-textMuted">Qty: {item.quantity}</span>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-primary font-sans shrink-0">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Address & Phone details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-normal pt-4 border-t border-borderColor/60 text-textMuted">
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 text-accent shrink-0 mt-0.5" />
                            <span>{order.address}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-accent shrink-0" />
                            <span>{order.phone}</span>
                          </div>
                        </div>

                        {/* Payment metadata details */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-borderColor/30 text-xs text-textMuted">
                          <div className="space-y-1 text-left font-medium">
                            <p className="flex items-center">
                              <CreditCard className="h-3.5 w-3.5 mr-1.5 text-accent shrink-0" />
                              <span>Transaction ID: <strong className="font-mono text-foreground font-bold">{txnId}</strong></span>
                            </p>
                            <p>
                              Paid Amount: <strong className="text-foreground font-bold">{formatCurrency(order.total)}</strong>
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                            {order.paymentStatus === "PAID" && (
                              <button
                                onClick={() => router.push(`/checkout/result?orderId=${order.id}&status=SUCCESS&txnId=${txnId}`)}
                                className="flex items-center space-x-1.5 rounded-full border border-[#5f259f] text-[#5f259f] hover:bg-[#5f259f]/5 text-[10px] font-bold uppercase tracking-wider px-4 py-2 transition-all duration-300"
                              >
                                <Printer className="h-3.5 w-3.5" />
                                <span>Invoice</span>
                              </button>
                            )}
                            {(order.paymentStatus === "FAILED" || order.paymentStatus === "PENDING") && (
                              <button
                                onClick={() => router.push(`/checkout/pay?orderId=${order.id}`)}
                                className="flex items-center space-x-1.5 rounded-full bg-[#5f259f] hover:bg-[#4b1d7f] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 transition-all duration-300 shadow-sm"
                              >
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                <span>Retry Payment</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Pricing details */}
                        <div className="flex justify-end pt-3 border-t border-borderColor/40 text-xs font-medium">
                          <div className="text-right space-y-1">
                            {order.discount > 0 && (
                              <p className="text-green-600">Discount: -₹{order.discount.toFixed(2)}</p>
                            )}
<<<<<<< HEAD
                            <p className="text-sm font-bold text-foreground">
                              Paid Total: <span className="text-primary font-sans">₹{order.total.toFixed(2)}</span>
=======
                            <p className="text-sm font-extrabold text-foreground uppercase tracking-wide">
                              Total Due: <span className="text-primary font-sans text-base ml-1">{formatCurrency(order.total)}</span>
>>>>>>> 10e7606 (Final project)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-xs text-textMuted leading-relaxed border border-dashed border-borderColor rounded-2xl bg-secondary/10">
                You haven't placed any orders yet. Visit the Menu to get started!
              </div>
            )}
          </div>

          {/* User Review Submission Widget */}
          <div className="lg:col-span-4 border border-borderColor bg-cardBg p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground pb-3 border-b border-borderColor">
              Share Your Experience
            </h2>
            <p className="text-xs text-textMuted leading-relaxed">
              We value your feedback. Let us know how you liked our service, foods, or cozy atmosphere.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted">Display Name *</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="E.g. Sarah M."
                  className="w-full rounded-lg border border-borderColor bg-background px-4 py-2 text-sm text-foreground focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted">Rating *</label>
                <div className="relative">
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                    className="w-full rounded-lg border border-borderColor bg-background px-4 py-2 text-sm text-foreground focus:border-primary transition-all cursor-pointer"
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Good)</option>
                    <option value="3">3 Stars (Average)</option>
                    <option value="2">2 Stars (Poor)</option>
                    <option value="1">1 Star (Very Bad)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted">Your Comment *</label>
                <textarea
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="E.g. The double espresso and pancakes were delicious! Staff is warm."
                  rows={4}
                  className="w-full rounded-lg border border-borderColor bg-background px-4 py-2 text-sm text-foreground focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Status responses */}
              {reviewSuccess && (
                <div className="text-xs text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg font-semibold leading-relaxed">
                  {reviewSuccess}
                </div>
              )}

              {reviewError && (
                <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg font-semibold leading-relaxed">
                  {reviewError}
                </div>
              )}

              <button
                type="submit"
                disabled={reviewLoading}
                className="w-full flex items-center justify-center space-x-2 rounded-full bg-primary hover:bg-primary-hover disabled:bg-neutral-200 text-white text-sm font-semibold py-2.5 shadow-sm transition-colors focus:outline-none"
              >
                {reviewLoading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Review</span>
                    <Send className="h-4 w-4" />
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
