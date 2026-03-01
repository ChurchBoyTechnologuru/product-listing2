# Supabase Auth & Storage Configuration

Your product listing application is now configured with **Supabase** for authentication and file storage. This guide explains the setup and how to use it.

## ✅ What's Been Set Up

### Core Configuration
- **Authentication**: Email/password authentication via Supabase Auth
- **Storage**: Two public buckets for avatars and product images
- **Middleware**: Automatic session management and token refresh
- **Client Integration**: Supabase client for both browser and server operations
- **User Profiles**: Profiles table with automatic creation on sign-up

### Files Created/Modified
```
lib/supabase/
  ├── client.ts       # Browser client initialization
  ├── server.ts       # Server client initialization
  ├── proxy.ts        # Middleware proxy for token refresh
  └── storage.ts      # File upload/download utilities

lib/auth.tsx           # Updated to use Supabase Auth

middleware.ts          # Session management & token refresh

app/auth/
  ├── callback/route.ts      # Email confirmation callback
  └── auth-code-error/page.tsx  # Error handling page

scripts/
  ├── 001_create_profiles.sql  # Database schema
  └── 002_setup_storage.sql    # Storage policies
```

## Environment Variables

All required environment variables are automatically configured via Vercel integration:

```
NEXT_PUBLIC_SUPABASE_URL       # Public Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Public anonymous key
SUPABASE_SERVICE_ROLE_KEY      # Private service role key
SUPABASE_JWT_SECRET            # JWT secret for verification
POSTGRES_URL                   # Database connection string
```

## Database Setup

### Running Migrations

Execute the SQL scripts in your Supabase SQL Editor:

1. **Create Profiles Table** (`scripts/001_create_profiles.sql`):
   - Creates `profiles` table linked to `auth.users`
   - Enables Row-Level Security (RLS)
   - Creates trigger to auto-create profiles on sign-up
   - Creates storage buckets (`avatars` and `products`)

2. **Setup Storage Policies** (`scripts/002_setup_storage.sql`):
   - Configures read/write permissions for storage buckets
   - Public read access to both buckets
   - Authenticated users can upload
   - Users can only delete/update their own files

**Steps to run migrations:**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy content from `scripts/001_create_profiles.sql`
5. Execute the query
6. Repeat for `scripts/002_setup_storage.sql`

## Authentication Flow

### Sign Up
```tsx
import { useAuth } from '@/lib/auth'

function SignUpForm() {
  const { register } = useAuth()
  
  const handleSubmit = async (email, password, name) => {
    await register({ email, password, name })
    // User receives confirmation email
  }
}
```

**Process:**
1. User enters email, password, and name
2. Account created in Supabase Auth
3. Profile automatically created via trigger
4. Confirmation email sent to user
5. User must confirm email to activate account

### Login
```tsx
import { useAuth } from '@/lib/auth'

function LoginForm() {
  const { login } = useAuth()
  
  const handleSubmit = async (email, password) => {
    await login({ email, password })
    // User is authenticated
  }
}
```

**Process:**
1. User enters credentials
2. Supabase verifies and creates session
3. Session stored in HTTP-only cookie (via middleware)
4. User is authenticated throughout the app

### Protected Routes

Protect pages that require authentication:

```tsx
import { withAuth } from '@/lib/auth'

function Dashboard() {
  return <div>Welcome!</div>
}

export default withAuth(Dashboard)

// For role-based protection:
export default withAuth(Dashboard, 'SELLER')
```

### Using Auth in Components

**Client Components:**
```tsx
'use client'

import { useAuth } from '@/lib/auth'

export function UserMenu() {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>Sign in to continue</div>

  return (
    <div>
      <p>Hello, {user.name}</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}
```

**Server Components:**
```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return <div>Welcome, {user.email}!</div>
}
```

## File Storage

### Upload Avatar
```tsx
import { uploadAvatar } from '@/lib/supabase/storage'
import { useAuth } from '@/lib/auth'

export function AvatarUpload() {
  const { user } = useAuth()

  const handleFileChange = async (file: File) => {
    if (!user) return
    const avatarUrl = await uploadAvatar(file, user.id)
    // avatarUrl is the public URL of the uploaded file
  }

  return <input type="file" onChange={(e) => handleFileChange(e.target.files?.[0]!)} />
}
```

### Upload Product Image
```tsx
import { uploadProductImage } from '@/lib/supabase/storage'

export function ProductImageUpload({ productId }: { productId: string }) {
  const handleFileChange = async (file: File) => {
    const imageUrl = await uploadProductImage(file, productId)
    // imageUrl is the public URL of the uploaded file
  }

  return <input type="file" onChange={(e) => handleFileChange(e.target.files?.[0]!)} />
}
```

### Get Public File URLs

All files in public buckets are accessible via:
```
https://<supabase-url>/storage/v1/object/public/avatars/<path>
https://<supabase-url>/storage/v1/object/public/products/<path>
```

Or use the `getPublicUrl` utility:
```tsx
import { getPublicUrl } from '@/lib/supabase/storage'

const url = getPublicUrl('avatars', 'user-123/avatar-1234567890.jpg')
```

## User Profiles

User metadata is stored in `auth.users.raw_user_meta_data` and automatically synced to the `profiles` table:

### Fields
- `id` - UUID (from auth.users)
- `email` - User email
- `name` - Display name
- `phone` - Phone number
- `avatar_url` - Avatar image URL
- `role` - ADMIN, SELLER, or BUYER
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Update User Profile
```tsx
import { useAuth } from '@/lib/auth'

export function EditProfile() {
  const { updateProfile } = useAuth()

  const handleUpdate = async () => {
    await updateProfile({
      name: 'John Doe',
      phone: '+1234567890',
      avatar: 'https://...'
    })
  }

  return <button onClick={handleUpdate}>Update</button>
}
```

## Password Reset

```tsx
import { useAuth } from '@/lib/auth'

export function ForgotPassword() {
  const { resetPassword } = useAuth()

  const handleReset = async (email: string) => {
    await resetPassword(email)
    // User receives password reset email
  }

  return <button onClick={() => handleReset('user@example.com')}>Reset</button>
}
```

The reset link redirects to `/auth/reset-password` where you can implement the password change form.

## Row-Level Security (RLS)

All data is protected with RLS policies:

### Profiles Table
- Users can view their own profile
- Users can insert/update/delete only their own profile
- Admins can view all profiles

### Storage Buckets
- **avatars bucket**: Publicly readable, authenticated users can upload, users can only delete their own
- **products bucket**: Publicly readable, authenticated users can upload, users can only delete their own

## Configuration in Supabase Dashboard

### Email Configuration
1. Go to **Authentication** → **Email Templates**
2. Customize:
   - Confirmation email
   - Password reset email
   - Email change confirmation

### Enable Social Auth (Optional)
1. Go to **Authentication** → **Providers**
2. Enable Google/GitHub/etc.
3. Add OAuth credentials
4. Add redirect URLs in **URL Configuration**

### Update Redirect URLs
1. Go to **Authentication** → **URL Configuration**
2. Add your domain redirect URLs:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

## Testing

### Test Sign Up
1. Navigate to `/auth/sign-up`
2. Fill in the form with test data
3. Check email for confirmation link
4. Click link to activate account

### Test Login
1. Navigate to `/auth/login`
2. Use your confirmed email and password
3. You should be redirected to dashboard

### Test File Upload
1. Update your profile avatar
2. Upload a product image
3. Verify files appear in Supabase Storage dashboard

## Common Tasks

### Check if User is Authenticated
```tsx
const { user, isAuthenticated } = useAuth()
if (isAuthenticated) {
  // User is logged in
}
```

### Get Current User's Data
```tsx
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
```

### Query User-Specific Data
```tsx
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()
```

### Subscribe to Auth Changes
```tsx
const supabase = createClient()

const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log('Auth event:', event)
    console.log('Session:', session)
  }
)

// Remember to unsubscribe
subscription?.unsubscribe()
```

## Troubleshooting

### Email Not Sent
- Check **Authentication** → **Email Templates** settings
- Verify SMTP configuration in Supabase dashboard
- Check spam folder

### Session Lost on Refresh
- Verify middleware.ts is properly configured
- Check browser cookies are enabled
- Clear browser cache and localStorage

### File Upload Fails
- Ensure storage buckets exist (`avatars`, `products`)
- Verify RLS policies allow upload
- Check file size limits

### RLS Policy Errors
- Ensure user is authenticated
- Verify policy conditions match your user's data
- Check auth.uid() is set correctly

### Email Confirmation Redirect Fails
- Verify `/auth/callback` route exists
- Check redirect URLs in **URL Configuration**
- Ensure code exchange is implemented in callback route

## Next Steps

1. ✅ Set up environment variables (done via Vercel)
2. ✅ Create Supabase client files (done)
3. ✅ Configure authentication (done)
4. ⏳ Run database migrations (run scripts in Supabase SQL Editor)
5. ⏳ Configure email provider (set up in Supabase dashboard)
6. ⏳ Test authentication flow (sign up and login)
7. ⏳ Deploy to production (update redirect URLs)

## References

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
