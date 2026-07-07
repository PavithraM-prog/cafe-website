import React from "react";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Coffee, Calendar, MapPin, Phone, Star, ShieldCheck, Gift, Clock, Sparkles } from "lucide-react";

async function getLandingData() {
  try {
    // 1. Fetch settings
    const settingsList = await db.setting.findMany();
    const settings = settingsList.reduce((acc: any, curr) => {
      acc[curr.id] = curr.value;
      return acc;
    }, {});

    // 2. Fetch featured products (take first 4)
    const products = await db.product.findMany({
      take: 4,
      orderBy: { rating: "desc" },
    });

    // 3. Fetch approved reviews
    const reviews = await db.review.findMany({
      where: { status: "APPROVED" },
      take: 3,
      orderBy: { createdAt: "desc" },
    });

    return { settings, products, reviews };
  } catch (error) {
    console.error("Error fetching landing data:", error);
    return {
      settings: {
        hero_title: "Escape into a Cozy Corner of Coffee & Comfort",
        hero_tagline: "Where every cup tells a story, and every moment feels like home.",
        opening_hours: "Mon - Fri: 7:00 AM - 8:00 PM | Sat - Sun: 8:00 AM - 9:00 PM",
        cafe_address: "123 Aroma Lane, Coffee District, CA 90210",
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

      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-black py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1920"
            alt="Warm cozy cafe ambience"
            className="h-full w-full object-cover object-center opacity-40 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-400/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-sm bg-amber-950/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Welcome to Cozy Beans Café</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            {settings.hero_title || "Escape into a Cozy Corner of Coffee & Comfort"}
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-neutral-200 font-light leading-relaxed">
            {settings.hero_tagline || "Where every cup tells a story, and every moment feels like home."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/menu"
              className="w-full sm:w-auto rounded-full bg-accent hover:bg-accent-hover text-white text-base font-semibold px-8 py-3.5 shadow-lg transition-all text-center hover:scale-105 active:scale-95"
            >
              Order Online
            </Link>
            <Link
              href="/reservations"
              className="w-full sm:w-auto rounded-full border border-white/80 hover:border-white text-white hover:bg-white/10 text-base font-semibold px-8 py-3.5 transition-all text-center backdrop-blur-sm hover:scale-105 active:scale-95"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers / Promotions Banner */}
      <section className="relative z-20 -mt-10 mx-auto max-w-5xl px-4">
        <div className="rounded-2xl bg-primary border border-borderColor p-6 md:p-8 shadow-xl text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-white/10 p-3 shrink-0">
                <Gift className="h-8 w-8 text-amber-300" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg">Special Offers</h3>
                <p className="text-xs text-white/80 leading-normal">Use codes at checkout for discounts</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-white/15 p-2.5 border border-white/10">
                <span className="block text-[10px] font-bold text-amber-300 uppercase tracking-widest">20% Off</span>
                <span className="font-mono text-sm font-bold tracking-wider">WELCOME20</span>
              </div>
              <div className="rounded-xl bg-white/15 p-2.5 border border-white/10">
                <span className="block text-[10px] font-bold text-amber-300 uppercase tracking-widest">10% Off</span>
                <span className="font-mono text-sm font-bold tracking-wider">COZY10</span>
              </div>
            </div>

            <div className="text-center md:text-right">
              <Link
                href="/menu"
                className="inline-block rounded-full bg-white text-primary hover:bg-neutral-100 text-sm font-bold px-6 py-2.5 transition-colors shadow-sm"
              >
                Claim Coupon
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Our Favorites</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Featured Specialties</h2>
          <p className="mx-auto max-w-md text-sm text-textMuted leading-relaxed">
            Sip and savor our most-ordered drinks and dishes, freshly made with pure love and premium ingredients.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-textMuted text-sm py-10">No items available. Seed the database to view.</div>
        )}

        <div className="text-center pt-12">
          <Link
            href="/menu"
            className="inline-flex items-center space-x-2 text-primary hover:text-accent font-semibold text-sm transition-colors border-b border-primary hover:border-accent pb-1"
          >
            <span>View Complete Menu</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-secondary transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Our Story</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                Brewing Happiness and Crafting Comfort Daily
              </h2>
              <p className="text-sm text-textMuted leading-relaxed">
                Cozy Beans Café was born out of a simple dream: to create a soft retreat from the hustle of daily life. We believe coffee is more than just a morning caffeine kick—it’s an opportunity to pause, connect, and enjoy the beauty of the present moment.
              </p>
              <p className="text-sm text-textMuted leading-relaxed">
                We roast our coffee beans in small batches, source milk from local organic dairies, and bake our signature sourdough pastries fresh every morning. From rich vanilla lattes to savory avocado toasts, everything is prepared with care and precision.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-2xl font-bold text-primary">100%</span>
                  <span className="text-xs text-textMuted">Organic Beans</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-2xl font-bold text-primary">Fresh</span>
                  <span className="text-xs text-textMuted">Pastries Daily</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-2xl font-bold text-primary">Cozy</span>
                  <span className="text-xs text-textMuted">Workspace Vibes</span>
                </div>
              </div>
            </div>

            {/* Collage Images */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400"
                  alt="Coffee shop interior"
                  className="rounded-2xl object-cover h-48 w-full shadow-sm"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400"
                  alt="Espresso extraction"
                  className="rounded-2xl object-cover h-64 w-full shadow-sm"
                />
              </div>
              <div className="space-y-4 pt-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400"
                  alt="Pouring latte art"
                  className="rounded-2xl object-cover h-64 w-full shadow-sm"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400"
                  alt="Fresh snacks"
                  className="rounded-2xl object-cover h-48 w-full shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Reviews</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Loved by Our Community</h2>
          <p className="mx-auto max-w-md text-sm text-textMuted leading-relaxed">
            Here is what our regular guests say about our service, flavor, and cozy space.
          </p>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review: any) => (
              <div
                key={review.id}
                className="rounded-2xl border border-borderColor bg-cardBg p-6 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-amber-500 text-amber-500" : "text-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-textMuted leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-borderColor/60">
                  <div className="h-9 w-9 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{review.name}</h4>
                    <span className="text-[10px] text-textMuted">Verified Customer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-textMuted text-sm py-6">No approved reviews yet.</div>
        )}
      </section>

      {/* Opening Details / Hours & Location Summary */}
      <section className="py-16 bg-secondary/40 border-y border-borderColor/80 transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-borderColor">
            <div className="flex flex-col items-center md:items-start p-4 space-y-2">
              <Clock className="h-6 w-6 text-accent" />
              <h3 className="font-serif font-bold text-foreground">Opening Hours</h3>
              <p className="text-xs text-textMuted leading-relaxed">
                {settings.opening_hours || "Mon - Fri: 7:00 AM - 8:00 PM | Sat - Sun: 8:00 AM - 9:00 PM"}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start p-4 pt-8 md:pt-4 space-y-2">
              <MapPin className="h-6 w-6 text-accent" />
              <h3 className="font-serif font-bold text-foreground">Location Address</h3>
              <p className="text-xs text-textMuted leading-relaxed">
                {settings.cafe_address || "123 Aroma Lane, Coffee District, CA 90210"}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start p-4 pt-8 md:pt-4 space-y-2">
              <Phone className="h-6 w-6 text-accent" />
              <h3 className="font-serif font-bold text-foreground">Quick Contact</h3>
              <p className="text-xs text-textMuted leading-relaxed">
                Phone: {settings.cafe_phone || "+1 (555) 789-COZY"}<br />
                Email: {settings.cafe_email || "hello@cozybeans.com"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 mx-auto max-w-4xl px-4">
        <div className="rounded-3xl border border-borderColor bg-cardBg p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-secondary/60 filter blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-accent/5 filter blur-3xl" />

          <div className="relative z-10 space-y-5">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Cozy Club</span>
            <h2 className="font-serif text-3xl font-bold text-foreground">Get Free Coffee & Special Offers</h2>
            <p className="mx-auto max-w-md text-sm text-textMuted leading-relaxed">
              Subscribe to our weekly newsletter to get exclusive deals, happy hour notifications, and a free cookie coupon code instantly.
            </p>

            <form
              action="#"
              method="POST"
              className="mx-auto max-w-md flex flex-col sm:flex-row items-center gap-3 pt-4"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="w-full rounded-full border border-borderColor bg-background px-5 py-3 text-sm text-foreground focus:border-primary transition-all"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-6 py-3 transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
