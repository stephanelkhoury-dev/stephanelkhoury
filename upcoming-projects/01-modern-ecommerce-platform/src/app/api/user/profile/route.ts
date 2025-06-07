import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    
    if (authResult instanceof Response) {
      return authResult;
    }

    const user = await prisma.user.findUnique({
      where: { id: authResult.userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user profile',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    
    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await request.json();
    const { firstName, lastName, phone } = body;

    const user = await prisma.user.update({
      where: { id: authResult.userId },
      data: {
        profile: {
          update: {
            firstName,
            lastName,
            phone,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update profile',
      },
      { status: 500 }
    );
  }
}
