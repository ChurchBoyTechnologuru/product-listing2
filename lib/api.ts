// API client layer with typed functions for all backend endpoints

import { 
  User, 
  Product, 
  Order, 
  CartItem, 
  ProductFilters, 
  SortOption, 
  PaginatedResponse,
  ApiResponse,
  LoginForm,
  RegisterForm,
  ProductForm,
  CheckoutForm,
  DashboardStats,
  SalesChart,
  TopProduct
} from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api'

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Network error', 0, error)
  }
}

// Auth API
export const authApi = {
  login: async (data: LoginForm): Promise<ApiResponse<{ token: string; user: User }>> => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  register: async (data: RegisterForm): Promise<ApiResponse<{ token: string; user: User }>> => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse<{ message: string }>> => {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    })
  },

  me: async (): Promise<ApiResponse<User>> => {
    return request('/auth/me')
  },

  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    return request('/auth/logout', { method: 'POST' })
  },
}

// Products API
export const productsApi = {
  getAll: async (
    filters?: ProductFilters,
    sort?: SortOption,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value.toString()
        }
        return acc
      }, {} as Record<string, string>)),
      ...(sort && { sortBy: sort.field, sortOrder: sort.direction }),
    })

    return request(`/products?${params}`)
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    return request(`/products/${id}`)
  },

  getByCategory: async (
    category: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    return request(`/products/category/${category}?page=${page}&limit=${limit}`)
  },

  search: async (
    query: string,
    filters?: ProductFilters,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value.toString()
        }
        return acc
      }, {} as Record<string, string>)),
    })

    return request(`/products/search?${params}`)
  },

  getFeatured: async (): Promise<ApiResponse<Product[]>> => {
    return request('/products/featured')
  },

  getCategories: async (): Promise<ApiResponse<string[]>> => {
    return request('/products/categories')
  },
}

// Seller API
export const sellerApi = {
  getProducts: async (
    status?: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    })

    return request(`/seller/products?${params}`)
  },

  createProduct: async (data: ProductForm): Promise<ApiResponse<Product>> => {
    return request('/seller/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateProduct: async (id: string, data: Partial<ProductForm>): Promise<ApiResponse<Product>> => {
    return request(`/seller/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  deleteProduct: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return request(`/seller/products/${id}`, {
      method: 'DELETE',
    })
  },

  getOrders: async (
    status?: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    })

    return request(`/seller/orders?${params}`)
  },

  updateOrderStatus: async (
    id: string,
    status: string,
    trackingNumber?: string
  ): Promise<ApiResponse<Order>> => {
    return request(`/seller/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, trackingNumber }),
    })
  },

  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return request('/seller/dashboard/stats')
  },

  getSalesChart: async (period: string = '30d'): Promise<ApiResponse<SalesChart[]>> => {
    return request(`/seller/dashboard/sales?period=${period}`)
  },

  getTopProducts: async (limit = 10): Promise<ApiResponse<TopProduct[]>> => {
    return request(`/seller/dashboard/top-products?limit=${limit}`)
  },

  updateShop: async (data: Partial<Shop>): Promise<ApiResponse<Shop>> => {
    return request('/seller/shop', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  uploadDocument: async (file: File, type: string): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    return request('/seller/documents', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    })
  },

  updateBankDetails: async (data: BankDetails): Promise<ApiResponse<BankDetails>> => {
    return request('/seller/bank-details', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}

// Buyer API
export const buyerApi = {
  getCart: async (): Promise<ApiResponse<CartItem[]>> => {
    return request('/buyer/cart')
  },

  addToCart: async (productId: string, quantity: number): Promise<ApiResponse<CartItem>> => {
    return request('/buyer/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    })
  },

  updateCartItem: async (itemId: string, quantity: number): Promise<ApiResponse<CartItem>> => {
    return request(`/buyer/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  },

  removeFromCart: async (itemId: string): Promise<ApiResponse<{ message: string }>> => {
    return request(`/buyer/cart/${itemId}`, {
      method: 'DELETE',
    })
  },

  clearCart: async (): Promise<ApiResponse<{ message: string }>> => {
    return request('/buyer/cart', {
      method: 'DELETE',
    })
  },

  getOrders: async (
    status?: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    })

    return request(`/buyer/orders?${params}`)
  },

  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    return request(`/buyer/orders/${id}`)
  },

  createOrder: async (data: CheckoutForm): Promise<ApiResponse<Order>> => {
    return request('/buyer/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  cancelOrder: async (id: string, reason?: string): Promise<ApiResponse<Order>> => {
    return request(`/buyer/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  },

  addReview: async (
    productId: string,
    rating: number,
    comment?: string,
    images?: string[]
  ): Promise<ApiResponse<Review>> => {
    return request('/buyer/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId, rating, comment, images }),
    })
  },

  getAddresses: async (): Promise<ApiResponse<Address[]>> => {
    return request('/buyer/addresses')
  },

  addAddress: async (data: Omit<Address, 'id' | 'userId'>): Promise<ApiResponse<Address>> => {
    return request('/buyer/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateAddress: async (id: string, data: Partial<Address>): Promise<ApiResponse<Address>> => {
    return request(`/buyer/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  deleteAddress: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return request(`/buyer/addresses/${id}`, {
      method: 'DELETE',
    })
  },
}

// Admin API
export const adminApi = {
  getUsers: async (
    role?: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(role && { role }),
    })

    return request(`/admin/users?${params}`)
  },

  updateUserRole: async (id: string, role: Role): Promise<ApiResponse<User>> => {
    return request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    })
  },

  getPendingProducts: async (
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    return request(`/admin/products/pending?page=${page}&limit=${limit}`)
  },

  approveProduct: async (id: string): Promise<ApiResponse<Product>> => {
    return request(`/admin/products/${id}/approve`, {
      method: 'POST',
    })
  },

  rejectProduct: async (id: string, reason: string): Promise<ApiResponse<Product>> => {
    return request(`/admin/products/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  },

  getPendingSellers: async (
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    return request(`/admin/sellers/pending?page=${page}&limit=${limit}`)
  },

  approveSeller: async (id: string): Promise<ApiResponse<User>> => {
    return request(`/admin/sellers/${id}/approve`, {
      method: 'POST',
    })
  },

  rejectSeller: async (id: string, reason: string): Promise<ApiResponse<User>> => {
    return request(`/admin/sellers/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  },

  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return request('/admin/dashboard/stats')
  },

  getSalesChart: async (period: string = '30d'): Promise<ApiResponse<SalesChart[]>> => {
    return request(`/admin/dashboard/sales?period=${period}`)
  },

  getTopProducts: async (limit = 10): Promise<ApiResponse<TopProduct[]>> => {
    return request(`/admin/dashboard/top-products?limit=${limit}`)
  },

  getAnalytics: async (): Promise<ApiResponse<any>> => {
    return request('/admin/analytics')
  },
}

// Utility functions
export const apiUtils = {
  setAuthToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  },

  removeAuthToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  },

  getAuthToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  },
}

export { ApiError }
