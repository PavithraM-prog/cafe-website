"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Settings,
  Mail,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

export default function AdminSettingsPage() {
  const { user, refreshUser } = useAuth();

  // Profile Form States
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Form States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Password Visibility toggles
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Sync profile details if auth context loads late
  React.useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName || !profileEmail) return;

    try {
      setProfileLoading(true);
      setProfileSuccess("");
      setProfileError("");

      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName,
          email: profileEmail,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfileSuccess("Your profile details have been updated successfully!");
        await refreshUser(); // Refresh the AuthContext state
      } else {
        setProfileError(data.error || "Failed to update profile.");
      }
    } catch (e) {
      setProfileError("An error occurred. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess("Your password has been changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(data.error || "Failed to change password.");
      }
    } catch (e) {
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2d1e18]">Profile & Settings</h1>
        <p className="text-xs text-[#705e55] mt-1 font-medium">Update admin identity, manage contact details, and secure credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Card */}
        <div className="bg-white border border-[#e8dfd7] rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
          <form onSubmit={handleUpdateProfile} className="flex-1 flex flex-col justify-between">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center space-x-3 border-b border-[#f2ede4] pb-4">
                <div className="h-10 w-10 bg-[#f2ede4] text-[#8c6239] rounded-2xl flex items-center justify-center border border-[#e8dfd7] shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#2d1e18]">Personal Details</h3>
                  <p className="text-[10px] text-[#705e55] font-medium">Manage your name and email on the system.</p>
                </div>
              </div>

              {/* Status Messages */}
              {profileSuccess && (
                <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 text-xs p-3.5 rounded-xl border border-emerald-100 font-semibold">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}
              {profileError && (
                <div className="flex items-center space-x-2 bg-red-50 text-red-700 text-xs p-3.5 rounded-xl border border-red-100 font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-[#705e55]/50" />
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-[#2d1e18]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#705e55]/50" />
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-[#2d1e18]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Authorized Role</span>
                  <div className="bg-[#faf8f5] border border-[#e8dfd7] rounded-xl p-3 text-xs font-bold text-[#2d1e18]/70 flex justify-between items-center">
                    <span>{user?.role || "ADMIN"}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f2ede4] text-[#8c6239] border border-[#e8dfd7]">
                      Security Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Footer */}
            <div className="bg-[#faf8f5] border-t border-[#e8dfd7] px-6 py-4 flex justify-end">
              <button
                type="submit"
                disabled={profileLoading}
                className="bg-[#8c6239] hover:bg-[#734f2d] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {profileLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Save Profile Details</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white border border-[#e8dfd7] rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
          <form onSubmit={handleChangePassword} className="flex-1 flex flex-col justify-between">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center space-x-3 border-b border-[#f2ede4] pb-4">
                <div className="h-10 w-10 bg-[#f2ede4] text-[#8c6239] rounded-2xl flex items-center justify-center border border-[#e8dfd7] shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#2d1e18]">Security & Password</h3>
                  <p className="text-[10px] text-[#705e55] font-medium">Update credentials to keep the panel secure.</p>
                </div>
              </div>

              {/* Status Messages */}
              {passwordSuccess && (
                <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 text-xs p-3.5 rounded-xl border border-emerald-100 font-semibold">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}
              {passwordError && (
                <div className="flex items-center space-x-2 bg-red-50 text-red-700 text-xs p-3.5 rounded-xl border border-red-100 font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Current Password</label>
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl py-2.5 px-4 text-xs font-semibold text-[#2d1e18] placeholder-[#705e55]/30 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="absolute right-3.5 top-3 text-[#705e55]/60 hover:text-[#2d1e18] transition-all"
                    >
                      {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl py-2.5 px-4 text-xs font-semibold text-[#2d1e18] placeholder-[#705e55]/30 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-3 text-[#705e55]/60 hover:text-[#2d1e18] transition-all"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl py-2.5 px-4 text-xs font-semibold text-[#2d1e18] placeholder-[#705e55]/30 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-3 text-[#705e55]/60 hover:text-[#2d1e18] transition-all"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Footer */}
            <div className="bg-[#faf8f5] border-t border-[#e8dfd7] px-6 py-4 flex justify-end">
              <button
                type="submit"
                disabled={passwordLoading}
                className="bg-[#8c6239] hover:bg-[#734f2d] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
