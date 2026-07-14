"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Users,
  Clock,
  Mail,
  Phone,
  Check,
  X,
  Loader2,
  FileText,
  Utensils,
  Sparkles,
  Search,
  Filter
} from "lucide-react";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: string; // PENDING, APPROVED, REJECTED, CANCELLED
  type: string; // TABLE, EVENT
  note: string;
  createdAt: string;
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingReservations, setUpdatingReservations] = useState<Record<string, boolean>>({});
  
  // Filters
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL, TABLE, EVENT
  const [statusFilter, setStatusFilter] = useState("PENDING"); // PENDING, APPROVED, REJECTED, ALL
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (typeFilter !== "ALL") params.append("type", typeFilter);

      const res = await fetch(`/api/reservations?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReservations(data.reservations || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleUpdateStatus = useCallback(async (id: string, newStatus: string) => {
    setUpdatingReservations((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch("/api/reservations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setReservations((prev) =>
          prev.map((resv) => (resv.id === id ? { ...resv, status: newStatus } : resv))
        );
        // Refresh matching queue if status changed
        if (statusFilter !== "ALL") {
          fetchReservations();
        }
      } else {
        alert("Failed to update reservation status");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingReservations((prev) => ({ ...prev, [id]: false }));
    }
  }, [statusFilter, fetchReservations]);

  const getStatusColor = (status: string) => {
    if (status === "APPROVED") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (status === "REJECTED" || status === "CANCELLED") return "bg-red-50 text-red-700 border-red-100";
    return "bg-amber-50 text-amber-700 border-amber-100"; // PENDING
  };

  // Local Search Filter
  const filteredReservations = reservations.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2d1e18]">Reservations Management</h1>
          <p className="text-xs text-[#705e55] mt-1 font-medium">Coordinate table seats, event bookings, and manage customer requests.</p>
        </div>
      </div>

      {/* Tabs & Filters Bar */}
      <div className="bg-white border border-[#e8dfd7] p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Reservation Type Tabs */}
        <div className="flex bg-[#f2ede4] p-1 rounded-xl border border-[#e8dfd7] self-start text-xs font-semibold">
          <button
            onClick={() => setTypeFilter("ALL")}
            className={`rounded-lg px-4 py-2 transition-all flex items-center space-x-1.5 ${
              typeFilter === "ALL" ? "bg-white text-[#2d1e18] shadow-sm font-bold" : "text-[#705e55]"
            }`}
          >
            <span>All Bookings</span>
          </button>
          <button
            onClick={() => setTypeFilter("TABLE")}
            className={`rounded-lg px-4 py-2 transition-all flex items-center space-x-1.5 ${
              typeFilter === "TABLE" ? "bg-white text-[#2d1e18] shadow-sm font-bold" : "text-[#705e55]"
            }`}
          >
            <Utensils className="h-3.5 w-3.5" />
            <span>Table Bookings</span>
          </button>
          <button
            onClick={() => setTypeFilter("EVENT")}
            className={`rounded-lg px-4 py-2 transition-all flex items-center space-x-1.5 ${
              typeFilter === "EVENT" ? "bg-white text-[#2d1e18] shadow-sm font-bold" : "text-[#705e55]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Event Bookings</span>
          </button>
        </div>

        {/* Status Filters & Search */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:flex-none sm:w-60">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#705e55]" />
            <input
              type="text"
              placeholder="Search by customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-[#2d1e18] placeholder-[#705e55]/60 focus:border-[#8c6239] transition-all"
            />
          </div>

          {/* Status buttons */}
          <div className="flex bg-[#f2ede4] p-0.5 rounded-xl border border-[#e8dfd7] text-xs font-semibold">
            {["PENDING", "APPROVED", "REJECTED", "ALL"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                  statusFilter === st ? "bg-white text-[#2d1e18] shadow-sm" : "text-[#705e55] hover:text-[#2d1e18]"
                }`}
              >
                {st === "ALL" ? "All Status" : st.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading animation */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-3 bg-white rounded-2xl border border-[#e8dfd7] shadow-sm">
          <Loader2 className="h-8 w-8 text-[#8c6239] animate-spin" />
          <span className="text-xs text-[#705e55] font-semibold">Loading bookings directory...</span>
        </div>
      )}

      {/* Cards Display Grid */}
      {!loading && (
        <>
          {filteredReservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReservations.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border border-[#e8dfd7] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  {/* Highlight bar based on type */}
                  <span
                    className={`absolute top-0 left-0 right-0 h-1.5 ${
                      booking.type === "EVENT" ? "bg-amber-500" : "bg-[#8c6239]"
                    }`}
                  />

                  <div className="space-y-4">
                    {/* Card Header: Name, date requested */}
                    <div className="flex justify-between items-start pb-3 border-b border-[#f2ede4]">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-[#2d1e18]">{booking.name}</h3>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${
                              booking.type === "EVENT"
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-orange-50 text-[#8c6239] border border-orange-100"
                            }`}
                          >
                            {booking.type}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#705e55] font-medium block mt-0.5">
                          Requested on {new Date(booking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="flex items-center text-[#705e55] font-semibold bg-[#faf8f5] p-2 rounded-xl border border-[#e8dfd7]/50">
                        <Calendar className="h-4 w-4 mr-2 text-[#8c6239] shrink-0" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center text-[#705e55] font-semibold bg-[#faf8f5] p-2 rounded-xl border border-[#e8dfd7]/50">
                        <Clock className="h-4 w-4 mr-2 text-[#8c6239] shrink-0" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center text-[#705e55] font-semibold bg-[#faf8f5] p-2 rounded-xl border border-[#e8dfd7]/50">
                        <Users className="h-4 w-4 mr-2 text-[#8c6239] shrink-0" />
                        <span>{booking.guests} Guests</span>
                      </div>
                    </div>

                    {/* Customer contacts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-[#705e55] font-bold bg-[#faf8f5]/80 p-3 rounded-xl border border-[#e8dfd7]">
                      <div className="flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-2 text-[#705e55]/60 shrink-0" />
                        <span className="truncate">{booking.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-2 text-[#705e55]/60 shrink-0" />
                        <span>{booking.phone}</span>
                      </div>
                    </div>

                    {/* Booking Note if present */}
                    {booking.note && (
                      <div className="flex items-start text-[11px] text-[#705e55] bg-amber-50/20 p-3 rounded-xl border border-amber-100/50 italic leading-relaxed font-medium">
                        <FileText className="h-4 w-4 mr-2 text-amber-600 shrink-0 mt-0.5" />
                        <span>Note: &quot;{booking.note}&quot;</span>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  {booking.status === "PENDING" && (
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#f2ede4] mt-4">
                      <button
                        onClick={() => handleUpdateStatus(booking.id, "REJECTED")}
                        disabled={updatingReservations[booking.id]}
                        className="w-full flex items-center justify-center space-x-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-full text-[10px] font-bold py-2.5 transition-all shadow-sm disabled:opacity-50"
                      >
                        {updatingReservations[booking.id] ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        )}
                        <span>Reject Booking</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking.id, "APPROVED")}
                        disabled={updatingReservations[booking.id]}
                        className="w-full flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[10px] font-bold py-2.5 shadow-md transition-all disabled:opacity-50"
                      >
                        {updatingReservations[booking.id] ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        <span>Approve Booking</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-[#e8dfd7] bg-white rounded-2xl shadow-sm text-xs text-[#705e55] font-semibold italic">
              No booking requests registered in this category.
            </div>
          )}
        </>
      )}
    </div>
  );
}
