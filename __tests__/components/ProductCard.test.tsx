// Unit test for ProductCard component

import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/lib/types'

// Mock the hooks
jest.mock('@/lib/hooks', () => ({
  useAddToCart: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}))

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  description: 'A test product description',
  price: 99.99,
  currency: 'USD',
  category: 'Electronics',
  subcategory: 'Audio',
  images: ['https://example.com/image1.jpg'],
  stock: 10,
  sku: 'TEST-001',
  weight: 1.5,
  dimensions: { length: 10, width: 8, height: 4 },
  status: 'approved',
  isActive: true,
  tags: ['test', 'electronics'],
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  shopId: 'shop1',
  shop: {
    id: 'shop1',
    name: 'Test Shop',
    description: 'A test shop',
    logo: 'https://example.com/logo.jpg',
    banner: 'https://example.com/banner.jpg',
    website: 'https://testshop.com',
    isVerified: true,
    rating: 4.5,
    totalSales: 100,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    ownerId: 'user1',
    owner: {
      id: 'user1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'seller',
      isEmailVerified: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    location: {
      id: 'addr1',
      street: '123 Test St',
      city: 'Test City',
      country: 'Test Country',
      postalCode: '12345',
      isDefault: true,
      userId: 'user1',
    },
  },
  reviews: [],
  averageRating: 4.5,
  totalReviews: 10,
  shippingOptions: [],
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('A test product description')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('by Test Shop')).toBeInTheDocument()
  })

  it('displays correct rating', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('(10)')).toBeInTheDocument()
  })

  it('shows out of stock when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStockProduct} />)
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })

  it('shows low stock badge when stock is low', () => {
    const lowStockProduct = { ...mockProduct, stock: 5 }
    render(<ProductCard product={lowStockProduct} />)
    
    expect(screen.getByText('Low Stock')).toBeInTheDocument()
  })

  it('handles add to cart click', () => {
    const mockAddToCart = jest.fn()
    jest.mocked(require('@/lib/hooks').useAddToCart).mockReturnValue({
      mutateAsync: mockAddToCart,
      isPending: false,
    })

    render(<ProductCard product={mockProduct} />)
    
    const addToCartButton = screen.getByText('Add to Cart')
    fireEvent.click(addToCartButton)
    
    expect(mockAddToCart).toHaveBeenCalledWith({
      productId: '1',
      quantity: 1,
    })
  })

  it('renders in list view correctly', () => {
    render(<ProductCard product={mockProduct} variant="list" />)
    
    // In list view, the product should still display the same information
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })
})
