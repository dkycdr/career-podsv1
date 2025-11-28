import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createDailyRoom } from '@/lib/daily';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user-id';

    // Create a meeting 5 minutes from now for quick testing
    const scheduledAt = new Date(Date.now() + 5 * 60 * 1000);
    const title = 'Test Daily.co Meeting';

    const meeting = await prisma.meeting.create({
      data: {
        title,
        scheduledAt,
        duration: 30,
        type: 'VIDEO_CALL',
        userId: userId && userId !== 'default-user-id' ? userId : null,
        status: 'SCHEDULED',
        maxAttendees: 6,
        attendeesCount: 1
      }
    });

    let dailyUrl: string | null = null;
    try {
      dailyUrl = await createDailyRoom(meeting.id, title);
      if (dailyUrl) {
        await prisma.meeting.update({ where: { id: meeting.id }, data: { meetingLink: dailyUrl } });
      }
    } catch (err) {
      console.error('Failed to create Daily.co room in test endpoint:', err);
    }

    return NextResponse.json({
      success: true,
      meeting: {
        id: meeting.id,
        title: meeting.title,
        scheduledAt: meeting.scheduledAt,
        joinUrl: dailyUrl || null
      }
    });
  } catch (error) {
    console.error('Test meeting creation failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to create test meeting' }, { status: 500 });
  }
}
