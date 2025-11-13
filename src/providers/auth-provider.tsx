"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/auth.service'
import { apiClient } from '@/lib/api-client'
import { logger } from '@/utils/logger'
import { toastService } from '@/providers/toast-provider'
import type { User, Tenant, Store } from '@/types/api'

interface AuthContextType {
  user: User | null
  tenant: Tenant | null
  store: Store | null
  tenantId: string | null
  storeId: string | null
  isSuperadmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  setTenantId: (tenantId: string) => void
  setStoreId: (storeId: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [tenantId, setTenantIdState] = useState<string | null>(null)
  const [storeId, setStoreIdState] = useState<string | null>(null)
  const [isSuperadmin, setIsSuperadmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        logger.info('Initializing auth context')

        // Check if user is already authenticated
        if (authService.isAuthenticated()) {
          logger.info('User is authenticated, refreshing user context')

          // Fetch additional user context from our API
          await refreshUser()
        } else {
          // No authenticated user, clear local state
          setUser(null)
          setTenant(null)
          setStore(null)
          setIsSuperadmin(false)
          logger.info('No authenticated user found')
        }
      } catch (error) {
        logger.error('Auth initialization failed', { error })
        toastService.error('Failed to initialize authentication', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const refreshUser = async (): Promise<void> => {
    try {
      logger.apiCall('GET', '/dashboard')
      const startTime = Date.now()

      const response = await apiClient.get<{
        success: boolean
        data: {
          user: User
          tenant: Tenant
          store: Store | null
          isSuperadmin: boolean
        }
        error?: string
      }>('/dashboard')

      const duration = Date.now() - startTime

      if (response.success && response.data) {
        logger.apiCall('GET', '/dashboard', 200, duration)

        const { user: userData, tenant: tenantData, store: storeData, isSuperadmin: superadminStatus } = response.data

        setUser(userData)
        setTenant(tenantData)
        setStore(storeData)
        setIsSuperadmin(superadminStatus)

        // Update API client with tenant/store context
        apiClient.setTenantId(userData.tenantId)
        if (userData.defaultStoreId) {
          apiClient.setStoreId(userData.defaultStoreId)
        }

        logger.authEvent('User context refreshed', {
          userId: userData.id,
          tenantId: userData.tenantId,
          storeId: userData.defaultStoreId,
          isSuperadmin: superadminStatus,
          duration
        })

        return
      }

      logger.apiCall('GET', '/dashboard', 400, duration, response.error)
      throw new Error(response.error || 'Failed to fetch user context')
    } catch (error: any) {
      logger.error('Failed to refresh user context', { error: error.message })
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      logger.userAction('Login initiated', { email })

      const loginResponse = await authService.login({ email, password })

      // Set user data from login response
      setUser(loginResponse.user)
      setTenant(null) // Will be fetched by refreshUser
      setStore(null) // Will be fetched by refreshUser
      setIsSuperadmin(loginResponse.user.roles?.includes('superadmin') || false)

      // Update API client with tenant/store context
      apiClient.setTenantId(loginResponse.user.tenantId)
      if (loginResponse.user.defaultStoreId) {
        apiClient.setStoreId(loginResponse.user.defaultStoreId)
      }

      // Refresh user context to get tenant and store data
      await refreshUser()

      logger.authEvent('Login completed', { email, userId: loginResponse.user.id })

    } catch (error: any) {
      logger.error('Login failed', { email, error: error.message })
      throw error
    }
  }

  const setTenantId = (newTenantId: string) => {
    setTenantIdState(newTenantId)
    apiClient.setTenantId(newTenantId)
    logger.userAction('Tenant ID updated', { tenantId: newTenantId })
  }

  const setStoreId = (newStoreId: string | null) => {
    setStoreIdState(newStoreId)
    apiClient.setStoreId(newStoreId)
    logger.userAction('Store ID updated', { storeId: newStoreId })
  }

  const logout = async () => {
    try {
      logger.userAction('Logout initiated')

      // Call logout API
      await authService.logout()

      // Clear local state
      setUser(null)
      setTenant(null)
      setStore(null)
      setTenantIdState(null)
      setStoreIdState(null)
      setIsSuperadmin(false)

      logger.authEvent('Logout completed')
    } catch (error: any) {
      logger.error('Logout failed', { error: error.message })
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    tenant,
    store,
    tenantId,
    storeId,
    isSuperadmin,
    isLoading,
    login,
    logout,
    refreshUser,
    setTenantId,
    setStoreId,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}