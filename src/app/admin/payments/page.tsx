"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, DollarSign, AlertCircle, Clock, CheckCircle2, XCircle, Search, Filter, Loader2, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";

interface Payment {
  id: string;
  orderId: string;
  transactionId: string | null;
  method: string;
  amount: number;
  status: string;
  paymentTime: string;
  createdAt: string;
  order: {
    id: string;
    phone: string;
    address: string;
    user: {
      name: string;
      email: string;
    } | null;
  };
}

interface Stats {
  totalPayments: number;
  totalRevenue: number;
  failedPayments: number;
  pendingPayments: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPayments: 0,
    totalRevenue: 0,
    failedPayments: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, SUCCESS, FAILED, PENDING
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPaymentsData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") {
        params.append("status", statusFilter);
      }

      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (e) {
      console.error("Error fetching payments history:", e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchPaymentsData();
  }, [fetchPaymentsData]);

  // Filter payments locally on search query (Order ID, Txn ID, name, email)
  const filteredPayments = payments.filter((payment) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const orderIdMatches = payment.orderId.toLowerCase().includes(q);
    const txnIdMatches = payment.transactionId?.toLowerCase().includes(q) || false;
    const nameMatches = payment.order.user?.name.toLowerCase().includes(q) || false;
    const emailMatches = payment.order.user?.email.toLowerCase().includes(q) || false;

    return orderIdMatches || txnIdMatches || nameMatches || emailMatches;
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header section */}
      <div className="flex justify-between items-center pb-4 border-b border-borderColor/40">
        <div>
          <h1 className="font-serif text-2xl font-black text-foreground uppercase tracking-wide">
            Payments Ledger
          </h1>
          <p className="text-xs text-textMuted leading-relaxed font-light mt-1">
            Track and authorize transaction histories, revenue logs, and mock payment gateway statuses.
          </p>
        </div>
      </div>

      {/* Stats counters grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Payments */}
        <div className="border border-borderColor/40 bg-cardBg p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 rounded-2xl text-[#5f259f] border border-purple-100">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider block">Total Attempts</span>
            <span className="text-xl font-black text-foreground tracking-tight">{stats.totalPayments}</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="border border-borderColor/40 bg-cardBg p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider block">Total Revenue</span>
            <span className="text-xl font-black text-foreground tracking-tight">{formatCurrency(stats.totalRevenue)}</span>
          </div>
        </div>

        {/* Failed Payments */}
        <div className="border border-borderColor/40 bg-cardBg p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 rounded-2xl text-red-600 border border-red-100">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider block">Failed Payments</span>
            <span className="text-xl font-black text-foreground tracking-tight">{stats.failedPayments}</span>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="border border-borderColor/40 bg-cardBg p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider block">Unpaid Orders</span>
            <span className="text-xl font-black text-foreground tracking-tight">{stats.pendingPayments}</span>
          </div>
        </div>
      </div>

      {/* Filter and search bar layout */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-cardBg border border-borderColor/40 p-4 rounded-3xl shadow-sm">
        {/* Status filters */}
        <div className="flex flex-wrap gap-1.5">
          {["ALL", "SUCCESS", "FAILED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                statusFilter === status
                  ? "bg-[#5f259f] border-[#5f259f] text-white shadow-sm"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-borderColor/60"
              }`}
            >
              {status === "SUCCESS" ? "Success" : status === "FAILED" ? "Failed" : status === "CANCELLED" ? "Cancelled" : "All Payments"}
            </button>
          ))}
        </div>

        {/* Search Input bar */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Txn ID, Order, Name..."
            className="w-full rounded-full border border-borderColor bg-[#FFF8E7]/10 focus:bg-white pl-9 pr-4 py-2.5 text-xs text-foreground focus:border-accent transition-all font-semibold focus:ring-1 focus:ring-accent"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-textMuted" />
        </div>
      </div>

      {/* Main logs tabular block */}
      <div className="border border-borderColor/40 bg-cardBg rounded-3xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="h-8 w-8 text-[#5f259f] animate-spin" />
            <span className="text-xs text-textMuted font-bold uppercase tracking-wider">Compiling Payments logs...</span>
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FFF8E7]/20 border-b border-borderColor/40 text-[10px] font-extrabold uppercase tracking-wider text-textMuted">
                  <th className="p-4 pl-6">Customer Details</th>
                  <th className="p-4">Order ID</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Method</th>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-right">Payment Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColor/20">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                    {/* Customer details */}
                    <td className="p-4 pl-6 text-left leading-normal">
                      <span className="block font-bold text-foreground">
                        {payment.order.user?.name || "Walk-in Customer"}
                      </span>
                      <span className="block text-[10px] text-textMuted">
                        {payment.order.user?.email || "N/A"}
                      </span>
                    </td>

                    {/* Order ID */}
                    <td className="p-4 font-mono text-[10px]">
                      {payment.orderId.slice(0, 8)}...
                    </td>

                    {/* Amount */}
                    <td className="p-4 text-right font-bold font-sans text-foreground">
                      {formatCurrency(payment.amount)}
                    </td>

                     {/* Payment Method */}
                    <td className="p-4 text-center">
                      <span className="rounded-full bg-[#f2ede4] border border-borderColor/60 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-700">
                        {payment.method}
                      </span>
                    </td>

                    {/* Transaction ID */}
                    <td className="p-4 font-mono text-[10px] font-bold text-[#5f259f]">
                      {payment.transactionId || "N/A"}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center space-x-1 rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          payment.status === "SUCCESS"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : payment.status === "FAILED"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {payment.status === "SUCCESS" ? (
                          <CheckCircle2 className="h-3 w-3 mr-0.5 shrink-0 text-green-700" />
                        ) : payment.status === "FAILED" ? (
                          <XCircle className="h-3 w-3 mr-0.5 shrink-0 text-red-700" />
                        ) : (
                          <Clock className="h-3 w-3 mr-0.5 shrink-0 text-amber-700" />
                        )}
                        <span>{payment.status}</span>
                      </span>
                    </td>

                    {/* Payment Time */}
                    <td className="p-4 pr-6 text-right text-textMuted text-[10px]">
                      {new Date(payment.paymentTime || payment.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-xs text-textMuted italic font-bold uppercase tracking-wide">
            No payments records match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
