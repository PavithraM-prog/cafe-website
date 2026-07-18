"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const FloatingCartBar: React.FC = () => {
  const { cart, total } = useCart();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg animate-slideUp"
      role="complementary"
      aria-label="Cart summary"
    >
      <div
        className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4 shadow-2xl"
        style={{
          background: "#4A2C2A",
          boxShadow: "0 8px 32px rgba(74,44,42,0.45)",
        }}
      >
        {/* Left — cart icon + item count */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <ShoppingCart className="h-5 w-5 text-white" />
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D9A441] text-[9px] font-black text-white leading-none">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-bold text-white leading-tight">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
            <span className="block text-[11px] text-white/60 font-medium leading-tight">
              in your cart
            </span>
          </div>
        </div>

        {/* Center — total */}
        <div className="text-center shrink-0">
          <span className="block text-xs text-white/60 font-medium leading-tight">Total</span>
          <span className="block text-base font-extrabold text-[#D9A441] leading-tight tracking-tight">
            ₹{total.toFixed(0)}
          </span>
        </div>

        {/* Right — View Cart CTA */}
        <Link
          href="/cart"
          className="shrink-0 flex items-center gap-1.5 rounded-xl bg-[#D9A441] hover:bg-[#C59134] text-white text-xs font-bold px-4 py-2.5 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-md"
        >
          <span>View Cart</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};
