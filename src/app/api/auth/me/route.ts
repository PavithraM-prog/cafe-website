import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: { name: true },
        },
        loyaltyPoints: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        loyaltyPoints: user.loyaltyPoints,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in auth/me route:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
