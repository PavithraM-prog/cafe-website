"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Star, Leaf, Flame, Plus, Check } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";

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
      className={`group flex flex-col rounded-3xl border border-borderColor/40 bg-cardBg overflow-hidden shadow-sm hover:shadow-xl hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 ${
        !product.availability ? "opacity-60" : ""
      }`}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />

        {/* Dietary Tag */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow-md glass">
          {product.isVeg ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
              <span className="text-green-800">Veg</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
              <span className="text-red-800">Non-Veg</span>
            </>
          )}
        </div>

        {/* Availability Tag */}
        {!product.availability && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-5 space-y-2">
        {/* Header Name & Rating */}
        <div className="flex items-start justify-between space-x-2">
          <h3 className="font-serif text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700 border border-amber-200 shrink-0 shadow-sm">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-textMuted/90 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Price and Cart Action */}
        <div className="flex items-center justify-between pt-3.5 border-t border-borderColor/40 mt-auto">
          <span className="text-base font-extrabold font-sans text-primary">
            {formatCurrency(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!product.availability}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm transition-all duration-300 focus:outline-none ${
              !product.availability
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : added
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-primary hover:bg-primary-hover text-white active:scale-95 hover:shadow"
            }`}
          >
            {added ? (
              <>
                <Check className="h-3 w-3" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
