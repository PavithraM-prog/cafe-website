"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu as MenuIcon, X, Coffee, User, LogOut, LayoutDashboard, CalendarCheck } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isAdmin = user?.role === "ADMIN" || user?.role === "STAFF";

  const allNavLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Table Booking", href: "/table-booking" },
    { name: "Event Booking", href: "/event-booking" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Hide ordering-related links for admin/staff users
  const navLinks = isAdmin
    ? allNavLinks.filter((link) => !["Menu", "Table Booking", "Event Booking"].includes(link.name))
    : allNavLinks;

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-borderColor/40 transition-all duration-300 ${
      scrolled 
        ? "bg-white/80 dark:bg-[#1C100E]/80 backdrop-blur-md py-1.5 shadow-md" 
        : "bg-white/95 dark:bg-[#1C100E]/95 py-3.5 shadow-sm"
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-14" : "h-20"
        }`}>
          {/* Logo */}
          <div className="flex">
            <Link href="/" className="flex items-center space-x-2 text-primary font-bold text-2xl hover:scale-[1.02] transition-transform duration-300">
              <Coffee className="h-7 w-7 text-accent" />
              <span className="font-serif tracking-tight">Cozy Beans</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`group text-xs font-bold uppercase tracking-widest transition-colors relative py-2 ${
                  isActive(link.href) ? "text-primary" : "text-textMuted hover:text-primary"
                }`}
              >
                <span>{link.name}</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2.5px] bg-accent rounded-full transition-transform duration-300 transform origin-left ${
                    isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart Icon - hidden for admin/staff */}
            {!isAdmin && (
              <Link href="/cart" className="relative p-2 text-textMuted hover:text-primary transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Buttons / Profile Dropdown */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Admin Link if role is Admin/Staff */}
                {(user.role === "ADMIN" || user.role === "STAFF") && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-accent border border-accent hover:bg-accent hover:text-white px-3 py-1.5 rounded-full transition-all"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {!isAdmin && (
                  <Link
                    href="/my-bookings"
                    className="flex items-center space-x-1 text-sm font-medium text-textMuted hover:text-primary transition-colors"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    <span>My Bookings</span>
                  </Link>
                )}

                <Link
                  href="/profile"
                  className="flex items-center space-x-1 text-sm font-medium text-textMuted hover:text-primary transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{user.name.split(" ")[0]}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-textMuted hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-primary hover:bg-primary-hover px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Cart - hidden for admin/staff */}
            {!isAdmin && (
              <Link href="/cart" className="relative p-2 text-textMuted">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-textMuted hover:text-primary focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-borderColor bg-background px-4 pt-4 pb-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium px-2 py-1.5 rounded-md hover:bg-secondary ${
                  isActive(link.href) ? "text-primary bg-secondary" : "text-textMuted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <hr className="border-borderColor" />

          {/* User Links */}
          <div className="flex flex-col space-y-3">
            {user ? (
              <>
                <div className="px-2 text-sm text-textMuted font-semibold">
                  Hello, {user.name} ({user.loyaltyPoints} points)
                </div>
                {(user.role === "ADMIN" || user.role === "STAFF") && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-base font-medium text-accent px-2 py-1.5 rounded-md hover:bg-secondary"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                {!isAdmin && (
                  <Link
                    href="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-base font-medium text-textMuted px-2 py-1.5 rounded-md hover:bg-secondary"
                  >
                    <CalendarCheck className="h-5 w-5" />
                    <span>My Bookings</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-base font-medium text-textMuted px-2 py-1.5 rounded-md hover:bg-secondary"
                >
                  <User className="h-5 w-5" />
                  <span>My Profile & Orders</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-2 text-base font-medium text-red-600 px-2 py-1.5 rounded-md hover:bg-red-50 text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center rounded-full border border-borderColor py-2.5 text-center text-sm font-medium text-textMuted hover:bg-secondary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center rounded-full bg-primary py-2.5 text-center text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
