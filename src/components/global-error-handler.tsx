"use client"

import { useEffect } from 'react'
import { toastService } from '@/providers/toast-provider'
import { logger } from '@/utils/logger'

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled errors
    const handleError = (event: ErrorEvent) => {
      logger.error('Unhandled Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      })

      toastService.error('An unexpected error occurred', event.error)
    }

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise,
      })

      toastService.error('An unexpected error occurred', event.reason)
    }

    // Add event listeners
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}