import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, skillId, newLevel, targetLevel, notes } = body;

    if (!userId || !skillId) {
      return NextResponse.json({
        success: false,
        error: 'User ID and skill ID are required'
      }, { status: 400 });
    }

    // Find or create progress record
    let progress = await prisma.progress.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId
        }
      }
    });

    if (!progress) {
      // Create new progress record if doesn't exist
      progress = await prisma.progress.create({
        data: {
          userId,
          skillId,
          level: newLevel || 1,
          targetLevel: targetLevel || 5,
          notes: notes || '',
          achievedAt: newLevel === 5 ? new Date() : null // Mark as achieved if level reaches 5
        }
      });
    } else {
      // Update existing progress
      const achievedAt = newLevel === 5 && !progress.achievedAt ? new Date() : progress.achievedAt;
      progress = await prisma.progress.update({
        where: { id: progress.id },
        data: {
          level: newLevel !== undefined ? newLevel : progress.level,
          targetLevel: targetLevel !== undefined ? targetLevel : progress.targetLevel,
          notes: notes !== undefined ? notes : progress.notes,
          achievedAt: achievedAt
        }
      });
    }

    // Calculate achievement percentage
    const allProgress = await prisma.progress.findMany({
      where: { userId }
    });
    const completedCount = allProgress.filter(p => p.achievedAt).length;
    const completionPercentage = allProgress.length > 0 
      ? Math.round((completedCount / allProgress.length) * 100)
      : 0;

    // Check for badges/milestones
    let badge: any = null;
    if (completionPercentage === 100 && allProgress.length >= 5) {
      badge = { 
        id: 'master', 
        name: 'Master Achiever', 
        emoji: '🏆',
        description: 'Completed all skills to level 5!' 
      };
    } else if (completionPercentage >= 50) {
      badge = { 
        id: 'halfway', 
        name: 'Halfway There', 
        emoji: '🎯',
        description: 'Reached 50% completion!' 
      };
    }

    console.log('✅ Progress updated:', progress.id, 'Level:', newLevel, 'Badge:', badge?.id);

    return NextResponse.json({
      success: true,
      progress,
      completionPercentage,
      badge,
      message: `✅ Progress updated to level ${newLevel}!`
    });

  } catch (error: any) {
    console.error('❌ Error updating progress:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update progress'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, skillId } = body;

    if (!userId || !skillId) {
      return NextResponse.json({
        success: false,
        error: 'User ID and skill ID are required'
      }, { status: 400 });
    }

    // Delete progress record
    await prisma.progress.deleteMany({
      where: {
        userId,
        skillId
      }
    });

    console.log('✅ Progress record deleted for skill:', skillId);

    return NextResponse.json({
      success: true,
      message: 'Progress record deleted'
    });

  } catch (error: any) {
    console.error('❌ Error deleting progress:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete progress record'
    }, { status: 500 });
  }
}
