// Core TypeScript types and interfaces for the international marketplace

export type Role = 'admin' | 'seller' | 'buyer'

export type VerificationState = 'pending' | 'verified' | 'rejected'

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export type ProductStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended'

export interface User {
  id: string
  email: string
  name: string
  role: Role
  avatar?: string
  phone?: string
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
  // Seller specific fields
  shop?: Shop
  verificationState?: VerificationState
  businessInfo?: BusinessInfo
  bankDetails?: BankDetails
}

export interface Shop {
  id: string
  name: string
  description?: string
  logo?: string
  banner?: string
  website?: string
  location: Address
  isVerified: boolean
  rating: number
  totalSales: number
  createdAt: string
  updatedAt: string
  ownerId: string
  owner: User
}

export interface BusinessInfo {
  businessName: string
  businessType: 'individual' | 'company'
  taxId?: string
  registrationNumber?: string
  documents: Document[]
}

export interface Document {
  id: string
  type: 'id' | 'business_license' | 'tax_certificate' | 'bank_statement'
  url: string
  status: VerificationState
  uploadedAt: string
}

export interface BankDetails {
  id: string
  accountHolderName: string
  accountNumber: string
  routingNumber: string
  bankName: string
  bankCountry: string
  currency: string
  isVerified: boolean
}

export interface Address {
  id: string
  street: string
  city: string
  state?: string
  country: string
  postalCode: string
  isDefault: boolean
  userId: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  subcategory?: string
  images: string[]
  stock: number
  sku?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  status: ProductStatus
  isActive: boolean
  tags: string[]
  shippingOptions: ShippingOption[]
  createdAt: string
  updatedAt: string
  shopId: string
  shop: Shop
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export interface ShippingOption {
  id: string
  name: string
  price: number
  currency: string
  estimatedDays: number
  countries: string[]
  isInternational: boolean
}

export interface Review {
  id: string
  rating: number
  comment?: string
  images?: string[]
  isVerified: boolean
  createdAt: string
  productId: string
  userId: string
  user: User
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  totalAmount: number
  currency: string
  shippingAddress: Address
  billingAddress: Address
  items: OrderItem[]
  shippingOption: ShippingOption
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
  buyerId: string
  buyer: User
  sellerId: string
  seller: User
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  currency: string
  productId: string
  product: Product
  orderId: string
}

export interface CartItem {
  id: string
  quantity: number
  productId: string
  product: Product
  userId: string
}

export interface Payout {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  bankDetails: BankDetails
  processedAt?: string
  createdAt: string
  sellerId: string
  seller: User
}

export interface Currency {
  code: string
  name: string
  symbol: string
  rate: number
}

export interface Locale {
  code: string
  name: string
  flag: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Filter and search types
export interface ProductFilters {
  category?: string
  subcategory?: string
  minPrice?: number
  maxPrice?: number
  currency?: string
  sellerLocation?: string
  shippingOptions?: string[]
  rating?: number
  tags?: string[]
  search?: string
}

export interface SortOption {
  field: 'price' | 'createdAt' | 'rating' | 'relevance'
  direction: 'asc' | 'desc'
}

// Form types
export interface LoginForm {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: Role
  acceptTerms: boolean
}

export interface ProductForm {
  title: string
  description: string
  price: number
  currency: string
  category: string
  subcategory?: string
  stock: number
  sku?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  tags: string[]
  images: string[]
  shippingOptions: Omit<ShippingOption, 'id'>[]
}

export interface CheckoutForm {
  shippingAddress: Address
  billingAddress: Address
  shippingOptionId: string
  paymentMethod: 'card' | 'paypal' | 'bank_transfer'
  notes?: string
}

// Analytics types
export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  revenueGrowth: number
  orderGrowth: number
  productGrowth: number
  customerGrowth: number
}

export interface SalesChart {
  period: string
  revenue: number
  orders: number
}

export interface TopProduct {
  id: string
  title: string
  sales: number
  revenue: number
  image: string
}
