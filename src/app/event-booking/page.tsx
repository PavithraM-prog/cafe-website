"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toast, ToastType } from "@/components/ui/Toast";
import { BookingConfirmationModal } from "@/components/BookingConfirmationModal";
import { submitEventBooking, BookingConfirmation } from "@/services/bookingService";
import {
  eventTypes,
  eventPackages,
  decorationThemes,
  foodPackageOptions,
} from "@/data/eventsData";
import {
  Cake,
  Heart,
  Briefcase,
  Baby,
  Music,
  Users,
  User,
  Mail,
  Phone,
  Calendar,
  Palette,
  UtensilsCrossed,
  MessageSquare,
  Loader2,
  Check,
  Star,
  Sparkles,
  Crown,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Map icon names from data to components
const iconMap: Record<string, React.ReactNode> = {
  Cake: <Cake className="h-6 w-6" />,
  Heart: <Heart className="h-6 w-6" />,
  Briefcase: <Briefcase className="h-6 w-6" />,
  Baby: <Baby className="h-6 w-6" />,
  Music: <Music className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
};

const tierIcons: Record<string, React.ReactNode> = {
  basic: <Star className="h-5 w-5 text-accent" />,
  premium: <Sparkles className="h-5 w-5 text-accent" />,
  luxury: <Crown className="h-5 w-5 text-accent" />,
};

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  guests?: string;
  eventDate?: string;
  selectedPackage?: string;
  eventType?: string;
}

const parseDateString = (dateStr: string): Date | null => {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

export default function EventBookingPage() {
  // Selection state
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("10");
  const [eventDate, setEventDate] = useState("");
  const [decorationTheme, setDecorationTheme] = useState(decorationThemes[0]);
  const [foodPackage, setFoodPackage] = useState(foodPackageOptions[0]);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const selectedEvent = eventTypes.find((e) => e.id === selectedEventType);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!selectedEventType) {
      newErrors.eventType = "Please select an event type";
    }

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/.test(phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Date validation
    if (!eventDate) {
      newErrors.eventDate = "Event date is required";
    } else {
      const sel = new Date(eventDate);
      if (isNaN(sel.getTime())) {
        newErrors.eventDate = "Please select a valid date";
      } else {
        const tod = new Date();
        tod.setHours(0, 0, 0, 0);
        if (sel < tod) newErrors.eventDate = "Please select a future date";
      }
    }

    // Guest validation
    const guestNum = parseInt(guests);
    if (isNaN(guestNum)) {
      newErrors.guests = "Guests count must be a number";
    } else {
      const min = selectedEvent?.minGuests || 5;
      const max = selectedEvent?.maxGuests || 60;
      if (guestNum < min) {
        newErrors.guests = `Minimum guests for this event is ${min}`;
      } else if (guestNum > max) {
        newErrors.guests = `Maximum guests for this event is ${max}`;
      }
    }

    if (!selectedPackage) newErrors.selectedPackage = "Please select a package";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setGuests("10");
    setEventDate("");
    setDecorationTheme(decorationThemes[0]);
    setFoodPackage(foodPackageOptions[0]);
    setAdditionalNotes("");
    setSelectedPackage("");
    setSelectedEventType(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setToast({ message: "Please resolve the errors in the form.", type: "error" });
      return;
    }

    try {
      setSubmitLoading(true);

      const parsedDate = parseDateString(eventDate);
      const formattedDateForDb = parsedDate
        ? `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`
        : eventDate;

      const result = await submitEventBooking({
        name,
        email,
        phone,
        eventType: selectedEvent?.name || "",
        guests: parseInt(guests),
        eventDate: formattedDateForDb,
        decorationTheme,
        foodPackage,
        selectedPackage,
        additionalNotes,
      });

      setConfirmation(result);
      setShowConfirmModal(true);
    } catch (err) {
      console.error("Error submitting event booking:", err);
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        tagline="Celebrate With Us"
        title="Event Booking"
        description="From birthdays to corporate meetings, we make every event unforgettable with customized packages and a warm ambience."
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* ── Event Type Selection Section ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-12 max-w-xl mx-auto">
          <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-[#FFF3E3] dark:bg-[#2D1C19] px-3.5 py-1.5 rounded-full border border-[#E0D4C5]">
            Occasions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Choose Your Event Type
          </h2>
          <p className="text-xs sm:text-sm text-textMuted dark:text-neutral-400 font-light leading-relaxed">
            Select the type of event you'd like to host at our café to unlock customized packages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventTypes.map((event) => {
            const isSelected = selectedEventType === event.id;
            return (
              <motion.button
                key={event.id}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedEventType(event.id);
                  // Scroll to form
                  setTimeout(() => {
                    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }}
                className={`group relative flex flex-col items-start rounded-3xl border-2 p-6 text-left transition-all overflow-hidden h-64 justify-between ${
                  isSelected
                    ? "border-accent bg-[#FFF3E3]/40 dark:bg-[#2D1C19]/20 shadow-md shadow-accent/10"
                    : "border-[#E0D4C5]/60 bg-white dark:bg-[#281715]/45 hover:border-accent/40"
                }`}
              >
                {/* Large Background image (zoom on hover) */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={event.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-20 dark:opacity-10 group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                </div>

                <div className="relative z-10 space-y-2">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                      isSelected
                        ? "bg-[#3E2723] text-white dark:bg-accent dark:text-[#1B100E]"
                        : "bg-[#FFF3E3] dark:bg-[#2D1C19] text-primary"
                    }`}
                  >
                    {iconMap[event.icon]}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-foreground pt-2">
                    {event.name}
                  </h3>
                  <p className="text-xs text-textMuted dark:text-neutral-400 leading-relaxed font-light line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <div className="relative z-10 flex items-center text-[10px] font-bold text-accent pt-1">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>
                    {event.minGuests} - {event.maxGuests} guests maximum
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[#3E2723] shadow-md border border-white/20">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ── Event Packages Section ── */}
      <AnimatePresence>
        {selectedEventType && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#FFF3E3]/40 dark:bg-transparent border-y border-[#E0D4C5]/30 py-16 overflow-hidden"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-2 mb-12 max-w-xl mx-auto">
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  Select Your Package
                </h2>
                <p className="text-xs sm:text-sm text-textMuted dark:text-neutral-400 font-light">
                  Choose a tailored package tier containing gourmet food options and decor.
                </p>
                {errors.selectedPackage && (
                  <p className="text-[10px] text-red-600 font-bold animate-pulse">
                    {errors.selectedPackage}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {eventPackages.map((pkg) => {
                  const isSelected = selectedPackage === pkg.name;
                  return (
                    <motion.button
                      key={pkg.id}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedPackage(pkg.name);
                        if (errors.selectedPackage) {
                          setErrors((prev) => ({ ...prev, selectedPackage: undefined }));
                        }
                      }}
                      className={`relative flex flex-col rounded-3xl border-2 p-6 text-left transition-all ${
                        isSelected
                          ? "border-accent bg-white dark:bg-[#281715]/40 shadow-xl shadow-accent/5"
                          : "border-[#E0D4C5]/60 bg-white dark:bg-[#281715]/25 hover:border-accent/40"
                      }`}
                    >
                      {/* Popular Badge */}
                      {pkg.popular && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                          <span className="inline-flex items-center space-x-1 rounded-full bg-accent px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-widest text-[#FFF8F0] dark:text-[#1B100E] shadow-md">
                            <Sparkles className="h-3 w-3" />
                            <span>Most Popular</span>
                          </span>
                        </div>
                      )}

                      <div className="space-y-4 flex-1">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                              isSelected
                                ? "bg-accent text-[#3E2723]"
                                : "bg-[#FFF3E3] dark:bg-[#2D1C19] text-primary"
                            }`}
                          >
                            {tierIcons[pkg.tier]}
                          </div>
                          <div>
                            <h3 className="font-serif text-base font-bold text-foreground">
                              {pkg.name}
                            </h3>
                            <span className="text-xl font-extrabold text-primary dark:text-accent font-sans">
                              ₹{pkg.price.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <ul className="space-y-2.5 pt-4 border-t border-[#E0D4C5]/30">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-start space-x-2 text-xs text-textMuted dark:text-neutral-300">
                              <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              <span className="font-light">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {isSelected && (
                        <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[#3E2723] shadow-md border border-white/20">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Event Booking Form ── */}
      <AnimatePresence>
        {selectedEventType && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            id="booking-form" 
            className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16"
          >
            <div className="glass border border-borderColor/40 p-6 sm:p-10 rounded-[32px] shadow-xl space-y-8 relative">
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2.5 text-accent">
                  {iconMap[selectedEvent?.icon || "Cake"]}
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Book {selectedEvent?.name}
                  </h2>
                </div>
                <p className="text-xs text-textMuted dark:text-neutral-400">
                  Fill in your custom details and we'll craft an unforgettable event menu.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                
                {/* Floating Inputs: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Name Input */}
                  <div className="space-y-1">
                    <div className={`relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 px-4 py-3 transition-all flex items-center ${
                      errors.name 
                        ? "border-red-400 focus-within:border-red-500" 
                        : "border-borderColor/40 focus-within:border-accent"
                    }`}>
                      <User className="h-4.5 w-4.5 text-textMuted dark:text-neutral-500 mr-2.5 shrink-0" />
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                          }}
                          className="peer w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-transparent pt-2.5"
                          placeholder="Your Name"
                        />
                        <label className={`absolute left-0 top-0.5 pointer-events-none transition-all duration-200 text-xs text-textMuted/65 font-bold uppercase tracking-wider ${
                          name ? "-translate-y-2 text-[9px] text-accent" : "peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-xs peer-focus:-translate-y-2 peer-focus:text-[9px] peer-focus:text-accent"
                        }`}>
                          Full Name *
                        </label>
                      </div>
                    </div>
                    {errors.name && (
                      <p className="text-[10px] text-red-600 font-bold pl-2.5 pt-0.5">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <div className={`relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 px-4 py-3 transition-all flex items-center ${
                      errors.email 
                        ? "border-red-400 focus-within:border-red-500" 
                        : "border-[#E0D4C5]/40 focus-within:border-accent"
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
                    {errors.email && (
                      <p className="text-[10px] text-red-600 font-bold pl-2.5 pt-0.5">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone & Guests Count Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Phone Input */}
                  <div className="space-y-1">
                    <div className={`relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 px-4 py-3 transition-all flex items-center ${
                      errors.phone 
                        ? "border-red-400 focus-within:border-red-500" 
                        : "border-[#E0D4C5]/40 focus-within:border-accent"
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
                    {errors.phone && (
                      <p className="text-[10px] text-red-600 font-bold pl-2.5 pt-0.5">{errors.phone}</p>
                    )}
                  </div>

                  {/* Guests Input */}
                  <div className="space-y-1">
                    <div className={`relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 px-4 py-3 transition-all flex items-center ${
                      errors.guests 
                        ? "border-red-400 focus-within:border-red-500" 
                        : "border-[#E0D4C5]/40 focus-within:border-accent"
                    }`}>
                      <Users className="h-4.5 w-4.5 text-textMuted dark:text-neutral-500 mr-2.5 shrink-0" />
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={guests}
                          min={selectedEvent?.minGuests || 5}
                          max={selectedEvent?.maxGuests || 60}
                          onChange={(e) => {
                            setGuests(e.target.value);
                            if (errors.guests) setErrors((prev) => ({ ...prev, guests: undefined }));
                          }}
                          className="peer w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-transparent pt-2.5"
                          placeholder="Guests count"
                        />
                        <label className="absolute left-0 -translate-y-2 text-[9px] text-accent font-bold uppercase tracking-wider">
                          Guests ({selectedEvent?.minGuests}-{selectedEvent?.maxGuests}) *
                        </label>
                      </div>
                    </div>
                    {errors.guests && (
                      <p className="text-[10px] text-red-600 font-bold pl-2.5 pt-0.5">{errors.guests}</p>
                    )}
                  </div>
                </div>

                {/* Event Type & Date Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Event Type (Read Only) */}
                  <div className="space-y-1">
                    <div className="relative rounded-2xl border bg-secondary/40 dark:bg-[#2D1C19]/20 border-[#E0D4C5]/60 px-4 py-3 flex items-center h-[52px]">
                      {iconMap[selectedEvent?.icon || "Cake"] && (
                        <span className="text-accent shrink-0 mr-2">
                          {iconMap[selectedEvent?.icon || "Cake"]}
                        </span>
                      )}
                      <div className="flex-1">
                        <span className="block text-[8px] font-bold text-textMuted dark:text-neutral-500 uppercase tracking-widest leading-none">Occasion Type</span>
                        <span className="text-xs font-extrabold text-foreground leading-normal mt-0.5 block">{selectedEvent?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Date Input */}
                  <div className="space-y-1">
                    <div className={`relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 px-4 py-3 transition-all flex items-center ${
                      errors.eventDate 
                        ? "border-red-400 focus-within:border-red-500" 
                        : "border-[#E0D4C5]/40 focus-within:border-accent"
                    }`}>
                      <Calendar className="h-4.5 w-4.5 text-textMuted dark:text-neutral-500 mr-2.5 shrink-0" />
                      <div className="relative flex-1">
                        <input
                          type="date"
                          value={eventDate}
                          min={today}
                          onChange={(e) => {
                            setEventDate(e.target.value);
                            if (errors.eventDate) setErrors((prev) => ({ ...prev, eventDate: undefined }));
                          }}
                          className="peer w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-transparent pt-2.5 cursor-pointer"
                        />
                        <label className="absolute left-0 -translate-y-2 text-[9px] text-accent font-bold uppercase tracking-wider">
                          Event Date *
                        </label>
                      </div>
                    </div>
                    {errors.eventDate && (
                      <p className="text-[10px] text-red-600 font-bold pl-2.5 pt-0.5">{errors.eventDate}</p>
                    )}
                  </div>
                </div>

                {/* Decoration Theme & Food Package Selects */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Decor Theme Dropdown */}
                  <div className="space-y-1">
                    <div className="relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 border-[#E0D4C5]/40 focus-within:border-accent px-4 py-3 flex items-center">
                      <Palette className="h-4.5 w-4.5 text-textMuted dark:text-neutral-500 mr-2.5 shrink-0" />
                      <div className="relative flex-1">
                        <select
                          value={decorationTheme}
                          onChange={(e) => setDecorationTheme(e.target.value)}
                          className="peer w-full bg-transparent text-sm text-foreground focus:outline-none pt-2.5 cursor-pointer border-none"
                        >
                          {decorationThemes.map((theme) => (
                            <option key={theme} value={theme} className="bg-white dark:bg-[#1C100E] text-foreground">
                              {theme}
                            </option>
                          ))}
                        </select>
                        <label className="absolute left-0 -translate-y-2 text-[9px] text-accent font-bold uppercase tracking-wider">
                          Decor Theme
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Food Package Dropdown */}
                  <div className="space-y-1">
                    <div className="relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 border-[#E0D4C5]/40 focus-within:border-accent px-4 py-3 flex items-center">
                      <UtensilsCrossed className="h-4.5 w-4.5 text-textMuted dark:text-neutral-500 mr-2.5 shrink-0" />
                      <div className="relative flex-1">
                        <select
                          value={foodPackage}
                          onChange={(e) => setFoodPackage(e.target.value)}
                          className="peer w-full bg-transparent text-sm text-foreground focus:outline-none pt-2.5 cursor-pointer border-none"
                        >
                          {foodPackageOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-white dark:bg-[#1C100E] text-foreground">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <label className="absolute left-0 -translate-y-2 text-[9px] text-accent font-bold uppercase tracking-wider">
                          Gourmet Menu
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Notes Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-textMuted dark:text-neutral-400 uppercase tracking-widest flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1.5 text-accent" />
                    <span>Additional Setup Notes</span>
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Enter any themes, special cake sizes, or acoustic playlist preferences..."
                    rows={3}
                    className="w-full rounded-2xl border border-borderColor/60 dark:border-[#3E2723] bg-[#FFF8F0]/10 px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none transition-all resize-none font-light leading-relaxed"
                  />
                </div>

                {/* Package Price Summary Card */}
                {selectedPackage && (
                  <div className="flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/5 p-4 animate-slideDown">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4.5 w-4.5 text-accent stroke-[3]" />
                      <span className="text-xs font-bold text-foreground">
                        Selected: {selectedPackage}
                      </span>
                    </div>
                    <span className="text-lg font-extrabold text-primary dark:text-accent font-sans">
                      ₹
                      {(eventPackages.find((p) => p.name === selectedPackage)?.price || 0).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Submit Event Button */}
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
                      <span>Booking Event...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Event Booking</span>
                      <ChevronRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Selector Prompt */}
      {!selectedEventType && (
        <div className="text-center py-10 text-xs font-bold text-textMuted dark:text-neutral-500 uppercase tracking-widest">
          👆 Select an occasion type above to get started with your reservation.
        </div>
      )}

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
