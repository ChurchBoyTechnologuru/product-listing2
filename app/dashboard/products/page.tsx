'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Search, Filter, Edit, Trash2, Eye, Package } from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  subcategory?: string
  stock: number
  status: string
  isActive: boolean
  isService: boolean
  images: Array<{
    id: string
    url: string
    alt?: string
    isPrimary: boolean
  }>
  createdAt: string
  updatedAt: string
}

export default function ProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Mock data - replace with actual API call
  const mockProducts: Product[] = [
    {
      id: '1',
      title: 'Wireless Bluetooth Headphones',
      description: 'Premium quality wireless headphones with noise cancellation',
      price: 199.99,
      currency: 'USD',
      category: 'Electronics',
      subcategory: 'Audio',
      stock: 50,
      status: 'approved',
      isActive: true,
      isService: false,
      images: [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          alt: 'Wireless Headphones',
          isPrimary: true,
        },
      ],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      title: 'Web Development Service',
      description: 'Professional web development services for your business',
      price: 2500.00,
      currency: 'USD',
      category: 'Digital Services',
      subcategory: 'Web Development',
      stock: 0,
      status: 'approved',
      isActive: true,
      isService: true,
      images: [
        {
          id: '2',
          url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop',
          alt: 'Web Development',
          isPrimary: true,
        },
      ],
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-14T14:20:00Z',
    },
  ]

  // Simulate loading
  useState(() => {
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  })

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) ||
                         product.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesType = typeFilter === 'all' || 
                       (typeFilter === 'products' && !product.isService) ||
                       (typeFilter === 'services' && product.isService)
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft' },
      pending: { variant: 'default' as const, label: 'Pending' },
      approved: { variant: 'default' as const, label: 'Approved' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' },
      suspended: { variant: 'destructive' as const, label: 'Suspended' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      // TODO: Implement delete API call
      setProducts(prev => prev.filter(p => p.id !== productId))
      toast({
        title: 'Product deleted',
        description: 'The product has been successfully deleted.',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-2">
            Manage your product listings and services
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={product.images[0]?.url || '/placeholder-product.jpg'}
                alt={product.images[0]?.alt || product.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2">
                {getStatusBadge(product.status)}
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant="outline">
                  {product.isService ? 'Service' : 'Product'}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold line-clamp-2">{product.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {product.currency} {product.price.toFixed(2)}
                  </span>
                  {!product.isService && (
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>Category: {product.category}</p>
                  {product.subcategory && (
                    <p>Subcategory: {product.subcategory}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/products/${product.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 text-center mb-4">
              {search || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters to see more products.'
                : 'Get started by adding your first product.'}
            </p>
            <Link href="/dashboard/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

