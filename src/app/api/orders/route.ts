import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;
  try {
    const dbUser = await db.user.findUnique({ where: { id: decoded.id } });
    if (!dbUser) return null;
  } catch (e) {
    return null;
  }
  return decoded;
}

// GET /api/orders - Get orders list
export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (orderId) {
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      });
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      // Ensure only the customer who placed the order or an admin/staff can access it
      if (order.userId !== user.id && user.role !== "ADMIN" && user.role !== "STAFF") {
        return NextResponse.json({ error: "Unauthorized access to order" }, { status: 403 });
      }
      return NextResponse.json({ order });
    }
    const filterStatus = searchParams.get("status");
    const filterSource = searchParams.get("source");
    const filterDate = searchParams.get("date"); // today, week, or YYYY-MM-DD

    // Admin/Staff sees all orders with filters
    if (user.role === "ADMIN" || user.role === "STAFF") {
      const where: any = {};

      // Status filter
      if (filterStatus) {
        if (filterStatus === "ACTIVE") {
          where.status = { in: ["PENDING", "PREPARING", "READY"] };
        } else {
          where.status = filterStatus;
        }
      }

      // Source filter
      if (filterSource && filterSource !== "ALL") {
        where.source = filterSource;
      }

      // Date filter
      if (filterDate) {
        const start = new Date();
        if (filterDate === "today") {
          start.setHours(0, 0, 0, 0);
          where.createdAt = { gte: start };
        } else if (filterDate === "week") {
          start.setDate(start.getDate() - 7);
          start.setHours(0, 0, 0, 0);
          where.createdAt = { gte: start };
        } else {
          // Specific date (YYYY-MM-DD)
          const targetDate = new Date(filterDate);
          if (!isNaN(targetDate.getTime())) {
            const startOfDay = new Date(targetDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(targetDate);
            endOfDay.setHours(23, 59, 59, 999);
            where.createdAt = { gte: startOfDay, lte: endOfDay };
          }
        }
      }

      const orders = await db.order.findMany({
        where,
        include: { payments: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ orders });
    }

    // Standard user sees their own orders
    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: { payments: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    logger.error("Error fetching orders", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST /api/orders - Place a new order
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    // Allow admin/staff to record walk-in orders even if customer is not logged in
    const body = await request.json();
    const { items, total, discount, address, phone, source, loyaltyEmail } = body;

    const isWalkIn = source === "WALK_IN";

    // If customer order, they must be logged in
    if (!isWalkIn && !user) {
      return NextResponse.json({ error: "Please log in to place an order" }, { status: 401 });
    }

    if (!items || !total) {
      return NextResponse.json({ error: "Missing required order information" }, { status: 400 });
    }

    // 1. Calculate loyalty points to award: 1 point for every ₹1 spent
    const pointsEarned = Math.floor(parseFloat(total));

    // 2. Create the order in db
    const newOrder = await db.order.create({
      data: {
        userId: user?.id || null,
        items: JSON.stringify(items), // JSON array of items as string for SQLite
        total: parseFloat(total),
        discount: discount ? parseFloat(discount) : 0,
        address: address || (isWalkIn ? "Walk-in Customer" : ""),
        phone: phone || (isWalkIn ? "N/A" : ""),
        paymentStatus: isWalkIn ? "PAID" : "PENDING", // Walk-in is paid instantly, website is PENDING
        status: isWalkIn ? "DELIVERED" : "PENDING", // Walk-in is served immediately, so default to DELIVERED
        source: source || "WEBSITE",
      },
    });

<<<<<<< HEAD
    // 3. Update user loyalty points
    if (user) {
      await db.user.update({
        where: { id: user.id },
        data: {
          loyaltyPoints: {
            increment: pointsEarned,
          },
        },
      });
    }

    // 4. If a coupon was used, we could invalidate it if single-use, but here we keep it simple
=======
    // Only run stock decrement and loyalty updates on checkout creation if it's a walk-in order (since payment is instant)
    // Website orders will run this inside the payment verification callback
    if (isWalkIn) {
      // Decrement stock for ordered items
      try {
        const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
        if (Array.isArray(parsedItems)) {
          for (const item of parsedItems) {
            const itemId = item.productId || item.id;
            if (itemId) {
              const menuItem = await db.menuItem.findUnique({
                where: { id: itemId },
              });
              if (menuItem) {
                const newCount = Math.max(0, menuItem.availablePieces - (item.quantity || 1));
                await db.menuItem.update({
                  where: { id: itemId },
                  data: {
                    availablePieces: newCount,
                    availability: newCount > 0 ? menuItem.availability : false,
                  },
                });
              }
            }
          }
        }
      } catch (e) {
        logger.error("Error updating availablePieces during order checkout", e);
      }

      // Update walk-in loyalty member points if email provided
      if (loyaltyEmail) {
        try {
          const lm = await db.loyaltyMember.findUnique({
            where: { email: loyaltyEmail.toLowerCase() },
          });
          if (lm) {
            await db.loyaltyMember.update({
              where: { id: lm.id },
              data: {
                points: {
                  increment: pointsEarned,
                },
              },
            });
          }
        } catch (e) {
          logger.error("Error updating walk-in loyalty member points", e, { loyaltyEmail });
        }
      }
    }
>>>>>>> 10e7606 (Final project)


    return NextResponse.json({
      message: "Order placed successfully!",
      order: newOrder,
      pointsEarned,
    }, { status: 201 });
  } catch (error) {
    logger.error("Error creating order", error);
    return NextResponse.json({ error: "Server error during checkout" }, { status: 500 });
  }
}

// PUT /api/orders - Update order status (Admin/Staff only)
export async function PUT(request: Request) {
  let id: string | undefined;
  let status: string | undefined;
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await request.json();
    id = body.id;
    status = body.status;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing order ID or status" }, { status: 400 });
    }

    const updatedOrder = await db.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ message: `Order status updated to ${status}`, order: updatedOrder });
  } catch (error) {
    logger.error("Error updating order status", error, { id, status });
    return NextResponse.json({ error: "Server error updating order status" }, { status: 500 });
  }
}
