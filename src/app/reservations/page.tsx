"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, Clock, Users, MessageSquare, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

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

export default function ReservationsPage() {
  // Form details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [note, setNote] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // History details
  const [history, setHistory] = useState<Reservation[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Fetch reservation history
  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch("/api/reservations");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.reservations || []);
      }
    } catch (e) {
      console.error("Failed to load booking history:", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date || !time || !guests) {
      setSubmitError("Please fill out all required details.");
      return;
    }

    try {
      setSubmitLoading(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date,
          time,
          guests: parseInt(guests),
          note,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess("Table reservation requested successfully! Our team will approve it shortly.");
        // Clear form fields
        setNote("");
        // Reload history
        fetchHistory();
      } else {
        setSubmitError(data.error || "Failed to request reservation");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("An error occurred. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "APPROVED") return "bg-green-100 text-green-700 border-green-200";
    if (status === "REJECTED" || status === "CANCELLED") return "bg-red-100 text-red-700 border-red-200";
    return "bg-amber-100 text-amber-700 border-amber-200"; // PENDING
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <section className="relative overflow-hidden bg-[#1C100E] py-28 text-center transition-all duration-300">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200"
            alt="Warm roasted coffee beans"
            className="h-full w-full object-cover object-center opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C100E]/70 via-[#1C100E]/30 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl px-4 space-y-4 animate-fade-in-up">
          <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-[#1C100E]/40 border border-amber-400/20 px-4 py-2 rounded-full backdrop-blur-md shadow-md">
            <Calendar className="h-3.5 w-3.5 text-[#D9A441]" />
            <span>Reserve a Spot</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-md">
            Table Booking
          </h1>
          <p className="text-sm text-[#FFF8E7]/90 leading-relaxed drop-shadow-sm font-light max-w-md mx-auto">
            Reserve a table in advance for birthdays, meetings, or a cozy dinner. Join us and experience our unique hospitality.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Reservation Request Form */}
          <div className="lg:col-span-6 border border-borderColor/40 bg-cardBg p-8 sm:p-10 rounded-3xl shadow-xl space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground pb-3 border-b border-borderColor/40 uppercase tracking-wide">
              Book a Table
            </h2>

            <form onSubmit={handleBookingSubmit} className="space-y-5">
              {/* Name & Email inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@gmail.com"
                    className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Phone & Party size inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99999 99999"
                    className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    <span>Number of Guests *</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent cursor-pointer"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6">6+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Date & Time inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>Reservation Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>Booking Time *</span>
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent cursor-pointer"
                  >
                    <option value="08:00">8:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Special Note */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted flex items-center">
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  <span>Special Note / Requests</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="E.g. Table near the window, anniversary setup..."
                  rows={3}
                  className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white px-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent resize-none"
                />
              </div>

              {/* Feedback messages */}
              {submitSuccess && (
                <div className="flex items-center space-x-2 text-green-700 bg-green-50 border border-green-200 p-3.5 rounded-xl text-xs leading-relaxed font-semibold">
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {submitError && (
                <div className="flex items-center space-x-2 text-red-700 bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs leading-relaxed font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full flex items-center justify-center space-x-2 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-widest py-4 shadow-lg hover:shadow transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.005] active:scale-95"
              >
                {submitLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <span>Request Booking</span>
                )}
              </button>
            </form>
          </div>

          {/* User's Booking History */}
          <div className="lg:col-span-6 border border-borderColor/40 bg-cardBg p-8 sm:p-10 rounded-3xl shadow-xl space-y-6">
            <h2 className="font-serif text-xl font-bold text-foreground pb-3 border-b border-borderColor/40 uppercase tracking-wide">
              Your Bookings
            </h2>

            {historyLoading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-2">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-xs text-textMuted uppercase tracking-wider font-bold">Loading history...</span>
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
                {history.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-borderColor/40 p-5 rounded-2xl space-y-3 bg-[#FFF8E7]/30 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif font-bold text-sm text-foreground">
                          {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                        </h3>
                        <span className="text-[10px] text-textMuted/80 font-semibold font-sans">
                          Requested on {new Date(booking.createdAt).toLocaleDateString()}
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

                    <div className="grid grid-cols-2 gap-2 text-xs leading-normal">
                      <div className="flex items-center text-textMuted font-medium">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-accent" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center text-textMuted font-medium">
                        <Clock className="h-3.5 w-3.5 mr-2 text-accent" />
                        <span>{booking.time}</span>
                      </div>
                    </div>

                    {booking.note && (
                      <p className="text-[11px] text-[#7A635B] bg-white rounded-xl border border-borderColor/40 p-3 italic leading-relaxed font-light">
                        Note: "{booking.note}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-xs text-textMuted italic font-semibold border border-dashed border-borderColor/60 rounded-2xl bg-secondary/15">
                You haven't requested any table bookings yet. Fill out the form to secure your slot!
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
