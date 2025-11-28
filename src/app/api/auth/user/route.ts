import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    console.log('🔍 API Called with:', { email, userId });

    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Email or User ID is required' },
        { status: 400 }
      );
    }

    let user;

    if (userId) {
      // Cari user berdasarkan ID
      user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          major: true,
          year: true,
          role: true,
          studentId: true,
          createdAt: true
        }
      });
    } else if (email) {
      // Handle email lookup (existing logic)
      let formattedEmail = email;
      if (email.endsWith('@student.president.id')) {
        formattedEmail = email.replace('@student.president.id', '@student.president.ac.id');
      }

      user = await db.user.findUnique({
        where: { email: formattedEmail },
        select: {
          id: true,
          name: true,
          email: true,
          major: true,
          year: true,
          role: true,
          studentId: true,
          createdAt: true
        }
      });
    }

    console.log('👤 User found:', user);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error: any) {
    console.error('💥 User lookup error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}