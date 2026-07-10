"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toast, ToastType } from "@/components/ui/Toast";
import { BookingConfirmationModal } from "@/components/BookingConfirmationModal";
import { submitTableBooking, BookingConfirmation } from "@/services/bookingService";
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  User,
  Mail,
  Phone,
  Loader2,
  Armchair,
  TreePine,
} from "lucide-react";

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  guests?: string;
  date?: string;
  time?: string;
  seatingPreference?: string;
}

// Cafe working hours
const timeSlots = [
  { value: "07:00", label: "7:00 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "20:00", label: "8:00 PM" },
];

export default function TableBookingPage() {
  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [seatingPreference, setSeatingPreference] = useState("indoor");
  const [specialRequests, setSpecialRequests] = useState("");

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  // Validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/.test(phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!date) {
      newErrors.date = "Booking date is required";
    } else {
      const selectedDate = new Date(date);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      if (selectedDate < todayDate) {
        newErrors.date = "Please select a future date";
      }
    }

    if (!time) {
      newErrors.time = "Booking time is required";
    } else {
      const hour = parseInt(time.split(":")[0]);
      if (hour < 7 || hour > 20) {
        newErrors.time = "Please select a time within cafe hours (7 AM - 9 PM)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setGuests("2");
    setDate("");
    setTime("18:00");
    setSeatingPreference("indoor");
    setSpecialRequests("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setToast({ message: "Please fix the errors in the form.", type: "error" });
      return;
    }

    try {
      setSubmitLoading(true);

      const result = await submitTableBooking({
        fullName,
        email,
        phone,
        guests: parseInt(guests),
        date,
        time: timeSlots.find((t) => t.value === time)?.label || time,
        seatingPreference,
        specialRequests,
      });

      setConfirmation(result);
      setShowConfirmModal(true);
      resetForm();
    } catch {
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        tagline="Reserve a Spot"
        title="Table Booking"
        description="Reserve your perfect table in advance. Whether it's a romantic dinner, a business meeting, or a family gathering — we've got you covered."
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Booking Form Section */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 page-enter">
        <div className="border border-borderColor bg-cardBg p-6 sm:p-10 rounded-2xl shadow-sm space-y-8">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-foreground">Book Your Table</h2>
            <p className="text-xs text-textMuted">Fill in the details below and we&apos;ll confirm your reservation.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted flex items-center">
                  <User className="h-3.5 w-3.5 mr-1" />
                  Full Name <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  placeholder="John Doe"
                  className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all ${
                    errors.fullName ? "border-red-400 focus:border-red-500" : "border-borderColor focus:border-primary"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-600 font-medium animate-slideDown">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted flex items-center">
                  <Mail className="h-3.5 w-3.5 mr-1" />
                  Email Address <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="john@example.com"
                  className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all ${
                    errors.email ? "border-red-400 focus:border-red-500" : "border-borderColor focus:border-primary"
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-600 font-medium animate-slideDown">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Phone & Guests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-1" />
                  Phone Number <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all ${
                    errors.phone ? "border-red-400 focus:border-red-500" : "border-borderColor focus:border-primary"
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-600 font-medium animate-slideDown">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  Number of Guests <span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full rounded-lg border border-borderColor bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary transition-all cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                  <option value="12">10+ Guests</option>
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Booking Date <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                  }}
                  className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all cursor-pointer ${
                    errors.date ? "border-red-400 focus:border-red-500" : "border-borderColor focus:border-primary"
                  }`}
                />
                {errors.date && (
                  <p className="text-[11px] text-red-600 font-medium animate-slideDown">{errors.date}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Booking Time <span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    if (errors.time) setErrors((prev) => ({ ...prev, time: undefined }));
                  }}
                  className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all cursor-pointer ${
                    errors.time ? "border-red-400 focus:border-red-500" : "border-borderColor focus:border-primary"
                  }`}
                >
                  {timeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p className="text-[11px] text-red-600 font-medium animate-slideDown">{errors.time}</p>
                )}
              </div>
            </div>

            {/* Seating Preference */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-textMuted">
                Seating Preference
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSeatingPreference("indoor")}
                  className={`flex items-center justify-center space-x-2.5 rounded-xl border-2 p-4 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    seatingPreference === "indoor"
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-borderColor bg-background text-textMuted hover:border-primary/30"
                  }`}
                >
                  <Armchair className="h-5 w-5" />
                  <span className="text-sm font-semibold">Indoor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSeatingPreference("outdoor")}
                  className={`flex items-center justify-center space-x-2.5 rounded-xl border-2 p-4 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    seatingPreference === "outdoor"
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-borderColor bg-background text-textMuted hover:border-primary/30"
                  }`}
                >
                  <TreePine className="h-5 w-5" />
                  <span className="text-sm font-semibold">Outdoor</span>
                </button>
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-textMuted flex items-center">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                Special Requests
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="E.g. Table near the window, high-chair for a baby, anniversary setup..."
                rows={3}
                className="w-full rounded-lg border border-borderColor bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full flex items-center justify-center space-x-2 rounded-full bg-primary hover:bg-primary-hover disabled:bg-neutral-300 disabled:cursor-not-allowed text-white text-sm font-semibold py-3.5 shadow-md transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] focus:outline-none"
            >
              {submitLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Booking...</span>
                </>
              ) : (
                <span>Confirm Booking</span>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onBookAnother={() => {
          setShowConfirmModal(false);
          resetForm();
        }}
        confirmation={confirmation}
      />

      <Footer />
    </div>
  );
}
