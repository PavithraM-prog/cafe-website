import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { logger, logError } from "@/lib/logger";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || (decoded.role !== "ADMIN" && decoded.role !== "STAFF")) return null;
  return decoded;
}

// GET /api/admin/staff - Fetch list of all workers
export async function GET(request: Request) {
  logger.info({ method: "GET", url: "/api/admin/staff" }, "GET /api/admin/staff - Request received");
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { role: { contains: search, mode: "insensitive" } },
      ];
    }

    const staff = await db.staff.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
    });

    logger.info({ method: "GET", url: "/api/admin/staff" }, "GET /api/admin/staff - Request completed successfully");
    return NextResponse.json({ staff });
  } catch (error) {
    logError(error, { method: "GET", url: "/api/admin/staff" });
    return NextResponse.json({ error: "Server error fetching staff directory" }, { status: 500 });
  }
}

// POST /api/admin/staff - Create/Hire a new worker
export async function POST(request: Request) {
  logger.info({ method: "POST", url: "/api/admin/staff" }, "POST /api/admin/staff - Request received");
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Name, email, and role are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check unique email constraint
    const existing = await db.staff.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return NextResponse.json({ error: "A worker with this email already exists" }, { status: 400 });
    }

    const newWorker = await db.staff.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        role: role.toUpperCase(), // BARISTA, CHEF, SERVER, MANAGER
      },
    });

    logger.info({ method: "POST", url: "/api/admin/staff" }, "POST /api/admin/staff - Request completed successfully");
    return NextResponse.json({ message: "Staff member added successfully", staff: newWorker }, { status: 201 });
  } catch (error) {
    logError(error, { method: "POST", url: "/api/admin/staff" });
    return NextResponse.json({ error: "Server error adding staff member" }, { status: 500 });
  }
}

// PUT /api/admin/staff - Edit worker details
export async function PUT(request: Request) {
  logger.info({ method: "PUT", url: "/api/admin/staff" }, "PUT /api/admin/staff - Request received");
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, email, role } = body;

    if (!id || !name || !email || !role) {
      return NextResponse.json({ error: "ID, Name, Email, and Role are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check email clashes
    const clash = await db.staff.findFirst({
      where: {
        email: normalizedEmail,
        id: { not: id },
      },
    });
    if (clash) {
      return NextResponse.json({ error: "This email is already registered to another staff member" }, { status: 400 });
    }

    const updated = await db.staff.update({
      where: { id },
      data: {
        name: name.trim(),
        email: normalizedEmail,
        role: role.toUpperCase(),
      },
    });

    logger.info({ method: "PUT", url: "/api/admin/staff" }, "PUT /api/admin/staff - Request completed successfully");
    return NextResponse.json({ message: "Staff member updated successfully", staff: updated });
  } catch (error) {
    logError(error, { method: "PUT", url: "/api/admin/staff" });
    return NextResponse.json({ error: "Server error updating staff member details" }, { status: 500 });
  }
}

// DELETE /api/admin/staff - Fire/Remove a worker
export async function DELETE(request: Request) {
  logger.info({ method: "DELETE", url: "/api/admin/staff" }, "DELETE /api/admin/staff - Request received");
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing staff ID" }, { status: 400 });
    }

    await db.staff.delete({
      where: { id },
    });

    logger.info({ method: "DELETE", url: "/api/admin/staff" }, "DELETE /api/admin/staff - Request completed successfully");
    return NextResponse.json({ message: "Staff member removed successfully" });
  } catch (error) {
    logError(error, { method: "DELETE", url: "/api/admin/staff" });
    return NextResponse.json({ error: "Server error deleting staff member" }, { status: 500 });
  }
}
