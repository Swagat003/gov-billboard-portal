import { PrismaClient, Prisma } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
    // Create an Admin
    const admin = await prisma.user.upsert({
        where: { email: "admin@bmc.gov" },
        update: {},  // nothing to update for now
        create: {
            name: "Admin User",
            email: "admin@bmc.gov",
            password: "secureadminpass",
            phone: "9999999999",
            gov_id_type: "PAN",
            gov_id_no: "ADMIN1234",
            role: "ADMIN",
        },
    })

    console.log("✅ Admin created:", admin.user_id)

    // Create an Owner
    const owner = await prisma.user.upsert({
        where: { email: "ravi@owner.com" },
        update: {},  // nothing to update for now
        create: {
            name: "Ravi Owner",
            email: "ravi@owner.com",
            password: "hashedpass123",
            phone: "9876543210",
            gov_id_type: "AADHAR",
            gov_id_no: "1234-5678-9012",
            role: "OWNER",
        },
    })
    console.log("✅ Owner created:", owner.user_id)

    // Create a Hoarding (using raw SQL for PostGIS geography)
    const hoardingResult = await prisma.$queryRaw`
        INSERT INTO "Hoarding" (hoarding_no, "ownerId", height, width, installation_date, location, address, "isAvailable", "createdAt", "updatedAt")
        VALUES (${`hoarding_${Date.now()}`}, ${owner.user_id}, ${10.5}, ${20.0}, ${new Date()}, ST_GeogFromText('POINT(85.8245 20.2961)'), ${'Jaydev Vihar Square'}, ${true}, ${new Date()}, ${new Date()})
        RETURNING hoarding_no, "ownerId", height, width, installation_date, ST_AsText(location) as location_text, address, "isAvailable", "createdAt", "updatedAt";
    ` as any;
    
    const hoarding = (hoardingResult as any[])[0];
    console.log("✅ Hoarding created:", hoarding?.hoarding_no || 'unknown')

    // Create an Advertiser
    const advertiser = await prisma.user.upsert({
        where: { email: "sita@ads.com" },
        update: {},  // nothing to update for now
        create: {
            name: "Sita Advertiser",
            email: "sita@ads.com",
            password: "hashedpass456",
            phone: "9123456780",
            gov_id_type: "PAN",
            gov_id_no: "ABCDE1234F",
            role: "ADVERTISER",
        },
    })
    console.log("✅ Advertiser created:", advertiser.user_id)

    // Create an Advertisement
    const ad = await prisma.advertisement.create({
        data: {
            advertiserId: advertiser.user_id,
            title: "New Store Opening",
            description: "Grand opening of fashion store",
            category: "Retail",
            contentUrl: "https://example.com/ad.png",
            approved: true,
        },
    })
    console.log("✅ Advertisement created:", ad.advertise_no)

    // Create Placement (HoardingAdvertisement)
    let placement = await prisma.hoardingAdvertisement.create({
        data: {
            hoardingId: hoarding.hoarding_no,
            advertisementId: ad.advertise_no,
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // +1 month
        },
    })

    // Generate QR code value = hoarding_no + advertise_no + placement.id
    const qrCodeNo = `${hoarding.hoarding_no}_${ad.advertise_no}_${placement.id}`

    // Update placement with qrCodeNo
    placement = await prisma.hoardingAdvertisement.update({
        where: { id: placement.id },
        data: { qrCodeNo },
    })

    console.log("✅ Placement created with QR:", placement.qrCodeNo)

    // Create sample Reports
    const report1 = await prisma.report.create({
        data: {
            qrCodeNo: placement.qrCodeNo,
            reporterPhone: "9876543210",
            issueType: "NO_QR",
            description: "QR code is not visible or damaged on this hoarding",
            status: "PENDING",
        },
    })
    console.log("✅ Report 1 created:", report1.report_no)

    const report2 = await prisma.report.create({
        data: {
            reporterPhone: "9123456789",
            issueType: "ILLEGAL_INSTALLATION",
            description: "This hoarding appears to be installed without proper permits",
            status: "REVIEWED",
        },
    })
    console.log("✅ Report 2 created:", report2.report_no)

    // Create a report with PostGIS location using raw SQL
    const reportWithLocationResult = await prisma.$queryRaw`
        INSERT INTO "Report" (report_no, "qrCodeNo", "reporterPhone", "issueType", description, location, status, "createdAt")
        VALUES (${`report_${Date.now()}`}, ${placement.qrCodeNo}, ${'9988776655'}, ${'STRUCTURAL_HAZARD'}::"ReportType", ${'This hoarding structure looks unstable and poses safety risk'}, ST_GeogFromText('POINT(85.8250 20.2965)'), ${'PENDING'}::"ReportStatus", ${new Date()})
        RETURNING report_no, "qrCodeNo", "reporterPhone", "issueType", description, ST_AsText(location) as location_text, status, "createdAt";
    ` as any;
    
    const reportWithLocation = (reportWithLocationResult as any[])[0];
    console.log("✅ Report with location created:", reportWithLocation?.report_no || 'unknown')

    const report4 = await prisma.report.create({
        data: {
            reporterPhone: "9555666777",
            issueType: "BANNED_CONTENT",
            description: "Advertisement contains inappropriate content that violates community guidelines",
            imageUrl: "https://example.com/evidence.jpg",
            status: "ACTION_TAKEN",
        },
    })
    console.log("✅ Report 4 created:", report4.report_no)
}

main()
    .then(() => {
        console.log("🌱 Database seeding finished successfully!")
    })
    .catch((e) => {
        console.error("❌ Error seeding database:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
