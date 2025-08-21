import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'ADVERTISER') {
      return new Response(JSON.stringify({ error: "Access denied. Only advertisers can book hoardings." }), { status: 403 });
    }

    const body = await req.json();
    const { advertisementId, hoardingId, startDate, endDate, qrCodeNo } = body;

    if (!advertisementId || !hoardingId || !startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: "Advertisement ID, hoarding ID, start date, and end date are required" }),
        { status: 400 }
      );
    }

    const advertisement = await prisma.advertisement.findFirst({
      where: {
        advertise_no: advertisementId,
        advertiserId: decoded.id,
        approved: true 
      }
    });

    if (!advertisement) {
      return new Response(
        JSON.stringify({ error: "Advertisement not found or not approved" }),
        { status: 404 }
      );
    }

    const hoarding = await prisma.hoarding.findFirst({
      where: {
        hoarding_no: hoardingId,
        isAvailable: true,
        advertisement: null
      }
    });

    if (!hoarding) {
      return new Response(
        JSON.stringify({ error: "Hoarding not found or not available" }),
        { status: 404 }
      );
    }

    const conflictingBooking = await prisma.hoardingAdvertisement.findFirst({
      where: {
        hoardingId: hoardingId,
        OR: [
          {
            startDate: {
              lte: new Date(endDate)
            },
            endDate: {
              gte: new Date(startDate)
            }
          }
        ]
      }
    });

    if (conflictingBooking) {
      return new Response(
        JSON.stringify({ error: "Hoarding is already booked for the selected dates" }),
        { status: 400 }
      );
    }

    const booking = await prisma.hoardingAdvertisement.create({
      data: {
        hoardingId,
        advertisementId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        qrCodeNo: '' 
      }
    });

    const generatedQrCode = qrCodeNo || `${hoardingId}-${advertisementId}-${booking.id}`;
    
    const updatedBooking = await prisma.hoardingAdvertisement.update({
      where: {
        id: booking.id
      },
      data: {
        qrCodeNo: generatedQrCode
      }
    });

    await prisma.hoarding.update({
      where: {
        hoarding_no: hoardingId
      },
      data: {
        isAvailable: false
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Advertisement booked on hoarding successfully",
        data: updatedBooking
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Book hoarding error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
