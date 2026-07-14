import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { db } from "@/lib/db";
import { logger, logError } from "@/lib/logger";

export async function GET() {
  logger.info({ method: "GET", url: "/api/auth/me" }, "GET /api/auth/me - Request received");
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      logger.info({ method: "GET", url: "/api/auth/me" }, "GET /api/auth/me - No token, returning 401");
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      logger.info({ method: "GET", url: "/api/auth/me" }, "GET /api/auth/me - Invalid token, returning 401");
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
      logger.info({ method: "GET", url: "/api/auth/me" }, "GET /api/auth/me - User not found in database");
      return NextResponse.json({ user: null }, { status: 404 });
    }

    logger.info({ method: "GET", url: "/api/auth/me" }, "GET /api/auth/me - Request completed successfully");
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
    logError(error, { method: "GET", url: "/api/auth/me" });
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
