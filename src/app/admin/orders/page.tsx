"use client";

import React, { useState, useEffect } from "react";
import { ClipboardList, Loader2, Play, CheckCircle, PackageOpen, XCircle, Phone, MapPin } from "lucide-react";

interface Order {
  id: string;
  items: any; // [{ productId, name, price, quantity, image }]
  total: number;
  discount: number;
  paymentStatus: string;
  status: string; // PENDING, PREPARING, READY, DELIVERED, CANCELLED
  address: string;
  phone: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ACTIVE"); // ACTIVE, DELIVERED, CANCELLED

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        // Optimistic UI updates
        setOrders((prev) =>
          prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    if (filter === "ACTIVE") {
      return ["PENDING", "PREPARING", "READY"].includes(order.status);
    }
    return order.status === filter;
  });

  const getStatusColor = (status: string) => {
    if (status === "DELIVERED") return "bg-green-100 text-green-700 border-green-200";
    if (status === "CANCELLED") return "bg-red-100 text-red-700 border-red-200";
    if (status === "READY") return "bg-indigo-100 text-indigo-700 border-indigo-200";
    if (status === "PREPARING") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-amber-100 text-amber-700 border-amber-200"; // PENDING
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-800">Live Order Queue</h1>
          <p className="text-xs text-neutral-500 mt-1">Track customer transactions, prepare foods, and toggle active orders status.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200 shrink-0">
          <button
            onClick={() => setFilter("ACTIVE")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              filter === "ACTIVE" ? "bg-white text-neutral-800 shadow-sm" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("DELIVERED")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              filter === "DELIVERED" ? "bg-white text-neutral-800 shadow-sm" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("CANCELLED")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              filter === "CANCELLED" ? "bg-white text-neutral-800 shadow-sm" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-2 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
          <span className="text-xs text-neutral-500">Checking orders queue...</span>
        </div>
      )}

      {/* Orders Cards Grid */}
      {!loading && (
        <>
          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => {
                const itemsList = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
                return (
                  <div
                    key={order.id}
                    className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    {/* Header info */}
                    <div className="bg-neutral-50 border-b border-neutral-200 px-5 py-3 flex justify-between items-center">
                      <div>
                        <span className="block text-[10px] text-neutral-400 font-mono">ID: {order.id.slice(0, 8)}</span>
                        <span className="block text-[10px] text-neutral-500 font-medium font-sans">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Content Items */}
                    <div className="p-5 flex-1 space-y-4">
                      {/* Items */}
                      <div className="divide-y divide-neutral-100">
                        {itemsList.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between py-2 text-xs">
                            <span className="text-neutral-600 font-medium">
                              {item.name} <strong className="text-neutral-400 font-normal">x{item.quantity}</strong>
                            </span>
                            <span className="font-bold text-neutral-800 font-sans">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Info Address & Phone */}
                      <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 space-y-2 leading-relaxed font-medium">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-neutral-400 shrink-0 mt-0.5" />
                          <span>{order.address}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-neutral-400 shrink-0" />
                          <span>{order.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Total & Action bar */}
                    <div className="border-t border-neutral-200 p-5 bg-neutral-50/50 flex flex-col space-y-4">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-neutral-500">Order Total</span>
                        <span className="text-sm text-amber-700 font-sans">₹{order.total.toFixed(2)}</span>
                      </div>

                      {/* Transition button triggers */}
                      {filter === "ACTIVE" && (
                        <div className="grid grid-cols-2 gap-2.5">
                          {order.status === "PENDING" && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                              className="w-full flex items-center justify-center space-x-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-2 shadow-sm transition-all"
                            >
                              <Play className="h-3 w-3 fill-current" />
                              <span>Start Preparing</span>
                            </button>
                          )}
                          {order.status === "PREPARING" && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, "READY")}
                              className="w-full flex items-center justify-center space-x-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-2 shadow-sm transition-all"
                            >
                              <PackageOpen className="h-3.5 w-3.5" />
                              <span>Mark Ready</span>
                            </button>
                          )}
                          {order.status === "READY" && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                              className="w-full flex items-center justify-center space-x-1.5 rounded-full bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold py-2 shadow-sm transition-all col-span-2"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Deliver / Complete</span>
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
            <div className="text-center py-20 border border-dashed border-neutral-200 bg-white rounded-2xl shadow-sm text-xs text-neutral-400 leading-normal">
              No orders found in this category.
            </div>
          )}
        </>
      )}
    </div>
  );
}
