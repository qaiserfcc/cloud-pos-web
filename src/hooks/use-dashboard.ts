"use client"

import { useState, useEffect } from 'react'
import { dashboardService, DashboardData } from '@/services/dashboard.service'
import { logger } from '@/utils/logger'

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      logger.info('Fetching dashboard data via hook')
      const dashboardData = await dashboardService.getDashboardData()
      setData(dashboardData)

      logger.info('Dashboard data loaded successfully')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data'
      setError(errorMessage)
      logger.error('Failed to load dashboard data in hook', { error: err })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const refetch = () => {
    fetchDashboardData()
  }

  return {
    data,
    loading,
    error,
    refetch
  }
}