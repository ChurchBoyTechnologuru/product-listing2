// Filters panel component for product filtering

'use client'

import { useState } from 'react'
import { ProductFilters } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Sliders, 
  X, 
  Filter,
  DollarSign,
  MapPin,
  Truck,
  Star
} from 'lucide-react'

interface FiltersPanelProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  categories: string[]
  onClose?: () => void
}

export function FiltersPanel({ 
  filters, 
  onFiltersChange, 
  categories,
  onClose 
}: FiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters)

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters: ProductFilters = {}
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFiltersCount = Object.values(localFilters).filter(
    value => value !== undefined && value !== null && value !== ''
  ).length

  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $250', min: 100, max: 250 },
    { label: 'Over $250', min: 250, max: Infinity },
  ]

  const ratingOptions = [
    { value: 4, label: '4+ Stars' },
    { value: 3, label: '3+ Stars' },
    { value: 2, label: '2+ Stars' },
    { value: 1, label: '1+ Stars' },
  ]

  const shippingOptions = [
    { value: 'free', label: 'Free Shipping' },
    { value: 'international', label: 'International' },
    { value: 'express', label: 'Express Delivery' },
  ]

  const sellerLocations = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Japan',
    'Australia',
    'Other'
  ]

  return (
    <div className="w-full max-w-sm bg-white border-r border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Search</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Input
            placeholder="Search products..."
            value={localFilters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="radio"
                name="category"
                value={category}
                checked={localFilters.category === category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Price Range
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            {priceRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  handleFilterChange('minPrice', range.min)
                  handleFilterChange('maxPrice', range.max === Infinity ? undefined : range.max)
                }}
                className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-50 ${
                  localFilters.minPrice === range.min && 
                  localFilters.maxPrice === range.max
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Customer Rating
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {ratingOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="rating"
                value={option.value}
                checked={localFilters.rating === option.value}
                onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Seller Location */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Seller Location
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {sellerLocations.map((location) => (
            <label key={location} className="flex items-center space-x-2">
              <input
                type="radio"
                name="sellerLocation"
                value={location}
                checked={localFilters.sellerLocation === location}
                onChange={(e) => handleFilterChange('sellerLocation', e.target.value)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">{location}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Shipping Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Truck className="h-4 w-4 mr-2" />
            Shipping
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {shippingOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFilters.shippingOptions?.includes(option.value) || false}
                onChange={(e) => {
                  const current = localFilters.shippingOptions || []
                  const updated = e.target.checked
                    ? [...current, option.value]
                    : current.filter(item => item !== option.value)
                  handleFilterChange('shippingOptions', updated)
                }}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Tags</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Input
            placeholder="Enter tags (comma separated)"
            value={localFilters.tags?.join(', ') || ''}
            onChange={(e) => {
              const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              handleFilterChange('tags', tags)
            }}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex space-x-2">
        <Button onClick={handleApplyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleClearFilters}>
          Clear
        </Button>
      </div>
    </div>
  )
}
