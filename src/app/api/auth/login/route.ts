import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { logger, logError } from "@/lib/logger";

export async function POST(request: Request) {
  logger.info({ method: "POST", url: "/api/auth/login" }, "POST /api/auth/login - Request received");
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Please enter email and password" }, { status: 400 });
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    // Sign JWT
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role.name,
    });

    const response = NextResponse.json({
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        loyaltyPoints: user.loyaltyPoints,
      },
    });

    // Set cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    logger.info({ method: "POST", url: "/api/auth/login" }, "POST /api/auth/login - Request completed successfully");
    return response;
  } catch (error: any) {
    logError(error, { method: "POST", url: "/api/auth/login" });
    return NextResponse.json({ error: "Server error during login" }, { status: 500 });
  }
}
