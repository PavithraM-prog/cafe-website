import React from "react";
export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { DollarSign, ShoppingBag, Calendar, Users, Coffee, ArrowUpRight, Laptop, Store } from "lucide-react";
import Link from "next/link";
import SalesChart from "@/components/admin/SalesChart";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatCurrency";

interface TopItem {
  name: string;
  count: number;
  price: number;
  image: string;
}

async function getDashboardData() {
  try {
    // 1. Calculate today's timeframe
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 2. Fetch today's orders (with projection)
    const todayOrders = await db.order.findMany({
      where: {
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      select: {
        id: true,
        total: true,
        paymentStatus: true,
        status: true,
        source: true,
      },
    });

    const todayOrdersCount = todayOrders.length;

    // Filter out CANCELLED orders for revenue calculation
    const completedTodayOrders = todayOrders.filter(
      (order) => order.paymentStatus === "PAID" && order.status !== "CANCELLED"
    );

    const todayRevenue = completedTodayOrders.reduce((sum, order) => sum + order.total, 0);

    const websiteRevenueToday = completedTodayOrders
      .filter((o) => o.source === "WEBSITE")
      .reduce((sum, o) => sum + o.total, 0);

    const walkInRevenueToday = completedTodayOrders
      .filter((o) => o.source === "WALK_IN")
      .reduce((sum, o) => sum + o.total, 0);

    const websiteOrdersCount = completedTodayOrders.filter((o) => o.source === "WEBSITE").length;
    const walkInOrdersCount = completedTodayOrders.filter((o) => o.source === "WALK_IN").length;

    // 3. Fetch active reservations count
    const pendingReservations = await db.reservation.count({
      where: { status: "PENDING" },
    });

    const todayReservations = await db.reservation.count({
      where: {
        date: new Date().toISOString().split("T")[0],
      },
    });

    // 4. Fetch loyalty members count
    const totalLoyaltyMembers = await db.loyaltyMember.count();

    // 5. Fetch 5 recent orders (with projection)
    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        source: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
      },
    });

    // 6. Calculate Top 5 fastest-selling items (all-time)
    const allCompletedOrders = await db.order.findMany({
      where: {
        status: { not: "CANCELLED" },
      },
      select: { items: true },
    });

    const itemSales: { [name: string]: { count: number; price: number; image: string } } = {};
    for (const order of allCompletedOrders) {
      try {
        const items = JSON.parse(order.items);
        if (Array.isArray(items)) {
          for (const item of items) {
            const name = item.name;
            const qty = item.quantity || 1;
            const price = item.price || 0;
            const image = item.image || "";

            if (!itemSales[name]) {
              itemSales[name] = { count: 0, price, image };
            }
            itemSales[name].count += qty;
          }
        }
      } catch (e) {
        // Skip malformed JSON
      }
    }

    const topSellingItems: TopItem[] = Object.entries(itemSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 7. Calculate 7-Day sales trend (last 7 days including today in a SINGLE DB query)
    const startOf7Days = new Date();
    startOf7Days.setDate(startOf7Days.getDate() - 6);
    startOf7Days.setHours(0, 0, 0, 0);

    const sevenDaysOrders = await db.order.findMany({
      where: {
        createdAt: {
          gte: startOf7Days,
          lte: endOfToday,
        },
        paymentStatus: "PAID",
        status: { not: "CANCELLED" },
      },
      select: { total: true, source: true, createdAt: true },
    });

    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const startOfDay = new Date(d);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);

      // Filter from pre-fetched list
      const dayOrders = sevenDaysOrders.filter((o) => {
        const oDate = new Date(o.createdAt);
        return oDate >= startOfDay && oDate <= endOfDay;
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + o.total, 0);
      const dayWebRevenue = dayOrders.filter((o) => o.source === "WEBSITE").reduce((sum, o) => sum + o.total, 0);
      const dayWalkRevenue = dayOrders.filter((o) => o.source === "WALK_IN").reduce((sum, o) => sum + o.total, 0);

      trendData.push({
        date: d.toLocaleDateString("en-US", { weekday: "short" }),
        dateKey: d.toISOString().split("T")[0],
        revenue: dayRevenue,
        websiteRevenue: dayWebRevenue,
        walkInRevenue: dayWalkRevenue,
        orderCount: dayOrders.length,
      });
    }

    return {
      todayRevenue,
      websiteRevenueToday,
      walkInRevenueToday,
      todayOrdersCount,
      websiteOrdersCount,
      walkInOrdersCount,
      pendingReservations,
      todayReservations,
      totalLoyaltyMembers,
      recentOrders,
      topSellingItems,
      trendData,
    };
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return {
      todayRevenue: 0,
      websiteRevenueToday: 0,
      walkInRevenueToday: 0,
      todayOrdersCount: 0,
      websiteOrdersCount: 0,
      walkInOrdersCount: 0,
      pendingReservations: 0,
      todayReservations: 0,
      totalLoyaltyMembers: 0,
      recentOrders: [],
      topSellingItems: [],
      trendData: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardData();

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const cards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(stats.todayRevenue),
      desc: (
        <span className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-[#705e55]">💻 {formatCurrency(stats.websiteRevenueToday)}</span>
          <span className="text-xs text-[#705e55]">🏪 {formatCurrency(stats.walkInRevenueToday)}</span>
        </span>
      ),
      icon: DollarSign,
      color: "text-amber-700 bg-amber-50 border-amber-100",
    },
    {
      title: "Orders Count Today",
      value: stats.todayOrdersCount,
      desc: (
        <span className="flex items-center space-x-2 mt-1">
          <span className="text-[10px] text-[#705e55] font-semibold">{stats.websiteOrdersCount} web</span>
          <span className="text-[10px] text-[#705e55] font-semibold">{stats.walkInOrdersCount} walk-in</span>
        </span>
      ),
      icon: ShoppingBag,
      color: "text-blue-700 bg-blue-50 border-blue-100",
    },
    {
      title: "Pending Bookings",
      value: stats.pendingReservations,
      desc: `Today: ${stats.todayReservations} active slots`,
      icon: Calendar,
      color: "text-[#8c6239] bg-orange-50 border-orange-100",
    },
    {
      title: "Loyalty Members",
      value: stats.totalLoyaltyMembers,
      desc: "Total registered card users",
      icon: Users,
      color: "text-emerald-700 bg-emerald-50 border-emerald-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2d1e18]">Dashboard Overview</h1>
          <p className="text-xs text-[#705e55] mt-1 font-medium">Welcome back, Admin. Today is {formattedDate}</p>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white border border-[#e8dfd7] p-6 rounded-2xl shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#705e55] uppercase tracking-wider block">
                  {card.title}
                </span>
                <span className="text-2xl font-extrabold text-[#2d1e18] font-sans block">{card.value}</span>
                <div className="block font-medium">{card.desc}</div>
              </div>
              <div className={`p-4 rounded-xl border shrink-0 ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Top Items grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Trend Chart */}
        <div className="lg:col-span-8">
          <SalesChart data={stats.trendData} />
        </div>

        {/* Right: Top Selling Items */}
        <div className="lg:col-span-4 bg-white border border-[#e8dfd7] rounded-2xl shadow-sm p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#2d1e18]">Fastest-Selling Items</h3>
            <p className="text-[11px] text-[#705e55] font-medium mt-0.5">Top 5 best sellers of Cozy Beans.</p>
          </div>

          <div className="space-y-4 flex-1">
            {stats.topSellingItems.length > 0 ? (
              stats.topSellingItems.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between border-b border-[#f2ede4] pb-3 last:pb-0 last:border-b-0">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden shrink-0 border border-[#e8dfd7] bg-[#f2ede4]">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" loading="lazy" />
                      ) : (
                        <Coffee className="h-full w-full p-2 text-[#8c6239]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-[#2d1e18] truncate leading-tight">{item.name}</span>
                      <span className="block text-[10px] text-[#705e55] font-medium mt-0.5">{formatCurrency(item.price)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#f2ede4] text-[#8c6239] text-[10px] font-bold">
                      {item.count} sold
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-[#705e55] py-12 italic">No sales recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Recent Orders queue */}
      <div className="bg-white border border-[#e8dfd7] rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#f2ede4]">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#2d1e18]">Recent Order Flow</h3>
            <p className="text-[11px] text-[#705e55] font-medium">Inspect recent customer transactions in real-time.</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-amber-700 hover:text-amber-800 transition-colors"
          >
            <span>Manage Queue</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-normal">
              <thead>
                <tr className="text-[#705e55] font-bold uppercase tracking-wider border-b border-[#f2ede4]">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Source</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Payment</th>
                  <th className="pb-3 text-right font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2ede4] font-medium">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="text-[#705e55] hover:bg-[#faf8f5]/50 transition-colors">
                    <td className="py-3.5 font-mono text-[10px] text-[#2d1e18] font-bold">{order.id.slice(0, 8)}...</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center space-x-1 rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${order.source === "WEBSITE"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                      >
                        {order.source === "WEBSITE" ? (
                          <>
                            <Laptop className="h-2.5 w-2.5 mr-0.5" />
                            <span>Web</span>
                          </>
                        ) : (
                          <>
                            <Store className="h-2.5 w-2.5 mr-0.5" />
                            <span>Walk-in</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#2d1e18] font-bold font-sans">{formatCurrency(order.total)}</td>
                    <td className="py-3.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${order.status === "DELIVERED"
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
                      <span
                        className={`font-bold text-[10px] uppercase tracking-wider ${order.paymentStatus === "PAID"
                            ? "text-emerald-600"
                            : order.paymentStatus === "FAILED"
                              ? "text-red-500"
                              : "text-amber-500"
                          }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-sans text-[#705e55]">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-xs text-[#705e55] py-8 italic">No orders registered yet.</p>
        )}
      </div>
    </div>
  );
}
