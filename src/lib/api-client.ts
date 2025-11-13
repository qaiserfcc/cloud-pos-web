import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toastService } from '@/providers/toast-provider'
import { logger } from '@/utils/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

class ApiClient {
  private client: AxiosInstance
  private refreshPromise: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.log('🔍 API Request Interceptor triggered for:', config.url)

        // Add Authorization header if token exists
        const token = this.getAccessToken()
        console.log('🔑 Retrieved token from localStorage:', token ? 'present' : 'null/undefined')

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
          console.log('✅ Set Authorization header:', config.headers.Authorization)
        } else {
          console.log('❌ No token found, Authorization header not set')
        }

        // Add tenant and store headers if set
        const tenantId = this.getTenantId()
        const storeId = this.getStoreId()
        if (tenantId) {
          config.headers['X-Tenant-ID'] = tenantId
          console.log('🏢 Set X-Tenant-ID header:', tenantId)
        }
        if (storeId) {
          config.headers['X-Store-ID'] = storeId
          console.log('🏪 Set X-Store-ID header:', storeId)
        }

        logger.debug('API Request', {
          url: config.url,
          method: config.method,
          hasAuth: !!token,
          tenantId,
          storeId
        })

        return config
      },
      (error: any) => {
        console.error('❌ Request interceptor error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // Log all API errors
        logger.error('API Error', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        })

        // Handle 401 - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newToken = await this.refreshAccessToken()
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }
            return this.client(originalRequest)
          } catch (refreshError) {
            // Refresh failed - show error but don't redirect in development
            this.clearAuth()
            const errorMessage = 'Authentication expired. Please log in again.'
            toastService.error(errorMessage, refreshError)
            logger.error('Token refresh failed - authentication expired', { error: refreshError })
            // Note: Removed automatic redirect to login for development phase
            return Promise.reject(refreshError)
          }
        }

        // Show user-friendly error toast for non-401 errors
        if (error.response?.status !== 401) {
          const errorMessage = this.getErrorMessage(error)
          toastService.error(errorMessage, error)
        }

        return Promise.reject(error)
      }
    )
  }

  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data.data
        this.setAccessToken(accessToken)
        if (newRefreshToken) {
          this.setRefreshToken(newRefreshToken)
        }

        return accessToken
      } finally {
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  // Token management
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    const token = localStorage.getItem('accessToken')
    logger.debug('getAccessToken called', {
      tokenExists: !!token,
      tokenLength: token?.length,
      tokenPrefix: token?.substring(0, 20)
    })
    return token
  }

  private setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token)
    }
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    const token = localStorage.getItem('refreshToken')
    logger.debug('getRefreshToken called', {
      tokenExists: !!token,
      tokenLength: token?.length,
      tokenPrefix: token?.substring(0, 20)
    })
    return token
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', token)
    }
  }

  public getTenantId(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('tenantId')
  }

  public getStoreId(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('storeId')
  }

  public setAuth(accessToken: string, refreshToken: string): void {
    logger.debug('Setting auth tokens', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenLength: accessToken?.length,
      refreshTokenLength: refreshToken?.length
    })
    this.setAccessToken(accessToken)
    this.setRefreshToken(refreshToken)
  }

  public setTenantId(tenantId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tenantId', tenantId)
    }
  }

  public setStoreId(storeId: string | null): void {
    if (typeof window !== 'undefined') {
      if (storeId) {
        localStorage.setItem('storeId', storeId)
      } else {
        localStorage.removeItem('storeId')
      }
    }
  }

  public clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('tenantId')
      localStorage.removeItem('storeId')
      localStorage.removeItem('user')
    }
  }

  // HTTP methods
  public async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  public async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  public async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.response?.data) {
      const data = error.response.data as any
      if (data.message) return data.message
      if (data.error) return data.error
      if (typeof data === 'string') return data
    }
    
    if (error.message) return error.message
    
    return 'An unexpected error occurred'
  }
}

export const apiClient = new ApiClient()
