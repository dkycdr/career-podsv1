import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { podId, userId, userName, message, role } = await request.json();

    if (!podId || !userId || !message || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save message to database
    const savedMessage = await prisma.podMessage.create({
      data: {
        podId,
        userId,
        userName,
        message,
        role: role || 'MEMBER',
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: savedMessage,
    });
  } catch (error) {
    console.error('Error saving pod message:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const podId = searchParams.get('podId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!podId) {
      return NextResponse.json(
        { error: 'Pod ID is required' },
        { status: 400 }
      );
    }

    // Get messages for pod
    const messages = await prisma.podMessage.findMany({
      where: { podId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // Reverse to get chronological order
    messages.reverse();

    return NextResponse.json({
      success: true,
      messages,
      total: messages.length,
    });
  } catch (error) {
    console.error('Error fetching pod messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
