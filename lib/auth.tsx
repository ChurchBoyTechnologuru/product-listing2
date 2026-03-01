
// Authentication context and hooks for Supabase Auth

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginForm, RegisterForm } from './types'
import { createClient } from './supabase/client'
import { useRouter } from 'next/navigation'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginForm) => Promise<void>
  register: (data: RegisterForm) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const isAuthenticated = !!session?.user

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get the current session
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession()

        setSession(initialSession)

        if (initialSession?.user) {
          console.log('[Auth] Session found for:', initialSession.user.email)
          // You can sync user metadata here if needed
          const userData: User = {
            id: initialSession.user.id,
            email: initialSession.user.email || '',
            name: initialSession.user.user_metadata?.name || initialSession.user.email?.split('@')[0] || '',
            avatar: initialSession.user.user_metadata?.avatar || null,
            phone: initialSession.user.user_metadata?.phone || null,
            role: initialSession.user.user_metadata?.role || 'BUYER',
            isEmailVerified: initialSession.user.email_confirmed_at !== null,
          }
          setUser(userData)
        }
      } catch (error) {
        console.error('[Auth] Init error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, newSession: Session | null) => {
      console.log('[Auth] Auth state changed:', _event)
      setSession(newSession)

      if (newSession?.user) {
        const userData: User = {
          id: newSession.user.id,
          email: newSession.user.email || '',
          name: newSession.user.user_metadata?.name || newSession.user.email?.split('@')[0] || '',
          avatar: newSession.user.user_metadata?.avatar || null,
          phone: newSession.user.user_metadata?.phone || null,
          role: newSession.user.user_metadata?.role || 'BUYER',
          isEmailVerified: newSession.user.email_confirmed_at !== null,
        }
        setUser(userData)
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  const login = async (data: LoginForm) => {
    try {
      console.log('[Auth] Attempting login for:', data.email)

      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      console.log('[Auth] Login successful:', authData.user?.email)
    } catch (error: any) {
      console.error('[Auth] Login error:', error)

      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password')
      } else if (error.message?.includes('Email not confirmed')) {
        throw new Error('Please confirm your email address before logging in')
      }

      throw new Error(error.message || 'Login failed')
    }
  }

  const register = async (data: RegisterForm) => {
    try {
      console.log('[Auth] Starting registration for:', data.email)

      const { error, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: 'BUYER',
          },
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        },
      })

      if (error) throw error

      console.log('[Auth] Registration successful, confirmation email sent')
    } catch (error: any) {
      console.error('[Auth] Registration error:', error)

      if (error.message?.includes('already registered')) {
        throw new Error('An account with this email already exists')
      } else if (error.message?.includes('password')) {
        throw new Error('Password is too weak. Use at least 8 characters')
      }

      throw new Error(error.message || 'Registration failed')
    }
  }

  const logout = async () => {
    try {
      console.log('[Auth] Logging out...')
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setSession(null)
      console.log('[Auth] Logout successful')
      router.push('/auth/login')
    } catch (error) {
      console.error('[Auth] Logout error:', error)
      throw error
    }
  }

  const updateProfile = async (data: { name?: string; phone?: string; avatar?: string }) => {
    try {
      console.log('[Auth] Updating profile with:', data)

      const { error } = await supabase.auth.updateUser({
        data: {
          name: data.name,
          phone: data.phone,
          avatar: data.avatar,
        },
      })

      if (error) throw error

      // Update local user state
      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              name: data.name ?? prevUser.name,
              phone: data.phone ?? prevUser.phone,
              avatar: data.avatar ?? prevUser.avatar,
            }
          : null
      )

      console.log('[Auth] Profile updated successfully')
    } catch (error: any) {
      console.error('[Auth] Profile update error:', error)
      throw new Error(error.message || 'Failed to update profile')
    }
  }

  const resetPassword = async (email: string) => {
    try {
      console.log('[Auth] Sending password reset email to:', email)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          typeof window !== 'undefined'
            ? `${window.location.origin}/auth/reset-password`
            : undefined,
      })

      if (error) throw error

      console.log('[Auth] Password reset email sent')
    } catch (error: any) {
      console.error('[Auth] Password reset error:', error)
      throw new Error(error.message || 'Failed to send password reset email')
    }
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
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
