import http from './httpClient'
import type { paths } from '../api-types/openapi'

type ApprovalRuleCreate = paths['/api/v1/approvals/rules']['post']['requestBody']['content']['application/json']
type ApprovalRuleUpdate = paths['/api/v1/approvals/rules/{ruleId}']['put']['requestBody']['content']['application/json']
type ApprovalRequestCreate = paths['/api/v1/approvals/requests']['post']['requestBody']['content']['application/json']
type ApprovalProcess = paths['/api/v1/approvals/requests/{requestId}/process']['post']['requestBody']['content']['application/json']
type ApprovalCancel = paths['/api/v1/approvals/requests/{requestId}/cancel']['post']['requestBody']['content']['application/json']
type CheckRequired = paths['/api/v1/approvals/check-required']['post']['requestBody']['content']['application/json']

export interface ApprovalRule {
  id: string
  name: string
  objectType: 'inventory_transfer' | 'sale' | 'purchase' | 'adjustment'
  conditions: Record<string, any>
  approvalLevels: any[]
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export interface ApprovalRequest {
  id: string
  objectType: 'inventory_transfer' | 'sale' | 'purchase' | 'adjustment'
  objectId: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  approvalData: Record<string, any>
  requestedBy: string
  approvedBy?: string
  approvedAt?: string
  comments?: string
  createdAt: string
  updatedAt: string
}

export interface ApprovalStatistics {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  averageApprovalTime: number
  approvalRate: number
}

// Approval Rules
export const createApprovalRule = async (rule: ApprovalRuleCreate) => {
  const response = await http.post('/api/v1/approvals/rules', rule)
  return response.data
}

export const getApprovalRules = async (params?: {
  objectType?: string
  isActive?: boolean
}) => {
  const response = await http.get('/api/v1/approvals/rules', { params })
  return response.data
}

export const updateApprovalRule = async (ruleId: string, rule: ApprovalRuleUpdate) => {
  const response = await http.put(`/api/v1/approvals/rules/${ruleId}`, rule)
  return response.data
}

export const deleteApprovalRule = async (ruleId: string) => {
  const response = await http.delete(`/api/v1/approvals/rules/${ruleId}`)
  return response.data
}

// Approval Requests
export const createApprovalRequest = async (request: ApprovalRequestCreate) => {
  const response = await http.post('/api/v1/approvals/requests', request)
  return response.data
}

export const getPendingApprovals = async () => {
  const response = await http.get('/api/v1/approvals/requests/pending')
  return response.data
}

export const getApprovalRequest = async (requestId: string) => {
  const response = await http.get(`/api/v1/approvals/requests/${requestId}`)
  return response.data
}

export const processApproval = async (requestId: string, decision: ApprovalProcess) => {
  const response = await http.post(`/api/v1/approvals/requests/${requestId}/process`, decision)
  return response.data
}

export const cancelApprovalRequest = async (requestId: string, reason: ApprovalCancel) => {
  const response = await http.post(`/api/v1/approvals/requests/${requestId}/cancel`, reason)
  return response.data
}

// Utilities
export const checkApprovalRequired = async (check: CheckRequired) => {
  const response = await http.post('/api/v1/approvals/check-required', check)
  return response.data
}

export const getApprovalStatistics = async (params?: {
  startDate?: string
  endDate?: string
}) => {
  const response = await http.get('/api/v1/approvals/statistics', { params })
  return response.data
}

export default {
  createApprovalRule,
  getApprovalRules,
  updateApprovalRule,
  deleteApprovalRule,
  createApprovalRequest,
  getPendingApprovals,
  getApprovalRequest,
  processApproval,
  cancelApprovalRequest,
  checkApprovalRequired,
  getApprovalStatistics,
}