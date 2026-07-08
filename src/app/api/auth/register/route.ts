import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Please enter all required fields" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get role ID for CUSTOMER
    let customerRole = await db.role.findUnique({
      where: { name: "CUSTOMER" },
    });
    
    if (!customerRole) {
      customerRole = await db.role.create({
        data: { name: "CUSTOMER" },
      });
    }

    // Create user
    await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        roleId: customerRole.id,
        loyaltyPoints: 0,
      },
    });

    return NextResponse.json({ message: "Registration successful!" }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Server error during registration" }, { status: 500 });
  }
}
