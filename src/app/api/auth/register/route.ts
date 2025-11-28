import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Registration data:', data);
    
    const { personalInfo } = data;

    // Validate required fields
    if (!personalInfo?.email || !personalInfo?.name || !personalInfo?.studentId) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, studentId' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: personalInfo.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Validate password
    if (!personalInfo.password || typeof personalInfo.password !== 'string' || personalInfo.password.length < 6) {
      return NextResponse.json({ error: 'Password is required and must be at least 6 characters' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(personalInfo.password, 12);

    // Create user ONLY - skip complex relations for now
    const user = await db.user.create({
      data: {
        email: personalInfo.email,
        name: personalInfo.name,
        studentId: personalInfo.studentId,
        major: personalInfo.major || '',
        year: personalInfo.year ? parseInt(personalInfo.year) : null,
        bio: personalInfo.bio || '',
        role: 'STUDENT',
        password: hashedPassword, // ← NOW THIS WILL WORK
        availability: null // skip for now
      }
    });

    console.log('✅ User created successfully:', user.id);

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error('❌ Registration error:', error);
    
    return NextResponse.json(
      { 
        error: 'Registration failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}