"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { apiClient } from '@/lib/api-client'
import { logger } from '@/utils/logger'
import { toastService } from '@/providers/toast-provider'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Building2, Store, Settings } from 'lucide-react'

interface Tenant {
  id: string
  name: string
  description?: string
}

interface StoreEntity {
  id: string
  name: string
  tenantId: string
  address?: string
  isActive: boolean
}

export function TenantStoreSelector() {
  const { user, tenantId, storeId, setTenantId, setStoreId, isSuperadmin } = useAuth()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [stores, setStores] = useState<StoreEntity[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Load tenants on component mount
  useEffect(() => {
    if (user && isSuperadmin) {
      loadTenants()
    }
  }, [user, isSuperadmin])

  // Load stores when tenant changes
  useEffect(() => {
    if (tenantId) {
      loadStores(tenantId)
    }
  }, [tenantId])

  const loadTenants = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<{ data: Tenant[] }>('/tenants')
      setTenants(response.data)
      logger.info('Tenants loaded successfully', { count: response.data.length })
    } catch (error) {
      logger.error('Failed to load tenants', { error })
      toastService.error('Failed to load tenants')
    } finally {
      setLoading(false)
    }
  }

  const loadStores = async (selectedTenantId: string) => {
    try {
      setLoading(true)
      // Temporarily set tenant header for this request
      const originalTenantId = apiClient.getTenantId()
      apiClient.setTenantId(selectedTenantId)

      const response = await apiClient.get<{ data: StoreEntity[] }>('/stores')
      setStores(response.data.filter(store => store.isActive))

      // Restore original tenant ID
      if (originalTenantId) {
        apiClient.setTenantId(originalTenantId)
      }

      logger.info('Stores loaded successfully', {
        tenantId: selectedTenantId,
        count: response.data.length
      })
    } catch (error) {
      logger.error('Failed to load stores', { tenantId: selectedTenantId, error })
      toastService.error('Failed to load stores')
    } finally {
      setLoading(false)
    }
  }

  const handleTenantChange = (newTenantId: string) => {
    setTenantId(newTenantId)
    setStoreId(null) // Reset store selection when tenant changes
    logger.userAction('Tenant changed', { tenantId: newTenantId })
  }

  const handleStoreChange = (newStoreId: string) => {
    setStoreId(newStoreId)
    logger.userAction('Store changed', { storeId: newStoreId })
  }

  const selectedTenant = tenants.find(t => t.id === tenantId)
  const selectedStore = stores.find(s => s.id === storeId)

  // Don't render if user is not authenticated or no tenant context
  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">
            {selectedTenant?.name || 'Select Tenant'}
            {selectedStore && ` / ${selectedStore.name}`}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tenant & Store Selection</DialogTitle>
          <DialogDescription>
            Choose your tenant and store context for this session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tenant Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Tenant
            </label>
            {isSuperadmin ? (
              <Select
                value={tenantId || ''}
                onValueChange={handleTenantChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                      {tenant.description && (
                        <span className="text-muted-foreground ml-2">
                          - {tenant.description}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                <Building2 className="h-4 w-4" />
                <span>{selectedTenant?.name || 'No tenant assigned'}</span>
              </div>
            )}
          </div>

          {/* Store Selection */}
          {tenantId && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Store className="h-4 w-4" />
                Store
              </label>
              <Select
                value={storeId || ''}
                onValueChange={handleStoreChange}
                disabled={loading || stores.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                      {store.address && (
                        <span className="text-muted-foreground ml-2">
                          - {store.address}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Current Context Display */}
          {tenantId && (
            <div className="p-3 bg-muted rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Current Context:</div>
              <div className="text-sm font-medium">
                Tenant: {selectedTenant?.name}
                {selectedStore && ` | Store: ${selectedStore.name}`}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}