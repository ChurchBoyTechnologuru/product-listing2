// Product card component for displaying products in grids and lists

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { useAddToCart } from '@/lib/hooks'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  variant?: 'grid' | 'list'
  showActions?: boolean
}

export function ProductCard({ 
  product, 
  variant = 'grid', 
  showActions = true 
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const addToCart = useAddToCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      await addToCart.mutateAsync({ 
        productId: product.id, 
        quantity: 1 
      })
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement quick view modal
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  if (variant === 'list') {
    return (
      <Card className="flex flex-row overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative w-48 h-48 flex-shrink-0">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.title}
            fill
            className="object-cover"
          />
          {product.status === 'pending' && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              Pending
            </Badge>
          )}
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold line-clamp-1">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">
                {formatPrice(product.price, product.currency)}
              </p>
              {product.stock < 10 && product.stock > 0 && (
                <p className="text-sm text-orange-600">Only {product.stock} left</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(product.averageRating)}
                <span className="ml-2 text-sm text-gray-600">
                  ({product.totalReviews})
                </span>
              </div>
              <span className="text-sm text-gray-500">
                by {product.shop.name}
              </span>
            </div>
            
            {showActions && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleQuickView}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={isLoading || product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Status badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.status === 'pending' && (
              <Badge variant="secondary">Pending</Badge>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <Badge variant="destructive">Low Stock</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="outline">Out of Stock</Badge>
            )}
          </div>
          
          {/* Quick actions overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleQuickView}
                className="bg-white/90 hover:bg-white"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddToCart}
                disabled={isLoading || product.stock === 0}
                className="bg-white/90 hover:bg-white"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold line-clamp-2 text-sm">
              {product.title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-600 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center space-x-1">
            {renderStars(product.averageRating)}
            <span className="text-xs text-gray-500 ml-1">
              ({product.totalReviews})
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-primary">
                {formatPrice(product.price, product.currency)}
              </p>
              <p className="text-xs text-gray-500">
                by {product.shop.name}
              </p>
            </div>
            
            {product.shippingOptions.some(option => option.isInternational) && (
              <Badge variant="outline" className="text-xs">
                Int'l Shipping
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={isLoading || product.stock === 0}
          >
            {isLoading ? (
              'Adding...'
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              'Add to Cart'
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
