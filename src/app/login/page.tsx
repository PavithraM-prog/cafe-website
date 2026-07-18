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
      if (user.role === "admin" || user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(redirect);
      }
    }
  }, [user, loading, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLocalLoading(true);
      const loggedInUser = await login(email, password);
      if (loggedInUser) {
        if (loggedInUser.role === "admin" || loggedInUser.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push(redirect);
        }
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md w-full border border-borderColor/40 bg-cardBg p-8 sm:p-10 rounded-3xl shadow-xl space-y-6 animate-fade-in-up">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3.5 bg-white border border-borderColor/40 rounded-2xl shadow-sm mb-2 text-accent">
          <Coffee className="h-8 w-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-foreground">Welcome Back</h2>
        <p className="text-xs text-textMuted leading-relaxed font-light">
          Log in to check orders, table bookings, and loyalty points.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted block">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@gmail.com"
              className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent"
            />
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-textMuted" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold uppercase tracking-wider text-textMuted block">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
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
              className="w-full rounded-xl border border-borderColor bg-[#FFF8E7]/10 focus:bg-white pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent"
            />
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-textMuted" />
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-3.5 rounded-xl font-semibold text-center leading-relaxed">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={localLoading}
          className="w-full flex items-center justify-center space-x-2 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-widest py-3.5 shadow-lg transition-all duration-300 hover:scale-[1.005] active:scale-95 disabled:opacity-50"
        >
          {localLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4 text-white" />
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

      <div className="border-t border-borderColor/40 pt-4 text-center">
        <p className="text-[10px] text-textMuted bg-[#FFF8E7] rounded-2xl border border-borderColor/40 p-3.5 italic leading-relaxed font-light">
          <strong>Demo credentials:</strong> Admin: <code className="font-bold">admin@cozybeans.com</code> (password: <code className="font-bold">adminpassword</code>) <br/> Customer: <code className="font-bold">john@gmail.com</code> (password: <code className="font-bold">password123</code>)
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
