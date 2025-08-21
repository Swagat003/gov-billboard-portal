import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    console.log("Register API called");
    const body = await req.json();
    console.log("Request body:", body);
    const { name, email, registeringAs, phone, govIdType, govIdNo, password } = body;

    // Validate input
    if (!name || !email || !registeringAs || !phone || !govIdType || !govIdNo || !password) {
      console.log("Missing required fields");
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 1. Check if user exists
    console.log("Checking if user exists for email:", email);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    console.log("Existing user:", existingUser);
    
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // 2. Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // 3. Save user
    console.log("Creating user with data:", {
      name,
      email,
      phone,
      gov_id_type: govIdType,
      gov_id_no: govIdNo,
      role: registeringAs,
    });

    // 3. Save user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        gov_id_type: govIdType,
        gov_id_no: govIdNo,
        role: registeringAs, // OWNER or ADVERTISER
      },
    });

    console.log("User created successfully:", user);

    return NextResponse.json(
      { message: "User registered successfully", user: { id: user.user_id, role: user.role } },
      { status: 201 }
    );

  } catch (error) {
    console.error("Register API Error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json({ 
      error: "Something went wrong", 
      details: error.message 
    }, { status: 500 });
  }
}
