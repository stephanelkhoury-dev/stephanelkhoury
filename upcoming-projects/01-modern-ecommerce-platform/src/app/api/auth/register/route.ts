import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, firstName, lastName } = body;

    // Validate required fields
    if (!email || !username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email, username, and password are required',
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email or username already exists',
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        profile: {
          create: {
            firstName,
            lastName,
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
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to register user',
      },
      { status: 500 }
    );
  }
}
