"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Users, Clock, Mail, Phone, Check, X, Loader2, FileText } from "lucide-react";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: string; // PENDING, APPROVED, REJECTED, CANCELLED
  note: string;
  createdAt: string;
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING"); // PENDING, APPROVED, REJECTED, CANCELLED

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reservations");
      if (res.ok) {
        const data = await res.json();
        setReservations(data.reservations || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
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
      } else {
        alert("Failed to update reservation status");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "APPROVED") return "bg-green-100 text-green-700 border-green-200";
    if (status === "REJECTED" || status === "CANCELLED") return "bg-red-100 text-red-700 border-red-200";
    return "bg-amber-100 text-amber-700 border-amber-200"; // PENDING
  };

  const filtered = reservations.filter((r) => r.status === filter);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-800">Table Reservations</h1>
          <p className="text-xs text-neutral-500 mt-1">Review table booking requests, approve guests, and toggle status lists.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap bg-neutral-100 p-1 rounded-xl border border-neutral-200 shrink-0">
          {["PENDING", "APPROVED", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === status
                  ? "bg-white text-neutral-800 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {status.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-2 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
          <span className="text-xs text-neutral-500">Checking reservations...</span>
        </div>
      )}

      {/* Bookings Table/Card list */}
      {!loading && (
        <>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: Name, date requested */}
                    <div className="flex justify-between items-start pb-3 border-b border-neutral-100">
                      <div>
                        <h3 className="text-sm font-bold text-neutral-800">{booking.name}</h3>
                        <span className="text-[10px] text-neutral-400 font-medium">
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* Booking metadata */}
                    <div className="grid grid-cols-3 gap-3 text-xs leading-normal">
                      <div className="flex items-center text-neutral-500">
                        <Calendar className="h-4 w-4 mr-2 text-amber-600 shrink-0" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center text-neutral-500">
                        <Clock className="h-4 w-4 mr-2 text-amber-600 shrink-0" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center text-neutral-500">
                        <Users className="h-4 w-4 mr-2 text-amber-600 shrink-0" />
                        <span>{booking.guests} Guests</span>
                      </div>
                    </div>

                    {/* Customer contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs leading-normal text-neutral-500 font-medium bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                      <div className="flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-2 text-neutral-400 shrink-0" />
                        <span className="truncate">{booking.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-2 text-neutral-400 shrink-0" />
                        <span>{booking.phone}</span>
                      </div>
                    </div>

                    {/* Note if exists */}
                    {booking.note && (
                      <div className="flex items-start text-[11px] text-neutral-500 bg-neutral-50/50 p-2.5 rounded-lg border border-neutral-100/50 italic leading-relaxed">
                        <FileText className="h-3.5 w-3.5 mr-2 text-neutral-400 shrink-0 mt-0.5" />
                        <span>Note: "{booking.note}"</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {booking.status === "PENDING" && (
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
                      <button
                        onClick={() => handleUpdateStatus(booking.id, "REJECTED")}
                        className="w-full flex items-center justify-center space-x-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-full text-[10px] font-bold py-2 transition-all focus:outline-none"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking.id, "APPROVED")}
                        className="w-full flex items-center justify-center space-x-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-[10px] font-bold py-2 shadow-sm transition-all focus:outline-none"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-neutral-200 bg-white rounded-2xl shadow-sm text-xs text-neutral-400 leading-normal">
              No reservations found in this status list.
            </div>
          )}
        </>
      )}
    </div>
  );
}
