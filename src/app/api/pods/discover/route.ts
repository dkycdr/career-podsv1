import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const userId = searchParams.get('userId');

    if (!search.trim()) {
      return NextResponse.json({
        success: true,
        pods: []
      });
    }

    // Get user's current pod IDs to exclude them
    let userPodIds: string[] = [];
    if (userId) {
      const userMemberships = await db.podMembership.findMany({
        where: { userId },
        select: { podId: true }
      });
      userPodIds = userMemberships.map(m => m.podId);
    }

    // Search pods by name or description, excluding user's own pods
    const pods = await db.pod.findMany({
      where: {
        AND: [
          {
            OR: [
                { name: { contains: search } },
                { description: { contains: search } }
            ]
          },
          {
            id: { notIn: userPodIds }
          }
        ]
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      },
      take: 10
    });

    console.log(`🔍 Found ${pods.length} pods matching "${search}"`);

    return NextResponse.json({
      success: true,
        pods: pods.map((pod: any) => ({
        id: pod.id,
        name: pod.name,
        description: pod.description,
        status: pod.status,
        memberships: pod.memberships,
        createdAt: pod.createdAt
      }))
    });

  } catch (error) {
    console.error('❌ Error discovering pods:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to discover pods',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
