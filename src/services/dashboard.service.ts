"use client"

import { apiClient } from '@/lib/api-client'
import { DashboardWidget, SalesStats, ApiResponse } from '@/types/api'
import { logger } from '@/utils/logger'

export interface DashboardData {
  widgets: DashboardWidget[]
  salesStats: SalesStats
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    user?: string
  }>
}

class DashboardService {
  /**
   * Get dashboard widgets for the current user
   */
  async getWidgets(): Promise<DashboardWidget[]> {
    try {
      logger.info('Fetching dashboard widgets')

      const response = await apiClient.get<ApiResponse<DashboardWidget[]>>('/dashboard/widgets')

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch dashboard widgets')
      }

      logger.info('Dashboard widgets fetched successfully', {
        count: response.data?.length || 0
      })

      return response.data || []
    } catch (error) {
      logger.error('Failed to fetch dashboard widgets', { error })
      throw error
    }
  }

  /**
   * Get sales statistics for the current period
   */
  async getSalesStats(period: 'today' | 'week' | 'month' | 'year' = 'today'): Promise<SalesStats> {
    try {
      logger.info('Fetching sales statistics', { period })

      const response = await apiClient.get<ApiResponse<SalesStats>>('/reports/sales', {
        params: { period }
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch sales statistics')
      }

      logger.info('Sales statistics fetched successfully', {
        totalSales: response.data?.totalSales,
        totalRevenue: response.data?.totalRevenue
      })

      return response.data || {
        totalSales: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        topProducts: []
      }
    } catch (error) {
      logger.error('Failed to fetch sales statistics', { error, period })
      throw error
    }
  }

  /**
   * Get recent activity for the dashboard
   */
  async getRecentActivity(limit: number = 10): Promise<Array<{
    id: string
    type: string
    description: string
    timestamp: string
    user?: string
  }>> {
    try {
      logger.info('Fetching recent activity', { limit })

      const response = await apiClient.get<ApiResponse<Array<{
        id: string
        type: string
        description: string
        timestamp: string
        user?: string
      }>>>('/audit-logs', {
        params: { limit, sort: '-createdAt' }
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch recent activity')
      }

      logger.info('Recent activity fetched successfully', {
        count: response.data?.length || 0
      })

      return response.data || []
    } catch (error) {
      logger.error('Failed to fetch recent activity', { error, limit })
      throw error
    }
  }

  /**
   * Get comprehensive dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      logger.info('Fetching comprehensive dashboard data')

      const [widgets, salesStats, recentActivity] = await Promise.allSettled([
        this.getWidgets(),
        this.getSalesStats(),
        this.getRecentActivity()
      ])

      const dashboardData: DashboardData = {
        widgets: widgets.status === 'fulfilled' ? widgets.value : [],
        salesStats: salesStats.status === 'fulfilled' ? salesStats.value : {
          totalSales: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          topProducts: []
        },
        recentActivity: recentActivity.status === 'fulfilled' ? recentActivity.value : []
      }

      // Log any partial failures
      if (widgets.status === 'rejected') {
        logger.warn('Failed to fetch widgets for dashboard', { error: widgets.reason })
      }
      if (salesStats.status === 'rejected') {
        logger.warn('Failed to fetch sales stats for dashboard', { error: salesStats.reason })
      }
      if (recentActivity.status === 'rejected') {
        logger.warn('Failed to fetch recent activity for dashboard', { error: recentActivity.reason })
      }

      logger.info('Dashboard data fetched successfully', {
        widgetsCount: dashboardData.widgets.length,
        salesStats: dashboardData.salesStats.totalSales,
        activityCount: dashboardData.recentActivity.length
      })

      return dashboardData
    } catch (error) {
      logger.error('Failed to fetch dashboard data', { error })
      throw error
    }
  }
}

export const dashboardService = new DashboardService()