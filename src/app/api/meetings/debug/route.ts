import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const meetings = await prisma.meeting.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        scheduledAt: true,
        meetingLink: true,
        status: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      count: meetings.length,
      meetings: meetings
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
