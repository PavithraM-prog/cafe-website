"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Lock, Mail, ArrowRight, Loader2, Coffee } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const { login, user, error, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  // If user is already logged in, redirect immediately
  useEffect(() => {
    if (user && !loading) {
      router.push(redirect);
    }
  }, [user, loading, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLocalLoading(true);
      const success = await login(email, password);
      if (success) {
        router.push(redirect);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md w-full border border-borderColor bg-cardBg p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
      <div className="text-center space-y-2">
        <Coffee className="mx-auto h-10 w-10 text-accent" />
        <h2 className="font-serif text-2xl font-bold text-foreground">Welcome Back</h2>
        <p className="text-xs text-textMuted leading-relaxed">
          Log in to check orders, table bookings, and loyalty points.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
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
              placeholder="e.g. customer@gmail.com"
              className="w-full rounded-lg border border-borderColor bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary transition-all"
            />
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-textMuted" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-textMuted uppercase tracking-wider block">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-bold text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-borderColor bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary transition-all"
            />
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-textMuted" />
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-lg font-semibold text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={localLoading}
          className="w-full flex items-center justify-center space-x-2 rounded-full bg-primary hover:bg-primary-hover disabled:bg-neutral-200 text-white text-sm font-semibold py-3 shadow-md transition-colors"
        >
          {localLoading ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-textMuted">
        Don't have an account?{" "}
        <Link href={`/register?redirect=${redirect}`} className="font-bold text-primary hover:underline">
          Register here
        </Link>
      </div>

      <div className="border-t border-borderColor/60 pt-4 text-center">
        <p className="text-[10px] text-textMuted bg-secondary/50 rounded p-2 italic leading-relaxed">
          <strong>Demo credentials:</strong> Admin: <code>admin@cozybeans.com</code> (password: <code>adminpassword</code>) | Customer: <code>john@gmail.com</code> (password: <code>password123</code>)
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />
      <div className="py-16 px-4 flex-1 flex items-center justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center py-10 space-y-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="text-xs text-textMuted">Loading login form...</span>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
