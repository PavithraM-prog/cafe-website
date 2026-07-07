"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, ArrowRight, CheckCircle, Coffee } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <div className="py-16 px-4 flex-1 flex items-center justify-center">
        <div className="mx-auto max-w-md w-full border border-borderColor bg-cardBg p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
          <div className="text-center space-y-2">
            <Coffee className="mx-auto h-10 w-10 text-accent" />
            <h2 className="font-serif text-2xl font-bold text-foreground">Forgot Password</h2>
            <p className="text-xs text-textMuted leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center space-y-3">
              <CheckCircle className="mx-auto h-10 w-10 text-green-600 animate-bounce" />
              <h3 className="font-bold text-green-700">Check Your Inbox</h3>
              <p className="text-xs text-green-600 leading-relaxed">
                If an account exists for <strong>{email}</strong>, we have sent a password reset link to your email.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-block text-xs font-bold text-primary hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textMuted uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full rounded-lg border border-borderColor bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary transition-all"
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-textMuted" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-3 shadow-md transition-colors"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {!submitted && (
            <div className="text-center text-xs text-textMuted">
              Remember your password?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
