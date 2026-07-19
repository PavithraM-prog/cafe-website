import React from "react";
export const dynamic = "force-dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCachedSettings, getCachedMenu, getCachedApprovedReviews } from "@/lib/cache";
import HomeClient from "@/components/HomeClient";

async function getLandingData() {
  try {
    const settings = await getCachedSettings();
    const { products: allProducts } = await getCachedMenu();
    // take first 4 with availability and availablePieces > 0
    const products = allProducts
      .filter((p) => p.availability && p.availablePieces > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);

    const allApprovedReviews = await getCachedApprovedReviews();
    const reviews = allApprovedReviews.slice(0, 3);

    return { settings, products, reviews };
  } catch (error) {
    console.error("Error fetching landing data:", error);
    return {
      settings: {
        hero_title: "Escape into a Cozy Corner of Coffee & Comfort",
        hero_tagline: "Where every cup tells a story, and every moment feels like home.",
        opening_hours: "Mon - Fri: 7:00 AM - 8:00 PM | Sat - Sun: 8:00 AM - 9:00 PM",
        cafe_address: "AKC, Mogappair, Nerkundram, Chennai, Greater Chennai, Tamil Nadu 600107",
        cafe_phone: "+1 (555) 789-COZY",
        cafe_email: "hello@cozybeans.com",
      },
      products: [],
      reviews: [],
    };
  }
}

export default async function HomePage() {
  const { settings, products, reviews } = await getLandingData();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HomeClient settings={settings as any} products={products} reviews={reviews} />
      <Footer />
    </div>
  );
}
