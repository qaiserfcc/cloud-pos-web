"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { logger } from '@/utils/logger'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
  requireTenant?: boolean
  requireStore?: boolean
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredRole = [],
  requireTenant = false,
  requireStore = false,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, tenantId, storeId, isSuperadmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkAccess = () => {
      // Still loading auth state
      if (isLoading) {
        logger.debug('Auth state still loading, waiting...')
        return
      }

      // User not authenticated
      if (!user) {
        logger.warn('Unauthenticated user attempting to access protected route', {
          redirectTo,
          currentPath: window.location.pathname
        })
        router.push(redirectTo)
        return
      }

      // Check tenant requirement
      if (requireTenant && !tenantId) {
        logger.warn('User without tenant context attempting to access tenant-required route', {
          userId: user.id,
          redirectTo: '/dashboard' // Redirect to dashboard to select tenant
        })
        router.push('/dashboard')
        return
      }

      // Check store requirement
      if (requireStore && !storeId) {
        logger.warn('User without store context attempting to access store-required route', {
          userId: user.id,
          tenantId,
          redirectTo: '/dashboard' // Redirect to dashboard to select store
        })
        router.push('/dashboard')
        return
      }

      // Check role requirements (if not superadmin)
      if (!isSuperadmin && requiredRole.length > 0) {
        const userRoles = user.roles || []
        const hasRequiredRole = requiredRole.some(role => userRoles.includes(role))

        if (!hasRequiredRole) {
          logger.warn('User without required role attempting to access protected route', {
            userId: user.id,
            userRoles,
            requiredRoles: requiredRole,
            redirectTo: '/dashboard'
          })
          router.push('/dashboard')
          return
        }
      }

      logger.info('Access granted to protected route', {
        userId: user.id,
        tenantId,
        storeId,
        isSuperadmin,
        requiredRoles: requiredRole
      })
    }

    checkAccess()
  }, [user, tenantId, storeId, isSuperadmin, isLoading, requiredRole, requireTenant, requireStore, redirectTo, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // Don't render children if user is not authenticated or doesn't have access
  if (!user) {
    return null
  }

  // Check tenant requirement
  if (requireTenant && !tenantId) {
    return null
  }

  // Check store requirement
  if (requireStore && !storeId) {
    return null
  }

  // Check role requirements (if not superadmin)
  if (!isSuperadmin && requiredRole.length > 0) {
    const userRoles = user.roles || []
    const hasRequiredRole = requiredRole.some(role => userRoles.includes(role))
    if (!hasRequiredRole) {
      return null
    }
  }

  return <>{children}</>
}

// Higher-order component for protecting entire pages
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  const ProtectedComponent = (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  )

  ProtectedComponent.displayName = `withProtectedRoute(${Component.displayName || Component.name})`

  return ProtectedComponent
}