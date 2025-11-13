import { apiClient } from '@/lib/api-client'
import { logger } from '@/utils/logger'
import type { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  User 
} from '@/types/api'

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('🔐 Starting login process for:', credentials.email)

      const response = await apiClient.post<{
        success: boolean
        data: LoginResponse
        error?: string
      }>('/auth/login', credentials)

      console.log('📡 Login API response received:', {
        success: response.success,
        hasData: !!response.data,
        hasError: !!response.error
      })

      if (!response.success || !response.data) {
        console.error('❌ Login failed:', response.error)
        throw new Error(response.error || 'Login failed')
      }

      const loginData = response.data
      console.log('✅ Login successful, storing tokens...')

      // Store tokens using apiClient
      apiClient.setAuth(loginData.accessToken, loginData.refreshToken)
      console.log('💾 Tokens stored via apiClient.setAuth()')

      // Verify tokens were stored
      const storedAccessToken = localStorage.getItem('accessToken')
      const storedRefreshToken = localStorage.getItem('refreshToken')
      console.log('🔍 Verification - tokens in localStorage:', {
        accessToken: storedAccessToken ? 'present' : 'missing',
        refreshToken: storedRefreshToken ? 'present' : 'missing'
      })

      logger.authEvent('Login successful', { email: credentials.email, userId: loginData.user.id })

      return loginData
    } catch (error: any) {
      console.error('❌ Login error:', error.message)
      logger.error('Login failed', { email: credentials.email, error: error.message })
      throw error
    }
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    logger.apiCall('POST', '/auth/register')
    const startTime = Date.now()
    
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        '/auth/register',
        data
      )
      
      const duration = Date.now() - startTime
      
      if (response.success && response.data) {
        logger.apiCall('POST', '/auth/register', 201, duration)
        logger.authEvent('Registration successful', { 
          email: data.email, 
          tenantId: data.tenantId,
          roleId: data.roleId,
          duration,
    userId: response.data.user.id 
        })
        
        // Store tokens and user data
        apiClient.setAuth(response.data.accessToken, response.data.refreshToken)
        apiClient.setTenantId(response.data.user.tenantId)
        
        if (response.data.user.defaultStoreId) {
          apiClient.setStoreId(response.data.user.defaultStoreId)
        }
        
        // Store user in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        
        return response.data
      }
      
      logger.apiCall('POST', '/auth/register', 400, duration, response.error)
      throw new Error(response.error || 'Registration failed')
    } catch (error: any) {
      const duration = Date.now() - startTime
      logger.apiCall('POST', '/auth/register', 500, duration, error)
      logger.error('Registration API error', { 
        email: data.email, 
        roleId: data.roleId,
        error: error.message,
        duration 
      })
      throw error
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    logger.userAction('Logout initiated')
    
    try {
      const startTime = Date.now()
      await apiClient.post('/auth/logout')
      const duration = Date.now() - startTime
      
      logger.apiCall('POST', '/auth/logout', 200, duration)
      logger.authEvent('Logout successful', { duration })
    } catch (error: any) {
      logger.error('Logout API error', { error: error.message })
    } finally {
      apiClient.clearAuth()
      logger.info('Auth tokens cleared, redirecting to login')
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    
    try {
      const user = JSON.parse(userStr) as User
      logger.debug('Retrieved current user from storage', { userId: user.id })
      return user
    } catch (error) {
      logger.error('Failed to parse user from localStorage', { error })
      return null
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    
    const hasToken = !!localStorage.getItem('accessToken')
    logger.debug('Authentication check', { isAuthenticated: hasToken })
    
    return hasToken
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refreshToken') 
      : null
      
    if (!refreshToken) {
      logger.warn('Token refresh failed: No refresh token available')
      throw new Error('No refresh token available')
    }

    logger.apiCall('POST', '/auth/refresh')
    const startTime = Date.now()
    
    try {
      const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
        '/auth/refresh',
        { refreshToken }
      )
      
      const duration = Date.now() - startTime
      
      if (response.success && response.data) {
        logger.apiCall('POST', '/auth/refresh-token', 200, duration)
        logger.authEvent('Token refresh successful', { duration })
        
        apiClient.setAuth(
          response.data.accessToken, 
          response.data.refreshToken || refreshToken
        )
        return response.data.accessToken
      }
      
      logger.apiCall('POST', '/auth/refresh-token', 400, duration, response.error)
      throw new Error(response.error || 'Token refresh failed')
    } catch (error: any) {
      const duration = Date.now() - startTime
      logger.apiCall('POST', '/auth/refresh-token', 500, duration, error)
      logger.error('Token refresh failed', { error: error.message, duration })
      throw error
    }
  },

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<void> {
    logger.userAction('Forgot password requested', { email })
    logger.apiCall('POST', '/auth/forgot-password')
    const startTime = Date.now()
    
    try {
      const response = await apiClient.post<ApiResponse>(
        '/auth/forgot-password',
        { email }
      )
      
      const duration = Date.now() - startTime
      
      if (!response.success) {
        logger.apiCall('POST', '/auth/forgot-password', 400, duration, response.error)
        throw new Error(response.error || 'Failed to send reset email')
      }
      
      logger.apiCall('POST', '/auth/forgot-password', 200, duration)
      logger.info('Password reset email sent', { email, duration })
    } catch (error: any) {
      const duration = Date.now() - startTime
      logger.apiCall('POST', '/auth/forgot-password', 500, duration, error)
      logger.error('Forgot password failed', { email, error: error.message, duration })
      throw error
    }
  },

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    logger.userAction('Password reset initiated')
    logger.apiCall('POST', '/auth/reset-password')
    const startTime = Date.now()
    
    try {
      const response = await apiClient.post<ApiResponse>(
        '/auth/reset-password',
        { token, newPassword }
      )
      
      const duration = Date.now() - startTime
      
      if (!response.success) {
        logger.apiCall('POST', '/auth/reset-password', 400, duration, response.error)
        throw new Error(response.error || 'Failed to reset password')
      }
      
      logger.apiCall('POST', '/auth/reset-password', 200, duration)
      logger.authEvent('Password reset successful', { duration })
    } catch (error: any) {
      const duration = Date.now() - startTime
      logger.apiCall('POST', '/auth/reset-password', 500, duration, error)
      logger.error('Password reset failed', { error: error.message, duration })
      throw error
    }
  }
}
