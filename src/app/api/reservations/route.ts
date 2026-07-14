import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { logger, logError } from "@/lib/logger";

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/reservations - Fetch reservations (customer's own, or all if admin)
export async function GET(request: Request) {
  logger.info({ method: "GET", url: "/api/reservations" }, "GET /api/reservations - Request received");
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filterStatus = searchParams.get("status");
    const filterType = searchParams.get("type"); // TABLE, EVENT, ALL

    // Admin/Staff can see everything
    if (user.role === "ADMIN" || user.role === "STAFF") {
      const where: any = {};
      if (filterStatus && filterStatus !== "ALL") where.status = filterStatus;
      if (filterType && filterType !== "ALL") where.type = filterType;
      
      const reservations = await db.reservation.findMany({
        where,
        orderBy: { date: "asc" },
      });
      logger.info({ method: "GET", url: "/api/reservations" }, "GET /api/reservations (admin) - Request completed successfully");
      return NextResponse.json({ reservations });
    }

    // Customer can only see their own
    const reservations = await db.reservation.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { date: "desc" },
    });

    logger.info({ method: "GET", url: "/api/reservations" }, "GET /api/reservations - Request completed successfully");
    return NextResponse.json({ reservations });
  } catch (error) {
    logError(error, { method: "GET", url: "/api/reservations" });
    return NextResponse.json({ error: "Failed to load reservations" }, { status: 500 });
  }
}

// POST /api/reservations - Create a table reservation booking
export async function POST(request: Request) {
  logger.info({ method: "POST", url: "/api/reservations" }, "POST /api/reservations - Request received");
  try {
    const user = await getAuthUser(); // Optional, user can book as guest, but associate if logged in
    
    const body = await request.json();
    const { name, email, phone, date, time, guests, note } = body;

    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    const reservation = await db.reservation.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        date,
        time,
        guests: parseInt(guests),
        note: note || "",
        status: "PENDING",
        userId: user ? user.id : null,
      },
    });

    logger.info({ method: "POST", url: "/api/reservations" }, "POST /api/reservations - Request completed successfully");
    return NextResponse.json({ message: "Table reservation requested successfully", reservation }, { status: 201 });
  } catch (error) {
    logError(error, { method: "POST", url: "/api/reservations" });
    return NextResponse.json({ error: "Server error during reservation creation" }, { status: 500 });
  }
}

// PUT /api/reservations - Update reservation status (Admin Only)
export async function PUT(request: Request) {
  logger.info({ method: "PUT", url: "/api/reservations" }, "PUT /api/reservations - Request received");
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body; // status: APPROVED, REJECTED, CANCELLED, COMPLETED

    if (!id || !status) {
      return NextResponse.json({ error: "Missing reservation ID or status" }, { status: 400 });
    }

    const updated = await db.reservation.update({
      where: { id },
      data: { status },
    });

    logger.info({ method: "PUT", url: "/api/reservations" }, "PUT /api/reservations - Request completed successfully");
    return NextResponse.json({ message: `Reservation status updated to ${status}`, reservation: updated });
  } catch (error) {
    logError(error, { method: "PUT", url: "/api/reservations" });
    return NextResponse.json({ error: "Server error during reservation update" }, { status: 500 });
  }
}
