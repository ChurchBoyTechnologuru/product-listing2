# International Marketplace - Complete Design Specification

## Project Overview

A modern, professional international e-commerce marketplace platform that connects global sellers with local consumers. The platform features role-based access (buyers and sellers), product discovery, seller profiles, secure transactions, and multi-currency support.

---

## Design System

### Color Palette (3-5 Colors)

**Primary Brand Color:**
- Primary: `#2563eb` (Vibrant Blue) - Trust, professionalism, and global connectivity

**Neutral Colors:**
- Background: `#ffffff` (Pure White) - Clean, trustworthy foundation
- Foreground/Text: `#1f2937` (Dark Gray) - Excellent readability
- Muted Background: `#f9fafb` (Light Gray) - Section separation

**Accent Color:**
- Success/Accent: `#10b981` (Emerald Green) - Positive actions, transactions, success states

### Typography

**Two Font Families:**
1. **Heading Font:** `Inter` (Sans-serif) - Weights: 600 (semibold), 700 (bold), 800 (extra-bold)
2. **Body Font:** `Inter` (Sans-serif) - Weights: 400 (regular), 500 (medium)

**Typography Scale:**
- H1 (Hero): 48-60px, bold, line-height 1.2
- H2 (Section): 32-40px, bold, line-height 1.3
- H3 (Subsection): 24-28px, semibold, line-height 1.4
- Body: 14-16px, regular, line-height 1.6
- Small: 12-13px, regular, line-height 1.5

### Spacing & Layout

**Layout Method:** Flexbox for most layouts, CSS Grid for complex 2D layouts
**Spacing Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
**Container Max-Width:** 1280px (7xl)
**Gap Classes:** Use `gap-4`, `gap-6`, `gap-8` for consistent spacing

---

## Page Structure & Design

### 1. Home Page (`/`)

#### Hero Section
- **Background:** Gradient to white from primary/5 → background → secondary/5
- **Layout:** Two-column grid (text left, imagery right)
- **Content:**
  - Badge with globe icon: "Global Marketplace"
  - Main heading: "Sell internationally. Ship locally." (highlight "Ship locally" in primary)
  - Subheading: "Connect with customers worldwide while leveraging local shipping networks..."
  - Two CTAs: Primary "Start Selling" + Secondary "Browse Products"
  - Stats grid (2x2 on mobile, 4x1 on desktop): Users, Products, Countries, Rating

#### Features Section
- **Background:** White
- **Layout:** 4-column card grid (2x2 on tablet, stack on mobile)
- **Cards:** Hover shadow lift effect
  - Globe icon: Global Reach
  - Shield icon: Secure Payments
  - Truck icon: Fast Shipping
  - Users icon: Trusted Community

#### Categories Section
- **Background:** Light gray
- **Layout:** 6-column grid (4 on tablet, 2 on mobile)
- **Cards:** Category name with hover scale effect
- **Interactive:** Link to `/products?category=slug`

#### Featured Products Section
- **Background:** White
- **Layout:** 4-column product card grid (2 on tablet, 1 on mobile)
- **Cards:**
  - Product image with hover zoom effect
  - Product title (line-clamp-2)
  - Price in primary color
  - Star rating
- **CTA:** "View All Products" button at bottom

#### Benefits Section
- **Background:** Primary/5
- **Layout:** Two-column (text left, stats box right)
- **Left Content:**
  - Heading + description
  - Checkmark list items (6 benefits)
  - CTA button
- **Right Content:**
  - Card with success stats
  - Three metric rows

#### CTA Section
- **Background:** Dark gray/900
- **Text Color:** White
- **Layout:** Center-aligned column
- **Content:**
  - Heading
  - Description
  - Two buttons: Primary (secondary variant) + Secondary (outline light)

---

### 2. Product Catalog Page (`/products`)

#### Header
- **Background:** Light gray
- **Content:** Title, result count
- **Breadcrumb:** Optional

#### Layout Structure
- **Sidebar (Left):** Fixed on desktop, collapsible on mobile
- **Main Content (Right):** 70% width on desktop

#### Filters Sidebar
- **Background:** White card with subtle shadow
- **Sections:**
  - Category dropdown
  - Price range slider (min/max inputs)
  - Seller location multiselect
  - Rating filter (stars)
  - "Clear All Filters" button

#### Search & Controls Bar
- **Search:** Icon inside input, full width
- **Active Filters:** Badge list with X close
- **Sort Dropdown:** Relevance, Price, Rating, Newest
- **View Toggle:** Grid/List icons
- **Results Count:** "X results found"

#### Product Grid/List
- **Grid View (Default):** 4 columns on desktop, 2 on tablet, 1 on mobile
- **List View:** Full-width rows with image (thumbnail), details, actions
- **Card Elements:**
  - Image (aspect-square, hover zoom)
  - Title (line-clamp-2 on grid)
  - Price (primary color, bold)
  - Rating (stars + number)
  - Seller name (optional)

#### Pagination
- **Style:** Button group or numbered pages
- **Position:** Bottom center

---

### 3. Product Detail Page (`/products/[id]`)

#### Layout
- **Background:** White
- **Max-width:** 7xl container

#### Image Gallery (Left/Top)
- **Main Image:** Large aspect-square image
- **Thumbnails:** Row of 4-5 small images below
- **Zoom:** On hover effect

#### Product Information (Right/Below)
- **Product Title:** Large, bold
- **Rating Section:** Stars, review count, link to reviews
- **Price Section:**
  - Main price (large, primary color)
  - Original price (strikethrough if on sale)
  - Discount badge
- **Description:** Rich text, expandable
- **Specifications:** Key-value pairs
- **Seller Info Card:**
  - Seller avatar
  - Seller name (link to profile)
  - Seller rating
  - Location
  - "Contact Seller" button
- **Actions:**
  - Add to Cart button (full width)
  - Add to Wishlist button (secondary)
  - Share buttons

#### Reviews Section
- **Layout:** Separate section below
- **Heading:** "Customer Reviews"
- **Review Filter:** Star rating filter buttons
- **Review Cards:**
  - Reviewer avatar + name
  - Rating (stars)
  - Review date
  - Review title
  - Review text
  - Helpful votes
- **Write Review Button** (if user logged in)

---

### 4. Authentication Pages (`/auth/*`)

#### Login Page (`/auth/login`)
- **Layout:** Centered card or split layout
- **Card Width:** 400px max
- **Form:**
  - Email input
  - Password input (with show/hide toggle)
  - "Remember me" checkbox
  - "Login" button (full width)
- **Links:**
  - "Forgot password?" link
  - "Don't have account? Sign up" link
- **Background:** Light gradient or plain white

#### Sign Up Page (`/auth/register`)
- **Layout:** Same as login
- **Form:**
  - Name input
  - Email input
  - Password input (strength indicator)
  - Confirm password input
  - Role selector (Buyer/Seller toggle)
  - Terms checkbox
  - "Create Account" button
- **Links:** "Already have account? Login"

#### Forgot Password Page
- **Layout:** Centered card
- **Form:**
  - Email input
  - "Send Reset Link" button
- **Message:** "Check your email for reset link"

#### Email Verification Page
- **Message:** "Verify your email"
- **Resend Link:** Option to resend email
- **Status:** Loading state while checking

---

### 5. Dashboard Pages (Protected)

#### Dashboard Home (`/dashboard`)
- **Background:** Light gray
- **Sidebar Navigation:**
  - Logo
  - Navigation items (Dashboard, Products, Orders, Profile)
  - User menu (avatar, name, settings, logout)
- **Main Content:**
  - Welcome message
  - Key metrics cards (4-6)
  - Recent orders/activity table
  - Charts/analytics (if applicable)

#### Products Management (`/dashboard/products`)
- **Header:** "My Products" + "Add Product" button
- **Table/Grid:**
  - Product image (thumbnail)
  - Product name
  - Category
  - Price
  - Stock
  - Status (active/inactive)
  - Actions (edit, delete, view)
- **Pagination/Load more**

#### Add Product (`/dashboard/products/new`)
- **Form Sections:**
  - Basic Info: Title, Description, Category
  - Pricing: Price, Currency, Discount
  - Images: Upload multiple images
  - Inventory: Stock quantity, SKU
  - Shipping: Weight, dimensions
  - SEO: Meta title, description, keywords
  - Status: Active/Draft toggle
- **Buttons:** Save Draft, Publish, Cancel

#### Profile Page (`/dashboard/profile`)
- **Sections:**
  - Avatar upload
  - Basic Info: Name, email, phone
  - Address
  - Bio/Description
  - Business Info (if seller)
  - Save button
- **Other Sections:**
  - Password change
  - Account settings
  - Connected accounts

---

### 6. Seller Profile Page (`/sellers/[id]`)
- **Header Banner:** Seller background image (optional)
- **Info Card:**
  - Seller avatar
  - Seller name
  - Rating + review count
  - Location
  - Member since date
  - Follow button
- **Tabs:**
  - Products: Product grid
  - Reviews: Customer reviews
  - About: Seller description
  - Contact: Seller contact info

---

### 7. Common Components

#### Navigation Bar (TopNav)
- **Background:** White
- **Border Bottom:** Light gray 1px
- **Layout:** Flex, space-between
- **Left:**
  - Logo/Brand
  - Search bar (centered)
- **Right:**
  - Category dropdown (optional)
  - Wishlist icon (heart)
  - Cart icon (bag with badge)
  - Locale switcher (flag + language code)
  - Currency selector
  - User menu (if logged in)
  - Login/Sign up buttons (if not logged in)

#### Footer
- **Background:** Dark gray/900
- **Text Color:** White
- **Layout:** 4-5 column grid
- **Columns:**
  1. About + Newsletter signup
  2. Categories
  3. Help & Support
  4. Company
  5. Social links
- **Bottom:** Copyright, legal links

#### Product Card
- **Hover Effects:**
  - Image zoom (105%)
  - Shadow lift
  - Optional: Add to cart on hover
- **Elements:** Image, title, price, rating
- **Responsive:** Full width on mobile, responsive on desktop

#### Buttons
- **Variants:** Primary, Secondary (outline), Ghost, Destructive
- **Sizes:** Small, Medium (default), Large
- **States:** Default, Hover (darker), Active, Disabled, Loading
- **Icons:** Can be on left or right of text

#### Form Inputs
- **Style:** Subtle border (1px gray), rounded corners (4-8px)
- **Focus:** Blue ring on focus
- **States:** Default, Hover, Focus, Error, Disabled
- **Labels:** Above inputs, required indicator (*)

#### Cards
- **Background:** White
- **Border:** Optional 1px light gray
- **Shadow:** Subtle (0 1px 2px rgba)
- **Padding:** 16-24px
- **Border Radius:** 8px

---

## Interaction & Behavior

### Animations
- Page transitions: Fade in 200ms
- Hover effects: 150ms ease-out
- Loading states: Smooth pulse animation
- Toast notifications: Slide in from top-right

### Responsive Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

### Accessibility
- Color contrast ratio: AA standard (4.5:1 minimum)
- Focus states: Clear blue ring
- Alt text: All images have descriptive alt text
- Keyboard navigation: All interactive elements reachable via keyboard
- ARIA labels: Use for icons and hidden context

### Mobile-First Design
- Base styles for mobile
- Progressive enhancement with tablet/desktop breakpoints
- Touch targets: Minimum 44px
- Gestures: Swipe for image carousel (optional)

---

## Visual Elements

### Icons
- Source: Lucide React
- Size: 16px (small), 20px (medium), 24px (large)
- Color: Inherit from text color or primary
- Stroke width: 2px

### Images
- Product images: Maintain aspect ratio
- Hero section: High-quality marketplace/business imagery
- Illustrations: Clean, minimal style
- Optimization: Use Next.js Image component

### Badges
- Small pill-shaped elements
- Text: 12px, semibold
- Padding: 4px 8px
- Variants: Default (primary), Secondary, Success, Warning, Destructive

### Loading States
- Skeleton screens for product grids
- Pulse animation for content placeholders
- Loading spinners for async operations

---

## Key UX Principles

1. **Trust & Professionalism:** Use established marketplace patterns, clear security indicators
2. **Clarity:** Clear hierarchy, obvious CTAs, concise copy
3. **Efficiency:** Fast navigation, minimal clicks to purchase
4. **Accessibility:** Inclusive design for all users
5. **Consistency:** Uniform component library, predictable behavior
6. **Performance:** Optimized images, lazy loading, efficient rendering

---

## SEO & Performance

- Semantic HTML (main, header, nav, section, article)
- Meta tags for all pages
- Open Graph tags for social sharing
- Mobile-responsive design
- Fast load times (optimize images, code splitting)
- Proper heading hierarchy
- Descriptive URLs and page titles

---

## Success Criteria

- Clean, professional marketplace aesthetic
- Intuitive navigation for buyers and sellers
- Fast product discovery with powerful filtering
- Trust-building elements (ratings, seller info, security badges)
- Mobile-responsive at all breakpoints
- Accessible to all users
- Fast page load times
- Clear conversion paths (browse → view → purchase)
