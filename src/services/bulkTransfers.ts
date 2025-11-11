import http from './httpClient'
import type { paths } from '../api-types/openapi'

type BulkTransferCreate = paths['/api/v1/bulk-transfers']['post']['requestBody']['content']['application/json']
type BulkTransferApprove = { notes?: string }
type BulkTransferCancel = { reason?: string }

export interface BulkTransfer {
  id: string
  sourceStoreId: string
  destinationStoreId: string
  title: string
  description?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  transferType: 'replenishment' | 'allocation' | 'return' | 'adjustment' | 'emergency'
  status: 'draft' | 'pending' | 'approved' | 'in_transit' | 'completed' | 'cancelled'
  scheduledShipDate?: string
  scheduledReceiveDate?: string
  items: Array<{
    productId: string
    quantity: number
    unitCost?: number
    notes?: string
  }>
  notes?: string
  reference?: string
  createdBy: string
  approvedBy?: string
  approvedAt?: string
  submittedAt?: string
  createdAt: string
  updatedAt: string
}

export interface BulkTransferFilters {
  status?: string[]
  sourceStoreId?: string
  destinationStoreId?: string
  transferType?: string[]
  priority?: string[]
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

// Create bulk transfer
export const createBulkTransfer = async (transfer: BulkTransferCreate) => {
  const response = await http.post('/api/v1/bulk-transfers', transfer)
  return response.data
}

// Get bulk transfers with filters
export const getBulkTransfers = async (filters?: BulkTransferFilters) => {
  const params = new URLSearchParams()

  if (filters?.status) {
    filters.status.forEach(status => params.append('status', status))
  }
  if (filters?.sourceStoreId) params.append('sourceStoreId', filters.sourceStoreId)
  if (filters?.destinationStoreId) params.append('destinationStoreId', filters.destinationStoreId)
  if (filters?.transferType) {
    filters.transferType.forEach(type => params.append('transferType', type))
  }
  if (filters?.priority) {
    filters.priority.forEach(priority => params.append('priority', priority))
  }
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)
  if (filters?.limit) params.append('limit', filters.limit.toString())
  if (filters?.offset) params.append('offset', filters.offset.toString())

  const response = await http.get(`/api/v1/bulk-transfers?${params.toString()}`)
  return response.data
}

// Submit bulk transfer for approval
export const submitBulkTransfer = async (id: string) => {
  const response = await http.post(`/api/v1/bulk-transfers/${id}/submit`)
  return response.data
}

// Approve bulk transfer and create individual transfers
export const approveBulkTransfer = async (id: string, approval?: BulkTransferApprove) => {
  const response = await http.post(`/api/v1/bulk-transfers/${id}/approve`, approval || {})
  return response.data
}

// Get bulk transfer by ID
export const getBulkTransfer = async (id: string) => {
  const response = await http.get(`/api/v1/bulk-transfers/${id}`)
  return response.data
}

// Cancel bulk transfer
export const cancelBulkTransfer = async (id: string, reason?: BulkTransferCancel) => {
  const response = await http.post(`/api/v1/bulk-transfers/${id}/cancel`, reason || {})
  return response.data
}

export default {
  createBulkTransfer,
  getBulkTransfers,
  submitBulkTransfer,
  approveBulkTransfer,
  getBulkTransfer,
  cancelBulkTransfer,
}