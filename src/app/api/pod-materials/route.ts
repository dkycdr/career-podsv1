import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const podId = searchParams.get('podId');

    if (!podId) {
      return NextResponse.json({
        success: false,
        error: 'Pod ID is required'
      }, { status: 400 });
    }

    // Get all materials for this pod
    const materials = await db.podMaterial.findMany({
      where: { podId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ Found ${materials.length} materials for pod ${podId}`);

    return NextResponse.json({
      success: true,
      materials
    });

  } catch (error) {
    console.error('❌ Error fetching materials:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch materials'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { podId, title, description, type, content, url, uploadedBy } = body;

    if (!podId || !title || !uploadedBy) {
      return NextResponse.json({
        success: false,
        error: 'Pod ID, title, and uploadedBy are required'
      }, { status: 400 });
    }

    // Create material
    const material = await db.podMaterial.create({
      data: {
        podId,
        title,
        description: description || '',
        type: type || 'note',
        content: content || '',
        url: url || null,
        uploadedBy
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    console.log('✅ Material created:', material.id);

    return NextResponse.json({
      success: true,
      material,
      message: '✅ Material added successfully!'
    });
  } catch (error: any) {
    console.error('❌ Error creating material:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create material'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get('id');

    if (!materialId) {
      return NextResponse.json({
        success: false,
        error: 'Material ID is required'
      }, { status: 400 });
    }

    // Delete material
    await db.podMaterial.delete({
      where: { id: materialId }
    });

    console.log('✅ Material deleted:', materialId);

    return NextResponse.json({
      success: true,
      message: '✅ Material deleted successfully!'
    });
  } catch (error: any) {
    console.error('❌ Error deleting material:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete material'
    }, { status: 500 });
  }
}
