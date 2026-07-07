"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Utensils,
  ClipboardList,
  Calendar,
  Star,
  Settings,
  ArrowLeft,
  LogOut,
  Coffee,
  Menu as MenuIcon,
  X,
  User
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Menu Manager", href: "/admin/menu", icon: Utensils },
    { name: "Live Orders", href: "/admin/orders", icon: ClipboardList },
    { name: "Reservations", href: "/admin/reservations", icon: Calendar },
    { name: "Reviews Mod", href: "/admin/reviews", icon: Star },
    { name: "Promos & Settings", href: "/admin/content", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row text-neutral-800 font-sans antialiased">
      {/* Mobile Header Bar */}
      <div className="flex md:hidden items-center justify-between bg-neutral-900 text-white px-4 py-4 shrink-0 shadow-md">
        <Link href="/" className="flex items-center space-x-2 text-white font-bold text-lg">
          <Coffee className="h-5 w-5 text-amber-400" />
          <span className="font-serif">Cozy Beans Admin</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 text-neutral-300 hover:text-white focus:outline-none"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-neutral-900 text-neutral-200 transform transition-transform duration-300 ease-in-out md:relative md:transform-none shrink-0 flex flex-col justify-between ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Logo & Close Button (Mobile Only) */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl">
              <Coffee className="h-6 w-6 text-amber-400" />
              <span className="font-serif">Cozy Admin</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-neutral-400 hover:text-white focus:outline-none md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Operations */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          {/* Back to Public Site link */}
          <Link
            href="/"
            className="flex items-center space-x-3 rounded-lg px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to Public Site</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-neutral-800 hover:text-red-300 transition-all text-left"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop bar */}
        <header className="hidden md:flex h-16 items-center justify-between bg-white border-b border-neutral-200 px-8 shrink-0">
          <span className="font-serif text-lg font-bold text-neutral-700">Management Workspace</span>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
              <User className="h-4 w-4 text-amber-700" />
            </div>
            <div className="text-left leading-tight">
              <span className="block text-xs font-bold text-neutral-800">{user?.name || "Admin"}</span>
              <span className="block text-[10px] text-neutral-500 font-medium uppercase tracking-widest">{user?.role}</span>
            </div>
          </div>
        </header>

        {/* Inner Page content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
