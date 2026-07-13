"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Search, Loader2, ArrowUpDown, Sparkles } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  availability: boolean;
  isVeg: boolean;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default"); // default, price-asc, price-desc, rating-desc

  // Fetch Menu Data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data = await res.json();
        setProducts(data.products || []);
        setCategories(data.categories || []);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Filter and Sort Logic
  const filteredProducts = products
    .filter((product) => {
      // Category Filter
      if (selectedCategory !== "all") {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (product.categoryId !== cat?.id) return false;
      }

      // Search query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      // Veg Filter
      if (vegOnly && !product.isVeg) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating-desc") return b.rating - a.rating;
      return 0; // default (alphabetical by seeding order)
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <section className="relative overflow-hidden bg-[#1C100E] py-28 text-center transition-all duration-300">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=1200"
            alt="Warm roasted coffee beans"
            className="h-full w-full object-cover object-center opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C100E]/70 via-[#1C100E]/30 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl px-4 space-y-4 animate-fade-in-up">
          <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-[#1C100E]/40 border border-amber-400/20 px-4 py-2 rounded-full backdrop-blur-md shadow-md">
            <Sparkles className="h-3.5 w-3.5 text-[#D9A441]" />
            <span>Handcrafted Delights</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-md">
            Our Cozy Menu
          </h1>
          <p className="text-sm text-[#FFF8E7]/90 leading-relaxed drop-shadow-sm font-light max-w-md mx-auto">
            From single-origin espresso extraction to wholesome breakfast combos, explore our curated selection of delicious eats and treats.
          </p>
        </div>
      </section>

      {/* Menu Catalog Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 animate-fade-in-up">
        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 pb-8 border-b border-borderColor/40">
          
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 border shadow-sm ${
                selectedCategory === "all"
                  ? "bg-primary text-white border-primary shadow-md hover:scale-[1.01]"
                  : "bg-white hover:bg-secondary/40 text-textMuted border-borderColor/60 hover:text-primary"
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 border shadow-sm ${
                  selectedCategory === cat.slug
                    ? "bg-primary text-white border-primary shadow-md hover:scale-[1.01]"
                    : "bg-white hover:bg-secondary/40 text-textMuted border-borderColor/60 hover:text-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search, Veg Toggle and Sort options */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu..."
                className="w-full rounded-full border border-borderColor bg-cardBg pl-10 pr-4 py-3 text-xs text-foreground focus:border-accent transition-all shadow-sm focus:ring-1 focus:ring-accent font-semibold"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-textMuted" />
            </div>

            {/* Veg Switch */}
            <label className="flex items-center space-x-2.5 cursor-pointer bg-cardBg border border-borderColor px-4 py-3 rounded-full shrink-0 shadow-sm hover:border-accent transition-all duration-200">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="rounded border-borderColor text-primary focus:ring-accent h-4 w-4 cursor-pointer"
              />
              <span className="text-xs font-bold text-textMuted select-none uppercase tracking-wider">Veg Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="relative shrink-0 flex items-center bg-cardBg border border-borderColor rounded-full px-4 py-3 shadow-sm hover:border-accent transition-all duration-200">
              <ArrowUpDown className="h-4 w-4 text-textMuted mr-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-textMuted py-0.5 pr-6 border-none cursor-pointer focus:ring-0 uppercase tracking-wider"
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: Highest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <span className="text-xs font-bold text-textMuted uppercase tracking-wider">Brewing menu options...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-600 font-bold py-12 text-sm uppercase tracking-wider">
            Failed to load menu: {error}
          </div>
        )}

        {/* Grid Products list */}
        {!loading && !error && (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 space-y-3 border border-dashed border-borderColor/60 rounded-3xl bg-[#FFF8E7]/10">
                <p className="font-serif text-xl font-bold text-foreground">No Items Found</p>
                <p className="text-xs text-textMuted max-w-xs mx-auto font-light leading-relaxed">
                  We couldn't find any menu items matching your specific filters. Try searching for something else!
                </p>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
