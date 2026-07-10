"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Toast, ToastType } from "@/components/ui/Toast";
import { BookingCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { getMyBookings, cancelBooking } from "@/services/bookingService";
import { Booking } from "@/data/bookingsData";
import {
  Calendar,
  Clock,
  Users,
  Hash,
  Tag,
  Eye,
  X,
  MapPin,
  Mail,
  Phone,
  Armchair,
  MessageSquare,
  Palette,
  UtensilsCrossed,
  Package,
  AlertTriangle,
} from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Detail modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Cancel confirmation
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data);
    } catch {
      setToast({ message: "Failed to load bookings.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleCancelClick = (bookingId: string) => {
    setCancelTarget(bookingId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      setCancelLoading(true);
      const success = await cancelBooking(cancelTarget);
      if (success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === cancelTarget ? { ...b, status: "Cancelled" as const } : b))
        );
        setToast({ message: "Booking cancelled successfully.", type: "success" });
      }
    } catch {
      setToast({ message: "Failed to cancel booking.", type: "error" });
    } finally {
      setCancelLoading(false);
      setShowCancelModal(false);
      setCancelTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        tagline="Your Reservations"
        title="My Bookings"
        description="View, manage, and track all your table and event bookings in one place."
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 page-enter">
        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && bookings.length === 0 && (
          <div className="text-center py-20 space-y-3 border border-dashed border-borderColor rounded-2xl bg-secondary/10">
            <Calendar className="h-12 w-12 text-textMuted mx-auto" />
            <p className="font-serif text-lg font-bold text-foreground">No Bookings Yet</p>
            <p className="text-xs text-textMuted max-w-sm mx-auto">
              You haven&apos;t made any bookings yet. Book a table or plan an event to get started!
            </p>
          </div>
        )}

        {/* Bookings Grid */}
        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-borderColor bg-cardBg p-5 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Hash className="h-3.5 w-3.5 text-accent" />
                      <span className="font-mono text-xs font-bold text-primary">{booking.id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tag className="h-3.5 w-3.5 text-textMuted" />
                      <span className="text-sm font-semibold text-foreground">{booking.bookingType}</span>
                    </div>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 text-xs text-textMuted">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="h-3.5 w-3.5 text-accent" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Users className="h-3.5 w-3.5 text-accent" />
                    <span>{booking.guests} Guests</span>
                  </div>
                  {booking.eventType && (
                    <div className="flex items-center space-x-1.5">
                      <Tag className="h-3.5 w-3.5 text-accent" />
                      <span>{booking.eventType}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-borderColor/60">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="flex items-center space-x-1.5 rounded-full border border-borderColor px-4 py-2 text-xs font-semibold text-textMuted hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Details</span>
                  </button>
                  {booking.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancelClick(booking.id)}
                      className="flex items-center space-x-1.5 rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Cancel Booking</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Booking Details"
        maxWidth="max-w-md"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-primary">{selectedBooking.id}</span>
              <StatusBadge status={selectedBooking.status} />
            </div>

            <div className="rounded-xl border border-borderColor bg-secondary/20 p-4 space-y-3">
              <DetailRow icon={<Tag className="h-4 w-4 text-accent" />} label="Type" value={selectedBooking.bookingType} />
              <DetailRow icon={<Calendar className="h-4 w-4 text-accent" />} label="Date" value={selectedBooking.date} />
              <DetailRow icon={<Clock className="h-4 w-4 text-accent" />} label="Time" value={selectedBooking.time} />
              <DetailRow icon={<Users className="h-4 w-4 text-accent" />} label="Guests" value={`${selectedBooking.guests}`} />
              <DetailRow icon={<Mail className="h-4 w-4 text-accent" />} label="Email" value={selectedBooking.email} />
              <DetailRow icon={<Phone className="h-4 w-4 text-accent" />} label="Phone" value={selectedBooking.phone} />

              {selectedBooking.seatingPreference && (
                <DetailRow icon={<Armchair className="h-4 w-4 text-accent" />} label="Seating" value={selectedBooking.seatingPreference} />
              )}
              {selectedBooking.eventType && (
                <DetailRow icon={<Tag className="h-4 w-4 text-accent" />} label="Event" value={selectedBooking.eventType} />
              )}
              {selectedBooking.packageName && (
                <DetailRow icon={<Package className="h-4 w-4 text-accent" />} label="Package" value={selectedBooking.packageName} />
              )}
              {selectedBooking.decorationTheme && (
                <DetailRow icon={<Palette className="h-4 w-4 text-accent" />} label="Theme" value={selectedBooking.decorationTheme} />
              )}
              {selectedBooking.foodPackage && (
                <DetailRow icon={<UtensilsCrossed className="h-4 w-4 text-accent" />} label="Food" value={selectedBooking.foodPackage} />
              )}
            </div>

            {(selectedBooking.specialRequests || selectedBooking.additionalNotes) && (
              <div className="rounded-xl border border-borderColor bg-cardBg p-3 space-y-1">
                <div className="flex items-center space-x-1 text-xs font-semibold text-textMuted">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Notes</span>
                </div>
                <p className="text-xs text-textMuted italic leading-relaxed">
                  {selectedBooking.specialRequests || selectedBooking.additionalNotes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        maxWidth="max-w-sm"
      >
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-foreground">Cancel Booking?</h3>
            <p className="text-xs text-textMuted">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowCancelModal(false)}
              className="flex-1 rounded-full border border-borderColor py-2.5 text-sm font-semibold text-textMuted hover:bg-secondary transition-colors"
            >
              Keep Booking
            </button>
            <button
              onClick={handleConfirmCancel}
              disabled={cancelLoading}
              className="flex-1 rounded-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
            >
              {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

// Helper component for detail rows
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 text-sm text-textMuted">
        {icon}
        <span className="font-semibold">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
