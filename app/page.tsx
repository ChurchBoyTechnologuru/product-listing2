// Home page with hero section, featured products, and categories

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProductGrid } from '@/components/ProductGrid'
import { useFeaturedProducts, useProductCategories } from '@/lib/hooks'
import { 
  ArrowRight, 
  Star, 
  Truck, 
  Shield, 
  Globe, 
  Users,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useFeaturedProducts()
  const { data: categories, isLoading: isLoadingCategories } = useProductCategories()

  const features = [
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with customers worldwide while shipping locally'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Protected transactions with industry-leading security'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Optimized logistics for quick and reliable delivery'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Verified sellers and buyers for safe transactions'
    }
  ]

  const stats = [
    { label: 'Active Sellers', value: '10,000+', icon: Users },
    { label: 'Products Sold', value: '1M+', icon: TrendingUp },
    { label: 'Countries', value: '50+', icon: Globe },
    { label: 'Customer Rating', value: '4.8/5', icon: Star }
  ]

  const benefits = [
    'No monthly fees - pay only when you sell',
    'Global shipping network',
    'Multi-currency support',
    '24/7 customer support',
    'Advanced analytics dashboard',
    'Mobile-optimized selling tools'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Globe className="h-3 w-3 mr-1" />
                  Global Marketplace
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Sell internationally.
                  <span className="text-primary"> Ship locally.</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Connect with customers worldwide while leveraging local shipping networks. 
                  Grow your business beyond borders with our international marketplace.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/auth/register?role=seller">
                    Start Selling
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/products">
                    Browse Products
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/hero-marketplace.jpg"
                  alt="International marketplace illustration"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Marketplace?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to succeed in international e-commerce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Discover products from around the world
            </p>
          </div>

          {isLoadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-24 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories?.data?.slice(0, 12).map((category, index) => (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="group"
                >
                  <Card className="h-24 flex items-center justify-center hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                    <CardContent className="text-center">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-primary">
                        {category}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked items from our top sellers
            </p>
          </div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.data?.slice(0, 8).map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-200">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.images[0] || '/placeholder-product.jpg'}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2">{product.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        ${product.price}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {product.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Everything you need to succeed
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of successful sellers who have expanded their reach globally
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/auth/register?role=seller">
                    Get Started Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="text-center mb-6">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">Seller Success</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average monthly revenue</span>
                    <span className="font-bold text-primary">$5,000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Customer satisfaction</span>
                    <span className="font-bold text-green-600">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Global reach</span>
                    <span className="font-bold text-blue-600">50+ countries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start selling globally?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our marketplace and connect with customers worldwide. 
            No setup fees, no monthly costs - just success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register?role=seller">
                Start Selling Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900" asChild>
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
