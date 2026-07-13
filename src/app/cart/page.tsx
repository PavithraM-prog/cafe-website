"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Trash2, ShoppingBag, Plus, Minus, CreditCard, Tag, ArrowRight, MapPin, Phone, Lock, Sparkles, AlertCircle, X, Check } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatCurrency";

export default function CartPage() {
  const {
    cart,
    coupon,
    couponError,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    total,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Address and Phone details
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Prefill phone, address, and card name if user is logged in
  useEffect(() => {
    if (user) {
      setPhone("+1 (555) 123-4567");
      setAddress("123 Main Street, Apt 4B, New York, NY 10001");
      setCardName(user.name);
    }
  }, [user]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponMessage(null);
    const success = await applyCoupon(couponCodeInput);
    if (success) {
      setCouponMessage("Discount applied successfully!");
      setCouponCodeInput("");
    }
  };

  // Triggers the payment modal instead of directly placing the order
  const handleOpenPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }

    if (!address.trim() || !phone.trim()) {
      setCheckoutError("Delivery address and phone number are required.");
      return;
    }

    setCheckoutError(null);
    setPaymentError(null);
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
      setPaymentError("Please fill out all payment fields.");
      return;
    }

    try {
      setPaymentProcessing(true);
      setPaymentError(null);

      // Simulate brief payment gateway response delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Test payment logic:
      // If card number contains "4000", simulate card decline
      if (cardNumber.replace(/\s/g, "").includes("4000000000000002")) {
        throw new Error("Your card was declined. Please use the valid test card provided.");
      }

      // Create Order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          total: total.toFixed(2),
          discount: discountAmount.toFixed(2),
          address,
          phone,
          couponCode: coupon?.code || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        setShowPaymentModal(false);
        // Redirect directly to the User Profile & Orders dashboard page
        router.push("/profile");
      } else {
        setPaymentError(data.error || "Failed to place order database record.");
      }
    } catch (err: any) {
      console.error(err);
      setPaymentError(err.message || "Simulated authorization failed. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Helper to format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 16);
    const matches = val.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(val);
    }
  };

  // Helper to format Expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (val.length >= 2) {
      setCardExpiry(`${val.substring(0, 2)}/${val.substring(2, 4)}`);
    } else {
      setCardExpiry(val);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 animate-fade-in-up">
        <div className="flex items-center space-x-3 mb-10 pb-6 border-b border-borderColor/40">
          <div className="p-2.5 bg-white border border-borderColor/40 rounded-2xl shadow-sm">
            <ShoppingBag className="h-6 w-6 text-accent" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground leading-none tracking-tight">Your Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-borderColor/60 rounded-3xl bg-[#FFF8E7]/20 space-y-5">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#D9A441] animate-pulse" />
            <h2 className="font-serif text-2xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-xs text-textMuted max-w-xs mx-auto leading-relaxed font-light">
              Looks like you haven't added any coffee or delicious treats yet. Explore our menu and find your favorites!
            </p>
            <Link
              href="/menu"
              className="inline-block rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 shadow-md transition-all hover:scale-105 duration-200"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items list */}
            <div className="lg:col-span-8 space-y-5">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center space-x-4 border border-borderColor/40 bg-cardBg p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow hover:border-accent/20 duration-300"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover bg-secondary shrink-0 shadow-sm border border-borderColor/40"
                  />

                  {/* Name and Price */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-sm font-bold text-foreground truncate">{item.name}</h3>
                    <span className="text-sm font-bold text-primary font-sans">{formatCurrency(item.price)}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2.5 bg-secondary/80 rounded-full px-3.5 py-1.5 shrink-0 border border-borderColor/40">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="text-textMuted hover:text-primary transition-colors focus:outline-none font-bold text-xs"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-extrabold text-foreground px-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="text-textMuted hover:text-primary transition-colors focus:outline-none font-bold text-xs"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors focus:outline-none shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}

              {/* Delivery Address Forms */}
              <div className="border border-borderColor/40 bg-cardBg p-8 rounded-3xl shadow-xl space-y-6">
                <div className="flex items-center space-x-2 pb-3 border-b border-borderColor/40">
                  <MapPin className="h-5 w-5 text-accent" />
                  <h3 className="font-serif text-lg font-bold text-foreground uppercase tracking-wide">Delivery Information</h3>
                </div>

                {user ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="flex items-center text-[10px] font-bold text-textMuted uppercase tracking-wider">
                        <Phone className="h-3.5 w-3.5 mr-1.5 text-accent" />
                        <span>Phone Number *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 99999 99999"
                        className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center text-[10px] font-bold text-textMuted uppercase tracking-wider">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-accent" />
                        <span>Delivery Address *</span>
                      </label>
                      <textarea
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your street address, apartment/suite number, city, state, and zip code"
                        rows={3}
                        className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#FFF8E7] border border-[#E6DDD0] p-6 text-center shadow-inner">
                    <p className="text-xs font-semibold text-textMuted mb-4 leading-relaxed max-w-sm mx-auto">
                      You need to be logged in to complete your checkout and earn loyalty rewards.
                    </p>
                    <Link
                      href="/login?redirect=/cart"
                      className="inline-flex items-center space-x-1.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-widest px-6 py-3 shadow-md transition-colors"
                    >
                      <span>Sign In to Checkout</span>
                      <ArrowRight className="h-3.5 w-3.5 text-white" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Summary details */}
            <div className="lg:col-span-4 space-y-6">
              {/* Order Summary */}
              <div className="border border-borderColor/40 bg-cardBg p-8 rounded-3xl shadow-xl space-y-5 bg-gradient-to-b from-white to-[#FFF8E7]/20">
                <h3 className="font-serif text-lg font-bold text-foreground pb-3 border-b border-borderColor/40 uppercase tracking-wide">
                  Order Summary
                </h3>

                <div className="space-y-3.5 text-xs leading-normal">
                  <div className="flex justify-between text-textMuted font-bold uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span className="font-sans font-extrabold">{formatCurrency(subtotal)}</span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between text-green-700 font-bold uppercase tracking-wider">
                      <span className="flex items-center">
                        <Tag className="h-3.5 w-3.5 mr-1 text-green-700" />
                        Discount ({coupon.code})
                      </span>
                      <span className="font-sans font-extrabold">-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <hr className="border-borderColor/40 my-3" />

                  <div className="flex justify-between text-foreground text-sm font-extrabold uppercase tracking-wide">
                    <span>Total</span>
                    <span className="font-sans text-primary text-base font-extrabold">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-secondary/40 p-4 flex items-start space-x-2.5 text-[10px] text-textMuted border border-borderColor/40">
                  <CreditCard className="h-4.5 w-4.5 text-[#D9A441] shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-light">
                    <strong>Test Payment System:</strong> Clicking "Proceed to Payment" will prompt you to enter dummy card details for a live-simulated authorization.
                  </p>
                </div>

                {/* Promo Code section */}
                <div className="pt-2">
                  {coupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200/60 rounded-2xl px-4 py-3 text-xs">
                      <div className="flex items-center space-x-2 text-green-800 font-bold">
                        <Tag className="h-3.5 w-3.5 text-green-700 animate-pulse" />
                        <span className="tracking-wide">{coupon.code} Applied</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700 text-[10px] font-bold uppercase tracking-wider focus:outline-none"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="PROMO CODE"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="flex-1 rounded-full border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-4 py-2.5 text-xs text-foreground focus:border-accent transition-all uppercase shadow-sm focus:ring-1 focus:ring-accent font-semibold"
                      />
                      <button
                        type="submit"
                        className="rounded-full bg-secondary hover:bg-borderColor/50 text-foreground text-xs font-bold uppercase tracking-widest px-5 py-2.5 transition-colors border border-borderColor shadow-sm"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponError && <p className="text-[9px] font-bold text-red-600 mt-2 pl-2 uppercase tracking-wide">⚠️ {couponError}</p>}
                  {couponMessage && <p className="text-[9px] font-bold text-green-600 mt-2 pl-2 uppercase tracking-wide">✓ {couponMessage}</p>}
                </div>

                <button
                  onClick={handleOpenPayment}
                  className="w-full flex items-center justify-center space-x-2 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-widest py-4 shadow-lg hover:shadow transition-all duration-300 focus:outline-none hover:scale-[1.005] active:scale-95"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Payment Processing Modal Overlay */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[4px] animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-cardBg border border-borderColor/40 p-8 rounded-3xl shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-borderColor/40">
              <div className="flex items-center space-x-2 text-primary font-bold">
                <Lock className="h-4.5 w-4.5 text-accent" />
                <span className="font-serif uppercase tracking-wider text-sm">Secure Payment</span>
              </div>
              <button
                onClick={() => !paymentProcessing && setShowPaymentModal(false)}
                disabled={paymentProcessing}
                className="text-textMuted hover:text-foreground hover:bg-secondary p-1 rounded-full transition-colors disabled:opacity-40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {paymentProcessing ? (
              /* Simulated processing animation */
              <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                <div className="relative flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Lock className="absolute h-5 w-5 text-primary animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-foreground">Processing Payment</h3>
                  <p className="text-xs text-textMuted max-w-xs leading-relaxed font-light">
                    Authorizing card credentials and securing transaction with Cozy Beans mock processor...
                  </p>
                </div>
              </div>
            ) : (
              /* Credit Card Input Form */
              <form onSubmit={handleProcessPayment} className="space-y-4">
                {paymentError && (
                  <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start space-x-1.5 font-semibold">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                {/* Dummy Card Info Helper */}
                <div className="rounded-2xl bg-secondary/50 p-4 border border-borderColor/40 space-y-2">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest block">Available Test Cards</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[9px] text-textMuted font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setCardNumber("4242 4242 4242 4242");
                        setCardExpiry("12/28");
                        setCardCvc("123");
                      }}
                      className="text-left bg-cardBg border border-borderColor/60 p-2 rounded-xl hover:border-primary hover:text-foreground transition-all flex items-center justify-between"
                    >
                      <span>💳 Success Test</span>
                      <span className="font-bold text-green-700 font-sans">4242</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCardNumber("4000 0000 0000 0002");
                        setCardExpiry("05/29");
                        setCardCvc("666");
                      }}
                      className="text-left bg-cardBg border border-borderColor/60 p-2 rounded-xl hover:border-red-400 hover:text-foreground transition-all flex items-center justify-between"
                    >
                      <span>💳 Decline Test</span>
                      <span className="font-bold text-red-700 font-sans">0002</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-3.5 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white pl-10 pr-3 py-2.5 text-xs text-foreground focus:border-accent transition-all font-mono focus:ring-1 focus:ring-accent font-semibold"
                    />
                    <CreditCard className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-textMuted" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Expiration Date</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-3.5 py-2.5 text-xs text-foreground focus:border-accent transition-all font-mono text-center focus:ring-1 focus:ring-accent font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted">CVC</label>
                    <input
                      type="password"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").substring(0, 3))}
                      placeholder="•••"
                      className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-3.5 py-2.5 text-xs text-foreground focus:border-accent transition-all font-mono text-center focus:ring-1 focus:ring-accent font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-widest py-3.5 shadow-lg transition-all duration-300 hover:scale-[1.005] active:scale-95"
                  >
                    <span>Pay {formatCurrency(total)}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
