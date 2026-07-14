"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  UserCheck,
  Search,
  Plus,
  Loader2,
  Edit2,
  Trash2,
  X,
  Check,
  Clock,
  Briefcase,
  Mail,
  Calendar,
  LogIn,
  LogOut,
  Play
} from "lucide-react";

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string; // BARISTA, CHEF, SERVER, MANAGER
  createdAt: string;
}

interface AttendanceLog {
  id: string;
  staffId: string;
  date: string;
  loginTime: string;
  logoutTime: string | null;
  staff: Staff;
}

export default function AdminStaffPage() {
  const [activeTab, setActiveTab] = useState<"list" | "attendance">("list");
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStaff, setUpdatingStaff] = useState<Record<string, boolean>>({});
  
  // Filters
  const [staffSearch, setStaffSearch] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);

  // Modals
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Form Fields
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState("BARISTA");

  // Fetch Staff List
  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/staff?search=${encodeURIComponent(staffSearch)}`);
      if (res.ok) {
        const data = await res.json();
        setStaffList(data.staff || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [staffSearch]);

  // Fetch Attendance Logs
  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/attendance?date=${attendanceDate}`);
      if (res.ok) {
        const data = await res.json();
        setAttendanceLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [attendanceDate]);

  useEffect(() => {
    if (activeTab === "list") {
      fetchStaff();
    } else {
      fetchAttendance();
    }
  }, [activeTab, fetchStaff, fetchAttendance]);

  // Handle Hiring/Editing Staff
  const handleStaffSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffEmail || !staffRole) return;

    try {
      const url = "/api/admin/staff";
      const method = editMode ? "PUT" : "POST";
      const bodyPayload = editMode
        ? { id: selectedStaff?.id, name: staffName, email: staffEmail, role: staffRole }
        : { name: staffName, email: staffEmail, role: staffRole };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (res.ok) {
        setStaffModalOpen(false);
        setStaffName("");
        setStaffEmail("");
        setStaffRole("BARISTA");
        setEditMode(false);
        setSelectedStaff(null);
        fetchStaff();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save staff details.");
      }
    } catch (e) {
      console.error(e);
    }
  }, [staffName, staffEmail, staffRole, editMode, selectedStaff, fetchStaff]);

  const openAddStaff = () => {
    setEditMode(false);
    setSelectedStaff(null);
    setStaffName("");
    setStaffEmail("");
    setStaffRole("BARISTA");
    setStaffModalOpen(true);
  };

  const openEditStaff = (staff: Staff) => {
    setEditMode(true);
    setSelectedStaff(staff);
    setStaffName(staff.name);
    setStaffEmail(staff.email);
    setStaffRole(staff.role);
    setStaffModalOpen(true);
  };

  const handleDeleteStaff = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    setUpdatingStaff((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/admin/staff?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchStaff();
      } else {
        alert("Failed to delete staff member.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStaff((prev) => ({ ...prev, [id]: false }));
    }
  }, [fetchStaff]);

  // Clock-in / Clock-out control
  const handleClockIn = useCallback(async (staffId: string) => {
    setUpdatingStaff((prev) => ({ ...prev, [staffId]: true }));
    try {
      const res = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId,
          date: attendanceDate,
          loginTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        fetchAttendance();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to clock in.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStaff((prev) => ({ ...prev, [staffId]: false }));
    }
  }, [attendanceDate, fetchAttendance]);

  const handleClockOut = useCallback(async (logId: string) => {
    setUpdatingStaff((prev) => ({ ...prev, [logId]: true }));
    try {
      const res = await fetch("/api/admin/attendance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: logId,
          logoutTime: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        fetchAttendance();
      } else {
        alert("Failed to clock out.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStaff((prev) => ({ ...prev, [logId]: false }));
    }
  }, [fetchAttendance]);

  // Helper formatting total work hours
  const calculateWorkHours = (login: string, logout: string | null) => {
    if (!logout) return "In Progress";
    const diffMs = new Date(logout).getTime() - new Date(login).getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    return `${diffHrs.toFixed(1)} hrs`;
  };

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case "BARISTA":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CHEF":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "SERVER":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "MANAGER":
        return "bg-orange-50 text-[#8c6239] border-orange-200";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2d1e18]">Staff & Attendance</h1>
          <p className="text-xs text-[#705e55] mt-1 font-medium">Manage cafe workers, assign roles, and audit clock-in sheet logs.</p>
        </div>

        {activeTab === "list" && (
          <button
            onClick={openAddStaff}
            className="flex items-center space-x-2 bg-[#8c6239] hover:bg-[#734f2d] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Hire/Add Worker</span>
          </button>
        )}
      </div>

      {/* Main Tabs Selector */}
      <div className="bg-white border border-[#e8dfd7] p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Navigation Tabs */}
        <div className="flex bg-[#f2ede4] p-1 rounded-xl border border-[#e8dfd7] self-start text-xs font-semibold">
          <button
            onClick={() => setActiveTab("list")}
            className={`rounded-lg px-4 py-2 transition-all flex items-center space-x-1.5 ${
              activeTab === "list" ? "bg-white text-[#2d1e18] shadow-sm font-bold" : "text-[#705e55]"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Staff Directory</span>
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`rounded-lg px-4 py-2 transition-all flex items-center space-x-1.5 ${
              activeTab === "attendance" ? "bg-white text-[#2d1e18] shadow-sm font-bold" : "text-[#705e55]"
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Attendance Sheets</span>
          </button>
        </div>

        {/* Dynamic Filters depending on active tab */}
        <div className="w-full md:w-auto">
          {activeTab === "list" ? (
            /* Staff Search */
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#705e55]" />
              <input
                type="text"
                placeholder="Search staff name or role..."
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-[#2d1e18] placeholder-[#705e55]/60 focus:border-[#8c6239] transition-all"
              />
            </div>
          ) : (
            /* Attendance Date Picker */
            <div className="flex items-center space-x-2 bg-[#f2ede4] border border-[#e8dfd7] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2d1e18] w-fit">
              <Calendar className="h-4 w-4 text-[#8c6239] shrink-0" />
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="bg-transparent border-none outline-none font-bold cursor-pointer text-[#2d1e18]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Loading Block */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-3 bg-white rounded-2xl border border-[#e8dfd7] shadow-sm">
          <Loader2 className="h-8 w-8 text-[#8c6239] animate-spin" />
          <span className="text-xs text-[#705e55] font-semibold">Updating folder directory...</span>
        </div>
      )}

      {/* Main Tab Contents */}
      {!loading && (
        <>
          {activeTab === "list" ? (
            /* Tab 1: Staff Directory List */
            <div className="bg-white border border-[#e8dfd7] rounded-2xl shadow-sm overflow-hidden">
              {staffList.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs leading-normal">
                    <thead>
                      <tr className="bg-[#faf8f5] text-[#705e55] font-bold uppercase tracking-wider border-b border-[#e8dfd7]">
                        <th className="px-6 py-4 font-semibold">Name</th>
                        <th className="px-6 py-4 font-semibold">Email</th>
                        <th className="px-6 py-4 font-semibold">Role</th>
                        <th className="px-6 py-4 font-semibold">Hired Date</th>
                        <th className="px-6 py-4 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ede4] font-medium text-[#705e55]">
                      {staffList.map((staff) => (
                        <tr key={staff.id} className="hover:bg-[#faf8f5]/40 transition-colors">
                          <td className="px-6 py-4 text-[#2d1e18] font-bold">{staff.name}</td>
                          <td className="px-6 py-4 font-semibold">
                            <span className="flex items-center space-x-1.5">
                              <Mail className="h-3.5 w-3.5 text-[#a49187]" />
                              <span>{staff.email}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block border px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${getRoleColor(
                                staff.role
                              )}`}
                            >
                              {staff.role.toLowerCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {new Date(staff.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2 shrink-0">
                            <button
                              onClick={() => openEditStaff(staff)}
                              className="p-1.5 rounded-lg hover:bg-[#f2ede4] text-[#8c6239] hover:text-[#734f2d] transition-all"
                              title="Edit Profile"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(staff.id)}
                              disabled={updatingStaff[staff.id]}
                              className="p-1.5 rounded-lg hover:bg-[#f2ede4] text-red-500 hover:text-red-700 transition-all disabled:opacity-50"
                              title="Fire Staff"
                            >
                              {updatingStaff[staff.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20 italic text-xs text-[#705e55] font-semibold bg-white">
                  No staff members registered in directory.
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Attendance Sheets */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (8 cols): Today's Logs */}
              <div className="lg:col-span-8 bg-white border border-[#e8dfd7] rounded-2xl shadow-sm p-6 space-y-4">
                <h3 className="font-serif font-bold text-base text-[#2d1e18] border-b border-[#f2ede4] pb-2">
                  Logs for {new Date(attendanceDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </h3>

                {attendanceLogs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs leading-normal">
                      <thead>
                        <tr className="text-[#705e55] font-bold uppercase tracking-wider border-b border-[#e8dfd7]">
                          <th className="pb-3 font-semibold">Staff Name</th>
                          <th className="pb-3 font-semibold">Check-in</th>
                          <th className="pb-3 font-semibold">Check-out</th>
                          <th className="pb-3 font-semibold">Work Hours</th>
                          <th className="pb-3 text-right font-semibold">Quick Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f2ede4] font-medium text-[#705e55]">
                        {attendanceLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-[#faf8f5]/40 transition-colors">
                            <td className="py-3.5">
                              <span className="block text-xs font-bold text-[#2d1e18] leading-tight">{log.staff?.name}</span>
                              <span className="block text-[8px] uppercase tracking-wider text-[#a49187] mt-0.5">{log.staff?.role}</span>
                            </td>
                            <td className="py-3.5">
                              <span className="flex items-center space-x-1 font-sans">
                                <LogIn className="h-3.5 w-3.5 text-emerald-500 mr-1" />
                                {new Date(log.loginTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </td>
                            <td className="py-3.5 font-sans">
                              {log.logoutTime ? (
                                <span className="flex items-center space-x-1">
                                  <LogOut className="h-3.5 w-3.5 text-red-400 mr-1" />
                                  {new Date(log.logoutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-wide">
                                  On Duty
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 font-sans font-bold">
                              {calculateWorkHours(log.loginTime, log.logoutTime)}
                            </td>
                            <td className="py-3.5 text-right">
                              {!log.logoutTime && attendanceDate === new Date().toISOString().split("T")[0] && (
                                <button
                                  onClick={() => handleClockOut(log.id)}
                                  disabled={updatingStaff[log.id]}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm transition-all disabled:opacity-50"
                                >
                                  {updatingStaff[log.id] ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1 inline-block" />
                                  ) : null}
                                  <span>Clock Out</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-16 text-xs text-[#705e55] italic font-semibold">
                    No attendance records for this date.
                  </p>
                )}
              </div>

              {/* Right Column (4 cols): Active Duty Check-in board (Today Only) */}
              <div className="lg:col-span-4 bg-white border border-[#e8dfd7] rounded-2xl shadow-sm p-6 space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#2d1e18]">Duty Clock-In Panel</h3>
                  <p className="text-[10px] text-[#705e55] font-medium mt-0.5">Quick register check-in for on-site staff.</p>
                </div>

                <div className="space-y-3.5 pt-2 max-h-[45vh] overflow-y-auto">
                  {staffList.length > 0 ? (
                    staffList.map((staff) => {
                      // Check if currently checked in today (logs for today without logout time)
                      const isClockedIn = attendanceLogs.some(
                        (log) => log.staffId === staff.id && !log.logoutTime
                      );

                      return (
                        <div
                          key={staff.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-[#e8dfd7] bg-[#faf8f5] hover:border-[#8c6239] transition-all"
                        >
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-[#2d1e18] truncate leading-tight">{staff.name}</span>
                            <span className="block text-[8px] uppercase tracking-wider text-[#705e55] mt-1 font-bold">
                              {staff.role}
                            </span>
                          </div>
                          <div>
                            {isClockedIn ? (
                              <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wide">
                                Active Duty
                              </span>
                            ) : (
                              <button
                                onClick={() => handleClockIn(staff.id)}
                                disabled={updatingStaff[staff.id]}
                                className="flex items-center space-x-1 bg-[#8c6239] hover:bg-[#734f2d] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm transition-all disabled:opacity-50"
                              >
                                {updatingStaff[staff.id] ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Play className="h-3 w-3 fill-current" />
                                )}
                                <span>Clock In</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center py-6 text-xs text-[#705e55] italic">Load directory first to clock workers.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Staff Profile Modal (Add/Edit) */}
      {staffModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1d140e]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleStaffSubmit}
            className="bg-white border border-[#e8dfd7] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="bg-[#faf8f5] border-b border-[#e8dfd7] px-6 py-4 flex justify-between items-center">
              <h3 className="font-serif font-bold text-base text-[#2d1e18]">
                {editMode ? "Edit Staff Details" : "Register / Hire Staff"}
              </h3>
              <button
                type="button"
                onClick={() => setStaffModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#f2ede4] text-[#705e55]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Worker Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alice Cooper"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#2d1e18] placeholder-[#705e55]/40"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alice@cozybeans.com"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#2d1e18] placeholder-[#705e55]/40"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Cafe Role</label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#2d1e18] cursor-pointer"
                >
                  <option value="BARISTA">Barista (Coffee specialist)</option>
                  <option value="CHEF">Chef (Snacks & baking)</option>
                  <option value="SERVER">Server (Table service)</option>
                  <option value="MANAGER">Manager (Operations supervisor)</option>
                </select>
              </div>
            </div>

            <div className="bg-[#faf8f5] border-t border-[#e8dfd7] px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setStaffModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#e8dfd7] text-[#705e55] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#8c6239] hover:bg-[#734f2d] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md flex items-center space-x-1.5"
              >
                <Check className="h-4 w-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
