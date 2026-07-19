"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toast, ToastType } from "@/components/ui/Toast";
import { submitContactForm } from "@/services/bookingService";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  User,
  MessageSquare,
  Tag,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#FFF8F0] dark:bg-[#1B100E] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 rounded-full border-4 border-[#E0D4C5]/40 border-t-accent animate-spin" />
      <p className="font-serif text-sm font-bold text-primary dark:text-[#F6ECE2] tracking-wide animate-pulse">
        Pouring Cozy Map...
      </p>
    </div>
  ),
});

const contactInfo = [
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Visit Us",
    details: ["AKC, Mogappair, Nerkundram", "Chennai, Tamil Nadu 600107"],
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Call Us",
    details: ["+1 (555) 789-COZY", "+1 (555) 789-2699"],
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email Us",
    details: ["hello@cozybeans.com", "events@cozybeans.com"],
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Working Hours",
    details: ["Mon - Fri: 7:00 AM - 8:00 PM", "Sat - Sun: 8:00 AM - 9:00 PM"],
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitLoading(true);
      await submitContactForm({ name, email, subject, message });
      setToast({ message: "Message sent successfully! We'll get back to you soon.", type: "success" });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setErrors({});
    } catch {
      setToast({ message: "Failed to send message. Please try again.", type: "error" });
    } finally {
      setSubmitLoading(false);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  } as const;

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 20 } }
  } as const;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        tagline="Get In Touch"
        title="Contact Us"
        description="Have a question, feedback, or want to plan an event? We'd love to hear from you."
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="page-enter">
        {/* Contact Info Cards */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {contactInfo.map((info, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group rounded-[24px] border border-[#E0D4C5]/40 bg-white dark:bg-[#281715]/45 p-6 shadow-sm hover:shadow-md transition-all hover:border-accent/40 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3E3] dark:bg-[#2D1C19] text-primary group-hover:bg-accent group-hover:text-[#3E2723] mb-4 transition-colors duration-300">
                  {info.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-foreground mb-2">
                  {info.title}
                </h3>
                {info.details.map((detail, j) => (
                  <p key={j} className="text-xs text-textMuted dark:text-neutral-400 font-light leading-relaxed">
                    {detail}
                  </p>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 glass border border-borderColor/40 p-6 sm:p-10 rounded-[32px] shadow-xl space-y-8"
            >
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold text-foreground">Send a Message</h2>
                <p className="text-xs text-textMuted dark:text-neutral-400 font-light">
                  Fill in the form below and our team will respond within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Name Input */}
                  <div className="space-y-1">
                    <div className={`relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 px-4 py-3 transition-all flex items-center ${
                      errors.name 
                        ? "border-red-400 focus-within:border-red-500" 
                        : "border-[#E0D4C5]/40 focus-within:border-accent"
                    }`}>
                      <User className="h-4.5 w-4.5 text-textMuted dark:text-neutral-500 mr-2.5 shrink-0" />
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                          }}
                          className="peer w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-transparent pt-2.5"
                          placeholder="Your Name"
                        />
                        <label className={`absolute left-0 top-0.5 pointer-events-none transition-all duration-200 text-xs text-textMuted/65 font-bold uppercase tracking-wider ${
                          name ? "-translate-y-2 text-[9px] text-accent" : "peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-xs peer-focus:-translate-y-2 peer-focus:text-[9px] peer-focus:text-accent"
                        }`}>
                          Full Name *
                        </label>
                      </div>
                    </div>
                    {errors.name && (
                      <p className="text-[10px] text-red-600 font-bold pl-2.5 pt-0.5">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <div className={`relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 px-4 py-3 transition-all flex items-center ${
                      errors.email 
                        ? "border-red-400 focus-within:border-red-500" 
                        : "border-[#E0D4C5]/40 focus-within:border-accent"
                    }`}>
                      <Mail className="h-4.5 w-4.5 text-textMuted dark:text-neutral-500 mr-2.5 shrink-0" />
                      <div className="relative flex-1">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                          }}
                          className="peer w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-transparent pt-2.5"
                          placeholder="Email Address"
                        />
                        <label className={`absolute left-0 top-0.5 pointer-events-none transition-all duration-200 text-xs text-textMuted/65 font-bold uppercase tracking-wider ${
                          email ? "-translate-y-2 text-[9px] text-accent" : "peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-xs peer-focus:-translate-y-2 peer-focus:text-[9px] peer-focus:text-accent"
                        }`}>
                          Email Address *
                        </label>
                      </div>
                    </div>
                    {errors.email && (
                      <p className="text-[10px] text-red-600 font-bold pl-2.5 pt-0.5">{errors.email}</p>
                    )}
                  </div>

                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <div className={`relative rounded-2xl border-2 bg-[#FFF8F0]/30 dark:bg-[#1F1210]/20 px-4 py-3 transition-all flex items-center ${
                    errors.subject 
                      ? "border-red-400 focus-within:border-red-500" 
                      : "border-[#E0D4C5]/40 focus-within:border-accent"
                  }`}>
                    <Tag className="h-4.5 w-4.5 text-textMuted dark:text-neutral-500 mr-2.5 shrink-0" />
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => {
                          setSubject(e.target.value);
                          if (errors.subject) setErrors((prev) => ({ ...prev, subject: "" }));
                        }}
                        className="peer w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-transparent pt-2.5"
                        placeholder="Subject"
                      />
                      <label className={`absolute left-0 top-0.5 pointer-events-none transition-all duration-200 text-xs text-textMuted/65 font-bold uppercase tracking-wider ${
                        subject ? "-translate-y-2 text-[9px] text-accent" : "peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-xs peer-focus:-translate-y-2 peer-focus:text-[9px] peer-focus:text-accent"
                      }`}>
                        Subject *
                      </label>
                    </div>
                  </div>
                  {errors.subject && (
                    <p className="text-[10px] text-red-600 font-bold pl-2.5 pt-0.5">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-textMuted dark:text-neutral-400 uppercase tracking-widest flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1.5 text-accent" />
                    <span>Your Message *</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
                    }}
                    placeholder="Tell us more about your query..."
                    rows={4}
                    className={`w-full rounded-2xl border bg-[#FFF8F0]/10 px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none transition-all resize-none font-light leading-relaxed ${
                      errors.message ? "border-red-400" : "border-borderColor/60 dark:border-[#3E2723]"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[10px] text-red-600 font-bold pl-2.5 pt-0.5">{errors.message}</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={submitLoading}
                  className="w-full flex items-center justify-center space-x-2 rounded-full py-4 bg-primary dark:bg-accent text-white dark:text-[#1B100E] text-sm font-extrabold uppercase tracking-widest shadow-lg transition-all focus:outline-none cursor-pointer"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ChevronRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Map */}
              <div 
                className="rounded-[28px] overflow-hidden shadow-xl border border-[#E0D4C5]/60 bg-white dark:bg-transparent relative"
                style={{ height: "380px" }}
              >
                <InteractiveMap />
              </div>

              {/* FAQ Quick Info */}
              <div className="rounded-[28px] border border-[#E0D4C5]/40 bg-white dark:bg-[#281715]/45 p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-foreground">Quick FAQ</h3>
                <div className="space-y-4">
                  {[
                    {
                      q: "Do you accept walk-ins?",
                      a: "Yes! Walk-ins are welcome. However, reservations are recommended for weekends and events.",
                    },
                    {
                      q: "Is parking available?",
                      a: "We have a dedicated parking lot with 20 spots. Free for all customers.",
                    },
                    {
                      q: "Do you cater for events?",
                      a: "Absolutely! Check out our Event Booking page for packages starting at ₹4,999.",
                    },
                  ].map((faq, i) => (
                    <div key={i} className="space-y-1">
                      <h4 className="text-xs font-extrabold text-foreground flex items-center space-x-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        <span>{faq.q}</span>
                      </h4>
                      <p className="text-xs text-textMuted dark:text-neutral-400 font-light leading-relaxed pl-3">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
