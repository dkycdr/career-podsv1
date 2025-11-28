import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { podId, userId } = body;

    if (!podId || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Pod ID and User ID are required'
      }, { status: 400 });
    }

    // Check if user is already a member
    const existingMembership = await db.podMembership.findUnique({
      where: {
        userId_podId: {
          userId,
          podId
        }
      }
    });

    if (existingMembership) {
      return NextResponse.json({
        success: false,
        error: 'You are already a member of this pod'
      }, { status: 400 });
    }

    // Create membership
    const membership = await db.podMembership.create({
      data: {
        userId,
        podId,
        role: 'MEMBER',
        status: 'ACTIVE'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        pod: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    console.log(`✅ User ${userId} joined pod ${podId}`);

    return NextResponse.json({
      success: true,
      membership,
      message: 'Successfully joined the pod!'
    });

  } catch (error) {
    console.error('❌ Error joining pod:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to join pod',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
