"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Trash2, ShoppingBag, Plus, Minus, CreditCard, Tag, ArrowRight, MapPin, Phone } from "lucide-react";
import Link from "next/link";

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
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Prefill phone and address if user is logged in (mock)
  useEffect(() => {
    if (user) {
      setPhone("+1 (555) 123-4567");
      setAddress("123 Main Street, Apt 4B, New York, NY 10001");
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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!user) {
      // Redirect to login first
      router.push("/login?redirect=/cart");
      return;
    }

    if (!address.trim() || !phone.trim()) {
      setCheckoutError("Delivery address and phone number are required.");
      return;
    }

    try {
      setCheckoutLoading(true);
      setCheckoutError(null);

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
        alert(`Order placed successfully! You earned ${data.pointsEarned} loyalty points!`);
        clearCart();
        router.push("/profile");
      } else {
        setCheckoutError(data.error || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      setCheckoutError("An error occurred during checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-borderColor rounded-2xl bg-secondary/10 space-y-4">
            <ShoppingBag className="mx-auto h-12 w-12 text-textMuted" />
            <h2 className="font-serif text-xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-xs text-textMuted max-w-xs mx-auto leading-normal">
              Looks like you haven't added any coffee or delicious treats yet. Explore our menu and find your favorites!
            </p>
            <Link
              href="/menu"
              className="inline-block rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-6 py-3 transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items list */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center space-x-4 border border-borderColor bg-cardBg p-4 rounded-xl shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover bg-secondary shrink-0"
                  />

                  {/* Name and Price */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-sm font-bold text-foreground truncate">{item.name}</h3>
                    <span className="text-sm font-bold text-primary font-sans">₹{item.price.toFixed(2)}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 bg-secondary rounded-full px-3 py-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="text-textMuted hover:text-primary transition-colors focus:outline-none"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold font-sans w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="text-textMuted hover:text-primary transition-colors focus:outline-none"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 text-red-500 hover:text-red-700 transition-colors focus:outline-none shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}

              {/* Delivery Address Forms (Shows only when logged in, or displays Login Warning) */}
              <div className="border border-borderColor bg-cardBg p-6 rounded-xl shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-foreground">Delivery & Checkout details</h3>

                {user ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="flex items-center text-xs font-bold text-textMuted uppercase tracking-wider">
                        <Phone className="h-3.5 w-3.5 mr-1 text-accent" />
                        <span>Phone Number</span>
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full rounded-lg border border-borderColor bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center text-xs font-bold text-textMuted uppercase tracking-wider">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-accent" />
                        <span>Delivery Address</span>
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street, City, Zipcode, State"
                        rows={3}
                        className="w-full rounded-lg border border-borderColor bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary transition-all resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 text-center">
                    <p className="text-xs font-medium text-amber-800 mb-3 leading-relaxed">
                      You need to be logged in to complete your checkout and claim loyalty points.
                    </p>
                    <Link
                      href="/login?redirect=/cart"
                      className="inline-flex items-center space-x-1.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-5 py-2 shadow-sm transition-colors"
                    >
                      <span>Sign In to Checkout</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Summary details */}
            <div className="lg:col-span-4 space-y-6">
              {/* Order Summary */}
              <div className="border border-borderColor bg-cardBg p-6 rounded-xl shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-foreground pb-3 border-b border-borderColor">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs leading-normal">
                  <div className="flex justify-between text-textMuted font-medium">
                    <span>Subtotal</span>
                    <span className="font-sans font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span className="flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        Discount ({coupon.code})
                      </span>
                      <span className="font-sans font-semibold">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <hr className="border-borderColor my-2" />

                  <div className="flex justify-between text-foreground text-sm font-bold">
                    <span>Total</span>
                    <span className="font-sans text-primary text-base font-extrabold">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Simulated Payment details */}
                <div className="rounded-lg bg-secondary/50 p-3 flex items-start space-x-2 text-[10px] text-textMuted">
                  <CreditCard className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Instant Stripe Simulation:</strong> Clicking place order will simulate an immediate secure card validation and mock payment success.
                  </p>
                </div>

                {/* Checkout Error */}
                {checkoutError && (
                  <div className="text-xs text-red-600 font-semibold text-center py-1">
                    {checkoutError}
                  </div>
                )}

                {/* Checkout CTA */}
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || cart.length === 0}
                  className="w-full flex items-center justify-center space-x-2 rounded-full bg-primary hover:bg-primary-hover disabled:bg-neutral-200 disabled:text-neutral-400 text-white text-sm font-semibold py-3 shadow-md transition-colors"
                >
                  {checkoutLoading ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Promo Coupon Form */}
              <div className="border border-borderColor bg-cardBg p-6 rounded-xl shadow-sm space-y-4">
                <h4 className="font-serif text-sm font-bold text-foreground">Apply Promo Coupon</h4>

                {coupon ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-100 p-2.5 text-xs text-green-700">
                    <span className="font-medium">
                      Coupon <strong>{coupon.code}</strong> applied!
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="font-bold underline text-green-800 hover:text-green-950 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="e.g. WELCOME20"
                      className="flex-1 rounded-full border border-borderColor bg-background px-4 py-2 text-xs text-foreground focus:border-primary transition-all uppercase"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-secondary hover:bg-borderColor/50 text-foreground text-xs font-semibold px-4 py-2 transition-colors border border-borderColor"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponError && <p className="text-[10px] font-bold text-red-600">{couponError}</p>}
                {couponMessage && <p className="text-[10px] font-bold text-green-600">{couponMessage}</p>}
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
