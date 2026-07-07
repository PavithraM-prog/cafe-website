"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { User, Mail, Lock, ArrowRight, Loader2, Coffee } from "lucide-react";
import Link from "next/link";

function RegisterForm() {
  const { register, user, error, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push("/profile");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      setLocalLoading(true);
      const isSuccess = await register(name, email, password);
      if (isSuccess) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/login?redirect=${redirect === "/login" ? "/profile" : redirect}`);
        }, 2000);
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
        <h2 className="font-serif text-2xl font-bold text-foreground">Create Account</h2>
        <p className="text-xs text-textMuted leading-relaxed">
          Sign up to enjoy loyalty rewards and manage reservations.
        </p>
      </div>

      {success ? (
        <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center space-y-3">
          <h3 className="font-bold text-green-700">Registration Successful!</h3>
          <p className="text-xs text-green-600 leading-normal">
            Your account has been created. Redirecting to the Login page...
          </p>
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-green-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-textMuted uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-lg border border-borderColor bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary transition-all"
              />
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-textMuted" />
            </div>
          </div>

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
                placeholder="e.g. john@gmail.com"
                className="w-full rounded-lg border border-borderColor bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary transition-all"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-textMuted" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-textMuted uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-borderColor bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary transition-all"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-textMuted" />
            </div>
          </div>

          {/* Error notifications */}
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
                <span>Registering...</span>
              </>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}

      {!success && (
        <div className="text-center text-xs text-textMuted">
          Already have an account?{" "}
          <Link href={`/login?redirect=${redirect === "/login" ? "/profile" : redirect}`} className="font-bold text-primary hover:underline">
            Sign in here
          </Link>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />
      <div className="py-16 px-4 flex-1 flex items-center justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center py-10 space-y-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="text-xs text-textMuted">Loading register form...</span>
          </div>
        }>
          <RegisterForm />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
