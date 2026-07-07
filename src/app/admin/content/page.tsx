"use client";

import React, { useState, useEffect } from "react";
import { Settings, Tag, Plus, Trash2, Check, Loader2, Sparkles } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  isActive: boolean;
}

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Settings State
  const [heroTitle, setHeroTitle] = useState("");
  const [heroTagline, setHeroTagline] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [cafeAddress, setCafeAddress] = useState("");
  const [cafePhone, setCafePhone] = useState("");
  const [cafeEmail, setCafeEmail] = useState("");
  
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);

  // Coupon Form State
  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch settings
      const settingsRes = await fetch("/api/settings");
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        const s = data.settings || {};
        setHeroTitle(s.hero_title || "");
        setHeroTagline(s.hero_tagline || "");
        setOpeningHours(s.opening_hours || "");
        setCafeAddress(s.cafe_address || "");
        setCafePhone(s.cafe_phone || "");
        setCafeEmail(s.cafe_email || "");
      }

      // Fetch coupons
      const couponsRes = await fetch("/api/coupons");
      if (couponsRes.ok) {
        const data = await couponsRes.json();
        setCoupons(data.coupons || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSettingsLoading(true);
      setSettingsSuccess(null);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero_title: heroTitle,
          hero_tagline: heroTagline,
          opening_hours: openingHours,
          cafe_address: cafeAddress,
          cafe_phone: cafePhone,
          cafe_email: cafeEmail,
        }),
      });

      if (res.ok) {
        setSettingsSuccess("Landing page text updated successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode || !discountValue) return;

    try {
      setCouponLoading(true);
      setCouponError(null);

      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          discountType,
          discountValue: parseFloat(discountValue),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCouponCode("");
        setDiscountValue("");
        // Reload coupons list
        const couponsRes = await fetch("/api/coupons");
        if (couponsRes.ok) {
          const d = await couponsRes.json();
          setCoupons(d.coupons || []);
        }
      } else {
        setCouponError(data.error || "Failed to create coupon");
      }
    } catch (err) {
      setCouponError("Server error creating coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleToggleCoupon = async (coupon: Coupon) => {
    try {
      const res = await fetch("/api/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: coupon.id, isActive: !coupon.isActive }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, isActive: !c.isActive } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const res = await fetch(`/api/coupons?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-800">Promos & Content settings</h1>
        <p className="text-xs text-neutral-500 mt-1">Configure landing page messages, opening hours, address, and coupon codes.</p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-2 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
          <span className="text-xs text-neutral-500">Checking configurations...</span>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Landing Page Content Editor */}
          <form
            onSubmit={handleSettingsSubmit}
            className="lg:col-span-7 bg-white border border-neutral-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-5"
          >
            <h2 className="font-serif text-lg font-bold text-neutral-700 pb-3 border-b border-neutral-100 flex items-center space-x-2">
              <Settings className="h-5 w-5 text-neutral-500" />
              <span>Landing Page Copy Customization</span>
            </h2>

            {/* Title & Tagline */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500">Hero Main Title</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="E.g. Escape into a Cozy Corner of Coffee & Comfort"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all font-serif"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500">Hero Tagline / Subtitle</label>
                <textarea
                  value={heroTagline}
                  onChange={(e) => setHeroTagline(e.target.value)}
                  placeholder="Where every cup tells a story..."
                  rows={2}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            <hr className="border-neutral-100" />

            {/* Contact, Address and Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500">Opening Hours Text</label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500">Quick Contact Phone</label>
                <input
                  type="text"
                  value={cafePhone}
                  onChange={(e) => setCafePhone(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500">Contact Email Address</label>
                <input
                  type="email"
                  value={cafeEmail}
                  onChange={(e) => setCafeEmail(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500">Cafe Street Address</label>
                <input
                  type="text"
                  value={cafeAddress}
                  onChange={(e) => setCafeAddress(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {settingsSuccess && (
              <p className="text-xs font-semibold text-green-600 text-center py-1">{settingsSuccess}</p>
            )}

            <button
              type="submit"
              disabled={settingsLoading}
              className="rounded-full bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-200 text-white text-xs font-semibold px-6 py-3 shadow-sm transition-colors flex items-center space-x-1.5 ml-auto"
            >
              {settingsLoading ? (
                <span>Updating settings...</span>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Update Landing Content</span>
                </>
              )}
            </button>
          </form>

          {/* Coupon Codes Manager (Sidebar) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Create Coupon form */}
            <form
              onSubmit={handleCreateCoupon}
              className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm space-y-4"
            >
              <h2 className="font-serif text-lg font-bold text-neutral-700 pb-2 border-b border-neutral-100 flex items-center space-x-2">
                <Tag className="h-5 w-5 text-neutral-500" />
                <span>Create Discount Coupon</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. COZY25"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500">Discount Type *</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 focus:border-amber-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount ($)</option>
                </select>
              </div>

              {couponError && <p className="text-xs font-semibold text-red-600">{couponError}</p>}

              <button
                type="submit"
                disabled={couponLoading}
                className="w-full flex items-center justify-center space-x-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 shadow-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Coupon</span>
              </button>
            </form>

            {/* Coupons list */}
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-neutral-700 pb-2 border-b border-neutral-100">
                Active Promo Coupons
              </h3>

              {coupons.length > 0 ? (
                <div className="space-y-3.5">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="flex items-center justify-between border border-neutral-150 p-3.5 rounded-xl bg-neutral-50/50"
                    >
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-sm text-neutral-800 tracking-wider">
                          {coupon.code}
                        </span>
                        <span className="block text-[10px] text-neutral-500 font-semibold font-sans">
                          {coupon.discountType === "PERCENTAGE"
                            ? `${coupon.discountValue}% discount`
                            : `$${coupon.discountValue.toFixed(2)} flat discount`}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* Toggle active state */}
                        <button
                          onClick={() => handleToggleCoupon(coupon)}
                          className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider transition-all border ${
                            coupon.isActive
                              ? "bg-green-50 text-green-700 border-green-150"
                              : "bg-neutral-100 text-neutral-500 border-neutral-200"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Disabled"}
                        </button>
                        {/* Delete Coupon */}
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-neutral-400 py-6">No coupons created yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
