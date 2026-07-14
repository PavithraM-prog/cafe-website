import { NextResponse } from "next/server";
import { logger, logError } from "@/lib/logger";

export async function POST() {
  logger.info({ method: "POST", url: "/api/auth/logout" }, "POST /api/auth/logout - Request received");
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });
    
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });

    logger.info({ method: "POST", url: "/api/auth/logout" }, "POST /api/auth/logout - Request completed successfully");
    return response;
  } catch (error) {
    logError(error, { method: "POST", url: "/api/auth/logout" });
    return NextResponse.json({ error: "Server error during logout" }, { status: 500 });
  }
}
