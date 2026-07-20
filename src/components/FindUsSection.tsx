"use client";

import React, { useEffect, useState } from "react";
import { 
  MapPin, 
  Coffee, 
  Navigation, 
  Phone, 
  ExternalLink, 
  Share2, 
  Clock, 
  Award, 
  CheckCircle, 
  Moon, 
  Sun, 
  Train, 
  Bus, 
  Car, 
  Accessibility 
} from "lucide-react";

// Cafe Coordinates
const CAFE_LAT = 13.0827;
const CAFE_LON = 80.1748;
const GOOGLE_MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=AKC+Mogappair+Nerkundram+Chennai+Tamil+Nadu+600107";

export default function FindUsSection() {
  // Day / Night transition state
  const [isNightMode, setIsNightMode] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [todayHours, setTodayHours] = useState("");
  const [visitorDistance, setVisitorDistance] = useState<string | null>(null);
  const [isShareSuccess, setIsShareSuccess] = useState(false);

  // 1. Calculate Open/Closed status and distance
  useEffect(() => {
    // Detect system time for Day/Night and Open/Closed status
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const day = now.getDay(); // 0 is Sunday, 6 is Saturday

    // Night Mode: 6 PM (18:00) to 6 AM (6:00)
    setIsNightMode(now.getHours() < 6 || now.getHours() >= 18);

    // Business Hours: Mon-Fri: 7 AM - 8 PM | Sat-Sun: 8 AM - 9 PM
    const isWeekend = day === 0 || day === 6;
    const openTime = isWeekend ? 8 : 7;
    const closeTime = isWeekend ? 21 : 20;

    setIsOpenNow(currentHour >= openTime && currentHour < closeTime);
    setTodayHours(isWeekend ? "8:00 AM - 9:00 PM" : "7:00 AM - 8:00 PM");

    // Geolocation distance
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: userLat, longitude: userLng } = position.coords;
          const distance = calculateHaversineDistance(userLat, userLng, CAFE_LAT, CAFE_LON);
          setVisitorDistance(`${distance.toFixed(1)} km away from you`);
        },
        (error) => {
          console.log("Geolocation error or blocked:", error.message);
        },
        { timeout: 6000 }
      );
    }
  }, []);

  const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 2. Share location handler
  const handleShareLocation = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Cozy Beans Cafe Location",
          text: "Come visit us at Cozy Beans Cafe in Chennai!",
          url: GOOGLE_MAPS_LINK,
        });
      } catch (err) {
        console.log("Sharing error:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(GOOGLE_MAPS_LINK);
        setIsShareSuccess(true);
        setTimeout(() => setIsShareSuccess(false), 2500);
      } catch (err) {
        console.log("Copy error:", err);
      }
    }
  };

  return (
    <section className="py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-borderColor/30 animate-fadeIn bg-transparent relative overflow-hidden">
      {/* Subtle Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-secondary/35 filter blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 filter blur-3xl -z-10 pointer-events-none" />

      {/* Entrance Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-secondary/80 dark:bg-secondary/15 px-3.5 py-1.5 rounded-full border border-borderColor/40 shadow-sm backdrop-blur-sm">
          VISIT US
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 leading-tight">
          Find Your Cozy Spot
        </h2>
        <p className="text-xs sm:text-sm text-textMuted leading-relaxed font-light">
          We are nestled in Chennai's heart, brewing comfort daily. Walk in, take a seat, and let the aroma lead you home.
        </p>
      </div>

      {/* Split Cards Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Dynamic Details Panel (Glassmorphism card) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl glass border border-borderColor/40 shadow-lg relative overflow-hidden space-y-6 animate-fade-in-up duration-500">
          
          {/* Top Badges Area */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-1.5 bg-[#FFF8E7] dark:bg-accent/10 border border-[#D9A441]/35 px-3 py-1 rounded-full text-[10px] font-bold text-accent">
              <Award className="w-3.5 h-3.5" />
              <span>⭐ Rated 4.9</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 px-3 py-1 rounded-full text-[10px] font-bold text-green-600 dark:text-green-400">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>📍 Verified Location</span>
            </div>
          </div>

          {/* Main Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">☕</span>
              <h3 className="font-serif text-xl font-bold text-primary dark:text-[#F6ECE2] leading-none">Cozy Beans Cafe</h3>
            </div>
            
            <p className="text-sm font-serif leading-relaxed text-[#7A635B] dark:text-[#B39D97] space-y-1.5">
              <span className="block font-bold">📍 Location Address:</span>
              <span className="block text-xs leading-normal">
                AKC, Mogappair, Nerkundram,<br />
                Chennai, Greater Chennai,<br />
                Tamil Nadu 600107, India
              </span>
            </p>

            {visitorDistance && (
              <p className="text-xs font-semibold text-accent flex items-center space-x-1 animate-pulse">
                <Navigation className="w-3 h-3 rotate-45" />
                <span>{visitorDistance}</span>
              </p>
            )}
          </div>

          {/* Dynamic Opening Hours Card */}
          <div className="bg-secondary/40 dark:bg-secondary/10 border border-borderColor/40 rounded-2xl p-4 flex items-center justify-between shadow-inner">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-textMuted dark:text-neutral-400 tracking-wider flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Today's Hours
              </p>
              <p className="text-xs font-bold text-foreground">{todayHours}</p>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${isOpenNow ? "bg-green-500 animate-ping" : "bg-red-500"}`} />
              <span className={`h-2.5 w-2.5 rounded-full absolute ${isOpenNow ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-[10px] font-extrabold uppercase tracking-widest pl-3">
                {isOpenNow ? (
                  <span className="text-green-600 dark:text-green-400">Open Now</span>
                ) : (
                  <span className="text-red-500">Closed</span>
                )}
              </span>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 rounded-xl bg-primary dark:bg-accent hover:opacity-90 text-white dark:text-[#1B100E] text-xs font-bold py-3 px-4 shadow-md transition-all hover:scale-[1.01]"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 rounded-xl bg-[#FFF8E7] dark:bg-[#1F1210] border border-[#E6DDD0] dark:border-[#2D1B18] hover:bg-[#F5EFE6] dark:hover:bg-[#2D1B18] text-[#4A2C2A] dark:text-[#F6ECE2] text-xs font-bold py-3 px-4 transition-all"
            >
              <ExternalLink className="w-4 h-4 text-accent" />
              <span>Open Google Maps</span>
            </a>
            <a
              href="tel:+15557892699"
              className="flex items-center justify-center space-x-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[#4A2C2A] dark:text-[#F6ECE2] text-xs font-bold py-3 px-4 transition-all"
            >
              <Phone className="w-4 h-4 text-primary dark:text-accent" />
              <span>Call Cafe</span>
            </a>
            <button
              onClick={handleShareLocation}
              className="flex items-center justify-center space-x-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[#4A2C2A] dark:text-[#F6ECE2] text-xs font-bold py-3 px-4 transition-all"
            >
              <Share2 className="w-4 h-4 text-primary dark:text-accent" />
              <span>{isShareSuccess ? "Link Copied!" : "Share Location"}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Google Map + How to Reach Card Container */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Interactive Map Iframe Container */}
          <div className="relative rounded-[24px] overflow-hidden shadow-xl border border-borderColor/40 h-[340px] group transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_12px_32px_rgba(74,44,42,0.18)] select-none">
            
            {/* Google Map iframe */}
            <iframe
              src="https://maps.google.com/maps?q=13.0827,80.1748&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Cozy Beans Café Interactive Map"
              className={`w-full h-full transition-all duration-500 group-hover:brightness-[1.08] ${
                isNightMode ? "brightness-[0.7] contrast-[1.05]" : "brightness-[0.95]"
              }`}
            />

            {/* Clickable Overlay Link covering map */}
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-30 cursor-pointer"
              title="Open location on Google Maps"
            />

            {/* Night Warm Golden Glow Lights Layer */}
            {isNightMode && (
              <div className="absolute inset-0 bg-amber-900/10 mix-blend-color-burn pointer-events-none z-10" />
            )}
            {isNightMode && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(217,164,65,0.25)_0%,transparent_60%)] pointer-events-none z-10 animate-pulse" />
            )}

            {/* Floating Coffee Bean Particles overlay (SVG) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
              {/* Particle 1 */}
              <div className="absolute top-[20%] left-[15%] text-accent/40 particle-floating-1">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-5 h-5">
                  <ellipse cx="50" cy="50" rx="35" ry="20" transform="rotate(-30, 50, 50)" />
                  <path d="M20,62 Q50,45 80,38" stroke="#FFF8E7" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              {/* Particle 2 */}
              <div className="absolute bottom-[30%] left-[80%] text-accent/30 particle-floating-2">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-4.5 h-4.5">
                  <ellipse cx="50" cy="50" rx="35" ry="20" transform="rotate(45, 50, 50)" />
                  <path d="M22,35 Q50,55 78,65" stroke="#FFF8E7" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              {/* Particle 3 */}
              <div className="absolute top-[65%] left-[25%] text-accent/35 particle-floating-3">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-5.5 h-5.5">
                  <ellipse cx="50" cy="50" rx="35" ry="20" transform="rotate(-60, 50, 50)" />
                  <path d="M15,65 Q50,45 85,35" stroke="#FFF8E7" stroke-width="6" fill="none" stroke-linecap="round" />
                </svg>
              </div>
            </div>

            {/* Day/Night Manual Quick Toggle Switch (Float Top Left) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsNightMode(!isNightMode);
              }}
              title={isNightMode ? "Switch to Daytime Map View" : "Switch to Night Map View"}
              className="absolute top-4 left-4 z-40 p-2.5 rounded-xl bg-white/90 dark:bg-[#1B100E]/90 border border-borderColor/40 shadow-md text-primary dark:text-[#F6ECE2] hover:scale-105 transition-all flex items-center justify-center cursor-pointer pointer-events-auto"
            >
              {isNightMode ? (
                <Sun className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>

            {/* Custom Location Overlay Pin + Steam Coffee Cup Icon */}
            <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none select-none">
              
              {/* Coffee Steam Lines */}
              <div className="flex justify-center space-x-1 mb-1.5">
                <span className="w-[1.5px] h-3 bg-accent/90 rounded-full steam-line steam-delay-1" />
                <span className="w-[1.5px] h-3 bg-accent/95 rounded-full steam-line" />
                <span className="w-[1.5px] h-3 bg-accent/90 rounded-full steam-line steam-delay-2" />
              </div>

              {/* Marker Pin and Coffee Cup Badge Group */}
              <div className="relative flex items-center justify-center">
                {/* Ripple pulse ring outer */}
                <div className="absolute w-12 h-12 bg-accent/35 rounded-full ripple-pulse" />
                <div className="absolute w-12 h-12 bg-accent/20 rounded-full ripple-pulse ripple-delay-1" />

                {/* Bouncing Pin Body */}
                <div className="relative pin-bounce bg-[#4A2C2A] dark:bg-[#D9A441] text-white dark:text-[#1B100E] px-3.5 py-2 rounded-2xl shadow-xl border border-white/20 flex items-center space-x-1.5">
                  <MapPin className="w-4.5 h-4.5 text-accent dark:text-[#4A2C2A] fill-accent/15 shrink-0" />
                  <Coffee className="w-3.5 h-3.5 shrink-0 animate-pulse text-[#FFF8E7] dark:text-[#1B100E]" />
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#FFF8E7] dark:text-[#1B100E]">COZY</span>
                </div>
              </div>
            </div>

            {/* Navigate Now Pulsing Button (Float Bottom Right) */}
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 z-40 bg-accent hover:bg-accent-hover text-white text-[11px] font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all pointer-events-auto cursor-pointer border border-white/20 select-none animate-pulse"
              style={{ animationDuration: '3s' }}
            >
              <Navigation className="w-3.5 h-3.5 rotate-45 text-white" />
              <span>Navigate Now</span>
            </a>
          </div>

          {/* transport guide list (How to Reach section) */}
          <div className="p-5 rounded-[24px] glass border border-borderColor/40 shadow-lg space-y-4">
            <h4 className="font-serif text-sm font-bold text-primary dark:text-[#F6ECE2] flex items-center space-x-2">
              <span>🚶</span>
              <span>How to Reach Cozy Beans</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-secondary/20 dark:bg-secondary/5">
                <Train className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground">Metro Transit</p>
                  <p className="text-[11px] text-textMuted dark:text-neutral-400 font-light">Koyambedu Metro Station (3.2 km away)</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-secondary/20 dark:bg-secondary/5">
                <Bus className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground">Bus Transit</p>
                  <p className="text-[11px] text-textMuted dark:text-neutral-400 font-light">Mogappair West Bus Terminus (600m away)</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-secondary/20 dark:bg-secondary/5">
                <Car className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground">Free Parking</p>
                  <p className="text-[11px] text-textMuted dark:text-neutral-400 font-light">Spacious parking & valet service available</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-secondary/20 dark:bg-secondary/5">
                <Accessibility className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground">Accessibility</p>
                  <p className="text-[11px] text-textMuted dark:text-neutral-400 font-light">Wheelchair friendly ramps & seating areas</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
