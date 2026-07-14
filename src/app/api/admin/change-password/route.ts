import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { logger, logError } from "@/lib/logger";

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// POST /api/admin/change-password - Change logged-in user password
export async function POST(request: Request) {
  logger.info({ method: "POST", url: "/api/admin/change-password" }, "POST /api/admin/change-password - Request received");
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "Old password and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long" }, { status: 400 });
    }

    // Retrieve user record including hashed password
    const userRecord = await db.user.findUnique({
      where: { id: authUser.id },
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    // Validate old password match
    const isValid = bcrypt.compareSync(oldPassword, userRecord.password);
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect old password" }, { status: 400 });
    }

    // Hash new password and save
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await db.user.update({
      where: { id: authUser.id },
      data: {
        password: hashedPassword,
      },
    });

    logger.info({ method: "POST", url: "/api/admin/change-password" }, "POST /api/admin/change-password - Request completed successfully");
    return NextResponse.json({ message: "Password updated successfully!" });
  } catch (error) {
    logError(error, { method: "POST", url: "/api/admin/change-password" });
    return NextResponse.json({ error: "Server error changing password" }, { status: 500 });
  }
}
