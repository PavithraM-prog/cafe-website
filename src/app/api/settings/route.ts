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

// GET /api/settings - Fetch all settings as key-value pairs
export async function GET() {
  try {
    const settingsList = await db.setting.findMany();
    
    // Map list of { id, value } to object { [key]: value }
    const settings = settingsList.reduce((acc: any, curr) => {
      acc[curr.id] = curr.value;
      return acc;
    }, {});

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

// PUT /api/settings - Bulk update settings (Admin Only)
export async function PUT(request: Request) {
  try {
    const adminUser = await checkAdminAuth();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await request.json(); // Expected: { key: value, key2: value2 }

    const updates = Object.entries(body).map(([key, value]) => {
      return db.setting.upsert({
        where: { id: key },
        update: { value: String(value) },
        create: { id: key, value: String(value) },
      });
    });

    await db.$transaction(updates);

    return NextResponse.json({ message: "Settings updated successfully!" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Server error updating settings" }, { status: 500 });
  }
}
