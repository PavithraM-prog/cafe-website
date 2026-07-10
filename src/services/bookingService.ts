/**
 * Booking Service — API service layer with mock implementations.
 * Replace mock logic with actual API calls when backend is ready.
 */

import { Booking, mockBookings } from "@/data/bookingsData";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate a random booking ID
const generateBookingId = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `BK-${dateStr}-${rand}`;
};

export interface TableBookingPayload {
  fullName: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  seatingPreference: string;
  specialRequests: string;
}

export interface EventBookingPayload {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  guests: number;
  eventDate: string;
  decorationTheme: string;
  foodPackage: string;
  selectedPackage: string;
  additionalNotes: string;
}

export interface BookingConfirmation {
  bookingId: string;
  bookingType: string;
  date: string;
  time: string;
  guests: number;
  status: string;
}

/**
 * Submit a table booking request.
 * TODO: Replace with actual POST /api/bookings/table
 */
export async function submitTableBooking(
  data: TableBookingPayload
): Promise<BookingConfirmation> {
  await delay(1200); // Simulate network delay

  const confirmation: BookingConfirmation = {
    bookingId: generateBookingId(),
    bookingType: "Table Booking",
    date: data.date,
    time: data.time,
    guests: data.guests,
    status: "Pending",
  };

  return confirmation;
}

/**
 * Submit an event booking request.
 * TODO: Replace with actual POST /api/bookings/event
 */
export async function submitEventBooking(
  data: EventBookingPayload
): Promise<BookingConfirmation> {
  await delay(1500); // Simulate network delay

  const confirmation: BookingConfirmation = {
    bookingId: generateBookingId(),
    bookingType: "Event Booking",
    date: data.eventDate,
    time: "To be confirmed",
    guests: data.guests,
    status: "Pending",
  };

  return confirmation;
}

/**
 * Fetch all bookings for the current user.
 * TODO: Replace with actual GET /api/bookings/my
 */
export async function getMyBookings(): Promise<Booking[]> {
  await delay(800); // Simulate network delay
  return [...mockBookings];
}

/**
 * Cancel a booking by ID.
 * TODO: Replace with actual PATCH /api/bookings/:id/cancel
 */
export async function cancelBooking(bookingId: string): Promise<boolean> {
  await delay(600); // Simulate network delay
  // In a real app this would call the API
  return true;
}

/**
 * Submit a contact form message.
 * TODO: Replace with actual POST /api/contact
 */
export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  await delay(1000);
  return true;
}
