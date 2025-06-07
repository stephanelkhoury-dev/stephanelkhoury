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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: { userId: authResult.userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({
        where: { userId: authResult.userId },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}
