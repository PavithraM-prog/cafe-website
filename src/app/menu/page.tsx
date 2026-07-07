"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Search, Loader2, Filter, ArrowUpDown } from "lucide-react";

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
        // Find category object
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
      <section className="bg-secondary/40 border-b border-borderColor py-16 text-center transition-all">
        <div className="mx-auto max-w-xl px-4 space-y-3">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Handcrafted Delights</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Our Cozy Menu</h1>
          <p className="text-sm text-textMuted leading-relaxed">
            From single-origin espresso extraction to wholesome breakfast combos, explore our curated selection of delicious eats and treats.
          </p>
        </div>
      </section>

      {/* Menu Catalog Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-10 pb-8 border-b border-borderColor">
          
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-secondary hover:bg-borderColor/50 text-textMuted"
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-primary text-white shadow-sm"
                    : "bg-secondary hover:bg-borderColor/50 text-textMuted"
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
                className="w-full rounded-full border border-borderColor bg-cardBg pl-10 pr-4 py-2 text-xs text-foreground focus:border-primary transition-all"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-textMuted" />
            </div>

            {/* Veg Switch */}
            <label className="flex items-center space-x-2.5 cursor-pointer bg-cardBg border border-borderColor px-4 py-2 rounded-full shrink-0">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="rounded border-borderColor text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <span className="text-xs font-semibold text-textMuted select-none">Veg Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="relative shrink-0 flex items-center bg-cardBg border border-borderColor rounded-full px-3 py-1">
              <ArrowUpDown className="h-4 w-4 text-textMuted mr-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-textMuted py-1 pr-6 border-none cursor-pointer focus:ring-0"
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
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <span className="text-xs font-semibold text-textMuted">Brewing menu options...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-600 font-semibold py-12">
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
              <div className="text-center py-20 space-y-2 border border-dashed border-borderColor rounded-2xl bg-secondary/10">
                <p className="font-serif text-lg font-bold text-foreground">No Items Found</p>
                <p className="text-xs text-textMuted max-w-xs mx-auto">
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
