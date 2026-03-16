
// Standalone custom authentication context (no external dependencies)

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginForm, RegisterForm } from './types'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginForm) => Promise<void>
  register: (data: RegisterForm) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check session from backend
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          const { user: sessionUser } = await response.json()
          if (sessionUser) {
            console.log('[Auth] Session found for:', sessionUser.email)
            setUser(sessionUser)
          }
        }
      } catch (error) {
        console.error('[Auth] Init error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (data: LoginForm) => {
    try {
      console.log('[Auth] Attempting login for:', data.email)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }

      const { user: loginUser } = await response.json()
      setUser(loginUser)
      console.log('[Auth] Login successful:', loginUser.email)
      router.push('/dashboard')
    } catch (error: any) {
      console.error('[Auth] Login error:', error)
      throw error
    }
  }

  const register = async (data: RegisterForm) => {
    try {
      console.log('[Auth] Starting registration for:', data.email)

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }

      console.log('[Auth] Registration successful')
      // Auto-login after registration
      await login(data)
    } catch (error: any) {
      console.error('[Auth] Registration error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log('[Auth] Logging out...')

      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      setUser(null)
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

      if (!user) {
        throw new Error('No user logged in')
      }

      // Update user state locally
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

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
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
