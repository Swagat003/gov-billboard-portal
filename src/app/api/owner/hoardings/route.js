import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'OWNER') {
      return new Response(JSON.stringify({ error: "Access denied. Only owners can view hoardings." }), { status: 403 });
    }

    const hoardings = await prisma.hoarding.findMany({
      where: {
        ownerId: decoded.id
      },
      include: {
        advertisement: {
          include: {
            advertisement: {
              include: {
                advertiser: {
                  select: {
                    name: true,
                    email: true,
                    phone: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const totalHoardings = hoardings.length;
    const availableHoardings = hoardings.filter(h => h.isAvailable).length;
    const occupiedHoardings = totalHoardings - availableHoardings;

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          hoardings,
          stats: {
            total: totalHoardings,
            available: availableHoardings,
            occupied: occupiedHoardings
          }
        }
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Get hoardings error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'OWNER') {
      return new Response(JSON.stringify({ error: "Access denied. Only owners can create hoardings." }), { status: 403 });
    }

    const body = await req.json();
    const { height, width, address, installation_date, latitude, longitude } = body;

    if (!height || !width || !address || !installation_date) {
      return new Response(
        JSON.stringify({ error: "Height, width, address, and installation date are required" }),
        { status: 400 }
      );
    }

    const hoardingData = {
      ownerId: decoded.id,
      height: parseFloat(height),
      width: parseFloat(width),
      address,
      installation_date: new Date(installation_date),
      isAvailable: true
    };

    if (latitude && latitude.trim() !== '') {
      hoardingData.latitude = parseFloat(latitude);
    }
    if (longitude && longitude.trim() !== '') {
      hoardingData.longitude = parseFloat(longitude);
    }

    const hoarding = await prisma.hoarding.create({
      data: hoardingData
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Hoarding created successfully",
        data: hoarding
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Create hoarding error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
