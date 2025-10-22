// Authentication context and hooks for JWT-based auth system

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginForm, RegisterForm } from './types'
import { authApi, apiUtils } from './api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginForm) => Promise<void>
  register: (data: RegisterForm) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Check for existing token on mount
  useEffect(() => {
    const token = apiUtils.getAuthToken()
    if (token) {
      refreshUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const refreshUser = async () => {
    try {
      const response = await authApi.me()
      if (response.success) {
        setUser(response.data)
      } else {
        // Token is invalid, remove it
        apiUtils.removeAuthToken()
        setUser(null)
      }
    } catch (error) {
      // Token is invalid or expired
      apiUtils.removeAuthToken()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginForm) => {
    try {
      const response = await authApi.login(data)
      if (response.success) {
        apiUtils.setAuthToken(response.data.token)
        setUser(response.data.user)
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterForm) => {
    try {
      const response = await authApi.register(data)
      if (response.success) {
        apiUtils.setAuthToken(response.data.token)
        setUser(response.data.user)
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      apiUtils.removeAuthToken()
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
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
  requiredRole?: 'admin' | 'seller' | 'buyer'
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

    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
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
  allowedRoles: ('admin' | 'seller' | 'buyer')[]
  fallback?: React.ReactNode
}) {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || null
  }

  return <>{children}</>
}
