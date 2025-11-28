import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface MatchingScore {
  userId: string;
  score: number;
  breakdown: {
    basicCompatibility: number;
    interestAlignment: number;
    diversityBalance: number;
  };
}

interface UserWithProfile {
  id: string;
  name: string;
  email: string;
  major: string;
  year: number;
  availability: string;
  careerInterests: Array<{
    industry: string;
    role: string;
    priority: string;
  }>;
  skills: Array<{
    skillId: string;
    level: number;
    targetLevel: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current user with full profile
    const currentUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        careerInterests: true,
        skills: {
          include: { skill: true }
        }
      }
    }) as UserWithProfile | null;

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all other students looking for pods
    const potentialMatches = await db.user.findMany({
      where: {
        id: { not: userId },
        role: 'STUDENT'
      },
      include: {
        careerInterests: true,
        skills: {
          include: { skill: true }
        }
      }
    }) as UserWithProfile[];

    // Calculate matching scores
    const scores: MatchingScore[] = potentialMatches.map(user => {
      const score = calculateMatchingScore(currentUser, user);
      return {
        userId: user.id,
        score: score.finalScore,
        breakdown: {
          basicCompatibility: score.basicCompatibility,
          interestAlignment: score.interestAlignment,
          diversityBalance: score.diversityBalance
        }
      };
    });

    // Sort by score (highest first)
    scores.sort((a, b) => b.score - a.score);

    // Get top matches (excluding very low scores)
    const topMatches = scores.filter(s => s.score > 30).slice(0, 10);

    // Get full user data for top matches
    const matchedUsers = await db.user.findMany({
      where: {
        id: { in: topMatches.map(m => m.userId) }
      },
      include: {
        careerInterests: true,
        skills: {
          include: { skill: true }
        }
      }
    });

    // Combine scores with user data
    const results = matchedUsers.map(user => {
      const scoreData = topMatches.find(m => m.userId === user.id);
      return {
        user: {
          id: user.id,
          name: user.name,
          major: user.major,
          year: user.year,
          careerInterests: user.careerInterests,
          skills: user.skills
        },
        score: scoreData?.score || 0,
        breakdown: scoreData?.breakdown || {
          basicCompatibility: 0,
          interestAlignment: 0,
          diversityBalance: 0
        }
      };
    });

    return NextResponse.json({
      success: true,
      matches: results,
      totalPotential: potentialMatches.length,
      qualifiedMatches: results.length
    });

  } catch (error) {
    console.error('Matching error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateMatchingScore(user1: UserWithProfile, user2: UserWithProfile) {
  // Basic Compatibility (40%)
  const basicCompatibility = calculateBasicCompatibility(user1, user2);

  // Interest Alignment (35%)
  const interestAlignment = calculateInterestAlignment(user1, user2);

  // Diversity Balance (25%)
  const diversityBalance = calculateDiversityBalance(user1, user2);

  const finalScore = Math.round(
    basicCompatibility * 0.4 + 
    interestAlignment * 0.35 + 
    diversityBalance * 0.25
  );

  return {
    basicCompatibility,
    interestAlignment,
    diversityBalance,
    finalScore
  };
}

function calculateBasicCompatibility(user1: UserWithProfile, user2: UserWithProfile): number {
  let score = 0;

  // Major compatibility (0-30 points)
  if (user1.major === user2.major) {
    score += 30;
  } else {
    // Check if majors are related (simplified logic)
    const relatedMajors: Record<string, string[]> = {
      'Computer Science': ['Information Systems', 'Information Technology', 'Software Engineering'],
      'Business Administration': ['Management', 'Accounting', 'Finance'],
      'Mechanical Engineering': ['Industrial Engineering', 'Electrical Engineering'],
    };
    
    if (relatedMajors[user1.major]?.includes(user2.major) || 
        relatedMajors[user2.major]?.includes(user1.major)) {
      score += 20;
    }
  }

  // Year proximity (0-20 points)
  const yearDiff = Math.abs(user1.year - user2.year);
  if (yearDiff === 0) score += 20;
  else if (yearDiff === 1) score += 15;
  else if (yearDiff === 2) score += 10;
  else if (yearDiff === 3) score += 5;

  // Availability overlap (0-50 points)
  const availability1 = JSON.parse(user1.availability || '{}');
  const availability2 = JSON.parse(user2.availability || '{}');
  const commonSlots = Object.keys(availability1).filter(key => 
    availability1[key] && availability2[key]
  ).length;
  score += Math.min(commonSlots * 5, 50);

  return Math.min(score, 100);
}

function calculateInterestAlignment(user1: UserWithProfile, user2: UserWithProfile): number {
  if (user1.careerInterests.length === 0 || user2.careerInterests.length === 0) {
    return 0;
  }

  let score = 0;
  let totalWeight = 0;

  user1.careerInterests.forEach(interest1 => {
    const priorityWeight = interest1.priority === 'HIGH' ? 3 : 
                          interest1.priority === 'MEDIUM' ? 2 : 1;
    totalWeight += priorityWeight;

    user2.careerInterests.forEach(interest2 => {
      if (interest1.industry === interest2.industry) {
        score += priorityWeight * 40; // Industry match
      }
      if (interest1.role === interest2.role) {
        score += priorityWeight * 30; // Role match
      }
      if (interest1.industry === interest2.industry && interest1.role === interest2.role) {
        score += priorityWeight * 30; // Perfect match bonus
      }
    });
  });

  return totalWeight > 0 ? Math.min((score / totalWeight) * 2, 100) : 0;
}

function calculateDiversityBalance(user1: UserWithProfile, user2: UserWithProfile): number {
  let score = 50; // Base score

  // Reward some diversity but not too much
  if (user1.major !== user2.major) {
    score += 20; // Different major brings perspective
  }

  if (Math.abs(user1.year - user2.year) > 0) {
    score += 15; // Different year levels bring mentorship opportunities
  }

  // Skills complementarity
  const skills1 = user1.skills.map(s => s.skillId);
  const skills2 = user2.skills.map(s => s.skillId);
  const commonSkills = skills1.filter(skill => skills2.includes(skill));
  const uniqueSkills1 = skills1.filter(skill => !skills2.includes(skill));
  const uniqueSkills2 = skills2.filter(skill => !skills1.includes(skill));

  // Reward having some common skills but also unique ones
  if (commonSkills.length > 0 && (uniqueSkills1.length > 0 || uniqueSkills2.length > 0)) {
    score += 15;
  }

  return Math.min(score, 100);
}