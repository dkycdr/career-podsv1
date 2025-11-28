import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Get user's progress
    const progress = await db.progress.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Get user's skills
    const skills = await db.userSkill.findMany({
      where: { userId },
      include: {
        skill: true
      }
    });

    // Get user's career interests (goals)
    const careerInterests = await db.careerInterest.findMany({
      where: { userId }
    });

    console.log(`✅ Found ${progress.length} progress items, ${skills.length} skills, ${careerInterests.length} career interests`);

    return NextResponse.json({
      success: true,
      progress,
      skills,
      careerInterests
    });

  } catch (error) {
    console.error('❌ Error fetching progress:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch progress'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, goal, category, deadline } = body;

    if (!userId || !goal) {
      return NextResponse.json({
        success: false,
        error: 'User ID and goal are required'
      }, { status: 400 });
    }

    // Create a career interest (goal)
    // Using actual schema fields: industry, role, description
    const careerInterest = await db.careerInterest.create({
      data: {
        userId,
        industry: category || 'General',
        role: goal,  // Use role field to store goal text
        description: `Goal set on ${new Date().toLocaleDateString()}`,
        priority: 'MEDIUM'
      }
    });

    console.log('✅ Goal created:', careerInterest.id);

    return NextResponse.json({
      success: true,
      goal: careerInterest,
      message: '✅ Goal saved successfully!'
    });
  } catch (error: any) {
    console.error('❌ Error creating goal:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create goal'
    }, { status: 500 });
  }
}