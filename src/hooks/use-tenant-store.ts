"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { tenantService } from '@/services/tenant.service'
import { Tenant, Store } from '@/types/api'
import { logger } from '@/utils/logger'

export function useTenantStoreSelection() {
  const { user, tenantId, storeId, setTenantId, setStoreId, isSuperadmin } = useAuth()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load tenants (only for superadmin)
  const loadTenants = async () => {
    if (!isSuperadmin) return

    try {
      setLoading(true)
      setError(null)

      logger.info('Loading tenants for selection')
      const tenantList = await tenantService.getTenants()
      setTenants(tenantList)

      logger.info('Tenants loaded successfully', { count: tenantList.length })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tenants'
      setError(errorMessage)
      logger.error('Failed to load tenants', { error: err })
    } finally {
      setLoading(false)
    }
  }

  // Load stores for current tenant
  const loadStores = async () => {
    if (!tenantId) return

    try {
      setLoading(true)
      setError(null)

      logger.info('Loading stores for tenant', { tenantId })
      const storeList = await tenantService.getStores()
      setStores(storeList)

      logger.info('Stores loaded successfully', { count: storeList.length })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load stores'
      setError(errorMessage)
      logger.error('Failed to load stores', { error: err, tenantId })
    } finally {
      setLoading(false)
    }
  }

  // Load data when component mounts or tenant changes
  useEffect(() => {
    if (isSuperadmin) {
      loadTenants()
    }
  }, [isSuperadmin])

  useEffect(() => {
    if (tenantId) {
      loadStores()
    } else {
      setStores([])
    }
  }, [tenantId])

  const selectTenant = (selectedTenantId: string) => {
    logger.info('Selecting tenant', { selectedTenantId })
    setTenantId(selectedTenantId)
    setStoreId(null) // Clear store selection when tenant changes
  }

  const selectStore = (selectedStoreId: string | null) => {
    logger.info('Selecting store', { selectedStoreId })
    setStoreId(selectedStoreId)
  }

  const refreshData = () => {
    if (isSuperadmin) {
      loadTenants()
    }
    if (tenantId) {
      loadStores()
    }
  }

  return {
    tenants,
    stores,
    selectedTenantId: tenantId,
    selectedStoreId: storeId,
    loading,
    error,
    selectTenant,
    selectStore,
    refreshData,
    isSuperadmin
  }
}