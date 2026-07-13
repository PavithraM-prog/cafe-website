import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  console.log("[Registration API] Received registration request.");
  try {
    const body = await request.json();
    const { name, email, password } = body;

    console.log(`[Registration API] Validating inputs for name: "${name}", email: "${email?.toLowerCase()}"`);

    if (!name || !email || !password) {
      console.warn("[Registration API] Missing required fields.");
      return NextResponse.json({ error: "Please enter all required fields" }, { status: 400 });
    }

    if (password.length < 6) {
      console.warn("[Registration API] Password too short.");
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    const lowercaseEmail = email.toLowerCase();

    // Check if user already exists
    console.log(`[Registration API] Checking if user exists with email: ${lowercaseEmail}`);
    const existingUser = await db.user.findUnique({
      where: { email: lowercaseEmail },
    });

    if (existingUser) {
      console.warn(`[Registration API] User already exists with email: ${lowercaseEmail}`);
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    // Hash password
    console.log("[Registration API] Hashing user password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get role ID for CUSTOMER
    console.log("[Registration API] Querying CUSTOMER role...");
    let customerRole = await db.role.findUnique({
      where: { name: "CUSTOMER" },
    });
    
    if (!customerRole) {
      console.log("[Registration API] CUSTOMER role not found. Creating it...");
      try {
        customerRole = await db.role.create({
          data: { name: "CUSTOMER" },
        });
        console.log(`[Registration API] CUSTOMER role created with ID: ${customerRole.id}`);
      } catch (roleErr: any) {
        console.warn("[Registration API] Concurrency issue during role creation, attempting re-query:", roleErr.message);
        customerRole = await db.role.findUnique({
          where: { name: "CUSTOMER" },
        });
      }
    } else {
      console.log(`[Registration API] CUSTOMER role found with ID: ${customerRole.id}`);
    }

    if (!customerRole) {
      console.error("[Registration API] Failed to resolve CUSTOMER role.");
      throw new Error("Unable to resolve CUSTOMER role for new user.");
    }

    // Create user
    console.log(`[Registration API] Creating user record for: ${lowercaseEmail}`);
    const newUser = await db.user.create({
      data: {
        name,
        email: lowercaseEmail,
        password: hashedPassword,
        roleId: customerRole.id,
        loyaltyPoints: 0,
      },
    });

    console.log(`[Registration API] Registration successful. User created with ID: ${newUser.id}`);
    return NextResponse.json({ message: "Registration successful!" }, { status: 201 });
  } catch (error: any) {
    console.error("[Registration API] CRITICAL ERROR during registration:", error);
    return NextResponse.json({ error: "Server error during registration", details: error.message }, { status: 500 });
  }
}
