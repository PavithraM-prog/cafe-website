"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      setSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="py-4 text-center space-y-2 animate-in fade-in duration-300">
        <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-semibold">
          ✓ Welcome to the Cozy Club!
        </span>
        <p className="text-xs text-textMuted leading-relaxed max-w-sm mx-auto">
          We've sent a welcome email to your inbox containing your <strong>free cookie coupon code</strong>!
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubscribe}
      className="mx-auto max-w-md flex flex-col sm:flex-row items-center gap-3 pt-4"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="w-full rounded-full border border-borderColor bg-background px-5 py-3 text-sm text-foreground focus:border-primary transition-all shadow-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto shrink-0 rounded-full bg-primary hover:bg-primary-hover disabled:bg-neutral-200 text-white text-sm font-semibold px-6 py-3 transition-colors shadow-sm flex items-center justify-center space-x-1"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Subscribing...</span>
          </>
        ) : (
          <span>Subscribe</span>
        )}
      </button>
    </form>
  );
};
