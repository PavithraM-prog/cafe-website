/**
 * Booking Service — API service layer with mock implementations.
 * Replace mock logic with actual API calls when backend is ready.
 */

import { Booking, mockBookings } from "@/data/bookingsData";

// Resolve immediately to eliminate latency
const delay = (ms: number) => Promise.resolve();

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
 */
export async function submitTableBooking(
  data: TableBookingPayload
): Promise<BookingConfirmation> {
  const res = await fetch("/api/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      guests: data.guests,
      date: data.date,
      time: data.time,
      note: data.specialRequests || "",
      type: "TABLE",
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to submit table booking");
  }

  const result = await res.json();
  const reservation = result.reservation;

  return {
    bookingId: reservation.id,
    bookingType: "Table Booking",
    date: reservation.date,
    time: reservation.time,
    guests: reservation.guests,
    status: reservation.status.charAt(0) + reservation.status.slice(1).toLowerCase(),
  };
}

/**
 * Submit an event booking request.
 */
export async function submitEventBooking(
  data: EventBookingPayload
): Promise<BookingConfirmation> {
  const note = `Event Type: ${data.eventType}
Package: ${data.selectedPackage}
Theme: ${data.decorationTheme}
Food Package: ${data.foodPackage}
Additional Notes: ${data.additionalNotes || "None"}`;

  const res = await fetch("/api/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      guests: data.guests,
      date: data.eventDate,
      time: "To be confirmed",
      note: note,
      type: "EVENT",
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to submit event booking");
  }

  const result = await res.json();
  const reservation = result.reservation;

  return {
    bookingId: reservation.id,
    bookingType: "Event Booking",
    date: reservation.date,
    time: reservation.time,
    guests: reservation.guests,
    status: reservation.status.charAt(0) + reservation.status.slice(1).toLowerCase(),
  };
}

// Helper to parse event details from note field
function parseEventNotes(note: string) {
  const result: any = {};
  if (!note) return result;
  
  const lines = note.split("\n");
  for (const line of lines) {
    if (line.startsWith("Event Type: ")) {
      result.eventType = line.replace("Event Type: ", "").trim();
    } else if (line.startsWith("Package: ")) {
      result.packageName = line.replace("Package: ", "").trim();
    } else if (line.startsWith("Theme: ")) {
      result.decorationTheme = line.replace("Theme: ", "").trim();
    } else if (line.startsWith("Food Package: ")) {
      result.foodPackage = line.replace("Food Package: ", "").trim();
    } else if (line.startsWith("Additional Notes: ")) {
      result.additionalNotes = line.replace("Additional Notes: ", "").trim();
    }
  }
  return result;
}

/**
 * Fetch all bookings for the current user from the database.
 */
export async function getMyBookings(): Promise<Booking[]> {
  const res = await fetch("/api/reservations");
  if (!res.ok) {
    throw new Error("Failed to load bookings");
  }
  const data = await res.json();
  
  return data.reservations.map((r: any) => ({
    id: r.id,
    bookingType: r.type === "EVENT" ? "Event Booking" : "Table Booking",
    date: r.date,
    time: r.time,
    guests: r.guests,
    status: (r.status.charAt(0) + r.status.slice(1).toLowerCase()) as any,
    name: r.name,
    email: r.email,
    phone: r.phone,
    ...(r.type === "EVENT" ? parseEventNotes(r.note) : { specialRequests: r.note }),
  }));
}

/**
 * Cancel a booking by ID.
 */
export async function cancelBooking(bookingId: string): Promise<boolean> {
  await delay(600); // Simulate network delay
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
