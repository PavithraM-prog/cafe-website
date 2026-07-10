"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Star, Leaf, Flame, Plus, Check } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    rating: number;
    availability: boolean;
    isVeg: boolean;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.availability) return;

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className={`group flex flex-col rounded-2xl border border-borderColor bg-cardBg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
        !product.availability ? "opacity-60" : ""
      }`}
    >
      {/* Product Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dietary Tag */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase shadow-sm glass">
          {product.isVeg ? (
            <>
              <Leaf className="h-3 w-3 text-green-600" />
              <span className="text-green-700">Veg</span>
            </>
          ) : (
            <>
              <Flame className="h-3 w-3 text-red-600" />
              <span className="text-red-700">Non-Veg</span>
            </>
          )}
        </div>

        {/* Availability Tag */}
        {!product.availability && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="rounded-full bg-red-600 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-5">
        {/* Header Name & Rating */}
        <div className="flex items-start justify-between space-x-2 mb-2">
          <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1 rounded bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-100 shrink-0">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-textMuted line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.description}
        </p>

        {/* Price and Cart Action */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-borderColor/60">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-textMuted uppercase tracking-wider">Price</span>
            <span className="text-lg font-bold text-primary font-sans">₹{product.price}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.availability}
            className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all focus:outline-none ${
              !product.availability
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : added
                ? "bg-green-600 text-white"
                : "bg-primary hover:bg-primary-hover text-white"
            }`}
            title="Add to Cart"
          >
            {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
