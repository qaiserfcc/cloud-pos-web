// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  details?: any[]
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  tenantId?: string
  roleId?: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface User {
  id: string
  tenantId: string
  defaultStoreId?: string | null
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  avatar?: string | null
  isActive: boolean
  lastLoginAt?: string | null
  createdAt: string
  updatedAt: string
  roles?: string[]
}

export interface UserWithRoles extends User {
  tenantName?: string
  defaultStoreName?: string | null
  roles?: string[]
  roleCount?: number
}

// Tenant Types
export interface Tenant {
  id: string
  name: string
  domain: string
  settings?: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

// Store Types
export interface Store {
  id: string
  tenantId: string
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  settings?: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Dashboard Widget Types
export interface DashboardWidget {
  id: string
  tenantId: string
  roleId?: string | null
  title: string
  type: string
  config: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Sales Stats Types
export interface SalesStats {
  totalSales: number
  totalRevenue: number
  averageOrderValue: number
  topProducts: Array<{
    productId: string
    productName: string
    quantity: number
    revenue: number
  }>
}

export interface ErrorResponse {
  success: false
  error: string
  details?: any[]
}
