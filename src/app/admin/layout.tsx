"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Users,
  UserCheck,
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
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders queue", href: "/admin/orders", icon: ClipboardList },
    { name: "Reservations", href: "/admin/reservations", icon: Calendar },
    { name: "Loyalty Members", href: "/admin/loyalty", icon: Users },
    { name: "Staff Management", href: "/admin/staff", icon: UserCheck },
    { name: "Profile & Settings", href: "/admin/settings", icon: Settings },
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
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-[#faf8f5] flex flex-col md:flex-row text-[#2d1e18] font-sans antialiased">
      {/* Mobile Header Bar */}
      <div className="flex md:hidden items-center justify-between bg-[#1d140e] text-white px-4 py-4 shrink-0 shadow-md">
        <Link href="/" className="flex items-center space-x-2 text-white font-bold text-lg">
          <Coffee className="h-5 w-5 text-amber-500" />
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
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1d140e] text-[#f2ede4] transform transition-transform duration-300 ease-in-out md:relative md:transform-none shrink-0 flex flex-col justify-between ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Logo & Close Button (Mobile Only) */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl">
              <Coffee className="h-6 w-6 text-amber-500" />
              <span className="font-serif tracking-wide">Cozy Admin</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-[#a49187] hover:text-[#f4eae1] focus:outline-none md:hidden"
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
                  className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive(item.href)
                      ? "bg-[#8c6239] text-[#faf8f5] shadow-md border-l-4 border-amber-500"
                      : "text-[#a49187] hover:bg-[#2c1e15] hover:text-[#f4eae1]"
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
        <div className="p-4 border-t border-[#2c1e15] space-y-2">
          {/* Back to Public Site link */}
          <Link
            href="/"
            className="flex items-center space-x-3 rounded-lg px-4 py-2.5 text-xs font-semibold text-[#a49187] hover:bg-[#2c1e15] hover:text-[#f4eae1] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to Public Site</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-[#2c1e15] hover:text-red-300 transition-all text-left"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#faf8f5]">
        {/* Top Desktop bar */}
        <header className="hidden md:flex h-16 items-center justify-between bg-white border-b border-[#e8dfd7] px-8 shrink-0">
          <span className="font-serif text-lg font-bold text-[#2d1e18]">Management Workspace</span>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-[#f2ede4] text-[#8c6239] flex items-center justify-center font-bold text-xs shrink-0 border border-[#e8dfd7]">
              <User className="h-4 w-4 text-[#8c6239]" />
            </div>
            <div className="text-left leading-tight">
              <span className="block text-xs font-bold text-[#2d1e18]">{user?.name || "Admin"}</span>
              <span className="block text-[9px] text-[#8c6239] font-bold uppercase tracking-widest">{user?.role || "ADMIN"}</span>
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
