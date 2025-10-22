// Shared dashboard page with role-based content

'use client'

import { useAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  BarChart3,
  Settings,
  Store,
  Eye,
  Plus
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to access the dashboard.</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getDashboardContent = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />
      case 'seller':
        return <SellerDashboard />
      case 'buyer':
        return <BuyerDashboard />
      default:
        return <DefaultDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
          <Badge variant="secondary" className="mt-2">
            {user.role}
          </Badge>
        </div>

        {getDashboardContent()}
      </div>
    </div>
  )
}

function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, change: '+12%' },
    { label: 'Total Products', value: '5,678', icon: Package, change: '+8%' },
    { label: 'Total Orders', value: '9,012', icon: ShoppingCart, change: '+15%' },
    { label: 'Revenue', value: '$45,678', icon: DollarSign, change: '+23%' },
  ]

  const pendingItems = [
    { type: 'Product', title: 'Wireless Headphones', status: 'Pending Review' },
    { type: 'Seller', title: 'John Smith', status: 'Verification Required' },
    { type: 'Product', title: 'Smart Watch', status: 'Pending Review' },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button asChild className="h-20 flex flex-col">
                <Link href="/admin/products">
                  <Package className="h-6 w-6 mb-2" />
                  Manage Products
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col">
                <Link href="/admin/users">
                  <Users className="h-6 w-6 mb-2" />
                  Manage Users
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col">
                <Link href="/admin/analytics">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Analytics
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col">
                <Link href="/admin/settings">
                  <Settings className="h-6 w-6 mb-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.type}</div>
                  </div>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SellerDashboard() {
  const stats = [
    { label: 'Total Products', value: '24', icon: Package, change: '+2' },
    { label: 'Orders This Month', value: '156', icon: ShoppingCart, change: '+12%' },
    { label: 'Revenue', value: '$8,450', icon: DollarSign, change: '+18%' },
    { label: 'Store Rating', value: '4.8', icon: TrendingUp, change: '+0.2' },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button asChild className="h-20 flex flex-col">
                <Link href="/seller/products/new">
                  <Plus className="h-6 w-6 mb-2" />
                  Add Product
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col">
                <Link href="/seller/products">
                  <Package className="h-6 w-6 mb-2" />
                  My Products
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col">
                <Link href="/seller/orders">
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  Orders
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col">
                <Link href="/seller/shop">
                  <Store className="h-6 w-6 mb-2" />
                  Shop Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Order #12345</div>
                  <div className="text-sm text-gray-600">Wireless Headphones</div>
                </div>
                <Badge variant="secondary">Shipped</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Order #12346</div>
                  <div className="text-sm text-gray-600">Smart Watch</div>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function BuyerDashboard() {
  const stats = [
    { label: 'Total Orders', value: '12', icon: ShoppingCart, change: '+3' },
    { label: 'Wishlist Items', value: '8', icon: Package, change: '+2' },
    { label: 'Total Spent', value: '$1,234', icon: DollarSign, change: '+$156' },
    { label: 'Reviews Written', value: '5', icon: Eye, change: '+1' },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button asChild className="h-20 flex flex-col">
                <Link href="/products">
                  <Package className="h-6 w-6 mb-2" />
                  Browse Products
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col">
                <Link href="/buyer/cart">
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  My Cart
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col">
                <Link href="/buyer/orders">
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  My Orders
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex flex-col">
                <Link href="/buyer/wishlist">
                  <Package className="h-6 w-6 mb-2" />
                  Wishlist
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Order #12345</div>
                  <div className="text-sm text-gray-600">Wireless Headphones</div>
                </div>
                <Badge variant="secondary">Delivered</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Order #12346</div>
                  <div className="text-sm text-gray-600">Smart Watch</div>
                </div>
                <Badge variant="outline">Shipped</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DefaultDashboard() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to your dashboard</h2>
      <p className="text-gray-600 mb-8">Your dashboard content will appear here based on your role.</p>
      <Button asChild>
        <Link href="/products">Browse Products</Link>
      </Button>
    </div>
  )
}
