import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const userId = request.headers.get('x-user-id');

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, error: 'Career goal ID and user ID are required' },
        { status: 400 }
      );
    }

    // Verify ownership before deleting
    const goal = await prisma.careerInterest.findUnique({
      where: { id }
    });

    if (!goal || goal.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized or goal not found' },
        { status: 403 }
      );
    }

    // Delete the career goal
    await prisma.careerInterest.delete({
      where: { id }
    });

    console.log(`✅ Career goal deleted: ${id}`);

    return NextResponse.json({
      success: true,
      message: 'Career goal deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Error deleting career goal:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete career goal' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const userId = request.headers.get('x-user-id');
    const body = await request.json();
    const { role, industry, priority, description } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, error: 'Career goal ID and user ID are required' },
        { status: 400 }
      );
    }

    // Verify ownership before updating
    const goal = await prisma.careerInterest.findUnique({
      where: { id }
    });

    if (!goal || goal.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized or goal not found' },
        { status: 403 }
      );
    }

    // Update the career goal
    const updated = await prisma.careerInterest.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(industry && { industry }),
        ...(priority && { priority }),
        ...(description && { description })
      }
    });

    console.log(`✅ Career goal updated: ${id}`);

    return NextResponse.json({
      success: true,
      goal: updated,
      message: 'Career goal updated successfully'
    });
  } catch (error: any) {
    console.error('❌ Error updating career goal:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update career goal' },
      { status: 500 }
    );
  }
}
