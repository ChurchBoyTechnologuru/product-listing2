# Firebase Authentication - Complete Reference

## Overview

This application now uses **Firebase Authentication** for all authentication operations while maintaining **Supabase PostgreSQL** as the database for user data.

## Quick Start

```typescript
import { useAuth } from '@/lib/auth'

function MyComponent() {
  const { user, login, register, loginWithGoogle, logout, resetPassword } = useAuth()
  
  // All authentication is handled by Firebase
  // User data is automatically synced to Supabase database
}
```

## Authentication Methods

### Email/Password Registration

```typescript
await register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePassword123!'
})
```

**What happens:**
1. User created in Firebase Auth
2. Display name set in Firebase profile
3. User record automatically created in Supabase database
4. User logged in automatically

### Email/Password Login

```typescript
await login({
  email: 'john@example.com',
  password: 'SecurePassword123!'
})
```

**What happens:**
1. Firebase authenticates the user
2. User data synced from Supabase database
3. Session created and persisted

### Google OAuth

```typescript
await loginWithGoogle()
```

**What happens:**
1. Google popup opens for account selection
2. Firebase handles OAuth flow
3. User data extracted from Google profile
4. User created/updated in Supabase database
5. Session created

### Logout

```typescript
await logout()
```

**What happens:**
1. Firebase session cleared
2. Local user state cleared
3. User redirected (handled by app)

### Password Reset

```typescript
// Send reset email
await resetPassword('john@example.com')

// User clicks link in email and is redirected to Firebase's password reset page
// After reset, user can login with new password
```

## User Data Flow

```
Firebase Auth → onAuthStateChanged → syncUserToDatabase → Supabase DB → Local State
```

**Data Synced:**
- Email (from Firebase)
- Name (from Firebase displayName)
- Avatar (from Firebase photoURL)
- Email Verified (from Firebase)
- Phone (custom field, stored in database)
- Role (custom field, stored in database)

## Session Management

- **Persistence:** Firebase handles session persistence automatically
- **Auto-login:** User stays logged in across browser sessions
- **Token refresh:** Firebase handles token refresh automatically
- **State sync:** `onAuthStateChanged` keeps app in sync with Firebase

## Error Handling

### Login Errors

| Firebase Error | User-Friendly Message |
|----------------|----------------------|
| `auth/user-not-found` | No account found with this email |
| `auth/wrong-password` | Incorrect password |
| `auth/invalid-email` | Invalid email address |
| `auth/user-disabled` | This account has been disabled |
| `auth/too-many-requests` | Too many failed attempts. Try again later |

### Registration Errors

| Firebase Error | User-Friendly Message |
|----------------|----------------------|
| `auth/email-already-in-use` | An account with this email already exists |
| `auth/invalid-email` | Invalid email address |
| `auth/weak-password` | Password too weak. Use at least 6 characters |
| `auth/operation-not-allowed` | Email/password accounts not enabled |

### Google OAuth Errors

| Firebase Error | User-Friendly Message |
|----------------|----------------------|
| `auth/popup-closed-by-user` | Sign-in cancelled |
| `auth/popup-blocked` | Popup blocked. Please allow popups |
| `auth/cancelled-popup-request` | Sign-in cancelled |

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
    <RoleGate allowedRoles={['ADMIN', 'SELLER']}>
      <div>Only admins and sellers can see this</div>
    </RoleGate>
  )
}
```

## Profile Updates

```typescript
await updateProfile({
  name: 'Jane Doe',
  phone: '+1234567890',
  avatar: 'https://example.com/avatar.jpg'
})
```

**What happens:**
1. Firebase profile updated (name, avatar)
2. Supabase database updated (all fields)
3. Local state updated

## Environment Variables

Required in `.env.local`:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"

# Supabase Configuration (for database only)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

## Firebase Console Setup

### Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **"Email/Password"**
5. Toggle **"Enable"**
6. Click **"Save"**

### Enable Google Sign-In

1. In **Authentication** → **Sign-in method**
2. Click on **"Google"**
3. Toggle **"Enable"**
4. Enter support email
5. Click **"Save"**

### Configure Authorized Domains

1. In **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - Your production domain

## Database Schema

Users are stored in Supabase `users` table:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  password VARCHAR NOT NULL, -- 'firebase-managed' for Firebase users
  avatar VARCHAR,
  phone VARCHAR,
  role VARCHAR DEFAULT 'BUYER', -- 'BUYER', 'SELLER', or 'ADMIN'
  isEmailVerified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Migration from Supabase Auth

### For Existing Users

Users with Supabase Auth accounts need to:
1. Click **"Forgot Password"** on login page
2. Enter their email
3. Check email for Firebase password reset link
4. Set new password
5. Login with new password

### Why Migration is Needed

- Firebase and Supabase use different password hashing algorithms
- Passwords cannot be directly migrated
- User data (email, name, etc.) remains unchanged in database
- Only authentication mechanism changes

## Troubleshooting

### "Missing Firebase configuration"

**Cause:** Environment variables not set or dev server not restarted

**Solution:**
1. Verify all `NEXT_PUBLIC_FIREBASE_*` variables in `.env.local`
2. Restart dev server: `npm run dev`

### "Email already in use"

**Cause:** User already registered in Firebase

**Solution:**
1. Use "Forgot Password" to reset password
2. Or login with existing credentials

### "Popup blocked"

**Cause:** Browser blocking Google OAuth popup

**Solution:**
1. Allow popups for your domain
2. Check browser address bar for popup blocker icon

### User not in database

**Cause:** Database sync failed or RLS policies blocking insert

**Solution:**
1. Check browser console for errors
2. Verify Supabase RLS policies allow inserts
3. Check Supabase credentials in `.env.local`

## Security Notes

✅ **Firebase API keys are safe to expose** - They're restricted by domain  
✅ **All `NEXT_PUBLIC_*` variables are client-side** - This is normal  
✅ **Passwords stored as 'firebase-managed'** - Actual auth handled by Firebase  
✅ **Session tokens auto-refresh** - Handled by Firebase SDK  
✅ **Database access controlled by RLS** - Supabase Row Level Security

## Key Differences from Supabase Auth

| Feature | Supabase Auth (Old) | Firebase Auth (New) |
|---------|-------------------|-------------------|
| Sign In | `supabase.auth.signInWithPassword()` | `signInWithEmailAndPassword()` |
| Sign Up | `supabase.auth.signUp()` | `createUserWithEmailAndPassword()` |
| OAuth | `supabase.auth.signInWithOAuth()` | `signInWithPopup()` |
| Sign Out | `supabase.auth.signOut()` | Firebase `signOut()` |
| State Listener | `supabase.auth.onAuthStateChange()` | `onAuthStateChanged()` |
| Password Reset | `supabase.auth.resetPasswordForEmail()` | `sendPasswordResetEmail()` |
| Session | Supabase session | Firebase user token |

## Resources

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Setup Guide](./FIREBASE_SETUP.md)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
