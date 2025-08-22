import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const totalReports = await prisma.report.count();
    const pendingReports = await prisma.report.count({ where: { status: 'PENDING' } });
    const reviewedReports = await prisma.report.count({ where: { status: 'REVIEWED' } });
    const actionTakenReports = await prisma.report.count({ where: { status: 'ACTION_TAKEN' } });

    const reportsByType = await prisma.report.groupBy({
      by: ['issueType'],
      _count: { issueType: true }
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentReports = await prisma.report.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    const reportsWithQR = await prisma.report.count({
      where: {
        qrCodeNo: {
          not: null
        }
      }
    });

    const resolvedReports = actionTakenReports; 
    const resolutionRate = totalReports > 0 ? ((resolvedReports / totalReports) * 100).toFixed(1) : 0;

    const issueTypeData = reportsByType.map(item => ({
      type: getIssueTypeLabel(item.issueType),
      count: item._count.issueType,
      percentage: totalReports > 0 ? ((item._count.issueType / totalReports) * 100).toFixed(1) : 0
    }));

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          total: totalReports,
          pending: pendingReports,
          reviewed: reviewedReports,
          actionTaken: actionTakenReports,
          resolved: actionTakenReports 
        },
        metrics: {
          recentReports,
          reportsWithQR,
          resolutionRate: parseFloat(resolutionRate),
          averageResponseTime: '2.5 hours' 
        },
        issueTypes: issueTypeData,
        trends: {
          thisWeek: recentReports,
          lastWeek: Math.max(0, totalReports - recentReports), 
          changePercentage: totalReports > recentReports ? 
            (((recentReports / (totalReports - recentReports)) * 100).toFixed(1)) : '0'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch statistics'
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
