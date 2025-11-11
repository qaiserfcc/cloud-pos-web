import http from './httpClient'
import type { paths } from '../api-types/openapi'

type InventoryRegionCreate = paths['/api/v1/inventory-regions']['post']['requestBody']['content']['application/json']
type InventoryRegionUpdate = Partial<InventoryRegionCreate>
type AddStoresToRegion = paths['/api/v1/inventory-regions/{id}/stores']['post']['requestBody']['content']['application/json']
type RemoveStoresFromRegion = paths['/api/v1/inventory-regions/{id}/stores']['delete']['requestBody']['content']['application/json']

export interface InventoryRegion {
  id: string
  tenantId: string
  name: string
  description?: string
  regionCode: string
  location?: {
    country?: string
    state?: string
    city?: string
    postalCode?: string
    latitude?: number
    longitude?: number
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RegionalInventory {
  regionId: string
  regionName: string
  totalProducts: number
  totalValue: number
  lowStockItems: number
  products: Array<{
    productId: string
    productName: string
    totalQuantity: number
    totalValue: number
    stores: Array<{
      storeId: string
      storeName: string
      quantity: number
      lastUpdated: string
    }>
  }>
}

// Create inventory region
export const createInventoryRegion = async (region: InventoryRegionCreate) => {
  const response = await http.post('/api/v1/inventory-regions', region)
  return response.data
}

// Get all inventory regions for tenant
export const getInventoryRegions = async (params?: {
  includeStores?: boolean
  isActive?: boolean
}) => {
  const response = await http.get('/api/v1/inventory-regions', { params })
  return response.data
}

// Get inventory region by ID
export const getInventoryRegion = async (id: string, params?: {
  includeStores?: boolean
}) => {
  const response = await http.get(`/api/v1/inventory-regions/${id}`, { params })
  return response.data
}

// Update inventory region
export const updateInventoryRegion = async (id: string, region: InventoryRegionUpdate) => {
  const response = await http.put(`/api/v1/inventory-regions/${id}`, region)
  return response.data
}

// Delete inventory region
export const deleteInventoryRegion = async (id: string) => {
  const response = await http.delete(`/api/v1/inventory-regions/${id}`)
  return response.data
}

// Get regional inventory summary
export const getRegionalInventory = async (id: string, params?: {
  includeDetails?: boolean
  productId?: string
}) => {
  const response = await http.get(`/api/v1/inventory-regions/${id}/inventory`, { params })
  return response.data
}

// Add stores to inventory region
export const addStoresToRegion = async (id: string, stores: AddStoresToRegion) => {
  const response = await http.post(`/api/v1/inventory-regions/${id}/stores`, stores)
  return response.data
}

// Remove stores from inventory region
export const removeStoresFromRegion = async (id: string, stores: RemoveStoresFromRegion) => {
  const response = await http.delete(`/api/v1/inventory-regions/${id}/stores`, { data: stores })
  return response.data
}

// Get regions for a specific store
export const getStoreRegions = async (storeId: string) => {
  const response = await http.get(`/api/v1/stores/${storeId}/regions`)
  return response.data
}

export default {
  createInventoryRegion,
  getInventoryRegions,
  getInventoryRegion,
  updateInventoryRegion,
  deleteInventoryRegion,
  getRegionalInventory,
  addStoresToRegion,
  removeStoresFromRegion,
  getStoreRegions,
}