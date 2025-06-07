import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = requireAuth(request);
    
    if (authResult instanceof Response) {
      return authResult;
    }

    const { id } = params;
    const body = await request.json();
    const { quantity } = body;

    if (quantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Quantity must be greater than 0',
        },
        { status: 400 }
      );
    }

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId: authResult.userId,
        },
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cart item not found',
        },
        { status: 404 }
      );
    }

    // Check stock availability
    if (cartItem.product.quantity < quantity) {
      return NextResponse.json(
        {
          success: false,
          error: 'Insufficient stock',
        },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          include: {
            images: {
              orderBy: { sortOrder: 'asc' },
              take: 1,
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: 'Cart item updated',
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update cart item',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = requireAuth(request);
    
    if (authResult instanceof Response) {
      return authResult;
    }

    const { id } = params;

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId: authResult.userId,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cart item not found',
        },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to remove cart item',
      },
      { status: 500 }
    );
  }
}
