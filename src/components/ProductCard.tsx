"use client";

import React, { useState, useTransition, useCallback } from "react";
import { useCartActions } from "@/context/CartContext";
import { Star, Leaf, Flame, Plus, Check, Clock, X, Eye } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const { addToCart } = useCartActions();
  const [added, setAdded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [, startTransition] = useTransition();

  // Deterministic preparation time based on product name length
  const prepTime = ((product.name.length * 3) % 15) + 10;
  
  // Deterministic category name based on name characteristics
  const getCategoryName = () => {
    const name = product.name.toLowerCase();
    if (name.includes("latte") || name.includes("coffee") || name.includes("cappuccino") || name.includes("brew")) {
      return "Brew Bar";
    }
    if (name.includes("tea") || name.includes("chai") || name.includes("matcha")) {
      return "Organic Infusions";
    }
    if (name.includes("cake") || name.includes("croissant") || name.includes("pastry") || name.includes("muffin")) {
      return "Artisan Bakery";
    }
    if (name.includes("sandwich") || name.includes("toast") || name.includes("salad") || name.includes("wrap")) {
      return "Gourmet Bites";
    }
    return "Cafe Special";
  };

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.availability || added) return;

    setAdded(true);

    startTransition(() => {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    });

    setTimeout(() => setAdded(false), 2000);
  }, [added, product, addToCart]);

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className={`group flex flex-col rounded-3xl border border-[#E0D4C5]/40 dark:border-[#3E2723] bg-white dark:bg-[#281715]/45 overflow-hidden shadow-sm hover:shadow-[0_12px_30px_rgba(111,78,55,0.15)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] transition-all duration-300 ${
          !product.availability ? "opacity-60" : ""
        }`}
      >
        {/* Large Food Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-secondary/30">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
            {/* Category Tag */}
            <span className="rounded-full bg-[#3E2723]/80 dark:bg-accent/90 border border-white/10 px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest text-[#FFF8F0] dark:text-[#1B100E] shadow-md backdrop-blur-sm">
              {getCategoryName()}
            </span>

            {/* Diet Tag */}
            <div className="flex items-center space-x-1.5 rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-widest uppercase shadow-md bg-white/95 dark:bg-[#281715]/95 border border-[#E0D4C5]/20">
              {product.isVeg ? (
                <>
                  <Leaf className="h-3 w-3 text-green-600 fill-green-600/10" />
                  <span className="text-green-700 dark:text-green-400">Veg</span>
                </>
              ) : (
                <>
                  <Flame className="h-3 w-3 text-red-600 fill-red-600/10" />
                  <span className="text-red-700 dark:text-red-400">Non-Veg</span>
                </>
              )}
            </div>
          </div>

          {/* Sold Out Overlay */}
          {!product.availability && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
              <span className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col flex-1 p-5 space-y-4">
          <div className="space-y-1">
            {/* Rating & Prep Time Bar */}
            <div className="flex items-center justify-between text-[10px] font-bold text-textMuted dark:text-neutral-400">
              <div className="flex items-center space-x-1 bg-[#FFF3E3] dark:bg-[#2D1C19] border border-[#E0D4C5]/30 px-2 py-0.5 rounded-full">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="text-foreground">{product.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5 text-accent" />
                <span>{prepTime} mins prep</span>
              </div>
            </div>

            {/* Name */}
            <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors duration-300">
              {product.name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs text-textMuted dark:text-neutral-400 line-clamp-2 leading-relaxed flex-1 font-light">
            {product.description}
          </p>

          {/* Price & Action Row */}
          <div className="pt-3 border-t border-[#E0D4C5]/30 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-textMuted dark:text-neutral-500 uppercase tracking-widest">Price</span>
              <span className="text-lg font-extrabold text-primary dark:text-accent font-sans leading-none mt-0.5">₹{product.price}</span>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center space-x-2">
              {/* View Details Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowDetails(true);
                }}
                className="flex items-center justify-center p-2.5 rounded-full bg-[#FFF3E3] hover:bg-accent hover:text-[#3E2723] dark:bg-[#2D1C19] text-primary dark:text-[#FFF8F0] shadow-sm transition-all hover:scale-105 active:scale-95 border border-[#E0D4C5]/30 cursor-pointer"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.availability}
                className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all hover:scale-105 active:scale-95 focus:outline-none cursor-pointer ${
                  !product.availability
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed shadow-none"
                    : added
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-primary dark:bg-accent text-white dark:text-[#1B100E] hover:opacity-90 shadow-[0_4px_12px_rgba(198,142,87,0.2)]"
                }`}
                title="Add to Cart"
              >
                {added ? <Check className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── View Details Modal Overlay ── */}
      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blur Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#1C100E] rounded-3xl overflow-hidden shadow-2xl border border-[#E0D4C5]/40 z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Large Image Header */}
              <div className="relative aspect-video w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Overlay details */}
                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="rounded-full bg-accent text-[#3E2723] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest">
                      {getCategoryName()}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                      {product.name}
                    </h2>
                  </div>
                  <span className="text-xl font-extrabold text-white font-sans">
                    ₹{product.price}
                  </span>
                </div>
              </div>

              {/* Modal Description Content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between text-xs font-bold text-textMuted dark:text-neutral-400">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-foreground font-extrabold text-sm">{product.rating.toFixed(1)} / 5</span>
                    <span className="font-light">(Verified Ratings)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-accent" />
                    <span>Prep Time: {prepTime} mins</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-bold text-foreground">Product Description</h4>
                  <p className="text-xs sm:text-sm text-textMuted dark:text-neutral-300 leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>

                {/* Additional Nutrition / Tags info row */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-secondary/40 dark:bg-[#2D1C19]/50 border border-[#E0D4C5]/30 rounded-2xl p-3">
                    <span className="block text-[8px] font-bold text-textMuted uppercase tracking-widest">Dietary</span>
                    <span className="block text-[11px] font-bold text-foreground mt-0.5">
                      {product.isVeg ? "100% Veg" : "Non-Veg"}
                    </span>
                  </div>
                  <div className="bg-secondary/40 dark:bg-[#2D1C19]/50 border border-[#E0D4C5]/30 rounded-2xl p-3">
                    <span className="block text-[8px] font-bold text-textMuted uppercase tracking-widest">Sourced</span>
                    <span className="block text-[11px] font-bold text-foreground mt-0.5">Ethical / Local</span>
                  </div>
                  <div className="bg-secondary/40 dark:bg-[#2D1C19]/50 border border-[#E0D4C5]/30 rounded-2xl p-3">
                    <span className="block text-[8px] font-bold text-textMuted uppercase tracking-widest">Ingredients</span>
                    <span className="block text-[11px] font-bold text-foreground mt-0.5">Premium / Raw</span>
                  </div>
                </div>

                {/* Add to Cart in Modal */}
                <div className="pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.availability}
                    className="w-full flex items-center justify-center space-x-2 rounded-full py-4 text-sm font-extrabold uppercase tracking-widest bg-primary dark:bg-accent text-white dark:text-[#1B100E] hover:opacity-95 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:bg-neutral-200 disabled:cursor-not-allowed"
                  >
                    {added ? (
                      <>
                        <Check className="h-4.5 w-4.5" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4.5 w-4.5" />
                        <span>Add {product.name} to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
});
ProductCard.displayName = "ProductCard";
