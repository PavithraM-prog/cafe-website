"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ClipboardList,
  Loader2,
  Play,
  CheckCircle,
  PackageOpen,
  XCircle,
  Phone,
  MapPin,
  Laptop,
  Store,
  Calendar,
  Filter,
  Plus,
  X,
  Search,
  Check,
  Coffee
} from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";

interface Order {
  id: string;
  items: any; // [{ productId, name, price, quantity, image }]
  total: number;
  discount: number;
  paymentStatus: string;
  status: string; // PENDING, PREPARING, READY, DELIVERED, CANCELLED
  source: string; // WEBSITE, WALK_IN
  address: string;
  phone: string;
  createdAt: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryId: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering States
  const [statusFilter, setStatusFilter] = useState("ACTIVE"); // ACTIVE, PENDING, PREPARING, READY, DELIVERED, CANCELLED
  const [sourceFilter, setSourceFilter] = useState("ALL"); // ALL, WEBSITE, WALK_IN
  const [dateFilter, setDateFilter] = useState("today"); // today, week, all

  // Walk-in Order Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [cart, setCart] = useState<{ product: MenuItem; quantity: number }[]>([]);
  const [loyaltyEmail, setLoyaltyEmail] = useState("");
  const [loyaltyMessage, setLoyaltyMessage] = useState("");
  const [isCheckingLoyalty, setIsCheckingLoyalty] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (sourceFilter !== "ALL") params.append("source", sourceFilter);
      if (dateFilter !== "all") params.append("date", dateFilter);

      const res = await fetch(`/api/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sourceFilter, dateFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
        );
        // If we are showing "ACTIVE" orders and we complete/cancel it, refetch to clean up active screen
        if (statusFilter === "ACTIVE" && (newStatus === "DELIVERED" || newStatus === "CANCELLED")) {
          fetchOrders();
        }
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch Menu for Walk-in orders
  const loadMenu = async () => {
    try {
      setLoadingMenu(true);
      const res = await fetch("/api/menu");
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data.products || []);
      }
    } catch (e) {
      console.error("Failed to load products:", e);
    } finally {
      setLoadingMenu(false);
    }
  };

  const handleOpenWalkInModal = () => {
    setModalOpen(true);
    setCart([]);
    setLoyaltyEmail("");
    setLoyaltyMessage("");
    loadMenu();
  };

  const addToCart = (product: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (productId: string, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + amount;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const checkLoyaltyMember = async () => {
    if (!loyaltyEmail) return;
    try {
      setIsCheckingLoyalty(true);
      setLoyaltyMessage("");
      const res = await fetch(`/api/admin/loyalty?search=${encodeURIComponent(loyaltyEmail)}`);
      if (res.ok) {
        const data = await res.json();
        const members = data.members || [];
        const found = members.find((m: any) => m.email.toLowerCase() === loyaltyEmail.toLowerCase());
        if (found) {
          setLoyaltyMessage(`✅ Member verified! Points: ${found.points}. Today's purchase will award ${Math.floor(cartTotal)} points.`);
        } else {
          setLoyaltyMessage("❌ No loyalty member found. Will record as standard walk-in.");
        }
      }
    } catch (e) {
      setLoyaltyMessage("⚠️ Error checking member directory.");
    } finally {
      setIsCheckingLoyalty(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const submitWalkInOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Please add at least one item to the order.");
      return;
    }

    try {
      const itemsList = cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: itemsList,
          total: cartTotal,
          discount: 0,
          source: "WALK_IN",
          loyaltyEmail: loyaltyEmail || undefined,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to record order.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting walk-in order.");
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "DELIVERED") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (status === "CANCELLED") return "bg-red-50 text-red-700 border-red-100";
    if (status === "READY") return "bg-indigo-50 text-indigo-700 border-indigo-100";
    if (status === "PREPARING") return "bg-blue-50 text-blue-700 border-blue-100";
    return "bg-amber-50 text-amber-700 border-amber-100"; // PENDING
  };

  // Filter products by search query
  const filteredProducts = menuItems.filter((p) =>
    p.name.toLowerCase().includes(menuSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2d1e18]">Live Order Queue</h1>
          <p className="text-xs text-[#705e55] mt-1 font-medium">Monitor active web requests and register walk-in service.</p>
        </div>

        {/* Record Walk-In Button */}
        <button
          onClick={handleOpenWalkInModal}
          className="flex items-center space-x-2 bg-[#8c6239] hover:bg-[#734f2d] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Record Walk-in Order</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#e8dfd7] p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center gap-5 justify-between">
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Select */}
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Queue status</span>
            <div className="flex bg-[#f2ede4] p-0.5 rounded-xl border border-[#e8dfd7]">
              {["ACTIVE", "PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED", "ALL"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    statusFilter === st ? "bg-white text-[#2d1e18] shadow-sm" : "text-[#705e55] hover:text-[#2d1e18]"
                  }`}
                >
                  {st === "ACTIVE" ? "Active" : st.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Source Select */}
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Source</span>
            <div className="flex bg-[#f2ede4] p-0.5 rounded-xl border border-[#e8dfd7]">
              {["ALL", "WEBSITE", "WALK_IN"].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setSourceFilter(sc)}
                  className={`rounded-lg px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    sourceFilter === sc ? "bg-white text-[#2d1e18] shadow-sm" : "text-[#705e55] hover:text-[#2d1e18]"
                  }`}
                >
                  {sc === "ALL" ? "All Sources" : sc === "WEBSITE" ? "Website" : "Walk-in"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="space-y-1">
          <span className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Timeframe</span>
          <div className="flex bg-[#f2ede4] p-0.5 rounded-xl border border-[#e8dfd7] md:self-end">
            {["today", "week", "all"].map((dt) => (
              <button
                key={dt}
                onClick={() => setDateFilter(dt)}
                className={`rounded-lg px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                  dateFilter === dt ? "bg-white text-[#2d1e18] shadow-sm" : "text-[#705e55] hover:text-[#2d1e18]"
                }`}
              >
                {dt === "today" ? "Today" : dt === "week" ? "Last 7 Days" : "All Time"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Screen */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-3 bg-white rounded-2xl border border-[#e8dfd7] shadow-sm">
          <Loader2 className="h-8 w-8 text-[#8c6239] animate-spin" />
          <span className="text-xs text-[#705e55] font-semibold">Updating live orders...</span>
        </div>
      )}

      {/* Orders Cards Grid */}
      {!loading && (
        <>
          {orders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => {
                const itemsList = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
                return (
                  <div
                    key={order.id}
                    className="bg-white border border-[#e8dfd7] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    {/* Header: ID, Date, Source */}
                    <div className="bg-[#faf8f5] border-b border-[#e8dfd7] px-5 py-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] text-[#2d1e18] font-mono font-bold uppercase tracking-wider">
                            Order {order.id.slice(0, 8)}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide border ${
                              order.source === "WEBSITE"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}
                          >
                            {order.source === "WEBSITE" ? (
                              <>
                                <Laptop className="h-2 w-2 mr-0.5" />
                                <span>Web</span>
                              </>
                            ) : (
                              <>
                                <Store className="h-2 w-2 mr-0.5" />
                                <span>Walk-in</span>
                              </>
                            )}
                          </span>
                        </div>
                        <span className="block text-[9px] text-[#705e55] font-medium font-sans mt-0.5">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Content: Items list */}
                    <div className="p-5 flex-1 space-y-4">
                      <div className="divide-y divide-[#f2ede4]">
                        {itemsList.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between py-2.5 text-xs">
                            <span className="text-[#2d1e18] font-bold">
                              {item.name} <span className="text-[#705e55] font-semibold text-[10px] ml-1">x{item.quantity}</span>
                            </span>
                            <span className="font-bold text-[#705e55] font-sans">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Customer contact (Only for Website orders) */}
                      {order.source === "WEBSITE" && (
                        <div className="pt-3 border-t border-[#f2ede4] text-[10px] text-[#705e55] space-y-1.5 font-semibold bg-[#faf8f5]/60 p-2.5 rounded-xl border border-[#e8dfd7]/60">
                          <div className="flex items-start">
                            <MapPin className="h-3.5 w-3.5 mr-2 text-[#8c6239] shrink-0 mt-0.5" />
                            <span>{order.address}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-3.5 w-3.5 mr-2 text-[#8c6239] shrink-0" />
                            <span>{order.phone}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Total & Action Bar */}
                    <div className="border-t border-[#e8dfd7] p-5 bg-[#faf8f5]/40 flex flex-col space-y-4">
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                        <span className="text-[#705e55]">Total Bill</span>
                        <span className="text-sm text-amber-700 font-sans font-extrabold">{formatCurrency(order.total)}</span>
                      </div>

                      {/* State updates for orders queue */}
                      {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                        <div className="grid grid-cols-2 gap-2.5">
                          {order.status === "PENDING" && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                              className="w-full flex items-center justify-center space-x-1.5 rounded-full bg-[#8c6239] hover:bg-[#734f2d] text-white text-[10px] font-bold py-2 shadow-sm transition-all"
                            >
                              <Play className="h-3 w-3 fill-current" />
                              <span>Start Preparing</span>
                            </button>
                          )}
                          {order.status === "PREPARING" && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, "READY")}
                              className="w-full flex items-center justify-center space-x-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold py-2 shadow-sm transition-all animate-pulse"
                            >
                              <PackageOpen className="h-3.5 w-3.5" />
                              <span>Mark Ready</span>
                            </button>
                          )}
                          {order.status === "READY" && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                              className="w-full flex items-center justify-center space-x-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-2 shadow-sm transition-all col-span-2"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Serve / Complete</span>
                            </button>
                          )}

                          {order.status !== "READY" && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                              className="flex items-center justify-center space-x-1 border border-red-200 hover:bg-red-50 text-red-600 rounded-full text-[10px] font-bold py-2 transition-all"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-[#e8dfd7] bg-white rounded-2xl shadow-sm text-xs text-[#705e55] font-semibold italic">
              No orders matches the current queue filters.
            </div>
          )}
        </>
      )}

      {/* Record Walk-in Order Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1d140e]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8dfd7] rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#faf8f5] border-b border-[#e8dfd7] px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Coffee className="h-5 w-5 text-amber-700" />
                <h3 className="font-serif font-bold text-lg text-[#2d1e18]">Record Walk-in Order</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#f2ede4] text-[#705e55] hover:text-[#2d1e18] transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
              {/* Left Side: Product Selector */}
              <div className="flex-1 space-y-4 flex flex-col min-w-0">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#705e55]" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-full py-2.5 pl-10 pr-4 text-xs font-semibold text-[#2d1e18] placeholder-[#705e55]/60 focus:border-[#8c6239] transition-all"
                  />
                </div>

                {loadingMenu ? (
                  <div className="flex flex-col items-center justify-center flex-1 py-12">
                    <Loader2 className="h-7 w-7 text-[#8c6239] animate-spin" />
                    <span className="text-[10px] text-[#705e55] font-semibold mt-2">Loading menu directory...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[45vh]">
                    {filteredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => addToCart(prod)}
                        className="bg-[#faf8f5] hover:bg-[#f2ede4] border border-[#e8dfd7] rounded-2xl p-3 text-left cursor-pointer transition-all flex flex-col justify-between space-y-2 hover:border-[#8c6239] hover:shadow-sm"
                      >
                        <div className="h-20 rounded-xl overflow-hidden bg-[#e8dfd7]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={prod.image} alt={prod.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <span className="block text-[11px] font-bold text-[#2d1e18] truncate leading-tight">
                            {prod.name}
                          </span>
                          <span className="block text-[10px] font-extrabold text-[#8c6239] mt-1">
                            {formatCurrency(prod.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Order Summary & Customer details */}
              <div className="w-full lg:w-80 bg-[#faf8f5] border border-[#e8dfd7] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-4 flex-1 flex flex-col min-h-0">
                  <h4 className="font-serif font-bold text-sm text-[#2d1e18] border-b border-[#e8dfd7] pb-2">Order Items</h4>
                  
                  {/* Cart Items list */}
                  <div className="flex-1 overflow-y-auto space-y-3 max-h-[25vh]">
                    {cart.length > 0 ? (
                      cart.map((item) => (
                        <div key={item.product.id} className="flex justify-between items-center text-xs">
                          <div className="min-w-0">
                            <span className="block font-bold text-[#2d1e18] truncate">{item.product.name}</span>
                            <span className="block text-[9px] text-[#705e55] font-medium">
                              {formatCurrency(item.product.price)} x {item.quantity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5 shrink-0 bg-white border border-[#e8dfd7] rounded-lg p-0.5">
                            <button
                              onClick={() => updateCartQty(item.product.id, -1)}
                              className="h-5 w-5 flex items-center justify-center font-bold hover:bg-[#faf8f5] rounded text-[#705e55]"
                            >
                              -
                            </button>
                            <span className="text-[10px] font-bold text-[#2d1e18] px-1">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQty(item.product.id, 1)}
                              className="h-5 w-5 flex items-center justify-center font-bold hover:bg-[#faf8f5] rounded text-[#705e55]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-[10px] text-[#705e55] italic font-semibold">
                        Add items from the menu.
                      </div>
                    )}
                  </div>

                  {/* Loyalty member association */}
                  <div className="space-y-1.5 pt-3 border-t border-[#e8dfd7]">
                    <label className="block text-[9px] font-bold text-[#705e55] uppercase tracking-wider">
                      Loyalty Customer Email (Optional)
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="email"
                        placeholder="customer@email.com"
                        value={loyaltyEmail}
                        onChange={(e) => setLoyaltyEmail(e.target.value)}
                        className="bg-white border border-[#e8dfd7] rounded-xl px-3 py-2 text-xs font-semibold text-[#2d1e18] placeholder-[#705e55]/40 flex-1"
                      />
                      <button
                        type="button"
                        onClick={checkLoyaltyMember}
                        className="bg-[#f2ede4] hover:bg-[#e8dfd7] text-[#2d1e18] px-3 rounded-xl text-[10px] font-bold border border-[#e8dfd7]"
                      >
                        Verify
                      </button>
                    </div>
                    {isCheckingLoyalty && <span className="block text-[9px] text-neutral-400">Verifying customer directory...</span>}
                    {loyaltyMessage && (
                      <p className="text-[9px] font-semibold leading-relaxed text-[#705e55]">
                        {loyaltyMessage}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submits */}
                <div className="space-y-4 pt-3 border-t border-[#e8dfd7]">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[#705e55]">Total Amount</span>
                    <span className="text-base text-amber-700 font-sans font-extrabold">{formatCurrency(cartTotal)}</span>
                  </div>

                  <button
                    onClick={submitWalkInOrder}
                    disabled={cart.length === 0}
                    className="w-full bg-[#8c6239] hover:bg-[#734f2d] text-white py-2.5 rounded-full text-xs font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5"
                  >
                    <Check className="h-4 w-4" />
                    <span>Complete walk-in order</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
