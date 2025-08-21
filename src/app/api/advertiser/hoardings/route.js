import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'ADVERTISER') {
      return new Response(JSON.stringify({ error: "Access denied. Only advertisers can view available hoardings." }), { status: 403 });
    }

    const availableHoardings = await prisma.hoarding.findMany({
      where: {
        isAvailable: true,
        advertisement: null 
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: availableHoardings
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Get available hoardings error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
