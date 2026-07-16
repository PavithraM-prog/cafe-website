"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Check, X, Loader2, Sparkles, Star } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import Image from "next/image";

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
  category?: { name: string };
  availablePieces: number;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminMenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [isVeg, setIsVeg] = useState(true);
  const [availability, setAvailability] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [availablePieces, setAvailablePieces] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch Menu
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Failed to load menu");
      const data = await res.json();
      setProducts(data.products || []);
      setCategories(data.categories || []);
      if (data.categories?.length > 0) {
        setCategoryId(data.categories[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    setIsVeg(true);
    setAvailability(true);
    setAvailablePieces("10");
    if (categories.length > 0) setCategoryId(categories[0].id);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setImage(product.image);
    setIsVeg(product.isVeg);
    setAvailability(product.availability);
    setCategoryId(product.categoryId);
    setAvailablePieces(product.availablePieces.toString());
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      setFormError("Product name, price, and category are required.");
      return;
    }

    try {
      setFormLoading(true);
      setFormError(null);

      const payload = {
        name,
        description,
        price: parseFloat(price),
        image: image || undefined,
        isVeg,
        availability,
        categoryId,
        availablePieces: parseInt(availablePieces) || 0,
      };

      const url = editingProduct ? `/api/menu/${editingProduct.id}` : "/api/menu";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        fetchMenu();
      } else {
        setFormError(data.error || "Failed to save product");
      }
    } catch (err) {
      setFormError("Server error saving product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMenu();
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  const toggleAvailability = async (product: Product) => {
    try {
      const res = await fetch(`/api/menu/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: !product.availability }),
      });
      if (res.ok) {
        // Optimistic UI updates
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, availability: !p.availability } : p))
        );
      }
    } catch (err) {
      console.error("Availability toggle failed:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-800">Menu Manager</h1>
          <p className="text-xs text-neutral-500 mt-1">Manage cafe catalog dishes, pricing, and active menu counts.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4.5 py-2.5 shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Loading & Error indicators */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-2 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
          <span className="text-xs text-neutral-500">Loading catalog items...</span>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 font-semibold py-12 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          {error}
        </div>
      )}

      {/* Catalog Table */}
      {!loading && !error && (
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-normal">
              <thead>
                <tr className="bg-neutral-50 text-neutral-400 font-bold uppercase tracking-widest border-b border-neutral-200">
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Available Stock</th>
                  <th className="px-6 py-4">Diet</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-medium">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="text-neutral-600 hover:bg-neutral-50/50 transition-colors">
                      {/* Item info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3.5">
                          <div className="relative h-10 w-16 overflow-hidden rounded bg-neutral-100 shrink-0 border border-neutral-200">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-neutral-800 truncate">{product.name}</h4>
                            <p className="text-[10px] text-neutral-400 line-clamp-1 leading-normal">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="rounded bg-neutral-100 text-neutral-700 px-2 py-0.5 text-[10px] font-bold">
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-bold font-sans text-neutral-800">
                        {formatCurrency(product.price)}
                      </td>

                      {/* Available Pieces */}
                      <td className="px-6 py-4 font-bold font-sans text-neutral-800">
                        {product.availablePieces} pcs
                      </td>

                      {/* Dietary */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            product.isVeg
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                        >
                          {product.isVeg ? "VEG" : "NON-VEG"}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleAvailability(product)}
                          className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider transition-all border ${
                            product.availability
                              ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                              : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                          }`}
                        >
                          {product.availability ? "Available" : "Sold Out"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2 shrink-0">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit Item"
                          >
                            <Edit2 className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Item"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-neutral-400 py-12">
                      No menu items created. Add one above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-100">
              <h3 className="font-serif text-lg font-bold text-neutral-700">
                {editingProduct ? `Edit Item: ${editingProduct.name}` : "Add New Menu Item"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-full transition-all focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Product name, price & available stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Iced Vanilla Latte"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 4.95"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500">Available Pieces *</label>
                  <input
                    type="number"
                    required
                    value={availablePieces}
                    onChange={(e) => setAvailablePieces(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all font-sans"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe details of taste, prep, or organic ingredients..."
                  rows={3}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all font-mono text-xs"
                />
              </div>

              {/* Toggle Switches */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Diet */}
                <label className="flex items-center space-x-2.5 cursor-pointer bg-neutral-50 border border-neutral-200 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    checked={isVeg}
                    onChange={(e) => setIsVeg(e.target.checked)}
                    className="rounded border-neutral-200 text-amber-600 focus:ring-amber-500 h-4.5 w-4.5 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-neutral-600 select-none">Vegetarian (Veg)</span>
                </label>

                {/* Availability */}
                <label className="flex items-center space-x-2.5 cursor-pointer bg-neutral-50 border border-neutral-200 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                    className="rounded border-neutral-200 text-amber-600 focus:ring-amber-500 h-4.5 w-4.5 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-neutral-600 select-none">In Stock</span>
                </label>
              </div>

              {/* Form Feedback */}
              {formError && (
                <p className="text-xs font-semibold text-red-600 text-center">{formError}</p>
              )}

              {/* CTAs */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-semibold px-5 py-2.5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="rounded-full bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-200 text-white text-xs font-semibold px-6 py-2.5 shadow-sm transition-colors flex items-center space-x-1.5"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Save Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
