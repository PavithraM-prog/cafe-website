import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/orders - Get orders list
export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filterStatus = searchParams.get("status");

    // Admin/Staff sees all orders
    if (user.role === "ADMIN" || user.role === "STAFF") {
      const where: any = {};
      if (filterStatus) where.status = filterStatus;

      const orders = await db.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ orders });
    }

    // Standard user sees their own orders
    const orders = await db.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST /api/orders - Place a new order
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to place an order" }, { status: 401 });
    }

    const body = await request.json();
    const { items, total, discount, address, phone, couponCode } = body;

    if (!items || !total || !address || !phone) {
      return NextResponse.json({ error: "Missing required order information" }, { status: 400 });
    }

    // 1. Calculate loyalty points to award
    const pointsEarned = Math.floor(parseFloat(total));

    // 2. Create Order and all related records inside a transaction
    const { newOrder } = await db.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user.id,
          items: JSON.stringify(items), // JSON array of items as string for backwards compatibility
          total: parseFloat(total),
          discount: discount ? parseFloat(discount) : 0,
          address,
          phone,
          paymentStatus: "PAID",
          status: "PENDING",
        },
      });

      // Insert into OrderItem table
      const orderItemData = items.map((item: any) => ({
        orderId: order.id,
        menuItemId: item.productId || null,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        image: item.image,
      }));

      await tx.orderItem.createMany({
        data: orderItemData,
      });

      // Record simulated payment
      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: parseFloat(total),
          method: "CARD",
          status: "COMPLETED",
          transactionId: `TXN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        },
      });

      // Record kitchen order queue status
      await tx.kitchenOrder.create({
        data: {
          orderId: order.id,
          status: "PENDING",
        },
      });

      // Update user loyalty points
      await tx.user.update({
        where: { id: user.id },
        data: {
          loyaltyPoints: {
            increment: pointsEarned,
          },
        },
      });

      // Write loyalty points transaction record
      await tx.loyaltyPoint.create({
        data: {
          userId: user.id,
          points: pointsEarned,
          type: "EARNED",
          reason: `Earned from Order #${order.id.slice(0, 8)}`,
        },
      });

      return { newOrder: order };
    });

    // 4. If a coupon was used, we could invalidate it if single-use, but here we keep it simple

    return NextResponse.json({
      message: "Order placed successfully!",
      order: newOrder,
      pointsEarned,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Server error during checkout" }, { status: 500 });
  }
}

// PUT /api/orders - Update order status (Admin/Staff only)
export async function PUT(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body; // status: PENDING, PREPARING, READY, DELIVERED, CANCELLED

    if (!id || !status) {
      return NextResponse.json({ error: "Missing order ID or status" }, { status: 400 });
    }

    const updatedOrder = await db.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ message: `Order status updated to ${status}`, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Server error updating order status" }, { status: 500 });
  }
}
