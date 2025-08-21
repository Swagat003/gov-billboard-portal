import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "No token found" }),
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch complete user details from database
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.id },
      select: {
        user_id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({
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
    console.error("Token verification failed:", err);
    return new Response(
      JSON.stringify({ error: "Invalid token" }),
      { status: 401 }
    );
  }
}
