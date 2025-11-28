import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createDailyRoom } from '@/lib/daily';

// Simple auth helper - ambil dari localStorage di frontend
const getUserIdFromRequest = (request: NextRequest) => {
  // Dari headers (frontend kirim manual)
  let userId = request.headers.get('x-user-id') || 
               request.headers.get('X-User-Id') || 
               request.headers.get('user-id') ||
               'default-user-id'; // Fallback untuk development
  
  console.log('🔐 User ID from request:', userId, 'Headers:', Array.from(request.headers.entries()));
  return userId;
};

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    console.log('📅 Fetching meetings for user:', userId);

    // Cek dulu apakah user ada di database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // If user doesn't exist, still return empty list (don't error)
    if (!user) {
      console.log('⚠️  User not found in database, returning empty meetings');
      return NextResponse.json({ 
        success: true, 
        meetings: [] 
      });
    }

    // Get user's active pods
    const userPods = await prisma.podMembership.findMany({
      where: { 
        userId: userId,
        status: 'ACTIVE'
      },
      select: { podId: true }
    });
    
    const podIds = userPods.map(membership => membership.podId);
    console.log('🎯 User pod IDs:', podIds);

    // Get meetings from user's pods OR meetings created by user
    const meetings = await prisma.meeting.findMany({
      where: { 
        OR: [
          { userId: userId }, // Meetings created by this user
          { podId: { in: podIds } } // Meetings in user's pods
        ],
        status: 'SCHEDULED' // Only scheduled meetings
      },
      include: {
        pod: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        user: {
          select: {
            name: true,
            role: true,
            avatar: true
          }
        }
      },
      orderBy: { scheduledAt: 'asc' },
    });

    console.log('✅ Found meetings:', meetings.length);

    // Format response sesuai dengan interface di frontend
    const formattedMeetings = meetings.map(meeting => ({
      id: meeting.id,
      title: meeting.title,
      podName: meeting.pod?.name || 'General Meeting',
      date: new Date(meeting.scheduledAt).toLocaleDateString('en-CA'),
      time: new Date(meeting.scheduledAt).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      duration: String(meeting.duration),
      type: 'video', // Default type since it doesn't exist in schema
      attendees: meeting.attendeesCount || 0,
      maxAttendees: meeting.maxAttendees || 6,
      status: 'scheduled',
      joinUrl: meeting.meetingLink || '',
      mentor: undefined
    }));

    return NextResponse.json({
      success: true,
      meetings: formattedMeetings
    });

  } catch (error) {
    console.error('❌ Error fetching meetings:', error);
    // Return empty list instead of error - frontend should handle gracefully
    return NextResponse.json({
      success: true,
      meetings: [],
      note: error instanceof Error ? error.message : 'Error loading meetings'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    const body = await request.json();
    
    const { title, podId, date, time, duration, type } = body;
    
    console.log('🆕 Creating new meeting:', { title, podId, date, time, duration, type, userId });

    // Validasi required fields
    if (!title || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, date, time' },
        { status: 400 }
      );
    }

    const scheduledAt = new Date(`${date}T${time}:00`);
    
    // Validasi date
    if (isNaN(scheduledAt.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date or time format' },
        { status: 400 }
      );
    }

    // Map frontend type to database type
    const meetingType = type === 'video' ? 'VIDEO_CALL' : 
                       type === 'one-on-one' ? 'ONE_ON_ONE' : 'GROUP_SESSION';

    // Create meeting di database
    const meeting = await prisma.meeting.create({
      data: {
        title,
        scheduledAt,
        duration: parseInt(duration) || 60,
        type: meetingType,
        userId: userId && userId !== 'default-user-id' ? userId : null,
        podId: podId || null,
        status: 'SCHEDULED',
        maxAttendees: type === 'one-on-one' ? 2 : 6,
        attendeesCount: 1,
        meetingLink: null // Will be set by Daily.co
      },
      include: {
        pod: {
          select: {
            name: true
          }
        },
        user: {
          select: {
            name: true,
            role: true
          }
        }
      }
    });

    // Create Daily.co room for video call
    let dailyRoomUrl = null;
    try {
      console.log('📞 Attempting to create Daily.co room...');
      dailyRoomUrl = await createDailyRoom(meeting.id, title);
      if (dailyRoomUrl) {
        console.log('✅ Daily.co room URL received:', dailyRoomUrl);
        // Update meeting with Daily.co room URL
        await prisma.meeting.update({
          where: { id: meeting.id },
          data: { meetingLink: dailyRoomUrl }
        });
        console.log('✅ Meeting updated with Daily.co room URL');
      } else {
        console.warn('⚠️ Daily.co returned null URL');
      }
    } catch (err) {
      console.error('❌ Error creating Daily.co room:', err);
      // Don't fail the meeting creation if Daily.co fails
    }

    console.log('✅ Meeting created successfully:', meeting.id, 'with room URL:', dailyRoomUrl);

    return NextResponse.json({
      success: true,
      meeting: {
        id: meeting.id,
        title: meeting.title,
        podName: meeting.pod?.name || 'General Meeting',
        date: meeting.scheduledAt.toISOString().split('T')[0],
        time: meeting.scheduledAt.toTimeString().slice(0, 5),
        duration: meeting.duration.toString(),
        type: type,
        attendees: meeting.attendeesCount,
        maxAttendees: meeting.maxAttendees,
        status: 'scheduled',
        joinUrl: dailyRoomUrl || meeting.meetingLink || ''
      }
    });

  } catch (error) {
    console.error('❌ Error creating meeting:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create meeting',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}