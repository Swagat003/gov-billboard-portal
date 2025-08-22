import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const report = await prisma.report.findUnique({
      where: { report_no: id }
    });

    if (!report) {
      return NextResponse.json({
        success: false,
        error: 'Report not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch report'
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    console.log('PUT request received for report ID:', params.id);
    
    const { id } = params;
    const body = await request.json();
    console.log('Request body:', body);
    
    const { status } = body;

    const validStatuses = ['PENDING', 'REVIEWED', 'ACTION_TAKEN'];
    if (!validStatuses.includes(status)) {
      console.log('Invalid status provided:', status);
      return NextResponse.json({
        success: false,
        error: `Invalid status. Valid options are: ${validStatuses.join(', ')}`
      }, { status: 400 });
    }

    console.log('Updating report in database...');
    const updatedReport = await prisma.report.update({
      where: { report_no: id },
      data: { status }
    });
    
    console.log('Report updated successfully:', updatedReport);

    return NextResponse.json({
      success: true,
      data: updatedReport,
      message: `Report status updated to ${status}`
    });

  } catch (error) {
    console.error('Error updating report:', error);
    
    if (error.code === 'P2025') {
      console.log('Report not found:', params.id);
      return NextResponse.json({
        success: false,
        error: 'Report not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update report status: ' + error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await prisma.report.delete({
      where: { report_no: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting report:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Report not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to delete report'
    }, { status: 500 });
  }
}
