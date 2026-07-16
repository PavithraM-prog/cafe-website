"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CouponDetails {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
}

interface CartContextType {
  cart: CartItem[];
  coupon: CouponDetails | null;
  couponError: string | null;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<CouponDetails | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load cart and coupon from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cozy_beans_cart");
    const savedCoupon = localStorage.getItem("cozy_beans_coupon");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedCoupon) {
      try {
        setCoupon(JSON.parse(savedCoupon));
      } catch (e) {
        console.error(e);
      }
    }
    setMounted(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cozy_beans_cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  // Save coupon to localStorage
  useEffect(() => {
    if (mounted) {
      if (coupon) {
        localStorage.setItem("cozy_beans_coupon", JSON.stringify(coupon));
      } else {
        localStorage.removeItem("cozy_beans_coupon");
      }
    }
  }, [coupon, mounted]);

  const addToCart = (product: Omit<CartItem, "quantity">, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    try {
      const res = await fetch(`/api/coupons?code=${code.toUpperCase()}`);
      const data = await res.json();
      if (res.ok && data.coupon) {
        setCoupon(data.coupon);
        return true;
      } else {
        setCouponError(data.error || "Invalid coupon code");
        setCoupon(null);
        return false;
      }
    } catch (err) {
      setCouponError("Could not validate coupon");
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError(null);
  };

  // Calculations (memoized to optimize render performance)
  const subtotal = React.useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = React.useMemo(() => {
    if (!coupon) return 0;
    if (coupon.discountType === "PERCENTAGE") {
      return (subtotal * coupon.discountValue) / 100;
    }
    return Math.min(coupon.discountValue, subtotal);
  }, [coupon, subtotal]);

  const total = React.useMemo(() => {
    return Math.max(subtotal - discountAmount, 0);
  }, [subtotal, discountAmount]);

  return (
    <CartContext.Provider
      value={{
        cart,
        coupon,
        couponError,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
