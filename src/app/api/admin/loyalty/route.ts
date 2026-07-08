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

// GET /api/admin/loyalty - Fetch loyalty members list with optional search
export async function GET(request: Request) {
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
      ];
    }

    const members = await db.loyaltyMember.findMany({
      where: whereClause,
      orderBy: { points: "desc" },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Error fetching loyalty members:", error);
    return NextResponse.json({ error: "Server error fetching loyalty directory" }, { status: 500 });
  }
}

// POST /api/admin/loyalty - Register a new loyalty member
export async function POST(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, points } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check unique email constraint
    const existing = await db.loyaltyMember.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return NextResponse.json({ error: "A loyalty member with this email already exists" }, { status: 400 });
    }

    const newMember = await db.loyaltyMember.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        points: points ? parseInt(points) : 0,
      },
    });

    return NextResponse.json({ message: "Loyalty member registered successfully", member: newMember }, { status: 201 });
  } catch (error) {
    console.error("Error creating loyalty member:", error);
    return NextResponse.json({ error: "Server error during loyalty registration" }, { status: 500 });
  }
}

// PUT /api/admin/loyalty - Update loyalty member details / adjust points
export async function PUT(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, email, points } = body;

    if (!id || !name || !email) {
      return NextResponse.json({ error: "ID, Name, and Email are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check email clash
    const clash = await db.loyaltyMember.findFirst({
      where: {
        email: normalizedEmail,
        id: { not: id },
      },
    });
    if (clash) {
      return NextResponse.json({ error: "This email is already in use by another member" }, { status: 400 });
    }

    const updated = await db.loyaltyMember.update({
      where: { id },
      data: {
        name: name.trim(),
        email: normalizedEmail,
        points: points !== undefined ? parseInt(points) : undefined,
      },
    });

    return NextResponse.json({ message: "Loyalty member updated successfully", member: updated });
  } catch (error) {
    console.error("Error updating loyalty member:", error);
    return NextResponse.json({ error: "Server error updating loyalty account" }, { status: 500 });
  }
}

// DELETE /api/admin/loyalty - Remove a loyalty member
export async function DELETE(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing member ID" }, { status: 400 });
    }

    await db.loyaltyMember.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Loyalty member deleted successfully" });
  } catch (error) {
    console.error("Error deleting loyalty member:", error);
    return NextResponse.json({ error: "Server error deleting loyalty account" }, { status: 500 });
  }
}
