"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Coffee, Heart, Shield, Leaf, Users, Award, Sparkles } from "lucide-react";
import Image from "next/image";
import Timeline from "@/components/Timeline";
import AnimatedCounter from "@/components/AnimatedCounter";
import { motion } from "framer-motion";

const values = [
  {
    icon: <Coffee className="h-6 w-6" />,
    title: "Premium Quality",
    description: "We source our coffee beans from ethical, single-origin farms and roast them in small batches for the freshest flavour.",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Made with Love",
    description: "Every dish and drink is crafted with care, passion, and the finest ingredients by our talented kitchen team.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Safe & Hygienic",
    description: "We maintain the highest standards of cleanliness and food safety across our entire kitchen and dining area.",
  },
  {
    icon: <Leaf className="h-6 w-6" />,
    title: "Sustainability",
    description: "From compostable packaging to locally-sourced produce, we're committed to reducing our environmental footprint.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community First",
    description: "We believe in building connections. Our café is a welcoming space for everyone — freelancers, families, and friends.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Award Winning",
    description: "Recognised by local food critics and loved by thousands of customers for exceptional taste and service.",
  },
];

const teamMembers = [
  { name: "Emma Collins", role: "Founder & Head Chef", initials: "EC" },
  { name: "James Rivera", role: "Head Barista", initials: "JR" },
  { name: "Sofia Chen", role: "Pastry Chef", initials: "SC" },
  { name: "Marcus Brown", role: "Events Manager", initials: "MB" },
];

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  } as const;

  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 20 } }
  } as const;

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
            
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-[#FFF3E3] dark:bg-[#2D1C19] px-3 py-1.5 rounded-full border border-[#E0D4C5]">
                How It All Started
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                Brewing Happiness and Crafting Comfort Daily
              </h2>
              <p className="text-sm text-textMuted dark:text-neutral-400 leading-relaxed font-light">
                Cozy Beans Café was born out of a simple dream: to create a soft retreat from the hustle of daily life. We believe coffee is more than just a morning caffeine kick — it's an opportunity to pause, connect, and enjoy the beauty of the present moment.
              </p>
              <p className="text-sm text-textMuted dark:text-neutral-400 leading-relaxed font-light">
                We roast our coffee beans in small batches, source milk from local organic dairies, and bake our signature sourdough pastries fresh every morning. From rich vanilla lattes to savory avocado toasts, everything is prepared with care and precision.
              </p>
              <p className="text-sm text-textMuted dark:text-neutral-400 leading-relaxed font-light">
                What started as a small corner café has grown into a beloved community hub. Our team of passionate baristas and chefs work tirelessly to deliver the best experience — whether you're here for your morning espresso, a working lunch, or a weekend brunch with friends.
              </p>
            </motion.div>

            {/* Image Grid */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="relative h-48 w-full overflow-hidden rounded-[24px] shadow-md border border-[#E0D4C5]/30 group">
                  <Image
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400"
                    alt="Coffee shop interior"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-64 w-full overflow-hidden rounded-[24px] shadow-md border border-[#E0D4C5]/30 group">
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
                <div className="relative h-64 w-full overflow-hidden rounded-[24px] shadow-md border border-[#E0D4C5]/30 group">
                  <Image
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400"
                    alt="Pouring latte art"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-48 w-full overflow-hidden rounded-[24px] shadow-md border border-[#E0D4C5]/30 group">
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
            </motion.div>

          </div>
        </section>

        {/* ── Timeline Section (Café Story, Mission, Vision, Achievements) ── */}
        <section className="py-24 border-t border-[#E0D4C5]/30 bg-[#FFF3E3]/20 dark:bg-transparent">
          <div className="text-center space-y-3 mb-16 max-w-xl mx-auto">
            <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-white dark:bg-[#281715] px-3.5 py-1.5 rounded-full border border-[#E0D4C5]">
              Milestones & Timeline
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Our Journey So Far
            </h2>
            <p className="text-xs sm:text-sm text-textMuted dark:text-neutral-400 font-light leading-relaxed">
              Explore how we grew from a small coffee spot into Chennai's favorite community retreat.
            </p>
          </div>
          
          <Timeline />
        </section>

        {/* ── Stats Strip (Animated Counters) ── */}
        <section className="bg-primary py-16 dark:bg-[#281715]/40 border-y border-[#E0D4C5]/20 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(198,142,87,0.08)_0%,transparent_50%)] pointer-events-none" />
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              
              <div className="space-y-1">
                <div className="block">
                  <AnimatedCounter value={8} suffix="+" />
                </div>
                <p className="text-[10px] text-[#FFF8F0]/75 dark:text-neutral-400 font-bold uppercase tracking-widest">
                  Years of Experience
                </p>
              </div>

              <div className="space-y-1">
                <div className="block">
                  <AnimatedCounter value={50000} suffix="+" />
                </div>
                <p className="text-[10px] text-[#FFF8F0]/75 dark:text-neutral-400 font-bold uppercase tracking-widest">
                  Happy Customers
                </p>
              </div>

              <div className="space-y-1">
                <div className="block">
                  <AnimatedCounter value={150000} suffix="+" />
                </div>
                <p className="text-[10px] text-[#FFF8F0]/75 dark:text-neutral-400 font-bold uppercase tracking-widest">
                  Cups of Coffee Served
                </p>
              </div>

              <div className="space-y-1">
                <div className="block">
                  <AnimatedCounter value={250} suffix="+" />
                </div>
                <p className="text-[10px] text-[#FFF8F0]/75 dark:text-neutral-400 font-bold uppercase tracking-widest">
                  Events Hosted
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-3 mb-16 max-w-xl mx-auto">
            <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-[#FFF3E3] dark:bg-[#2D1C19] px-3.5 py-1.5 rounded-full border border-[#E0D4C5]">
              What We Stand For
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Our Core Values
            </h2>
            <p className="text-xs sm:text-sm text-textMuted dark:text-neutral-400 leading-relaxed font-light">
              These principles guide everything we do — from the beans we select to the way we greet you at the door.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {values.map((value, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group rounded-3xl border border-[#E0D4C5]/40 bg-white dark:bg-[#281715]/45 p-6 shadow-sm hover:shadow-md transition-all hover:border-accent/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3E3] dark:bg-[#2D1C19] text-primary mb-4 group-hover:bg-accent group-hover:text-[#3E2723] transition-colors duration-300">
                  {value.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-xs text-textMuted dark:text-neutral-400 leading-relaxed font-light">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Team Section */}
        <section className="bg-[#FFF3E3]/40 dark:bg-transparent border-t border-b border-[#E0D4C5]/30 py-24 transition-all">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-16">
              <span className="text-xs font-extrabold text-accent uppercase tracking-widest bg-white dark:bg-[#281715] px-3.5 py-1.5 rounded-full border border-[#E0D4C5]">
                The People Behind The Beans
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                Meet Our Team
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, i) => (
                <div
                  key={i}
                  className="text-center rounded-[24px] border border-[#E0D4C5]/40 bg-white dark:bg-[#281715]/45 p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.01]"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary dark:bg-accent text-white dark:text-[#1B100E] text-xl font-bold font-serif mb-4 shadow-md">
                    {member.initials}
                  </div>
                  <h3 className="font-serif text-base font-bold text-foreground">{member.name}</h3>
                  <p className="text-xs text-textMuted dark:text-neutral-400 mt-1 font-light">{member.role}</p>
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
