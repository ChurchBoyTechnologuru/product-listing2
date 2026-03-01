# Supabase Library Reference

Quick reference for using Supabase in your application.

## Client Exports

### Browser Client
```tsx
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: { name: 'John Doe' }
  }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Sign out
await supabase.auth.signOut()

// Update user
await supabase.auth.updateUser({
  data: { name: 'Jane Doe' }
})
```

### Server Client
```tsx
import { createClient } from '@/lib/supabase/server'

const supabase = createClient()

// Get user in server component
const { data: { user } } = await supabase.auth.getUser()

// Query database
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()

// Insert data
const { data, error } = await supabase
  .from('profiles')
  .insert({ id: user.id, name: 'Test' })
  .select()

// Update data
const { data, error } = await supabase
  .from('profiles')
  .update({ name: 'Updated' })
  .eq('id', user.id)
  .select()

// Delete data
const { error } = await supabase
  .from('profiles')
  .delete()
  .eq('id', user.id)
```

## Auth Hook

```tsx
import { useAuth } from '@/lib/auth'

function MyComponent() {
  const {
    user,              // Current user object
    session,           // Current session
    isLoading,         // Loading state
    isAuthenticated,   // Boolean check
    login,             // Function to login
    register,          // Function to register
    logout,            // Function to logout
    updateProfile,     // Function to update profile
    resetPassword      // Function to reset password
  } = useAuth()

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isAuthenticated && <p>Welcome, {user?.name}!</p>}
      {!isAuthenticated && <p>Please log in</p>}
    </div>
  )
}
```

## Storage Functions

```tsx
import {
  uploadFile,
  deleteFile,
  getPublicUrl,
  uploadAvatar,
  uploadProductImage,
  deleteAvatar,
  deleteProductImage
} from '@/lib/supabase/storage'

// Upload custom file
const { path, url } = await uploadFile('avatars', file, 'path-prefix')

// Delete file
await deleteFile('avatars', 'path-to-file')

// Get public URL
const url = getPublicUrl('avatars', 'path-to-file')

// Upload avatar (helper)
const avatarUrl = await uploadAvatar(file, userId)

// Upload product image (helper)
const imageUrl = await uploadProductImage(file, productId)

// Delete avatar
await deleteAvatar('path-to-avatar')

// Delete product image
await deleteProductImage('path-to-image')
```

## Protected Routes

```tsx
import { withAuth } from '@/lib/auth'

// Protect with authentication
function Dashboard() {
  return <div>Dashboard</div>
}

export default withAuth(Dashboard)

// Protect with role-based access
export default withAuth(Dashboard, 'SELLER')
// Accepts: 'ADMIN' | 'SELLER' | 'BUYER'
```

## Role-Based Access

```tsx
import { RoleGate } from '@/lib/auth'

function AdminPanel() {
  return (
    <RoleGate
      allowedRoles={['ADMIN']}
      fallback={<p>Access denied</p>}
    >
      <div>Admin content</div>
    </RoleGate>
  )
}
```

## Database Tables

### profiles
```
id (UUID)           - Primary key, linked to auth.users
email (TEXT)        - User email
name (TEXT)         - Display name
phone (TEXT)        - Phone number
avatar_url (TEXT)   - Avatar image URL
role (TEXT)         - ADMIN | SELLER | BUYER
created_at (TIMESTAMP) - Account creation time
updated_at (TIMESTAMP) - Last update time
```

### Storage Buckets
```
avatars/            - User profile pictures
  {user_id}/avatar-{timestamp}.ext

products/           - Product images
  {product_id}/image-{timestamp}.ext
```

## Common Patterns

### Redirect Authenticated Users
```tsx
'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading) return <div>Loading...</div>
  if (user) return null

  return <LoginForm />
}
```

### Fetch User-Specific Data
```tsx
'use client'

import { useAuth } from '@/lib/auth'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function UserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
    }

    fetchProfile()
  }, [user, supabase])

  return <div>{profile?.name}</div>
}
```

### Subscribe to Real-time Updates
```tsx
'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function RealtimeUpdates() {
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Change received!', payload)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  return <div>Listening for updates...</div>
}
```

### Handle Auth Errors
```tsx
import { useAuth } from '@/lib/auth'
import { useState } from 'react'

export function LoginForm() {
  const { login } = useAuth()
  const [error, setError] = useState('')

  const handleLogin = async (email: string, password: string) => {
    try {
      setError('')
      await login({ email, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      {/* Login form */}
    </div>
  )
}
```

## Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

Server-only:
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for privileged operations
- `SUPABASE_JWT_SECRET` - JWT secret for token verification

## Troubleshooting

**Session lost on page refresh**
- Check middleware.ts is configured
- Verify cookies are enabled
- Clear browser cache

**File upload fails**
- Verify storage buckets exist
- Check RLS policies
- Ensure user is authenticated

**RLS policy errors**
- Verify user is authenticated
- Check policy conditions
- Use auth.uid() correctly

**Email not received**
- Check email configuration
- Verify SMTP settings
- Check spam folder

## Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
