# Supabase Authentication Quick Reference

## Import

```typescript
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
```

## Using the Auth Hook (Recommended)

```typescript
function MyComponent() {
  const { user, isLoading, isAuthenticated, login, register, loginWithGoogle, logout } = useAuth()

  // Check if user is authenticated
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please log in</div>

  // User is authenticated
  return <div>Welcome {user?.name}</div>
}
```

## Auth Methods

### Email/Password Registration

```typescript
// Using the hook
await register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePassword123!'
})

// Direct Supabase call
const { data, error } = await supabase.auth.signUp({
  email: 'john@example.com',
  password: 'SecurePassword123!',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
})
```

### Email/Password Login

```typescript
// Using the hook
await login({
  email: 'john@example.com',
  password: 'SecurePassword123!'
})

// Direct Supabase call
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'john@example.com',
  password: 'SecurePassword123!'
})
```

### Google OAuth

```typescript
// Using the hook
await loginWithGoogle()

// Direct Supabase call
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})
```

### Logout

```typescript
// Using the hook
await logout()

// Direct Supabase call
await supabase.auth.signOut()
```

### Get Current User

```typescript
// From the hook
const { user } = useAuth()

// Direct Supabase call
const { data: { user } } = await supabase.auth.getUser()
```

### Get Current Session

```typescript
const { data: { session } } = await supabase.auth.getSession()
```

### Password Reset

```typescript
// Send reset email
const { error } = await supabase.auth.resetPasswordForEmail(
  'john@example.com',
  {
    redirectTo: `${window.location.origin}/auth/reset-password`
  }
)

// Update password (after clicking reset link)
const { error } = await supabase.auth.updateUser({
  password: 'NewSecurePassword123!'
})
```

### Update User Metadata

```typescript
const { data, error } = await supabase.auth.updateUser({
  data: {
    full_name: 'Jane Doe',
    avatar_url: 'https://example.com/avatar.jpg'
  }
})
```

## Auth State Listener

```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('Auth event:', event)
      console.log('Session:', session)
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in!')
      }
      if (event === 'SIGNED_OUT') {
        console.log('User signed out!')
      }
    }
  )

  return () => {
    subscription.unsubscribe()
  }
}, [])
```

## Protected Routes

### Using withAuth HOC

```typescript
import { withAuth } from '@/lib/auth'

function DashboardPage() {
  return <div>Protected Dashboard</div>
}

// Protect the route
export default withAuth(DashboardPage)

// Protect with role requirement
export default withAuth(DashboardPage, 'SELLER')
```

### Using RoleGate Component

```typescript
import { RoleGate } from '@/lib/auth'

function MyComponent() {
  return (
    <div>
      <RoleGate allowedRoles={['ADMIN', 'SELLER']}>
        <div>Only admins and sellers can see this</div>
      </RoleGate>
      
      <RoleGate 
        allowedRoles={['ADMIN']} 
        fallback={<div>Access denied</div>}
      >
        <div>Admin only content</div>
      </RoleGate>
    </div>
  )
}
```

## User Object Structure

```typescript
// Supabase User (from supabase.auth.getUser())
{
  id: 'uuid',
  email: 'john@example.com',
  user_metadata: {
    full_name: 'John Doe',
    avatar_url: 'https://...'
  },
  created_at: '2024-01-01T00:00:00Z',
  // ... other Supabase fields
}

// Backend User (from useAuth hook)
{
  id: 'database-id',
  email: 'john@example.com',
  name: 'John Doe',
  avatar: 'https://...',
  role: 'BUYER' | 'SELLER' | 'ADMIN',
  isEmailVerified: true,
  // ... other database fields
}
```

## Common Patterns

### Check if User is Logged In

```typescript
const { isAuthenticated } = useAuth()

if (isAuthenticated) {
  // User is logged in
}
```

### Redirect After Login

```typescript
const router = useRouter()
const { login } = useAuth()

const handleLogin = async (data) => {
  await login(data)
  router.push('/dashboard')
}
```

### Handle Auth Errors

```typescript
const { login } = useAuth()

try {
  await login({ email, password })
} catch (error) {
  console.error('Login failed:', error.message)
  // Show error to user
}
```

### Refresh User Data

```typescript
const { refreshUser } = useAuth()

// After updating profile
await updateProfile(data)
await refreshUser() // Sync with backend
```

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
```

## Differences from Firebase

| Feature | Firebase | Supabase |
|---------|----------|----------|
| Sign In | `signInWithEmailAndPassword()` | `signInWithPassword()` |
| Sign Up | `createUserWithEmailAndPassword()` | `signUp()` |
| OAuth | `signInWithPopup()` | `signInWithOAuth()` |
| Sign Out | `signOut()` | `signOut()` |
| State Listener | `onAuthStateChanged()` | `onAuthStateChange()` |
| User Object | `firebaseUser.uid` | `supabaseUser.id` |
| Display Name | `firebaseUser.displayName` | `user_metadata.full_name` |
| Photo URL | `firebaseUser.photoURL` | `user_metadata.avatar_url` |

## Tips

1. **Always use the `useAuth` hook** in components for consistent state management
2. **Handle loading states** - check `isLoading` before rendering
3. **Error handling** - wrap auth calls in try/catch blocks
4. **Session persistence** - enabled by default, no extra config needed
5. **Token refresh** - handled automatically by Supabase
6. **Backend sync** - happens automatically via `onAuthStateChange` listener

## Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` has both required variables
- Restart dev server after adding variables

### User not syncing to database
- Check browser console for sync errors
- Verify backend API is running
- Check JWT_SECRET is set

### Session not persisting
- Clear browser localStorage
- Check `persistSession: true` in `lib/supabase.ts`

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/auth-signup)
- [Setup Guide](./SUPABASE_SETUP.md)
