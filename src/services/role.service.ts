"use client"

import { apiClient } from '@/lib/api-client'
import { logger } from '@/utils/logger'

interface RoleRecord { id: string; name: string }

class RoleService {
  /**
   * Fetch available roles from backend.
   * Returns array of roles with id and name
   */
  async getRoles(): Promise<RoleRecord[]> {
    try {
      logger.info('Fetching roles from API')
      const response = await apiClient.get<any>('/roles')

      // API may return ApiResponse wrapper or raw array
      const payload = response?.data ?? response

      const normalize = (r: any): RoleRecord => {
        if (!r) return { id: '', name: '' }
        if (typeof r === 'string') return { id: r, name: r }
        return { id: r.id ?? r._id ?? r.roleId ?? r.value ?? r.name, name: r.name ?? r.title ?? r.displayName ?? String(r) }
      }

      if (Array.isArray(payload)) {
        return payload.map(normalize)
      }

      if (Array.isArray(response?.roles)) {
        return response.roles.map(normalize)
      }

      if (Array.isArray(response?.data)) {
        return response.data.map(normalize)
      }

      logger.warn('Roles response unexpected shape', { response })
      return []
    } catch (error) {
      logger.error('Failed to fetch roles', { error })
      throw error
    }
  }
}

export const roleService = new RoleService()
