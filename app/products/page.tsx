// Products listing page with filters and search

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductFilters, SortOption } from '@/lib/types'
import { ProductGrid } from '@/components/ProductGrid'
import { FiltersPanel } from '@/components/FiltersPanel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useProducts, useProductCategories } from '@/lib/hooks'
import { 
  Filter, 
  Search, 
  Grid3X3, 
  List, 
  X,
  SlidersHorizontal
} from 'lucide-react'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<ProductFilters>({})
  const [sort, setSort] = useState<SortOption>({ field: 'relevance', direction: 'desc' })
  const [page, setPage] = useState(1)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: products, isLoading } = useProducts(filters, sort, page, 20)
  const { data: categories } = useProductCategories()

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sellerLocation = searchParams.get('sellerLocation')
    const rating = searchParams.get('rating')

    const initialFilters: ProductFilters = {}
    if (category) initialFilters.category = category
    if (search) {
      initialFilters.search = search
      setSearchQuery(search)
    }
    if (minPrice) initialFilters.minPrice = Number(minPrice)
    if (maxPrice) initialFilters.maxPrice = Number(maxPrice)
    if (sellerLocation) initialFilters.sellerLocation = sellerLocation
    if (rating) initialFilters.rating = Number(rating)

    setFilters(initialFilters)
  }, [searchParams])

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setFilters({ ...filters, search: searchQuery.trim() })
      setPage(1)
    }
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchQuery('')
    setPage(1)
  }

  const activeFiltersCount = Object.values(filters).filter(
    value => value !== undefined && value !== null && value !== ''
  ).length

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'createdAt', label: 'Newest' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {filters.search ? `Search results for "${filters.search}"` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {products?.data?.total ? `${products.data.total.toLocaleString()} products found` : 'Discover amazing products from around the world'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="lg:sticky lg:top-8">
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {(showFilters || window.innerWidth >= 1024) && (
                <div className="lg:block">
                  <FiltersPanel
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    categories={categories?.data || []}
                    onClose={() => setShowFilters(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || value === '') return null
                    return (
                      <Badge key={key} variant="secondary" className="flex items-center gap-1">
                        {key}: {value}
                        <button
                          onClick={() => {
                            const newFilters = { ...filters }
                            delete newFilters[key as keyof ProductFilters]
                            setFilters(newFilters)
                          }}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear all
                  </Button>
                </div>
              )}

              {/* Sort and View Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      value={`${sort.field}-${sort.direction}`}
                      onChange={(e) => {
                        const [field, direction] = e.target.value.split('-')
                        setSort({ field: field as any, direction: direction as 'asc' | 'desc' })
                      }}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={`${option.value}-desc`}>
                          {option.label} (High to Low)
                        </option>
                      ))}
                      {sortOptions.map((option) => (
                        <option key={`${option.value}-asc`} value={`${option.value}-asc`}>
                          {option.label} (Low to High)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">View:</span>
                  <div className="flex border border-gray-300 rounded-md">
                    <Button
                      variant={view === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setView('grid')}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={view === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setView('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid
              products={products?.data?.data || []}
              total={products?.data?.total || 0}
              currentPage={page}
              totalPages={Math.ceil((products?.data?.total || 0) / 20)}
              onPageChange={setPage}
              onViewChange={setView}
              view={view}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
