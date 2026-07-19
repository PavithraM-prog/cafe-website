"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Toast, ToastType } from "@/components/ui/Toast";
import { submitContactForm } from "@/services/bookingService";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#F5EFE6] dark:bg-[#1B100E] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 rounded-full border-4 border-primary/25 border-t-accent animate-spin" />
      <p className="font-serif text-sm font-bold text-primary dark:text-[#F6ECE2] tracking-wide animate-pulse">
        Pouring Cozy Map...
      </p>
    </div>
  ),
});
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
} from "lucide-react";

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-borderColor bg-cardBg p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/30 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  {info.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-foreground mb-2">
                  {info.title}
                </h3>
                {info.details.map((detail, j) => (
                  <p key={j} className="text-xs text-textMuted leading-relaxed">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Contact Form */}
            <div className="lg:col-span-7 border border-borderColor bg-cardBg p-6 sm:p-10 rounded-2xl shadow-sm space-y-8">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold text-foreground">Send a Message</h2>
                <p className="text-xs text-textMuted">
                  Fill in the form below and our team will respond within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-textMuted flex items-center">
                      <User className="h-3.5 w-3.5 mr-1" />
                      Your Name <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      placeholder="John Doe"
                      className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all ${
                        errors.name ? "border-red-400" : "border-borderColor focus:border-primary"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-600 font-medium animate-slideDown">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-textMuted flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      Email <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      placeholder="john@example.com"
                      className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all ${
                        errors.email ? "border-red-400" : "border-borderColor focus:border-primary"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-600 font-medium animate-slideDown">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-textMuted flex items-center">
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    Subject <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (errors.subject) setErrors((prev) => ({ ...prev, subject: "" }));
                    }}
                    placeholder="What's this about?"
                    className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all ${
                      errors.subject ? "border-red-400" : "border-borderColor focus:border-primary"
                    }`}
                  />
                  {errors.subject && (
                    <p className="text-[11px] text-red-600 font-medium animate-slideDown">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-textMuted flex items-center">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Message <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
                    }}
                    placeholder="Tell us more about your query..."
                    rows={5}
                    className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground transition-all resize-none ${
                      errors.message ? "border-red-400" : "border-borderColor focus:border-primary"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-600 font-medium animate-slideDown">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full flex items-center justify-center space-x-2 rounded-full bg-primary hover:bg-primary-hover disabled:bg-neutral-300 disabled:cursor-not-allowed text-white text-sm font-semibold py-3.5 shadow-md transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] focus:outline-none"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="lg:col-span-5 space-y-6">
              {/* Map */}
              <div 
                className="rounded-2xl overflow-hidden shadow-xl border border-borderColor bg-cardBg relative"
                style={{ height: "380px" }}
              >
                <InteractiveMap />
              </div>

              {/* FAQ Quick Info */}
              <div className="rounded-2xl border border-borderColor bg-cardBg p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-foreground">Quick FAQ</h3>
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
                    a: "Absolutely! Check out our Event Booking page for packages starting at ₹299.",
                  },
                ].map((faq, i) => (
                  <div key={i} className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">{faq.q}</h4>
                    <p className="text-xs text-textMuted leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
