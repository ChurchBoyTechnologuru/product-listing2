# International Marketplace

A complete, production-ready frontend for an international marketplace that connects global sellers with local consumers. Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🌟 Features

### Core Functionality
- **Multi-role Authentication**: Admin, Seller, and Buyer roles with JWT-based auth
- **Product Management**: Full CRUD operations for sellers with image uploads
- **Shopping Cart & Checkout**: Complete e-commerce flow with cart management
- **Order Management**: Order tracking and status updates for buyers and sellers
- **Review System**: Product reviews and ratings with verification
- **Admin Dashboard**: Product moderation, user management, and analytics

### International Features
- **Multi-currency Support**: Dynamic currency conversion and display
- **Internationalization**: Multi-language support with locale switching
- **Global Shipping**: International shipping options and tracking
- **Seller Verification**: Document upload and verification process

### Technical Features
- **TypeScript**: Fully typed codebase with comprehensive interfaces
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant with semantic HTML and ARIA attributes
- **Performance**: Optimized with Next.js App Router and React Query
- **Testing**: Unit tests with Jest and React Testing Library

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd international-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/marketplace"
   
   # Authentication
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   JWT_SECRET="your-jwt-secret-here"
   
   # API Configuration
   NEXT_PUBLIC_API_BASE="http://localhost:3000/api"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── products/                 # Product pages
│   │   └── [id]/                 # Product detail
│   ├── seller/                   # Seller dashboard
│   ├── buyer/                    # Buyer pages
│   ├── admin/                    # Admin dashboard
│   └── dashboard/                 # Shared dashboard
├── components/                    # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── TopNav.tsx                # Navigation component
│   ├── Footer.tsx                # Footer component
│   ├── ProductCard.tsx           # Product display
│   ├── ProductGrid.tsx           # Product listing
│   ├── FiltersPanel.tsx          # Product filters
│   ├── CurrencySelector.tsx     # Currency switcher
│   └── LocaleSwitcher.tsx       # Language switcher
├── lib/                          # Utilities and configurations
│   ├── types.ts                  # TypeScript type definitions
│   ├── api.ts                    # API client functions
│   ├── auth.tsx                  # Authentication context
│   ├── hooks.ts                  # Custom React hooks
│   └── utils.ts                  # Utility functions
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeding
└── public/                       # Static assets
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema changes to database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio
```

### Database Management

The project uses Prisma as the ORM with PostgreSQL. Key commands:

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset the database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

### Adding New Features

1. **New Pages**: Add to `app/` directory following Next.js App Router conventions
2. **New Components**: Add to `components/` directory with proper TypeScript types
3. **New API Routes**: Add to `app/api/` directory
4. **Database Changes**: Update `prisma/schema.prisma` and create migrations

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_URL` | Base URL for authentication | ✅ |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | ✅ |
| `JWT_SECRET` | Secret for JWT tokens | ✅ |
| `NEXT_PUBLIC_API_BASE` | API base URL | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ❌ |
| `SMTP_HOST` | Email server host | ❌ |

### API Endpoints

The frontend expects the following API endpoints:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

#### Products
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get product categories

#### Seller
- `GET /api/seller/products` - Seller's products
- `POST /api/seller/products` - Create product
- `PUT /api/seller/products/:id` - Update product
- `DELETE /api/seller/products/:id` - Delete product

#### Buyer
- `GET /api/buyer/cart` - Get cart items
- `POST /api/buyer/cart` - Add to cart
- `PUT /api/buyer/cart/:id` - Update cart item
- `DELETE /api/buyer/cart/:id` - Remove from cart

#### Admin
- `GET /api/admin/products/pending` - Pending products
- `POST /api/admin/products/:id/approve` - Approve product
- `POST /api/admin/products/:id/reject` - Reject product

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

```
__tests__/
├── components/           # Component tests
├── lib/                 # Utility tests
└── pages/               # Page tests
```

### Example Test

```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/ProductCard'

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const mockProduct = {
      id: '1',
      title: 'Test Product',
      price: 99.99,
      currency: 'USD',
      // ... other properties
    }

    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })
})
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Ensure all required environment variables are set in your production environment:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
JWT_SECRET="your-production-jwt-secret"
NEXT_PUBLIC_API_BASE="https://your-domain.com/api"
```

## 🔒 Security Considerations

### Authentication
- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- Password hashing should be implemented on the backend
- Rate limiting should be implemented for auth endpoints

### Data Protection
- Never store sensitive data in localStorage
- Validate all user inputs on both client and server
- Implement CORS policies for API endpoints
- Use HTTPS in production

### Seller Verification
- Document verification should be done server-side
- Bank details should never be stored in plain text
- Implement proper file upload validation and sanitization

## 🌍 Internationalization

### Adding New Languages

1. **Add locale to `components/LocaleSwitcher.tsx`**
2. **Create translation files in `locales/` directory**
3. **Update `next.config.js` for locale routing**

### Currency Support

1. **Add currency to `components/CurrencySelector.tsx`**
2. **Update currency conversion logic in `lib/utils.ts`**
3. **Configure exchange rate API integration**

## 📊 Analytics Integration

### Google Analytics

```typescript
// Add to layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@marketplace.com or create an issue in the repository.

## 🔄 API Contract Examples

### Authentication

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Response
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "buyer"
    }
  }
}
```

### Products

```bash
# Get products with filters
curl "http://localhost:3000/api/products?category=Electronics&minPrice=100&maxPrice=500&page=1&limit=20"

# Response
{
  "success": true,
  "data": {
    "data": [...products],
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

### Cart Operations

```bash
# Add to cart
curl -X POST http://localhost:3000/api/buyer/cart \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"productId": "product123", "quantity": 2}'
```

## 🎯 Roadmap

- [ ] Payment integration (Stripe, PayPal)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered product recommendations
- [ ] Multi-vendor marketplace features
- [ ] Advanced search with filters
- [ ] Social features (wishlists, sharing)
- [ ] Subscription plans for sellers
- [ ] API rate limiting and monitoring

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
