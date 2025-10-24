'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { useProductCategories } from '@/lib/hooks'
import { Upload, X, Plus, Package } from 'lucide-react'

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().min(1, 'Price is required'),
  currency: z.string().min(1, 'Currency is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  stock: z.string().min(0, 'Stock must be 0 or greater'),
  sku: z.string().optional(),
  weight: z.string().optional(),
  tags: z.string().optional(),
  isService: z.boolean().optional(),
})

type ProductForm = z.infer<typeof productSchema>

interface ImageUpload {
  id: string
  file: File
  preview: string
  isPrimary: boolean
}

interface ShippingOption {
  id: string
  name: string
  price: string
  currency: string
  estimatedDays: string
  countries: string[]
  isInternational: boolean
}

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: categories, isLoading: categoriesLoading } = useProductCategories()
  const [images, setImages] = useState<ImageUpload[]>([])
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      currency: 'USD',
      stock: '0',
      isService: false,
    },
  })

  const isService = watch('isService')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const id = Math.random().toString(36).substr(2, 9)
        const preview = URL.createObjectURL(file)
        
        setImages(prev => [...prev, {
          id,
          file,
          preview,
          isPrimary: prev.length === 0, // First image is primary by default
        }])
      }
    })
  }

  const removeImage = (id: string) => {
    setImages(prev => {
      const newImages = prev.filter(img => img.id !== id)
      // If we removed the primary image, make the first remaining image primary
      if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
        newImages[0].isPrimary = true
      }
      return newImages
    })
  }

  const setPrimaryImage = (id: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === id
    })))
  }

  const addShippingOption = () => {
    const id = Math.random().toString(36).substr(2, 9)
    setShippingOptions(prev => [...prev, {
      id,
      name: '',
      price: '',
      currency: 'USD',
      estimatedDays: '5',
      countries: [],
      isInternational: false,
    }])
  }

  const updateShippingOption = (id: string, field: keyof ShippingOption, value: any) => {
    setShippingOptions(prev => prev.map(option => 
      option.id === id ? { ...option, [field]: value } : option
    ))
  }

  const removeShippingOption = (id: string) => {
    setShippingOptions(prev => prev.filter(option => option.id !== id))
  }

  const uploadImages = async (imageFiles: File[]): Promise<string[]> => {
    const uploadPromises = imageFiles.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload image')
      }
      
      const data = await response.json()
      return data.url
    })
    
    return Promise.all(uploadPromises)
  }

  const onSubmit = async (data: ProductForm) => {
    if (images.length === 0) {
      toast({
        title: 'Error',
        description: 'Please upload at least one image',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)
    try {
      // Upload images
      const imageUrls = await uploadImages(images.map(img => img.file))
      
      // Prepare product data
      const productData = {
        ...data,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        weight: data.weight ? parseFloat(data.weight) : undefined,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        images: imageUrls,
        shippingOptions: shippingOptions.map(option => ({
          name: option.name,
          price: parseFloat(option.price),
          currency: option.currency,
          estimatedDays: parseInt(option.estimatedDays),
          countries: option.countries,
          isInternational: option.isInternational,
        })),
      }

      // Create product
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(productData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Product created successfully!',
        })
        router.push('/dashboard/products')
      } else {
        throw new Error(result.message || 'Failed to create product')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-gray-600 mt-2">
          Create a new product listing for your shop
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Provide the basic details about your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter product title"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU (Optional)</Label>
                <Input
                  id="sku"
                  placeholder="Enter SKU"
                  {...register('sku')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your product in detail"
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isService"
                {...register('isService')}
              />
              <Label htmlFor="isService">This is a service (not a physical product)</Label>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
            <CardDescription>
              Set the price and inventory for your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('price')}
                />
                {errors.price && (
                  <p className="text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Select onValueChange={(value) => setValue('currency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register('stock')}
                />
                {errors.stock && (
                  <p className="text-sm text-red-600">{errors.stock.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('weight')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="tag1, tag2, tag3"
                  {...register('tags')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category */}
        <Card>
          <CardHeader>
            <CardTitle>Category</CardTitle>
            <CardDescription>
              Choose the appropriate category for your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="" disabled>Loading...</SelectItem>
                    ) : (
                      categories?.data?.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  placeholder="Enter subcategory"
                  {...register('subcategory')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Upload images of your product. The first image will be the primary image.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="images" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload images
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </span>
                  </Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt="Product preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setPrimaryImage(image.id)}
                        className={image.isPrimary ? 'bg-primary text-white' : ''}
                      >
                        {image.isPrimary ? 'Primary' : 'Set Primary'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipping Options */}
        {!isService && (
          <Card>
            <CardHeader>
              <CardTitle>Shipping Options</CardTitle>
              <CardDescription>
                Define shipping options for your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {shippingOptions.map((option) => (
                <div key={option.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Shipping Option</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeShippingOption(option.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={option.name}
                        onChange={(e) => updateShippingOption(option.id, 'name', e.target.value)}
                        placeholder="e.g., Standard Shipping"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={option.price}
                        onChange={(e) => updateShippingOption(option.id, 'price', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select
                        value={option.currency}
                        onValueChange={(value) => updateShippingOption(option.id, 'currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated Days</Label>
                      <Input
                        type="number"
                        value={option.estimatedDays}
                        onChange={(e) => updateShippingOption(option.id, 'estimatedDays', e.target.value)}
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addShippingOption}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Shipping Option
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUploading}
          >
            {isUploading ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  )
}

