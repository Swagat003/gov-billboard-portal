import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'ADVERTISER') {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    const { id } = params;

    const advertisement = await prisma.advertisement.findFirst({
      where: {
        advertise_no: id,
        advertiserId: decoded.id
      },
      include: {
        hoardings: {
          include: {
            hoarding: {
              include: {
                owner: {
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

    if (!advertisement) {
      return new Response(JSON.stringify({ error: "Advertisement not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: advertisement
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Get advertisement error:", err);
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
    
    if (decoded.role !== 'ADVERTISER') {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { title, description, category, contentUrl } = body;

    const existingAd = await prisma.advertisement.findFirst({
      where: {
        advertise_no: id,
        advertiserId: decoded.id
      }
    });

    if (!existingAd) {
      return new Response(JSON.stringify({ error: "Advertisement not found" }), { status: 404 });
    }

    const updatedAdvertisement = await prisma.advertisement.update({
      where: {
        advertise_no: id
      },
      data: {
        title: title || existingAd.title,
        description: description || existingAd.description,
        category: category || existingAd.category,
        contentUrl: contentUrl !== undefined ? contentUrl : existingAd.contentUrl,
        approved: false 
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Advertisement updated successfully",
        data: updatedAdvertisement
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Update advertisement error:", err);
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
    
    if (decoded.role !== 'ADVERTISER') {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    const { id } = params;

    const existingAd = await prisma.advertisement.findFirst({
      where: {
        advertise_no: id,
        advertiserId: decoded.id
      }
    });

    if (!existingAd) {
      return new Response(JSON.stringify({ error: "Advertisement not found" }), { status: 404 });
    }

    const activeAssignments = await prisma.hoardingAdvertisement.findMany({
      where: {
        advertisementId: id,
        endDate: {
          gte: new Date()
        }
      }
    });

    if (activeAssignments.length > 0) {
      return new Response(
        JSON.stringify({ error: "Cannot delete advertisement with active hoarding assignments" }), 
        { status: 400 }
      );
    }

    await prisma.advertisement.delete({
      where: {
        advertise_no: id
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Advertisement deleted successfully"
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete advertisement error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
