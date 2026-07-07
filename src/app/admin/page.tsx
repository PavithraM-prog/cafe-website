import React from "react";
export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { DollarSign, ShoppingBag, Calendar, Users, Star, ArrowUpRight } from "lucide-react";
import Link from "next/link";

async function getStats() {
  try {
    // 1. Total revenue (sum of PAID orders)
    const paidOrders = await db.order.findMany({
      where: { paymentStatus: "PAID" },
      select: { total: true },
    });
    const totalSales = paidOrders.reduce((sum, order) => sum + order.total, 0);

    // 2. Orders count
    const totalOrders = await db.order.count();
    const activeOrders = await db.order.count({
      where: {
        status: { in: ["PENDING", "PREPARING", "READY"] },
      },
    });

    // 3. Reservations count
    const pendingReservations = await db.reservation.count({
      where: { status: "PENDING" },
    });
    const approvedReservations = await db.reservation.count({
      where: { status: "APPROVED" },
    });

    // 4. Users count
    const totalCustomers = await db.user.count({
      where: { role: "CUSTOMER" },
    });

    // 5. Fetch 5 recent orders
    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    // 6. Fetch 5 recent reviews
    const recentReviews = await db.review.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    });

    return {
      totalSales,
      totalOrders,
      activeOrders,
      pendingReservations,
      approvedReservations,
      totalCustomers,
      recentOrders,
      recentReviews,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalSales: 0,
      totalOrders: 0,
      activeOrders: 0,
      pendingReservations: 0,
      approvedReservations: 0,
      totalCustomers: 0,
      recentOrders: [],
      recentReviews: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalSales.toFixed(2)}`,
      desc: "Gross sales from orders",
      icon: DollarSign,
      color: "text-green-600 bg-green-50 border-green-100",
    },
    {
      title: "Active Orders",
      value: stats.activeOrders,
      desc: "Preparing or ready to serve",
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Pending Bookings",
      value: stats.pendingReservations,
      desc: "Awaiting table approval",
      icon: Calendar,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Loyal Customers",
      value: stats.totalCustomers,
      desc: "Registered users",
      icon: Users,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-800">Dashboard Overview</h1>
        <p className="text-xs text-neutral-500 mt-1">Real-time statistics, order flow, and reservation activities.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                  {card.title}
                </span>
                <span className="text-2xl font-extrabold text-neutral-800 font-sans block">{card.value}</span>
                <span className="text-[10px] text-neutral-500 block font-medium">{card.desc}</span>
              </div>
              <div className={`p-4 rounded-xl border shrink-0 ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grids: recent orders, charts, and reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
            <h3 className="font-serif font-bold text-lg text-neutral-700">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="flex items-center space-x-1 text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              <span>Manage Orders</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs leading-normal">
                <thead>
                  <tr className="text-neutral-400 font-bold uppercase tracking-widest border-b border-neutral-100">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="text-neutral-600">
                      <td className="py-3.5 font-mono">{order.id.slice(0, 8)}...</td>
                      <td className="py-3.5 text-neutral-800 font-bold font-sans">${order.total.toFixed(2)}</td>
                      <td className="py-3.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 text-green-700"
                              : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="text-green-600 font-bold">{order.paymentStatus}</span>
                      </td>
                      <td className="py-3.5 text-right font-sans text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-xs text-neutral-400 py-6">No orders registered yet.</p>
          )}
        </div>

        {/* Reviews and Ratings Moderation summary */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
            <h3 className="font-serif font-bold text-lg text-neutral-700">Recent Feedbacks</h3>
            <Link
              href="/admin/reviews"
              className="flex items-center space-x-1 text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              <span>Moderate</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stats.recentReviews.length > 0 ? (
            <div className="space-y-4">
              {stats.recentReviews.map((review) => (
                <div key={review.id} className="space-y-2 pb-3 last:pb-0 border-b border-neutral-100 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-neutral-700">{review.name}</span>
                    <div className="flex space-x-0.5 shrink-0 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-neutral-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                      review.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {review.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-neutral-400 py-6">No feedbacks submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
