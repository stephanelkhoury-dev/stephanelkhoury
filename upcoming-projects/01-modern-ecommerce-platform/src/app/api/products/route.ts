import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const avgRating = product.reviews.length
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;

      return {
        ...product,
        rating: Number(avgRating.toFixed(1)),
        reviewCount: product.reviews.length,
        reviews: undefined, // Remove reviews from response
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: productsWithRating,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      comparePrice,
      sku,
      quantity,
      categoryId,
      tags,
      images,
      variants,
    } = body;

    // Validate required fields
    if (!name || !price || !sku || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Create product with slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        comparePrice,
        sku,
        quantity,
        categoryId,
        tags: tags || [],
        images: {
          create: images?.map((img: any, index: number) => ({
            url: img.url,
            altText: img.altText,
            sortOrder: index,
          })) || [],
        },
        variants: {
          create: variants?.map((variant: any) => ({
            name: variant.name,
            value: variant.value,
            price: variant.price,
            sku: variant.sku,
            quantity: variant.quantity,
          })) || [],
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product',
      },
      { status: 500 }
    );
  }
}
