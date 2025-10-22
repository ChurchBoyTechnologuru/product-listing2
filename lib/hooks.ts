// Custom React hooks for data fetching and state management

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  productsApi, 
  sellerApi, 
  buyerApi, 
  adminApi, 
  authApi 
} from './api'
import { 
  Product, 
  Order, 
  CartItem, 
  ProductFilters, 
  SortOption,
  DashboardStats,
  SalesChart,
  TopProduct,
  User
} from './types'

// Products hooks
export function useProducts(
  filters?: ProductFilters,
  sort?: SortOption,
  page = 1,
  limit = 20
) {
  return useQuery({
    queryKey: ['products', filters, sort, page, limit],
    queryFn: () => productsApi.getAll(filters, sort, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.getFeatured(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useProductCategories() {
  return useQuery({
    queryKey: ['products', 'categories'],
    queryFn: () => productsApi.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useSearchProducts(
  query: string,
  filters?: ProductFilters,
  page = 1,
  limit = 20
) {
  return useQuery({
    queryKey: ['products', 'search', query, filters, page, limit],
    queryFn: () => productsApi.search(query, filters, page, limit),
    enabled: !!query,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Seller hooks
export function useSellerProducts(status?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ['seller', 'products', status, page, limit],
    queryFn: () => sellerApi.getProducts(status, page, limit),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: sellerApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductForm> }) =>
      sellerApi.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: sellerApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useSellerOrders(status?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ['seller', 'orders', status, page, limit],
    queryFn: () => sellerApi.getOrders(status, page, limit),
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status, trackingNumber }: { 
      id: string; 
      status: string; 
      trackingNumber?: string 
    }) => sellerApi.updateOrderStatus(id, status, trackingNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'orders'] })
      queryClient.invalidateQueries({ queryKey: ['buyer', 'orders'] })
    },
  })
}

export function useSellerDashboardStats() {
  return useQuery({
    queryKey: ['seller', 'dashboard', 'stats'],
    queryFn: () => sellerApi.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useSellerSalesChart(period = '30d') {
  return useQuery({
    queryKey: ['seller', 'dashboard', 'sales', period],
    queryFn: () => sellerApi.getSalesChart(period),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useSellerTopProducts(limit = 10) {
  return useQuery({
    queryKey: ['seller', 'dashboard', 'top-products', limit],
    queryFn: () => sellerApi.getTopProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Buyer hooks
export function useCart() {
  return useQuery({
    queryKey: ['buyer', 'cart'],
    queryFn: () => buyerApi.getCart(),
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      buyerApi.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'cart'] })
    },
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      buyerApi.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'cart'] })
    },
  })
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: buyerApi.removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'cart'] })
    },
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: buyerApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'cart'] })
    },
  })
}

export function useBuyerOrders(status?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ['buyer', 'orders', status, page, limit],
    queryFn: () => buyerApi.getOrders(status, page, limit),
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['buyer', 'order', id],
    queryFn: () => buyerApi.getOrderById(id),
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: buyerApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'orders'] })
      queryClient.invalidateQueries({ queryKey: ['buyer', 'cart'] })
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      buyerApi.cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'orders'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'orders'] })
    },
  })
}

export function useAddReview() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      productId, 
      rating, 
      comment, 
      images 
    }: { 
      productId: string; 
      rating: number; 
      comment?: string; 
      images?: string[] 
    }) => buyerApi.addReview(productId, rating, comment, images),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useAddresses() {
  return useQuery({
    queryKey: ['buyer', 'addresses'],
    queryFn: () => buyerApi.getAddresses(),
  })
}

export function useAddAddress() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: buyerApi.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'addresses'] })
    },
  })
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) =>
      buyerApi.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'addresses'] })
    },
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: buyerApi.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'addresses'] })
    },
  })
}

// Admin hooks
export function useAdminUsers(role?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ['admin', 'users', role, page, limit],
    queryFn: () => adminApi.getUsers(role, page, limit),
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      adminApi.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function usePendingProducts(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['admin', 'products', 'pending', page, limit],
    queryFn: () => adminApi.getPendingProducts(page, limit),
  })
}

export function useApproveProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.approveProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', 'pending'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useRejectProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.rejectProduct(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', 'pending'] })
    },
  })
}

export function usePendingSellers(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['admin', 'sellers', 'pending', page, limit],
    queryFn: () => adminApi.getPendingSellers(page, limit),
  })
}

export function useApproveSeller() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: adminApi.approveSeller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers', 'pending'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useRejectSeller() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.rejectSeller(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers', 'pending'] })
    },
  })
}

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: () => adminApi.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useAdminSalesChart(period = '30d') {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'sales', period],
    queryFn: () => adminApi.getSalesChart(period),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useAdminTopProducts(limit = 10) {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'top-products', limit],
    queryFn: () => adminApi.getTopProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminApi.getAnalytics(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Utility hooks
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}
