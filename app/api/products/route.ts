import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to verify JWT token
async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch {
    return null
  }
}

// GET /api/products - Get all products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const isService = searchParams.get('isService')

    const skip = (page - 1) * limit

    const where: any = {
      isActive: true,
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (isService !== null) {
      where.isService = isService === 'true'
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          shop: true,
          images: true,
          reviews: true,
          shippingOptions: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        data: products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyToken(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has a shop
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { shop: true },
    })

    if (!user?.shop) {
      return NextResponse.json(
        { success: false, message: 'You need to create a shop first' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      price,
      currency = 'USD',
      category,
      subcategory,
      stock = 0,
      sku,
      weight,
      dimensions,
      tags = [],
      images = [],
      shippingOptions = [],
      isService = false,
    } = body

    // Create product
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        currency,
        category,
        subcategory,
        stock: parseInt(stock),
        sku,
        weight: weight ? parseFloat(weight) : null,
        dimensions: dimensions ? JSON.parse(JSON.stringify(dimensions)) : null,
        tags,
        isService,
        shopId: user.shop.id,
        images: {
          create: images.map((imageUrl: string, index: number) => ({
            url: imageUrl,
            alt: `${title} image ${index + 1}`,
            isPrimary: index === 0,
            order: index,
          })),
        },
        shippingOptions: {
          create: shippingOptions.map((option: any) => ({
            name: option.name,
            price: parseFloat(option.price),
            currency: option.currency || currency,
            estimatedDays: parseInt(option.estimatedDays),
            countries: option.countries || [],
            isInternational: option.isInternational || false,
          })),
        },
      },
      include: {
        shop: true,
        images: true,
        shippingOptions: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

