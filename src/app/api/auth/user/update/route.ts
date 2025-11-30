import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      userId,
      name,
      studentId,
      major,
      year,
      bio,
      avatarData // optional data URL (base64)
    } = data;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let avatarPath = user.avatar || null;

    if (avatarData && typeof avatarData === 'string' && avatarData.startsWith('data:')) {
      try {
        // avatarData is expected as data:image/png;base64,AAAA...
        const matches = avatarData.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/);
        if (matches) {
          const mime = matches[1];
          const ext = matches[2] === 'jpeg' ? 'jpg' : matches[2];
          const base64Data = matches[3];

          try {
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            await fs.mkdir(uploadsDir, { recursive: true });

            const filename = `${userId}.${ext}`;
            const filePath = path.join(uploadsDir, filename);
            const buffer = Buffer.from(base64Data, 'base64');
            await fs.writeFile(filePath, buffer);

            avatarPath = `/uploads/${filename}`;
            console.log('✅ Avatar uploaded:', avatarPath);
          } catch (fsError: any) {
            console.error('❌ File system error:', fsError);
            // Continue anyway - store as temporary reference
            avatarPath = `avatar_${userId}_pending`;
          }
        } else {
          console.warn('⚠️ Avatar data format invalid');
        }
      } catch (avatarError: any) {
        console.error('❌ Avatar processing error:', avatarError);
        // Don't fail the whole update just for avatar
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name ?? user.name,
        studentId: studentId ?? user.studentId,
        major: major ?? user.major,
        year: year ? parseInt(String(year)) : user.year,
        bio: bio ?? user.bio,
        avatar: avatarPath
      }
    });

    console.log('✅ User profile updated:', updated.id);

    return NextResponse.json({ 
      success: true, 
      user: updated,
      message: 'Profile updated successfully'
    });
  } catch (err: any) {
    console.error('❌ Profile update error:', err);
    console.error('Error code:', err?.code);
    console.error('Error message:', err?.message);
    console.error('Error meta:', err?.meta);
    
    return NextResponse.json({ 
      error: 'Failed to update profile', 
      details: err?.message,
      errorCode: err?.code
    }, { status: 500 });
  }
}
