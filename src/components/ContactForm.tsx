"use client";

import React, { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

export const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Simulate API submission call
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 border border-borderColor bg-cardBg rounded-2xl shadow-sm h-full animate-in fade-in duration-300">
        <CheckCircle className="h-12 w-12 text-green-600 animate-bounce" />
        <h3 className="font-serif text-xl font-bold text-foreground">Message Sent!</h3>
        <p className="text-xs text-textMuted max-w-sm leading-relaxed">
          Thank you for reaching out. We will read your message and get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-6 py-2.5 transition-colors shadow-sm"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-borderColor bg-cardBg p-6 sm:p-8 rounded-2xl shadow-sm text-left">
      <h3 className="font-serif text-xl font-bold text-foreground mb-4 pb-2 border-b border-borderColor/60">
        Drop Us a Line
      </h3>
      
      {error && (
        <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-textMuted">Your Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-lg border border-borderColor bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary transition-all"
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-textMuted">Email Address *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@gmail.com"
            className="w-full rounded-lg border border-borderColor bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-textMuted">Subject *</label>
        <input
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Catering Request, Feedback"
          className="w-full rounded-lg border border-borderColor bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-textMuted">Message *</label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here..."
          className="w-full rounded-lg border border-borderColor bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center space-x-2 rounded-full bg-primary hover:bg-primary-hover disabled:bg-neutral-200 text-white text-sm font-semibold py-3 shadow-md transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
};
