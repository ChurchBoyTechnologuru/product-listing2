
// Authentication context and hooks for Firebase Auth + Supabase Database

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginForm, RegisterForm } from './types'
import { supabase } from './supabase'
import type { User as FirebaseUser } from 'firebase/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginForm) => Promise<void>
  register: (data: RegisterForm) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    // Initialize Firebase auth listener
    const initAuth = async () => {
      const { auth } = await import('./firebase')
      const { onAuthStateChanged } = await import('firebase/auth')

      // Listen for Firebase auth state changes
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          console.log('[Auth] Firebase user detected:', firebaseUser.email)
          await syncUserToDatabase(firebaseUser)
        } else {
          console.log('[Auth] No Firebase user, clearing state')
          setUser(null)
          setIsLoading(false)
        }
      })

      return unsubscribe
    }

    initAuth()
  }, [])

  // Sync Firebase user to Supabase database
  const syncUserToDatabase = async (firebaseUser: FirebaseUser) => {
    try {
      console.log('[Auth] Syncing user to database:', firebaseUser.email)

      // Query user from Supabase database
      const { data: dbUser, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('email', firebaseUser.email)
        .single()

      // If user doesn't exist, create them
      if (queryError && queryError.code === 'PGRST116') {
        console.log('[Auth] User not found in DB, creating new user')

        const newUserData = {
          email: firebaseUser.email!,
          name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
          password: 'firebase-managed', // Placeholder, actual auth is in Firebase
          avatar: firebaseUser.photoURL || null,
          phone: firebaseUser.phoneNumber || null,
          role: 'BUYER',
          isEmailVerified: firebaseUser.emailVerified,
        }

        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert(newUserData)
          .select()
          .single()

        if (createError) {
          console.error('[Auth] Error creating user:', createError)
          throw createError
        }

        console.log('[Auth] New user created successfully')
        setUser(newUser as User)
      } else if (queryError) {
        console.error('[Auth] Error querying user:', queryError)
        throw queryError
      } else {
        console.log('[Auth] User found in DB, checking for updates')

        // Check if we need to update user data from Firebase
        const updates: any = {}

        if (firebaseUser.displayName && firebaseUser.displayName !== dbUser.name) {
          updates.name = firebaseUser.displayName
        }
        if (firebaseUser.photoURL !== undefined && firebaseUser.photoURL !== dbUser.avatar) {
          updates.avatar = firebaseUser.photoURL
        }
        if (firebaseUser.emailVerified !== dbUser.isEmailVerified) {
          updates.isEmailVerified = firebaseUser.emailVerified
        }

        // Update if there are changes
        if (Object.keys(updates).length > 0) {
          console.log('[Auth] Updating user with Firebase data:', updates)
          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update(updates)
            .eq('email', firebaseUser.email)
            .select()
            .single()

          if (updateError) {
            console.error('[Auth] Error updating user:', updateError)
            setUser(dbUser as User)
          } else {
            setUser(updatedUser as User)
          }
        } else {
          setUser(dbUser as User)
        }
      }
    } catch (error) {
      console.error('[Auth] Sync error:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      const { auth } = await import('./firebase')
      const firebaseUser = auth.currentUser

      if (firebaseUser?.email) {
        // Query user directly from Supabase database
        const { data: dbUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', firebaseUser.email)
          .single()

        if (error) throw error
        setUser(dbUser as User)
      }
    } catch (error) {
      console.error('[Auth] Refresh error:', error)
    }
  }

  const login = async (data: LoginForm) => {
    try {
      console.log('[Auth] Attempting login for:', data.email)

      const { auth } = await import('./firebase')
      const { signInWithEmailAndPassword } = await import('firebase/auth')

      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
      console.log('[Auth] Firebase login successful:', userCredential.user.email)

      // User will be synced via onAuthStateChanged listener
    } catch (error: any) {
      console.error('[Auth] Login error:', error)

      // Handle Firebase-specific errors
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email')
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address')
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled')
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later')
      }

      throw new Error(error.message || 'Login failed')
    }
  }

  const register = async (data: RegisterForm) => {
    try {
      console.log('[Auth] Starting registration for:', data.email)

      const { auth } = await import('./firebase')
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      console.log('[Auth] Firebase user created:', userCredential.user.email)

      // Update Firebase profile with display name
      await updateProfile(userCredential.user, {
        displayName: data.name,
      })
      console.log('[Auth] Firebase profile updated with name')

      // User will be synced to database via onAuthStateChanged listener
      console.log('[Auth] Registration completed successfully')
    } catch (error: any) {
      console.error('[Auth] Registration error:', error)

      // Handle Firebase-specific errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address')
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters')
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password accounts are not enabled. Please contact support')
      }

      throw new Error(error.message || 'Registration failed')
    }
  }

  const loginWithGoogle = async () => {
    try {
      console.log('[Auth] Starting Google login with Firebase...')

      const { auth, googleProvider } = await import('./firebase')
      const { signInWithPopup } = await import('firebase/auth')

      // Sign in with Google using Firebase popup
      const result = await signInWithPopup(auth, googleProvider)
      console.log('[Auth] Firebase Google sign-in successful:', result.user.email)

      // User will be synced to database via onAuthStateChanged listener
      console.log('[Auth] Google login completed successfully')
    } catch (error: any) {
      console.error('[Auth] Google login error:', error)

      // Handle specific Firebase errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled')
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup blocked by browser. Please allow popups for this site.')
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in cancelled')
      } else if (error.message?.includes('Missing Firebase configuration')) {
        throw new Error('Google Sign-In is not configured. Please contact support.')
      }

      throw new Error(error.message || 'Google login failed')
    }
  }

  const logout = async () => {
    try {
      console.log('[Auth] Logging out...')
      const { auth } = await import('./firebase')
      const { signOut } = await import('firebase/auth')

      await signOut(auth)
      setUser(null)
      console.log('[Auth] Logout successful')
    } catch (error) {
      console.error('[Auth] Logout error:', error)
      throw error
    }
  }

  const updateProfile = async (data: { name?: string; phone?: string; avatar?: string }) => {
    try {
      console.log('[Auth] Updating profile with:', data)

      const { auth } = await import('./firebase')
      const { updateProfile: updateFirebaseProfile } = await import('firebase/auth')
      const firebaseUser = auth.currentUser

      if (!firebaseUser?.email) {
        throw new Error('No authenticated user')
      }

      // Update Firebase profile if name or avatar changed
      const firebaseUpdates: any = {}
      if (data.name !== undefined) firebaseUpdates.displayName = data.name
      if (data.avatar !== undefined) firebaseUpdates.photoURL = data.avatar

      if (Object.keys(firebaseUpdates).length > 0) {
        await updateFirebaseProfile(firebaseUser, firebaseUpdates)
        console.log('[Auth] Firebase profile updated')
      }

      // Update Supabase database
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update(data)
        .eq('email', firebaseUser.email)
        .select()
        .single()

      if (updateError) throw updateError

      // Update local user state
      setUser(updatedUser as User)
      console.log('[Auth] Profile updated successfully')
    } catch (error: any) {
      console.error('[Auth] Profile update error:', error)
      throw new Error(error.message || 'Failed to update profile')
    }
  }

  const resetPassword = async (email: string) => {
    try {
      console.log('[Auth] Sending password reset email to:', email)

      const { auth } = await import('./firebase')
      const { sendPasswordResetEmail } = await import('firebase/auth')

      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/auth/login`,
        handleCodeInApp: false,
      })

      console.log('[Auth] Password reset email sent')
    } catch (error: any) {
      console.error('[Auth] Password reset error:', error)

      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address')
      }

      throw new Error(error.message || 'Failed to send password reset email')
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshUser,
    updateProfile,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'ADMIN' | 'SELLER' | 'BUYER'
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground">
              Please log in to access this page.
            </p>
          </div>
        </div>
      )
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'ADMIN') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

// Role-based access control component
export function RoleGate({
  children,
  allowedRoles,
  fallback
}: {
  children: React.ReactNode
  allowedRoles: ('ADMIN' | 'SELLER' | 'BUYER')[]
  fallback?: React.ReactNode
}) {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || null
  }

  return <>{children}</>
}
