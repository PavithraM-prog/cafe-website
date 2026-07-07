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

// GET /api/coupons - Validate a coupon by code OR list all coupons if admin
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
      // Validation mode
      const coupon = await db.coupon.findUnique({
        where: { code: code.toUpperCase() },
      });

      if (!coupon) {
        return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
      }

      if (!coupon.isActive) {
        return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
      }

      return NextResponse.json({ coupon });
    }

    // Admin List Mode
    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Error with coupons route:", error);
    return NextResponse.json({ error: "Failed to process coupon request" }, { status: 500 });
  }
}

// POST /api/coupons - Create coupon (Admin Only)
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { code, discountType, discountValue, isActive } = await request.json();

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json({ error: "Missing required coupon fields" }, { status: 400 });
    }

    // Check duplicate
    const existing = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ message: "Coupon created successfully!", coupon }, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json({ error: "Server error during coupon creation" }, { status: 500 });
  }
}

// PUT /api/coupons - Edit coupon (Admin Only)
export async function PUT(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id, code, discountType, discountValue, isActive } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing coupon ID" }, { status: 400 });
    }

    const updated = await db.coupon.update({
      where: { id },
      data: {
        code: code ? code.toUpperCase() : undefined,
        discountType,
        discountValue: discountValue !== undefined ? parseFloat(discountValue) : undefined,
        isActive,
      },
    });

    return NextResponse.json({ message: "Coupon updated successfully!", coupon: updated });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json({ error: "Server error updating coupon" }, { status: 500 });
  }
}

// DELETE /api/coupons - Delete coupon (Admin Only)
export async function DELETE(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing coupon ID" }, { status: 400 });
    }

    await db.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Coupon deleted successfully!" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ error: "Server error deleting coupon" }, { status: 500 });
  }
}
