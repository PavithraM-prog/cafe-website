export interface Booking {
  id: string;
  bookingType: "Table Booking" | "Event Booking";
  date: string;
  time: string;
  guests: number;
  status: "Pending" | "Confirmed" | "Cancelled";
  name: string;
  email: string;
  phone: string;
  // Table booking specific
  seatingPreference?: string;
  specialRequests?: string;
  // Event booking specific
  eventType?: string;
  packageName?: string;
  decorationTheme?: string;
  foodPackage?: string;
  additionalNotes?: string;
}

export const mockBookings: Booking[] = [
  {
    id: "BK-20260701",
    bookingType: "Table Booking",
    date: "2026-07-15",
    time: "7:00 PM",
    guests: 4,
    status: "Confirmed",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    seatingPreference: "Indoor",
    specialRequests: "Window seat preferred, birthday celebration",
  },
  {
    id: "BK-20260702",
    bookingType: "Event Booking",
    date: "2026-07-20",
    time: "6:00 PM",
    guests: 25,
    status: "Pending",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543",
    eventType: "Birthday Party",
    packageName: "Premium Package",
    decorationTheme: "Fairy Lights & Florals",
    foodPackage: "Premium Non-Veg Menu",
    additionalNotes: "Need a DJ and a customized cake for a 30th birthday party.",
  },
  {
    id: "BK-20260703",
    bookingType: "Table Booking",
    date: "2026-07-10",
    time: "12:00 PM",
    guests: 2,
    status: "Cancelled",
    name: "Mike Wilson",
    email: "mike@example.com",
    phone: "+1 (555) 456-7890",
    seatingPreference: "Outdoor",
    specialRequests: "Anniversary lunch",
  },
  {
    id: "BK-20260704",
    bookingType: "Event Booking",
    date: "2026-08-05",
    time: "10:00 AM",
    guests: 15,
    status: "Confirmed",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 321-0987",
    eventType: "Corporate Meeting",
    packageName: "Basic Package",
    decorationTheme: "Minimalist Modern",
    foodPackage: "Standard Veg Menu",
    additionalNotes: "Need projector and whiteboard setup.",
  },
  {
    id: "BK-20260705",
    bookingType: "Table Booking",
    date: "2026-07-25",
    time: "8:00 PM",
    guests: 6,
    status: "Pending",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 (555) 654-3210",
    seatingPreference: "Indoor",
    specialRequests: "Family dinner, need a high chair for toddler.",
  },
];
