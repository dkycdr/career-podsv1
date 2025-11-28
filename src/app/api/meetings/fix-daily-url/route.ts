import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createDailyRoom } from '@/lib/daily';

export async function POST(request: NextRequest) {
  try {
    const { meetingId } = await request.json();

    if (!meetingId) {
      return NextResponse.json(
        { success: false, error: 'Meeting ID required' },
        { status: 400 }
      );
    }

    // Find the meeting
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId }
    });

    if (!meeting) {
      return NextResponse.json(
        { success: false, error: 'Meeting not found' },
        { status: 404 }
      );
    }

    // Create a new Daily.co room
    const dailyUrl = await createDailyRoom(meeting.id, meeting.title);
    
    if (!dailyUrl) {
      return NextResponse.json(
        { success: false, error: 'Failed to create Daily.co room' },
        { status: 500 }
      );
    }

    // Update the meeting with the new Daily.co URL
    const updated = await prisma.meeting.update({
      where: { id: meetingId },
      data: { meetingLink: dailyUrl }
    });

    return NextResponse.json({
      success: true,
      message: 'Meeting updated with Daily.co room',
      oldLink: meeting.meetingLink,
      newLink: updated.meetingLink
    });
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
