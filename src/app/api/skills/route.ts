import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, skillName, initialLevel = 1, targetLevel = 5 } = body;

    if (!userId || !skillName) {
      return NextResponse.json({
        success: false,
        error: 'User ID and skill name are required'
      }, { status: 400 });
    }

    // First, find or create the skill in the Skill table
    let skill = await prisma.skill.findUnique({
      where: { name: skillName }
    });

    if (!skill) {
      skill = await prisma.skill.create({
        data: {
          name: skillName,
          category: 'technical',
          description: `Skill: ${skillName}`
        }
      });
      console.log('✅ New skill created:', skill.id);
    }

    // Then create a UserSkill entry
    const userSkill = await prisma.userSkill.create({
      data: {
        userId,
        skillId: skill.id,
        level: initialLevel,
        targetLevel: targetLevel
      }
    });

    // Also create a Progress entry
    const progress = await prisma.progress.create({
      data: {
        userId,
        skillId: skill.id,
        level: initialLevel,
        targetLevel: targetLevel
      }
    });

    console.log('✅ Skill added to user:', userSkill.id);

    return NextResponse.json({
      success: true,
      userSkill,
      progress,
      message: `✅ Skill "${skillName}" added!`
    });

  } catch (error: any) {
    console.error('❌ Error adding skill:', error);
    
    // Check if it's a unique constraint error
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'This skill is already being tracked'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to add skill'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get all available skills
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' },
      take: 50
    });

    return NextResponse.json({
      success: true,
      skills,
      count: skills.length
    });

  } catch (error: any) {
    console.error('❌ Error fetching skills:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch skills'
    }, { status: 500 });
  }
}
