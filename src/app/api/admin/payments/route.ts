import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || (decoded.role !== "ADMIN" && decoded.role !== "STAFF")) return null;
  return decoded;
}

// GET /api/admin/payments - List all payments with stats and filters (Admin/Staff only)
export async function GET(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const filterStatus = searchParams.get("status"); // SUCCESS, FAILED, CANCELLED, PENDING, ALL

    const where: any = {};
    if (filterStatus && filterStatus !== "ALL") {
      where.paymentStatus = filterStatus;
    }

    // Fetch payments list
    const payments = await db.payment.findMany({
      where,
      include: {
        order: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute stats
    const totalPayments = await db.payment.count();

    const revenueAggregate = await db.payment.aggregate({
      where: { paymentStatus: "SUCCESS" },
      _sum: { amount: true },
    });
    const totalRevenue = revenueAggregate._sum.amount || 0;

    const failedPayments = await db.payment.count({
      where: { paymentStatus: "FAILED" },
    });

    // Pending payments: count of orders that are PENDING payment
    const pendingPayments = await db.order.count({
      where: { paymentStatus: "PENDING" },
    });

    return NextResponse.json({
      payments,
      stats: {
        totalPayments,
        totalRevenue,
        failedPayments,
        pendingPayments,
      },
    });
  } catch (error) {
    console.error("Error in admin payments API:", error);
    return NextResponse.json({ error: "Server error fetching payments list" }, { status: 500 });
  }
}
