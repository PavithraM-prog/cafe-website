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

// GET /api/reservations - Fetch reservations (customer's own, or all if admin)
export async function GET(request: Request) {
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
      return NextResponse.json({ reservations });
    }

    // Customer can only see their own
    const reservations = await db.reservation.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    logger.error("Error fetching reservations", error);
    return NextResponse.json({ error: "Failed to load reservations" }, { status: 500 });
  }
}

// POST /api/reservations - Create a table reservation booking
export async function POST(request: Request) {
  try {
    const user = await getAuthUser(); // Optional, user can book as guest, but associate if logged in
    
    const body = await request.json();
    const { name, email, phone, date, time, guests, note, type } = body;

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

    return NextResponse.json({ message: "Table reservation requested successfully", reservation }, { status: 201 });
  } catch (error) {
    logger.error("Error creating reservation", error);
    return NextResponse.json({ error: "Server error during reservation creation" }, { status: 500 });
  }
}

// PUT /api/reservations - Update reservation status (Admin Only)
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
      return NextResponse.json({ error: "Missing reservation ID or status" }, { status: 400 });
    }

    const updated = await db.reservation.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ message: `Reservation status updated to ${status}`, reservation: updated });
  } catch (error) {
    logger.error("Error updating reservation", error, { id, status });
    return NextResponse.json({ error: "Server error during reservation update" }, { status: 500 });
  }
}
