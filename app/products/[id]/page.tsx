// Product detail page with images, reviews, and purchase options

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useProduct, useAddToCart, useAddReview } from '@/lib/hooks'
import { formatPrice } from '@/lib/utils'
import { 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw, 
  MessageCircle,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle,
  MapPin,
  Clock
} from 'lucide-react'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')

  const { data: product, isLoading } = useProduct(productId)
  const addToCart = useAddToCart()
  const addReview = useAddReview()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  const productData = product.data

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({
        productId: productData.id,
        quantity: quantity
      })
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const handleSubmitReview = async () => {
    if (reviewRating === 0) return
    
    try {
      await addReview.mutateAsync({
        productId: productData.id,
        rating: reviewRating,
        comment: reviewComment
      })
      setShowReviewForm(false)
      setReviewRating(0)
      setReviewComment('')
    } catch (error) {
      console.error('Failed to submit review:', error)
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        onClick={() => interactive && setReviewRating(i + 1)}
        className={`h-5 w-5 ${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
      >
        <Star className="h-full w-full" />
      </button>
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <Image
                src={productData.images[selectedImage] || '/placeholder-product.jpg'}
                alt={productData.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${productData.title} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{productData.category}</Badge>
                {productData.status === 'pending' && (
                  <Badge variant="outline">Pending Approval</Badge>
                )}
                {productData.stock < 10 && productData.stock > 0 && (
                  <Badge variant="destructive">Low Stock</Badge>
                )}
                {productData.stock === 0 && (
                  <Badge variant="outline">Out of Stock</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productData.title}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {renderStars(productData.averageRating)}
                  <span className="ml-2 text-sm text-gray-600">
                    ({productData.totalReviews} reviews)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                  <Share2 className="h-4 w-4 text-gray-400 hover:text-blue-500 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold text-primary">
                {formatPrice(productData.price, productData.currency)}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-1" />
                  Free shipping
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Buyer protection
                </div>
                <div className="flex items-center">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  30-day returns
                </div>
              </div>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(productData.stock, quantity + 1))}
                    disabled={quantity >= productData.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  {productData.stock} available
                </span>
              </div>

              <div className="flex space-x-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={productData.stock === 0 || addToCart.isPending}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  disabled={productData.stock === 0}
                >
                  Buy Now
                </Button>
              </div>
            </div>

            <Separator />

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sold by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={productData.shop.owner.avatar} />
                    <AvatarFallback>
                      {productData.shop.owner.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{productData.shop.name}</div>
                    <div className="text-sm text-gray-600">
                      {productData.shop.location.city}, {productData.shop.location.country}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      {productData.shop.rating.toFixed(1)} ({productData.shop.totalSales} sales)
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                  <Button variant="outline" size="sm">
                    View Shop
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {productData.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Customer Reviews</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    Write Review
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showReviewForm && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-4">Write a Review</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Rating</label>
                        <div className="flex space-x-1 mt-1">
                          {renderStars(reviewRating, true)}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Comment</label>
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience with this product..."
                          className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleSubmitReview} disabled={reviewRating === 0}>
                          Submit Review
                        </Button>
                        <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {productData.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarImage src={review.user.avatar} />
                          <AvatarFallback>
                            {review.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{review.user.name}</span>
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            {review.isVerified && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          {review.comment && (
                            <p className="text-gray-700">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping and Policies */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipping & Returns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Truck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Shipping</div>
                    <div className="text-sm text-gray-600">
                      Free shipping on orders over $50
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Delivery</div>
                    <div className="text-sm text-gray-600">
                      3-7 business days
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <RotateCcw className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Returns</div>
                    <div className="text-sm text-gray-600">
                      30-day return policy
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU</span>
                  <span className="font-medium">{productData.sku || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium">
                    {productData.weight ? `${productData.weight} lbs` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions</span>
                  <span className="font-medium">
                    {productData.dimensions 
                      ? `${productData.dimensions.length}" × ${productData.dimensions.width}" × ${productData.dimensions.height}"`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{productData.category}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
