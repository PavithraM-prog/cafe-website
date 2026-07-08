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

// GET /api/admin/attendance - Fetch daily or historical attendance logs
export async function GET(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const filterDate = searchParams.get("date"); // YYYY-MM-DD
    const filterStaff = searchParams.get("staffId");

    const whereClause: any = {};
    if (filterDate && filterDate !== "ALL") {
      whereClause.date = filterDate;
    }
    if (filterStaff && filterStaff !== "ALL") {
      whereClause.staffId = filterStaff;
    }

    const logs = await db.attendanceLog.findMany({
      where: whereClause,
      include: {
        staff: true,
      },
      orderBy: { loginTime: "desc" },
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Error fetching attendance logs:", error);
    return NextResponse.json({ error: "Server error fetching attendance directory" }, { status: 500 });
  }
}

// POST /api/admin/attendance - Clock-in a staff member / Manually log attendance
export async function POST(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await request.json();
    const { staffId, date, loginTime, logoutTime } = body; // loginTime/logoutTime as ISO strings

    if (!staffId || !date || !loginTime) {
      return NextResponse.json({ error: "Staff ID, Date, and Login time are required" }, { status: 400 });
    }

    // Check if the staff member already clocked in on that date (prevent duplicate standard clock-in, but allow if manual logging)
    const existingLog = await db.attendanceLog.findFirst({
      where: {
        staffId,
        date,
        logoutTime: null,
      },
    });

    if (existingLog && !logoutTime) {
      return NextResponse.json({ error: "This worker is already clocked in for today" }, { status: 400 });
    }

    const newLog = await db.attendanceLog.create({
      data: {
        staffId,
        date,
        loginTime: new Date(loginTime),
        logoutTime: logoutTime ? new Date(logoutTime) : null,
      },
      include: {
        staff: true,
      },
    });

    return NextResponse.json({ message: "Attendance logged successfully", log: newLog }, { status: 201 });
  } catch (error) {
    console.error("Error logging attendance:", error);
    return NextResponse.json({ error: "Server error during attendance log creation" }, { status: 500 });
  }
}

// PUT /api/admin/attendance - Clock-out a staff member / Update attendance log
export async function PUT(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await request.json();
    const { id, loginTime, logoutTime, date } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing log ID" }, { status: 400 });
    }

    const updateData: any = {};
    if (loginTime) updateData.loginTime = new Date(loginTime);
    if (logoutTime) updateData.logoutTime = new Date(logoutTime);
    if (date) updateData.date = date;

    const updatedLog = await db.attendanceLog.update({
      where: { id },
      data: updateData,
      include: {
        staff: true,
      },
    });

    return NextResponse.json({ message: "Attendance log updated successfully", log: updatedLog });
  } catch (error) {
    console.error("Error updating attendance log:", error);
    return NextResponse.json({ error: "Server error updating attendance log" }, { status: 500 });
  }
}
