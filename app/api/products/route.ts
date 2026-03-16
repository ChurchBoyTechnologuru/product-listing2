import { NextRequest, NextResponse } from 'next/server'

// Mock products data - standalone demo
const mockProducts = [
  {
    id: '1',
    title: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    currency: 'USD',
    category: 'Electronics',
    stock: 50,
    tags: ['audio', 'wireless', 'headphones'],
    isService: false,
    images: [{ url: '/products/headphones.jpg', alt: 'Wireless Headphones', isPrimary: true }],
    shopId: 'shop-1',
    rating: 4.5,
    reviews: 128,
  },
  {
    id: '2',
    title: 'Professional Logo Design',
    description: 'Custom logo design for your business',
    price: 499.99,
    currency: 'USD',
    category: 'Services',
    stock: 0,
    tags: ['design', 'logo', 'branding'],
    isService: true,
    images: [{ url: '/products/design.jpg', alt: 'Logo Design', isPrimary: true }],
    shopId: 'shop-2',
    rating: 4.8,
    reviews: 45,
  },
  {
    id: '3',
    title: 'Vintage Leather Jacket',
    description: 'Authentic vintage leather jacket in excellent condition',
    price: 149.99,
    currency: 'USD',
    category: 'Fashion',
    stock: 10,
    tags: ['vintage', 'leather', 'fashion'],
    isService: false,
    images: [{ url: '/products/jacket.jpg', alt: 'Leather Jacket', isPrimary: true }],
    shopId: 'shop-3',
    rating: 4.7,
    reviews: 67,
  },
]

// GET /api/products - Get all products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')

    let filtered = mockProducts

    // Filter by category
    if (category) {
      filtered = filtered.filter(p => p.category === category)
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Filter by price
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice)

    const total = filtered.length
    const start = (page - 1) * limit
    const data = filtered.slice(start, start + limit)

    return NextResponse.json({
      success: true,
      data: {
        data,
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

// POST /api/products - Create new product (demo - just returns mock)
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session_id')?.value

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      price,
      category,
      tags = [],
    } = body

    // Return mock product (in production, save to database)
    const newProduct = {
      id: Math.random().toString(),
      title,
      description,
      price: parseFloat(price),
      currency: 'USD',
      category,
      stock: 0,
      tags,
      isService: false,
      images: [],
      shopId: 'demo-shop',
      rating: 0,
      reviews: 0,
    }

    return NextResponse.json({
      success: true,
      data: newProduct,
    })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

