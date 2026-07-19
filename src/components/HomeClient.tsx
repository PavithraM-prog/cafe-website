"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Coffee, 
  Calendar, 
  MapPin, 
  Phone, 
  Star, 
  Gift, 
  Clock, 
  Sparkles, 
  Heart, 
  Smile, 
  ChevronRight,
  Sparkle
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterForm } from "@/components/NewsletterForm";

interface HomeClientProps {
  settings: {
    hero_title: string;
    hero_tagline: string;
    opening_hours: string;
    cafe_address: string;
    cafe_phone: string;
    cafe_email: string;
  };
  products: any[];
  reviews: any[];
}

export default function HomeClient({ settings, products, reviews }: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax background scroll effect
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], ["0%", "25%"]);
  const opacityBg = useTransform(scrollY, [0, 600], [0.4, 0.15]);

  // Framer Motion variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  } as const;

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 220, 
        damping: 20 
      } 
    },
  } as const;

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 220, 
        damping: 20 
      } 
    },
  } as const;

  const coffeeBeanSVG = (
    <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="35" ry="20" transform="rotate(-30, 50, 50)" />
      <path d="M15,65 Q50,45 85,35" stroke="#FFF8E7" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );

  return (
    <div ref={containerRef} className="overflow-hidden">
      
      {/* ── Hero Section ── */}
      <section className="relative flex min-h-[95vh] items-center justify-center overflow-hidden bg-[#1C100E] py-32 px-4 sm:px-6 lg:px-8">
        
        {/* Parallax Background Image with Espresso Overlay */}
        <motion.div 
          style={{ y: yBg, opacity: opacityBg }}
          className="absolute inset-0 z-0 origin-top"
        >
          <Image
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1920"
            alt="Warm cozy cafe ambience"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center scale-110"
          />
        </motion.div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C100E]/70 via-[#1C100E]/45 to-background z-0" />

        {/* Floating Coffee Beans Particles (Framer Motion loop) */}
        <div className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden">
          <motion.div
            className="absolute w-8 h-8 text-[#C68E57]/25"
            style={{ top: "20%", left: "10%" }}
            animate={{ y: [0, -35, 0], rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            {coffeeBeanSVG}
          </motion.div>
          <motion.div
            className="absolute w-10 h-10 text-[#6F4E37]/30"
            style={{ top: "60%", right: "8%" }}
            animate={{ y: [0, -40, 0], rotate: [360, 0], scale: [1, 0.9, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            {coffeeBeanSVG}
          </motion.div>
          <motion.div
            className="absolute w-6 h-6 text-[#C68E57]/20"
            style={{ bottom: "25%", left: "15%" }}
            animate={{ x: [0, 20, 0], y: [0, -25, 0], rotate: [-45, 45, -45] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            {coffeeBeanSVG}
          </motion.div>
          <motion.div
            className="absolute w-7 h-7 text-[#6F4E37]/25"
            style={{ top: "15%", right: "20%" }}
            animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            {coffeeBeanSVG}
          </motion.div>
        </div>

        {/* Main Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="relative z-10 mx-auto max-w-4xl text-center space-y-8 px-4"
        >
          {/* Badge Accent */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#D9A441]/40 px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-[#D9A441] backdrop-blur-md bg-[#1C100E]/50 shadow-md animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Welcome to Cozy Beans Café</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-lg">
            {settings.hero_title || "Escape into a Cozy Corner of Coffee & Comfort"}
          </h1>

          {/* Tagline */}
          <p className="mx-auto max-w-2xl text-sm sm:text-lg md:text-xl text-[#FFF8E7]/90 font-light leading-relaxed drop-shadow-sm">
            {settings.hero_tagline || "Where every cup tells a story, and every moment feels like home."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            
            <Link
              href="/menu"
              className="group relative w-full sm:w-auto rounded-full bg-accent text-[#3E2723] hover:text-[#FFF8F0] text-xs font-bold uppercase tracking-widest px-8 py-4 shadow-[0_4px_20px_rgba(198,142,87,0.35)] transition-all duration-300 text-center hover:scale-105 active:scale-95 flex items-center justify-center space-x-1.5 overflow-hidden hover:shadow-[0_4px_25px_rgba(198,142,87,0.6)] cursor-pointer"
            >
              <span>☕ Order Now</span>
            </Link>

            <Link
              href="/reservations"
              className="w-full sm:w-auto rounded-full border-2 border-white/80 hover:border-accent hover:text-[#3E2723] hover:bg-accent text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300 text-center backdrop-blur-sm hover:scale-105 active:scale-95 cursor-pointer hover:shadow-[0_4px_20px_rgba(198,142,87,0.35)]"
            >
              <span>📅 Book a Table</span>
            </Link>

            <Link
              href="/event-booking"
              className="w-full sm:w-auto rounded-full border border-white/40 hover:border-accent hover:bg-accent/15 text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300 text-center backdrop-blur-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>🎉 Plan an Event</span>
            </Link>

          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center space-y-1 opacity-70 animate-bounce">
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#D9A441]">Scroll Down</span>
          <svg className="h-4 w-4 text-[#D9A441]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Special Offers Promo Card ── */}
      <section className="relative z-20 -mt-12 mx-auto max-w-5xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-r from-[#3E2723] via-[#2D1C19] to-[#1F1210] border border-[#C68E57]/20 p-8 md:p-10 shadow-2xl text-[#FFF8F0] hover:scale-[1.005] transition-all duration-300 group"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            <div className="flex items-center space-x-5">
              <div className="rounded-full bg-[#FFF8F0]/10 p-3.5 shrink-0 group-hover:bg-[#C68E57]/25 transition-all">
                <Gift className="h-8 w-8 text-[#C68E57] animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-xl tracking-wide text-accent">Special Offers</h3>
                <p className="text-xs text-[#FFF8F0]/70 leading-relaxed font-light">Use promo codes at checkout for instant discounts</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-2xl bg-white/5 p-3 border border-white/10 hover:bg-white/10 hover:border-[#C68E57]/30 transition-all duration-200">
                <span className="block text-[9px] font-extrabold text-[#C68E57] uppercase tracking-widest mb-1">20% Off</span>
                <span className="font-mono text-sm font-bold tracking-widest text-[#FFF8F0]">WELCOME20</span>
              </div>
              <div className="rounded-2xl bg-white/5 p-3 border border-white/10 hover:bg-white/10 hover:border-[#C68E57]/30 transition-all duration-200">
                <span className="block text-[9px] font-extrabold text-[#C68E57] uppercase tracking-widest mb-1">10% Off</span>
                <span className="font-mono text-sm font-bold tracking-widest text-[#FFF8F0]">COZY10</span>
              </div>
            </div>

            <div className="text-center md:text-right">
              <Link
                href="/menu"
                className="inline-block rounded-full bg-accent hover:opacity-90 text-[#3E2723] text-xs font-bold uppercase tracking-widest px-8 py-3.5 transition-all shadow-md hover:scale-105 active:scale-95"
              >
                Claim Coupon
              </Link>
            </div>
            
          </div>
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-28 bg-[#FFF8F0]/30 dark:bg-transparent border-b border-[#E0D4C5]/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {/* Feature 1 */}
            <motion.div 
              variants={fadeUp}
              className="flex flex-col items-center text-center p-8 space-y-4 bg-white dark:bg-[#281715] border border-[#E0D4C5]/40 dark:border-[#3E2723] rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div className="rounded-full bg-[#FFF3E3] dark:bg-[#2D1C19] p-5 text-primary group-hover:bg-[#C68E57]/10 transition-all">
                <Coffee className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">Premium Coffee</h3>
              <p className="text-xs text-textMuted dark:text-neutral-400 leading-relaxed max-w-xs font-light">
                Slow-roasted single-origin arabica beans prepared by passionate certified baristas.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              variants={fadeUp}
              className="flex flex-col items-center text-center p-8 space-y-4 bg-white dark:bg-[#281715] border border-[#E0D4C5]/40 dark:border-[#3E2723] rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div className="rounded-full bg-[#FFF3E3] dark:bg-[#2D1C19] p-5 text-primary group-hover:bg-[#C68E57]/10 transition-all">
                <Heart className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">Cozy Atmosphere</h3>
              <p className="text-xs text-textMuted dark:text-neutral-400 leading-relaxed max-w-xs font-light">
                Soft lighting, peaceful acoustic music, fast Wi-Fi, and comfortable workspaces.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={fadeUp}
              className="flex flex-col items-center text-center p-8 space-y-4 bg-white dark:bg-[#281715] border border-[#E0D4C5]/40 dark:border-[#3E2723] rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div className="rounded-full bg-[#FFF3E3] dark:bg-[#2D1C19] p-5 text-primary group-hover:bg-[#C68E57]/10 transition-all">
                <Smile className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">Loyalty Rewards</h3>
              <p className="text-xs text-textMuted dark:text-neutral-400 leading-relaxed max-w-xs font-light">
                Earn points with every purchase and redeem them for free food, drinks, and coupons.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Specialties ── */}
      <section className="py-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-20 max-w-xl mx-auto"
        >
          <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-[#FFF3E3] dark:bg-[#2D1C19] px-3.5 py-1.5 rounded-full border border-[#E0D4C5]">Our Favorites</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Featured Specialties</h2>
          <p className="text-sm text-textMuted dark:text-neutral-400 leading-relaxed font-light">
            Sip and savor our most-ordered drinks and dishes, freshly made with pure love and premium ingredients.
          </p>
        </motion.div>

        {products.length > 0 ? (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.map((product: any) => (
              <motion.div key={product.id} variants={fadeUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-textMuted text-sm py-10">No items available. Seed the database to view.</div>
        )}

        <div className="text-center pt-16">
          <Link
            href="/menu"
            className="inline-flex items-center space-x-2 text-primary dark:text-[#FFF8F0] hover:text-accent dark:hover:text-accent font-bold text-xs uppercase tracking-widest transition-colors border-b-2 border-primary dark:border-[#FFF8F0] hover:border-accent dark:hover:border-accent pb-1"
          >
            <span>View Complete Menu</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="py-32 bg-[#FFF3E3]/40 dark:bg-[#281715]/10 border-t border-b border-[#E0D4C5]/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Story text */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-8"
            >
              <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-white dark:bg-[#281715] px-3.5 py-1.5 rounded-full border border-[#E0D4C5]">Our Story</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight tracking-tight">
                Brewing Happiness and Crafting Comfort Daily
              </h2>
              <p className="text-sm text-textMuted dark:text-neutral-400 leading-relaxed font-light">
                Cozy Beans Café was born out of a simple dream: to create a soft retreat from the hustle of daily life. We believe coffee is more than just a morning caffeine kick—it’s an opportunity to pause, connect, and enjoy the beauty of the present moment.
              </p>
              <p className="text-sm text-textMuted dark:text-neutral-400 leading-relaxed font-light">
                We roast our coffee beans in small batches, source milk from local organic dairies, and bake our signature sourdough pastries fresh every morning. From rich vanilla lattes to savory avocado toasts, everything is prepared with care and precision.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-4">
                <div className="flex flex-col space-y-1.5 border-l-2 border-accent pl-4">
                  <span className="text-3xl font-extrabold text-primary dark:text-[#FFF8F0] font-sans leading-none">100%</span>
                  <span className="text-[10px] font-bold text-textMuted dark:text-neutral-400 uppercase tracking-widest">Organic Beans</span>
                </div>
                <div className="flex flex-col space-y-1.5 border-l-2 border-accent pl-4">
                  <span className="text-3xl font-extrabold text-primary dark:text-[#FFF8F0] font-sans leading-none">Fresh</span>
                  <span className="text-[10px] font-bold text-textMuted dark:text-neutral-400 uppercase tracking-widest">Baked Daily</span>
                </div>
                <div className="flex flex-col space-y-1.5 border-l-2 border-accent pl-4">
                  <span className="text-3xl font-extrabold text-primary dark:text-[#FFF8F0] font-sans leading-none">Cozy</span>
                  <span className="text-[10px] font-bold text-textMuted dark:text-neutral-400 uppercase tracking-widest">Workspace</span>
                </div>
              </div>
            </motion.div>

            {/* Collage Images */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 grid grid-cols-2 gap-5"
            >
              <div className="space-y-5">
                <div className="relative h-48 w-full overflow-hidden rounded-3xl shadow-lg border border-[#E0D4C5]/30 group">
                  <Image
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400"
                    alt="Coffee shop interior"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-550 ease-out"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-lg border border-[#E0D4C5]/30 group">
                  <Image
                    src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400"
                    alt="Espresso extraction"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-550 ease-out"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="space-y-5 pt-8">
                <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-lg border border-[#E0D4C5]/30 group">
                  <Image
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400"
                    alt="Pouring latte art"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-550 ease-out"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-48 w-full overflow-hidden rounded-3xl shadow-lg border border-[#E0D4C5]/30 group">
                  <Image
                    src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400"
                    alt="Fresh snacks"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-550 ease-out"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Customer Testimonials ── */}
      <section className="py-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-20 max-w-xl mx-auto"
        >
          <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-[#FFF3E3] dark:bg-[#2D1C19] px-3.5 py-1.5 rounded-full border border-[#E0D4C5]">Reviews</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Loved by Our Community</h2>
          <p className="text-sm text-textMuted dark:text-neutral-400 leading-relaxed font-light">
            Here is what our regular guests say about our service, flavor, and cozy space.
          </p>
        </motion.div>

        {reviews.length > 0 ? (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {reviews.map((review: any) => (
              <motion.div
                key={review.id}
                variants={fadeUp}
                className="rounded-3xl border border-[#E0D4C5]/40 dark:border-[#3E2723] bg-white dark:bg-[#281715]/40 p-8 shadow-sm flex flex-col justify-between hover:shadow-xl hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="space-y-5">
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-[#C68E57] text-[#C68E57]" : "text-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-textMuted dark:text-neutral-300 leading-relaxed italic font-light">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-[#E0D4C5]/30">
                  <div className="h-9 w-9 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase border border-borderColor/60">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{review.name}</h4>
                    <span className="text-[9px] font-semibold text-textMuted uppercase tracking-wider">Verified Guest</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-textMuted text-xs py-10 bg-white dark:bg-transparent border border-[#E0D4C5]/40 border-dashed rounded-3xl">
            No approved reviews yet.
          </div>
        )}
      </section>

      {/* ── Quick Details Banner ── */}
      <section className="py-20 bg-[#FFF3E3]/40 dark:bg-transparent border-y border-[#E0D4C5]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-[#E0D4C5]/40">
            
            <div className="flex flex-col items-center md:items-start p-6 space-y-3">
              <div className="p-3 bg-white dark:bg-[#281715] rounded-2xl border border-[#E0D4C5]/40 dark:border-[#3E2723] shadow-sm shrink-0">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground">Opening Hours</h3>
              <p className="text-xs text-textMuted dark:text-neutral-400 font-light leading-relaxed">
                {settings.opening_hours || "Mon - Fri: 7:00 AM - 8:00 PM | Sat - Sun: 8:00 AM - 9:00 PM"}
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-start p-6 pt-8 md:pt-6 space-y-3">
              <div className="p-3 bg-white dark:bg-[#281715] rounded-2xl border border-[#E0D4C5]/40 dark:border-[#3E2723] shadow-sm shrink-0">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground">Location Address</h3>
              <p className="text-xs text-textMuted dark:text-neutral-400 font-light leading-relaxed">
                {settings.cafe_address || "AKC, Mogappair, Nerkundram, Chennai, Greater Chennai, Tamil Nadu 600107"}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start p-6 pt-8 md:pt-6 space-y-3">
              <div className="p-3 bg-white dark:bg-[#281715] rounded-2xl border border-[#E0D4C5]/40 dark:border-[#3E2723] shadow-sm shrink-0">
                <Phone className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground">Quick Contact</h3>
              <p className="text-xs text-textMuted dark:text-neutral-400 font-light leading-relaxed">
                Phone: {settings.cafe_phone || "+1 (555) 789-COZY"}<br />
                Email: {settings.cafe_email || "hello@cozybeans.com"}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Newsletter Club Section ── */}
      <section className="py-32 mx-auto max-w-4xl px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="rounded-[2rem] border border-[#E0D4C5]/40 bg-white dark:bg-[#281715]/45 p-10 md:p-16 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[#FFF3E3]/50 filter blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-accent/5 filter blur-3xl opacity-50 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-[#FFF3E3] dark:bg-[#2D1C19] px-3.5 py-1.5 rounded-full border border-[#E0D4C5]">Cozy Club</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Get Free Coffee & Special Offers</h2>
            <p className="mx-auto max-w-md text-xs sm:text-sm text-textMuted dark:text-neutral-400 leading-relaxed font-light">
              Subscribe to our weekly newsletter to get exclusive deals, happy hour notifications, and a free cookie coupon code instantly.
            </p>

            <NewsletterForm />
          </div>
        </motion.div>
      </section>

    </div>
  );
}
