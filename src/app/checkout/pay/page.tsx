"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Coffee, ShieldCheck, Loader2, CreditCard, ChevronRight, X, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";

function PayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Payment form states
  const [upiId, setUpiId] = useState("john@ybl");
  const [upiError, setUpiError] = useState<string | null>(null);

  // Simulated gateway processing states
  const [processing, setProcessing] = useState(false);
  const [showOutcomeSelector, setShowOutcomeSelector] = useState(false);
  const [outcomeLoading, setOutcomeLoading] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing in URL");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders?orderId=${orderId}`);
        const data = await res.json();
        if (res.ok && data.order) {
          setOrder(data.order);
        } else {
          setError(data.error || "Order not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim() || !upiId.includes("@")) {
      setUpiError("Please enter a valid UPI ID (e.g. user@ybl)");
      return;
    }

    setUpiError(null);
    setProcessing(true);

    // Simulate 2.5 seconds payment gateway load processing
    setTimeout(() => {
      setProcessing(false);
      setShowOutcomeSelector(true);
    }, 2500);
  };

  const handleProcessOutcome = async (outcome: "SUCCESS" | "FAILED" | "CANCELLED") => {
    try {
      setOutcomeLoading(true);
      const fakeTxnId = `TXN${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 12)}${Math.floor(1000 + Math.random() * 9000)}`;

      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: outcome,
          paymentMethod: "UPI",
          transactionId: outcome === "SUCCESS" || outcome === "FAILED" ? fakeTxnId : null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Redirect to results page
        router.push(`/checkout/result?orderId=${orderId}&status=${outcome}&txnId=${fakeTxnId}`);
      } else {
        alert(data.error || "Failed to process payment callback");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting server to verify payment");
    } finally {
      setOutcomeLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel the payment process? The order status will remain Pending.");
    if (!confirmCancel) return;
    await handleProcessOutcome("CANCELLED");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 text-[#5f259f] animate-spin" />
        <span className="text-sm font-bold text-slate-600 mt-3 tracking-wide">Connecting to PhonePe Secure Gateway...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-3xl p-8 text-center space-y-4 shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Gateway Connection Error</h2>
          <p className="text-xs text-slate-500">{error || "Could not retrieve order credentials."}</p>
          <button
            onClick={() => router.push("/cart")}
            className="rounded-full bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;

  return (
    <div className="min-h-screen bg-[#f3edf7] text-slate-800 font-sans flex flex-col items-center justify-between pb-8">
      {/* PhonePe Branded Top Bar */}
      <header className="w-full bg-[#5f259f] text-white py-4 px-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-white text-[#5f259f] p-1.5 rounded-xl font-black text-xs shrink-0 tracking-tighter uppercase shadow-inner">
              Pe
            </div>
            <span className="font-extrabold tracking-tight text-lg">PhonePe</span>
            <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-sm select-none">
              Demo Sandbox
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-purple-200 font-bold bg-[#4b1d7f] px-3.5 py-1.5 rounded-full border border-purple-400/20">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>100% Secure</span>
          </div>
        </div>
      </header>

      {/* Main Payment Container Card */}
      <main className="w-full max-w-xl px-4 py-8 flex-1">
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden space-y-6">
          {/* Order Details Header Panel */}
          <div className="bg-gradient-to-r from-[#5f259f]/10 to-[#5f259f]/5 p-6 border-b border-purple-100 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-[#5f259f] uppercase tracking-widest block">Merchant Partner</span>
              <div className="flex items-center space-x-1.5">
                <Coffee className="h-5 w-5 text-[#5f259f]" />
                <h2 className="font-serif font-bold text-base text-slate-800">Cozy Beans Café</h2>
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">Order ID: {order.id}</span>
              <span className="text-[10px] text-slate-500 block">Customer: <strong className="text-slate-700">{order.user?.name || "Customer"}</strong></span>
            </div>
            <div className="text-right space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Amount Due</span>
              <span className="text-2xl font-black text-[#5f259f] tracking-tight">{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Items Summary Dropdown details */}
          <div className="px-6 py-1 border-b border-slate-100 pb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Order Items</h3>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700 text-left">
                    {item.name} <code className="font-mono text-[10px] text-[#5f259f] font-bold">x{item.quantity}</code>
                  </span>
                  <span className="font-bold text-slate-600">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* UPI ID input payment form */}
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Option</h3>
              <div className="border-2 border-[#5f259f]/30 rounded-2xl p-4 bg-purple-50/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#5f259f]/10 p-2 rounded-xl text-[#5f259f]">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="text-left leading-normal">
                    <span className="block text-xs font-bold text-slate-800">Pay via PhonePe UPI</span>
                    <span className="block text-[9px] text-[#5f259f] font-bold uppercase tracking-wider">Instant Authorization</span>
                  </div>
                </div>
                <div className="h-4.5 w-4.5 rounded-full border-4 border-[#5f259f] flex items-center justify-center shrink-0" />
              </div>
            </div>

            <form onSubmit={handlePayNow} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enter UPI ID</label>
                <input
                  type="text"
                  required
                  disabled={processing}
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. username@ybl"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white px-4 py-3 text-xs text-slate-800 focus:border-[#5f259f] transition-all font-semibold focus:ring-1 focus:ring-[#5f259f]"
                />
                {upiError && (
                  <p className="text-[9px] text-red-600 font-bold uppercase tracking-wide pl-2 mt-1">⚠️ {upiError}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCancelPayment}
                  disabled={processing}
                  className="rounded-full border border-slate-300 text-slate-500 hover:bg-slate-50 text-xs font-bold uppercase tracking-widest py-3.5 transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-full bg-[#5f259f] hover:bg-[#4b1d7f] text-white text-xs font-bold uppercase tracking-widest py-3.5 shadow-lg hover:shadow transition-all duration-300 active:scale-95 text-center flex items-center justify-center"
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <span>Pay {formatCurrency(order.total)}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Simulated UPI loading verification modal screen */}
      {processing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#5f259f] text-white text-center animate-in fade-in duration-300">
          <div className="space-y-6 max-w-sm">
            <div className="inline-flex items-center justify-center p-6 bg-white/10 rounded-full border border-white/20 animate-pulse">
              <Coffee className="h-12 w-12 text-white animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black font-sans tracking-wide uppercase">Authorizing Transaction</h2>
              <p className="text-xs text-purple-200 leading-relaxed font-light">
                Do not press the back button or refresh the tab. Communicating with PhonePe Sandbox nodes and bank processors...
              </p>
            </div>
            <div className="flex items-center justify-center space-x-1.5 text-xs text-purple-300 font-bold">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying secure network link...</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive outcome selector for sandbox mode */}
      {showOutcomeSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[4px] animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border border-purple-100 p-8 rounded-3xl shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-[#5f259f] font-bold">
                <ShieldCheck className="h-5 w-5 text-[#5f259f]" />
                <span className="font-serif uppercase tracking-wider text-xs">Sandbox Result Selector</span>
              </div>
              <button
                onClick={() => !outcomeLoading && setShowOutcomeSelector(false)}
                disabled={outcomeLoading}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1 rounded-full transition-colors disabled:opacity-40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-500 leading-relaxed">
                This is a <strong>College Project Demo</strong> simulation. Select the payment gateway outcome you wish to trigger to verify the application flows.
              </p>

              {outcomeLoading ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-2">
                  <Loader2 className="h-8 w-8 text-[#5f259f] animate-spin" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Logging result...</span>
                </div>
              ) : (
                <div className="flex flex-col space-y-2.5 pt-2">
                  <button
                    onClick={() => handleProcessOutcome("SUCCESS")}
                    className="w-full bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 text-emerald-800 font-bold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-between px-4"
                  >
                    <span>✓ Simulate Payment Success</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleProcessOutcome("FAILED")}
                    className="w-full bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 text-red-800 font-bold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-between px-4"
                  >
                    <span>✗ Simulate Payment Failure</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleProcessOutcome("CANCELLED")}
                    className="w-full bg-amber-50 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 text-amber-800 font-bold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-between px-4"
                  >
                    <span>⚠ Simulate Cancel / Continue Later</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Brand Footer */}
      <footer className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-auto">
        PhonePe PG Sandbox Interface • Project Demonstration Only
      </footer>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 text-[#5f259f] animate-spin" />
        <span className="text-sm font-bold text-slate-600 mt-3 tracking-wide">Loading checkout context...</span>
      </div>
    }>
      <PayContent />
    </Suspense>
  );
}
