import http from './httpClient'
import type { paths } from '../api-types/openapi'

type SaleCreate = paths['/sales']['post']['requestBody']['content']['application/json']
type SaleUpdate = paths['/sales/{id}']['put']['requestBody']['content']['application/json']
type PaymentCreate = paths['/sales/{id}/payment']['post']['requestBody']['content']['application/json']
type RefundCreate = paths['/sales/{id}/refund']['post']['requestBody']['content']['application/json']

export interface Sale {
  id: string
  storeId: string
  customerId?: string
  saleNumber: string
  status: 'pending' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded'
  items: Array<{
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    discount: number
    total: number
  }>
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  payments: Array<{
    id: string
    amount: number
    method: 'cash' | 'card' | 'bank_transfer' | 'digital_wallet' | 'other'
    reference?: string
    paidAt: string
  }>
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface SaleFilters {
  page?: number
  limit?: number
  status?: 'pending' | 'completed' | 'cancelled'
  paymentStatus?: 'pending' | 'partial' | 'paid' | 'refunded'
  startDate?: string
  endDate?: string
  customerId?: string
  search?: string
}

export interface SalesStatistics {
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  topSellingProducts: Array<{
    productId: string
    productName: string
    totalSold: number
    revenue: number
  }>
}

export interface TenantSalesStatistics {
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  topSellingProducts: Array<{
    productId: string
    productName: string
    totalSold: number
    revenue: number
  }>
}

export interface StoreComparison {
  storeId: string
  storeName: string
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  growthRate: number
}

export interface SalesTrends {
  dailyTrends: Array<{
    date: string
    totalSales: number
    totalOrders: number
  }>
  monthlyTrends: Array<{
    month: string
    year: number
    totalSales: number
    growthRate: number
  }>
}

export interface InventoryTurnover {
  overallTurnover: number
  byStore: Array<{
    storeId: string
    storeName: string
    turnoverRate: number
    avgDaysInInventory: number
  }>
  byCategory: Array<{
    categoryId: string
    categoryName: string
    turnoverRate: number
  }>
}

export interface ProfitabilityMetrics {
  overallProfitability: {
    totalRevenue: number
    totalCost: number
    netProfit: number
    profitMargin: number
  }
  byStore: Array<{
    storeId: string
    storeName: string
    revenue: number
    cost: number
    profit: number
    margin: number
    rank: number
  }>
}

// Sales CRUD
export const createSale = async (sale: SaleCreate) => {
  const response = await http.post('/sales', sale)
  return response.data
}

export const getSale = async (id: string) => {
  const response = await http.get(`/sales/${id}`)
  return response.data
}

export const updateSale = async (id: string, sale: SaleUpdate) => {
  const response = await http.put(`/sales/${id}`, sale)
  return response.data
}

export const deleteSale = async (id: string) => {
  const response = await http.delete(`/sales/${id}`)
  return response.data
}

// Store sales with pagination and filters
export const getStoreSales = async (filters?: SaleFilters) => {
  const params = new URLSearchParams()

  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())
  if (filters?.status) params.append('status', filters.status)
  if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)
  if (filters?.customerId) params.append('customerId', filters.customerId)
  if (filters?.search) params.append('search', filters.search)

  const response = await http.get(`/sales/store?${params.toString()}`)
  return response.data
}

// Payment operations
export const processPayment = async (id: string, payment: PaymentCreate) => {
  const response = await http.post(`/sales/${id}/payment`, payment)
  return response.data
}

export const completeSale = async (id: string) => {
  const response = await http.post(`/sales/${id}/complete`)
  return response.data
}

export const cancelSale = async (id: string) => {
  const response = await http.post(`/sales/${id}/cancel`)
  return response.data
}

export const processRefund = async (id: string, refund: RefundCreate) => {
  const response = await http.post(`/sales/${id}/refund`, refund)
  return response.data
}

// Statistics and analytics
export const getSalesStatistics = async (params?: {
  startDate?: string
  endDate?: string
}) => {
  const response = await http.get('/sales/stats', { params })
  return response.data
}

export const getTenantSalesStatistics = async (params?: {
  startDate?: string
  endDate?: string
}) => {
  const response = await http.get('/sales/tenant/stats', { params })
  return response.data
}

export const compareStoreSales = async (params?: {
  startDate?: string
  endDate?: string
}) => {
  const response = await http.get('/sales/tenant/compare', { params })
  return response.data
}

export const getSalesTrends = async (params?: {
  startDate?: string
  endDate?: string
}) => {
  const response = await http.get('/sales/tenant/trends', { params })
  return response.data
}

export const getInventoryTurnover = async (params?: {
  period?: 'monthly' | 'quarterly' | 'yearly'
}) => {
  const response = await http.get('/sales/tenant/inventory-turnover', { params })
  return response.data
}

export const getProfitabilityMetrics = async (params?: {
  startDate?: string
  endDate?: string
}) => {
  const response = await http.get('/sales/tenant/profitability', { params })
  return response.data
}

export default {
  createSale,
  getSale,
  updateSale,
  deleteSale,
  getStoreSales,
  processPayment,
  completeSale,
  cancelSale,
  processRefund,
  getSalesStatistics,
  getTenantSalesStatistics,
  compareStoreSales,
  getSalesTrends,
  getInventoryTurnover,
  getProfitabilityMetrics,
}