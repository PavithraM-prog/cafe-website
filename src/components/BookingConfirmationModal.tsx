"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BookingConfirmation } from "@/services/bookingService";
import { CheckCircle, Calendar, Clock, Users, Hash, Tag } from "lucide-react";

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAnother: () => void;
  confirmation: BookingConfirmation | null;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  onBookAnother,
  confirmation,
}) => {
  if (!confirmation) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="text-center space-y-5">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-9 w-9 text-green-600" />
        </div>

        <div className="space-y-1.5">
          <h2 className="font-serif text-2xl font-bold text-foreground">Booking Confirmed!</h2>
          <p className="text-sm text-textMuted leading-relaxed">
            Your reservation request has been submitted successfully. We&apos;ll confirm it shortly.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="rounded-xl border border-borderColor bg-secondary/30 p-5 text-left space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-textMuted">
              <Hash className="h-4 w-4 text-accent" />
              <span className="font-semibold">Booking ID</span>
            </div>
            <span className="font-mono text-sm font-bold text-primary">{confirmation.bookingId}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-textMuted">
              <Tag className="h-4 w-4 text-accent" />
              <span className="font-semibold">Type</span>
            </div>
            <span className="text-sm font-medium text-foreground">{confirmation.bookingType}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-textMuted">
              <Calendar className="h-4 w-4 text-accent" />
              <span className="font-semibold">Date</span>
            </div>
            <span className="text-sm font-medium text-foreground">{confirmation.date}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-textMuted">
              <Clock className="h-4 w-4 text-accent" />
              <span className="font-semibold">Time</span>
            </div>
            <span className="text-sm font-medium text-foreground">{confirmation.time}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-textMuted">
              <Users className="h-4 w-4 text-accent" />
              <span className="font-semibold">Guests</span>
            </div>
            <span className="text-sm font-medium text-foreground">{confirmation.guests}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-borderColor/60">
            <span className="text-sm font-semibold text-textMuted">Status</span>
            <StatusBadge status={confirmation.status} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-borderColor py-2.5 text-sm font-semibold text-textMuted hover:bg-secondary transition-colors"
          >
            Close
          </button>
          <button
            onClick={onBookAnother}
            className="flex-1 rounded-full bg-primary hover:bg-primary-hover py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
          >
            Book Another
          </button>
        </div>
      </div>
    </Modal>
  );
};
