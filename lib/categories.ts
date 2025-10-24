// Comprehensive product and service categories for international marketplace

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  parentId?: string
  children?: Category[]
  isService?: boolean
  isActive: boolean
}

export interface CategoryTree {
  categories: Category[]
  services: Category[]
}

// Main product categories
export const PRODUCT_CATEGORIES: Category[] = [
  // Electronics & Technology
  {
    id: 'electronics',
    name: 'Electronics & Technology',
    slug: 'electronics',
    description: 'Smartphones, laptops, gadgets, and tech accessories',
    icon: '📱',
    isActive: true,
    children: [
      {
        id: 'smartphones',
        name: 'Smartphones & Accessories',
        slug: 'smartphones',
        description: 'Mobile phones, cases, chargers, and accessories',
        icon: '📱',
        parentId: 'electronics',
        isActive: true
      },
      {
        id: 'computers',
        name: 'Computers & Laptops',
        slug: 'computers',
        description: 'Laptops, desktops, tablets, and computer accessories',
        icon: '💻',
        parentId: 'electronics',
        isActive: true
      },
      {
        id: 'audio-video',
        name: 'Audio & Video',
        slug: 'audio-video',
        description: 'Headphones, speakers, cameras, and video equipment',
        icon: '🎧',
        parentId: 'electronics',
        isActive: true
      },
      {
        id: 'gaming',
        name: 'Gaming',
        slug: 'gaming',
        description: 'Gaming consoles, accessories, and games',
        icon: '🎮',
        parentId: 'electronics',
        isActive: true
      },
      {
        id: 'smart-home',
        name: 'Smart Home',
        slug: 'smart-home',
        description: 'Smart devices, home automation, and IoT products',
        icon: '🏠',
        parentId: 'electronics',
        isActive: true
      }
    ]
  },

  // Fashion & Beauty
  {
    id: 'fashion',
    name: 'Fashion & Beauty',
    slug: 'fashion',
    description: 'Clothing, shoes, accessories, and beauty products',
    icon: '👗',
    isActive: true,
    children: [
      {
        id: 'womens-clothing',
        name: "Women's Clothing",
        slug: 'womens-clothing',
        description: 'Dresses, tops, bottoms, and outerwear for women',
        icon: '👚',
        parentId: 'fashion',
        isActive: true
      },
      {
        id: 'mens-clothing',
        name: "Men's Clothing",
        slug: 'mens-clothing',
        description: 'Shirts, pants, suits, and outerwear for men',
        icon: '👔',
        parentId: 'fashion',
        isActive: true
      },
      {
        id: 'shoes',
        name: 'Shoes & Footwear',
        slug: 'shoes',
        description: 'Sneakers, boots, heels, and all types of footwear',
        icon: '👟',
        parentId: 'fashion',
        isActive: true
      },
      {
        id: 'accessories',
        name: 'Accessories',
        slug: 'accessories',
        description: 'Bags, jewelry, watches, and fashion accessories',
        icon: '👜',
        parentId: 'fashion',
        isActive: true
      },
      {
        id: 'beauty',
        name: 'Beauty & Cosmetics',
        slug: 'beauty',
        description: 'Makeup, skincare, hair care, and beauty tools',
        icon: '💄',
        parentId: 'fashion',
        isActive: true
      }
    ]
  },

  // Home & Garden
  {
    id: 'home-garden',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Furniture, decor, appliances, and garden supplies',
    icon: '🏡',
    isActive: true,
    children: [
      {
        id: 'furniture',
        name: 'Furniture',
        slug: 'furniture',
        description: 'Living room, bedroom, dining, and office furniture',
        icon: '🛋️',
        parentId: 'home-garden',
        isActive: true
      },
      {
        id: 'home-decor',
        name: 'Home Decor',
        slug: 'home-decor',
        description: 'Wall art, lighting, rugs, and decorative items',
        icon: '🖼️',
        parentId: 'home-garden',
        isActive: true
      },
      {
        id: 'appliances',
        name: 'Appliances',
        slug: 'appliances',
        description: 'Kitchen, laundry, and home appliances',
        icon: '🔌',
        parentId: 'home-garden',
        isActive: true
      },
      {
        id: 'garden',
        name: 'Garden & Outdoor',
        slug: 'garden',
        description: 'Plants, tools, outdoor furniture, and garden supplies',
        icon: '🌱',
        parentId: 'home-garden',
        isActive: true
      },
      {
        id: 'kitchen',
        name: 'Kitchen & Dining',
        slug: 'kitchen',
        description: 'Cookware, dinnerware, and kitchen accessories',
        icon: '🍽️',
        parentId: 'home-garden',
        isActive: true
      }
    ]
  },

  // Health & Sports
  {
    id: 'health-sports',
    name: 'Health & Sports',
    slug: 'health-sports',
    description: 'Fitness equipment, supplements, and sports gear',
    icon: '💪',
    isActive: true,
    children: [
      {
        id: 'fitness',
        name: 'Fitness & Exercise',
        slug: 'fitness',
        description: 'Gym equipment, yoga mats, and fitness accessories',
        icon: '🏋️',
        parentId: 'health-sports',
        isActive: true
      },
      {
        id: 'sports',
        name: 'Sports & Outdoor',
        slug: 'sports',
        description: 'Team sports, outdoor activities, and sports equipment',
        icon: '⚽',
        parentId: 'health-sports',
        isActive: true
      },
      {
        id: 'supplements',
        name: 'Health & Supplements',
        slug: 'supplements',
        description: 'Vitamins, supplements, and health products',
        icon: '💊',
        parentId: 'health-sports',
        isActive: true
      },
      {
        id: 'medical',
        name: 'Medical & First Aid',
        slug: 'medical',
        description: 'Medical supplies, first aid kits, and health monitoring',
        icon: '🏥',
        parentId: 'health-sports',
        isActive: true
      }
    ]
  },

  // Automotive
  {
    id: 'automotive',
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car parts, accessories, and automotive tools',
    icon: '🚗',
    isActive: true,
    children: [
      {
        id: 'car-parts',
        name: 'Car Parts & Accessories',
        slug: 'car-parts',
        description: 'Engine parts, body parts, and car accessories',
        icon: '🔧',
        parentId: 'automotive',
        isActive: true
      },
      {
        id: 'motorcycle',
        name: 'Motorcycle & Powersports',
        slug: 'motorcycle',
        description: 'Motorcycles, ATVs, and powersports equipment',
        icon: '🏍️',
        parentId: 'automotive',
        isActive: true
      },
      {
        id: 'tools',
        name: 'Tools & Equipment',
        slug: 'tools',
        description: 'Automotive tools, diagnostic equipment, and supplies',
        icon: '🔨',
        parentId: 'automotive',
        isActive: true
      }
    ]
  },

  // Books & Media
  {
    id: 'books-media',
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, movies, music, and educational materials',
    icon: '📚',
    isActive: true,
    children: [
      {
        id: 'books',
        name: 'Books & Literature',
        slug: 'books',
        description: 'Fiction, non-fiction, textbooks, and e-books',
        icon: '📖',
        parentId: 'books-media',
        isActive: true
      },
      {
        id: 'movies-music',
        name: 'Movies & Music',
        slug: 'movies-music',
        description: 'DVDs, Blu-rays, CDs, and digital media',
        icon: '🎬',
        parentId: 'books-media',
        isActive: true
      },
      {
        id: 'educational',
        name: 'Educational Materials',
        slug: 'educational',
        description: 'Courses, tutorials, and learning resources',
        icon: '🎓',
        parentId: 'books-media',
        isActive: true
      }
    ]
  },

  // Toys & Games
  {
    id: 'toys-games',
    name: 'Toys & Games',
    slug: 'toys-games',
    description: 'Children\'s toys, board games, and educational toys',
    icon: '🧸',
    isActive: true,
    children: [
      {
        id: 'children-toys',
        name: 'Children\'s Toys',
        slug: 'children-toys',
        description: 'Action figures, dolls, and age-appropriate toys',
        icon: '🎯',
        parentId: 'toys-games',
        isActive: true
      },
      {
        id: 'board-games',
        name: 'Board Games & Puzzles',
        slug: 'board-games',
        description: 'Board games, card games, and puzzles',
        icon: '🎲',
        parentId: 'toys-games',
        isActive: true
      },
      {
        id: 'educational-toys',
        name: 'Educational Toys',
        slug: 'educational-toys',
        description: 'STEM toys, learning games, and educational kits',
        icon: '🧩',
        parentId: 'toys-games',
        isActive: true
      }
    ]
  },

  // Food & Beverages
  {
    id: 'food-beverages',
    name: 'Food & Beverages',
    slug: 'food-beverages',
    description: 'Gourmet foods, beverages, and specialty items',
    icon: '🍕',
    isActive: true,
    children: [
      {
        id: 'gourmet',
        name: 'Gourmet & Specialty Foods',
        slug: 'gourmet',
        description: 'Artisan foods, international cuisine, and specialty items',
        icon: '🍯',
        parentId: 'food-beverages',
        isActive: true
      },
      {
        id: 'beverages',
        name: 'Beverages',
        slug: 'beverages',
        description: 'Coffee, tea, wine, and specialty drinks',
        icon: '☕',
        parentId: 'food-beverages',
        isActive: true
      },
      {
        id: 'health-food',
        name: 'Health & Organic Foods',
        slug: 'health-food',
        description: 'Organic, gluten-free, and health-focused foods',
        icon: '🥗',
        parentId: 'food-beverages',
        isActive: true
      }
    ]
  },

  // Industrial & Business
  {
    id: 'industrial-business',
    name: 'Industrial & Business',
    slug: 'industrial-business',
    description: 'Industrial equipment, office supplies, and business tools',
    icon: '🏭',
    isActive: true,
    children: [
      {
        id: 'office-supplies',
        name: 'Office Supplies',
        slug: 'office-supplies',
        description: 'Stationery, office furniture, and business supplies',
        icon: '📋',
        parentId: 'industrial-business',
        isActive: true
      },
      {
        id: 'industrial-equipment',
        name: 'Industrial Equipment',
        slug: 'industrial-equipment',
        description: 'Machinery, tools, and industrial supplies',
        icon: '⚙️',
        parentId: 'industrial-business',
        isActive: true
      },
      {
        id: 'safety',
        name: 'Safety & Security',
        slug: 'safety',
        description: 'Safety equipment, security systems, and protective gear',
        icon: '🛡️',
        parentId: 'industrial-business',
        isActive: true
      }
    ]
  }
]

// Service categories
export const SERVICE_CATEGORIES: Category[] = [
  {
    id: 'digital-services',
    name: 'Digital Services',
    slug: 'digital-services',
    description: 'Web development, design, and digital marketing services',
    icon: '💻',
    isService: true,
    isActive: true,
    children: [
      {
        id: 'web-development',
        name: 'Web Development',
        slug: 'web-development',
        description: 'Website design, development, and maintenance',
        icon: '🌐',
        parentId: 'digital-services',
        isService: true,
        isActive: true
      },
      {
        id: 'graphic-design',
        name: 'Graphic Design',
        slug: 'graphic-design',
        description: 'Logo design, branding, and visual design services',
        icon: '🎨',
        parentId: 'digital-services',
        isService: true,
        isActive: true
      },
      {
        id: 'digital-marketing',
        name: 'Digital Marketing',
        slug: 'digital-marketing',
        description: 'SEO, social media marketing, and online advertising',
        icon: '📈',
        parentId: 'digital-services',
        isService: true,
        isActive: true
      },
      {
        id: 'content-creation',
        name: 'Content Creation',
        slug: 'content-creation',
        description: 'Writing, video production, and content marketing',
        icon: '✍️',
        parentId: 'digital-services',
        isService: true,
        isActive: true
      }
    ]
  },

  {
    id: 'professional-services',
    name: 'Professional Services',
    slug: 'professional-services',
    description: 'Consulting, legal, and business services',
    icon: '💼',
    isService: true,
    isActive: true,
    children: [
      {
        id: 'consulting',
        name: 'Business Consulting',
        slug: 'consulting',
        description: 'Business strategy, management, and financial consulting',
        icon: '📊',
        parentId: 'professional-services',
        isService: true,
        isActive: true
      },
      {
        id: 'legal-services',
        name: 'Legal Services',
        slug: 'legal-services',
        description: 'Legal advice, document preparation, and representation',
        icon: '⚖️',
        parentId: 'professional-services',
        isService: true,
        isActive: true
      },
      {
        id: 'accounting',
        name: 'Accounting & Finance',
        slug: 'accounting',
        description: 'Bookkeeping, tax preparation, and financial planning',
        icon: '🧮',
        parentId: 'professional-services',
        isService: true,
        isActive: true
      },
      {
        id: 'translation',
        name: 'Translation & Language',
        slug: 'translation',
        description: 'Document translation, interpretation, and language services',
        icon: '🌍',
        parentId: 'professional-services',
        isService: true,
        isActive: true
      }
    ]
  },

  {
    id: 'creative-services',
    name: 'Creative Services',
    slug: 'creative-services',
    description: 'Photography, writing, and creative arts services',
    icon: '🎭',
    isService: true,
    isActive: true,
    children: [
      {
        id: 'photography',
        name: 'Photography & Videography',
        slug: 'photography',
        description: 'Event photography, product photos, and video production',
        icon: '📸',
        parentId: 'creative-services',
        isService: true,
        isActive: true
      },
      {
        id: 'writing',
        name: 'Writing & Editing',
        slug: 'writing',
        description: 'Content writing, copywriting, and editing services',
        icon: '✍️',
        parentId: 'creative-services',
        isService: true,
        isActive: true
      },
      {
        id: 'music',
        name: 'Music & Audio',
        slug: 'music',
        description: 'Music production, voice-over, and audio services',
        icon: '🎵',
        parentId: 'creative-services',
        isService: true,
        isActive: true
      },
      {
        id: 'art-craft',
        name: 'Art & Craft',
        slug: 'art-craft',
        description: 'Custom artwork, handmade crafts, and artistic services',
        icon: '🎨',
        parentId: 'creative-services',
        isService: true,
        isActive: true
      }
    ]
  },

  {
    id: 'technical-services',
    name: 'Technical Services',
    slug: 'technical-services',
    description: 'IT support, technical consulting, and maintenance',
    icon: '🔧',
    isService: true,
    isActive: true,
    children: [
      {
        id: 'it-support',
        name: 'IT Support & Maintenance',
        slug: 'it-support',
        description: 'Computer repair, network setup, and IT consulting',
        icon: '💻',
        parentId: 'technical-services',
        isService: true,
        isActive: true
      },
      {
        id: 'mobile-repair',
        name: 'Mobile Device Repair',
        slug: 'mobile-repair',
        description: 'Phone and tablet repair services',
        icon: '📱',
        parentId: 'technical-services',
        isService: true,
        isActive: true
      },
      {
        id: 'home-automation',
        name: 'Home Automation',
        slug: 'home-automation',
        description: 'Smart home setup, security systems, and automation',
        icon: '🏠',
        parentId: 'technical-services',
        isService: true,
        isActive: true
      }
    ]
  },

  {
    id: 'personal-services',
    name: 'Personal Services',
    slug: 'personal-services',
    description: 'Personal care, tutoring, and lifestyle services',
    icon: '👤',
    isService: true,
    isActive: true,
    children: [
      {
        id: 'tutoring',
        name: 'Tutoring & Education',
        slug: 'tutoring',
        description: 'Academic tutoring, language lessons, and skill training',
        icon: '🎓',
        parentId: 'personal-services',
        isService: true,
        isActive: true
      },
      {
        id: 'personal-care',
        name: 'Personal Care',
        slug: 'personal-care',
        description: 'Beauty services, wellness, and personal grooming',
        icon: '💅',
        parentId: 'personal-services',
        isService: true,
        isActive: true
      },
      {
        id: 'event-services',
        name: 'Event Services',
        slug: 'event-services',
        description: 'Event planning, catering, and entertainment services',
        icon: '🎉',
        parentId: 'personal-services',
        isService: true,
        isActive: true
      },
      {
        id: 'virtual-assistant',
        name: 'Virtual Assistant',
        slug: 'virtual-assistant',
        description: 'Administrative support, data entry, and virtual assistance',
        icon: '🤖',
        parentId: 'personal-services',
        isService: true,
        isActive: true
      }
    ]
  }
]

// Combined category tree
export const CATEGORY_TREE: CategoryTree = {
  categories: PRODUCT_CATEGORIES,
  services: SERVICE_CATEGORIES
}

// Helper functions
export function getAllCategories(): Category[] {
  const allCategories: Category[] = []
  
  function flattenCategories(categories: Category[]): void {
    categories.forEach(category => {
      allCategories.push(category)
      if (category.children) {
        flattenCategories(category.children)
      }
    })
  }
  
  flattenCategories(PRODUCT_CATEGORIES)
  flattenCategories(SERVICE_CATEGORIES)
  
  return allCategories
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getAllCategories().find(category => category.slug === slug)
}

export function getCategoriesByParent(parentId: string): Category[] {
  return getAllCategories().filter(category => category.parentId === parentId)
}

export function getMainCategories(): Category[] {
  return [...PRODUCT_CATEGORIES, ...SERVICE_CATEGORIES].filter(category => !category.parentId)
}

export function getProductCategories(): Category[] {
  return PRODUCT_CATEGORIES
}

export function getServiceCategories(): Category[] {
  return SERVICE_CATEGORIES
}

export function searchCategories(query: string): Category[] {
  const searchTerm = query.toLowerCase()
  return getAllCategories().filter(category => 
    category.name.toLowerCase().includes(searchTerm) ||
    category.description.toLowerCase().includes(searchTerm)
  )
}

