"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Plus,
  Loader2,
  Edit2,
  Trash2,
  PlusCircle,
  MinusCircle,
  X,
  Check,
  CreditCard,
  Mail,
  Award
} from "lucide-react";

interface LoyaltyMember {
  id: string;
  name: string;
  email: string;
  points: number;
  createdAt: string;
}

export default function AdminLoyaltyPage() {
  const [members, setMembers] = useState<LoyaltyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pointsModalOpen, setPointsModalOpen] = useState(false);

  // Form States
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPoints, setMemberPoints] = useState(0);
  const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null);
  const [pointsAdjustment, setPointsAdjustment] = useState(0);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/loyalty?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberEmail) return;

    try {
      const res = await fetch("/api/admin/loyalty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: memberName,
          email: memberEmail,
          points: memberPoints,
        }),
      });

      if (res.ok) {
        setAddModalOpen(false);
        setMemberName("");
        setMemberEmail("");
        setMemberPoints(0);
        fetchMembers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to register member.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !memberName || !memberEmail) return;

    try {
      const res = await fetch("/api/admin/loyalty", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedMember.id,
          name: memberName,
          email: memberEmail,
          points: memberPoints,
        }),
      });

      if (res.ok) {
        setEditModalOpen(false);
        setSelectedMember(null);
        setMemberName("");
        setMemberEmail("");
        fetchMembers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update member.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdjustPoints = async (amount: number) => {
    if (!selectedMember) return;
    const finalPoints = Math.max(0, selectedMember.points + amount);

    try {
      const res = await fetch("/api/admin/loyalty", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedMember.id,
          name: selectedMember.name,
          email: selectedMember.email,
          points: finalPoints,
        }),
      });

      if (res.ok) {
        setPointsModalOpen(false);
        setSelectedMember(null);
        setPointsAdjustment(0);
        fetchMembers();
      } else {
        alert("Failed to adjust points.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this loyalty card user?")) return;

    try {
      const res = await fetch(`/api/admin/loyalty?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchMembers();
      } else {
        alert("Failed to delete member.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openEditModal = (member: LoyaltyMember) => {
    setSelectedMember(member);
    setMemberName(member.name);
    setMemberEmail(member.email);
    setMemberPoints(member.points);
    setEditModalOpen(true);
  };

  const openPointsModal = (member: LoyaltyMember) => {
    setSelectedMember(member);
    setPointsAdjustment(0);
    setPointsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2d1e18]">Loyalty Club Directory</h1>
          <p className="text-xs text-[#705e55] mt-1 font-medium">Issue loyalty cards, adjust award points, and manage memberships.</p>
        </div>

        <button
          onClick={() => {
            setMemberName("");
            setMemberEmail("");
            setMemberPoints(0);
            setAddModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-[#8c6239] hover:bg-[#734f2d] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white border border-[#e8dfd7] p-4 rounded-2xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-[#705e55]/60" />
          <input
            type="text"
            placeholder="Search loyalty member by name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold text-[#2d1e18] placeholder-[#705e55]/60 focus:border-[#8c6239] transition-all"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-3 bg-white rounded-2xl border border-[#e8dfd7] shadow-sm">
          <Loader2 className="h-8 w-8 text-[#8c6239] animate-spin" />
          <span className="text-xs text-[#705e55] font-semibold">Updating loyalty records...</span>
        </div>
      )}

      {/* Member Directory Grid */}
      {!loading && (
        <>
          {members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#1d140e] text-[#f2ede4] border border-[#2c1e15] rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-6 hover:shadow-lg transition-shadow relative overflow-hidden group"
                >
                  {/* Visual Credit Card Background Design */}
                  <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 h-40 w-40 rounded-full bg-gradient-to-tr from-amber-500/10 to-transparent pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                  
                  <div className="space-y-4">
                    {/* Card Top Branding */}
                    <div className="flex justify-between items-center border-b border-[#2c1e15] pb-3">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-amber-500" />
                        <span className="font-serif text-xs tracking-wider uppercase">Cozy Beans Club</span>
                      </div>
                      <span className="text-[10px] text-[#a49187] font-mono">#{member.id.slice(0, 8).toUpperCase()}</span>
                    </div>

                    {/* Member Info */}
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-white tracking-wide truncate">{member.name}</h3>
                      <div className="flex items-center text-xs text-[#a49187] font-semibold min-w-0">
                        <Mail className="h-3.5 w-3.5 mr-2 text-[#a49187]/60 shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <span className="block text-[9px] text-[#a49187]/80 font-medium">
                        Joined on {new Date(member.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom: Points Counter & Controls */}
                  <div className="pt-4 border-t border-[#2c1e15] flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="bg-amber-500/15 p-2 rounded-xl border border-amber-500/20">
                        <Award className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <span className="block text-[8px] font-bold uppercase tracking-wider text-[#a49187]">Points Balance</span>
                        <span className="block text-lg font-extrabold text-amber-400 font-sans">{member.points} pts</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openPointsModal(member)}
                        className="p-2 hover:bg-[#2c1e15] rounded-xl text-amber-400 hover:text-amber-300 transition-all"
                        title="Adjust Points"
                      >
                        <PlusCircle className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(member)}
                        className="p-2 hover:bg-[#2c1e15] rounded-xl text-[#a49187] hover:text-white transition-all"
                        title="Edit Details"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 hover:bg-[#2c1e15] rounded-xl text-red-400 hover:text-red-300 transition-all"
                        title="Delete Card"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-[#e8dfd7] bg-white rounded-2xl shadow-sm text-xs text-[#705e55] font-semibold italic">
              No loyalty members registered yet.
            </div>
          )}
        </>
      )}

      {/* Add Member Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1d140e]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleRegister}
            className="bg-white border border-[#e8dfd7] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="bg-[#faf8f5] border-b border-[#e8dfd7] px-6 py-4 flex justify-between items-center">
              <h3 className="font-serif font-bold text-base text-[#2d1e18]">Issue New Loyalty Card</h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#f2ede4] text-[#705e55]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Member Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#2d1e18] placeholder-[#705e55]/40"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#2d1e18] placeholder-[#705e55]/40"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Starting Points</label>
                <input
                  type="number"
                  placeholder="0"
                  value={memberPoints === 0 ? "" : memberPoints}
                  onChange={(e) => setMemberPoints(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#2d1e18]"
                />
              </div>
            </div>

            <div className="bg-[#faf8f5] border-t border-[#e8dfd7] px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#e8dfd7] text-[#705e55] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#8c6239] hover:bg-[#734f2d] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md flex items-center space-x-1.5"
              >
                <Check className="h-4 w-4" />
                <span>Issue Card</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Member Modal */}
      {editModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 bg-[#1d140e]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleEdit}
            className="bg-white border border-[#e8dfd7] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="bg-[#faf8f5] border-b border-[#e8dfd7] px-6 py-4 flex justify-between items-center">
              <h3 className="font-serif font-bold text-base text-[#2d1e18]">Edit Member Details</h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#f2ede4] text-[#705e55]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Member Name</label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#2d1e18]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full bg-[#f2ede4] border border-[#e8dfd7] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#2d1e18]"
                />
              </div>
            </div>

            <div className="bg-[#faf8f5] border-t border-[#e8dfd7] px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#e8dfd7] text-[#705e55] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#8c6239] hover:bg-[#734f2d] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md flex items-center space-x-1.5"
              >
                <Check className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Adjust Points Modal */}
      {pointsModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 bg-[#1d140e]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8dfd7] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#faf8f5] border-b border-[#e8dfd7] px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-base text-[#2d1e18]">Adjust Points Balance</h3>
                <span className="text-[10px] text-[#705e55] font-semibold mt-0.5 block">{selectedMember.name}</span>
              </div>
              <button
                onClick={() => setPointsModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#f2ede4] text-[#705e55]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-center">
              {/* Current Points Display */}
              <div className="bg-[#faf8f5] border border-[#e8dfd7] p-5 rounded-2xl inline-block w-full">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#705e55] block">Current Balance</span>
                <span className="text-3xl font-extrabold text-[#2d1e18] block mt-1 font-sans">{selectedMember.points} pts</span>
              </div>

              {/* Adjustment Controls */}
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-[#705e55] uppercase tracking-wider">Adjustment Amount</label>
                <div className="flex items-center justify-center space-x-4">
                  <input
                    type="number"
                    placeholder="0"
                    value={pointsAdjustment === 0 ? "" : pointsAdjustment}
                    onChange={(e) => setPointsAdjustment(parseInt(e.target.value) || 0)}
                    className="bg-[#f2ede4] border border-[#e8dfd7] rounded-xl px-4 py-2.5 text-center text-lg font-bold text-[#2d1e18] w-28"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#faf8f5] border-t border-[#e8dfd7] px-6 py-4 flex justify-between gap-3">
              <button
                onClick={() => handleAdjustPoints(-pointsAdjustment)}
                disabled={pointsAdjustment <= 0}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-full text-xs font-bold shadow-sm flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MinusCircle className="h-4 w-4" />
                <span>Deduct Points</span>
              </button>
              <button
                onClick={() => handleAdjustPoints(pointsAdjustment)}
                disabled={pointsAdjustment <= 0}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-full text-xs font-bold shadow-sm flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Points</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
