"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { GridSkeleton } from "@/components/ui/LoadingSkeleton";
import { menuItems, menuCategories, MenuItem } from "@/data/menuData";
import { Search, ArrowUpDown, Leaf } from "lucide-react";

const categoryFilters = [
  { name: "All", slug: "all" },
  ...menuCategories,
];

export default function MenuPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<MenuItem[]>([]);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(menuItems);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Filter and Sort Logic
  const filteredProducts = products
    .filter((product) => {
      // Category Filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
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
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        tagline="Handcrafted Delights"
        title="Our Cozy Menu"
        description="From single-origin espresso extraction to wholesome comfort food, explore our curated selection of delicious eats and treats."
      />

      {/* Menu Catalog Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 page-enter">
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categoryFilters.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
                selectedCategory === cat.slug
                  ? "bg-primary text-white shadow-md"
                  : "bg-secondary hover:bg-borderColor/50 text-textMuted"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search, Veg Toggle and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10 pb-8 border-b border-borderColor">
          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="w-full rounded-full border border-borderColor bg-cardBg pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-primary transition-all"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-textMuted" />
          </div>

          <div className="flex gap-3 items-center">
            {/* Veg Switch */}
            <label className="flex items-center space-x-2.5 cursor-pointer bg-cardBg border border-borderColor px-4 py-2.5 rounded-full shrink-0 hover:border-primary/40 transition-colors">
              <Leaf className={`h-4 w-4 ${vegOnly ? "text-green-600" : "text-textMuted"}`} />
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="rounded border-borderColor text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <span className="text-xs font-semibold text-textMuted select-none">Veg Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="relative shrink-0 flex items-center bg-cardBg border border-borderColor rounded-full px-3 py-1.5">
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

        {/* Loading Skeletons */}
        {loading && <GridSkeleton count={8} />}

        {/* Grid Products list */}
        {!loading && (
          <>
            {/* Active filter summary */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-textMuted">
                Showing <span className="font-bold text-foreground">{filteredProducts.length}</span>{" "}
                {filteredProducts.length === 1 ? "item" : "items"}
                {selectedCategory !== "all" && (
                  <span>
                    {" "}
                    in{" "}
                    <span className="font-semibold text-primary">
                      {categoryFilters.find((c) => c.slug === selectedCategory)?.name}
                    </span>
                  </span>
                )}
              </p>
            </div>

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
                  We couldn&apos;t find any menu items matching your specific filters. Try searching for something else!
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                    setVegOnly(false);
                    setSortBy("default");
                  }}
                  className="mt-4 inline-flex items-center rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
