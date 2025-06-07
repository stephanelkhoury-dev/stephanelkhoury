import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    
    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await request.json();
    const { shippingAddress, paymentMethodId } = body;

    if (!shippingAddress || !paymentMethodId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Shipping address and payment method are required',
        },
        { status: 400 }
      );
    }

    // Get user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId: authResult.userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cart is empty',
        },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Verify stock availability
    for (const item of cart.items) {
      if (item.product.quantity < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for ${item.product.name}`,
          },
          { status: 400 }
        );
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.NEXTAUTH_URL}/order/confirmation`,
    });

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment failed',
        },
        { status: 400 }
      );
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: authResult.userId,
        status: 'PROCESSING',
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        paymentIntentId: paymentIntent.id,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product quantities
    await Promise.all(
      cart.items.map(item =>
        prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        })
      )
    );

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process order',
      },
      { status: 500 }
    );
  }
}
