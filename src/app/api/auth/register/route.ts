import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

    // Normalize email
    const normalizedEmail = personalInfo.email.toLowerCase().trim();
    if (!normalizedEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists by email
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if studentId already exists
    const existingStudentId = await prisma.user.findUnique({
      where: { studentId: personalInfo.studentId }
    });

    if (existingStudentId) {
      return NextResponse.json(
        { error: 'This student ID is already registered' },
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
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: personalInfo.name,
        studentId: personalInfo.studentId || null,
        major: personalInfo.major || '',
        year: personalInfo.year ? parseInt(personalInfo.year) : null,
        bio: personalInfo.bio || '',
        role: 'STUDENT',
        password: hashedPassword,
        availability: null
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
    console.error('Error details:', error?.message);
    console.error('Error code:', error?.code);
    
    return NextResponse.json(
      { 
        error: error?.message || 'Registration failed',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}