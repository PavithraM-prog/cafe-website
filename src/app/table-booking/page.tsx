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
  Sparkles,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  guests?: string;
  date?: string;
  time?: string;
}

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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [seatingPreference, setSeatingPreference] = useState("indoor");
  const [specialRequests, setSpecialRequests] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const today = new Date().toISOString().split("T")[0];

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
      setToast({ message: "Please resolve form validation errors.", type: "error" });
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
        description="Reserve your perfect table in advance. Whether it's a workspace afternoon, a cozy reading session, or a weekend coffee catch-up — we've got you covered."
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Booking Form Section */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Card (Glassmorphism + Framer Motion) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
          className="glass border border-borderColor/40 p-6 sm:p-10 rounded-[32px] shadow-xl space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full filter blur-2xl pointer-events-none" />
          
          <div className="space-y-1.5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Book Your Table</h2>
              <p className="text-xs text-textMuted dark:text-neutral-400">Secure your aromatic table reservation at Cozy Beans.</p>
            </div>
            <Sparkles className="w-6 h-6 text-accent shrink-0 animate-pulse hidden sm:block" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {/* Custom Floating Label Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div className="space-y-1">
                <div className={`relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 px-4 py-3 transition-all flex items-center ${
                  errors.fullName 
                    ? "border-red-400 focus-within:border-red-500" 
                    : "border-borderColor/40 focus-within:border-accent"
                }`}>
                  <User className="h-4.5 w-4.5 text-textMuted dark:text-neutral-500 mr-2.5 shrink-0" />
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                      }}
                      className="peer w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-transparent pt-2.5"
                      placeholder="Full Name"
                    />
                    <label className={`absolute left-0 top-0.5 pointer-events-none transition-all duration-200 text-xs text-textMuted/65 font-bold uppercase tracking-wider ${
                      fullName ? "-translate-y-2 text-[9px] text-accent" : "peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-xs peer-focus:-translate-y-2 peer-focus:text-[9px] peer-focus:text-accent"
                    }`}>
                      Full Name *
                    </label>
                  </div>
                </div>
                <AnimatePresence>
                  {errors.fullName && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-red-600 font-bold pl-2.5 pt-0.5"
                    >
                      {errors.fullName}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <div className={`relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 px-4 py-3 transition-all flex items-center ${
                  errors.email 
                    ? "border-red-400 focus-within:border-red-500" 
                    : "border-borderColor/40 focus-within:border-accent"
                }`}>
                  <Mail className="h-4.5 w-4.5 text-textMuted dark:text-neutral-500 mr-2.5 shrink-0" />
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      className="peer w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-transparent pt-2.5"
                      placeholder="Email Address"
                    />
                    <label className={`absolute left-0 top-0.5 pointer-events-none transition-all duration-200 text-xs text-textMuted/65 font-bold uppercase tracking-wider ${
                      email ? "-translate-y-2 text-[9px] text-accent" : "peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-xs peer-focus:-translate-y-2 peer-focus:text-[9px] peer-focus:text-accent"
                    }`}>
                      Email Address *
                    </label>
                  </div>
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-red-600 font-bold pl-2.5 pt-0.5"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Phone Number & Seating Preference Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Phone Input */}
              <div className="space-y-1">
                <div className={`relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 px-4 py-3 transition-all flex items-center ${
                  errors.phone 
                    ? "border-red-400 focus-within:border-red-500" 
                    : "border-borderColor/40 focus-within:border-accent"
                }`}>
                  <Phone className="h-4.5 w-4.5 text-textMuted dark:text-neutral-500 mr-2.5 shrink-0" />
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      className="peer w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-transparent pt-2.5"
                      placeholder="Phone Number"
                    />
                    <label className={`absolute left-0 top-0.5 pointer-events-none transition-all duration-200 text-xs text-textMuted/65 font-bold uppercase tracking-wider ${
                      phone ? "-translate-y-2 text-[9px] text-accent" : "peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-xs peer-focus:-translate-y-2 peer-focus:text-[9px] peer-focus:text-accent"
                    }`}>
                      Phone Number *
                    </label>
                  </div>
                </div>
                <AnimatePresence>
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-red-600 font-bold pl-2.5 pt-0.5"
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Seating Preference Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6F4E37] dark:text-[#E0D4C5] uppercase tracking-widest">
                  Seating Option
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSeatingPreference("indoor")}
                    className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      seatingPreference === "indoor"
                        ? "bg-accent border-accent text-[#3E2723] scale-[1.01] shadow-sm"
                        : "bg-white dark:bg-transparent border-[#E0D4C5]/50 text-textMuted hover:border-accent"
                    }`}
                  >
                    <Armchair className="w-4 h-4 shrink-0" />
                    <span>Indoor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeatingPreference("outdoor")}
                    className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      seatingPreference === "outdoor"
                        ? "bg-accent border-accent text-[#3E2723] scale-[1.01] shadow-sm"
                        : "bg-white dark:bg-transparent border-[#E0D4C5]/50 text-textMuted hover:border-accent"
                    }`}
                  >
                    <TreePine className="w-4 h-4 shrink-0" />
                    <span>Outdoor</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Circular Guest Pill Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-textMuted dark:text-neutral-400 uppercase tracking-widest flex items-center">
                <Users className="h-4 w-4 mr-1.5 text-accent" />
                <span>Number of Guests *</span>
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setGuests(n.toString())}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border transition-all cursor-pointer ${
                      guests === n.toString()
                        ? "bg-accent border-accent text-[#3E2723] scale-108 shadow-md shadow-accent/20"
                        : "bg-white dark:bg-transparent border-[#E0D4C5]/60 text-textMuted hover:border-accent/40"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setGuests("12")}
                  className={`px-4 h-10 rounded-full flex items-center justify-center font-bold text-xs border transition-all cursor-pointer ${
                    guests === "12"
                      ? "bg-accent border-accent text-[#3E2723] scale-108 shadow-md shadow-accent/20"
                      : "bg-white dark:bg-transparent border-[#E0D4C5]/60 text-textMuted hover:border-accent/40"
                  }`}
                >
                  10+ Guests
                </button>
              </div>
            </div>

            {/* Date & Time Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Date Input */}
              <div className="space-y-1">
                <div className={`relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 px-4 py-3 transition-all flex items-center ${
                  errors.date 
                    ? "border-red-400 focus-within:border-red-500" 
                    : "border-borderColor/40 focus-within:border-accent"
                }`}>
                  <Calendar className="h-4.5 w-4.5 text-textMuted dark:text-neutral-500 mr-2.5 shrink-0" />
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={date}
                      min={today}
                      onChange={(e) => {
                        setDate(e.target.value);
                        if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                      }}
                      className="peer w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-transparent pt-2.5 cursor-pointer"
                    />
                    <label className="absolute left-0 -translate-y-2 text-[9px] text-accent font-bold uppercase tracking-wider">
                      Booking Date *
                    </label>
                  </div>
                </div>
                <AnimatePresence>
                  {errors.date && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-red-600 font-bold pl-2.5 pt-0.5"
                    >
                      {errors.date}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Time Slots Selector */}
              <div className="space-y-1">
                <div className="relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 border-borderColor/40 focus-within:border-accent px-4 py-3 transition-all flex items-center">
                  <Clock className="h-4.5 w-4.5 text-textMuted dark:text-neutral-500 mr-2.5 shrink-0" />
                  <div className="relative flex-1">
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="peer w-full bg-transparent text-sm text-foreground focus:outline-none pt-2.5 cursor-pointer border-none"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value} className="bg-white dark:bg-[#1C100E] text-foreground">
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    <label className="absolute left-0 -translate-y-2 text-[9px] text-accent font-bold uppercase tracking-wider">
                      Booking Time *
                    </label>
                  </div>
                </div>
              </div>

            </div>

            {/* Special Requests */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-textMuted dark:text-neutral-400 uppercase tracking-widest flex items-center">
                <MessageSquare className="h-4 w-4 mr-1.5 text-accent" />
                <span>Special Requests</span>
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="E.g. Table near window, birthday decoration themes, etc."
                rows={3}
                className="w-full rounded-2xl border border-borderColor/60 dark:border-[#3E2723] bg-[#FFF8F0]/10 px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none transition-all resize-none font-light leading-relaxed"
              />
            </div>

            {/* Submit Button (Gradient + Glow) */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={submitLoading}
              className="w-full flex items-center justify-center space-x-2 rounded-full py-4 bg-primary dark:bg-accent hover:opacity-90 disabled:bg-neutral-300 disabled:dark:bg-neutral-800 disabled:cursor-not-allowed text-white dark:text-[#1B100E] text-sm font-extrabold uppercase tracking-widest shadow-lg transition-all focus:outline-none cursor-pointer"
            >
              {submitLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Reserving Table...</span>
                </>
              ) : (
                <>
                  <span>Confirm Table Booking</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
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
