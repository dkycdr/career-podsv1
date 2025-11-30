import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');
    const body = await request.json();
    const { name, description, maxMembers } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    // Check if user is pod lead
    const membership = await prisma.podMembership.findFirst({
      where: {
        podId: id,
        userId: userId,
        role: 'LEAD',
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Only pod leads can edit settings' },
        { status: 403 }
      );
    }

    // Update pod
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (maxMembers !== undefined) updateData.maxMembers = maxMembers;

    const updatedPod = await prisma.pod.update({
      where: { id },
      data: updateData,
    });

    // Create notification for pod members
    const members = await prisma.podMembership.findMany({
      where: { podId: id },
    });

    for (const member of members) {
      if (member.userId !== userId) {
        await prisma.notification.create({
          data: {
            userId: member.userId,
            type: 'POD_UPDATED',
            podId: id,
            message: `Pod "${updatedPod.name}" has been updated`,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      pod: updatedPod,
    });
  } catch (error) {
    console.error('Error updating pod settings:', error);
    return NextResponse.json(
      { error: 'Failed to update pod settings' },
      { status: 500 }
    );
  }
}
