"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, Printer, RefreshCw, ShoppingBag, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status"); // SUCCESS, FAILED, CANCELLED
  const txnId = searchParams.get("txnId");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing");
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
          setError(data.error || "Order details not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order information");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="py-24 text-center">
          <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <span className="text-xs font-bold text-textMuted uppercase tracking-wider block mt-3">Loading order details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="py-24 max-w-md mx-auto text-center px-4 space-y-4">
          <XCircle className="h-12 w-12 text-red-500 mx-auto animate-bounce" />
          <h2 className="font-serif text-2xl font-bold text-foreground">Order Fetch Failed</h2>
          <p className="text-xs text-textMuted leading-relaxed">{error || "Could not retrieve order details."}</p>
          <button
            onClick={() => router.push("/menu")}
            className="rounded-full bg-[#5f259f] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 shadow-md"
          >
            Go to Menu
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
  const subtotal = order.total;
  const gst = subtotal * 0.05; // 5% GST
  const netTotal = subtotal + gst;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="mx-auto max-w-3xl w-full px-4 py-16 space-y-8 print:py-0 print:px-0">
        
        {/* Payment Outcome Cards (Hidden during print) */}
        <div className="print:hidden">
          {status === "SUCCESS" ? (
            <div className="border border-green-200 bg-emerald-50/50 p-8 rounded-3xl text-center space-y-4 shadow-sm">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto animate-pulse" />
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold text-emerald-800">Payment Successful!</h2>
                <p className="text-xs text-emerald-600/90 leading-relaxed font-light">
                  Your transaction has been authorized successfully. Cozy Beans team has received your order and started preparations!
                </p>
              </div>
              <div className="bg-white border border-emerald-100 rounded-2xl p-4 max-w-md mx-auto text-xs grid grid-cols-2 gap-y-2 text-left text-slate-700 leading-normal">
                <span className="font-semibold">Transaction ID:</span>
                <span className="font-mono font-bold text-[#5f259f] text-right">{txnId || "N/A"}</span>
                <span className="font-semibold">Amount Paid:</span>
                <span className="font-bold text-slate-900 text-right">{formatCurrency(order.total)}</span>
                <span className="font-semibold">Order ID:</span>
                <span className="font-mono text-right">{order.id}</span>
                <span className="font-semibold flex items-center">
                  <Clock className="h-3.5 w-3.5 text-accent mr-1 shrink-0" />
                  Delivery Time:
                </span>
                <span className="font-bold text-emerald-800 text-right">25 - 35 mins</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  onClick={handlePrintInvoice}
                  className="w-full sm:w-auto flex items-center justify-center space-x-1.5 rounded-full border border-[#5f259f] text-[#5f259f] hover:bg-[#5f259f]/5 text-xs font-bold uppercase tracking-widest px-6 py-3.5 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full sm:w-auto flex items-center justify-center space-x-1.5 rounded-full bg-[#5f259f] hover:bg-[#4b1d7f] text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 shadow-md transition-colors"
                >
                  <span>Track Order</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : status === "FAILED" ? (
            <div className="border border-red-200 bg-red-50/50 p-8 rounded-3xl text-center space-y-4 shadow-sm">
              <XCircle className="h-12 w-12 text-red-600 mx-auto animate-bounce" />
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold text-red-800">Payment Failed</h2>
                <p className="text-xs text-red-600/90 leading-relaxed font-light">
                  PhonePe Sandbox failed to authorize your transaction due to dummy decline trigger. Your bank balance was not changed.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => router.push(`/checkout/pay?orderId=${orderId}`)}
                  className="w-full sm:w-auto flex items-center justify-center space-x-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 shadow-md transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Retry Payment</span>
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full sm:w-auto flex items-center justify-center space-x-1.5 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-widest px-6 py-3.5 transition-colors"
                >
                  <span>Go to Orders</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-amber-200 bg-amber-50/40 p-8 rounded-3xl text-center space-y-4 shadow-sm">
              <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto" />
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold text-amber-800">Payment Cancelled</h2>
                <p className="text-xs text-amber-600/90 leading-relaxed font-light">
                  You cancelled the payment process. The order status has been saved as <strong>Pending Payment</strong>, you can retry this checkout at any time.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => router.push(`/checkout/pay?orderId=${orderId}`)}
                  className="w-full sm:w-auto flex items-center justify-center space-x-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 shadow-md transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Pay Now</span>
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full sm:w-auto flex items-center justify-center space-x-1.5 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-widest px-6 py-3.5 transition-colors"
                >
                  <span>View Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PRINTABLE INVOICE TEMPLATE (Visible on Success status) */}
        {status === "SUCCESS" && (
          <div className="bg-white border border-borderColor p-8 sm:p-12 rounded-3xl shadow-xl space-y-8 print:shadow-none print:border-none print:p-0">
            {/* Header info */}
            <div className="flex justify-between items-start pb-6 border-b border-borderColor">
              <div className="space-y-1 text-left">
                <span className="font-serif text-2xl font-black text-foreground">Cozy Beans Café</span>
                <span className="block text-[10px] text-textMuted uppercase tracking-widest font-extrabold">Tax Invoice / Receipt</span>
                <p className="text-[10px] text-textMuted leading-relaxed max-w-xs font-light">
                  123 Aroma Lane, Coffee District, CA 90210 <br/>
                  GSTIN: 27AAAAA1111A1Z1
                </p>
              </div>
              <div className="text-right space-y-1">
                <span className="text-xs font-bold text-foreground">Invoice No:</span>
                <span className="block text-xs font-mono text-[#5f259f] font-bold">{txnId || "N/A"}</span>
                <span className="text-[10px] text-textMuted block">Date: {new Date(order.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Bill To details */}
            <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed text-left border-b border-borderColor pb-6">
              <div>
                <h4 className="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-2">Billed To</h4>
                <p className="font-bold text-foreground">{order.user?.name || "Loyal Customer"}</p>
                <p className="text-textMuted font-light">Phone: {order.phone}</p>
                <p className="text-textMuted font-light">Email: {order.user?.email || "customer@gmail.com"}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-2">Delivery Address</h4>
                <p className="text-textMuted font-light max-w-xs">{order.address}</p>
              </div>
            </div>

            {/* Invoice Table Items */}
            <div className="space-y-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-borderColor text-[10px] font-bold uppercase tracking-wider text-textMuted">
                    <th className="py-2.5">Item Description</th>
                    <th className="py-2.5 text-center">Price</th>
                    <th className="py-2.5 text-center">Qty</th>
                    <th className="py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, i: number) => (
                    <tr key={i} className="border-b border-borderColor/40 text-foreground">
                      <td className="py-3 font-semibold text-slate-700">{item.name}</td>
                      <td className="py-3 text-center font-mono">{formatCurrency(item.price)}</td>
                      <td className="py-3 text-center font-mono font-bold text-[#5f259f]">{item.quantity}</td>
                      <td className="py-3 text-right font-mono font-bold">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subtotals & Taxes calculation */}
            <div className="flex justify-end pt-4">
              <div className="w-64 space-y-2 text-xs leading-normal text-left">
                <div className="flex justify-between text-textMuted font-semibold">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-textMuted font-semibold">
                  <span>GST (5%)</span>
                  <span className="font-mono">{formatCurrency(gst)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>Discount</span>
                    <span className="font-mono">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <hr className="border-borderColor/60" />
                <div className="flex justify-between text-foreground text-sm font-extrabold">
                  <span>Total Amount</span>
                  <span className="font-mono text-[#5f259f]">{formatCurrency(netTotal - order.discount)}</span>
                </div>
              </div>
            </div>

            {/* Receipt Footer note */}
            <div className="pt-8 border-t border-borderColor text-center space-y-1">
              <p className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Thank You for Dining with Us!</p>
              <p className="text-[8px] text-textMuted/70 font-light">This is a computer-generated invoice for Cozy Beans sandbox project demonstration.</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="py-24 text-center">
          <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <span className="text-xs font-bold text-textMuted uppercase tracking-wider block mt-3">Loading order details...</span>
        </div>
        <Footer />
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
