import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Button } from './button'

interface ErrorDetails {
  message: string
  code?: string
  stack?: string
  timestamp: string
  userAgent?: string
  url?: string
}

interface ErrorDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  errorDetails: ErrorDetails
}

export function ErrorDetailsModal({ isOpen, onClose, errorDetails }: ErrorDetailsModalProps) {
  const handleCopy = async () => {
    const text = formatErrorDetails(errorDetails)
    try {
      await navigator.clipboard.writeText(text)
      // Could show a success toast here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Error Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Message</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
              {errorDetails.message}
            </p>
          </div>

          {errorDetails.code && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Error Code</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-md font-mono">
                {errorDetails.code}
              </p>
            </div>
          )}

          {errorDetails.stack && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Stack Trace</h3>
              <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-md overflow-x-auto max-h-32">
                {errorDetails.stack}
              </pre>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Timestamp</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
              {new Date(errorDetails.timestamp).toLocaleString()}
            </p>
          </div>

          {errorDetails.url && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">URL</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-md break-all">
                {errorDetails.url}
              </p>
            </div>
          )}

          {errorDetails.userAgent && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">User Agent</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-md break-all">
                {errorDetails.userAgent}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={handleCopy}>
            Copy Details
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function formatErrorDetails(details: ErrorDetails): string {
  return `Error Details:
Message: ${details.message}
Code: ${details.code || 'N/A'}
Timestamp: ${new Date(details.timestamp).toLocaleString()}
URL: ${details.url || 'N/A'}
User Agent: ${details.userAgent || 'N/A'}

Stack Trace:
${details.stack || 'No stack trace available'}`
}