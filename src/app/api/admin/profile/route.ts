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

// PUT /api/admin/profile - Update admin/staff profile details
export async function PUT(request: Request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check email uniqueness constraint in User table
    const clash = await db.user.findFirst({
      where: {
        email: normalizedEmail,
        id: { not: authUser.id },
      },
    });

    if (clash) {
      return NextResponse.json({ error: "Email is already taken by another account" }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: authUser.id },
      data: {
        name: name.trim(),
        email: normalizedEmail,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        loyaltyPoints: true,
      },
    });

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    return NextResponse.json({ error: "Server error updating profile details" }, { status: 500 });
  }
}
