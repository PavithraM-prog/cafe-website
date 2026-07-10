export interface EventType {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  image: string;
  minGuests: number;
  maxGuests: number;
}

export interface EventPackage {
  id: string;
  name: string;
  tier: "basic" | "premium" | "luxury";
  price: number;
  features: string[];
  popular?: boolean;
}

export const eventTypes: EventType[] = [
  {
    id: "evt-1",
    name: "Birthday Party",
    description: "Celebrate your special day with customized decorations, cake, and a joyful ambience.",
    icon: "Cake",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600",
    minGuests: 5,
    maxGuests: 50,
  },
  {
    id: "evt-2",
    name: "Anniversary",
    description: "Cherish your milestone with an intimate dining setup, flowers, and romantic vibes.",
    icon: "Heart",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=600",
    minGuests: 2,
    maxGuests: 30,
  },
  {
    id: "evt-3",
    name: "Corporate Meeting",
    description: "Professional venue with projector, Wi-Fi, and refreshments for your business needs.",
    icon: "Briefcase",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600",
    minGuests: 5,
    maxGuests: 40,
  },
  {
    id: "evt-4",
    name: "Baby Shower",
    description: "A warm, cozy celebration to welcome your little one with themed décor and treats.",
    icon: "Baby",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600",
    minGuests: 5,
    maxGuests: 30,
  },
  {
    id: "evt-5",
    name: "Live Music",
    description: "Enjoy an evening of live acoustic performances with great food and drinks.",
    icon: "Music",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=600",
    minGuests: 10,
    maxGuests: 60,
  },
  {
    id: "evt-6",
    name: "Family Gathering",
    description: "Bring the whole family together in our spacious, welcoming café for a memorable meal.",
    icon: "Users",
    image: "https://images.unsplash.com/photo-1529543544282-ea24407b5e90?auto=format&fit=crop&q=80&w=600",
    minGuests: 5,
    maxGuests: 40,
  },
];

export const eventPackages: EventPackage[] = [
  {
    id: "pkg-basic",
    name: "Basic Package",
    tier: "basic",
    price: 4999,
    features: [
      "Standard Decoration",
      "Standard Food Menu",
      "Background Music",
      "2 Hours Venue Access",
      "Basic Table Setup",
    ],
  },
  {
    id: "pkg-premium",
    name: "Premium Package",
    tier: "premium",
    price: 9999,
    popular: true,
    features: [
      "Premium Decoration",
      "DJ & Sound System",
      "Customized Cake",
      "Professional Photography",
      "Premium Food Menu",
      "4 Hours Venue Access",
      "Dedicated Event Host",
    ],
  },
  {
    id: "pkg-luxury",
    name: "Luxury Package",
    tier: "luxury",
    price: 19999,
    features: [
      "Premium Decoration",
      "Live Music Performance",
      "Professional Photography & Videography",
      "Customized Theme Setup",
      "Unlimited Buffet",
      "6 Hours Venue Access",
      "Dedicated Event Manager",
      "Welcome Drinks & Cocktails",
      "Party Favors for Guests",
    ],
  },
];

export const decorationThemes = [
  "Classic Elegant",
  "Rustic Bohemian",
  "Tropical Paradise",
  "Fairy Lights & Florals",
  "Minimalist Modern",
  "Vintage Charm",
  "Custom Theme",
];

export const foodPackageOptions = [
  "Standard Veg Menu",
  "Standard Non-Veg Menu",
  "Premium Veg Menu",
  "Premium Non-Veg Menu",
  "Unlimited Buffet (Veg)",
  "Unlimited Buffet (Mixed)",
];
