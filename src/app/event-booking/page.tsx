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

// Map icon names from data to components
const iconMap: Record<string, React.ReactNode> = {
  Cake: <Cake className="h-7 w-7" />,
  Heart: <Heart className="h-7 w-7" />,
  Briefcase: <Briefcase className="h-7 w-7" />,
  Baby: <Baby className="h-7 w-7" />,
  Music: <Music className="h-7 w-7" />,
  Users: <Users className="h-7 w-7" />,
};

const tierIcons: Record<string, React.ReactNode> = {
  basic: <Star className="h-5 w-5" />,
  premium: <Sparkles className="h-5 w-5" />,
  luxury: <Crown className="h-5 w-5" />,
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

function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? null : date;
}

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
      newErrors.guests = "Number of guests must be a valid number";
    } else {
      const min = selectedEvent?.minGuests || 2;
      const max = selectedEvent?.maxGuests || 60;
      if (guestNum < min) {
        newErrors.guests = `Minimum guests for this event is ${min}`;
      } else if (guestNum > max) {
        newErrors.guests = `Maximum guests for this event is ${max}`;
      }
    }

    if (!selectedPackage) newErrors.selectedPackage = "Please select a package";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      console.error("Validation failed with errors:", newErrors);
    }

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
      setToast({ message: "Please fix the errors in the form.", type: "error" });
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

      <div className="page-enter">
        {/* ── Event Type Selection ── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-2 mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Choose Your Event Type
            </h2>
            <p className="text-sm text-textMuted">
              Select the type of event you&apos;d like to host at our café.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTypes.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  setSelectedEventType(event.id);
                  // Scroll to form after selecting
                  setTimeout(() => {
                    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className={`group relative flex flex-col items-start rounded-2xl border-2 p-6 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${selectedEventType === event.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-borderColor bg-cardBg hover:border-primary/40"
                  }`}
              >
                {/* Background image */}
                <div className="absolute inset-0 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity">
                  <Image
                    src={event.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="relative z-10 space-y-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${selectedEventType === event.id
                        ? "bg-primary text-white"
                        : "bg-secondary text-primary"
                      }`}
                  >
                    {iconMap[event.icon]}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-foreground">{event.name}</h3>
                  <p className="text-xs text-textMuted leading-relaxed">{event.description}</p>

                  <div className="flex items-center text-xs text-textMuted pt-1">
                    <Users className="h-3.5 w-3.5 mr-1 text-accent" />
                    <span>
                      {event.minGuests} - {event.maxGuests} guests
                    </span>
                  </div>
                </div>

                {selectedEventType === event.id && (
                  <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ── Event Packages ── */}
        {selectedEventType && (
          <section className="bg-secondary/30 border-y border-borderColor py-16 transition-all">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-2 mb-10">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  Select Your Package
                </h2>
                <p className="text-sm text-textMuted">
                  Choose the package that best suits your celebration.
                </p>
                {errors.selectedPackage && (
                  <p className="text-[11px] text-red-600 font-medium animate-slideDown">
                    {errors.selectedPackage}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {eventPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => {
                      setSelectedPackage(pkg.name);
                      if (errors.selectedPackage)
                        setErrors((prev) => ({ ...prev, selectedPackage: undefined }));
                    }}
                    className={`relative flex flex-col rounded-2xl border-2 p-6 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${selectedPackage === pkg.name
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-borderColor bg-cardBg hover:border-primary/40"
                      }`}
                  >
                    {/* Popular Badge */}
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center space-x-1 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                          <Sparkles className="h-3 w-3" />
                          <span>Most Popular</span>
                        </span>
                      </div>
                    )}

                    <div className="space-y-4 flex-1">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${selectedPackage === pkg.name
                              ? "bg-primary text-white"
                              : "bg-secondary text-primary"
                            }`}
                        >
                          {tierIcons[pkg.tier]}
                        </div>
                        <div>
                          <h3 className="font-serif text-lg font-bold text-foreground">
                            {pkg.name}
                          </h3>
                          <span className="text-xl font-bold text-primary font-sans">
                            ₹{pkg.price}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-2.5 pt-2">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start space-x-2 text-xs text-textMuted">
                            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {selectedPackage === pkg.name && (
                      <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Booking Form ── */}
        {selectedEventType && (
          <section id="booking-form" className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="border border-borderColor bg-cardBg p-6 sm:p-10 rounded-2xl shadow-sm space-y-8">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-primary">
                  {iconMap[selectedEvent?.icon || "Cake"]}
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Book {selectedEvent?.name}
                  </h2>
                </div>
                <p className="text-xs text-textMuted">
                  Fill in your details and we&apos;ll get back to you with a confirmation.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-textMuted flex items-center">
                      <User className="h-3.5 w-3.5 mr-1" />
                      Name <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="Your full name"
                      className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all ${errors.name
                          ? "border-red-400 focus:border-red-500"
                          : "border-borderColor focus:border-primary"
                        }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-600 font-medium animate-slideDown">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-textMuted flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      Email <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="you@example.com"
                      className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all ${errors.email
                          ? "border-red-400 focus:border-red-500"
                          : "border-borderColor focus:border-primary"
                        }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-600 font-medium animate-slideDown">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone & Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-textMuted flex items-center">
                      <Phone className="h-3.5 w-3.5 mr-1" />
                      Phone <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all ${errors.phone
                          ? "border-red-400 focus:border-red-500"
                          : "border-borderColor focus:border-primary"
                        }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-600 font-medium animate-slideDown">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-textMuted flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      Number of Guests <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="number"
                      value={guests}
                      min={selectedEvent?.minGuests || 2}
                      max={selectedEvent?.maxGuests || 60}
                      onChange={(e) => {
                        setGuests(e.target.value);
                        if (errors.guests) setErrors((prev) => ({ ...prev, guests: undefined }));
                      }}
                      className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all ${errors.guests
                          ? "border-red-400 focus:border-red-500"
                          : "border-borderColor focus:border-primary"
                        }`}
                    />
                    {errors.guests && (
                      <p className="text-[11px] text-red-600 font-medium animate-slideDown">
                        {errors.guests}
                      </p>
                    )}
                  </div>
                </div>

                {/* Event Type (pre-selected) & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-textMuted">
                      Event Type
                    </label>
                    <div className="flex items-center space-x-2 rounded-lg border border-borderColor bg-secondary/30 px-4 py-2.5 text-sm text-foreground">
                      {iconMap[selectedEvent?.icon || "Cake"] && (
                        <span className="text-primary scale-75">
                          {iconMap[selectedEvent?.icon || "Cake"]}
                        </span>
                      )}
                      <span className="font-medium">{selectedEvent?.name}</span>
                    </div>
                    <input type="hidden" name="eventType" value={selectedEvent?.name || ""} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-textMuted flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Event Date <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      min={today}
                      onChange={(e) => {
                        setEventDate(e.target.value);
                        if (errors.eventDate)
                          setErrors((prev) => ({ ...prev, eventDate: undefined }));
                      }}
                      className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all cursor-pointer ${errors.eventDate
                          ? "border-red-400 focus:border-red-500"
                          : "border-borderColor focus:border-primary"
                        }`}
                    />
                    {errors.eventDate && (
                      <p className="text-[11px] text-red-600 font-medium animate-slideDown">
                        {errors.eventDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Decoration Theme & Food Package */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-textMuted flex items-center">
                      <Palette className="h-3.5 w-3.5 mr-1" />
                      Decoration Theme
                    </label>
                    <select
                      value={decorationTheme}
                      onChange={(e) => setDecorationTheme(e.target.value)}
                      className="w-full rounded-lg border border-borderColor bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary transition-all cursor-pointer"
                    >
                      {decorationThemes.map((theme) => (
                        <option key={theme} value={theme}>
                          {theme}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-textMuted flex items-center">
                      <UtensilsCrossed className="h-3.5 w-3.5 mr-1" />
                      Food Package
                    </label>
                    <select
                      value={foodPackage}
                      onChange={(e) => setFoodPackage(e.target.value)}
                      className="w-full rounded-lg border border-borderColor bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary transition-all cursor-pointer"
                    >
                      {foodPackageOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-textMuted flex items-center">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Additional Notes
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any special requirements or details about your event..."
                    rows={3}
                    className="w-full rounded-lg border border-borderColor bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary transition-all resize-none"
                  />
                </div>

                {/* Selected Package Summary */}
                {selectedPackage && (
                  <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-4">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        {selectedPackage}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-primary font-sans">
                      ₹
                      {eventPackages.find((p) => p.name === selectedPackage)?.price || 0}
                    </span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full flex items-center justify-center space-x-2 rounded-full bg-primary hover:bg-primary-hover disabled:bg-neutral-300 disabled:cursor-not-allowed text-white text-sm font-semibold py-3.5 shadow-md transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] focus:outline-none"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Book Event</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Prompt to select event if none selected */}
        {!selectedEventType && (
          <div className="text-center py-8 text-sm text-textMuted">
            <p>👆 Select an event type above to get started with your booking.</p>
          </div>
        )}
      </div>

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
