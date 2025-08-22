import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    const whereClause = {};
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause.OR = [
        { report_no: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { reporterPhone: { contains: search } },
        { qrCodeNo: { contains: search, mode: 'insensitive' } }
      ];
    }

    const reports = await prisma.report.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const totalReports = await prisma.report.count({ where: whereClause });

    const stats = await prisma.report.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    const statsFormatted = {
      total: await prisma.report.count(),
      pending: stats.find(s => s.status === 'PENDING')?._count?.status || 0,
      reviewed: stats.find(s => s.status === 'REVIEWED')?._count?.status || 0,
      actionTaken: stats.find(s => s.status === 'ACTION_TAKEN')?._count?.status || 0
    };

    const transformedReports = reports.map(report => ({
      id: report.report_no,
      reportId: report.report_no.substring(0, 8).toUpperCase(),
      type: getIssueTypeLabel(report.issueType),
      description: report.description,
      location: extractLocationFromGeography(report.location) || 'Location not specified',
      reporterPhone: report.reporterPhone,
      status: report.status,
      priority: getIssuePriority(report.issueType),
      dateReported: report.createdAt.toISOString().split('T')[0],
      assignedOfficer: getAssignedOfficer(report.issueType),
      category: getCategoryFromIssueType(report.issueType),
      evidence: report.imageUrl ? [report.imageUrl] : [],
      qrCodeNo: report.qrCodeNo || 'N/A'
    }));

    return NextResponse.json({
      success: true,
      data: {
        reports: transformedReports,
        stats: statsFormatted,
        pagination: {
          page,
          limit,
          total: totalReports,
          totalPages: Math.ceil(totalReports / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch reports'
    }, { status: 500 });
  }
}

function getIssueTypeLabel(issueType) {
  const labels = {
    'NO_QR': 'Missing QR Code',
    'BANNED_CONTENT': 'Inappropriate Content',
    'ILLEGAL_INSTALLATION': 'Illegal Installation',
    'STRUCTURAL_HAZARD': 'Structural Damage'
  };
  return labels[issueType] || issueType;
}

function getIssuePriority(issueType) {
  const priorities = {
    'STRUCTURAL_HAZARD': 'Critical',
    'ILLEGAL_INSTALLATION': 'High',
    'BANNED_CONTENT': 'High',
    'NO_QR': 'Medium'
  };
  return priorities[issueType] || 'Low';
}

function getAssignedOfficer(issueType) {
  const officers = {
    'STRUCTURAL_HAZARD': 'Officer Sharma (Safety)',
    'ILLEGAL_INSTALLATION': 'Officer Patel (Compliance)',
    'BANNED_CONTENT': 'Officer Gupta (Content)',
    'NO_QR': 'Officer Reddy (Technical)'
  };
  return officers[issueType] || 'Officer Kumar';
}

function getCategoryFromIssueType(issueType) {
  const categories = {
    'NO_QR': 'Technical',
    'BANNED_CONTENT': 'Content',
    'ILLEGAL_INSTALLATION': 'Compliance',
    'STRUCTURAL_HAZARD': 'Safety'
  };
  return categories[issueType] || 'General';
}

function extractLocationFromGeography(location) {
  if (!location) return null;
  return 'Reported Location (GPS)';
}
