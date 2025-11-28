import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const pods = await db.pod.findMany({
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const podsData = pods.map(pod => ({
      id: pod.id,
      name: pod.name,
      description: pod.description,
      status: pod.status,
      maxMembers: pod.maxMembers,
      currentMembers: pod.memberships.length,
      members: pod.memberships.map(m => m.user),
      createdAt: pod.createdAt
    }));

    return NextResponse.json({
      success: true,
      pods: podsData
    });

  } catch (error) {
    console.error('Error fetching pods:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const podId = searchParams.get('podId');

    if (!podId) {
      return NextResponse.json(
        { error: 'Pod ID is required' },
        { status: 400 }
      );
    }

    // Delete pod and related data
    await db.pod.delete({
      where: { id: podId }
    });

    return NextResponse.json({
      success: true,
      message: 'Pod deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting pod:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}