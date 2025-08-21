import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'OWNER') {
      return new Response(JSON.stringify({ error: "Access denied. Only owners can view hoarding details." }), { status: 403 });
    }

    const { id } = await params;

    const hoarding = await prisma.hoarding.findFirst({
      where: {
        hoarding_no: id,
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
      }
    });

    if (!hoarding) {
      return new Response(JSON.stringify({ error: "Hoarding not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: hoarding
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Get hoarding details error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'OWNER') {
      return new Response(JSON.stringify({ error: "Access denied. Only owners can update hoardings." }), { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { height, width, address, isAvailable } = body;

    const existingHoarding = await prisma.hoarding.findFirst({
      where: {
        hoarding_no: id,
        ownerId: decoded.id
      }
    });

    if (!existingHoarding) {
      return new Response(JSON.stringify({ error: "Hoarding not found" }), { status: 404 });
    }

    const updatedHoarding = await prisma.hoarding.update({
      where: {
        hoarding_no: id
      },
      data: {
        ...(height && { height: parseFloat(height) }),
        ...(width && { width: parseFloat(width) }),
        ...(address && { address }),
        ...(typeof isAvailable === 'boolean' && { isAvailable })
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Hoarding updated successfully",
        data: updatedHoarding
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Update hoarding error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'OWNER') {
      return new Response(JSON.stringify({ error: "Access denied. Only owners can delete hoardings." }), { status: 403 });
    }

    const { id } = await params;

    const existingHoarding = await prisma.hoarding.findFirst({
      where: {
        hoarding_no: id,
        ownerId: decoded.id
      }
    });

    if (!existingHoarding) {
      return new Response(JSON.stringify({ error: "Hoarding not found" }), { status: 404 });
    }

    const activeAd = await prisma.hoardingAdvertisement.findFirst({
      where: {
        hoardingId: id,
        endDate: {
          gte: new Date()
        }
      }
    });

    if (activeAd) {
      return new Response(
        JSON.stringify({ error: "Cannot delete hoarding with active advertisement" }),
        { status: 400 }
      );
    }

    await prisma.hoarding.delete({
      where: {
        hoarding_no: id
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Hoarding deleted successfully"
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete hoarding error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
