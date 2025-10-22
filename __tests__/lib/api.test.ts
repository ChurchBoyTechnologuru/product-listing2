// Unit test for API client functions

import { authApi, productsApi, sellerApi, buyerApi, adminApi } from '@/lib/api'

// Mock fetch globally
global.fetch = jest.fn()

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('authApi', () => {
    it('login makes correct API call', async () => {
      const mockResponse = {
        success: true,
        data: {
          token: 'mock-token',
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'buyer',
          },
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await authApi.login({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })

      expect(result).toEqual(mockResponse)
    })

    it('register makes correct API call', async () => {
      const mockResponse = {
        success: true,
        data: {
          token: 'mock-token',
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'buyer',
          },
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await authApi.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'buyer',
        acceptTerms: true,
      })

      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          role: 'buyer',
          acceptTerms: true,
        }),
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('productsApi', () => {
    it('getAll makes correct API call with filters', async () => {
      const mockResponse = {
        success: true,
        data: {
          data: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const filters = {
        category: 'Electronics',
        minPrice: 100,
        maxPrice: 500,
      }

      const sort = {
        field: 'price' as const,
        direction: 'asc' as const,
      }

      const result = await productsApi.getAll(filters, sort, 1, 20)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products?'),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )

      expect(result).toEqual(mockResponse)
    })

    it('getById makes correct API call', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: '1',
          title: 'Test Product',
          price: 99.99,
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await productsApi.getById('1')

      expect(fetch).toHaveBeenCalledWith('/api/products/1', {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('buyerApi', () => {
    it('addToCart makes correct API call', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: '1',
          productId: 'product1',
          quantity: 2,
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await buyerApi.addToCart('product1', 2)

      expect(fetch).toHaveBeenCalledWith('/api/buyer/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: 'product1',
          quantity: 2,
        }),
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('sellerApi', () => {
    it('createProduct makes correct API call', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: '1',
          title: 'New Product',
          price: 99.99,
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const productData = {
        title: 'New Product',
        description: 'A new product',
        price: 99.99,
        currency: 'USD',
        category: 'Electronics',
        stock: 10,
        tags: ['new'],
        images: [],
        shippingOptions: [],
      }

      const result = await sellerApi.createProduct(productData)

      expect(fetch).toHaveBeenCalledWith('/api/seller/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('adminApi', () => {
    it('approveProduct makes correct API call', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: '1',
          status: 'approved',
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await adminApi.approveProduct('1')

      expect(fetch).toHaveBeenCalledWith('/api/admin/products/1/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('Error Handling', () => {
    it('throws ApiError on HTTP error', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          message: 'Bad Request',
        }),
      })

      await expect(authApi.login({
        email: 'test@example.com',
        password: 'wrong',
      })).rejects.toThrow('Bad Request')
    })

    it('throws ApiError on network error', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(authApi.login({
        email: 'test@example.com',
        password: 'password',
      })).rejects.toThrow('Network error')
    })
  })
})
