import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Coffee, Heart, Shield, Leaf, Users, Award } from "lucide-react";
import Image from "next/image";

const values = [
  {
    icon: <Coffee className="h-7 w-7" />,
    title: "Premium Quality",
    description: "We source our coffee beans from ethical, single-origin farms and roast them in small batches for the freshest flavour.",
  },
  {
    icon: <Heart className="h-7 w-7" />,
    title: "Made with Love",
    description: "Every dish and drink is crafted with care, passion, and the finest ingredients by our talented kitchen team.",
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Safe & Hygienic",
    description: "We maintain the highest standards of cleanliness and food safety across our entire kitchen and dining area.",
  },
  {
    icon: <Leaf className="h-7 w-7" />,
    title: "Sustainability",
    description: "From compostable packaging to locally-sourced produce, we&apos;re committed to reducing our environmental footprint.",
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Community First",
    description: "We believe in building connections. Our café is a welcoming space for everyone — freelancers, families, and friends.",
  },
  {
    icon: <Award className="h-7 w-7" />,
    title: "Award Winning",
    description: "Recognised by local food critics and loved by thousands of customers for exceptional taste and service.",
  },
];

const stats = [
  { value: "8+", label: "Years of Service" },
  { value: "50K+", label: "Happy Customers" },
  { value: "100%", label: "Organic Beans" },
  { value: "200+", label: "Menu Items" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        tagline="Our Story"
        title="About Cozy Beans"
        description="We're more than a café — we're a warm retreat where coffee, comfort food, and community come together."
      />

      <div className="page-enter">
        {/* Story Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                How It All Started
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                Brewing Happiness and Crafting Comfort Daily
              </h2>
              <p className="text-sm text-textMuted leading-relaxed">
                Cozy Beans Café was born out of a simple dream: to create a soft retreat from the
                hustle of daily life. We believe coffee is more than just a morning caffeine kick —
                it&apos;s an opportunity to pause, connect, and enjoy the beauty of the present moment.
              </p>
              <p className="text-sm text-textMuted leading-relaxed">
                We roast our coffee beans in small batches, source milk from local organic dairies,
                and bake our signature sourdough pastries fresh every morning. From rich vanilla
                lattes to savory avocado toasts, everything is prepared with care and precision.
              </p>
              <p className="text-sm text-textMuted leading-relaxed">
                What started as a small corner café in 2018 has grown into a beloved community hub.
                Our team of passionate baristas and chefs work tirelessly to deliver the best
                experience — whether you&apos;re here for your morning espresso, a working lunch, or
                a weekend brunch with friends.
              </p>
            </div>

            {/* Image Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-md border border-borderColor/30 group">
                  <Image
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400"
                    alt="Coffee shop interior"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-md border border-borderColor/30 group">
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
              <div className="space-y-4 pt-8">
                <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-md border border-borderColor/30 group">
                  <Image
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400"
                    alt="Pouring latte art"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-48 w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-md border border-borderColor/30 group">
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
        </section>

        {/* Stats Strip */}
        <section className="bg-primary text-white py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <span className="text-3xl sm:text-4xl font-bold font-serif">{stat.value}</span>
                  <p className="text-xs text-white/70 font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              What We Stand For
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Our Core Values
            </h2>
            <p className="mx-auto max-w-md text-sm text-textMuted leading-relaxed">
              These principles guide everything we do — from the beans we select to the way we
              greet you at the door.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-borderColor bg-cardBg p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  {value.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-xs text-textMuted leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-secondary/40 border-y border-borderColor py-24 transition-all">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-16">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                The People Behind The Beans
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                Meet Our Team
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Emma Collins", role: "Founder & Head Chef", initials: "EC" },
                { name: "James Rivera", role: "Head Barista", initials: "JR" },
                { name: "Sofia Chen", role: "Pastry Chef", initials: "SC" },
                { name: "Marcus Brown", role: "Events Manager", initials: "MB" },
              ].map((member, i) => (
                <div
                  key={i}
                  className="text-center rounded-2xl border border-borderColor bg-cardBg p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white text-xl font-bold font-serif mb-4 shadow-md">
                    {member.initials}
                  </div>
                  <h3 className="font-serif text-base font-bold text-foreground">{member.name}</h3>
                  <p className="text-xs text-textMuted mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
