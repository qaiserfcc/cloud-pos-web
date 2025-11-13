"use client"

import { apiClient } from '@/lib/api-client'
import { Tenant, Store, ApiResponse } from '@/types/api'
import { logger } from '@/utils/logger'

class TenantService {
  /**
   * Get all tenants (superadmin only)
   */
  async getTenants(): Promise<Tenant[]> {
    try {
      logger.info('Fetching tenants')

      const response = await apiClient.get<ApiResponse<Tenant[]>>('/tenants')

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch tenants')
      }

      logger.info('Tenants fetched successfully', {
        count: response.data?.length || 0
      })

      return response.data || []
    } catch (error) {
      logger.error('Failed to fetch tenants', { error })
      throw error
    }
  }

  /**
   * Get a specific tenant by ID
   */
  async getTenant(tenantId: string): Promise<Tenant> {
    try {
      logger.info('Fetching tenant', { tenantId })

      const response = await apiClient.get<ApiResponse<Tenant>>(`/tenants/${tenantId}`)

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch tenant')
      }

      logger.info('Tenant fetched successfully', {
        tenantId,
        tenantName: response.data?.name
      })

      return response.data!
    } catch (error) {
      logger.error('Failed to fetch tenant', { error, tenantId })
      throw error
    }
  }

  /**
   * Get stores for the current tenant
   */
  async getStores(): Promise<Store[]> {
    try {
      logger.info('Fetching stores for current tenant')

      const response = await apiClient.get<ApiResponse<Store[]>>('/stores')

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch stores')
      }

      logger.info('Stores fetched successfully', {
        count: response.data?.length || 0
      })

      return response.data || []
    } catch (error) {
      logger.error('Failed to fetch stores', { error })
      throw error
    }
  }

  /**
   * Get a specific store by ID
   */
  async getStore(storeId: string): Promise<Store> {
    try {
      logger.info('Fetching store', { storeId })

      const response = await apiClient.get<ApiResponse<Store>>(`/stores/${storeId}`)

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch store')
      }

      logger.info('Store fetched successfully', {
        storeId,
        storeName: response.data?.name
      })

      return response.data!
    } catch (error) {
      logger.error('Failed to fetch store', { error, storeId })
      throw error
    }
  }

  /**
   * Create a new tenant (superadmin only)
   */
  async createTenant(tenantData: {
    name: string
    domain: string
    settings?: Record<string, any>
  }): Promise<Tenant> {
    try {
      logger.info('Creating new tenant', { name: tenantData.name })

      const response = await apiClient.post<ApiResponse<Tenant>>('/tenants', tenantData)

      if (!response.success) {
        throw new Error(response.error || 'Failed to create tenant')
      }

      logger.info('Tenant created successfully', {
        tenantId: response.data?.id,
        tenantName: response.data?.name
      })

      return response.data!
    } catch (error) {
      logger.error('Failed to create tenant', { error, tenantData })
      throw error
    }
  }

  /**
   * Create a new store
   */
  async createStore(storeData: {
    name: string
    code: string
    address?: string
    phone?: string
    email?: string
    settings?: Record<string, any>
  }): Promise<Store> {
    try {
      logger.info('Creating new store', { name: storeData.name })

      const response = await apiClient.post<ApiResponse<Store>>('/stores', storeData)

      if (!response.success) {
        throw new Error(response.error || 'Failed to create store')
      }

      logger.info('Store created successfully', {
        storeId: response.data?.id,
        storeName: response.data?.name
      })

      return response.data!
    } catch (error) {
      logger.error('Failed to create store', { error, storeData })
      throw error
    }
  }

  /**
   * Update tenant settings
   */
  async updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant> {
    try {
      logger.info('Updating tenant', { tenantId })

      const response = await apiClient.put<ApiResponse<Tenant>>(`/tenants/${tenantId}`, updates)

      if (!response.success) {
        throw new Error(response.error || 'Failed to update tenant')
      }

      logger.info('Tenant updated successfully', { tenantId })

      return response.data!
    } catch (error) {
      logger.error('Failed to update tenant', { error, tenantId })
      throw error
    }
  }

  /**
   * Update store settings
   */
  async updateStore(storeId: string, updates: Partial<Store>): Promise<Store> {
    try {
      logger.info('Updating store', { storeId })

      const response = await apiClient.put<ApiResponse<Store>>(`/stores/${storeId}`, updates)

      if (!response.success) {
        throw new Error(response.error || 'Failed to update store')
      }

      logger.info('Store updated successfully', { storeId })

      return response.data!
    } catch (error) {
      logger.error('Failed to update store', { error, storeId })
      throw error
    }
  }
}

export const tenantService = new TenantService()