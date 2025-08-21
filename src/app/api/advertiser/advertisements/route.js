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
      return new Response(JSON.stringify({ error: "Access denied. Only advertisers can view advertisements." }), { status: 403 });
    }

    const advertisements = await prisma.advertisement.findMany({
      where: {
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const totalAdvertisements = advertisements.length;
    const activeAdvertisements = advertisements.filter(ad => 
      ad.hoardings.some(h => new Date(h.endDate) > new Date())
    ).length;
    const approvedAdvertisements = advertisements.filter(ad => ad.approved).length;
    const totalHoardings = advertisements.reduce((sum, ad) => sum + ad.hoardings.length, 0);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          advertisements,
          stats: {
            total: totalAdvertisements,
            active: activeAdvertisements,
            approved: approvedAdvertisements,
            totalHoardings: totalHoardings
          }
        }
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Get advertisements error:", err);
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
    
    if (decoded.role !== 'ADVERTISER') {
      return new Response(JSON.stringify({ error: "Access denied. Only advertisers can create advertisements." }), { status: 403 });
    }

    const body = await req.json();
    const { title, description, category, contentUrl } = body;

    if (!title || !description || !category) {
      return new Response(
        JSON.stringify({ error: "Title, description, and category are required" }),
        { status: 400 }
      );
    }

    const advertisement = await prisma.advertisement.create({
      data: {
        advertiserId: decoded.id,
        title,
        description,
        category,
        contentUrl: contentUrl || null,
        approved: true 
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Advertisement created successfully",
        data: advertisement
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Create advertisement error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
