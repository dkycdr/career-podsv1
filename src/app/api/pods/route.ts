import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('🔄 API Pods called for user:', userId);

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required',
        pods: [] 
      }, { status: 400 });
    }

    // Get user's pods from database
    const pods = await db.pod.findMany({
      where: {
        memberships: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                major: true,
                year: true
              }
            }
          }
        },
        meetings: {
          orderBy: {
            scheduledAt: 'desc'
          },
          take: 5
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ Found ${pods.length} pods for user ${userId}`);

    return NextResponse.json({
      success: true,
      pods: pods
    });

  } catch (error) {
    console.error('❌ Error fetching pods:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch pods',
      pods: [] // Return empty array as fallback
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, userId, maxMembers = 8 } = body;

    console.log('📝 Creating pod:', { name, userId });

    if (!name || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Pod name and user ID are required'
      }, { status: 400 });
    }

    // Create the pod
    const pod = await db.pod.create({
      data: {
        name,
        description: description || '',
        maxMembers,
        status: 'ACTIVE'
      }
    });

    console.log('✅ Pod created:', pod.id);

    // Add creator as first member with LEAD role
    await db.podMembership.create({
      data: {
        podId: pod.id,
        userId: userId,
        role: 'LEAD'
      }
    });

    console.log('✅ User added as pod member');

    // Fetch the complete pod with memberships
    const completePod = await db.pod.findUnique({
      where: { id: pod.id },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                major: true,
                year: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      pod: completePod,
      message: '✅ Pod created successfully!'
    });

  } catch (error: any) {
    console.error('❌ Error creating pod:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create pod'
    }, { status: 500 });
  }
}