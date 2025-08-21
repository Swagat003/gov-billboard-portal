import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; 

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, loginAs } = body;

    if (!email || !password || !loginAs) {
      return new Response(JSON.stringify({ error: "Email, password, and role are required" }), { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
    }

    if (user.role !== loginAs) {
      return new Response(JSON.stringify({ error: "Invalid role selected. Please choose the correct role." }), { status: 401 });
    }

    // create JWT
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
