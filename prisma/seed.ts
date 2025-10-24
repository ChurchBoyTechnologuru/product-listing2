// Database seed file with sample data for development

import { PrismaClient, Role, ProductStatus, OrderStatus, PayoutStatus, VerificationState, DocumentType, BusinessType } from '@prisma/client'
import { PRODUCT_CATEGORIES, SERVICE_CATEGORIES } from '../lib/categories'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories first
  console.log('📂 Creating categories...')
  await createCategories()

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@marketplace.com' },
    update: {},
    create: {
      email: 'admin@marketplace.com',
      name: 'Admin User',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJvJdH8qJ8qJ8qJ8qJ8q', // password123
      role: Role.ADMIN,
      isEmailVerified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
  })

  // Create seller users
  const seller1 = await prisma.user.upsert({
    where: { email: 'john@seller.com' },
    update: {},
    create: {
      email: 'john@seller.com',
      name: 'John Smith',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJvJdH8qJ8qJ8qJ8qJ8q', // password123
      role: Role.SELLER,
      isEmailVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      phone: '+1-555-0123',
    },
  })

  const seller2 = await prisma.user.upsert({
    where: { email: 'maria@seller.com' },
    update: {},
    create: {
      email: 'maria@seller.com',
      name: 'Maria Garcia',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJvJdH8qJ8qJ8qJ8qJ8q', // password123
      role: Role.SELLER,
      isEmailVerified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      phone: '+34-555-0456',
    },
  })

  const seller3 = await prisma.user.upsert({
    where: { email: 'kenji@seller.com' },
    update: {},
    create: {
      email: 'kenji@seller.com',
      name: 'Kenji Tanaka',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJvJdH8qJ8qJ8qJ8qJ8q', // password123
      role: Role.SELLER,
      isEmailVerified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      phone: '+81-555-0789',
    },
  })

  // Create buyer users
  const buyer1 = await prisma.user.upsert({
    where: { email: 'alice@buyer.com' },
    update: {},
    create: {
      email: 'alice@buyer.com',
      name: 'Alice Johnson',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJvJdH8qJ8qJ8qJ8qJ8q', // password123
      role: Role.BUYER,
      isEmailVerified: true,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      phone: '+1-555-0321',
    },
  })

  const buyer2 = await prisma.user.upsert({
    where: { email: 'david@buyer.com' },
    update: {},
    create: {
      email: 'david@buyer.com',
      name: 'David Wilson',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJvJdH8qJ8qJ8qJ8qJ8q', // password123
      role: Role.BUYER,
      isEmailVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      phone: '+44-555-0654',
    },
  })

  // Create addresses
  const seller1Address = await prisma.address.create({
    data: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      postalCode: '10001',
      isDefault: true,
      userId: seller1.id,
    },
  })

  const seller2Address = await prisma.address.create({
    data: {
      street: '456 Calle Mayor',
      city: 'Madrid',
      country: 'Spain',
      postalCode: '28001',
      isDefault: true,
      userId: seller2.id,
    },
  })

  const seller3Address = await prisma.address.create({
    data: {
      street: '789 Shibuya Street',
      city: 'Tokyo',
      country: 'Japan',
      postalCode: '150-0002',
      isDefault: true,
      userId: seller3.id,
    },
  })

  // Create shops
  const shop1 = await prisma.shop.create({
    data: {
      name: 'Tech Gadgets Pro',
      description: 'Premium technology and electronics from around the world',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=300&fit=crop',
      website: 'https://techgadgetspro.com',
      isVerified: true,
      rating: 4.8,
      totalSales: 1250,
      ownerId: seller1.id,
      locationId: seller1Address.id,
    },
  })

  const shop2 = await prisma.shop.create({
    data: {
      name: 'Fashion Forward',
      description: 'Trendy fashion and accessories for the modern lifestyle',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=300&fit=crop',
      website: 'https://fashionforward.com',
      isVerified: true,
      rating: 4.6,
      totalSales: 890,
      ownerId: seller2.id,
      locationId: seller2Address.id,
    },
  })

  const shop3 = await prisma.shop.create({
    data: {
      name: 'Artisan Crafts',
      description: 'Handmade traditional crafts and unique art pieces',
      logo: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=300&fit=crop',
      website: 'https://artisancrafts.com',
      isVerified: false,
      rating: 4.9,
      totalSales: 340,
      ownerId: seller3.id,
      locationId: seller3Address.id,
    },
  })

  // Create products
  const products = [
    {
      title: 'Wireless Bluetooth Headphones',
      description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
      price: 199.99,
      currency: 'USD',
      category: 'Electronics',
      subcategory: 'Audio',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
      ],
      stock: 50,
      sku: 'WH-001',
      weight: 0.5,
      dimensions: { length: 8, width: 6, height: 3 },
      status: ProductStatus.APPROVED,
      tags: ['wireless', 'bluetooth', 'noise-cancelling', 'premium'],
      shopId: shop1.id,
      averageRating: 4.7,
      totalReviews: 156,
    },
    {
      title: 'Smart Fitness Watch',
      description: 'Advanced fitness tracking watch with heart rate monitoring, GPS, and water resistance. Track your health and fitness goals.',
      price: 299.99,
      currency: 'USD',
      category: 'Electronics',
      subcategory: 'Wearables',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&h=600&fit=crop',
      ],
      stock: 25,
      sku: 'SFW-002',
      weight: 0.3,
      dimensions: { length: 4, width: 4, height: 1 },
      status: ProductStatus.APPROVED,
      tags: ['fitness', 'smartwatch', 'health', 'tracking'],
      shopId: shop1.id,
      averageRating: 4.5,
      totalReviews: 89,
    },
    {
      title: 'Designer Handbag',
      description: 'Luxury leather handbag crafted by skilled artisans. Perfect for special occasions and everyday elegance.',
      price: 450.00,
      currency: 'EUR',
      category: 'Fashion',
      subcategory: 'Bags',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop',
      ],
      stock: 15,
      sku: 'DHB-003',
      weight: 1.2,
      dimensions: { length: 12, width: 8, height: 6 },
      status: ProductStatus.APPROVED,
      tags: ['luxury', 'leather', 'designer', 'handbag'],
      shopId: shop2.id,
      averageRating: 4.8,
      totalReviews: 67,
    },
    {
      title: 'Organic Cotton T-Shirt',
      description: 'Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes.',
      price: 29.99,
      currency: 'EUR',
      category: 'Fashion',
      subcategory: 'Clothing',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop',
      ],
      stock: 100,
      sku: 'OCT-004',
      weight: 0.2,
      dimensions: { length: 20, width: 15, height: 1 },
      status: ProductStatus.APPROVED,
      tags: ['organic', 'cotton', 'sustainable', 'comfortable'],
      shopId: shop2.id,
      averageRating: 4.3,
      totalReviews: 234,
    },
    {
      title: 'Handmade Ceramic Bowl',
      description: 'Beautiful handcrafted ceramic bowl made by traditional Japanese artisans. Perfect for serving or decoration.',
      price: 85.00,
      currency: 'JPY',
      category: 'Home & Garden',
      subcategory: 'Kitchen',
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop',
      ],
      stock: 30,
      sku: 'HCB-005',
      weight: 0.8,
      dimensions: { length: 8, width: 8, height: 4 },
      status: ProductStatus.PENDING,
      tags: ['handmade', 'ceramic', 'traditional', 'artisan'],
      shopId: shop3.id,
      averageRating: 4.9,
      totalReviews: 45,
    },
    {
      title: 'Vintage Wooden Chess Set',
      description: 'Exquisite vintage wooden chess set with hand-carved pieces. A perfect gift for chess enthusiasts.',
      price: 150.00,
      currency: 'USD',
      category: 'Sports & Recreation',
      subcategory: 'Games',
      images: [
        'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&h=600&fit=crop',
      ],
      stock: 12,
      sku: 'VWCS-006',
      weight: 2.5,
      dimensions: { length: 12, width: 12, height: 3 },
      status: ProductStatus.APPROVED,
      tags: ['vintage', 'wooden', 'chess', 'hand-carved'],
      shopId: shop3.id,
      averageRating: 4.6,
      totalReviews: 78,
    },
  ]

  for (const productData of products) {
    const { images, ...productWithoutImages } = productData
    const product = await prisma.product.create({
      data: {
        ...productWithoutImages,
        images: {
          create: images.map((url, index) => ({
            url,
            alt: `${productData.title} image ${index + 1}`,
            isPrimary: index === 0,
            order: index
          }))
        }
      },
    })
  }

  // Create shipping options
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      price: 9.99,
      currency: 'USD',
      estimatedDays: 5,
      countries: ['US', 'CA'],
      isInternational: false,
    },
    {
      name: 'Express Shipping',
      price: 19.99,
      currency: 'USD',
      estimatedDays: 2,
      countries: ['US', 'CA'],
      isInternational: false,
    },
    {
      name: 'International Shipping',
      price: 29.99,
      currency: 'USD',
      estimatedDays: 10,
      countries: ['GB', 'DE', 'FR', 'JP', 'AU'],
      isInternational: true,
    },
  ]

  for (const shippingData of shippingOptions) {
    await prisma.shippingOption.create({
      data: {
        ...shippingData,
        productId: (await prisma.product.findFirst())?.id || '',
      },
    })
  }

  // Create reviews
  const reviews = [
    {
      rating: 5,
      comment: 'Excellent headphones! Great sound quality and very comfortable.',
      isVerified: true,
      productId: (await prisma.product.findFirst({ where: { title: 'Wireless Bluetooth Headphones' } }))?.id || '',
      userId: buyer1.id,
    },
    {
      rating: 4,
      comment: 'Good quality, but the battery life could be better.',
      isVerified: true,
      productId: (await prisma.product.findFirst({ where: { title: 'Wireless Bluetooth Headphones' } }))?.id || '',
      userId: buyer2.id,
    },
    {
      rating: 5,
      comment: 'Beautiful handbag! The leather quality is amazing.',
      isVerified: true,
      productId: (await prisma.product.findFirst({ where: { title: 'Designer Handbag' } }))?.id || '',
      userId: buyer1.id,
    },
  ]

  for (const reviewData of reviews) {
    if (reviewData.productId) {
      await prisma.review.create({
        data: reviewData,
      })
    }
  }

  // Create business info for sellers
  await prisma.businessInfo.create({
    data: {
      businessName: 'Tech Gadgets Pro LLC',
      businessType: BusinessType.COMPANY,
      taxId: '12-3456789',
      registrationNumber: 'REG-001',
      userId: seller1.id,
    },
  })

  await prisma.businessInfo.create({
    data: {
      businessName: 'Maria Garcia Fashion',
      businessType: BusinessType.INDIVIDUAL,
      taxId: 'ES-12345678',
      userId: seller2.id,
    },
  })

  // Create bank details
  await prisma.bankDetails.create({
    data: {
      accountHolderName: 'Tech Gadgets Pro LLC',
      accountNumber: '1234567890',
      routingNumber: '021000021',
      bankName: 'Chase Bank',
      bankCountry: 'United States',
      currency: 'USD',
      isVerified: true,
      userId: seller1.id,
    },
  })

  // Create documents
  await prisma.document.create({
    data: {
      type: DocumentType.BUSINESS_LICENSE,
      url: 'https://example.com/business-license.pdf',
      status: VerificationState.VERIFIED,
      userId: seller1.id,
    },
  })

  await prisma.document.create({
    data: {
      type: DocumentType.ID,
      url: 'https://example.com/id-document.pdf',
      status: VerificationState.VERIFIED,
      userId: seller2.id,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Created ${await prisma.user.count()} users`)
  console.log(`🏪 Created ${await prisma.shop.count()} shops`)
  console.log(`📦 Created ${await prisma.product.count()} products`)
  console.log(`⭐ Created ${await prisma.review.count()} reviews`)
  console.log(`📂 Created ${await prisma.category.count()} categories`)
}

async function createCategories() {
  // Create product categories
  for (const category of PRODUCT_CATEGORIES) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        isService: false,
        isActive: true,
      },
    })

    // Create subcategories
    if (category.children) {
      for (const subcategory of category.children) {
        await prisma.category.upsert({
          where: { slug: subcategory.slug },
          update: {},
          create: {
            name: subcategory.name,
            slug: subcategory.slug,
            description: subcategory.description,
            icon: subcategory.icon,
            parentId: createdCategory.id,
            isService: false,
            isActive: true,
          },
        })
      }
    }
  }

  // Create service categories
  for (const category of SERVICE_CATEGORIES) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        isService: true,
        isActive: true,
      },
    })

    // Create subcategories
    if (category.children) {
      for (const subcategory of category.children) {
        await prisma.category.upsert({
          where: { slug: subcategory.slug },
          update: {},
          create: {
            name: subcategory.name,
            slug: subcategory.slug,
            description: subcategory.description,
            icon: subcategory.icon,
            parentId: createdCategory.id,
            isService: true,
            isActive: true,
          },
        })
      }
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
