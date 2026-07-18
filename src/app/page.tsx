import React from "react";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ContactForm } from "@/components/ContactForm";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Coffee, Calendar, MapPin, Phone, Star, ShieldCheck, Gift, Clock, Sparkles, Mail, Heart, Smile } from "lucide-react";
import Image from "next/image";
import { getCachedSettings, getCachedMenu, getCachedApprovedReviews } from "@/lib/cache";

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

      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-[#1C100E] py-28 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1920"
            alt="Warm cozy cafe ambience"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C100E]/70 via-[#1C100E]/30 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#D9A441]/40 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#D9A441] backdrop-blur-md bg-[#1C100E]/40 shadow-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Welcome to Cozy Beans Café</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-md">
            {settings.hero_title || "Escape into a Cozy Corner of Coffee & Comfort"}
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-[#FFF8E7]/90 font-light leading-relaxed drop-shadow-sm">
            {settings.hero_tagline || "Where every cup tells a story, and every moment feels like home."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/menu"
              className="w-full sm:w-auto rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-bold uppercase tracking-wider px-8 py-4 shadow-lg transition-all duration-300 text-center hover:scale-105 active:scale-95"
            >
              Order Online
            </Link>
            <Link
              href="/reservations"
              className="w-full sm:w-auto rounded-full border-2 border-white/80 hover:border-white text-white hover:bg-white/10 text-sm font-bold uppercase tracking-wider px-8 py-4 transition-all duration-300 text-center backdrop-blur-sm hover:scale-105 active:scale-95"
            >
              Book a Table
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center space-y-1 opacity-80 animate-bounce">
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#D9A441]">Scroll Down</span>
          <svg className="h-4 w-4 text-[#D9A441]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Special Offers / Promotions Banner */}
      <section className="relative z-20 -mt-12 mx-auto max-w-5xl px-4 animate-fade-in-up animation-delay-100">
        <div className="rounded-3xl bg-gradient-to-r from-[#4A2C2A] via-[#3E2321] to-[#251311] border border-[#FFF8E7]/10 p-8 md:p-10 shadow-2xl text-white hover:scale-[1.005] hover:shadow-primary/5 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center space-x-5">
              <div className="rounded-full bg-white/10 p-3.5 shrink-0">
                <Gift className="h-8 w-8 text-amber-300 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-xl tracking-wide">Special Offers</h3>
                <p className="text-xs text-[#FFF8E7]/70 leading-relaxed font-light">Use promo codes at checkout for instant discounts</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-2xl bg-white/5 p-3 border border-white/10 hover:bg-white/10 hover:border-[#D9A441]/30 transition-all duration-200">
                <span className="block text-[9px] font-extrabold text-amber-300 uppercase tracking-widest mb-1">20% Off</span>
                <span className="font-mono text-sm font-bold tracking-widest text-[#FFF8E7]">WELCOME20</span>
              </div>
              <div className="rounded-2xl bg-white/5 p-3 border border-white/10 hover:bg-white/10 hover:border-[#D9A441]/30 transition-all duration-200">
                <span className="block text-[9px] font-extrabold text-amber-300 uppercase tracking-widest mb-1">10% Off</span>
                <span className="font-mono text-sm font-bold tracking-widest text-[#FFF8E7]">COZY10</span>
              </div>
            </div>

            <div className="text-center md:text-right">
              <Link
                href="/menu"
                className="inline-block rounded-full bg-[#D9A441] hover:bg-[#C59134] text-[#1C100E] text-xs font-bold uppercase tracking-widest px-8 py-3.5 transition-all shadow-md hover:scale-105 active:scale-95"
              >
                Claim Coupon
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-28 bg-[#FFF8E7]/30 border-b border-borderColor/40 shadow-inner">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-8 space-y-4 bg-white border border-borderColor/40 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="rounded-full bg-primary/5 p-5 text-primary">
                <Coffee className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">Premium Coffee</h3>
              <p className="text-xs text-textMuted leading-relaxed max-w-xs font-light">
                Slow-roasted single-origin arabica beans prepared by passionate certified baristas.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 space-y-4 bg-white border border-borderColor/40 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="rounded-full bg-primary/5 p-5 text-primary">
                <Heart className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">Cozy Atmosphere</h3>
              <p className="text-xs text-textMuted leading-relaxed max-w-xs font-light">
                Soft lighting, peaceful acoustic music, fast Wi-Fi, and comfortable workspaces.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 space-y-4 bg-white border border-borderColor/40 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="rounded-full bg-primary/5 p-5 text-primary">
                <Smile className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">Loyalty Rewards</h3>
              <p className="text-xs text-textMuted leading-relaxed max-w-xs font-light">
                Earn points with every purchase and redeem them for free food, drinks, and coupons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section className="py-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-20 max-w-xl mx-auto">
          <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-[#FFF8E7] px-3.5 py-1.5 rounded-full border border-borderColor">Our Favorites</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Featured Specialties</h2>
          <p className="text-sm text-textMuted/90 leading-relaxed font-light">
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

        <div className="text-center pt-16">
          <Link
            href="/menu"
            className="inline-flex items-center space-x-2 text-primary hover:text-accent font-bold text-xs uppercase tracking-widest transition-colors border-b-2 border-primary hover:border-accent pb-1"
          >
            <span>View Complete Menu</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-32 bg-[#FFF8E7]/40 border-t border-b border-borderColor/40 transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Story text */}
            <div className="lg:col-span-7 space-y-8">
              <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-white px-3.5 py-1.5 rounded-full border border-borderColor">Our Story</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight tracking-tight">
                Brewing Happiness and Crafting Comfort Daily
              </h2>
              <p className="text-sm text-[#7A635B] leading-relaxed font-light">
                Cozy Beans Café was born out of a simple dream: to create a soft retreat from the hustle of daily life. We believe coffee is more than just a morning caffeine kick—it’s an opportunity to pause, connect, and enjoy the beauty of the present moment.
              </p>
              <p className="text-sm text-[#7A635B] leading-relaxed font-light">
                We roast our coffee beans in small batches, source milk from local organic dairies, and bake our signature sourdough pastries fresh every morning. From rich vanilla lattes to savory avocado toasts, everything is prepared with care and precision.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-4">
                <div className="flex flex-col space-y-1.5 border-l-2 border-[#D9A441] pl-4">
                  <span className="text-3xl font-extrabold text-primary font-sans leading-none">100%</span>
                  <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Organic Beans</span>
                </div>
                <div className="flex flex-col space-y-1.5 border-l-2 border-[#D9A441] pl-4">
                  <span className="text-3xl font-extrabold text-primary font-sans leading-none">Fresh</span>
                  <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Baked Daily</span>
                </div>
                <div className="flex flex-col space-y-1.5 border-l-2 border-[#D9A441] pl-4">
                  <span className="text-3xl font-extrabold text-primary font-sans leading-none">Cozy</span>
                  <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Workspace</span>
                </div>
              </div>
            </div>

            {/* Collage Images */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-5">
              <div className="space-y-5">
                <div className="relative h-48 w-full overflow-hidden rounded-3xl shadow-lg border border-borderColor/30 group">
                  <Image
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400"
                    alt="Coffee shop interior"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-lg border border-borderColor/30 group">
                  <Image
                    src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400"
                    alt="Espresso extraction"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="space-y-5 pt-8">
                <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-lg border border-borderColor/30 group">
                  <Image
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400"
                    alt="Pouring latte art"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-48 w-full overflow-hidden rounded-3xl shadow-lg border border-borderColor/30 group">
                  <Image
                    src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400"
                    alt="Fresh snacks"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-20 max-w-xl mx-auto">
          <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-[#FFF8E7] px-3.5 py-1.5 rounded-full border border-borderColor">Reviews</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Loved by Our Community</h2>
          <p className="text-sm text-textMuted/90 leading-relaxed font-light">
            Here is what our regular guests say about our service, flavor, and cozy space.
          </p>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review: any) => (
              <div
                key={review.id}
                className="rounded-3xl border border-borderColor/40 bg-cardBg p-8 shadow-sm flex flex-col justify-between hover:shadow-xl hover:border-accent/40 transition-all duration-300"
              >
                <div className="space-y-5">
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-[#D9A441] text-[#D9A441]" : "text-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[#7A635B] leading-relaxed italic font-light">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-borderColor/40">
                  <div className="h-9 w-9 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase border border-borderColor/60">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{review.name}</h4>
                    <span className="text-[9px] font-semibold text-textMuted uppercase tracking-wider">Verified Guest</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-textMuted text-xs py-10 bg-white border border-borderColor/40 border-dashed rounded-3xl">No approved reviews yet.</div>
        )}
      </section>

      {/* Opening Details / Hours & Location Summary */}
      <section className="py-20 bg-[#FFF8E7]/30 border-y border-borderColor/50 transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-borderColor/60">
            <div className="flex flex-col items-center md:items-start p-6 space-y-3">
              <div className="p-3 bg-white rounded-2xl border border-borderColor/40 shadow-sm shrink-0">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground">Opening Hours</h3>
              <p className="text-xs text-textMuted font-light leading-relaxed">
                {settings.opening_hours || "Mon - Fri: 7:00 AM - 8:00 PM | Sat - Sun: 8:00 AM - 9:00 PM"}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start p-6 pt-8 md:pt-6 space-y-3">
              <div className="p-3 bg-white rounded-2xl border border-borderColor/40 shadow-sm shrink-0">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground">Location Address</h3>
              <p className="text-xs text-textMuted font-light leading-relaxed">
                {settings.cafe_address || "AKC, Mogappair, Nerkundram, Chennai, Greater Chennai, Tamil Nadu 600107"}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start p-6 pt-8 md:pt-6 space-y-3">
              <div className="p-3 bg-white rounded-2xl border border-borderColor/40 shadow-sm shrink-0">
                <Phone className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground">Quick Contact</h3>
              <p className="text-xs text-textMuted font-light leading-relaxed">
                Phone: {settings.cafe_phone || "+1 (555) 789-COZY"}<br />
                Email: {settings.cafe_email || "hello@cozybeans.com"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Contact & Location Map Section */}
      <section className="py-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
          {/* Info Details */}
          <div className="space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-[#FFF8E7] px-3.5 py-1.5 rounded-full border border-borderColor">Connect</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mt-2 mb-4 leading-tight tracking-tight">
                We'd Love to Hear From You
              </h2>
              <p className="text-sm text-[#7A635B] leading-relaxed font-light">
                Have questions about our events, catering, or just want to tell us about your experience? Reach out to us through the form or stop by our cozy location!
              </p>
            </div>

            {/* Simulated Map Visual Card */}
            <div className="relative rounded-3xl border border-borderColor/40 overflow-hidden h-72 group shadow-xl hover:shadow-2xl transition-all duration-300">
              <Image
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                alt="Simulated map background"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#4A2C2A]/10 mix-blend-multiply" />
              
              {/* Floating Address Overlay */}
              <div className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl glass border border-borderColor/40 text-foreground space-y-1 shadow-lg">
                <span className="text-[10px] font-extrabold text-[#4A2C2A] uppercase tracking-widest block">Find Us</span>
                <span className="text-sm font-bold block">{settings.cafe_address || "AKC, Mogappair, Nerkundram, Chennai, Greater Chennai, Tamil Nadu 600107"}</span>
                <span className="text-[10px] text-[#7A635B] block font-light">Tap maps icon on your mobile to navigate</span>
              </div>

              {/* Pin Indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <MapPin className="h-10 w-10 text-accent animate-bounce fill-amber-200 shadow-sm" />
              </div>
            </div>
          </div>

          {/* Interactive Form Component */}
          <div className="bg-white border border-borderColor/40 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Newsletter / Cozy Club Section */}
      <section className="py-32 mx-auto max-w-4xl px-4 animate-fade-in-up">
        <div className="rounded-[2rem] border border-borderColor/40 bg-cardBg p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-secondary/80 filter blur-3xl opacity-65" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-accent/10 filter blur-3xl opacity-60" />

          <div className="relative z-10 space-y-6">
            <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-[#FFF8E7] px-3.5 py-1.5 rounded-full border border-borderColor">Cozy Club</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Get Free Coffee & Special Offers</h2>
            <p className="mx-auto max-w-md text-sm text-textMuted leading-relaxed font-light">
              Subscribe to our weekly newsletter to get exclusive deals, happy hour notifications, and a free cookie coupon code instantly.
            </p>

            <NewsletterForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
