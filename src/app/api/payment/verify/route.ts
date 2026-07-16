import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

// POST /api/payment/verify - Processes payment status verification callback
export async function POST(request: Request) {
  try {
    const { orderId, status, paymentMethod, transactionId } = await request.json();

    if (!orderId || !status || !paymentMethod) {
      return NextResponse.json({ error: "Missing verification details" }, { status: 400 });
    }

    // Fetch the order
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { user: { include: { role: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If order is already paid, just return success (idempotency check)
    if (order.paymentStatus === "PAID" && status === "SUCCESS") {
      // Find existing payment
      const existingPayment = await db.payment.findFirst({
        where: { orderId, paymentStatus: "SUCCESS" },
      });
      return NextResponse.json({
        message: "Order already paid",
        order,
        payment: existingPayment,
      });
    }

    let finalPaymentStatus = "PENDING";
    const finalOrderStatus = order.status;

    if (status === "SUCCESS") {
      finalPaymentStatus = "PAID";
    } else if (status === "FAILED") {
      finalPaymentStatus = "FAILED";
    } else {
      finalPaymentStatus = "PENDING"; // CANCELLED or fallback is kept as PENDING payment
    }

    // Begin updates
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: finalPaymentStatus,
        status: finalOrderStatus,
      },
    });

    // Create the Payment history record in database
    const newPayment = await db.payment.create({
      data: {
        orderId,
        amount: order.total,
        paymentMethod,
        paymentStatus: status, // SUCCESS, FAILED, CANCELLED
        transactionId: transactionId || null,
        paymentTime: new Date(),
      },
    });

    // If payment was SUCCESS, execute stock deduct and award loyalty points
    if (status === "SUCCESS") {
      // 1. Decrement stock
      try {
        const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
        if (Array.isArray(items)) {
          for (const item of items) {
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
        logger.error("Error decrementing stock on payment verification", e);
      }

      // 2. Award loyalty points to user (1 point per ₹1 spent)
      if (order.userId && order.user) {
        const pointsEarned = Math.floor(order.total);
        if (order.user.role.name === "CUSTOMER") {
          await db.user.update({
            where: { id: order.userId },
            data: {
              loyaltyPoints: {
                increment: pointsEarned,
              },
            },
          });

          // Also update LoyaltyMember record if matching email exists
          try {
            await db.loyaltyMember.update({
              where: { email: order.user.email },
              data: {
                points: {
                  increment: pointsEarned,
                },
              },
            });
          } catch (e) {
            // Silently ignore if LoyaltyMember doesn't exist
          }
        }
      }
    }

    return NextResponse.json({
      message: `Payment status processed: ${status}`,
      order: updatedOrder,
      payment: newPayment,
    });
  } catch (error) {
    logger.error("Error verifying payment", error);
    return NextResponse.json({ error: "Server error during payment verification" }, { status: 500 });
  }
}
