import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    console.log("Register API called");
    const body = await req.json();
    console.log("Request body:", body);
    const { name, email, registeringAs, phone, govIdType, govIdNo, password } = body;

    if (!name || !email || !registeringAs || !phone || !govIdType || !govIdNo || !password) {
      console.log("Missing required fields");
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        gov_id_type: govIdType,
        gov_id_no: govIdNo,
        role: registeringAs,
      },
    });


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
