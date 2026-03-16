import { NextRequest, NextResponse } from 'next/server'

// Mock categories data - standalone without database
const mockCategories = [
  {
    id: '1',
    name: 'Electronics',
    isActive: true,
    isService: false,
    children: [
      { id: '1-1', name: 'Computers', isActive: true, isService: false },
      { id: '1-2', name: 'Smartphones', isActive: true, isService: false },
      { id: '1-3', name: 'Accessories', isActive: true, isService: false },
    ],
  },
  {
    id: '2',
    name: 'Fashion',
    isActive: true,
    isService: false,
    children: [
      { id: '2-1', name: 'Men', isActive: true, isService: false },
      { id: '2-2', name: 'Women', isActive: true, isService: false },
      { id: '2-3', name: 'Kids', isActive: true, isService: false },
    ],
  },
  {
    id: '3',
    name: 'Home & Garden',
    isActive: true,
    isService: false,
    children: [
      { id: '3-1', name: 'Furniture', isActive: true, isService: false },
      { id: '3-2', name: 'Decor', isActive: true, isService: false },
      { id: '3-3', name: 'Kitchen', isActive: true, isService: false },
    ],
  },
  {
    id: '4',
    name: 'Services',
    isActive: true,
    isService: true,
    children: [
      { id: '4-1', name: 'Consulting', isActive: true, isService: true },
      { id: '4-2', name: 'Design', isActive: true, isService: true },
      { id: '4-3', name: 'Maintenance', isActive: true, isService: true },
    ],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isService = searchParams.get('isService')

    let categories = mockCategories

    // Filter by isService if specified
    if (isService !== null) {
      const serviceFilter = isService === 'true'
      categories = categories.filter(cat => cat.isService === serviceFilter)
    }

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

